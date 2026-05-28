import { XMLParser } from "fast-xml-parser";
import type { Block } from "@/lib/types";
import { mapZwoSport } from "./sport-map";
import { ParseError, type ParseResult } from "./types";

interface ZwoNode {
  Duration?: string | number;
  Power?: string | number;
  PowerLow?: string | number;
  PowerHigh?: string | number;
  Repeat?: string | number;
  OnDuration?: string | number;
  OffDuration?: string | number;
  OnPower?: string | number;
  OffPower?: string | number;
}

const xml = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "",
  isArray: (name) => ["Warmup", "Cooldown", "SteadyState", "IntervalsT", "Ramp", "FreeRide"].includes(name),
});

function num(v: unknown): number {
  if (typeof v === "number") return v;
  if (typeof v === "string") return parseFloat(v);
  return 0;
}

function ftpPct(p: unknown): string {
  return `${Math.round(num(p) * 100)}% FTP`;
}

export function parseZwo(text: string): ParseResult {
  let root;
  try {
    root = xml.parse(text);
  } catch (e) {
    throw new ParseError("XML inválido en archivo .zwo", e);
  }
  const wf = root.workout_file;
  if (!wf) throw new ParseError("No se encontró <workout_file> en el .zwo");

  const title = String(wf.name ?? "Workout importado");
  const sport = mapZwoSport(wf.sportType);
  const w = wf.workout ?? {};

  const blocks: Block[] = [];
  let totalSec = 0;

  const pushWarmup = (n: ZwoNode) => {
    const d = num(n.Duration);
    blocks.push({
      kind: "WU",
      label: "Calentamiento",
      durationSec: d,
      target: { type: "power", value: `${ftpPct(n.PowerLow ?? 0.5)} → ${ftpPct(n.PowerHigh ?? 0.7)}` },
    });
    totalSec += d;
  };
  const pushCooldown = (n: ZwoNode) => {
    const d = num(n.Duration);
    blocks.push({
      kind: "CD",
      label: "Vuelta a la calma",
      durationSec: d,
      target: { type: "power", value: `${ftpPct(n.PowerHigh ?? 0.7)} → ${ftpPct(n.PowerLow ?? 0.5)}` },
    });
    totalSec += d;
  };
  const pushSteady = (n: ZwoNode) => {
    const d = num(n.Duration);
    blocks.push({
      kind: "INTERVAL",
      label: "Steady",
      durationSec: d,
      target: { type: "power", value: ftpPct(n.Power ?? 0.7) },
    });
    totalSec += d;
  };
  const pushIntervals = (n: ZwoNode) => {
    const reps = Math.max(1, Math.round(num(n.Repeat ?? 1)));
    const on = num(n.OnDuration);
    const off = num(n.OffDuration);
    blocks.push({
      kind: "INTERVAL",
      label: "Intervalos",
      durationSec: on,
      reps,
      target: { type: "power", value: ftpPct(n.OnPower ?? 1.0) },
      recovery: {
        kind: "REST",
        label: "Recuperación",
        durationSec: off,
        target: { type: "power", value: ftpPct(n.OffPower ?? 0.5) },
      },
    });
    totalSec += (on + off) * reps;
  };
  const pushRamp = (n: ZwoNode) => {
    const d = num(n.Duration);
    blocks.push({
      kind: "INTERVAL",
      label: "Ramp",
      durationSec: d,
      target: { type: "power", value: `${ftpPct(n.PowerLow ?? 0.5)} → ${ftpPct(n.PowerHigh ?? 1.0)}` },
    });
    totalSec += d;
  };

  for (const n of w.Warmup ?? []) pushWarmup(n);
  for (const n of w.SteadyState ?? []) pushSteady(n);
  for (const n of w.IntervalsT ?? []) pushIntervals(n);
  for (const n of w.Ramp ?? []) pushRamp(n);
  for (const n of w.Cooldown ?? []) pushCooldown(n);

  return {
    kind: "workout",
    data: {
      title,
      sport,
      estDurationSec: totalSec,
      blocks,
      notes: wf.description ? String(wf.description) : undefined,
    },
  };
}
