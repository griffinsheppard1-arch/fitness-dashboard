"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function toDateStr(d: Date): string {
  return d.toISOString().split("T")[0];
}

export default function DatePicker() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dateParam = searchParams.get("date");

  const today = new Date();
  const todayStr = toDateStr(today);
  const selectedDate = dateParam || todayStr;
  const isToday = selectedDate === todayStr;

  const navigate = useCallback(
    (dateStr: string) => {
      if (dateStr === todayStr) {
        router.push("/daily");
      } else {
        router.push(`/daily?date=${dateStr}`);
      }
    },
    [router, todayStr]
  );

  const goPrev = () => {
    const d = new Date(selectedDate + "T00:00:00");
    d.setDate(d.getDate() - 1);
    navigate(toDateStr(d));
  };

  const goNext = () => {
    const d = new Date(selectedDate + "T00:00:00");
    d.setDate(d.getDate() + 1);
    navigate(toDateStr(d));
  };

  const goToday = () => {
    navigate(todayStr);
  };

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={goPrev}
        className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 transition-colors"
        aria-label="Previous day"
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

      <div className="text-center min-w-[240px]">
        <p className="text-sm font-semibold text-white">
          {formatDate(selectedDate)}
        </p>
      </div>

      <button
        onClick={goNext}
        className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 transition-colors"
        aria-label="Next day"
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

      {!isToday && (
        <button
          onClick={goToday}
          className="px-3 py-1.5 text-xs font-medium rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-colors border border-emerald-500/30"
        >
          Today
        </button>
      )}
    </div>
  );
}
