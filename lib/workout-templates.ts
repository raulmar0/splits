import type { Block, Sport } from "./types";

export interface WorkoutTemplate {
  id: string;
  name: string;
  sport: Sport;
  duration: string;
  estDurationSec: number;
  estTSS: number;
  estIF: number;
  blocks: Block[];
}

export const WORKOUT_TEMPLATES: WorkoutTemplate[] = [
  {
    id: "vo2-5x4",
    name: "VO2max 5x4'",
    sport: "ride",
    duration: "1h 15'",
    estDurationSec: 4500,
    estTSS: 118,
    estIF: 0.85,
    blocks: [
      { kind: "WU", label: "Calentamiento", durationSec: 900, target: { type: "zone", value: "Z1-Z2" } },
      {
        kind: "INTERVAL",
        label: "VO2max",
        durationSec: 240,
        target: { type: "power", value: "105% FTP" },
        reps: 5,
        recovery: { kind: "REST", label: "Recuperación", durationSec: 180, target: { type: "zone", value: "Z1" } },
      },
      { kind: "CD", label: "Vuelta a la calma", durationSec: 600, target: { type: "zone", value: "Z1" } },
    ],
  },
  {
    id: "ss-2x20",
    name: "Sweet Spot 2x20'",
    sport: "ride",
    duration: "1h 30'",
    estDurationSec: 5400,
    estTSS: 105,
    estIF: 0.83,
    blocks: [
      { kind: "WU", label: "Calentamiento", durationSec: 900, target: { type: "zone", value: "Z1-Z2" } },
      {
        kind: "INTERVAL",
        label: "Sweet Spot",
        durationSec: 1200,
        target: { type: "power", value: "88% FTP" },
        reps: 2,
        recovery: { kind: "REST", label: "Recuperación", durationSec: 300, target: { type: "zone", value: "Z1" } },
      },
      { kind: "CD", label: "Vuelta a la calma", durationSec: 600, target: { type: "zone", value: "Z1" } },
    ],
  },
  {
    id: "long-run-z2",
    name: "Long run Z2",
    sport: "run",
    duration: "1h 30'",
    estDurationSec: 5400,
    estTSS: 90,
    estIF: 0.72,
    blocks: [
      { kind: "WU", label: "Calentamiento", durationSec: 600, target: { type: "zone", value: "Z1" } },
      { kind: "INTERVAL", label: "Z2 estable", durationSec: 4200, target: { type: "zone", value: "Z2" } },
      { kind: "CD", label: "Trote suave", durationSec: 600, target: { type: "zone", value: "Z1" } },
    ],
  },
  {
    id: "tempo-3x10",
    name: "Tempo 3x10'",
    sport: "run",
    duration: "1h 00'",
    estDurationSec: 3600,
    estTSS: 78,
    estIF: 0.80,
    blocks: [
      { kind: "WU", label: "Calentamiento", durationSec: 600, target: { type: "zone", value: "Z1-Z2" } },
      {
        kind: "INTERVAL",
        label: "Tempo",
        durationSec: 600,
        target: { type: "pace", value: "4:10/km" },
        reps: 3,
        recovery: { kind: "REST", label: "Trote", durationSec: 180, target: { type: "zone", value: "Z1" } },
      },
      { kind: "CD", label: "Vuelta a la calma", durationSec: 420, target: { type: "zone", value: "Z1" } },
    ],
  },
  {
    id: "swim-tecnica",
    name: "Técnica nado",
    sport: "swim",
    duration: "0h 45'",
    estDurationSec: 2700,
    estTSS: 50,
    estIF: 0.68,
    blocks: [
      { kind: "WU", label: "Calentamiento", durationSec: 600, target: { type: "zone", value: "Z1" } },
      { kind: "INTERVAL", label: "Drills + 8x100", durationSec: 1500, target: { type: "pace", value: "1:45/100m" } },
      { kind: "CD", label: "Suave", durationSec: 600, target: { type: "zone", value: "Z1" } },
    ],
  },
];
