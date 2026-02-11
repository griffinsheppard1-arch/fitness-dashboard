import type { RunPlan, RecentRun } from "@/lib/types";

function RunTypeTip({ summary }: { summary: string }) {
  const s = summary.toLowerCase();
  let tip = "";
  let color = "border-blue-400/20 bg-blue-400/10 text-blue-400";

  if (s.includes("easy")) {
    tip = "Keep it conversational. If you're breathing too hard, slow down.";
  } else if (s.includes("tempo")) {
    tip = "Comfortably hard. Short sentences OK, not full conversations.";
    color = "border-orange-400/20 bg-orange-400/10 text-orange-400";
  } else if (s.includes("interval") || s.includes("speed")) {
    tip = "Warm up well. Hit intervals hard but stay controlled and consistent.";
    color = "border-red-400/20 bg-red-400/10 text-red-400";
  } else if (s.includes("long")) {
    tip = "Start slow. Fuel during if over 90 min. Build, don't survive.";
    color = "border-purple-400/20 bg-purple-400/10 text-purple-400";
  }

  if (!tip) return null;
  return (
    <div className={`p-3 rounded-md border text-sm ${color}`}>{tip}</div>
  );
}

export default function RunningPlan({
  planned,
  recentRuns,
}: {
  planned: RunPlan[];
  recentRuns: RecentRun[];
}) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold flex items-center gap-2">
        <span className="text-xl">&#x1F3C3;</span> Running
      </h2>

      {planned.map((run, i) => (
        <div key={i} className="space-y-3">
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
            <p className="font-medium text-green-400">{run.summary}</p>
            <div className="flex gap-4 mt-1 text-sm text-gray-400">
              {run.distance_miles && <span>{run.distance_miles} mi</span>}
              {run.duration_seconds && (
                <span>
                  ~{Math.round(run.duration_seconds / 60)} min
                </span>
              )}
              {run.workout_type && <span>{run.workout_type}</span>}
            </div>
            {run.description && (
              <p className="mt-2 text-sm text-gray-400 whitespace-pre-line">
                {run.description}
              </p>
            )}
          </div>
          <RunTypeTip summary={run.summary} />
        </div>
      ))}

      {recentRuns.length > 0 && (
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">
            Recent Runs
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-500 text-left border-b border-gray-800">
                  <th className="pb-2 font-medium">Date</th>
                  <th className="pb-2 font-medium">Distance</th>
                  <th className="pb-2 font-medium">Pace</th>
                  <th className="pb-2 font-medium">Duration</th>
                  <th className="pb-2 font-medium">HR</th>
                </tr>
              </thead>
              <tbody>
                {recentRuns.map((run, i) => (
                  <tr key={i} className="border-b border-gray-800/50 text-gray-300">
                    <td className="py-2">{run.date}</td>
                    <td className="py-2">{run.distance_miles} mi</td>
                    <td className="py-2">{run.pace || "—"}</td>
                    <td className="py-2">{run.duration || "—"}</td>
                    <td className="py-2">{run.avg_hr || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
