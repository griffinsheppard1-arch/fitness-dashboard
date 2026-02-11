"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { KeyLift } from "@/lib/types";

const COLORS = ["#3b82f6", "#22c55e", "#eab308", "#ef4444", "#a78bfa", "#06b6d4"];

function shortWeek(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function LiftProgression({
  keyLifts,
}: {
  keyLifts: KeyLift[];
}) {
  if (!keyLifts.length) return null;

  // Build a unified dataset with all lifts' 1RM by week
  const weekSet = new Set<string>();
  keyLifts.forEach((lift) =>
    lift.trend.forEach((t) => weekSet.add(t.week_start))
  );
  const weeks = Array.from(weekSet).sort();

  const chartData = weeks.map((week) => {
    const point: Record<string, string | number | null> = { week: shortWeek(week) };
    keyLifts.forEach((lift) => {
      const match = lift.trend.find((t) => t.week_start === week);
      point[lift.name] = match?.est_1rm_lbs || null;
    });
    return point;
  });

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
      <h3 className="text-sm font-semibold text-gray-300 mb-3">
        Key Lifts — Est 1RM Trend
      </h3>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={chartData}>
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
          {keyLifts.map((lift, i) => (
            <Line
              key={lift.name}
              type="monotone"
              dataKey={lift.name}
              stroke={COLORS[i % COLORS.length]}
              strokeWidth={2}
              dot={{ r: 3 }}
              connectNulls
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
