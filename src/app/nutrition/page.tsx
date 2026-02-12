import { getNutritionDetail } from "@/lib/api";
import NutritionOverview from "@/components/nutrition/NutritionOverview";
import CalorieTrend from "@/components/nutrition/CalorieTrend";
import MacroBreakdown from "@/components/nutrition/MacroBreakdown";
import TrainingDayAnalysis from "@/components/nutrition/TrainingDayAnalysis";
import FoodLog from "@/components/nutrition/FoodLog";

export const revalidate = 300; // ISR: 5 minutes

export default async function NutritionPage() {
  try {
    const data = await getNutritionDetail();

    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-amber-500">Nutrition</h1>
          <p className="text-sm text-gray-400 mt-1">
            Calorie and macro tracking from MyFitnessPal
          </p>
        </div>

        <NutritionOverview overview={data.overview} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <CalorieTrend data={data.calorie_trend} />
          </div>
          <div>
            <MacroBreakdown macroSplit={data.macro_split} />
          </div>
        </div>

        <TrainingDayAnalysis analysis={data.training_day_analysis} />

        <FoodLog foods={data.frequent_foods} />
      </div>
    );
  } catch (error) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-400 text-lg">Unable to load nutrition data</p>
        <p className="text-gray-600 text-sm mt-2">
          {error instanceof Error
            ? error.message
            : "Server may be waking up. Try again in a minute."}
        </p>
      </div>
    );
  }
}
