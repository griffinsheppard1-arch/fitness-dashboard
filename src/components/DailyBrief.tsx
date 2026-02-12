import type { DailyData } from "@/lib/types";
import ExerciseCard from "./ExerciseCard";
import RunningPlan from "./RunningPlan";
import NutritionCard from "./NutritionCard";
import Link from "next/link";

const RACE_DATE = new Date("2026-03-01");

function getDaysToRace(): number {
  const now = new Date();
  const diff = RACE_DATE.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

function getPhaseLabel(days: number): string {
  if (days <= 0) return "Race Day!";
  if (days <= 7) return "Race Week";
  if (days <= 21) return `Taper Week ${Math.max(1, Math.ceil((22 - days) / 7))} of 3`;
  return "Training";
}

export default function DailyBrief({ data }: { data: DailyData }) {
  const daysToRace = getDaysToRace();
  const phaseLabel = getPhaseLabel(daysToRace);
  const isRunDay = data.workout_type === "run" || data.workout_type === "double";

  return (
    <div className="space-y-6">
      {/* Race Countdown Bar */}
      <Link href="/race">
        <div className="bg-gradient-to-r from-rose-500/20 via-rose-500/10 to-gray-900 border border-rose-500/30 rounded-xl p-4 flex items-center justify-between hover:border-rose-500/50 transition-colors cursor-pointer">
          <div className="flex items-center gap-3">
            <span className="text-3xl font-black text-rose-400">{daysToRace}</span>
            <div>
              <p className="text-sm font-semibold text-rose-300">
                days to Atlanta Marathon
              </p>
              <p className="text-xs text-gray-400">{phaseLabel} &middot; March 1, 2026</p>
            </div>
          </div>
          <div className="text-xs text-gray-500 hidden sm:block">
            View Race Prep &rarr;
          </div>
        </div>
      </Link>

      {/* Header + Greeting */}
      <div>
        <h1 className="text-2xl font-bold">{data.display_date}</h1>
        <div className="mt-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4 flex items-start gap-3">
          <span className="text-2xl">
            {data.workout_type === "double" ? "\uD83D\uDCAA" :
             data.workout_type === "gym" ? "\uD83C\uDFCB\uFE0F" :
             data.workout_type === "run" ? "\uD83C\uDFC3" : "\uD83D\uDE34"}
          </span>
          <p className="text-emerald-300">{data.greeting}</p>
        </div>
      </div>

      {/* During marathon training: Run section first if it's a run day */}
      {isRunDay && data.running && (
        <section>
          <RunningPlan
            planned={data.running.planned}
            recentRuns={data.running.recent_runs}
          />
        </section>
      )}

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

      {/* If not a run day but has running data (shouldn't happen, but defensive) */}
      {!isRunDay && data.running && (
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
        <section className="bg-gray-900 border border-gray-800 rounded-xl p-4">
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
