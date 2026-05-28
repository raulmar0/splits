"use client";

import { useEffect, useState } from "react";
import type { Activity } from "@/lib/types";

export function useActivities(): { data: Activity[]; isLoading: boolean } {
  const [data, setData] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/activities", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : { activities: [] }))
      .then((d) => {
        if (!cancelled) setData((d.activities as Activity[]) ?? []);
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
