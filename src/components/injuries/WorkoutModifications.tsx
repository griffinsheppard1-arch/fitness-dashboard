import type { WorkoutModification } from "@/lib/types";

interface WorkoutModificationsProps {
  modifications: WorkoutModification[];
  upcomingRuns: { date: string; summary?: string; distance_miles?: number }[];
  todayRoutine?: { name: string; exercises: string[] } | null;
}

function severityBadge(severity: number) {
  if (severity >= 7)
    return (
      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-900/50 text-red-300">
        High
      </span>
    );
  if (severity >= 4)
    return (
      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-amber-900/50 text-amber-300">
        Moderate
      </span>
    );
  return (
    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-900/50 text-yellow-300">
      Low
    </span>
  );
}

export default function WorkoutModifications({
  modifications,
  upcomingRuns,
  todayRoutine,
}: WorkoutModificationsProps) {
  if (modifications.length === 0) return null;

  return (
    <div className="bg-gray-900 border border-red-900/30 rounded-xl p-5 space-y-4">
      <div className="flex items-center gap-2">
        <span className="text-red-400 text-lg">⚠️</span>
        <h2 className="text-lg font-semibold text-red-300">
          Workout Adjustments
        </h2>
      </div>
      <p className="text-sm text-gray-400">
        Based on your active injuries, consider these modifications:
      </p>

      <div className="space-y-3">
        {modifications.map((mod) => (
          <div
            key={`${mod.injury_type}-${mod.body_part}`}
            className="bg-gray-950 rounded-lg p-4 space-y-2"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white">
                {mod.injury_type} — {mod.body_part}
              </h3>
              {severityBadge(mod.severity)}
            </div>
            {mod.running_mod && (
              <div className="flex gap-2">
                <span className="text-blue-400 text-xs mt-0.5">🏃</span>
                <p className="text-sm text-gray-300">
                  {mod.running_mod}
                </p>
              </div>
            )}
            {mod.lifting_mod && (
              <div className="flex gap-2">
                <span className="text-purple-400 text-xs mt-0.5">🏋️</span>
                <p className="text-sm text-gray-300">
                  {mod.lifting_mod}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Upcoming runs with warnings */}
      {upcomingRuns.length > 0 && (
        <div className="pt-3 border-t border-gray-800">
          <p className="text-xs font-medium text-gray-500 mb-2">
            Upcoming Runs to Watch
          </p>
          <div className="space-y-1">
            {upcomingRuns.map((run) => (
              <div
                key={run.date}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-gray-400">{run.date}</span>
                <span className="text-gray-300">
                  {run.summary || "Run"}{" "}
                  {run.distance_miles
                    ? `(${run.distance_miles.toFixed(1)} mi)`
                    : ""}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Today's routine warning */}
      {todayRoutine && (
        <div className="pt-3 border-t border-gray-800">
          <p className="text-xs font-medium text-gray-500 mb-1">
            Today&apos;s Lifting: {todayRoutine.name}
          </p>
          <p className="text-xs text-gray-400">
            Exercises: {todayRoutine.exercises.join(", ")}
          </p>
        </div>
      )}
    </div>
  );
}
