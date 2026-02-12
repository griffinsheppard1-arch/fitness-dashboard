"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

function formatWeekRange(startStr: string): string {
  const start = new Date(startStr + "T00:00:00");
  const end = new Date(start);
  end.setDate(end.getDate() + 6);

  const startMonth = start.toLocaleDateString("en-US", { month: "short" });
  const endMonth = end.toLocaleDateString("en-US", { month: "short" });
  const startDay = start.getDate();
  const endDay = end.getDate();
  const year = end.getFullYear();

  if (startMonth === endMonth) {
    return `${startMonth} ${startDay} – ${endDay}, ${year}`;
  }
  return `${startMonth} ${startDay} – ${endMonth} ${endDay}, ${year}`;
}

function getMonday(d: Date): Date {
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(d);
  monday.setDate(diff);
  return monday;
}

function toDateStr(d: Date): string {
  return d.toISOString().split("T")[0];
}

export default function WeekPicker() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const weekParam = searchParams.get("week");

  // Current week start (Monday)
  const currentMonday = getMonday(new Date());
  const selectedStart = weekParam
    ? new Date(weekParam + "T00:00:00")
    : currentMonday;

  const isCurrentWeek =
    toDateStr(selectedStart) === toDateStr(currentMonday);

  const navigate = useCallback(
    (dateStr: string) => {
      const currentMondayStr = toDateStr(currentMonday);
      if (dateStr === currentMondayStr) {
        router.push("/weekly");
      } else {
        router.push(`/weekly?week=${dateStr}`);
      }
    },
    [router, currentMonday]
  );

  const goPrev = () => {
    const prev = new Date(selectedStart);
    prev.setDate(prev.getDate() - 7);
    navigate(toDateStr(prev));
  };

  const goNext = () => {
    const next = new Date(selectedStart);
    next.setDate(next.getDate() + 7);
    navigate(toDateStr(next));
  };

  const goThisWeek = () => {
    navigate(toDateStr(currentMonday));
  };

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={goPrev}
        className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 transition-colors"
        aria-label="Previous week"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      <div className="text-center min-w-[200px]">
        <p className="text-sm font-semibold text-white">
          {formatWeekRange(toDateStr(selectedStart))}
        </p>
      </div>

      <button
        onClick={goNext}
        className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 transition-colors"
        aria-label="Next week"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>

      {!isCurrentWeek && (
        <button
          onClick={goThisWeek}
          className="px-3 py-1.5 text-xs font-medium rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-colors border border-emerald-500/30"
        >
          This Week
        </button>
      )}
    </div>
  );
}
