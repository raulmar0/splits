import { NextResponse, type NextRequest } from "next/server";
import { serverEnv } from "@/lib/env";
import { mapStravaType } from "@/lib/strava/sport-map";
import { fetchActivityById, getValidAccessToken } from "@/lib/strava/client";
import {
  createActivity,
  deleteActivityRow,
  findActivityByExternalId,
  findUserByStravaAthleteId,
  getAthleteById,
} from "@/lib/supabase/db";

export async function GET(req: NextRequest) {
  const mode = req.nextUrl.searchParams.get("hub.mode");
  const token = req.nextUrl.searchParams.get("hub.verify_token");
  const challenge = req.nextUrl.searchParams.get("hub.challenge");
  const env = serverEnv();
  if (mode === "subscribe" && token === env.STRAVA_WEBHOOK_VERIFY_TOKEN && challenge) {
    return NextResponse.json({ "hub.challenge": challenge });
  }
  return NextResponse.json({ error: "invalid_verification" }, { status: 403 });
}

interface WebhookEvent {
  object_type: "activity" | "athlete";
  aspect_type: "create" | "update" | "delete";
  object_id: number;
  owner_id: number;
  subscription_id: number;
  event_time: number;
}

export async function POST(req: NextRequest) {
  let event: WebhookEvent;
  try {
    event = (await req.json()) as WebhookEvent;
  } catch {
    return NextResponse.json({ error: "bad_payload" }, { status: 400 });
  }

  if (event.object_type !== "activity") return NextResponse.json({ ok: true });

  const userId = await findUserByStravaAthleteId(String(event.owner_id));
  if (!userId) return NextResponse.json({ ok: true });

  if (event.aspect_type === "delete") {
    const existing = await findActivityByExternalId(userId, "strava", String(event.object_id));
    if (existing) await deleteActivityRow(existing.id);
    return NextResponse.json({ ok: true });
  }

  const token = await getValidAccessToken(userId);
  if (!token) return NextResponse.json({ ok: true });

  try {
    const a = await fetchActivityById(token, event.object_id);
    const existing = await findActivityByExternalId(userId, "strava", String(a.id));
    if (existing && event.aspect_type === "create") return NextResponse.json({ ok: true });

    const athlete = await getAthleteById(userId);
    const ftp = athlete?.ftp;
    let tss: number | undefined;
    let intensityFactor: number | undefined;
    const np = a.weighted_average_watts ?? a.average_watts;
    if (ftp && np && a.moving_time) {
      intensityFactor = Math.min(2, np / ftp);
      tss = Math.round((a.moving_time * np * intensityFactor) / (ftp * 3600) * 100);
      intensityFactor = Math.round(intensityFactor * 100) / 100;
    }

    if (!existing) {
      const start = new Date(a.start_date_local || a.start_date);
      await createActivity(userId, {
        source: "strava",
        externalId: String(a.id),
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
    }
  } catch {
    /* swallow — webhook will retry */
  }

  return NextResponse.json({ ok: true });
}
