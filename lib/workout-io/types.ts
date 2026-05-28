import type { Block, Sport } from "@/lib/types";

export interface ParsedActivity {
  date: string;
  time: string;
  sport: Sport;
  title: string;
  durationSec: number;
  distanceM: number;
  elevationM: number;
  tss?: number;
  intensityFactor?: number;
  np?: number;
  avgHR?: number;
  cadence?: number;
  kj?: number;
  pace?: string;
  externalId?: string;
}

export interface ParsedWorkout {
  title: string;
  sport: Sport;
  estDurationSec: number;
  estTSS?: number;
  estIF?: number;
  blocks: Block[];
  notes?: string;
}

export type ParseResult =
  | { kind: "activity"; data: ParsedActivity }
  | { kind: "workout"; data: ParsedWorkout };

export class ParseError extends Error {
  constructor(message: string, public detail?: unknown) {
    super(message);
    this.name = "ParseError";
  }
}
