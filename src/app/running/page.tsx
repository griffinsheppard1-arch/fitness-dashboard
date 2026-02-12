import { getRunningDetail } from "@/lib/api";
import RunOverview from "@/components/running/RunOverview";
import RecentRuns from "@/components/running/RecentRuns";
import PerformanceCharts from "@/components/running/PerformanceCharts";
import PlanCompliance from "@/components/running/PlanCompliance";

export const revalidate = 300; // ISR: 5 minutes

export default async function RunningPage() {
  try {
    const data = await getRunningDetail();

    return (
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold">Running</h1>
          <p className="text-gray-400 text-sm">
            {data.overview.all_time_runs.toLocaleString()} runs logged
          </p>
        </div>

        {/* Overview Stats */}
        <section>
          <RunOverview overview={data.overview} />
        </section>

        {/* Performance Charts */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-200">
            Performance Trends
          </h2>
          <PerformanceCharts trend={data.weekly_trend} />
        </section>

        {/* Plan Compliance */}
        {data.plan_compliance && data.plan_compliance.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-200">
              Runna Plan Compliance
            </h2>
            <PlanCompliance compliance={data.plan_compliance} />
          </section>
        )}

        {/* Recent Runs */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-200">
            Recent Runs
          </h2>
          <RecentRuns runs={data.runs} />
        </section>
      </div>
    );
  } catch (error) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-400 text-lg">Unable to load running data</p>
        <p className="text-gray-600 text-sm mt-2">
          {error instanceof Error
            ? error.message
            : "Server may be waking up. Try again in a minute."}
        </p>
      </div>
    );
  }
}
