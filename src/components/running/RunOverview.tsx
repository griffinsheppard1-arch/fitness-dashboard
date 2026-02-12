import type { RunningDetailData } from "@/lib/types";

interface RunOverviewProps {
  overview: RunningDetailData["overview"];
}

interface StatCardProps {
  label: string;
  value: string | number;
  subLabel?: string;
  subValue?: string | number;
}

function StatCard({ label, value, subLabel, subValue }: StatCardProps) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
      <p className="text-sm text-gray-400 font-medium">{label}</p>
      <p className="text-3xl font-bold text-blue-500 mt-1">{value}</p>
      {subLabel && (
        <p className="text-xs text-gray-500 mt-2">
          {subLabel}:{" "}
          <span className="text-gray-300">{subValue}</span>
        </p>
      )}
    </div>
  );
}

export default function RunOverview({ overview }: RunOverviewProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        label="All-Time Miles"
        value={overview.all_time_miles.toLocaleString(undefined, {
          maximumFractionDigits: 1,
        })}
        subLabel="Runs"
        subValue={overview.all_time_runs.toLocaleString()}
      />
      <StatCard
        label="This Month"
        value={`${overview.month_miles.toLocaleString(undefined, {
          maximumFractionDigits: 1,
        })} mi`}
        subLabel="Runs"
        subValue={overview.month_runs}
      />
      <StatCard
        label="This Week"
        value={`${overview.week_miles.toLocaleString(undefined, {
          maximumFractionDigits: 1,
        })} mi`}
        subLabel="Runs"
        subValue={overview.week_runs}
      />
      <StatCard
        label="Monthly Avg Pace"
        value={overview.month_avg_pace || "---"}
        subLabel="per mile"
      />
    </div>
  );
}
