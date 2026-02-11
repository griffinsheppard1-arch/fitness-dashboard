import type {
  WeeklyData,
  RunningTrendPoint,
  LiftingTrendPoint,
} from "@/lib/types";
import WeekAtGlance from "./WeekAtGlance";
import ComparisonTable from "./ComparisonTable";
import RunningTrend from "./RunningTrend";
import LiftingVolume from "./LiftingVolume";
import LiftProgression from "./LiftProgression";

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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Weekly Summary</h1>
        <p className="text-gray-400 text-sm">{data.display_range}</p>
      </div>

      {/* Adherence */}
      <section className="bg-gray-900 border border-gray-800 rounded-lg p-4">
        <WeekAtGlance
          days={adherence.days}
          planned={adherence.planned}
          completed={adherence.completed}
          percentage={adherence.percentage}
        />
      </section>

      {/* Running */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <span className="text-xl">&#x1F3C3;</span> Running Performance
        </h2>

        <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
          <ComparisonTable
            title="Metric"
            showAverages
            rows={[
              {
                metric: "Runs",
                thisWeek: running.this_week.runs,
                lastWeek: running.last_week.runs,
                fourWeek: running.four_week_avg.runs,
                twelveWeek: running.twelve_week_avg.runs,
              },
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
                metric: "Time",
                thisWeek: running.this_week.time || "—",
                lastWeek: running.last_week.time || "—",
                fourWeek: running.four_week_avg.time || "—",
                twelveWeek: running.twelve_week_avg.time || "—",
              },
              {
                metric: "Avg HR",
                thisWeek: running.this_week.avg_hr || "—",
                lastWeek: running.last_week.avg_hr || "—",
                fourWeek: running.four_week_avg.avg_hr || "—",
                twelveWeek: running.twelve_week_avg.avg_hr || "—",
              },
            ]}
          />
        </div>

        <RunningTrend data={runTrend} />
      </section>

      {/* Lifting */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <span className="text-xl">&#x1F3CB;&#xFE0F;</span> Lifting
          Performance
        </h2>

        <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
          <ComparisonTable
            title="Metric"
            rows={[
              {
                metric: "Workouts",
                thisWeek: lifting.this_week.workouts,
                lastWeek: lifting.last_week.workouts,
              },
              {
                metric: "Total Sets",
                thisWeek: lifting.this_week.total_sets,
                lastWeek: lifting.last_week.total_sets,
              },
              {
                metric: "Volume (lbs)",
                thisWeek: lifting.this_week.volume_lbs.toLocaleString(),
                lastWeek: lifting.last_week.volume_lbs.toLocaleString(),
              },
              {
                metric: "Duration",
                thisWeek: lifting.this_week.duration || "—",
                lastWeek: lifting.last_week.duration || "—",
              },
            ]}
          />
        </div>

        {lifting.key_lifts && lifting.key_lifts.length > 0 && (
          <LiftProgression keyLifts={lifting.key_lifts} />
        )}

        <LiftingVolume data={liftTrend} />
      </section>

      {/* Nutrition */}
      {nutrition && (
        <section className="space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <span className="text-xl">&#x1F37D;&#xFE0F;</span> Nutrition
          </h2>

          <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
            <ComparisonTable
              title="Metric"
              rows={[
                {
                  metric: "Calories",
                  thisWeek: nutrition.this_week.avg_calories,
                  lastWeek: nutrition.last_week?.avg_calories ?? "—",
                },
                {
                  metric: "Protein",
                  thisWeek: `${nutrition.this_week.avg_protein_g}g`,
                  lastWeek: nutrition.last_week
                    ? `${nutrition.last_week.avg_protein_g}g`
                    : "—",
                },
                {
                  metric: "Carbs",
                  thisWeek: `${nutrition.this_week.avg_carbs_g}g`,
                  lastWeek: nutrition.last_week
                    ? `${nutrition.last_week.avg_carbs_g}g`
                    : "—",
                },
                {
                  metric: "Fat",
                  thisWeek: `${nutrition.this_week.avg_fat_g}g`,
                  lastWeek: nutrition.last_week
                    ? `${nutrition.last_week.avg_fat_g}g`
                    : "—",
                },
              ]}
            />

            {nutrition.training_day_avg_cal && nutrition.rest_day_avg_cal && (
              <p className="mt-3 text-sm text-gray-400">
                Training day avg: {nutrition.training_day_avg_cal} cal |
                Rest day avg: {nutrition.rest_day_avg_cal} cal |
                Delta: +{nutrition.training_day_avg_cal - nutrition.rest_day_avg_cal} cal
              </p>
            )}

            <p className="text-xs text-gray-500 mt-2">
              Days tracked: {nutrition.this_week.days_tracked}/7
            </p>
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
              color = "border-green-400/20 bg-green-400/10 text-green-400";
            } else if (pct < 90) {
              msg = `Calorie adherence: ${pct}% — you're under-eating. Fuel your training.`;
              color = "border-yellow-400/20 bg-yellow-400/10 text-yellow-400";
            } else {
              msg = `Calorie adherence: ${pct}% — slightly over target.`;
              color = "border-blue-400/20 bg-blue-400/10 text-blue-400";
            }
            return (
              <div className={`p-3 rounded-md border text-sm ${color}`}>
                {msg}
              </div>
            );
          })()}
        </section>
      )}

      {/* Next Week */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <span className="text-xl">&#x1F4C5;</span> Next Week
        </h2>
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-500 text-left border-b border-gray-800">
                <th className="pb-2 font-medium">Day</th>
                <th className="pb-2 font-medium">Date</th>
                <th className="pb-2 font-medium">Planned</th>
              </tr>
            </thead>
            <tbody>
              {next_week.map((day) => {
                const parts = [];
                if (day.gym) parts.push(`\uD83C\uDFCB\uFE0F ${day.gym}`);
                if (day.run) parts.push(`\uD83C\uDFC3 ${day.run}`);
                return (
                  <tr key={day.date} className="border-b border-gray-800/50 text-gray-300">
                    <td className="py-2">{day.day_name.slice(0, 3)}</td>
                    <td className="py-2 text-gray-500">{day.date.slice(5)}</td>
                    <td className="py-2">
                      {parts.length > 0 ? parts.join(" + ") : "Rest"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
