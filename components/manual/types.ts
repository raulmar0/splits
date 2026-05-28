import type { Block, Sport } from "@/lib/types";

export interface WorkoutFormData {
  title: string;
  date: string;
  time: string;
  sport: Sport;
  targetDur: string;
  targetDist: string;
  targetTSS: string;
  targetIF: string;
  notes: string;
  blocks: Block[];
}
