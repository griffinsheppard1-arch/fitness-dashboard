"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

interface MacroSplit {
  protein_pct: number;
  carbs_pct: number;
  fat_pct: number;
}

const MACRO_COLORS = {
  protein: "#3b82f6", // blue
  carbs: "#f59e0b", // amber
  fat: "#f43f5e", // rose
};

export default function MacroBreakdown({
  macroSplit,
}: {
  macroSplit?: MacroSplit;
}) {
  if (!macroSplit) {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 h-full flex flex-col">
        <h3 className="text-sm font-semibold text-gray-300 mb-3">
          Macro Breakdown
        </h3>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-24 h-24 rounded-full border-2 border-dashed border-gray-700 mx-auto flex items-center justify-center">
              <span className="text-gray-600 text-sm">No data</span>
            </div>
            <p className="text-sm text-gray-500 mt-3">
              Track meals to see macro distribution
            </p>
          </div>
        </div>
      </div>
    );
  }

  const data = [
    { name: "Protein", value: macroSplit.protein_pct, color: MACRO_COLORS.protein },
    { name: "Carbs", value: macroSplit.carbs_pct, color: MACRO_COLORS.carbs },
    { name: "Fat", value: macroSplit.fat_pct, color: MACRO_COLORS.fat },
  ];

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 h-full flex flex-col">
      <h3 className="text-sm font-semibold text-gray-300 mb-3">
        Macro Breakdown
      </h3>
      <div className="flex-1 flex flex-col items-center justify-center min-h-0">
        <div className="relative w-full" style={{ height: 200 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
                strokeWidth={0}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
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
                formatter={(value: any) => [`${Math.round(value)}%`]}
              />
            </PieChart>
          </ResponsiveContainer>
          {/* Center label */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              <p className="text-lg font-bold text-white">
                {Math.round(macroSplit.protein_pct)}%
              </p>
              <p className="text-xs text-gray-400">Protein</p>
            </div>
          </div>
        </div>
        {/* Legend */}
        <div className="flex items-center justify-center gap-4 mt-2">
          {data.map((entry) => (
            <div key={entry.name} className="flex items-center gap-1.5">
              <span
                className="w-2.5 h-2.5 rounded-full inline-block"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-xs text-gray-400">
                {entry.name}{" "}
                <span className="text-gray-300 font-medium">
                  {Math.round(entry.value)}%
                </span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
