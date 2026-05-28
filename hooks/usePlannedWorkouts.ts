"use client";

import { PLANNED_WORKOUTS } from "@/lib/mock-data";
import type { PlannedWorkout } from "@/lib/types";

export function usePlannedWorkouts(): { data: PlannedWorkout[]; isLoading: boolean } {
  return { data: PLANNED_WORKOUTS, isLoading: false };
}
