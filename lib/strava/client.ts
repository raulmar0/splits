import "server-only";
import { serverEnv } from "@/lib/env";
import { decrypt, encrypt } from "@/lib/crypto";
import { getIntegration, upsertIntegration } from "@/lib/supabase/db";

const STRAVA_BASE = "https://www.strava.com";

export interface StravaActivity {
  id: number;
  name: string;
  type: string;
  sport_type?: string;
  distance: number;
  moving_time: number;
  elapsed_time: number;
  total_elevation_gain: number;
  start_date: string;
  start_date_local: string;
  average_heartrate?: number;
  average_cadence?: number;
  average_watts?: number;
  weighted_average_watts?: number;
  kilojoules?: number;
  has_heartrate?: boolean;
  suffer_score?: number;
}

interface StravaToken {
  access_token: string;
  refresh_token: string;
  expires_at: number;
  athlete?: { id: number };
  scope?: string;
}

export function authorizeUrl(state: string): string {
  const env = serverEnv();
  const url = new URL(`${STRAVA_BASE}/oauth/authorize`);
  url.searchParams.set("client_id", env.STRAVA_CLIENT_ID);
  url.searchParams.set("redirect_uri", `${env.APP_URL}/api/strava/callback`);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("approval_prompt", "auto");
  url.searchParams.set("scope", "read,activity:read_all");
  url.searchParams.set("state", state);
  return url.toString();
}

export async function exchangeCode(code: string): Promise<StravaToken> {
  const env = serverEnv();
  const res = await fetch(`${STRAVA_BASE}/api/v3/oauth/token`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      client_id: env.STRAVA_CLIENT_ID,
      client_secret: env.STRAVA_CLIENT_SECRET,
      code,
      grant_type: "authorization_code",
    }),
  });
  if (!res.ok) throw new Error(`Strava token exchange failed: ${res.status} ${await res.text()}`);
  return (await res.json()) as StravaToken;
}

async function refreshTokenCall(refresh: string): Promise<StravaToken> {
  const env = serverEnv();
  const res = await fetch(`${STRAVA_BASE}/api/v3/oauth/token`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      client_id: env.STRAVA_CLIENT_ID,
      client_secret: env.STRAVA_CLIENT_SECRET,
      grant_type: "refresh_token",
      refresh_token: refresh,
    }),
  });
  if (!res.ok) throw new Error(`Strava token refresh failed: ${res.status}`);
  return (await res.json()) as StravaToken;
}

export async function getValidAccessToken(userId: string): Promise<string | null> {
  const integration = await getIntegration(userId, "strava");
  if (!integration) return null;
  const now = Math.floor(Date.now() / 1000);
  if (integration.expires_at && integration.expires_at > now + 60) {
    return decrypt(integration.access_token_encrypted);
  }
  if (!integration.refresh_token_encrypted) return null;
  const refresh = decrypt(integration.refresh_token_encrypted);
  const fresh = await refreshTokenCall(refresh);
  await upsertIntegration(userId, "strava", {
    access_token_encrypted: encrypt(fresh.access_token),
    refresh_token_encrypted: encrypt(fresh.refresh_token),
    expires_at: fresh.expires_at,
  });
  return fresh.access_token;
}

export async function fetchActivities(accessToken: string, after?: number, perPage = 100): Promise<StravaActivity[]> {
  const url = new URL(`${STRAVA_BASE}/api/v3/athlete/activities`);
  if (after) url.searchParams.set("after", String(after));
  url.searchParams.set("per_page", String(perPage));
  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) throw new Error(`Strava activities fetch failed: ${res.status}`);
  return (await res.json()) as StravaActivity[];
}

export async function fetchActivityById(accessToken: string, id: number): Promise<StravaActivity> {
  const res = await fetch(`${STRAVA_BASE}/api/v3/activities/${id}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) throw new Error(`Strava activity ${id} fetch failed: ${res.status}`);
  return (await res.json()) as StravaActivity;
}
