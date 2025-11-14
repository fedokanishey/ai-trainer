import React from 'react'
import { generateFitnessPlan, generateMealsPlan } from "./ai"
import { auth } from '@clerk/nextjs/server'
// Using Convex HTTP actions for server-side calls
import PlanPreview from './PlanPreview'

export const dynamic = 'force-dynamic'
export const revalidate = 0

interface PageProps {
  searchParams: Promise<Record<string, string>>;
}

export default async function Program({ searchParams }: PageProps) {
  const authData = await auth();
  const userId = authData?.userId || null;
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  const params = await searchParams;
  
  // Extract query parameters with defaults
  const age = params.age || '30';
  const height = params.height || '170';
  const weight = params.weight || '60';
  const injuries = params.injuries || '';
  const workout_days = params.workout_days || '4';
  const fitness_goal = params.fitness_goal || 'Weight Loss';
  const fitness_level = params.fitness_level || 'Intermediate';
  const dietary_restrictions = params.dietary_restrictions || '';

  type WorkoutPlan = { schedule: string[]; exercises: { day: string; routines: { name: string; sets: number; reps: number; }[] }[] } | null;
  type DietPlan = { dailyCalories: number; meals: { name: string; foods: string[] }[] } | null;
  let fitnessPlan: WorkoutPlan = null;
  let mealsPlan: DietPlan = null;
  let error: string | null = null;
  let planId: string | null = null;
  let saveError: string | null = null;

  try {
    // Generate both plans in parallel
    const [fitnessResult, mealsResult] = await Promise.all([
      generateFitnessPlan({
        age,
        height,
        weight,
        injuries,
        workout_days,
        fitness_goal,
        fitness_level
      }),
      generateMealsPlan({
        age,
        height,
        weight,
        dietary_restrictions,
        fitness_goal
      })
    ]);

    // Guard against fallback string error message from ai.js
    fitnessPlan = typeof fitnessResult === 'string' ? null : fitnessResult;
    mealsPlan = typeof mealsResult === 'string' ? null : mealsResult;

    // Save to Convex via HTTP actions if authenticated and URL available
    if (userId && convexUrl) {
      try {
        if (fitnessPlan && mealsPlan) {
          // Translate Clerk userId -> Convex user _id via HTTP action
          const resUser = await fetch(`${convexUrl}/http/users/get-by-clerk-id?clerkId=${encodeURIComponent(userId)}`);
          if (!resUser.ok) throw new Error('Failed to lookup Convex user');
          const user = await resUser.json();
          const convexUserId = user?._id as string | undefined;
          if (!convexUserId) {
            throw new Error('Convex user not found for this account');
          }

          const resCreate = await fetch(`${convexUrl}/http/plans/create`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId: convexUserId,
              name: `${fitness_goal} Plan - ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'numeric', day: 'numeric' })}`,
              workoutPlan: fitnessPlan,
              dietPlan: mealsPlan,
              isActive: true,
            }),
          });
          if (!resCreate.ok) throw new Error('Failed to create plan');
          const created = await resCreate.json();
          planId = created?.id ?? null;
        }
      } catch (e) {
        const err = e as Error;
        console.error('Error saving plan:', err);
        saveError = err.message || 'Failed saving plan.';
      }
    }
  } catch (err) {
    error = err instanceof Error ? err.message : 'Failed to generate plans';
    console.error('Error generating plans:', err);
  }

  return (
    <div className="min-h-screen bg-background text-foreground pt-24 pb-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl md:text-5xl font-bold mb-8">Your Personalized Plans</h1>
        
        {!userId && (
          <div className="bg-yellow-900/30 border border-yellow-700 rounded-lg p-4 mb-8">
            <p className="text-yellow-200">Sign in to save your plan.</p>
          </div>
        )}


        {saveError && (
          <div className="bg-orange-900/30 border border-orange-700 rounded-lg p-4 mb-8">
            <p className="text-orange-200">Could not save plan: {saveError}</p>
          </div>
        )}

        {error && (
          <div className="bg-red-900/30 border border-red-700 rounded-lg p-4 mb-8">
            <p className="text-red-200">Error generating plans: {error}</p>
          </div>
        )}

        {fitnessPlan && mealsPlan ? (
          <PlanPreview
            name={`${fitness_goal} Plan - ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'numeric', day: 'numeric' })}`}
            workoutPlan={fitnessPlan}
            dietPlan={mealsPlan}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
              <h2 className="text-2xl font-bold mb-4 text-primary">Fitness Plan</h2>
              <p className="text-gray-400">Loading fitness plan...</p>
            </div>
            <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
              <h2 className="text-2xl font-bold mb-4 text-primary">Nutrition Plan</h2>
              <p className="text-gray-400">Loading nutrition plan...</p>
            </div>
          </div>
        )}

        {/* User Info Summary */}
        <div className="mt-8 bg-gray-900 rounded-lg border border-gray-800 p-6">
          <h2 className="text-2xl font-bold mb-4">Your Information</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-gray-400">Age</p>
              <p className="text-lg font-semibold">{age}</p>
            </div>
            <div>
              <p className="text-gray-400">Height</p>
              <p className="text-lg font-semibold">{height} cm</p>
            </div>
            <div>
              <p className="text-gray-400">Weight</p>
              <p className="text-lg font-semibold">{weight} kg</p>
            </div>
            <div>
              <p className="text-gray-400">Fitness Goal</p>
              <p className="text-lg font-semibold">{fitness_goal}</p>
            </div>
            <div>
              <p className="text-gray-400">Fitness Level</p>
              <p className="text-lg font-semibold">{fitness_level}</p>
            </div>
            <div>
              <p className="text-gray-400">Workout Days</p>
              <p className="text-lg font-semibold">{workout_days}</p>
            </div>
            {injuries && (
              <div>
                <p className="text-gray-400">Injuries</p>
                <p className="text-lg font-semibold">{injuries}</p>
              </div>
            )}
            {dietary_restrictions && (
              <div>
                <p className="text-gray-400">Dietary Restrictions</p>
                <p className="text-lg font-semibold">{dietary_restrictions}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
