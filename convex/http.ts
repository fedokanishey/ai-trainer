import { httpRouter } from "convex/server";
import { Webhook } from "svix";
import { WebhookEvent } from "@clerk/nextjs/server";
import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";


const http = httpRouter();

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

    return new Response("Webhook processed", { status: 200 });
}),
});

export default http;