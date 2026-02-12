import { getLiftingDetail, getLiftingRoutines } from "@/lib/api";
import LoadingError from "@/components/LoadingError";
import LiftOverview from "@/components/lifting/LiftOverview";
import GoalProgress from "@/components/lifting/GoalProgress";
import GymSchedule from "@/components/lifting/GymSchedule";
import MuscleGroupBreakdown from "@/components/lifting/MuscleGroupBreakdown";
import VolumeCharts from "@/components/lifting/VolumeCharts";
import KeyExercises from "@/components/lifting/KeyExercises";
import RecentWorkouts from "@/components/lifting/RecentWorkouts";

export const revalidate = 300; // ISR: 5 minutes

export default async function LiftingPage() {
  try {
    const [data, routines] = await Promise.all([
      getLiftingDetail(),
      getLiftingRoutines(),
    ]);

    return (
      <div className="space-y-6 pb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Lifting</h1>
          <p className="text-gray-400 text-sm mt-1">
            Strength training overview and progression
          </p>
        </div>

        <LiftOverview overview={data.overview} />

        <GoalProgress exercises={data.key_exercises} />

        <GymSchedule routines={routines} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <MuscleGroupBreakdown data={data.muscle_group_breakdown} />
          <VolumeCharts progression={data.progression} />
        </div>

        <KeyExercises exercises={data.key_exercises} />

        <RecentWorkouts workouts={data.recent_workouts} />
      </div>
    );
  } catch (error) {
    return (
      <LoadingError
        tabName="lifting"
        errorMessage={error instanceof Error ? error.message : undefined}
      />
    );
  }
}
