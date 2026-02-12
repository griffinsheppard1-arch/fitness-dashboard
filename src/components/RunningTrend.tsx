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
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function formatPace(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.round(totalSeconds % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export default function RunningTrend({
  data,
}: {
  data: RunningTrendPoint[];
}) {
  if (!data.length) return null;

  const chartData = data.map((d) => ({
    week: shortWeek(d.week_start),
    miles: Math.round(d.miles * 10) / 10,
    paceSeconds: d.pace_seconds || null,
  }));

  // Compute pace axis domain in seconds
  const paceValues = chartData
    .map((d) => d.paceSeconds)
    .filter((v): v is number => v != null && v > 0);
  const minPace = paceValues.length > 0 ? Math.min(...paceValues) : 480;
  const maxPace = paceValues.length > 0 ? Math.max(...paceValues) : 660;
  const pacePadding = 30; // 30 seconds padding

  // Generate tick marks at 30-second intervals
  const tickStart = Math.floor((minPace - pacePadding) / 30) * 30;
  const tickEnd = Math.ceil((maxPace + pacePadding) / 30) * 30;
  const paceTicks: number[] = [];
  for (let t = tickStart; t <= tickEnd; t += 30) {
    paceTicks.push(t);
  }

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
            domain={[minPace - pacePadding, maxPace + pacePadding]}
            ticks={paceTicks}
            tickFormatter={(val: number) => formatPace(val)}
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
              if (name === "paceSeconds") {
                return [formatPace(v) + " /mi", "Pace"];
              }
              return [`${v.toFixed(1)} mi`, "Mileage"];
            }}
          />
          <Legend wrapperStyle={{ color: "#9ca3af", fontSize: 12 }} />
          <Bar
            yAxisId="left"
            dataKey="miles"
            fill="#3b82f6"
            fillOpacity={0.7}
            radius={[4, 4, 0, 0]}
            name="Mileage"
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="paceSeconds"
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
