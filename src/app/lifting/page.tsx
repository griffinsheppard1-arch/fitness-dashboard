import { getLiftingDetail } from "@/lib/api";
import LoadingError from "@/components/LoadingError";
import LiftOverview from "@/components/lifting/LiftOverview";
import MuscleGroupBreakdown from "@/components/lifting/MuscleGroupBreakdown";
import KeyExercises from "@/components/lifting/KeyExercises";
import VolumeCharts from "@/components/lifting/VolumeCharts";
import RecentWorkouts from "@/components/lifting/RecentWorkouts";

export const revalidate = 300; // ISR: 5 minutes

export default async function LiftingPage() {
  try {
    const data = await getLiftingDetail();

    return (
      <div className="space-y-6 pb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Lifting</h1>
          <p className="text-gray-400 text-sm mt-1">
            Strength training overview and progression
          </p>
        </div>

        <LiftOverview overview={data.overview} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <MuscleGroupBreakdown data={data.muscle_group_breakdown} />
          <VolumeCharts
            weeklyTrend={data.weekly_trend}
            progression={data.progression}
          />
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
