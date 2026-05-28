import { NextResponse, type NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/appwrite/server";
import { authorizeUrl } from "@/lib/strava/client";
import { encrypt } from "@/lib/crypto";
import { serverEnv } from "@/lib/env";

export async function GET(_req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.redirect(new URL("/login", serverEnv().APP_URL));

  if (!serverEnv().STRAVA_CLIENT_ID) {
    return NextResponse.json({ error: "STRAVA_CLIENT_ID no configurado" }, { status: 500 });
  }

  const state = encrypt(`${user.$id}:${Math.floor(Date.now() / 1000)}`);
  return NextResponse.redirect(authorizeUrl(state));
}
