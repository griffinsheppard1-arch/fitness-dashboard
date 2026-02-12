"use client";

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
import type { DailyNutritionTrend } from "@/lib/types";

function shortDate(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

// Color bars based on how close calories are to goal
function getBarColor(calories: number, goal: number): string {
  if (goal <= 0) return "#f59e0b"; // amber fallback
  const ratio = calories / goal;
  if (ratio >= 0.9 && ratio <= 1.1) return "#10b981"; // on-target: emerald
  if (ratio > 1.1) return "#f59e0b"; // over: amber
  return "#ef4444"; // under: red
}

interface ChartDatum {
  date: string;
  label: string;
  calories: number;
  goal: number;
  isTraining: boolean;
  color: string;
}

export default function CalorieTrend({
  data,
}: {
  data: DailyNutritionTrend[];
}) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h3 className="text-sm font-semibold text-gray-300 mb-3">
          Calorie Trend (30 Days)
        </h3>
        <p className="text-sm text-gray-500 text-center py-8">
          No calorie data available yet. Start tracking meals to see trends.
        </p>
      </div>
    );
  }

  // Take last 30 entries
  const recent = data.slice(-30);

  // Compute average goal for ReferenceLine
  const goalsWithData = recent.filter((d) => d.goal_calories > 0);
  const avgGoal =
    goalsWithData.length > 0
      ? Math.round(
          goalsWithData.reduce((sum, d) => sum + d.goal_calories, 0) /
            goalsWithData.length
        )
      : 0;

  const chartData: ChartDatum[] = recent.map((d) => ({
    date: d.date,
    label: shortDate(d.date),
    calories: d.calories,
    goal: d.goal_calories,
    isTraining: d.is_training_day,
    color: getBarColor(d.calories, d.goal_calories),
  }));

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-300">
          Calorie Trend (30 Days)
        </h3>
        <div className="flex items-center gap-3 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
            On target
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
            Over
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" />
            Under
          </span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={chartData} barCategoryGap="15%">
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fill: "#9ca3af", fontSize: 10 }}
            stroke="#374151"
            interval={Math.max(0, Math.floor(chartData.length / 7) - 1)}
            angle={-45}
            textAnchor="end"
            height={50}
          />
          <YAxis
            tick={{ fill: "#9ca3af", fontSize: 11 }}
            stroke="#374151"
            tickFormatter={(v) => `${v.toLocaleString()}`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#111827",
              border: "1px solid #374151",
              borderRadius: "8px",
              color: "#e5e7eb",
            }}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            formatter={(value: any, _name: any, props: any) => {
              const entry = props.payload as ChartDatum;
              return [
                `${Number(value).toLocaleString()} / ${entry.goal.toLocaleString()} kcal`,
                "Calories",
              ];
            }}
            labelFormatter={(label, payload) => {
              if (payload && payload.length > 0) {
                const entry = payload[0].payload as ChartDatum;
                return `${label}${entry.isTraining ? " (Training Day)" : ""}`;
              }
              return label;
            }}
          />
          {avgGoal > 0 && (
            <ReferenceLine
              y={avgGoal}
              stroke="#f59e0b"
              strokeDasharray="6 4"
              strokeWidth={1.5}
              label={{
                value: `Goal: ${avgGoal.toLocaleString()}`,
                fill: "#f59e0b",
                fontSize: 11,
                position: "insideTopRight",
              }}
            />
          )}
          <Bar dataKey="calories" radius={[3, 3, 0, 0]} maxBarSize={18}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.85} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      {/* Training day indicator legend */}
      <div className="flex items-center justify-center gap-4 mt-2 text-xs text-gray-500">
        {chartData.some((d) => d.isTraining) && (
          <span className="flex items-center gap-1">
            Training days are labeled in tooltip hover
          </span>
        )}
      </div>
    </div>
  );
}
