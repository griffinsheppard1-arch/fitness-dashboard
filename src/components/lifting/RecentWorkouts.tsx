"use client";

import { useState } from "react";
import type { RecentWorkout } from "@/lib/types";

interface RecentWorkoutsProps {
  workouts: RecentWorkout[];
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export default function RecentWorkouts({ workouts }: RecentWorkoutsProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (!workouts.length) return null;

  const recent10 = workouts.slice(0, 10);

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
      <h3 className="text-sm font-semibold text-gray-300 mb-4">
        Recent Workouts
      </h3>

      <div className="space-y-2">
        {recent10.map((workout) => {
          const isOpen = expandedId === workout.id;

          return (
            <div
              key={workout.id}
              className="border border-gray-800 rounded-lg overflow-hidden"
            >
              <button
                onClick={() =>
                  setExpandedId(isOpen ? null : workout.id)
                }
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-800/50 transition-colors text-left"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="font-medium text-gray-100 truncate">
                    {workout.title}
                  </span>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs text-gray-500">
                    {formatDate(workout.date)}
                  </span>
                  {workout.duration && (
                    <span className="text-xs text-violet-400">
                      {workout.duration}
                    </span>
                  )}
                  <svg
                    className={`w-4 h-4 text-gray-500 transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </button>

              {isOpen && (
                <div className="px-4 pb-4 border-t border-gray-800 space-y-3">
                  {workout.exercises.map((ex, i) => (
                    <div key={i} className="mt-3">
                      <p className="text-sm font-medium text-gray-300 mb-1">
                        {ex.name}
                      </p>
                      <div className="flex gap-2 flex-wrap">
                        {ex.sets.map((set, j) => (
                          <span
                            key={j}
                            className="text-xs bg-gray-800 text-gray-400 px-2 py-1 rounded"
                          >
                            {set.weight_lbs > 0
                              ? `${set.weight_lbs} lbs`
                              : "BW"}{" "}
                            x {set.reps}
                            {set.rpe != null && (
                              <span className="text-gray-600 ml-1">
                                @{set.rpe}
                              </span>
                            )}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
