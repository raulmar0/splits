import type { Block } from "@/lib/types";
import { ParseError, type ParseResult } from "./types";

function parseTimeValuePairs(text: string): { sec: number; value: number }[] {
  const lines = text.split(/\r?\n/);
  const data: { sec: number; value: number }[] = [];
  let inData = false;
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    if (/\[COURSE DATA\]/i.test(trimmed)) {
      inData = true;
      continue;
    }
    if (/\[END COURSE DATA\]/i.test(trimmed)) {
      inData = false;
      continue;
    }
    if (!inData) continue;
    const parts = trimmed.split(/\s+/);
    if (parts.length < 2) continue;
    const t = parseFloat(parts[0]);
    const v = parseFloat(parts[1]);
    if (Number.isFinite(t) && Number.isFinite(v)) data.push({ sec: t * 60, value: v });
  }
  return data;
}

function headerField(text: string, key: string): string | undefined {
  const re = new RegExp(`^\\s*${key}\\s*=\\s*(.+)$`, "im");
  const m = text.match(re);
  return m ? m[1].trim() : undefined;
}

function pairsToBlocks(pairs: { sec: number; value: number }[], unitLabel: string): Block[] {
  if (pairs.length < 2) return [];
  const blocks: Block[] = [];
  for (let i = 0; i < pairs.length - 1; i++) {
    const a = pairs[i];
    const b = pairs[i + 1];
    const d = b.sec - a.sec;
    if (d <= 0) continue;
    const value = a.value === b.value ? `${Math.round(a.value)}${unitLabel}` : `${Math.round(a.value)}${unitLabel} → ${Math.round(b.value)}${unitLabel}`;
    blocks.push({
      kind: "INTERVAL",
      label: `${Math.round(d / 60)}'`,
      durationSec: Math.round(d),
      target: { type: unitLabel === "W" ? "power" : "zone", value },
    });
  }
  return blocks;
}

function buildWorkout(text: string, unitLabel: string, fileLabel: string): ParseResult {
  const pairs = parseTimeValuePairs(text);
  if (pairs.length === 0) throw new ParseError(`No se encontraron datos en archivo ${fileLabel}`);
  const blocks = pairsToBlocks(pairs, unitLabel);
  const totalSec = pairs[pairs.length - 1].sec;
  const title = headerField(text, "DESCRIPTION") ?? headerField(text, "FILE NAME") ?? `Workout ${fileLabel}`;
  return {
    kind: "workout",
    data: {
      title,
      sport: "ride",
      estDurationSec: totalSec,
      blocks,
    },
  };
}

export function parseErg(text: string): ParseResult {
  return buildWorkout(text, "% FTP", ".erg");
}

export function parseMrc(text: string): ParseResult {
  return buildWorkout(text, "% FTP", ".mrc");
}
