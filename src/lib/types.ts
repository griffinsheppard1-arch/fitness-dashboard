export interface ExerciseSet {
  weight_lbs: number;
  reps: number;
  set_type?: string;
}

export interface OverloadSuggestion {
  suggestion: string;
  action: "increase" | "hold" | "deload";
  suggested_weight_lbs?: number;
  suggested_reps?: number;
}

export interface RecentSession {
  date: string;
  workout_title?: string;
  sets: ExerciseSet[];
}

export interface ExerciseData {
  name: string;
  target_sets: ExerciseSet[];
  rest_seconds?: number;
  suggestion: OverloadSuggestion;
  recent_sessions: RecentSession[];
  est_1rm_lbs?: number;
}

export interface RunPlan {
  summary: string;
  description?: string;
  distance_miles?: number;
  duration_seconds?: number;
  workout_type?: string;
}

export interface RecentRun {
  date: string;
  name?: string;
  distance_miles: number;
  pace?: string;
  duration?: string;
  avg_hr?: number;
}

export interface NutritionData {
  yesterday_date: string;
  calories: number;
  goal_calories: number;
  protein_g: number;
  goal_protein_g: number;
  carbs_g: number;
  fat_g: number;
}

export interface DailyData {
  date: string;
  day_name: string;
  display_date: string;
  workout_type: "double" | "gym" | "run" | "rest";
  greeting: string;
  lifting?: {
    routine_name: string;
    exercises: ExerciseData[];
  };
  running?: {
    planned: RunPlan[];
    recent_runs: RecentRun[];
  };
  nutrition?: NutritionData;
}

// Weekly types
export interface AdherenceDay {
  day: string;
  planned_gym?: string;
  planned_run?: string;
  completed_gym?: boolean;
  completed_run?: boolean;
}

export interface RunningStats {
  runs: number;
  miles: number;
  pace?: string;
  time?: string;
  time_seconds?: number;
  avg_hr?: number;
  elevation_m?: number;
}

export interface LiftingStats {
  workouts: number;
  total_sets: number;
  volume_lbs: number;
  duration?: string;
}

export interface LiftTrend {
  week_start: string;
  max_weight_lbs: number;
  est_1rm_lbs: number;
  total_sets: number;
  total_volume_lbs: number;
}

export interface KeyLift {
  name: string;
  session_count: number;
  total_sets: number;
  max_weight_lbs: number;
  est_1rm_lbs?: number;
  trend: LiftTrend[];
  recent_sessions: RecentSession[];
}

export interface WeeklyNutrition {
  this_week: {
    days_tracked: number;
    avg_calories: number;
    avg_goal_calories: number;
    avg_protein_g: number;
    avg_goal_protein_g: number;
    avg_carbs_g: number;
    avg_goal_carbs_g: number;
    avg_fat_g: number;
    avg_goal_fat_g: number;
  };
  last_week?: {
    days_tracked: number;
    avg_calories: number;
    avg_goal_calories: number;
    avg_protein_g: number;
    avg_goal_protein_g: number;
    avg_carbs_g: number;
    avg_goal_carbs_g: number;
    avg_fat_g: number;
    avg_goal_fat_g: number;
  };
  training_day_avg_cal?: number;
  rest_day_avg_cal?: number;
}

export interface NextWeekDay {
  date: string;
  day_name: string;
  gym?: string;
  run?: string;
}

export interface WeeklyData {
  week_start: string;
  week_end: string;
  display_range: string;
  adherence: {
    planned: number;
    completed: number;
    percentage: number;
    days: AdherenceDay[];
  };
  running: {
    this_week: RunningStats;
    last_week: RunningStats;
    four_week_avg: RunningStats;
    twelve_week_avg: RunningStats;
  };
  lifting: {
    this_week: LiftingStats;
    last_week: LiftingStats;
    key_lifts?: KeyLift[];
  };
  nutrition?: WeeklyNutrition;
  next_week: NextWeekDay[];
}

// Trend types for charts
export interface RunningTrendPoint {
  week_start: string;
  miles: number;
  pace?: string;
  pace_seconds?: number;
  runs: number;
  avg_hr?: number;
  elevation_m: number;
  time_seconds: number;
}

export interface LiftingTrendPoint {
  week_start: string;
  workouts: number;
  total_sets: number;
  volume_lbs: number;
}
