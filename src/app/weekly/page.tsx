import { getWeeklyData, getRunningTrend, getLiftingTrend } from "@/lib/api";
import WeeklyDashboard from "@/components/WeeklyDashboard";

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
      <div className="text-center py-20">
        <p className="text-gray-400 text-lg">Unable to load weekly summary</p>
        <p className="text-gray-600 text-sm mt-2">
          {error instanceof Error ? error.message : "Server may be waking up. Try again in a minute."}
        </p>
      </div>
    );
  }
}
