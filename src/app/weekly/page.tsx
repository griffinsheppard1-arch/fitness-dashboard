import { Suspense } from "react";
import { getWeeklyData, getRunningTrend, getLiftingTrend } from "@/lib/api";
import WeeklyDashboard from "@/components/WeeklyDashboard";
import WeekPicker from "@/components/WeekPicker";
import LoadingError from "@/components/LoadingError";

export const revalidate = 300; // ISR: 5 minutes

interface WeeklyPageProps {
  searchParams: Promise<{ week?: string }>;
}

export default async function WeeklyPage({ searchParams }: WeeklyPageProps) {
  const params = await searchParams;
  const weekStart = params.week || undefined;

  try {
    const [data, runTrend, liftTrend] = await Promise.all([
      getWeeklyData(weekStart),
      getRunningTrend(12),
      getLiftingTrend(12),
    ]);
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Weekly Summary</h1>
            <p className="text-gray-400 text-sm mt-1">
              Training overview and trends
            </p>
          </div>
          <Suspense fallback={null}>
            <WeekPicker />
          </Suspense>
        </div>
        <WeeklyDashboard data={data} runTrend={runTrend} liftTrend={liftTrend} />
      </div>
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
