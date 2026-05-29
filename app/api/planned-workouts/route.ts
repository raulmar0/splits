import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/supabase/server";
import { listPlannedWorkouts } from "@/lib/supabase/db";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const planned = await listPlannedWorkouts();
  return NextResponse.json({ planned });
}
