"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Injury } from "@/lib/types";

interface InjuryHistoryProps {
  injuries: Injury[];
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function statusBadge(status: string) {
  switch (status) {
    case "active":
      return (
        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-900/50 text-red-300">
          Active
        </span>
      );
    case "recovering":
      return (
        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-amber-900/50 text-amber-300">
          Recovering
        </span>
      );
    case "resolved":
      return (
        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-900/50 text-emerald-300">
          Resolved
        </span>
      );
    default:
      return null;
  }
}

function severityBar(severity: number) {
  const color =
    severity >= 7
      ? "bg-red-500"
      : severity >= 4
        ? "bg-amber-500"
        : "bg-yellow-500";
  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-2 bg-gray-800 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${color}`}
          style={{ width: `${severity * 10}%` }}
        />
      </div>
      <span className="text-xs text-gray-400">{severity}/10</span>
    </div>
  );
}

export default function InjuryHistory({ injuries }: InjuryHistoryProps) {
  const router = useRouter();
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  async function resolveInjury(id: number) {
    setUpdatingId(id);
    try {
      const today = new Date().toISOString().split("T")[0];
      await fetch(`/api/injuries/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "resolved", resolved_date: today }),
      });
      router.refresh();
    } catch (err) {
      console.error("Failed to resolve injury:", err);
    } finally {
      setUpdatingId(null);
    }
  }

  async function markRecovering(id: number) {
    setUpdatingId(id);
    try {
      await fetch(`/api/injuries/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "recovering" }),
      });
      router.refresh();
    } catch (err) {
      console.error("Failed to update injury:", err);
    } finally {
      setUpdatingId(null);
    }
  }

  if (injuries.length === 0) {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 text-center">
        <p className="text-gray-500">No injuries logged yet</p>
        <p className="text-gray-600 text-sm mt-1">
          Use the form above to log an injury
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
      <div className="p-4 border-b border-gray-800">
        <h3 className="text-sm font-semibold text-gray-300">Injury Log</h3>
        <p className="text-xs text-gray-500 mt-1">
          {injuries.length} {injuries.length === 1 ? "injury" : "injuries"}{" "}
          recorded
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-gray-500 text-left border-b border-gray-800">
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Injury</th>
              <th className="px-4 py-3 font-medium hidden sm:table-cell">
                Body Part
              </th>
              <th className="px-4 py-3 font-medium">Severity</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium hidden md:table-cell">
                Duration
              </th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {injuries.map((inj) => (
              <tr
                key={inj.id}
                className="border-b border-gray-800/50 text-gray-300"
              >
                <td className="px-4 py-3 whitespace-nowrap text-gray-400">
                  {formatDate(inj.onset_date)}
                </td>
                <td className="px-4 py-3">
                  <div>
                    <span className="font-medium">{inj.injury_type}</span>
                    {inj.description && (
                      <p className="text-xs text-gray-500 mt-0.5 truncate max-w-[200px]">
                        {inj.description}
                      </p>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 hidden sm:table-cell text-gray-400">
                  {inj.body_part}
                  {inj.body_side ? ` (${inj.body_side})` : ""}
                </td>
                <td className="px-4 py-3">{severityBar(inj.severity)}</td>
                <td className="px-4 py-3">{statusBadge(inj.status)}</td>
                <td className="px-4 py-3 hidden md:table-cell text-gray-400">
                  {inj.duration_days} day{inj.duration_days !== 1 ? "s" : ""}
                </td>
                <td className="px-4 py-3 text-right">
                  {inj.status === "active" && (
                    <div className="flex gap-1 justify-end">
                      <button
                        onClick={() => markRecovering(inj.id)}
                        disabled={updatingId === inj.id}
                        className="px-2 py-1 text-xs bg-amber-900/30 text-amber-300 rounded hover:bg-amber-900/50 disabled:opacity-50"
                      >
                        Recovering
                      </button>
                      <button
                        onClick={() => resolveInjury(inj.id)}
                        disabled={updatingId === inj.id}
                        className="px-2 py-1 text-xs bg-emerald-900/30 text-emerald-300 rounded hover:bg-emerald-900/50 disabled:opacity-50"
                      >
                        Resolve
                      </button>
                    </div>
                  )}
                  {inj.status === "recovering" && (
                    <button
                      onClick={() => resolveInjury(inj.id)}
                      disabled={updatingId === inj.id}
                      className="px-2 py-1 text-xs bg-emerald-900/30 text-emerald-300 rounded hover:bg-emerald-900/50 disabled:opacity-50"
                    >
                      Resolve
                    </button>
                  )}
                  {inj.status === "resolved" && (
                    <span className="text-xs text-gray-600">
                      {inj.resolved_date
                        ? formatDate(inj.resolved_date)
                        : "---"}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
