import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/appwrite/server";
import { listActivities } from "@/lib/appwrite/db";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const activities = await listActivities(user.$id);
  return NextResponse.json({ activities });
}
