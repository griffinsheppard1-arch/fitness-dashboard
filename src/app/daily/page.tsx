import { Suspense } from "react";
import { getDailyData } from "@/lib/api";
import DailyBrief from "@/components/DailyBrief";
import DatePicker from "@/components/DatePicker";
import LoadingError from "@/components/LoadingError";

export const revalidate = 300; // ISR: 5 minutes

interface DailyPageProps {
  searchParams: Promise<{ date?: string }>;
}

export default async function DailyPage({ searchParams }: DailyPageProps) {
  const params = await searchParams;
  const date = params.date || undefined;

  try {
    const data = await getDailyData(date);
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Daily Brief</h1>
            <p className="text-gray-400 text-sm mt-1">
              {data.greeting || `${data.day_name} — ${data.display_date}`}
            </p>
          </div>
          <Suspense fallback={null}>
            <DatePicker />
          </Suspense>
        </div>
        <DailyBrief data={data} />
      </div>
    );
  } catch (error) {
    return (
      <LoadingError
        tabName="daily brief"
        errorMessage={error instanceof Error ? error.message : undefined}
      />
    );
  }
}
