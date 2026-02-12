export interface LiftingGoal {
  patterns: string[];
  goalWeight: number;
  goalReps: number;
  label: string;
  altLabel?: string;
}

export const LIFTING_GOALS: LiftingGoal[] = [
  {
    patterns: ["bench press"],
    goalWeight: 225,
    goalReps: 5,
    label: "Bench 225×5",
  },
  {
    patterns: ["squat", "back squat"],
    goalWeight: 225,
    goalReps: 10,
    label: "Squat 225×10",
  },
  {
    patterns: ["deadlift"],
    goalWeight: 315,
    goalReps: 5,
    label: "Deadlift 315×5",
  },
  {
    patterns: ["pull up", "pullup", "pull-up"],
    goalWeight: 45,
    goalReps: 5,
    label: "Pullups +45lb ×5",
    altLabel: "or 25 BW pullups",
  },
];

export function matchGoal(exerciseName: string): LiftingGoal | null {
  const lower = exerciseName.toLowerCase();
  return (
    LIFTING_GOALS.find((g) =>
      g.patterns.some((p) => lower.includes(p))
    ) || null
  );
}

export function computeGoalProgress(
  currentWeight: number,
  currentReps: number,
  goal: LiftingGoal
): number {
  // Weight accounts for 70% of progress, reps 30%
  const weightPct = Math.min(currentWeight / goal.goalWeight, 1);
  const repsPct = Math.min(currentReps / goal.goalReps, 1);
  return Math.round((weightPct * 0.7 + repsPct * 0.3) * 100);
}
