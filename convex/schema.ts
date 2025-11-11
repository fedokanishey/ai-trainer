import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema( {
    users: defineTable( {
        name: v.string(),
        email: v.string(),
        clerkId: v.string(),
        image: v.optional(v.string()),
    } ).index( "by_clerk_id", [ "clerkId" ] ),
    
    plans: defineTable( {
        userId: v.id( "users" ),
        name: v.string(),
        workoutPlans: v.object( {
            schedule: v.array( v.string() ),
            exercises: v.array( v.object( {
                day: v.string(),
                routines: v.array( v.object( {
                    name: v.string(),
                    sets: v.number(),
                    reps: v.number(),
                    duration: v.optional( v.string() ),
                    discription: v.optional( v.string() ),
                    exercies: v.optional(v.array( v.string()))
                }))
                } ) )
        } ),
        dietPlane: v.object( {
            dailyCaoliries: v.number(),
            meals: v.array( v.object( {
                name: v.string(),
                discription: v.string(),
                
            } ) )
        } ),isActive: v.boolean()
    } ).index( "by_user_id", [ "userId" ] ).index( "by_active", [ "isActive" ] )
})