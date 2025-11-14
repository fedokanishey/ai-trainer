import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createPlan = mutation({
  args: {
    userId: v.id("users"),
    name: v.string(),
    workoutPlan: v.object({
      schedule: v.array(v.string()),
      exercises: v.array(
        v.object({
          day: v.string(),
          routines: v.array(
            v.object({
              name: v.string(),
              sets: v.number(),
              reps: v.number(),
            })
          ),
        })
      ),
    }),
    dietPlan: v.object({
      dailyCalories: v.number(),
      meals: v.array(
        v.object({
          name: v.string(),
          foods: v.array(v.string()),
        })
      ),
    }),
    isActive: v.boolean(),
  },
  handler: async (ctx, args) => {
    const activePlans = await ctx.db
      .query("plans")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();

    for (const plan of activePlans) {
      await ctx.db.patch(plan._id, { isActive: false });
    }

    const planId = await ctx.db.insert("plans", args);

    return planId;
  },
});

export const getUserPlans = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const plans = await ctx.db
      .query("plans")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();

    return plans;
  },
});

// Migration: convert legacy string clerkId stored in userId field to proper users _id
// Safe to run multiple times; will only patch documents where userId was a Clerk string.
export const migrateLegacyUserIds = mutation({
  args: {},
  handler: async (ctx) => {
    const allPlans = await ctx.db.query("plans").collect();
    let updated = 0;
    for (const plan of allPlans) {
      // Access userId loosely because legacy documents may have stored a Clerk string
      const current: unknown = (plan as unknown as { userId: unknown }).userId;
      // If it's already an Id object Convex returns (type object), skip.
      if (typeof current !== "string") continue;
      // current holds a Clerk userId string; find matching user by clerkId index.
      const user = await ctx.db
        .query("users")
        .withIndex("by_clerk_id", (q) => q.eq("clerkId", current))
        .first();
      if (!user) continue;
      await ctx.db.patch(plan._id, { userId: user._id });
      updated++;
    }
    return { updated };
  },
});