import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/appwrite/server";
import { getIntegration } from "@/lib/appwrite/db";
import { syncStrava } from "@/lib/strava/sync";

export async function POST() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const integration = await getIntegration(user.$id, "strava");
  if (!integration) return NextResponse.json({ error: "not_connected" }, { status: 400 });

  try {
    const since = integration.lastSyncAt ?? Math.floor(Date.now() / 1000) - 60 * 60 * 24 * 30;
    const result = await syncStrava(user.$id, since);
    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "sync_failed" }, { status: 500 });
  }
}
