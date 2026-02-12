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
} from "recharts";
import type { RunningTrendPoint } from "@/lib/types";

interface PerformanceChartsProps {
  trend: RunningTrendPoint[];
}

function shortWeek(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function formatPace(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.round(totalSeconds % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

const tooltipStyle = {
  backgroundColor: "#111827",
  border: "1px solid #374151",
  borderRadius: "8px",
  color: "#e5e7eb",
};

export default function PerformanceCharts({ trend }: PerformanceChartsProps) {
  if (!trend.length) return null;

  const mileageData = trend.map((d) => ({
    week: shortWeek(d.week_start),
    miles: Math.round(d.miles * 10) / 10,
  }));

  const paceData = trend
    .filter((d) => d.pace_seconds && d.pace_seconds > 0)
    .map((d) => ({
      week: shortWeek(d.week_start),
      pace_seconds: d.pace_seconds!,
      pace: d.pace || formatPace(d.pace_seconds!),
    }));

  // Calculate domain for inverted pace axis (faster = higher on chart)
  const paceValues = paceData.map((d) => d.pace_seconds);
  const minPace = Math.min(...paceValues);
  const maxPace = Math.max(...paceValues);
  const pacePadding = 15;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Weekly Mileage Bar Chart */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
        <h3 className="text-sm font-semibold text-gray-300 mb-4">
          Weekly Mileage
        </h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={mileageData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
            <XAxis
              dataKey="week"
              tick={{ fill: "#9ca3af", fontSize: 11 }}
              stroke="#374151"
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis
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
            <Tooltip
              contentStyle={tooltipStyle}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              formatter={(value: any) => [`${value} mi`, "Miles"]}
            />
            <Bar
              dataKey="miles"
              fill="#3b82f6"
              fillOpacity={0.8}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Avg Pace Line Chart */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
        <h3 className="text-sm font-semibold text-gray-300 mb-4">
          Average Pace Trend
        </h3>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={paceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
            <XAxis
              dataKey="week"
              tick={{ fill: "#9ca3af", fontSize: 11 }}
              stroke="#374151"
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis
              reversed
              domain={[minPace - pacePadding, maxPace + pacePadding]}
              tick={{ fill: "#9ca3af", fontSize: 11 }}
              stroke="#374151"
              tickFormatter={(val: number) => formatPace(val)}
              label={{
                value: "Pace (min/mi)",
                angle: -90,
                position: "insideLeft",
                fill: "#9ca3af",
                fontSize: 11,
              }}
            />
            <Tooltip
              contentStyle={tooltipStyle}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              formatter={(value: any) => [
                `${formatPace(value)}/mi`,
                "Pace",
              ]}
            />
            <Line
              type="monotone"
              dataKey="pace_seconds"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ r: 4, fill: "#3b82f6", stroke: "#1e3a5f", strokeWidth: 2 }}
              activeDot={{ r: 6, fill: "#60a5fa" }}
              connectNulls
            />
          </LineChart>
        </ResponsiveContainer>
        <p className="text-xs text-gray-500 mt-2 text-center">
          Lower on chart = faster pace
        </p>
      </div>
    </div>
  );
}
