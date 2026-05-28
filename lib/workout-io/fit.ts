import FitParser from "fit-file-parser";
import { mapFitSport } from "./sport-map";
import { ParseError, type ParseResult } from "./types";

interface FitSession {
  start_time?: Date | string;
  sport?: string;
  sub_sport?: string;
  total_elapsed_time?: number;
  total_timer_time?: number;
  total_distance?: number;
  total_ascent?: number;
  total_calories?: number;
  avg_heart_rate?: number;
  avg_cadence?: number;
  normalized_power?: number;
  training_stress_score?: number;
  intensity_factor?: number;
}

interface FitData {
  sessions?: FitSession[];
  activity?: { sessions?: FitSession[] };
}

export async function parseFit(buf: ArrayBuffer): Promise<ParseResult> {
  const parser = new FitParser({
    speedUnit: "m/s",
    lengthUnit: "m",
    temperatureUnit: "celsius",
    pressureUnit: "kPa",
    mode: "list",
    elapsedRecordField: true,
  });

  let data: FitData;
  try {
    data = (await parser.parseAsync(buf)) as unknown as FitData;
  } catch (e) {
    throw new ParseError("No se pudo parsear el .fit", e);
  }

  const sessions = data.sessions ?? data.activity?.sessions ?? [];
  if (sessions.length === 0) throw new ParseError("El .fit no contiene sesiones");

  const s = sessions[0];
  const start = s.start_time ? new Date(s.start_time) : new Date();
  const date = start.toISOString().slice(0, 10);
  const time = start.toISOString().slice(11, 16);

  const durationSec = Math.round(s.total_timer_time ?? s.total_elapsed_time ?? 0);
  const distanceM = Math.round(s.total_distance ?? 0);
  const elevationM = Math.round(s.total_ascent ?? 0);
  const sport = mapFitSport(s.sport, s.sub_sport);

  return {
    kind: "activity",
    data: {
      date,
      time,
      sport,
      title: `Actividad ${date}`,
      durationSec,
      distanceM,
      elevationM,
      tss: s.training_stress_score ? Math.round(s.training_stress_score) : undefined,
      intensityFactor: s.intensity_factor,
      np: s.normalized_power ? Math.round(s.normalized_power) : undefined,
      avgHR: s.avg_heart_rate ? Math.round(s.avg_heart_rate) : undefined,
      cadence: s.avg_cadence ? Math.round(s.avg_cadence) : undefined,
      kj: s.total_calories ? Math.round(s.total_calories * 4.184) : undefined,
    },
  };
}
