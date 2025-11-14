"use client";

import * as React from "react";
import { DumbbellIcon, AppleIcon, CalendarIcon } from "lucide-react";

export type PlanDoc = {
  _id: string;
  name: string;
  isActive: boolean;
  _creationTime: number;
  workoutPlan: {
    schedule: string[];
    exercises: { day: string; routines: { name: string; sets: number; reps: number; description?: string }[] }[];
  };
  dietPlan: { dailyCalories: number; meals: { name: string; foods: string[] }[] };
};

export default function PlanSelector({ plans }: { plans: PlanDoc[] }) {
  const initial = React.useMemo(() => plans.find(p => p.isActive)?._id ?? plans[0]._id, [plans]);
  const [selectedId, setSelectedId] = React.useState<string>(initial);
  const [tab, setTab] = React.useState<"workout" | "diet">("workout");
  const selected = React.useMemo(() => plans.find(p => p._id === selectedId) ?? plans[0], [plans, selectedId]);

  const formatDate = (ts: number) => new Date(ts).toLocaleDateString("en-US", { year: "numeric", month: "numeric", day: "numeric" });
  const baseName = (name: string) => {
    const idx = name.lastIndexOf(" - ");
    return idx > -1 ? name.slice(0, idx) : name;
  };

  return (
    <div className="space-y-8">
      {/* Selector bar */}
      <div className="relative backdrop-blur-sm border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold tracking-tight">
            <span className="text-primary">Your</span>{" "}
            <span className="text-foreground">Fitness Plans</span>
          </h2>
          <div className="font-mono text-xs text-muted-foreground">TOTAL: {plans.length}</div>
        </div>
        <div className="flex flex-wrap gap-2">
          {plans.map((plan) => (
            <button
              key={plan._id}
              onClick={() => { setSelectedId(plan._id); setTab("workout"); }}
              className={`text-foreground border rounded px-3 py-1 text-sm transition-colors ${
                selectedId === plan._id
                  ? "bg-primary/20 text-primary border-primary"
                  : "bg-transparent border-border hover:border-primary/50"
              }`}
            >
              {baseName(plan.name)} - {formatDate(plan._creationTime)}
              {plan.isActive && (
                <span className="ml-2 bg-green-500/20 text-green-400 text-[10px] px-2 py-0.5 rounded uppercase">ACTIVE</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Plan details */}
      <div className="relative backdrop-blur-sm border border-border rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <h3 className="text-lg font-bold">
            PLAN: <span className="text-primary">{baseName(selected.name)} - {formatDate(selected._creationTime)}</span>
          </h3>
          {selected.isActive && (
            <span className="ml-2 bg-green-500/20 text-green-400 text-[10px] px-2 py-0.5 rounded uppercase">ACTIVE</span>
          )}
        </div>

        {/* Tabs */}
        <div className="mb-6 w-full grid grid-cols-2 bg-cyber-terminal-bg border rounded overflow-hidden">
          <button
            className={`px-4 py-2 text-sm flex items-center justify-center gap-2 ${tab === "workout" ? "bg-primary/20 text-primary" : "bg-transparent"}`}
            onClick={() => setTab("workout")}
          >
            <DumbbellIcon className="size-4" /> Workout Plan
          </button>
          <button
            className={`px-4 py-2 text-sm flex items-center justify-center gap-2 ${tab === "diet" ? "bg-primary/20 text-primary" : "bg-transparent"}`}
            onClick={() => setTab("diet")}
          >
            <AppleIcon className="size-4" /> Diet Plan
          </button>
        </div>

        {tab === "workout" ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <CalendarIcon className="h-4 w-4 text-primary" />
              <span className="font-mono text-sm text-muted-foreground">
                SCHEDULE: {selected.workoutPlan.schedule.join(", ")}
              </span>
            </div>
            <div className="space-y-3">
              {selected.workoutPlan.exercises.map((exerciseDay, idx) => (
                <details key={idx} className="border rounded-lg overflow-hidden">
                  <summary className="px-4 py-3 cursor-pointer hover:no-underline hover:bg-primary/10 font-mono flex justify-between items-center">
                    <span className="text-primary">{exerciseDay.day}</span>
                    <span className="text-xs text-muted-foreground">{exerciseDay.routines.length} EXERCISES</span>
                  </summary>
                  <div className="p-4 space-y-3">
                    {exerciseDay.routines.map((routine, rIdx) => (
                      <div key={rIdx} className="border border-border rounded p-3 bg-background/50">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-foreground">{routine.name}</h4>
                          <div className="flex items-center gap-2">
                            <div className="px-2 py-1 rounded bg-primary/20 text-primary text-xs font-mono">{routine.sets} SETS</div>
                            <div className="px-2 py-1 rounded bg-secondary/20 text-secondary text-xs font-mono">{routine.reps} REPS</div>
                          </div>
                        </div>
                        {routine.description && (
                          <p className="text-sm text-muted-foreground mt-1">{routine.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </details>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-2">
              <span className="font-mono text-sm text-muted-foreground">DAILY CALORIE TARGET</span>
              <div className="font-mono text-xl text-primary">{selected.dietPlan.dailyCalories} KCAL</div>
            </div>
            <div className="h-px w-full bg-border my-4" />
            <div className="space-y-4">
              {selected.dietPlan.meals.map((meal, idx) => (
                <div key={idx} className="border border-border rounded-lg overflow-hidden p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <h4 className="font-mono text-primary">{meal.name}</h4>
                  </div>
                  <ul className="space-y-2">
                    {meal.foods.map((food, fIdx) => (
                      <li key={fIdx} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="text-xs text-primary font-mono">{String(fIdx + 1).padStart(2, "0")}</span>
                        {food}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
