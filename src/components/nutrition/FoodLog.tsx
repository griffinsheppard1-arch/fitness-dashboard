"use client";

import type { FrequentFood } from "@/lib/types";

export default function FoodLog({ foods }: { foods: FrequentFood[] }) {
  if (!foods || foods.length === 0) {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h3 className="text-sm font-semibold text-gray-300 mb-3">
          Most Frequent Foods
        </h3>
        <p className="text-sm text-gray-500 text-center py-4">
          No food data available yet. Logged meals will appear here.
        </p>
      </div>
    );
  }

  // Sort by times_logged descending, take top 15
  const sorted = [...foods]
    .sort((a, b) => b.times_logged - a.times_logged)
    .slice(0, 15);

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
      <h3 className="text-sm font-semibold text-gray-300 mb-4">
        Most Frequent Foods
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-800 text-gray-400 text-xs uppercase tracking-wider">
              <th className="text-left py-2.5 px-3 font-medium">Food</th>
              <th className="text-right py-2.5 px-3 font-medium">Times</th>
              <th className="text-right py-2.5 px-3 font-medium">Avg Cal</th>
              <th className="text-right py-2.5 px-3 font-medium">Protein</th>
              <th className="text-right py-2.5 px-3 font-medium">Carbs</th>
              <th className="text-right py-2.5 px-3 font-medium">Fat</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((food, index) => (
              <tr
                key={`${food.food_name}-${index}`}
                className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors"
              >
                <td className="py-2.5 px-3 text-gray-200 font-medium max-w-[200px] truncate">
                  {food.food_name}
                </td>
                <td className="py-2.5 px-3 text-right text-amber-400 font-medium">
                  {food.times_logged}
                </td>
                <td className="py-2.5 px-3 text-right text-gray-300">
                  {Math.round(food.avg_calories)}
                </td>
                <td className="py-2.5 px-3 text-right text-blue-400">
                  {Math.round(food.avg_protein_g)}g
                </td>
                <td className="py-2.5 px-3 text-right text-amber-300">
                  {Math.round(food.avg_carbs_g)}g
                </td>
                <td className="py-2.5 px-3 text-right text-rose-400">
                  {Math.round(food.avg_fat_g)}g
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
