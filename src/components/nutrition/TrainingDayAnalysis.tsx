"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";

interface TrainingDayData {
  training_day_avg_cal: number;
  rest_day_avg_cal: number;
  training_days_count: number;
  rest_days_count: number;
}

export default function TrainingDayAnalysis({
  analysis,
}: {
  analysis?: TrainingDayData;
}) {
  if (!analysis) {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h3 className="text-sm font-semibold text-gray-300 mb-3">
          Training vs Rest Day Calories
        </h3>
        <p className="text-sm text-gray-500 text-center py-4">
          Not enough data to compare training and rest day nutrition yet.
        </p>
      </div>
    );
  }

  const diff = analysis.training_day_avg_cal - analysis.rest_day_avg_cal;
  const diffPct =
    analysis.rest_day_avg_cal > 0
      ? Math.round((diff / analysis.rest_day_avg_cal) * 100)
      : 0;
  const diffLabel =
    diff > 0
      ? `+${Math.round(diff).toLocaleString()} kcal (+${diffPct}%)`
      : `${Math.round(diff).toLocaleString()} kcal (${diffPct}%)`;

  const chartData = [
    {
      name: "Training Days",
      calories: Math.round(analysis.training_day_avg_cal),
      count: analysis.training_days_count,
      color: "#f59e0b", // amber
    },
    {
      name: "Rest Days",
      calories: Math.round(analysis.rest_day_avg_cal),
      count: analysis.rest_days_count,
      color: "#6b7280", // gray
    },
  ];

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-300">
          Training vs Rest Day Calories
        </h3>
        <span
          className={`text-xs font-medium px-2 py-0.5 rounded-full ${
            diff > 0
              ? "bg-amber-500/10 text-amber-400"
              : "bg-gray-700/50 text-gray-400"
          }`}
        >
          {diffLabel} on training days
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Chart */}
        <div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart
              data={chartData}
              layout="vertical"
              barCategoryGap="30%"
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#1f2937"
                horizontal={false}
              />
              <XAxis
                type="number"
                tick={{ fill: "#9ca3af", fontSize: 11 }}
                stroke="#374151"
                tickFormatter={(v) => `${v.toLocaleString()}`}
              />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fill: "#9ca3af", fontSize: 12 }}
                stroke="#374151"
                width={110}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#111827",
                  border: "1px solid #374151",
                  borderRadius: "8px",
                  color: "#e5e7eb",
                }}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                formatter={(value: any) => [
                  `${Number(value).toLocaleString()} kcal`,
                  "Avg Calories",
                ]}
              />
              <Bar dataKey="calories" radius={[0, 4, 4, 0]} maxBarSize={32}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.85} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 gap-3 content-center">
          <div className="bg-gray-800/50 rounded-lg p-3 text-center">
            <p className="text-xs text-gray-400">Training Day Avg</p>
            <p className="text-xl font-bold text-amber-400 mt-1">
              {Math.round(analysis.training_day_avg_cal).toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">kcal</p>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-3 text-center">
            <p className="text-xs text-gray-400">Rest Day Avg</p>
            <p className="text-xl font-bold text-gray-300 mt-1">
              {Math.round(analysis.rest_day_avg_cal).toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">kcal</p>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-3 text-center">
            <p className="text-xs text-gray-400">Training Days</p>
            <p className="text-lg font-semibold text-white mt-1">
              {analysis.training_days_count}
            </p>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-3 text-center">
            <p className="text-xs text-gray-400">Rest Days</p>
            <p className="text-lg font-semibold text-white mt-1">
              {analysis.rest_days_count}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
