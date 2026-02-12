"use client";

import { useState, Fragment } from "react";
import type { RunActivity, RunSplit } from "@/lib/types";

interface RecentRunsProps {
  runs: RunActivity[];
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function formatElevation(meters: number): string {
  const feet = Math.round(meters * 3.28084);
  return `${feet} ft`;
}

function splitPaceColor(split: RunSplit, avgPaceSeconds?: number): string {
  if (!split.pace_seconds || !avgPaceSeconds) return "text-gray-300";
  const diff = split.pace_seconds - avgPaceSeconds;
  // Faster than average (lower seconds = faster)
  if (diff <= -10) return "text-emerald-400";
  // Roughly average
  if (diff <= 10) return "text-yellow-400";
  // Slower than average
  return "text-red-400";
}

export default function RecentRuns({ runs }: RecentRunsProps) {
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  const displayRuns = runs.slice(0, 20);

  function toggleRow(id: number) {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
      <div className="p-4 border-b border-gray-800">
        <h3 className="text-sm font-semibold text-gray-300">
          Recent Runs
        </h3>
        <p className="text-xs text-gray-500 mt-1">
          Click a row to view mile splits
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-gray-500 text-left border-b border-gray-800">
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium text-right">Distance</th>
              <th className="px-4 py-3 font-medium text-right">Pace</th>
              <th className="px-4 py-3 font-medium text-right">Duration</th>
              <th className="px-4 py-3 font-medium text-right hidden sm:table-cell">
                HR
              </th>
              <th className="px-4 py-3 font-medium text-right hidden md:table-cell">
                Elev
              </th>
              <th className="px-4 py-3 font-medium text-right hidden lg:table-cell">
                Cadence
              </th>
              <th className="px-4 py-3 font-medium text-right hidden xl:table-cell">
                Stride
              </th>
            </tr>
          </thead>
          <tbody>
            {displayRuns.map((run) => {
              const isExpanded = expandedRows.has(run.id);
              const hasSplits = run.splits && run.splits.length > 0;

              return (
                <Fragment key={run.id}>
                  <tr
                    onClick={() => hasSplits && toggleRow(run.id)}
                    className={`border-b border-gray-800/50 text-gray-300 transition-colors ${
                      hasSplits
                        ? "cursor-pointer hover:bg-gray-800/50"
                        : ""
                    } ${isExpanded ? "bg-gray-800/30" : ""}`}
                  >
                    <td className="px-4 py-3 whitespace-nowrap">
                      {formatDate(run.date)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {hasSplits && (
                          <span
                            className={`text-xs text-gray-500 transition-transform ${
                              isExpanded ? "rotate-90" : ""
                            }`}
                          >
                            &#9654;
                          </span>
                        )}
                        <span className="truncate max-w-[200px]">
                          {run.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-blue-400">
                      {run.distance_miles.toFixed(2)} mi
                    </td>
                    <td className="px-4 py-3 text-right">
                      {run.pace || "---"}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-400">
                      {run.duration || "---"}
                    </td>
                    <td className="px-4 py-3 text-right hidden sm:table-cell text-gray-400">
                      {run.avg_hr ? `${run.avg_hr} bpm` : "---"}
                    </td>
                    <td className="px-4 py-3 text-right hidden md:table-cell text-gray-400">
                      {run.elevation_m
                        ? formatElevation(run.elevation_m)
                        : "---"}
                    </td>
                    <td className="px-4 py-3 text-right hidden lg:table-cell text-gray-400">
                      {run.cadence ? `${run.cadence} spm` : "---"}
                    </td>
                    <td className="px-4 py-3 text-right hidden xl:table-cell text-gray-400">
                      {run.stride_length
                        ? `${run.stride_length} m`
                        : "---"}
                    </td>
                  </tr>

                  {isExpanded && run.splits && run.splits.length > 0 && (
                    <tr>
                      <td colSpan={9} className="px-4 py-3 bg-gray-950/50">
                        <div className="pl-4 border-l-2 border-blue-500/30">
                          <p className="text-xs font-medium text-gray-500 mb-2">
                            Mile Splits
                          </p>
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                            {run.splits.map((split) => (
                              <div
                                key={split.mile}
                                className="bg-gray-900 border border-gray-800 rounded-lg px-3 py-2"
                              >
                                <div className="flex items-baseline justify-between">
                                  <span className="text-xs text-gray-500">
                                    Mi {split.mile}
                                  </span>
                                  <span
                                    className={`text-sm font-mono font-medium ${splitPaceColor(
                                      split,
                                      run.pace_seconds
                                    )}`}
                                  >
                                    {split.pace || "---"}
                                  </span>
                                </div>
                                {split.avg_hr && (
                                  <p className="text-xs text-gray-500 mt-1">
                                    {split.avg_hr} bpm
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>

                          {run.best_efforts && run.best_efforts.length > 0 && (
                            <div className="mt-3 pt-3 border-t border-gray-800">
                              <p className="text-xs font-medium text-gray-500 mb-2">
                                Best Efforts
                              </p>
                              <div className="flex flex-wrap gap-3">
                                {run.best_efforts.map((effort) => (
                                  <div
                                    key={effort.name}
                                    className="text-xs text-gray-400"
                                  >
                                    <span className="text-gray-500">
                                      {effort.name}:
                                    </span>{" "}
                                    <span className="text-emerald-400 font-medium">
                                      {effort.elapsed_display}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

