"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { MuscleGroupData } from "@/lib/types";

const COLORS = [
  "#3b82f6", // blue-500
  "#ef4444", // red-500
  "#22c55e", // green-500
  "#f59e0b", // amber-500
  "#8b5cf6", // violet-500
  "#ec4899", // pink-500
  "#06b6d4", // cyan-500
  "#f97316", // orange-500
  "#14b8a6", // teal-500
  "#a855f7", // purple-500
];

interface MuscleGroupBreakdownProps {
  data: MuscleGroupData[];
}

export default function MuscleGroupBreakdown({
  data,
}: MuscleGroupBreakdownProps) {
  if (!data.length) return null;

  const sorted = [...data].sort((a, b) => b.total_sets - a.total_sets);

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
      <h3 className="text-sm font-semibold text-gray-300 mb-4">
        Muscle Group Distribution
      </h3>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="w-full sm:w-1/2">
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={sorted}
                dataKey="total_sets"
                nameKey="muscle_group"
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={95}
                paddingAngle={2}
                strokeWidth={0}
              >
                {sorted.map((_, i) => (
                  <Cell
                    key={i}
                    fill={COLORS[i % COLORS.length]}
                    fillOpacity={0.85}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#111827",
                  border: "1px solid #374151",
                  borderRadius: "8px",
                  color: "#e5e7eb",
                }}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                formatter={(value: any) => [`${value} sets`]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="w-full sm:w-1/2 space-y-2">
          {sorted.map((mg, i) => (
            <div key={mg.muscle_group} className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full shrink-0"
                style={{ backgroundColor: COLORS[i % COLORS.length] }}
              />
              <span className="text-sm text-gray-300 flex-1 truncate">
                {mg.muscle_group}
              </span>
              <span className="text-xs text-gray-500">
                {mg.total_sets} sets
              </span>
              <span className="text-xs text-gray-600">
                {mg.exercise_count} ex
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
