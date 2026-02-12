import type { UpcomingRun } from "@/lib/types";

interface UpcomingRunsProps {
  runs: UpcomingRun[];
}

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

function getDayName(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { weekday: "short" });
}

function getDateDisplay(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function isToday(dateStr: string): boolean {
  const today = new Date();
  const d = new Date(dateStr + "T00:00:00");
  return (
    d.getFullYear() === today.getFullYear() &&
    d.getMonth() === today.getMonth() &&
    d.getDate() === today.getDate()
  );
}

const WORKOUT_TYPE_COLORS: Record<string, string> = {
  easy: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  recovery: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  tempo: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  interval: "bg-red-500/20 text-red-400 border-red-500/30",
  long: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  race: "bg-purple-500/20 text-purple-400 border-purple-500/30",
};

function getWorkoutColor(type?: string): string {
  if (!type) return "bg-gray-700/30 text-gray-400 border-gray-600/30";
  const lower = type.toLowerCase();
  for (const [key, color] of Object.entries(WORKOUT_TYPE_COLORS)) {
    if (lower.includes(key)) return color;
  }
  return "bg-blue-500/20 text-blue-400 border-blue-500/30";
}

export default function UpcomingRuns({ runs }: UpcomingRunsProps) {
  if (!runs || runs.length === 0) return null;

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
      <h3 className="text-sm font-semibold text-gray-300 mb-3">
        🗓️ Next 7 Days
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
        {runs.map((run) => {
          const today = isToday(run.date);
          return (
            <div
              key={run.date}
              className={`rounded-lg p-3 text-center border ${
                today
                  ? "bg-blue-500/15 border-blue-500/30 ring-1 ring-blue-500/20"
                  : "bg-gray-800/40 border-gray-700/40"
              }`}
            >
              <p
                className={`text-xs font-bold mb-0.5 ${
                  today ? "text-blue-400" : "text-gray-400"
                }`}
              >
                {getDayName(run.date)}
              </p>
              <p className="text-[10px] text-gray-500 mb-2">
                {getDateDisplay(run.date)}
              </p>

              {run.summary ? (
                <>
                  <p
                    className="text-xs font-medium text-gray-200 truncate mb-1"
                    title={run.summary}
                  >
                    {run.summary}
                  </p>
                  {run.distance_miles && (
                    <p className="text-sm font-bold text-blue-400">
                      {run.distance_miles.toFixed(1)} mi
                    </p>
                  )}
                  {run.duration_seconds && (
                    <p className="text-[10px] text-gray-500 mt-0.5">
                      ~{formatDuration(run.duration_seconds)}
                    </p>
                  )}
                  {run.workout_type && (
                    <span
                      className={`inline-block mt-1.5 text-[9px] font-medium px-1.5 py-0.5 rounded-full border ${getWorkoutColor(
                        run.workout_type
                      )}`}
                    >
                      {run.workout_type}
                    </span>
                  )}
                </>
              ) : (
                <p className="text-xs text-gray-600 mt-2">Rest</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
