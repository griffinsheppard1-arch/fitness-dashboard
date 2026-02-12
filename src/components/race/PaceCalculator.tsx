"use client";

import type { RacePrepData } from "@/lib/types";

function formatPaceLabel(key: string): string {
  const labels: Record<string, string> = {
    "5k": "5K",
    "10k": "10K",
    half_marathon: "Half Marathon",
    long_runs: "Long Runs",
    recent_half: "Recent Half",
  };
  return labels[key] || key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatBasisShort(basis: string): string {
  // Shorten basis text for card display
  if (basis.length > 60) {
    return basis.slice(0, 57) + "...";
  }
  return basis;
}

export default function PaceCalculator({ data }: { data: RacePrepData }) {
  const prediction = data.pace_prediction;

  if (!prediction) {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 sm:p-6">
        <h2 className="text-lg font-semibold text-white mb-3">Pace Predictions</h2>
        <div className="bg-gray-800/50 rounded-lg p-6 text-center">
          <svg className="w-10 h-10 mx-auto text-gray-600 mb-3" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
          <p className="text-gray-400 text-sm">
            No pace predictions available yet.
          </p>
          <p className="text-gray-500 text-xs mt-1">
            Complete more race-distance efforts (5K, 10K, half marathon) to unlock predictions.
          </p>
        </div>
      </div>
    );
  }

  const { best_prediction, all_predictions } = prediction;
  const otherPredictions = Object.entries(all_predictions).filter(
    ([, pred]) => pred.predicted_time !== best_prediction.predicted_time
  );

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 sm:p-6">
      <h2 className="text-lg font-semibold text-white mb-5">Pace Predictions</h2>

      {/* Best prediction - featured card */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-rose-900/40 to-gray-800/60 border border-rose-800/30 p-5 mb-5">
        <div className="absolute top-3 right-3">
          <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-semibold uppercase tracking-wider">
            Best Estimate
          </span>
        </div>
        <div className="space-y-3">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Predicted Finish</p>
            <p className="text-4xl font-black text-white tracking-tight">
              {best_prediction.predicted_time}
            </p>
          </div>
          <div className="flex items-center gap-6">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide">Pace / Mile</p>
              <p className="text-xl font-bold text-rose-400 mt-0.5">
                {best_prediction.pace_per_mile}
              </p>
            </div>
            <div className="h-8 w-px bg-gray-700" />
            <div className="flex-1">
              <p className="text-xs text-gray-400 uppercase tracking-wide">Based On</p>
              <p className="text-sm text-gray-300 mt-0.5">
                {formatBasisShort(best_prediction.basis)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Other predictions */}
      {otherPredictions.length > 0 && (
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-3">
            Other Estimates
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {otherPredictions.map(([key, pred]) => (
              <div
                key={key}
                className="bg-gray-800/50 rounded-lg px-4 py-3 border border-gray-800"
              >
                <p className="text-xs text-gray-400 font-medium mb-2">
                  {formatPaceLabel(key)}
                </p>
                <div className="flex items-baseline justify-between">
                  <span className="text-lg font-bold text-white">
                    {pred.predicted_time}
                  </span>
                  <span className="text-sm text-rose-400 font-medium">
                    {pred.pace_per_mile}/mi
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
                  {formatBasisShort(pred.basis)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
