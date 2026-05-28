"use client";

import { ACTIVITIES } from "@/lib/mock-data";
import type { Activity } from "@/lib/types";

export function useActivities(): { data: Activity[]; isLoading: boolean } {
  return { data: ACTIVITIES, isLoading: false };
}
