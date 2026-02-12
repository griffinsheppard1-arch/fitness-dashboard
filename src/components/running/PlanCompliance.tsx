"use client";

import type { PlanComplianceDay } from "@/lib/types";

interface PlanComplianceProps {
  compliance: PlanComplianceDay[];
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function formatDayName(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { weekday: "short" });
}

interface WeekSummary {
  weekLabel: string;
  plannedMiles: number;
  actualMiles: number;
}

function computeWeeklySummaries(days: PlanComplianceDay[]): WeekSummary[] {
  const weekMap = new Map<string, { planned: number; actual: number }>();

  for (const day of days) {
    const d = new Date(day.date + "T00:00:00");
    // Get Monday of this week
    const dayOfWeek = d.getDay();
    const diff = d.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    const monday = new Date(d);
    monday.setDate(diff);
    const weekKey = monday.toISOString().slice(0, 10);

    if (!weekMap.has(weekKey)) {
      weekMap.set(weekKey, { planned: 0, actual: 0 });
    }
    const entry = weekMap.get(weekKey)!;
    entry.planned += day.planned_miles || 0;
    entry.actual += day.actual_miles || 0;
  }

  return Array.from(weekMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([weekStart, data]) => ({
      weekLabel: formatDate(weekStart),
      plannedMiles: Math.round(data.planned * 10) / 10,
      actualMiles: Math.round(data.actual * 10) / 10,
    }));
}

export default function PlanCompliance({ compliance }: PlanComplianceProps) {
  // Show last 28 days
  const recentDays = compliance.slice(-28);
  const weeklySummaries = computeWeeklySummaries(recentDays);

  const completedCount = recentDays.filter((d) => d.completed).length;
  const plannedCount = recentDays.filter(
    (d) => d.planned_summary && d.planned_summary.length > 0
  ).length;
  const complianceRate =
    plannedCount > 0 ? Math.round((completedCount / plannedCount) * 100) : 0;

  return (
    <div className="space-y-4">
      {/* Compliance Summary */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-300">
            Plan Compliance (Last 28 Days)
          </h3>
          <div className="flex items-center gap-2">
            <span
              className={`text-2xl font-bold ${
                complianceRate >= 80
                  ? "text-emerald-400"
                  : complianceRate >= 60
                  ? "text-yellow-400"
                  : "text-red-400"
              }`}
            >
              {complianceRate}%
            </span>
            <span className="text-xs text-gray-500">
              {completedCount}/{plannedCount} planned
            </span>
          </div>
        </div>

        {/* Day-by-day grid */}
        <div className="grid grid-cols-7 gap-1.5">
          {recentDays.map((day) => {
            const hasPlannedRun =
              day.planned_summary && day.planned_summary.length > 0;
            const isRestDay = !hasPlannedRun;

            return (
              <div
                key={day.date}
                className="relative group"
              >
                <div
                  className={`aspect-square rounded-lg flex flex-col items-center justify-center text-xs border ${
                    isRestDay
                      ? "bg-gray-800/30 border-gray-800/50 text-gray-600"
                      : day.completed
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                      : "bg-red-500/10 border-red-500/30 text-red-400"
                  }`}
                >
                  <span className="text-[10px] text-gray-500 leading-none">
                    {formatDayName(day.date)}
                  </span>
                  <span className="text-lg leading-none mt-0.5">
                    {isRestDay ? (
                      <span className="text-gray-700">-</span>
                    ) : day.completed ? (
                      "\u2713"
                    ) : (
                      "\u2717"
                    )}
                  </span>
                </div>

                {/* Tooltip on hover */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10">
                  <div className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-xs whitespace-nowrap shadow-lg">
                    <p className="font-medium text-gray-200">
                      {formatDate(day.date)}
                    </p>
                    {day.planned_summary && (
                      <p className="text-gray-400 mt-1">
                        Plan: {day.planned_summary}
                      </p>
                    )}
                    {day.planned_miles != null && day.planned_miles > 0 && (
                      <p className="text-gray-400">
                        Planned: {day.planned_miles.toFixed(1)} mi
                      </p>
                    )}
                    {day.actual_miles != null && day.actual_miles > 0 && (
                      <p className="text-emerald-400">
                        Actual: {day.actual_miles.toFixed(1)} mi
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Weekly Planned vs Actual */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
        <h3 className="text-sm font-semibold text-gray-300 mb-3">
          Weekly Planned vs Actual Miles
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-500 text-left border-b border-gray-800">
                <th className="pb-2 pr-4 font-medium">Week of</th>
                <th className="pb-2 pr-4 font-medium text-right">Planned</th>
                <th className="pb-2 pr-4 font-medium text-right">Actual</th>
                <th className="pb-2 font-medium text-right">Diff</th>
                <th className="pb-2 pl-4 font-medium">Progress</th>
              </tr>
            </thead>
            <tbody>
              {weeklySummaries.map((week) => {
                const diff =
                  Math.round((week.actualMiles - week.plannedMiles) * 10) / 10;
                const pct =
                  week.plannedMiles > 0
                    ? Math.min(
                        100,
                        Math.round(
                          (week.actualMiles / week.plannedMiles) * 100
                        )
                      )
                    : week.actualMiles > 0
                    ? 100
                    : 0;
                const isOver = diff >= 0;

                return (
                  <tr
                    key={week.weekLabel}
                    className="border-b border-gray-800/50 text-gray-300"
                  >
                    <td className="py-2 pr-4">{week.weekLabel}</td>
                    <td className="py-2 pr-4 text-right text-gray-400">
                      {week.plannedMiles} mi
                    </td>
                    <td className="py-2 pr-4 text-right font-medium text-blue-400">
                      {week.actualMiles} mi
                    </td>
                    <td
                      className={`py-2 text-right font-medium ${
                        isOver ? "text-emerald-400" : "text-red-400"
                      }`}
                    >
                      {isOver ? "+" : ""}
                      {diff} mi
                    </td>
                    <td className="py-2 pl-4 w-32">
                      <div className="w-full bg-gray-800 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all ${
                            pct >= 90 ? "bg-emerald-500" : pct >= 70 ? "bg-yellow-500" : "bg-red-500"
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
