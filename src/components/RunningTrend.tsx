"use client";

import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { RunningTrendPoint } from "@/lib/types";

function shortWeek(dateStr: string) {
  // "2026-01-27" -> "Jan 27"
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function RunningTrend({
  data,
}: {
  data: RunningTrendPoint[];
}) {
  if (!data.length) return null;

  const chartData = data.map((d) => ({
    week: shortWeek(d.week_start),
    miles: d.miles,
    paceMin: d.pace_seconds ? +(d.pace_seconds / 60).toFixed(2) : null,
  }));

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
      <h3 className="text-sm font-semibold text-gray-300 mb-3">
        Weekly Mileage & Pace
      </h3>
      <ResponsiveContainer width="100%" height={260}>
        <ComposedChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
          <XAxis
            dataKey="week"
            tick={{ fill: "#9ca3af", fontSize: 11 }}
            stroke="#374151"
          />
          <YAxis
            yAxisId="left"
            tick={{ fill: "#9ca3af", fontSize: 11 }}
            stroke="#374151"
            label={{
              value: "Miles",
              angle: -90,
              position: "insideLeft",
              fill: "#9ca3af",
              fontSize: 11,
            }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            reversed
            domain={["dataMin - 0.5", "dataMax + 0.5"]}
            tick={{ fill: "#9ca3af", fontSize: 11 }}
            stroke="#374151"
            label={{
              value: "Pace (min/mi)",
              angle: 90,
              position: "insideRight",
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
            formatter={(value: any, name: any) => {
              const v = Number(value);
              if (name === "paceMin") {
                const m = Math.floor(v);
                const s = Math.round((v - m) * 60);
                return [`${m}:${s.toString().padStart(2, "0")}/mi`, "Pace"];
              }
              return [`${v} mi`, "Miles"];
            }}
          />
          <Legend wrapperStyle={{ color: "#9ca3af", fontSize: 12 }} />
          <Bar
            yAxisId="left"
            dataKey="miles"
            fill="#3b82f6"
            fillOpacity={0.7}
            radius={[4, 4, 0, 0]}
            name="Miles"
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="paceMin"
            stroke="#22c55e"
            strokeWidth={2}
            dot={{ r: 3, fill: "#22c55e" }}
            name="Pace"
            connectNulls
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
