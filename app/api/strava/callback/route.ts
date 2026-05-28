import { NextResponse, type NextRequest } from "next/server";
import { decrypt, encrypt } from "@/lib/crypto";
import { exchangeCode } from "@/lib/strava/client";
import { upsertIntegration } from "@/lib/appwrite/db";
import { syncStrava } from "@/lib/strava/sync";
import { serverEnv } from "@/lib/env";

const SETTINGS_URL = (status: string) => {
  const env = serverEnv();
  return `${env.APP_URL}/settings?strava=${status}`;
};

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const state = req.nextUrl.searchParams.get("state");
  const error = req.nextUrl.searchParams.get("error");

  if (error) return NextResponse.redirect(SETTINGS_URL(`error_${error}`));
  if (!code || !state) return NextResponse.redirect(SETTINGS_URL("missing"));

  let userId: string;
  let issuedAt: number;
  try {
    const decoded = decrypt(state);
    const [u, t] = decoded.split(":");
    userId = u;
    issuedAt = parseInt(t, 10);
  } catch {
    return NextResponse.redirect(SETTINGS_URL("bad_state"));
  }

  const ageSec = Math.floor(Date.now() / 1000) - issuedAt;
  if (!userId || !Number.isFinite(issuedAt) || ageSec > 600 || ageSec < 0) {
    return NextResponse.redirect(SETTINGS_URL("stale_state"));
  }

  let token;
  try {
    token = await exchangeCode(code);
  } catch {
    return NextResponse.redirect(SETTINGS_URL("exchange_failed"));
  }

  await upsertIntegration(userId, "strava", {
    accessTokenEncrypted: encrypt(token.access_token),
    refreshTokenEncrypted: encrypt(token.refresh_token),
    expiresAt: token.expires_at,
    externalUserId: token.athlete ? String(token.athlete.id) : undefined,
    scope: token.scope,
  });

  try {
    const since = Math.floor(Date.now() / 1000) - 60 * 60 * 24 * 30;
    await syncStrava(userId, since);
  } catch {
    /* connection still saved even if first sync fails */
  }

  return NextResponse.redirect(SETTINGS_URL("connected"));
}
