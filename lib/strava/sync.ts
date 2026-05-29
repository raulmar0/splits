import "server-only";
import { mapStravaType } from "./sport-map";
import { fetchActivities, type StravaActivity, getValidAccessToken } from "./client";
import {
  createActivity,
  findActivityByExternalId,
  getAthleteById,
  upsertIntegration,
} from "@/lib/supabase/db";

function computeTssIf(a: StravaActivity, ftp?: number | null): { tss?: number; intensityFactor?: number } {
  if (!ftp || ftp <= 0) return {};
  const np = a.weighted_average_watts ?? a.average_watts;
  if (!np || np <= 0 || !a.moving_time) return {};
  const intensityFactor = Math.min(2, np / ftp);
  const tss = Math.round((a.moving_time * np * intensityFactor) / (ftp * 3600) * 100);
  return { intensityFactor: Math.round(intensityFactor * 100) / 100, tss };
}

export async function syncStrava(userId: string, sinceTs?: number): Promise<{ created: number; skipped: number }> {
  const token = await getValidAccessToken(userId);
  if (!token) throw new Error("No conexión a Strava");

  const athlete = await getAthleteById(userId);
  const ftp = athlete?.ftp;

  const activities = await fetchActivities(token, sinceTs);

  let created = 0;
  let skipped = 0;

  for (const a of activities) {
    const externalId = String(a.id);
    const existing = await findActivityByExternalId(userId, "strava", externalId);
    if (existing) {
      skipped += 1;
      continue;
    }
    const start = new Date(a.start_date_local || a.start_date);
    const { tss, intensityFactor } = computeTssIf(a, ftp);

    await createActivity(userId, {
      source: "strava",
      externalId,
      date: start.toISOString().slice(0, 10),
      time: start.toISOString().slice(11, 16),
      sport: mapStravaType(a.sport_type ?? a.type),
      title: a.name,
      durationSec: a.moving_time,
      distanceM: a.distance || undefined,
      elevationM: a.total_elevation_gain || undefined,
      tss,
      intensityFactor,
      np: a.weighted_average_watts ? Math.round(a.weighted_average_watts) : undefined,
      avgHR: a.average_heartrate ? Math.round(a.average_heartrate) : undefined,
      cadence: a.average_cadence ? Math.round(a.average_cadence) : undefined,
      kj: a.kilojoules ? Math.round(a.kilojoules) : undefined,
    });
    created += 1;
  }

  await upsertIntegration(userId, "strava", { last_sync_at: Math.floor(Date.now() / 1000) });
  return { created, skipped };
}
