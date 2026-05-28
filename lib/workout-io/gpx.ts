import { XMLParser } from "fast-xml-parser";
import { mapGpxType } from "./sport-map";
import { ParseError, type ParseResult } from "./types";

interface TrkPt {
  lat: string;
  lon: string;
  ele?: string;
  time?: string;
}

const xml = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "",
  isArray: (name) => name === "trk" || name === "trkseg" || name === "trkpt",
});

function num(v: unknown): number {
  if (typeof v === "number") return v;
  if (typeof v === "string") return parseFloat(v);
  return NaN;
}

function haversine(a: { lat: number; lon: number }, b: { lat: number; lon: number }): number {
  const R = 6371000;
  const φ1 = (a.lat * Math.PI) / 180;
  const φ2 = (b.lat * Math.PI) / 180;
  const dφ = ((b.lat - a.lat) * Math.PI) / 180;
  const dλ = ((b.lon - a.lon) * Math.PI) / 180;
  const s = Math.sin(dφ / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(dλ / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}

export function parseGpx(text: string): ParseResult {
  let root;
  try {
    root = xml.parse(text);
  } catch (e) {
    throw new ParseError("XML inválido en archivo .gpx", e);
  }
  const gpx = root.gpx;
  if (!gpx) throw new ParseError("No se encontró <gpx> en el archivo");

  const trks = gpx.trk ?? [];
  if (trks.length === 0) throw new ParseError("El .gpx no contiene tracks");

  const trk = trks[0];
  const title = String(trk.name ?? "Track GPX");
  const sport = mapGpxType(trk.type);
  const segs = trk.trkseg ?? [];

  const points: TrkPt[] = [];
  for (const seg of segs) {
    for (const pt of seg.trkpt ?? []) points.push(pt);
  }
  if (points.length < 2) throw new ParseError("El track no tiene suficientes puntos");

  let distanceM = 0;
  let elevationM = 0;
  let prevEle: number | null = null;
  for (let i = 1; i < points.length; i++) {
    const a = { lat: num(points[i - 1].lat), lon: num(points[i - 1].lon) };
    const b = { lat: num(points[i].lat), lon: num(points[i].lon) };
    if ([a.lat, a.lon, b.lat, b.lon].every(Number.isFinite)) distanceM += haversine(a, b);
    const ele = num(points[i].ele);
    if (Number.isFinite(ele)) {
      if (prevEle !== null && ele > prevEle) elevationM += ele - prevEle;
      prevEle = ele;
    }
  }

  const t0Str = points[0].time;
  const t1Str = points[points.length - 1].time;
  const t0 = t0Str ? new Date(t0Str) : null;
  const t1 = t1Str ? new Date(t1Str) : null;
  const durationSec = t0 && t1 ? Math.max(0, (t1.getTime() - t0.getTime()) / 1000) : 0;
  const date = t0 ? t0.toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10);
  const time = t0 ? t0.toISOString().slice(11, 16) : "00:00";

  return {
    kind: "activity",
    data: {
      date,
      time,
      sport,
      title,
      durationSec: Math.round(durationSec),
      distanceM: Math.round(distanceM),
      elevationM: Math.round(elevationM),
    },
  };
}
