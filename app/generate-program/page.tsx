import React from 'react'
import { generateFitnessPlan, generateMealsPlan } from "./ai"

interface PageProps {
  searchParams: Promise<Record<string, string>>;
}

export default async function Program({ searchParams }: PageProps) {
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

  let fitnessPlan = null;
  let mealsPlan = null;
  let error = null;

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

    fitnessPlan = fitnessResult;
    mealsPlan = mealsResult;
  } catch (err) {
    error = err instanceof Error ? err.message : 'Failed to generate plans';
    console.error('Error generating plans:', err);
  }

  return (
    <div className="min-h-screen bg-background text-foreground pt-24 pb-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl md:text-5xl font-bold mb-8">Your Personalized Plans</h1>
        
        {error && (
          <div className="bg-red-900/30 border border-red-700 rounded-lg p-4 mb-8">
            <p className="text-red-200">Error generating plans: {error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Fitness Plan */}
          <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
            <h2 className="text-2xl font-bold mb-4 text-primary">Fitness Plan</h2>
            {fitnessPlan ? (
              <div className="space-y-4">
                <pre className="bg-gray-950 rounded p-4 overflow-auto text-sm text-gray-300 max-h-96">
                  {JSON.stringify(fitnessPlan, null, 2)}
                </pre>
              </div>
            ) : (
              <p className="text-gray-400">Loading fitness plan...</p>
            )}
          </div>

          {/* Meals Plan */}
          <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
            <h2 className="text-2xl font-bold mb-4 text-primary">Nutrition Plan</h2>
            {mealsPlan ? (
              <div className="space-y-4">
                <pre className="bg-gray-950 rounded p-4 overflow-auto text-sm text-gray-300 max-h-96">
                  {JSON.stringify(mealsPlan, null, 2)}
                </pre>
              </div>
            ) : (
              <p className="text-gray-400">Loading nutrition plan...</p>
            )}
          </div>
        </div>

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
