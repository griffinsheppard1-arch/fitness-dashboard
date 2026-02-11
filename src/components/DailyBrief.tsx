import type { DailyData } from "@/lib/types";
import ExerciseCard from "./ExerciseCard";
import RunningPlan from "./RunningPlan";
import NutritionCard from "./NutritionCard";

const typeIcons: Record<string, string> = {
  double: "\uD83D\uDCAA",
  gym: "\uD83C\uDFCB\uFE0F",
  run: "\uD83C\uDFC3",
  rest: "\uD83D\uDE34",
};

export default function DailyBrief({ data }: { data: DailyData }) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">{data.display_date}</h1>
      </div>

      {/* Greeting */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 flex items-start gap-3">
        <span className="text-2xl">{typeIcons[data.workout_type] || "\uD83D\uDCAA"}</span>
        <p className="text-blue-300">{data.greeting}</p>
      </div>

      {/* Lifting */}
      {data.lifting && (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <span className="text-xl">&#x1F3CB;&#xFE0F;</span>{" "}
            {data.lifting.routine_name}
          </h2>
          <div className="space-y-2">
            {data.lifting.exercises.map((ex) => (
              <ExerciseCard key={ex.name} exercise={ex} />
            ))}
          </div>
        </section>
      )}

      {/* Running */}
      {data.running && (
        <section>
          <RunningPlan
            planned={data.running.planned}
            recentRuns={data.running.recent_runs}
          />
        </section>
      )}

      {/* Nutrition */}
      <section>
        <NutritionCard nutrition={data.nutrition} />
      </section>

      {/* Rest day */}
      {data.workout_type === "rest" && (
        <section className="bg-gray-900 border border-gray-800 rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-2">Recovery Focus</h2>
          <p className="text-gray-400 text-sm">
            Use today for mobility work, stretching, or a light walk.
            Your muscles grow during rest, not during training.
          </p>
        </section>
      )}
    </div>
  );
}
