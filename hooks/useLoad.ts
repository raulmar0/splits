"use client";

import { useMemo } from "react";
import type { LoadPoint } from "@/lib/types";
import { computeLoadSeries } from "@/lib/load";
import { useActivities } from "./useActivities";

const DEFAULT_DAYS = 84;

export function useLoad(days: number = DEFAULT_DAYS): { data: LoadPoint[]; isLoading: boolean } {
  const { data: activities, isLoading } = useActivities();
  const data = useMemo(() => computeLoadSeries(activities, days), [activities, days]);
  return { data, isLoading };
}
