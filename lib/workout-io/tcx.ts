import { XMLParser } from "fast-xml-parser";
import { mapTcxSport } from "./sport-map";
import { ParseError, type ParseResult } from "./types";

const xml = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "",
  isArray: (name) => ["Activity", "Lap", "Track", "Trackpoint"].includes(name),
});

function num(v: unknown): number {
  if (typeof v === "number") return v;
  if (typeof v === "string") return parseFloat(v);
  return 0;
}

export function parseTcx(text: string): ParseResult {
  let root;
  try {
    root = xml.parse(text);
  } catch (e) {
    throw new ParseError("XML inválido en archivo .tcx", e);
  }
  const tcdb = root.TrainingCenterDatabase;
  if (!tcdb) throw new ParseError("No se encontró <TrainingCenterDatabase> en el .tcx");

  const activities = tcdb.Activities?.Activity ?? [];
  if (activities.length === 0) throw new ParseError("El .tcx no contiene actividades");

  const act = activities[0];
  const sport = mapTcxSport(act.Sport);
  const idStr = String(act.Id ?? "");
  const startDate = idStr ? new Date(idStr) : new Date();
  const date = startDate.toISOString().slice(0, 10);
  const time = startDate.toISOString().slice(11, 16);

  const laps = act.Lap ?? [];
  let durationSec = 0;
  let distanceM = 0;
  let elevationM = 0;
  let hrSum = 0;
  let hrCount = 0;

  for (const lap of laps) {
    durationSec += num(lap.TotalTimeSeconds);
    distanceM += num(lap.DistanceMeters);
    if (lap.AverageHeartRateBpm?.Value) {
      hrSum += num(lap.AverageHeartRateBpm.Value);
      hrCount += 1;
    }
    let prevEle: number | null = null;
    for (const track of lap.Track ?? []) {
      for (const tp of track.Trackpoint ?? []) {
        const ele = tp.AltitudeMeters ? num(tp.AltitudeMeters) : null;
        if (ele !== null && Number.isFinite(ele)) {
          if (prevEle !== null && ele > prevEle) elevationM += ele - prevEle;
          prevEle = ele;
        }
      }
    }
  }

  return {
    kind: "activity",
    data: {
      date,
      time,
      sport,
      title: `Actividad ${date}`,
      durationSec: Math.round(durationSec),
      distanceM: Math.round(distanceM),
      elevationM: Math.round(elevationM),
      avgHR: hrCount > 0 ? Math.round(hrSum / hrCount) : undefined,
    },
  };
}
