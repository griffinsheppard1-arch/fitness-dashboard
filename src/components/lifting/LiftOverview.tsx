import type { LiftingDetailData } from "@/lib/types";

interface LiftOverviewProps {
  overview: LiftingDetailData["overview"];
}

function formatVolume(lbs: number): string {
  if (lbs >= 1000) {
    return `${(lbs / 1000).toFixed(1).replace(/\.0$/, "")}k`;
  }
  return lbs.toLocaleString();
}

const stats = [
  {
    label: "Total Workouts",
    key: "all_time_workouts" as const,
    format: (v: number) => v.toLocaleString(),
    sub: "all-time",
  },
  {
    label: "This Month",
    key: "month_workouts" as const,
    format: (v: number) => v.toString(),
    sub: "workouts",
  },
  {
    label: "Avg / Week",
    key: "avg_sessions_per_week" as const,
    format: (v: number) => v.toFixed(1),
    sub: "sessions",
  },
  {
    label: "Week Volume",
    key: "week_volume_lbs" as const,
    format: (v: number) => formatVolume(v),
    sub: "lbs",
  },
];

export default function LiftOverview({ overview }: LiftOverviewProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.key}
          className="bg-gray-900 border border-gray-800 rounded-xl p-4"
        >
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
            {stat.label}
          </p>
          <p className="text-2xl font-bold text-violet-400">
            {stat.format(overview[stat.key])}
          </p>
          <p className="text-xs text-gray-500 mt-0.5">{stat.sub}</p>
        </div>
      ))}
    </div>
  );
}
