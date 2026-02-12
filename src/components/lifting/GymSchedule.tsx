import type { LiftingRoutinesData } from "@/lib/types";

interface GymScheduleProps {
  routines: LiftingRoutinesData;
}

const DAY_ORDER = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export default function GymSchedule({ routines }: GymScheduleProps) {
  if (!routines.routines || routines.routines.length === 0) return null;

  // Build day -> routine mapping
  const dayMap = new Map<string, { name: string; exerciseCount: number }>();
  for (const routine of routines.routines) {
    if (routine.day_of_week) {
      dayMap.set(routine.day_of_week, {
        name: routine.title,
        exerciseCount: routine.exercises?.length || 0,
      });
    }
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
      <h3 className="text-sm font-semibold text-gray-300 mb-3">
        📅 Weekly Gym Schedule
      </h3>
      <div className="grid grid-cols-7 gap-2 overflow-x-auto min-w-[500px]">
        {DAY_ORDER.map((day) => {
          const routine = dayMap.get(day);
          const isRest = !routine;

          return (
            <div
              key={day}
              className={`rounded-lg p-3 text-center text-xs ${
                isRest
                  ? "bg-gray-800/30 border border-gray-800/50"
                  : "bg-violet-500/10 border border-violet-500/20"
              }`}
            >
              <p className="font-semibold text-gray-300 mb-1">
                {day.slice(0, 3)}
              </p>
              {routine ? (
                <>
                  <p className="text-violet-400 font-medium truncate" title={routine.name}>
                    {routine.name}
                  </p>
                  <p className="text-gray-500 mt-0.5">
                    {routine.exerciseCount} exercises
                  </p>
                </>
              ) : (
                <p className="text-gray-600">Rest</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
