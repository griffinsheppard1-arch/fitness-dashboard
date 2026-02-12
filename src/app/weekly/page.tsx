import { getWeeklyData, getRunningTrend, getLiftingTrend } from "@/lib/api";
import WeeklyDashboard from "@/components/WeeklyDashboard";
import LoadingError from "@/components/LoadingError";

export const revalidate = 300; // ISR: 5 minutes

export default async function WeeklyPage() {
  try {
    const [data, runTrend, liftTrend] = await Promise.all([
      getWeeklyData(),
      getRunningTrend(12),
      getLiftingTrend(12),
    ]);
    return (
      <WeeklyDashboard data={data} runTrend={runTrend} liftTrend={liftTrend} />
    );
  } catch (error) {
    return (
      <LoadingError
        tabName="weekly summary"
        errorMessage={error instanceof Error ? error.message : undefined}
      />
    );
  }
}
