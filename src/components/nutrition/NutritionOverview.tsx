"use client";

import type { NutritionDetailData } from "@/lib/types";

function ProgressBar({
  value,
  max,
  color = "bg-amber-500",
}: {
  value: number;
  max: number;
  color?: string;
}) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  return (
    <div className="h-2 bg-gray-800 rounded-full overflow-hidden mt-2">
      <div
        className={`h-full rounded-full transition-all ${color}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

function StatCard({
  label,
  value,
  subtitle,
  children,
}: {
  label: string;
  value: string;
  subtitle?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
      <p className="text-xs text-gray-400 uppercase tracking-wide">{label}</p>
      <p className="text-2xl font-bold text-white mt-1">{value}</p>
      {subtitle && (
        <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
      )}
      {children}
    </div>
  );
}

export default function NutritionOverview({
  overview,
}: {
  overview: NutritionDetailData["overview"];
}) {
  const today = overview.today;
  const weekly = overview.weekly_summary;

  const todayCalories = today
    ? `${today.calories.toLocaleString()}`
    : "--";
  const todayGoal = today
    ? `/ ${today.goal_calories.toLocaleString()} kcal`
    : "";
  const caloriePct =
    today && today.goal_calories > 0
      ? Math.round((today.calories / today.goal_calories) * 100)
      : null;
  const calorieBarColor =
    caloriePct !== null
      ? caloriePct >= 90 && caloriePct <= 110
        ? "bg-emerald-500"
        : caloriePct > 110
          ? "bg-amber-500"
          : "bg-red-400"
      : "bg-amber-500";

  const weeklyAvgCal = weekly
    ? `${Math.round(weekly.avg_calories).toLocaleString()}`
    : "--";
  const weeklyDaysTracked = weekly ? `${weekly.days_tracked} days tracked` : "";

  const proteinRate = `${Math.round(overview.protein_hit_rate)}%`;
  const proteinColor =
    overview.protein_hit_rate >= 80
      ? "text-emerald-400"
      : overview.protein_hit_rate >= 50
        ? "text-amber-400"
        : "text-red-400";

  const daysTracked = `${overview.days_tracked_this_month}`;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        label="Today's Calories"
        value={todayCalories}
        subtitle={todayGoal}
      >
        {today && (
          <>
            <ProgressBar
              value={today.calories}
              max={today.goal_calories}
              color={calorieBarColor}
            />
            <p className="text-xs text-gray-500 mt-1">
              {caloriePct}% of goal
            </p>
          </>
        )}
      </StatCard>

      <StatCard
        label="Weekly Avg Calories"
        value={weeklyAvgCal}
        subtitle={weeklyDaysTracked}
      />

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
        <p className="text-xs text-gray-400 uppercase tracking-wide">
          Protein Hit Rate
        </p>
        <p className={`text-2xl font-bold mt-1 ${proteinColor}`}>
          {proteinRate}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Days hitting protein goal
        </p>
      </div>

      <StatCard
        label="Days Tracked"
        value={daysTracked}
        subtitle="This month"
      />
    </div>
  );
}
