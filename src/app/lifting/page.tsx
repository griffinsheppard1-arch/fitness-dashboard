import { getLiftingDetail } from "@/lib/api";
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
      <div className="text-center py-20">
        <p className="text-gray-400 text-lg">Unable to load lifting data</p>
        <p className="text-gray-600 text-sm mt-2">
          {error instanceof Error
            ? error.message
            : "Server may be waking up. Try again in a minute."}
        </p>
      </div>
    );
  }
}
