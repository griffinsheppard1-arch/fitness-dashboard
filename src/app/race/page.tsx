import { getRacePrepData } from "@/lib/api";
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
      <div className="text-center py-20">
        <p className="text-gray-400 text-lg">Unable to load race prep data</p>
        <p className="text-gray-600 text-sm mt-2">
          {error instanceof Error
            ? error.message
            : "Server may be waking up. Try again in a minute."}
        </p>
      </div>
    );
  }
}
