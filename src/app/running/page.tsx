import { getRunningDetail } from "@/lib/api";
import RunOverview from "@/components/running/RunOverview";
import UpcomingRuns from "@/components/running/UpcomingRuns";
import RecentRuns from "@/components/running/RecentRuns";
import PerformanceCharts from "@/components/running/PerformanceCharts";
import PlanCompliance from "@/components/running/PlanCompliance";
import SuggestedRoutes from "@/components/running/SuggestedRoutes";
import LoadingError from "@/components/LoadingError";

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

        {/* Upcoming Runs */}
        {data.upcoming_runs && data.upcoming_runs.length > 0 && (
          <section>
            <UpcomingRuns runs={data.upcoming_runs} />
          </section>
        )}

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

        {/* Suggested Routes */}
        <section>
          <SuggestedRoutes />
        </section>
      </div>
    );
  } catch (error) {
    return (
      <LoadingError
        tabName="running"
        errorMessage={error instanceof Error ? error.message : undefined}
      />
    );
  }
}
