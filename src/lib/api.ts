import type {
  DailyData,
  WeeklyData,
  RunningTrendPoint,
  LiftingTrendPoint,
} from "./types";

const API_URL =
  process.env.RENDER_API_URL || "https://strava-mcp-e0fy.onrender.com";
const API_KEY = process.env.API_KEY || "";

async function fetchAPI<T>(path: string, revalidate = 300): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { Authorization: `Bearer ${API_KEY}` },
    next: { revalidate },
  });
  if (!res.ok) {
    throw new Error(`API error ${res.status}: ${await res.text()}`);
  }
  return res.json();
}

export async function getDailyData(): Promise<DailyData> {
  return fetchAPI<DailyData>("/api/dashboard/daily");
}

export async function getWeeklyData(): Promise<WeeklyData> {
  return fetchAPI<WeeklyData>("/api/dashboard/weekly");
}

export async function getRunningTrend(
  weeks = 12
): Promise<RunningTrendPoint[]> {
  return fetchAPI<RunningTrendPoint[]>(`/api/running/trend?weeks=${weeks}`);
}

export async function getLiftingTrend(
  weeks = 12
): Promise<LiftingTrendPoint[]> {
  return fetchAPI<LiftingTrendPoint[]>(`/api/lifting/trend?weeks=${weeks}`);
}
