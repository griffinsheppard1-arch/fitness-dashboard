import { getRacePrepData } from "@/lib/api";
import LoadingError from "@/components/LoadingError";
import RaceCountdown from "@/components/race/RaceCountdown";
import TaperTracker from "@/components/race/TaperTracker";
import ReadinessScore from "@/components/race/ReadinessScore";
import PaceCalculator from "@/components/race/PaceCalculator";
import TrainingBlockSummary from "@/components/race/TrainingBlockSummary";

export const revalidate = 300; // ISR: 5 minutes

export default async function RacePrepPage() {
  try {
    const data = await getRacePrepData();

    return (
      <div className="space-y-6">
        {/* Hero countdown */}
        <RaceCountdown data={data} />

        {/* Two-column layout for readiness + pace */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ReadinessScore data={data} />
          <PaceCalculator data={data} />
        </div>

        {/* Taper chart — full width */}
        <TaperTracker data={data} />

        {/* Training block summary */}
        <TrainingBlockSummary data={data} />
      </div>
    );
  } catch (error) {
    return (
      <LoadingError
        tabName="race prep"
        errorMessage={error instanceof Error ? error.message : undefined}
      />
    );
  }
}
