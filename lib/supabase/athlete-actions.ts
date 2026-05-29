"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "./server";
import { deleteIntegration, getAthlete, upsertAthlete } from "./db";
import { encrypt } from "@/lib/crypto";
import type { AthleteRow, LlmProvider } from "./types";

export type SaveAthleteState = { error?: string; success?: boolean } | null;

function num(v: FormDataEntryValue | null): number | null {
  if (v == null) return null;
  const s = String(v).trim();
  if (!s) return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

function str(v: FormDataEntryValue | null): string | null {
  if (v == null) return null;
  const s = String(v).trim();
  return s || null;
}

export async function saveAthlete(_prev: SaveAthleteState, formData: FormData): Promise<SaveAthleteState> {
  const user = await getCurrentUser();
  if (!user) return { error: "No autenticado." };

  const name = String(formData.get("name") ?? "").trim();
  if (!name) return { error: "El nombre es requerido." };

  const llmProvider = str(formData.get("llmProvider"));

  const patch: Partial<AthleteRow> = {
    name,
    initials:
      name
        .split(/\s+/)
        .slice(0, 2)
        .map((p) => p[0]?.toUpperCase() ?? "")
        .join("") || "AT",
    ftp: num(formData.get("ftp")),
    lthr: num(formData.get("lthr")),
    max_hr: num(formData.get("maxHR")),
    weight: num(formData.get("weight")),
    vo2max: num(formData.get("vo2max")),
    hrv: num(formData.get("hrv")),
    resting_hr: num(formData.get("restingHR")),
    main_sport: str(formData.get("mainSport")),
    goal: str(formData.get("goal")),
    llm_provider: (llmProvider === "anthropic" || llmProvider === "openai" ? (llmProvider as LlmProvider) : null),
  };

  const apiKey = String(formData.get("llmApiKey") ?? "").trim();
  if (apiKey) patch.llm_api_key_encrypted = encrypt(apiKey);

  try {
    await upsertAthlete(user.id, patch);
  } catch (e) {
    return { error: e instanceof Error ? e.message : "No se pudo guardar." };
  }

  revalidatePath("/settings");
  revalidatePath("/", "layout");
  return { success: true };
}

export async function clearLlmKey(): Promise<void> {
  const user = await getCurrentUser();
  if (!user) return;
  const athlete = await getAthlete();
  if (!athlete) return;
  await upsertAthlete(user.id, { llm_api_key_encrypted: null });
  revalidatePath("/settings");
}

export async function disconnectIntegration(provider: "strava" | "garmin" | "wahoo") {
  const user = await getCurrentUser();
  if (!user) return;
  await deleteIntegration(user.id, provider);
  revalidatePath("/settings");
}
