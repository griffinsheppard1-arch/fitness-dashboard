import type {
  WeeklyData,
  RunningTrendPoint,
  LiftingTrendPoint,
} from "@/lib/types";
import { LIFTING_GOALS } from "@/lib/goals";
import WeekAtGlance from "./WeekAtGlance";
import ComparisonTable from "./ComparisonTable";
import RunningTrend from "./RunningTrend";
import LiftingVolume from "./LiftingVolume";
import Link from "next/link";

const RACE_DATE = new Date("2026-03-01");

function getDaysToRace(): number {
  const now = new Date();
  const diff = RACE_DATE.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

function getTrainingLoadMessage(data: WeeklyData): { msg: string; color: string } {
  const pct = data.adherence.percentage;
  if (pct >= 90) return { msg: "Crushing it this week — full compliance.", color: "text-emerald-400" };
  if (pct >= 70) return { msg: "Solid week — mostly on track.", color: "text-blue-400" };
  if (pct >= 50) return { msg: "Some sessions missed — let's finish strong.", color: "text-amber-400" };
  return { msg: "Below plan this week. Prioritize key sessions.", color: "text-red-400" };
}

export default function WeeklyDashboard({
  data,
  runTrend,
  liftTrend,
}: {
  data: WeeklyData;
  runTrend: RunningTrendPoint[];
  liftTrend: LiftingTrendPoint[];
}) {
  const { running, lifting, nutrition, adherence, next_week } = data;
  const daysToRace = getDaysToRace();
  const loadMsg = getTrainingLoadMessage(data);

  return (
    <div className="space-y-8">
      {/* Training Load Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <p className={`text-sm ${loadMsg.color}`}>{loadMsg.msg}</p>
        </div>
        <Link href="/race">
          <div className="bg-rose-500/10 border border-rose-500/20 rounded-lg px-4 py-2 text-center hover:border-rose-500/40 transition-colors">
            <span className="text-xl font-black text-rose-400">{daysToRace}</span>
            <p className="text-xs text-gray-400">days to race</p>
          </div>
        </Link>
      </div>

      {/* Adherence — more prominent */}
      <section className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Week Adherence</h2>
          <div className="flex items-center gap-2">
            <span className={`text-2xl font-bold ${
              adherence.percentage >= 80 ? "text-emerald-400" :
              adherence.percentage >= 60 ? "text-amber-400" : "text-red-400"
            }`}>
              {adherence.percentage}%
            </span>
            <span className="text-sm text-gray-500">{adherence.completed}/{adherence.planned}</span>
          </div>
        </div>
        <WeekAtGlance
          days={adherence.days}
          planned={adherence.planned}
          completed={adherence.completed}
          percentage={adherence.percentage}
        />
      </section>

      {/* Next Week Preview — moved to top for quick schedule reference */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <span className="text-xl">&#x1F4C5;</span> Next Week Preview
        </h2>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 overflow-x-auto">
          <div className="grid grid-cols-7 gap-2 min-w-[500px]">
            {next_week.map((day) => {
              const hasGym = !!day.gym;
              const hasRun = !!day.run;
              const isRest = !hasGym && !hasRun;
              return (
                <div
                  key={day.date}
                  className={`rounded-lg p-3 text-center text-xs ${
                    isRest
                      ? "bg-gray-800/50 border border-gray-700/50"
                      : "bg-gray-800 border border-gray-700"
                  }`}
                >
                  <p className="font-semibold text-gray-300 mb-1">{day.day_name.slice(0, 3)}</p>
                  <p className="text-gray-500 text-[10px] mb-2">{day.date.slice(5)}</p>
                  {hasRun && (
                    <p className="text-blue-400 truncate" title={day.run}>
                      &#x1F3C3; {day.run}
                    </p>
                  )}
                  {hasGym && (
                    <p className="text-violet-400 truncate" title={day.gym}>
                      &#x1F3CB;&#xFE0F; {day.gym}
                    </p>
                  )}
                  {isRest && <p className="text-gray-600">Rest</p>}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Running */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <span className="text-xl">&#x1F3C3;</span> Running Performance
          </h2>
          <Link href="/running" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
            View details &rarr;
          </Link>
        </div>

        {/* Quick stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard
            label="Miles"
            value={running.this_week.miles}
            prevValue={running.last_week.miles}
            color="text-blue-400"
          />
          <StatCard
            label="Runs"
            value={running.this_week.runs}
            prevValue={running.last_week.runs}
            color="text-blue-400"
          />
          <StatCard
            label="Avg Pace"
            value={running.this_week.pace || "—"}
            prevValue={running.last_week.pace || "—"}
            color="text-blue-400"
            suffix="/mi"
          />
          <StatCard
            label="Avg HR"
            value={running.this_week.avg_hr || "—"}
            prevValue={running.last_week.avg_hr || "—"}
            color="text-blue-400"
            suffix=" bpm"
          />
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <ComparisonTable
            title="Metric"
            showAverages
            rows={[
              {
                metric: "Miles",
                thisWeek: running.this_week.miles,
                lastWeek: running.last_week.miles,
                fourWeek: running.four_week_avg.miles,
                twelveWeek: running.twelve_week_avg.miles,
              },
              {
                metric: "Avg Pace",
                thisWeek: running.this_week.pace || "—",
                lastWeek: running.last_week.pace || "—",
                fourWeek: running.four_week_avg.pace || "—",
                twelveWeek: running.twelve_week_avg.pace || "—",
              },
              {
                metric: "Elevation (m)",
                thisWeek: running.this_week.elevation_m || 0,
                lastWeek: running.last_week.elevation_m || 0,
                fourWeek: running.four_week_avg.elevation_m || 0,
                twelveWeek: running.twelve_week_avg.elevation_m || 0,
              },
            ]}
          />
        </div>

        <RunningTrend data={runTrend} />
      </section>

      {/* Lifting */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <span className="text-xl">&#x1F3CB;&#xFE0F;</span> Lifting Performance
          </h2>
          <Link href="/lifting" className="text-sm text-violet-400 hover:text-violet-300 transition-colors">
            View details &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard label="Workouts" value={lifting.this_week.workouts} prevValue={lifting.last_week.workouts} color="text-violet-400" />
          <StatCard label="Sets" value={lifting.this_week.total_sets} prevValue={lifting.last_week.total_sets} color="text-violet-400" />
          <StatCard label="Volume" value={lifting.this_week.volume_lbs.toLocaleString()} prevValue={lifting.last_week.volume_lbs.toLocaleString()} color="text-violet-400" suffix=" lbs" />
          <StatCard label="Duration" value={lifting.this_week.duration || "—"} prevValue={lifting.last_week.duration || "—"} color="text-violet-400" />
        </div>

        <LiftingVolume data={liftTrend} />

        {/* Goals Snapshot */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold text-gray-400">🎯 Lifting Goals</p>
            <Link href="/lifting" className="text-[10px] text-violet-400 hover:text-violet-300">
              Details →
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {LIFTING_GOALS.map((goal) => (
              <div
                key={goal.label}
                className="bg-gray-950 rounded-lg p-2.5 text-center"
              >
                <p className="text-[11px] font-medium text-gray-300 truncate">
                  {goal.label}
                </p>
                <p className="text-[10px] text-gray-500 mt-0.5">
                  {goal.goalWeight} lbs × {goal.goalReps}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Nutrition */}
      {nutrition && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <span className="text-xl">&#x1F37D;&#xFE0F;</span> Nutrition
            </h2>
            <Link href="/nutrition" className="text-sm text-amber-400 hover:text-amber-300 transition-colors">
              View details &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <StatCard label="Avg Calories" value={nutrition.this_week.avg_calories} prevValue={nutrition.last_week?.avg_calories} color="text-amber-400" />
            <StatCard label="Avg Protein" value={`${nutrition.this_week.avg_protein_g}g`} prevValue={nutrition.last_week ? `${nutrition.last_week.avg_protein_g}g` : undefined} color="text-amber-400" />
            <StatCard label="Days Tracked" value={`${nutrition.this_week.days_tracked}/7`} color="text-amber-400" />
            {nutrition.training_day_avg_cal && nutrition.rest_day_avg_cal && (
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-3">
                <p className="text-xs text-gray-500 mb-1">Train vs Rest</p>
                <p className="text-sm font-semibold text-amber-400">
                  {nutrition.training_day_avg_cal} / {nutrition.rest_day_avg_cal}
                </p>
                <p className="text-xs text-gray-500">cal/day</p>
              </div>
            )}
          </div>

          {/* Calorie adherence callout */}
          {nutrition.this_week.avg_goal_calories > 0 && (() => {
            const pct = Math.round(
              (nutrition.this_week.avg_calories / nutrition.this_week.avg_goal_calories) * 100
            );
            let msg = "";
            let color = "";
            if (pct >= 90 && pct <= 110) {
              msg = `Calorie adherence: ${pct}% — right on target.`;
              color = "border-emerald-400/20 bg-emerald-400/10 text-emerald-400";
            } else if (pct < 90) {
              msg = `Calorie adherence: ${pct}% — you're under-eating. Fuel your training.`;
              color = "border-amber-400/20 bg-amber-400/10 text-amber-400";
            } else {
              msg = `Calorie adherence: ${pct}% — slightly over target.`;
              color = "border-blue-400/20 bg-blue-400/10 text-blue-400";
            }
            return (
              <div className={`p-3 rounded-lg border text-sm ${color}`}>
                {msg}
              </div>
            );
          })()}
        </section>
      )}

    </div>
  );
}

function StatCard({
  label,
  value,
  prevValue,
  color = "text-white",
  suffix = "",
}: {
  label: string;
  value: string | number;
  prevValue?: string | number;
  color?: string;
  suffix?: string;
}) {
  const showDelta = prevValue !== undefined && typeof value === "number" && typeof prevValue === "number";
  const delta = showDelta ? (value as number) - (prevValue as number) : 0;

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-3">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className={`text-lg font-bold ${color}`}>
        {value}{suffix && typeof value !== "string" ? suffix : ""}
      </p>
      {showDelta && delta !== 0 && (
        <p className={`text-xs ${delta > 0 ? "text-emerald-400" : "text-red-400"}`}>
          {delta > 0 ? "+" : ""}{Math.round(delta * 10) / 10} vs last wk
        </p>
      )}
    </div>
  );
}
