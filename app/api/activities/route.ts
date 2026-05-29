import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/supabase/server";
import { listActivities } from "@/lib/supabase/db";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const activities = await listActivities();
  return NextResponse.json({ activities });
}
