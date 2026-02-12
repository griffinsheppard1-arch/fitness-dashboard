"use client";

import type { RacePrepData } from "@/lib/types";

interface StatCard {
  label: string;
  value: string;
  unit: string;
  icon: React.ReactNode;
}

export default function TrainingBlockSummary({ data }: { data: RacePrepData }) {
  const block = data.training_block;
  const blockStart = new Date(block.start_date);
  const blockLabel = blockStart.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const elevationFeet = Math.round(block.total_elevation_m * 3.28084);

  const stats: StatCard[] = [
    {
      label: "Total Miles",
      value: Math.round(block.total_miles).toLocaleString(),
      unit: "mi",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
        </svg>
      ),
    },
    {
      label: "Total Runs",
      value: block.total_runs.toString(),
      unit: "runs",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 0 0 .495-7.468 5.99 5.99 0 0 0-1.925 3.547 5.975 5.975 0 0 1-2.133-1.001A3.75 3.75 0 0 0 12 18Z" />
        </svg>
      ),
    },
    {
      label: "Elevation Gain",
      value: elevationFeet.toLocaleString(),
      unit: "ft",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
        </svg>
      ),
    },
    {
      label: "Longest Run",
      value: block.longest_run_miles.toFixed(1),
      unit: "mi",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
        </svg>
      ),
    },
    {
      label: "Quality Sessions",
      value: block.quality_sessions.toString(),
      unit: "workouts",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 sm:p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-lg font-semibold text-white">Training Block</h2>
          <p className="text-sm text-gray-400 mt-0.5">Since {blockLabel}</p>
        </div>
        <div className="px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-medium">
          Marathon Cycle
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="group relative bg-gray-800/40 hover:bg-gray-800/70 border border-gray-800 hover:border-rose-800/40 rounded-xl p-4 transition-all duration-200"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="text-rose-400 opacity-70 group-hover:opacity-100 transition-opacity">
                {stat.icon}
              </div>
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wide leading-tight">
                {stat.label}
              </p>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-white">{stat.value}</span>
              <span className="text-xs text-gray-500 font-medium">{stat.unit}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
