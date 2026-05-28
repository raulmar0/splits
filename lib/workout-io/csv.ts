import type { Sport } from "@/lib/types";
import { ParseError, type ParseResult } from "./types";

const SPORTS = new Set<Sport>(["ride", "run", "swim", "strength", "trail", "mtb", "rest"]);

function splitCsv(line: string): string[] {
  const out: string[] = [];
  let cur = "";
  let inQ = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      inQ = !inQ;
    } else if (ch === "," && !inQ) {
      out.push(cur);
      cur = "";
    } else {
      cur += ch;
    }
  }
  out.push(cur);
  return out.map((s) => s.trim());
}

export function parseCsv(text: string): ParseResult {
  const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length < 2) throw new ParseError("CSV vacío o sin filas de datos");

  const headers = splitCsv(lines[0]).map((h) => h.toLowerCase());
  const row = splitCsv(lines[1]);
  const map = new Map<string, string>();
  for (let i = 0; i < headers.length; i++) map.set(headers[i], row[i] ?? "");

  const get = (k: string) => map.get(k) ?? "";
  const num = (k: string) => {
    const v = get(k);
    if (!v) return undefined;
    const n = Number(v);
    return Number.isFinite(n) ? n : undefined;
  };

  const sportStr = get("sport").toLowerCase() as Sport;
  const sport: Sport = SPORTS.has(sportStr) ? sportStr : "ride";

  const date = get("date") || new Date().toISOString().slice(0, 10);
  const time = get("time") || "00:00";

  return {
    kind: "activity",
    data: {
      date,
      time,
      sport,
      title: get("title") || `Actividad ${date}`,
      durationSec: num("dursec") ?? num("durationsec") ?? 0,
      distanceM: num("distm") ?? num("distancem") ?? 0,
      elevationM: num("elevm") ?? num("elevationm") ?? 0,
      tss: num("tss"),
      intensityFactor: num("if") ?? num("intensityfactor"),
    },
  };
}
