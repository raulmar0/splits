"use client";

import { LOAD_DATA } from "@/lib/mock-data";
import type { LoadPoint } from "@/lib/types";

export function useLoad(): { data: LoadPoint[]; isLoading: boolean } {
  return { data: LOAD_DATA, isLoading: false };
}
