"use client";

import type { RacePrepData } from "@/lib/types";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceLine,
  Cell,
} from "recharts";

export default function TaperTracker({ data }: { data: RacePrepData }) {
  const { weekly_mileage, peak_mileage, current_week_miles, taper_reduction_pct } = data.taper;

  // Build chart data, marking the peak and current weeks
  const chartData = weekly_mileage.map((week, idx) => {
    const weekDate = new Date(week.week_start);
    const label = weekDate.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    const isPeak = week.miles === peak_mileage;
    const isCurrent = idx === weekly_mileage.length - 1;

    return {
      label,
      miles: Math.round(week.miles * 10) / 10,
      runs: week.runs,
      isPeak,
      isCurrent,
      fill: isCurrent
        ? "#f43f5e" // rose-500 for current week
        : isPeak
          ? "#fb7185" // rose-400 for peak
          : "#374151", // gray-700 for other weeks
    };
  });

  const taperOnTrack = taper_reduction_pct >= 20 && taper_reduction_pct <= 50;

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h2 className="text-lg font-semibold text-white">Taper Mileage</h2>
          <p className="text-sm text-gray-400 mt-0.5">
            Weekly volume leading into race day
          </p>
        </div>
        <div
          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium ${
            taperOnTrack
              ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
              : "bg-amber-500/10 border border-amber-500/20 text-amber-400"
          }`}
        >
          {taperOnTrack ? (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
            </svg>
          )}
          <span>
            {taper_reduction_pct}% reduction from peak
            {taperOnTrack ? " \u2014 right on schedule" : ""}
          </span>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-800/50 rounded-lg px-4 py-3 text-center">
          <p className="text-xs text-gray-400 uppercase tracking-wide">Peak</p>
          <p className="text-xl font-bold text-rose-400 mt-1">
            {Math.round(peak_mileage)} <span className="text-sm font-normal text-gray-400">mi</span>
          </p>
        </div>
        <div className="bg-gray-800/50 rounded-lg px-4 py-3 text-center">
          <p className="text-xs text-gray-400 uppercase tracking-wide">This Week</p>
          <p className="text-xl font-bold text-white mt-1">
            {Math.round(current_week_miles * 10) / 10} <span className="text-sm font-normal text-gray-400">mi</span>
          </p>
        </div>
        <div className="bg-gray-800/50 rounded-lg px-4 py-3 text-center">
          <p className="text-xs text-gray-400 uppercase tracking-wide">Reduction</p>
          <p className="text-xl font-bold text-emerald-400 mt-1">
            {taper_reduction_pct}%
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="h-56 sm:h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} barCategoryGap="20%">
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11, fill: "#9ca3af" }}
              axisLine={{ stroke: "#374151" }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#9ca3af" }}
              axisLine={false}
              tickLine={false}
              width={35}
              unit=" mi"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#111827",
                border: "1px solid #374151",
                borderRadius: "0.5rem",
                fontSize: "0.8rem",
              }}
              labelStyle={{ color: "#d1d5db" }}
              itemStyle={{ color: "#f43f5e" }}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              formatter={(value: any, _name: any, props: any) => {
                const suffix = props.payload?.isPeak
                  ? " (Peak)"
                  : props.payload?.isCurrent
                    ? " (Current)"
                    : "";
                return [`${value} mi \u00B7 ${props.payload?.runs ?? 0} runs${suffix}`, "Mileage"];
              }}
            />
            <ReferenceLine
              y={peak_mileage}
              stroke="#fb7185"
              strokeDasharray="4 4"
              strokeOpacity={0.4}
            />
            <Bar
              dataKey="miles"
              radius={[4, 4, 0, 0]}
              maxBarSize={48}
              isAnimationActive={false}
            >
              {chartData.map((entry, index) => (
                <Cell key={index} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-5 mt-4 text-xs text-gray-500">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-gray-700 inline-block" />
          Previous weeks
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-rose-400 inline-block" />
          Peak week
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-rose-500 inline-block" />
          Current week
        </span>
      </div>
    </div>
  );
}
