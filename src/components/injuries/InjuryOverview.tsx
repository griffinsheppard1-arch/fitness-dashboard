import type { InjuriesDetailData } from "@/lib/types";

interface InjuryOverviewProps {
  overview: InjuriesDetailData["overview"];
}

function StatCard({
  label,
  value,
  accent = "text-rose-400",
}: {
  label: string;
  value: string | number;
  accent?: string;
}) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
      <p className="text-sm text-gray-400 font-medium">{label}</p>
      <p className={`text-3xl font-bold mt-1 ${accent}`}>{value}</p>
    </div>
  );
}

export default function InjuryOverview({ overview }: InjuryOverviewProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        label="Active Injuries"
        value={overview.active_injuries}
        accent={
          overview.active_injuries > 0 ? "text-red-400" : "text-emerald-400"
        }
      />
      <StatCard label="Total Logged" value={overview.total_injuries} />
      <StatCard
        label="Most Affected"
        value={overview.most_affected_area || "None"}
        accent="text-amber-400"
      />
      <StatCard
        label="Avg Recovery"
        value={
          overview.avg_recovery_days
            ? `${overview.avg_recovery_days} days`
            : "---"
        }
        accent="text-blue-400"
      />
    </div>
  );
}
