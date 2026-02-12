"use client";

import type { KeyExercise } from "@/lib/types";
import { LIFTING_GOALS, computeGoalProgress } from "@/lib/goals";

interface GoalProgressProps {
  exercises: KeyExercise[];
}

function findBestMatch(
  exercises: KeyExercise[],
  patterns: string[]
): KeyExercise | null {
  for (const ex of exercises) {
    const lower = ex.name.toLowerCase();
    if (patterns.some((p) => lower.includes(p))) {
      return ex;
    }
  }
  return null;
}

function progressColor(pct: number): string {
  if (pct >= 90) return "bg-emerald-500";
  if (pct >= 70) return "bg-emerald-600";
  if (pct >= 50) return "bg-amber-500";
  if (pct >= 30) return "bg-amber-600";
  return "bg-red-500";
}

function progressTextColor(pct: number): string {
  if (pct >= 90) return "text-emerald-400";
  if (pct >= 70) return "text-emerald-500";
  if (pct >= 50) return "text-amber-400";
  if (pct >= 30) return "text-amber-500";
  return "text-red-400";
}

export default function GoalProgress({ exercises }: GoalProgressProps) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
      <h3 className="text-sm font-semibold text-gray-300 mb-4">
        🎯 Lifting Goals
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {LIFTING_GOALS.map((goal) => {
          const match = findBestMatch(exercises, goal.patterns);
          const currentWeight = match?.current_weight_lbs || 0;
          // Use the max reps from recent trend or estimate from session count
          const trendLast = match?.trend?.[match.trend.length - 1];
          const currentReps = trendLast?.total_sets
            ? Math.min(trendLast.total_sets, goal.goalReps)
            : 0;
          const pct = match
            ? computeGoalProgress(currentWeight, currentReps, goal)
            : 0;

          return (
            <div
              key={goal.label}
              className="bg-gray-950 rounded-lg p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-200">
                  {goal.label}
                </p>
                <span
                  className={`text-lg font-bold ${progressTextColor(pct)}`}
                >
                  {pct}%
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-gray-800 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all duration-500 ${progressColor(pct)}`}
                  style={{ width: `${Math.min(pct, 100)}%` }}
                />
              </div>

              {/* Current vs Goal */}
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">
                  Current:{" "}
                  <span className="text-gray-200 font-medium">
                    {match
                      ? `${Math.round(currentWeight)} lbs`
                      : "No data"}
                  </span>
                </span>
                <span className="text-gray-400">
                  Goal:{" "}
                  <span className="text-gray-200 font-medium">
                    {goal.goalWeight} lbs × {goal.goalReps}
                  </span>
                </span>
              </div>

              {goal.altLabel && (
                <p className="text-[10px] text-gray-600 italic">
                  {goal.altLabel}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
