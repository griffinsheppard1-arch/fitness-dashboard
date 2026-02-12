"use client";

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import type { LiftingTrendPoint, LiftingProgressionExercise } from "@/lib/types";

const PROGRESSION_COLORS = [
  "#8b5cf6", // violet-500
  "#a78bfa", // violet-400
  "#6366f1", // indigo-500
  "#c084fc", // purple-400
  "#818cf8", // indigo-400
  "#e879f9", // fuchsia-400
];

const tooltipStyle = {
  backgroundColor: "#111827",
  border: "1px solid #374151",
  borderRadius: "8px",
  color: "#e5e7eb",
};

function shortWeek(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

interface VolumeChartsProps {
  weeklyTrend: LiftingTrendPoint[];
  progression: LiftingProgressionExercise[];
}

export default function VolumeCharts({
  weeklyTrend,
  progression,
}: VolumeChartsProps) {
  const volumeData = weeklyTrend.map((d) => ({
    week: shortWeek(d.week_start),
    sets: d.total_sets,
    workouts: d.workouts,
  }));

  const top6 = progression.slice(0, 6);
  const weekSet = new Set<string>();
  top6.forEach((ex) => ex.trend.forEach((t) => weekSet.add(t.week_start)));
  const weeks = Array.from(weekSet).sort();

  return (
    <div className="space-y-6">
      {/* Weekly Sets & Workouts */}
      {volumeData.length > 0 && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-gray-300 mb-3">
            Weekly Training Load
          </h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={volumeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis
                dataKey="week"
                tick={{ fill: "#9ca3af", fontSize: 11 }}
                stroke="#374151"
              />
              <YAxis
                yAxisId="sets"
                tick={{ fill: "#9ca3af", fontSize: 11 }}
                stroke="#374151"
              />
              <YAxis
                yAxisId="workouts"
                orientation="right"
                tick={{ fill: "#9ca3af", fontSize: 11 }}
                stroke="#374151"
                domain={[0, "dataMax + 1"]}
              />
              <Tooltip
                contentStyle={tooltipStyle}
                labelFormatter={(label) => `Week of ${label}`}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                formatter={(value: any, name: any) => {
                  if (name === "sets") return [`${value} sets`, "Total Sets"];
                  if (name === "workouts")
                    return [`${value} sessions`, "Workouts"];
                  return [value, name];
                }}
              />
              <Legend
                wrapperStyle={{ color: "#9ca3af", fontSize: 11 }}
                formatter={(value) =>
                  value === "sets" ? "Total Sets" : "Workouts"
                }
              />
              <Bar
                yAxisId="sets"
                dataKey="sets"
                fill="#8b5cf6"
                fillOpacity={0.75}
                radius={[4, 4, 0, 0]}
              />
              <Bar
                yAxisId="workouts"
                dataKey="workouts"
                fill="#a78bfa"
                fillOpacity={0.5}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* 1RM Progression — Individual Mini-Charts */}
      {top6.length > 0 && weeks.length > 1 && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-gray-300 mb-4">
            Est 1RM Progression
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {top6.map((ex, i) => {
              const exData = weeks
                .map((week) => {
                  const match = ex.trend.find((t) => t.week_start === week);
                  return match
                    ? { week: shortWeek(week), est_1rm: match.est_1rm_lbs }
                    : null;
                })
                .filter(
                  (d): d is { week: string; est_1rm: number } => d !== null
                );

              if (exData.length < 2) return null;

              const values = exData.map((d) => d.est_1rm);
              const min = Math.min(...values);
              const max = Math.max(...values);
              const padding = Math.max((max - min) * 0.15, 5);
              const first = values[0];
              const last = values[values.length - 1];
              const change = last - first;

              return (
                <div key={ex.name} className="bg-gray-950 rounded-lg p-3">
                  <div className="flex items-baseline justify-between mb-1">
                    <p className="text-xs text-gray-400 truncate max-w-[70%]">
                      {ex.name}
                    </p>
                    <span
                      className={`text-xs font-medium ${
                        change > 0
                          ? "text-emerald-400"
                          : change < 0
                            ? "text-red-400"
                            : "text-gray-500"
                      }`}
                    >
                      {change > 0 ? "+" : ""}
                      {Math.round(change)} lbs
                    </span>
                  </div>
                  <p className="text-lg font-bold text-purple-400 mb-2">
                    {Math.round(last)} lbs
                  </p>
                  <ResponsiveContainer width="100%" height={100}>
                    <LineChart data={exData}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#1f2937"
                        vertical={false}
                      />
                      <XAxis
                        dataKey="week"
                        tick={{ fill: "#6b7280", fontSize: 9 }}
                        stroke="#374151"
                        interval="preserveStartEnd"
                      />
                      <YAxis
                        tick={{ fill: "#6b7280", fontSize: 9 }}
                        stroke="#374151"
                        domain={[
                          Math.floor(min - padding),
                          Math.ceil(max + padding),
                        ]}
                        width={35}
                      />
                      <Tooltip
                        contentStyle={tooltipStyle}
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        formatter={(value: any) => [
                          `${Math.round(Number(value))} lbs`,
                          "Est 1RM",
                        ]}
                      />
                      <Line
                        type="monotone"
                        dataKey="est_1rm"
                        stroke={
                          PROGRESSION_COLORS[i % PROGRESSION_COLORS.length]
                        }
                        strokeWidth={2}
                        dot={{ r: 2 }}
                        connectNulls
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
