import { httpRouter } from "convex/server";
import { Webhook } from "svix";
import { WebhookEvent } from "@clerk/nextjs/server";
import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";


const http = httpRouter();

// Public HTTP: Get Convex user by Clerk ID
http.route({
  path: "/users/get-by-clerk-id",
  method: "GET",
  handler: httpAction(async (ctx, req) => {
    const url = new URL(req.url);
    const clerkId = url.searchParams.get("clerkId");
    if (!clerkId) {
      return new Response(JSON.stringify({ error: "Missing clerkId" }), { status: 400 });
    }
    const user = await ctx.runQuery(api.users.getByClerkId, { clerkId });
    return new Response(JSON.stringify(user ?? null), { status: 200, headers: { "Content-Type": "application/json" } });
  }),
});

// Public HTTP: Create a plan
http.route({
  path: "/plans/create",
  method: "POST",
  handler: httpAction(async (ctx, req) => {
    try {
      const body = await req.json();
      const { userId, name, workoutPlan, dietPlan, isActive } = body ?? {};
      if (!userId || !name || !workoutPlan || !dietPlan || typeof isActive !== "boolean") {
        return new Response(JSON.stringify({ error: "Invalid payload" }), { status: 400 });
      }
      const id = await ctx.runMutation(api.plans.createPlan, {
        userId,
        name,
        workoutPlan,
        dietPlan,
        isActive,
      });
      return new Response(JSON.stringify({ id }), { status: 200, headers: { "Content-Type": "application/json" } });
    } catch (e) {
      return new Response(JSON.stringify({ error: "Failed to create plan" }), { status: 500 });
    }
  }),
});

// Public HTTP: List plans for a Clerk user
http.route({
  path: "/plans/list",
  method: "GET",
  handler: httpAction(async (ctx, req) => {
    const url = new URL(req.url);
    const clerkId = url.searchParams.get("clerkId");
    if (!clerkId) {
      return new Response(JSON.stringify({ error: "Missing clerkId" }), { status: 400 });
    }
    const convexUser = await ctx.runQuery(api.users.getByClerkId, { clerkId });
    if (!convexUser?._id) {
      return new Response(JSON.stringify([]), { status: 200, headers: { "Content-Type": "application/json" } });
    }
    const plans = await ctx.runQuery(api.plans.getUserPlans, { userId: convexUser._id });
    return new Response(JSON.stringify(plans), { status: 200, headers: { "Content-Type": "application/json" } });
  }),
});

// Public HTTP: Run migration for legacy userId strings -> users._id
http.route({
  path: "/plans/migrate-user-ids",
  method: "POST",
  handler: httpAction(async (ctx) => {
    const result = await ctx.runMutation(api.plans.migrateLegacyUserIds, {});
    return new Response(JSON.stringify(result), { status: 200, headers: { "Content-Type": "application/json" } });
  }),
});

http.route({
    path: "/clerk-webhook",
    method: "POST",
    handler: httpAction(async (ctx, req) => {
    const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
    if (!webhookSecret) throw new Error("Missing Clerk Webhook Secret");

    const svixId = req.headers.get("svix-id");
    const svixTimestamp = req.headers.get("svix-timestamp");
    const svixSignature = req.headers.get("svix-signature");

    if (!svixId || !svixTimestamp || !svixSignature) {
        return new Response("Missing svix headers", { status: 400 });
    }

    const payload = await req.json();
    const body = JSON.stringify(payload);
    const wh = new Webhook(webhookSecret);

    let evt: WebhookEvent;
    try {
        evt = wh.verify(body, {
            "svix-id": svixId,
            "svix-timestamp": svixTimestamp,
            "svix-signature": svixSignature,
    }) as WebhookEvent;
    } catch (err) {
        console.error("Error verifying webhook:", err);
        return new Response("Invalid webhook signature", { status: 400 });
    }

    if (evt.type === "user.created") {
        const { id, email_addresses, image_url, first_name, last_name } = evt.data;
        const email = email_addresses[0].email_address;
        const name = `${first_name || ""} ${last_name || ""}`.trim();

        try {
        await ctx.runMutation(api.users.syncUser, {
            email,
            name,
            image: image_url,
            clerkId: id,
        });
        } catch (error) {
        console.log("Error creating user:", error);
        return new Response("Error creating user", { status: 500 });
        }
      }

    if (evt.type === "user.updated") {
        const { id, email_addresses, image_url, first_name, last_name } = evt.data;
        const email = email_addresses[0].email_address;
        const name = `${first_name || ""} ${last_name || ""}`.trim();

    try {
      await ctx.runMutation(api.users.updateUser, {
        clerkId: id,
        email,
        name,
        image: image_url,
      });
    } catch (error) {
      console.log("Error updating user:", error);
      return new Response("Error updating user", { status: 500 });
    }
      }
    
      

    return new Response("Webhook processed", { status: 200 });
}),
});

export default http;