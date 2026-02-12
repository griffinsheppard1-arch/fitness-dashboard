"use client";

import {
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts";
import type { KeyExercise } from "@/lib/types";

const actionColors: Record<string, string> = {
  increase: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  hold: "text-amber-400 bg-amber-400/10 border-amber-400/20",
  deload: "text-red-400 bg-red-400/10 border-red-400/20",
};

const actionIcons: Record<string, string> = {
  increase: "\u25B2",
  hold: "\u2192",
  deload: "\u25BC",
};

const sparklineColors: Record<string, string> = {
  increase: "#10b981",
  hold: "#f59e0b",
  deload: "#ef4444",
};

interface KeyExercisesProps {
  exercises: KeyExercise[];
}

export default function KeyExercises({ exercises }: KeyExercisesProps) {
  if (!exercises.length) return null;

  const top10 = exercises.slice(0, 10);

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
      <h3 className="text-sm font-semibold text-gray-300 mb-4">
        Key Exercises
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
        {top10.map((ex) => {
          const colorClass =
            actionColors[ex.suggestion.action] || actionColors.hold;
          const icon = actionIcons[ex.suggestion.action] || "\u2192";
          const sparkColor =
            sparklineColors[ex.suggestion.action] || "#f59e0b";

          const sparkData = ex.trend.map((t) => ({
            v: t.est_1rm_lbs,
          }));

          return (
            <div
              key={ex.name}
              className="bg-gray-950 border border-gray-800 rounded-lg p-3 flex flex-col gap-2"
            >
              <div className="flex items-start justify-between gap-1">
                <h4 className="text-sm font-medium text-gray-200 leading-tight line-clamp-2">
                  {ex.name}
                </h4>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full border whitespace-nowrap shrink-0 ${colorClass}`}
                >
                  {icon} {ex.suggestion.action}
                </span>
              </div>

              <div className="flex items-baseline gap-3">
                {ex.current_weight_lbs != null && (
                  <div>
                    <span className="text-lg font-bold text-violet-400">
                      {ex.current_weight_lbs}
                    </span>
                    <span className="text-xs text-gray-500 ml-1">lbs</span>
                  </div>
                )}
                {ex.est_1rm_lbs != null && (
                  <div className="text-xs text-gray-500">
                    1RM: {ex.est_1rm_lbs}
                  </div>
                )}
              </div>

              {sparkData.length > 1 && (
                <div className="h-8 -mx-1">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={sparkData}>
                      <Line
                        type="monotone"
                        dataKey="v"
                        stroke={sparkColor}
                        strokeWidth={1.5}
                        dot={false}
                        connectNulls
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}

              <div className="flex items-center justify-between text-[10px] text-gray-600">
                <span>{ex.session_count} sessions</span>
                <span>{ex.total_sets} sets</span>
                <span>{ex.muscle_group}</span>
              </div>

              <p className="text-[11px] text-gray-500 leading-tight line-clamp-2">
                {ex.suggestion.suggestion}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
