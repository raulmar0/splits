import type { Athlete, Activity, PlannedWorkout, LoadPoint } from "./types";

export const ATHLETE: Athlete = {
  name: "Mateo R.",
  initials: "MR",
  ftp: 312,
  lthr: 172,
  maxHR: 192,
  weight: 71.4,
  vo2max: 58,
  hrv: 78,
  restingHR: 47,
};

export const ACTIVITIES: Activity[] = [
  { id: "a-1042", date: "2026-05-18", time: "07:14", sport: "ride", title: "Z2 ruta · Vuelta al embalse", dur: "2:42:18", dist: 78.4, elev: 612, tss: 142, np: 218, avgHR: 138, kj: 2210, if: 0.70 },
  { id: "a-1041", date: "2026-05-17", time: "06:55", sport: "run", title: "Long run progresivo", dur: "1:18:04", dist: 18.2, elev: 184, tss: 96, pace: "4:17", avgHR: 156, cad: 178, if: 0.83 },
  { id: "a-1040", date: "2026-05-15", time: "18:20", sport: "ride", title: "VO2 5x4'", dur: "1:14:32", dist: 38.1, elev: 256, tss: 118, np: 264, avgHR: 161, kj: 1180, if: 0.85 },
  { id: "a-1039", date: "2026-05-14", time: "07:02", sport: "swim", title: "Técnica + 8x100", dur: "0:46:10", dist: 2.4, elev: 0, tss: 52, avgHR: 132, if: 0.68 },
  { id: "a-1038", date: "2026-05-13", time: "17:45", sport: "strength", title: "Tren inferior — pesado", dur: "0:58:00", dist: 0, elev: 0, tss: 38, if: 0.55 },
  { id: "a-1037", date: "2026-05-12", time: "06:40", sport: "trail", title: "Trail Pedriza · técnico", dur: "1:42:11", dist: 14.6, elev: 740, tss: 110, pace: "7:00", avgHR: 162, if: 0.78 },
  { id: "a-1036", date: "2026-05-11", time: "08:10", sport: "ride", title: "Endurance largo + cafés", dur: "3:48:00", dist: 112, elev: 1240, tss: 198, np: 204, avgHR: 134, kj: 2890, if: 0.65 },
];

export const PLANNED_WORKOUTS: PlannedWorkout[] = [
  {
    id: "pw-201",
    date: "2026-05-19",
    sport: "ride",
    title: "VO2 5x4'",
    est: { dur: "1:15:00", tss: 118, if: 0.85 },
    blocks: [
      { kind: "WU", label: "Calentamiento", durationSec: 900, target: { type: "zone", value: "Z1-Z2" } },
      { kind: "INTERVAL", label: "VO2max", durationSec: 240, target: { type: "power", value: "330W" }, reps: 5, recovery: { kind: "REST", label: "Recuperación", durationSec: 180, target: { type: "zone", value: "Z1" } } },
      { kind: "CD", label: "Vuelta a la calma", durationSec: 600, target: { type: "zone", value: "Z1" } },
    ],
    source: "ai",
    status: "scheduled",
  },
  {
    id: "pw-202",
    date: "2026-05-20",
    sport: "ride",
    title: "Z2 fácil",
    est: { dur: "1:30:00", tss: 78, if: 0.65 },
    blocks: [
      { kind: "WU", label: "Calentamiento", durationSec: 600, target: { type: "zone", value: "Z1" } },
      { kind: "INTERVAL", label: "Z2 estable", durationSec: 4200, target: { type: "power", value: "200W" } },
      { kind: "CD", label: "Vuelta a la calma", durationSec: 600, target: { type: "zone", value: "Z1" } },
    ],
    source: "ai",
    status: "scheduled",
  },
  {
    id: "pw-203",
    date: "2026-05-21",
    sport: "run",
    title: "Tempo",
    est: { dur: "1:18:00", tss: 96, if: 0.80 },
    blocks: [
      { kind: "WU", label: "Calentamiento", durationSec: 900, target: { type: "zone", value: "Z1-Z2" } },
      { kind: "INTERVAL", label: "Tempo", durationSec: 1200, target: { type: "pace", value: "4:10/km" }, reps: 2, recovery: { kind: "REST", label: "Trote", durationSec: 180, target: { type: "zone", value: "Z1" } } },
      { kind: "CD", label: "Vuelta a la calma", durationSec: 600, target: { type: "zone", value: "Z1" } },
    ],
    source: "ai",
    status: "scheduled",
  },
  {
    id: "pw-204",
    date: "2026-05-22",
    sport: "swim",
    title: "Aerobic",
    est: { dur: "0:46:00", tss: 52, if: 0.68 },
    blocks: [
      { kind: "WU", label: "Calentamiento", durationSec: 600, target: { type: "zone", value: "Z1" } },
      { kind: "INTERVAL", label: "Aerobic", durationSec: 1800, target: { type: "pace", value: "1:45/100m" } },
      { kind: "CD", label: "Vuelta a la calma", durationSec: 360, target: { type: "zone", value: "Z1" } },
    ],
    source: "ai",
    status: "scheduled",
  },
  {
    id: "pw-205",
    date: "2026-05-23",
    sport: "strength",
    title: "Pesado",
    est: { dur: "0:58:00", tss: 38, if: 0.55 },
    blocks: [
      { kind: "WU", label: "Movilidad", durationSec: 600, target: { type: "rpe", value: "3" } },
      { kind: "INTERVAL", label: "Bloque principal", durationSec: 2400, target: { type: "rpe", value: "8" } },
      { kind: "CD", label: "Estiramientos", durationSec: 600, target: { type: "rpe", value: "2" } },
    ],
    source: "ai",
    status: "scheduled",
  },
  {
    id: "pw-206",
    date: "2026-05-24",
    sport: "trail",
    title: "Trail",
    est: { dur: "1:42:00", tss: 110, if: 0.78 },
    blocks: [
      { kind: "WU", label: "Calentamiento", durationSec: 900, target: { type: "zone", value: "Z1-Z2" } },
      { kind: "INTERVAL", label: "Trail técnico", durationSec: 4500, target: { type: "rpe", value: "6-7" } },
      { kind: "CD", label: "Vuelta a la calma", durationSec: 720, target: { type: "zone", value: "Z1" } },
    ],
    source: "ai",
    status: "scheduled",
  },
  {
    id: "pw-207",
    date: "2026-05-25",
    sport: "ride",
    title: "Largo +",
    est: { dur: "4:00:00", tss: 220, if: 0.72 },
    blocks: [
      { kind: "WU", label: "Calentamiento", durationSec: 1200, target: { type: "zone", value: "Z1-Z2" } },
      { kind: "INTERVAL", label: "Endurance", durationSec: 10800, target: { type: "power", value: "210W" } },
      { kind: "CD", label: "Vuelta a la calma", durationSec: 1200, target: { type: "zone", value: "Z1" } },
    ],
    source: "ai",
    status: "scheduled",
  },
];

function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function buildLoadSeries(days: number): LoadPoint[] {
  const rand = seeded(42);
  const points: LoadPoint[] = [];
  let ctl = 55;
  let atl = 60;
  const baseDate = new Date("2026-05-19");

  for (let i = days; i >= 0; i--) {
    const d = new Date(baseDate);
    d.setDate(d.getDate() - i);
    const tss = Math.round(40 + rand() * 160 + Math.sin(i / 7) * 30);
    ctl = ctl + (tss - ctl) / 42;
    atl = atl + (tss - atl) / 7;
    const tsb = ctl - atl;
    points.push({
      date: d.toISOString().slice(0, 10),
      ctl: Math.round(ctl * 10) / 10,
      atl: Math.round(atl * 10) / 10,
      tsb: Math.round(tsb * 10) / 10,
      tss,
    });
  }
  return points;
}

export const LOAD_DATA: LoadPoint[] = buildLoadSeries(84);
