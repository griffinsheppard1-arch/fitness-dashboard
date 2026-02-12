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
  // --- Weekly volume bar chart data ---
  const volumeData = weeklyTrend.map((d) => ({
    week: shortWeek(d.week_start),
    volume: d.volume_lbs,
    sets: d.total_sets,
    workouts: d.workouts,
  }));

  // --- 1RM progression multi-line data ---
  const top6 = progression.slice(0, 6);

  const weekSet = new Set<string>();
  top6.forEach((ex) => ex.trend.forEach((t) => weekSet.add(t.week_start)));
  const weeks = Array.from(weekSet).sort();

  const progressionData = weeks.map((week) => {
    const point: Record<string, string | number | null> = {
      week: shortWeek(week),
    };
    top6.forEach((ex) => {
      const match = ex.trend.find((t) => t.week_start === week);
      point[ex.name] = match?.est_1rm_lbs ?? null;
    });
    return point;
  });

  return (
    <div className="space-y-6">
      {/* Weekly Volume Bar Chart */}
      {volumeData.length > 0 && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-gray-300 mb-3">
            Weekly Volume
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
                tick={{ fill: "#9ca3af", fontSize: 11 }}
                stroke="#374151"
                tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#111827",
                  border: "1px solid #374151",
                  borderRadius: "8px",
                  color: "#e5e7eb",
                }}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                formatter={(value: any, name: any) => {
                  if (name === "volume")
                    return [`${Number(value).toLocaleString()} lbs`, "Volume"];
                  return [value, name];
                }}
                labelFormatter={(label) => `Week of ${label}`}
              />
              <Bar
                dataKey="volume"
                fill="#8b5cf6"
                fillOpacity={0.75}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* 1RM Progression Multi-Line Chart */}
      {progressionData.length > 1 && top6.length > 0 && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-gray-300 mb-3">
            Est 1RM Progression
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={progressionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis
                dataKey="week"
                tick={{ fill: "#9ca3af", fontSize: 11 }}
                stroke="#374151"
              />
              <YAxis
                tick={{ fill: "#9ca3af", fontSize: 11 }}
                stroke="#374151"
                label={{
                  value: "Est 1RM (lbs)",
                  angle: -90,
                  position: "insideLeft",
                  fill: "#9ca3af",
                  fontSize: 11,
                }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#111827",
                  border: "1px solid #374151",
                  borderRadius: "8px",
                  color: "#e5e7eb",
                }}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                formatter={(value: any) => [`${Number(value)} lbs`]}
              />
              <Legend wrapperStyle={{ color: "#9ca3af", fontSize: 11 }} />
              {top6.map((ex, i) => (
                <Line
                  key={ex.name}
                  type="monotone"
                  dataKey={ex.name}
                  stroke={PROGRESSION_COLORS[i % PROGRESSION_COLORS.length]}
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  connectNulls
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
