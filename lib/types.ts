export type Sport = "ride" | "run" | "swim" | "strength" | "trail" | "mtb" | "rest";

export interface Athlete {
  name: string;
  initials: string;
  ftp: number;
  lthr: number;
  maxHR: number;
  weight: number;
  vo2max: number;
  hrv: number;
  restingHR: number;
}

export interface Activity {
  id: string;
  date: string;
  time: string;
  sport: Sport;
  title: string;
  dur: string;
  dist: number;
  elev: number;
  tss: number;
  if: number;
  np?: number;
  avgHR?: number;
  pace?: string;
  cad?: number;
  kj?: number;
}

export interface PlannedWorkout {
  id: string;
  date: string;
  sport: Sport;
  title: string;
  est: { dur: string; dist?: number; tss: number; if: number };
  blocks: Block[];
  notes?: string;
  source: "manual" | "ai" | "template" | "imported";
  status: "draft" | "scheduled" | "completed" | "skipped";
}

export interface Block {
  kind: "WU" | "INTERVAL" | "REST" | "CD";
  label: string;
  durationSec: number;
  target: { type: "power" | "hr" | "pace" | "zone" | "rpe"; value: string };
  reps?: number;
  recovery?: Block;
  color?: string;
}

export interface LoadPoint {
  date: string;
  ctl: number;
  atl: number;
  tsb: number;
  tss: number;
}
