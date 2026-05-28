import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/appwrite/server";
import { athleteFromDoc, getAthlete } from "@/lib/appwrite/db";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const doc = await getAthlete(user.$id);
  return NextResponse.json({
    user: { id: user.$id, email: user.email, name: user.name },
    athlete: doc ? athleteFromDoc(doc) : null,
    llmProvider: doc?.llmProvider ?? null,
    hasLlmKey: !!doc?.llmApiKeyEncrypted,
    mainSport: doc?.mainSport ?? null,
    goal: doc?.goal ?? null,
  });
}
