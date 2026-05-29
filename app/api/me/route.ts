import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/supabase/server";
import { athleteFromRow, getAthlete } from "@/lib/supabase/db";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const row = await getAthlete();
  return NextResponse.json({
    user: { id: user.id, email: user.email ?? "", name: (user.user_metadata?.name as string) ?? user.email ?? "" },
    athlete: row ? athleteFromRow(row) : null,
    llmProvider: row?.llm_provider ?? null,
    hasLlmKey: !!row?.llm_api_key_encrypted,
    mainSport: row?.main_sport ?? null,
    goal: row?.goal ?? null,
  });
}
