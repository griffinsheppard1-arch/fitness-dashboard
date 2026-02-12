"use client";

import type { RacePrepData } from "@/lib/types";

function scoreColor(score: number): string {
  if (score >= 80) return "text-emerald-400";
  if (score >= 60) return "text-amber-400";
  return "text-red-400";
}

function barColor(score: number): string {
  if (score >= 80) return "bg-emerald-500";
  if (score >= 60) return "bg-amber-500";
  return "bg-red-500";
}

function ringStroke(score: number): string {
  if (score >= 80) return "#10b981"; // emerald-500
  if (score >= 60) return "#f59e0b"; // amber-500
  return "#ef4444"; // red-500
}

function scoreLabel(score: number): string {
  if (score >= 90) return "Excellent";
  if (score >= 80) return "On Track";
  if (score >= 70) return "Good";
  if (score >= 60) return "Fair";
  return "Needs Work";
}

// Factor display names and icons
const factorMeta: Record<string, { name: string; icon: string }> = {
  training_consistency: { name: "Training Consistency", icon: "calendar" },
  mileage_base: { name: "Mileage Base", icon: "trending-up" },
  long_run: { name: "Long Run", icon: "route" },
  nutrition: { name: "Nutrition", icon: "utensils" },
};

export default function ReadinessScore({ data }: { data: RacePrepData }) {
  const { overall_score, factors } = data.readiness;

  // SVG circular gauge params
  const size = 160;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (overall_score / 100) * circumference;

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 sm:p-6">
      <h2 className="text-lg font-semibold text-white mb-6">Race Readiness</h2>

      <div className="flex flex-col sm:flex-row items-center gap-8">
        {/* Circular gauge */}
        <div className="relative shrink-0">
          <svg width={size} height={size} className="-rotate-90">
            {/* Background ring */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="#1f2937"
              strokeWidth={strokeWidth}
            />
            {/* Progress ring */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={ringStroke(overall_score)}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={circumference - progress}
              style={{ transition: "stroke-dashoffset 1s ease-out" }}
            />
          </svg>
          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-4xl font-black ${scoreColor(overall_score)}`}>
              {overall_score}
            </span>
            <span className="text-xs text-gray-400 font-medium uppercase tracking-wide mt-0.5">
              {scoreLabel(overall_score)}
            </span>
          </div>
        </div>

        {/* Factor breakdown */}
        <div className="flex-1 w-full space-y-4">
          {Object.entries(factors).map(([key, factor]) => {
            const meta = factorMeta[key] || { name: factor.label, icon: "check" };
            return (
              <div key={key}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-medium text-gray-300">
                    {meta.name}
                  </span>
                  <span className={`text-sm font-bold tabular-nums ${scoreColor(factor.score)}`}>
                    {factor.score}
                    <span className="text-gray-500 font-normal">/100</span>
                  </span>
                </div>
                {/* Progress bar */}
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${barColor(factor.score)}`}
                    style={{
                      width: `${factor.score}%`,
                      transition: "width 0.8s ease-out",
                    }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">{factor.detail}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
