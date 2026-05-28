"use client";

import { useEffect, useState } from "react";
import type { PlannedWorkout } from "@/lib/types";

export function usePlannedWorkouts(): { data: PlannedWorkout[]; isLoading: boolean } {
  const [data, setData] = useState<PlannedWorkout[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/planned-workouts", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : { planned: [] }))
      .then((d) => {
        if (!cancelled) setData((d.planned as PlannedWorkout[]) ?? []);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { data, isLoading };
}
