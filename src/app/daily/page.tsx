import { getDailyData } from "@/lib/api";
import DailyBrief from "@/components/DailyBrief";

export const revalidate = 300; // ISR: 5 minutes

export default async function DailyPage() {
  try {
    const data = await getDailyData();
    return <DailyBrief data={data} />;
  } catch (error) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-400 text-lg">Unable to load daily brief</p>
        <p className="text-gray-600 text-sm mt-2">
          {error instanceof Error ? error.message : "Server may be waking up. Try again in a minute."}
        </p>
      </div>
    );
  }
}
