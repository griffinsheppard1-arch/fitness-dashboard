import { getDailyData } from "@/lib/api";
import DailyBrief from "@/components/DailyBrief";
import LoadingError from "@/components/LoadingError";

export const revalidate = 300; // ISR: 5 minutes

export default async function DailyPage() {
  try {
    const data = await getDailyData();
    return <DailyBrief data={data} />;
  } catch (error) {
    return (
      <LoadingError
        tabName="daily brief"
        errorMessage={error instanceof Error ? error.message : undefined}
      />
    );
  }
}
