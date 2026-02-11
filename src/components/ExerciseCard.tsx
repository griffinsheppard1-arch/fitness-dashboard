"use client";

import { useState } from "react";
import type { ExerciseData } from "@/lib/types";

const actionColors = {
  increase: "text-green-400 bg-green-400/10 border-green-400/20",
  hold: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  deload: "text-orange-400 bg-orange-400/10 border-orange-400/20",
};

const actionIcons = {
  increase: "\u25B2",
  hold: "\u2192",
  deload: "\u25BC",
};

export default function ExerciseCard({ exercise }: { exercise: ExerciseData }) {
  const [open, setOpen] = useState(false);
  const { suggestion } = exercise;
  const colorClass = actionColors[suggestion.action] || actionColors.hold;
  const icon = actionIcons[suggestion.action] || "\u2192";

  return (
    <div className="border border-gray-800 rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-800/50 transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <span className="font-medium text-gray-100">{exercise.name}</span>
          {suggestion.suggested_weight_lbs && (
            <span className="text-sm text-gray-400">
              {suggestion.suggested_weight_lbs} lbs
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`text-xs px-2 py-0.5 rounded-full border ${colorClass}`}
          >
            {icon} {suggestion.action}
          </span>
          <svg
            className={`w-4 h-4 text-gray-500 transition-transform ${open ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-3 border-t border-gray-800">
          {/* Coach suggestion */}
          <div className={`mt-3 p-3 rounded-md border text-sm ${colorClass}`}>
            {suggestion.suggestion}
          </div>

          {/* Target sets */}
          {exercise.target_sets.length > 0 && (
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                Target
              </p>
              <div className="flex gap-2 flex-wrap">
                {exercise.target_sets.map((s, i) => (
                  <span
                    key={i}
                    className="text-sm bg-gray-800 px-2 py-1 rounded"
                  >
                    {s.weight_lbs ? `${s.weight_lbs} lbs` : "BW"}{" "}
                    {s.reps ? `× ${s.reps}` : ""}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Recent sessions */}
          {exercise.recent_sessions.length > 0 && (
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                Recent
              </p>
              <div className="space-y-1">
                {exercise.recent_sessions.map((session, i) => (
                  <div key={i} className="text-sm text-gray-400 flex gap-2">
                    <span className="text-gray-500 w-20 shrink-0">
                      {session.date}
                    </span>
                    <span>
                      {session.sets
                        .map((s) => `${s.weight_lbs}×${s.reps}`)
                        .join(" | ")}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Est 1RM */}
          {exercise.est_1rm_lbs && (
            <p className="text-xs text-gray-500">
              Est 1RM: {exercise.est_1rm_lbs} lbs
            </p>
          )}
        </div>
      )}
    </div>
  );
}
