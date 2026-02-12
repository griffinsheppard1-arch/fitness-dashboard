// ============================================================
// Shared / Common types
// ============================================================
export interface ExerciseSet {
  weight_lbs: number;
  reps: number;
  set_type?: string;
  rpe?: number;
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

// ============================================================
// Daily types
// ============================================================
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

// ============================================================
// Weekly types
// ============================================================
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

// ============================================================
// Trend types for charts
// ============================================================
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

// ============================================================
// Running Tab types
// ============================================================
export interface RunSplit {
  mile: number;
  pace?: string;
  pace_seconds?: number;
  elevation_diff: number;
  avg_hr?: number;
  cadence?: number;
}

export interface BestEffort {
  name: string;
  elapsed_time: number;
  elapsed_display: string;
}

export interface RunActivity {
  id: number;
  date: string;
  name: string;
  distance_miles: number;
  pace?: string;
  pace_seconds?: number;
  duration?: string;
  duration_seconds: number;
  avg_hr?: number;
  max_hr?: number;
  elevation_m: number;
  suffer_score?: number;
  cadence?: number;
  stride_length?: number;
  summary_polyline?: string;
  start_latlng?: string;
  splits?: RunSplit[];
  best_efforts?: BestEffort[];
}

export interface PersonalRecord {
  name: string;
  date: string;
  distance_miles: number;
  pace?: string;
  duration?: string;
  value: number;
}

export interface PlanComplianceDay {
  date: string;
  planned_summary?: string;
  planned_miles?: number;
  completed: boolean;
  actual_miles?: number;
}

export interface UpcomingRun {
  date: string;
  summary?: string;
  distance_miles?: number;
  duration_seconds?: number;
  workout_type?: string;
}

export interface RunningDetailData {
  overview: {
    all_time_miles: number;
    all_time_runs: number;
    month_miles: number;
    month_runs: number;
    week_miles: number;
    week_runs: number;
    month_avg_pace?: string;
    month_avg_pace_seconds?: number;
  };
  personal_records: Record<string, PersonalRecord>;
  runs: RunActivity[];
  weekly_trend: RunningTrendPoint[];
  plan_compliance: PlanComplianceDay[];
  upcoming_runs?: UpcomingRun[];
}

// ============================================================
// Running Schedule types
// ============================================================
export interface ScheduleEvent {
  date: string;
  summary?: string;
  planned_miles?: number;
  workout_type?: string;
  completed?: boolean;
  actual_miles?: number;
}

export interface WeeklyComparison {
  week_start: string;
  planned_miles: number;
  actual_miles: number;
  planned_runs: number;
  actual_runs: number;
}

export interface RunningScheduleData {
  past_events: ScheduleEvent[];
  future_events: ScheduleEvent[];
  weekly_comparison: WeeklyComparison[];
}

// ============================================================
// Lifting Tab types
// ============================================================
export interface MuscleGroupData {
  muscle_group: string;
  total_sets: number;
  exercise_count: number;
}

export interface KeyExercise {
  name: string;
  session_count: number;
  total_sets: number;
  muscle_group: string;
  current_weight_lbs?: number;
  est_1rm_lbs?: number;
  suggestion: OverloadSuggestion;
  trend: LiftTrend[];
}

export interface WorkoutExercise {
  name: string;
  sets: ExerciseSet[];
}

export interface RecentWorkout {
  id: string;
  date: string;
  title: string;
  duration?: string;
  exercises: WorkoutExercise[];
}

export interface LiftingProgressionExercise {
  name: string;
  session_count: number;
  trend: LiftTrend[];
}

export interface LiftingDetailData {
  overview: {
    all_time_workouts: number;
    month_workouts: number;
    week_workouts: number;
    avg_sessions_per_week: number;
    week_volume_lbs: number;
    month_volume_lbs: number;
  };
  muscle_group_breakdown: MuscleGroupData[];
  key_exercises: KeyExercise[];
  weekly_trend: LiftingTrendPoint[];
  progression: LiftingProgressionExercise[];
  recent_workouts: RecentWorkout[];
}

export interface RoutineExercise {
  name: string;
  sets: ExerciseSet[];
  rest_seconds?: number;
}

export interface Routine {
  id: string;
  title: string;
  day_of_week?: string;
  exercises: RoutineExercise[];
}

export interface LiftingRoutinesData {
  routines: Routine[];
}

// ============================================================
// Nutrition Tab types
// ============================================================
export interface DailyNutritionTrend {
  date: string;
  calories: number;
  goal_calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  is_training_day: boolean;
}

export interface FrequentFood {
  food_name: string;
  times_logged: number;
  avg_calories: number;
  avg_protein_g: number;
  avg_carbs_g: number;
  avg_fat_g: number;
}

export interface NutritionWeeklyTrend {
  week_start: string;
  days_tracked: number;
  avg_calories: number;
  avg_goal_calories: number;
  avg_protein_g: number;
  avg_carbs_g: number;
  avg_fat_g: number;
}

export interface NutritionDetailData {
  overview: {
    today?: {
      calories: number;
      goal_calories: number;
      protein_g: number;
      goal_protein_g: number;
      carbs_g: number;
      goal_carbs_g: number;
      fat_g: number;
      goal_fat_g: number;
    };
    weekly_summary?: {
      days_tracked: number;
      avg_calories: number;
      avg_protein_g: number;
      avg_carbs_g: number;
      avg_fat_g: number;
    };
    protein_hit_rate: number;
    days_tracked_this_month: number;
  };
  calorie_trend: DailyNutritionTrend[];
  macro_split?: {
    protein_pct: number;
    carbs_pct: number;
    fat_pct: number;
  };
  training_day_analysis?: {
    training_day_avg_cal: number;
    rest_day_avg_cal: number;
    training_days_count: number;
    rest_days_count: number;
  };
  frequent_foods: FrequentFood[];
  weekly_trend: NutritionWeeklyTrend[];
}

// ============================================================
// Race Prep Tab types
// ============================================================
export interface TaperWeek {
  week_start: string;
  miles: number;
  runs: number;
}

export interface ReadinessFactor {
  score: number;
  label: string;
  detail: string;
}

export interface PacePrediction {
  predicted_time_seconds: number;
  predicted_time: string;
  pace_per_mile: string;
  pace_seconds: number;
  basis: string;
}

export interface TrainingEvent {
  date: string;
  summary?: string;
  distance_miles?: number;
  workout_type?: string;
}

export interface RacePrepData {
  race_name: string;
  race_date: string;
  race_location: string;
  days_to_race: number;
  phase: string;
  phase_label: string;
  taper: {
    weekly_mileage: TaperWeek[];
    peak_mileage: number;
    current_week_miles: number;
    taper_reduction_pct: number;
  };
  upcoming_training: TrainingEvent[];
  readiness: {
    overall_score: number;
    factors: Record<string, ReadinessFactor>;
  };
  pace_prediction?: {
    best_prediction: PacePrediction;
    all_predictions: Record<string, PacePrediction>;
  };
  training_block: {
    start_date: string;
    total_miles: number;
    total_runs: number;
    total_elevation_m: number;
    longest_run_miles: number;
    quality_sessions: number;
  };
}

// ============================================================
// Injuries Tab
// ============================================================
export interface Injury {
  id: number;
  body_part: string;
  body_side?: string | null;
  injury_type: string;
  severity: number;
  onset_date: string;
  resolved_date?: string | null;
  description?: string | null;
  notes?: string | null;
  status: "active" | "recovering" | "resolved";
  days_since_onset: number;
  duration_days: number;
  created_at?: string;
  updated_at?: string;
}

export interface BodyPartHeatmap {
  body_part: string;
  body_side?: string | null;
  injury_count: number;
  avg_severity: number;
  max_severity: number;
  active_count: number;
}

export interface WorkoutModification {
  injury_type: string;
  body_part: string;
  severity: number;
  running_mod?: string;
  lifting_mod?: string;
}

export interface InjuryFormData {
  body_part: string;
  body_side?: string | null;
  injury_type: string;
  severity: number;
  onset_date: string;
  resolved_date?: string | null;
  description?: string;
  notes?: string;
  status: "active" | "recovering" | "resolved";
}

export interface InjuriesDetailData {
  available: boolean;
  overview: {
    total_injuries: number;
    active_injuries: number;
    most_affected_area?: string | null;
    avg_recovery_days?: number | null;
  };
  injuries: Injury[];
  active_injuries: Injury[];
  heatmap: BodyPartHeatmap[];
  modifications: WorkoutModification[];
  upcoming_runs: { date: string; summary?: string; distance_miles?: number }[];
  today_routine?: { name: string; exercises: string[] } | null;
}
