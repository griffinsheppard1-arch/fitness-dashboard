import type {
  DailyData,
  WeeklyData,
  RunningTrendPoint,
  LiftingTrendPoint,
  RunningDetailData,
  RunningScheduleData,
  LiftingDetailData,
  LiftingRoutinesData,
  NutritionDetailData,
  RacePrepData,
  InjuriesDetailData,
} from "./types";

const API_URL =
  process.env.RENDER_API_URL || "https://strava-mcp-e0fy.onrender.com";
const API_KEY = process.env.API_KEY || "";

async function fetchAPI<T>(path: string, revalidate = 300): Promise<T> {
  const maxRetries = 2;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const res = await fetch(`${API_URL}${path}`, {
      headers: { Authorization: `Bearer ${API_KEY}` },
      next: { revalidate },
    });
    if (res.ok) return res.json();
    if (attempt < maxRetries && [502, 503, 504].includes(res.status)) {
      await new Promise((r) => setTimeout(r, 3000 * (attempt + 1)));
      continue;
    }
    throw new Error(`API error ${res.status}: ${await res.text()}`);
  }
  throw new Error("Max retries exceeded");
}

// Existing endpoints
export async function getDailyData(date?: string): Promise<DailyData> {
  const params = date ? `?date=${date}` : "";
  return fetchAPI<DailyData>(`/api/dashboard/daily${params}`);
}

export async function getWeeklyData(weekStart?: string): Promise<WeeklyData> {
  const params = weekStart ? `?week_start=${weekStart}` : "";
  return fetchAPI<WeeklyData>(`/api/dashboard/weekly${params}`);
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

// New endpoints for V2 tabs
export async function getRunningDetail(): Promise<RunningDetailData> {
  return fetchAPI<RunningDetailData>("/api/running/detail");
}

export async function getRunningSchedule(): Promise<RunningScheduleData> {
  return fetchAPI<RunningScheduleData>("/api/running/schedule");
}

export async function getLiftingDetail(): Promise<LiftingDetailData> {
  return fetchAPI<LiftingDetailData>("/api/lifting/detail");
}

export async function getLiftingRoutines(): Promise<LiftingRoutinesData> {
  return fetchAPI<LiftingRoutinesData>("/api/lifting/routines");
}

export async function getNutritionDetail(): Promise<NutritionDetailData> {
  return fetchAPI<NutritionDetailData>("/api/nutrition/detail");
}

export async function getRacePrepData(): Promise<RacePrepData> {
  return fetchAPI<RacePrepData>("/api/race/prep");
}

export async function getInjuriesDetail(): Promise<InjuriesDetailData> {
  return fetchAPI<InjuriesDetailData>("/api/injuries/detail");
}
