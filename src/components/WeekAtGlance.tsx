import type { AdherenceDay } from "@/lib/types";

function DayDot({ day }: { day: AdherenceDay }) {
  const planned = day.planned_gym || day.planned_run;
  const completed =
    (day.planned_gym && day.completed_gym) ||
    (day.planned_run && day.completed_run);
  const missed = planned && !completed;

  let bg = "bg-gray-700"; // rest
  if (completed) bg = "bg-green-500";
  else if (missed) bg = "bg-red-500";

  return (
    <div className="flex flex-col items-center gap-1">
      <div className={`w-8 h-8 rounded-full ${bg} flex items-center justify-center text-xs font-medium`}>
        {day.day.slice(0, 2)}
      </div>
      <div className="text-[10px] text-gray-500 text-center max-w-16 truncate">
        {day.planned_gym && day.planned_run
          ? "Both"
          : day.planned_gym || day.planned_run || "Rest"}
      </div>
    </div>
  );
}

export default function WeekAtGlance({
  days,
  planned,
  completed,
  percentage,
}: {
  days: AdherenceDay[];
  planned: number;
  completed: number;
  percentage: number;
}) {
  let color = "text-green-400";
  let message = "Excellent week";
  if (percentage < 70) {
    color = "text-yellow-400";
    message = "Tough week — let's bounce back";
  } else if (percentage < 90) {
    color = "text-blue-400";
    message = "Solid week";
  }

  return (
    <div className="space-y-3">
      <div className="flex items-baseline gap-3">
        <span className={`text-3xl font-bold ${color}`}>{percentage}%</span>
        <span className="text-gray-400 text-sm">
          {completed}/{planned} sessions — {message}
        </span>
      </div>
      <div className="flex justify-between">
        {days.map((day) => (
          <DayDot key={day.day} day={day} />
        ))}
      </div>
    </div>
  );
}
