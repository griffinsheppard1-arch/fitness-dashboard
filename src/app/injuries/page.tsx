import { getInjuriesDetail } from "@/lib/api";
import LoadingError from "@/components/LoadingError";
import InjuryOverview from "@/components/injuries/InjuryOverview";
import WorkoutModifications from "@/components/injuries/WorkoutModifications";
import InjuryHistory from "@/components/injuries/InjuryHistory";
import InjuriesClientSection from "@/components/injuries/InjuriesClientSection";

export const revalidate = 60; // More frequent for user-entered data

export default async function InjuriesPage() {
  try {
    const data = await getInjuriesDetail();

    if (!data.available) {
      return (
        <div className="space-y-6">
          <InjuryOverview overview={data.overview} />
          <div className="bg-gray-900 border border-amber-900/30 rounded-xl p-8 text-center">
            <p className="text-amber-300 font-medium">
              Injury tracking is not yet configured
            </p>
            <p className="text-gray-400 text-sm mt-2">
              Supabase needs to be set up to enable persistent injury tracking.
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <InjuryOverview overview={data.overview} />

        <WorkoutModifications
          modifications={data.modifications}
          upcomingRuns={data.upcoming_runs}
          todayRoutine={data.today_routine}
        />

        <InjuriesClientSection heatmap={data.heatmap} />

        <InjuryHistory injuries={data.injuries} />
      </div>
    );
  } catch (error) {
    return (
      <LoadingError
        tabName="injuries"
        errorMessage={error instanceof Error ? error.message : undefined}
      />
    );
  }
}
