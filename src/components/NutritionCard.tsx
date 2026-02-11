import type { NutritionData } from "@/lib/types";

function ProgressBar({
  value,
  max,
  color = "bg-blue-500",
}: {
  value: number;
  max: number;
  color?: string;
}) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  return (
    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full ${color}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

export default function NutritionCard({
  nutrition,
}: {
  nutrition?: NutritionData;
}) {
  if (!nutrition) {
    return (
      <div className="space-y-2">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <span className="text-xl">&#x1F37D;&#xFE0F;</span> Nutrition
        </h2>
        <p className="text-sm text-gray-500">
          No nutrition data logged yesterday. Track meals in MyFitnessPal for insights.
        </p>
      </div>
    );
  }

  const calRemaining = nutrition.goal_calories - nutrition.calories;
  const proteinShort = nutrition.goal_protein_g - nutrition.protein_g;

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold flex items-center gap-2">
        <span className="text-xl">&#x1F37D;&#xFE0F;</span> Nutrition
      </h2>
      <p className="text-xs text-gray-500">Yesterday ({nutrition.yesterday_date})</p>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Calories</span>
            <span>
              {nutrition.calories}{" "}
              <span className="text-gray-500">/ {nutrition.goal_calories}</span>
            </span>
          </div>
          <ProgressBar
            value={nutrition.calories}
            max={nutrition.goal_calories}
            color="bg-blue-500"
          />
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Protein</span>
            <span>
              {nutrition.protein_g}g{" "}
              <span className="text-gray-500">/ {nutrition.goal_protein_g}g</span>
            </span>
          </div>
          <ProgressBar
            value={nutrition.protein_g}
            max={nutrition.goal_protein_g}
            color="bg-green-500"
          />
        </div>

        <div className="text-sm">
          <span className="text-gray-400">Carbs: </span>
          <span>{nutrition.carbs_g}g</span>
        </div>
        <div className="text-sm">
          <span className="text-gray-400">Fat: </span>
          <span>{nutrition.fat_g}g</span>
        </div>
      </div>

      {proteinShort > 20 && (
        <div className="p-3 rounded-md border border-red-400/20 bg-red-400/10 text-red-400 text-sm">
          You were {Math.round(proteinShort)}g short on protein yesterday.
          Prioritize high-protein meals today.
        </div>
      )}
    </div>
  );
}
