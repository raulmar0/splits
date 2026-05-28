import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/appwrite/server";
import { listPlannedWorkouts } from "@/lib/appwrite/db";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const planned = await listPlannedWorkouts(user.$id);
  return NextResponse.json({ planned });
}
