import { auth, currentUser } from "@clerk/nextjs/server";
import PlanSelector from "./PlanSelector";
import ProfileHeader from "./ProfileHeader";

type PlanDoc = {
    _id: string;
    name: string;
    isActive: boolean;
  _creationTime: number;
    workoutPlan: { schedule: string[]; exercises: { day: string; routines: { name: string; sets: number; reps: number }[] }[] };
    dietPlan: { dailyCalories: number; meals: { name: string; foods: string[] }[] };
};

export default async function Profile() {
  const { userId } = await auth();
  const user = await currentUser();
    const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
    let plans: PlanDoc[] = [];
    if (userId && convexUrl) {
    const res = await fetch(`${convexUrl}/http/plans/list?clerkId=${encodeURIComponent(userId)}`);
    if (res.ok) {
        plans = await res.json();
    }
    }

    return (
    <div className="container mx-auto px-4 py-24">
      <ProfileHeader user={user} />
        <h1 className="text-3xl font-bold mb-8">My Plans</h1>
        {!userId && <p className="text-muted-foreground">Sign in to view your plans.</p>}
        {userId && plans.length === 0 && <p className="text-muted-foreground">No plans yet.</p>}
        {userId && plans.length > 0 && (
          <div className="mb-8">
            <PlanSelector plans={plans} />
          </div>
        )}
    </div>
    );
}