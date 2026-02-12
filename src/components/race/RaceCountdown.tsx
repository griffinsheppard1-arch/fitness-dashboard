"use client";

import type { RacePrepData } from "@/lib/types";

export default function RaceCountdown({ data }: { data: RacePrepData }) {
  const raceDate = new Date(data.race_date);
  const formattedDate = raceDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-rose-950 via-rose-900/80 to-gray-900 border border-rose-800/40">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-rose-500/10 via-transparent to-transparent" />
      <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />

      <div className="relative px-6 py-8 sm:px-10 sm:py-12">
        <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-10">
          {/* Left: Race Info */}
          <div className="flex-1 text-center sm:text-left space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/15 border border-rose-500/25 text-rose-300 text-xs font-medium uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
              {data.phase_label}
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              {data.race_name}
            </h1>

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-1 sm:gap-4 text-gray-300">
              <span className="flex items-center gap-1.5 text-sm">
                <svg className="w-4 h-4 text-rose-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                </svg>
                {data.race_location}
              </span>
              <span className="flex items-center gap-1.5 text-sm">
                <svg className="w-4 h-4 text-rose-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 9v9.75" />
                </svg>
                {formattedDate}
              </span>
            </div>
          </div>

          {/* Right: Countdown */}
          <div className="flex flex-col items-center shrink-0">
            <div className="text-8xl sm:text-9xl font-black text-white tabular-nums leading-none drop-shadow-[0_0_40px_rgba(244,63,94,0.3)]">
              {data.days_to_race}
            </div>
            <div className="mt-2 text-sm font-semibold uppercase tracking-[0.2em] text-rose-300/80">
              {data.days_to_race === 1 ? "Day to Go" : "Days to Go"}
            </div>
          </div>
        </div>

        {/* Motivational footer */}
        <div className="mt-8 pt-5 border-t border-rose-800/30 text-center">
          <p className="text-rose-200/60 text-sm italic">
            {data.days_to_race <= 3
              ? "Almost there. Trust your training. You are ready."
              : data.days_to_race <= 7
                ? "Race week. Stay sharp, stay calm, stay fueled."
                : data.days_to_race <= 14
                  ? "Taper time. The hay is in the barn. Rest and recover."
                  : data.days_to_race <= 21
                    ? "Final build. Every session counts. Stay consistent."
                    : "The work you put in now pays off on race day."}
          </p>
        </div>
      </div>
    </div>
  );
}
