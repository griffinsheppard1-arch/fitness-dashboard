"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import type { LiftingProgressionExercise } from "@/lib/types";

const CHART_COLORS = [
  "#3b82f6", // blue
  "#ef4444", // red
  "#22c55e", // green
  "#f59e0b", // amber
  "#8b5cf6", // violet
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

// Match exercise names to the 5 key lifts
function matchKeyLift(name: string): string | null {
  const lower = name.toLowerCase();
  if (
    (lower.includes("squat") || lower.includes("back squat")) &&
    !lower.includes("front") &&
    !lower.includes("goblet") &&
    !lower.includes("split")
  )
    return "Squat";
  if (lower.includes("deadlift") && !lower.includes("romanian") && !lower.includes("rdl"))
    return "Deadlift";
  if (lower.includes("bench press") && !lower.includes("incline") && !lower.includes("decline"))
    return "Bench Press";
  if (lower.includes("overhead press") || (lower.includes("ohp") && !lower.includes("dumbbell")))
    return "OHP";
  if (lower.includes("pull up") || lower.includes("pullup") || lower.includes("pull-up"))
    return "Pullups";
  return null;
}

interface VolumeChartsProps {
  progression: LiftingProgressionExercise[];
}

export default function VolumeCharts({ progression }: VolumeChartsProps) {
  // Filter to only the 5 key lifts
  const keyLifts = progression
    .map((ex) => ({ ...ex, displayName: matchKeyLift(ex.name) }))
    .filter(
      (ex): ex is typeof ex & { displayName: string } =>
        ex.displayName !== null
    );

  // Deduplicate (take the one with most data points per display name)
  const seen = new Map<string, (typeof keyLifts)[0]>();
  for (const ex of keyLifts) {
    const existing = seen.get(ex.displayName);
    if (!existing || ex.trend.length > existing.trend.length) {
      seen.set(ex.displayName, ex);
    }
  }
  const filteredLifts = Array.from(seen.values());

  // Collect all weeks for alignment
  const weekSet = new Set<string>();
  filteredLifts.forEach((ex) => ex.trend.forEach((t) => weekSet.add(t.week_start)));
  const weeks = Array.from(weekSet).sort();

  if (filteredLifts.length === 0 || weeks.length < 2) return null;

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
      <h3 className="text-sm font-semibold text-gray-300 mb-4">
        Key Lifts — Max Weight Progression
      </h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {filteredLifts.map((ex, i) => {
          const exData = weeks
            .map((week) => {
              const match = ex.trend.find((t) => t.week_start === week);
              return match
                ? { week: shortWeek(week), max_weight: match.max_weight_lbs }
                : null;
            })
            .filter(
              (d): d is { week: string; max_weight: number } => d !== null && d.max_weight > 0
            );

          if (exData.length < 2) return null;

          const values = exData.map((d) => d.max_weight);
          const min = Math.min(...values);
          const max = Math.max(...values);
          const padding = Math.max((max - min) * 0.2, 10);
          const first = values[0];
          const last = values[values.length - 1];
          const change = last - first;
          const color = CHART_COLORS[i % CHART_COLORS.length];

          return (
            <div key={ex.displayName} className="bg-gray-950 rounded-lg p-4">
              <div className="flex items-baseline justify-between mb-1">
                <p className="text-sm font-medium text-gray-300">
                  {ex.displayName}
                </p>
                <span
                  className={`text-sm font-semibold ${
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
              <p className="text-2xl font-bold mb-3" style={{ color }}>
                {Math.round(last)} lbs
              </p>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={exData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#1f2937"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="week"
                    tick={{ fill: "#6b7280", fontSize: 10 }}
                    stroke="#374151"
                    interval="preserveStartEnd"
                  />
                  <YAxis
                    tick={{ fill: "#6b7280", fontSize: 10 }}
                    stroke="#374151"
                    domain={[
                      Math.floor(min - padding),
                      Math.ceil(max + padding),
                    ]}
                    width={40}
                    tickFormatter={(val: number) => `${Math.round(val)}`}
                  />
                  <Tooltip
                    contentStyle={tooltipStyle}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    formatter={(value: any) => [
                      `${Math.round(Number(value))} lbs`,
                      "Max Weight",
                    ]}
                  />
                  <Line
                    type="monotone"
                    dataKey="max_weight"
                    stroke={color}
                    strokeWidth={2.5}
                    dot={{ r: 4, fill: color, stroke: "#111827", strokeWidth: 2 }}
                    activeDot={{ r: 6, fill: color }}
                    connectNulls
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          );
        })}
      </div>
    </div>
  );
}
