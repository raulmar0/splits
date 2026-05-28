"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "./server";
import { upsertAthlete, deleteIntegration, getAthlete } from "./db";
import { encrypt } from "@/lib/crypto";

export type SaveAthleteState = { error?: string; success?: boolean } | null;

function num(v: FormDataEntryValue | null): number | undefined {
  if (v == null) return undefined;
  const s = String(v).trim();
  if (!s) return undefined;
  const n = Number(s);
  return Number.isFinite(n) ? n : undefined;
}

function str(v: FormDataEntryValue | null): string | undefined {
  if (v == null) return undefined;
  const s = String(v).trim();
  return s || undefined;
}

export async function saveAthlete(_prev: SaveAthleteState, formData: FormData): Promise<SaveAthleteState> {
  const user = await getCurrentUser();
  if (!user) return { error: "No autenticado." };

  const name = String(formData.get("name") ?? "").trim();
  if (!name) return { error: "El nombre es requerido." };

  const patch: Record<string, unknown> = {
    name,
    initials:
      name
        .split(/\s+/)
        .slice(0, 2)
        .map((p) => p[0]?.toUpperCase() ?? "")
        .join("") || "AT",
    ftp: num(formData.get("ftp")),
    lthr: num(formData.get("lthr")),
    maxHR: num(formData.get("maxHR")),
    weight: num(formData.get("weight")),
    vo2max: num(formData.get("vo2max")),
    hrv: num(formData.get("hrv")),
    restingHR: num(formData.get("restingHR")),
    mainSport: str(formData.get("mainSport")),
    goal: str(formData.get("goal")),
    llmProvider: str(formData.get("llmProvider")) as "anthropic" | "openai" | undefined,
  };

  const apiKey = String(formData.get("llmApiKey") ?? "").trim();
  if (apiKey) patch.llmApiKeyEncrypted = encrypt(apiKey);

  for (const k of Object.keys(patch)) {
    if (patch[k] === undefined) delete patch[k];
  }

  try {
    await upsertAthlete(user.$id, patch);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "No se pudo guardar.";
    return { error: msg };
  }

  revalidatePath("/settings");
  revalidatePath("/", "layout");
  return { success: true };
}

export async function clearLlmKey(): Promise<void> {
  const user = await getCurrentUser();
  if (!user) return;
  const athlete = await getAthlete(user.$id);
  if (!athlete) return;
  await upsertAthlete(user.$id, { llmApiKeyEncrypted: "" });
  revalidatePath("/settings");
}

export async function disconnectIntegration(provider: "strava" | "garmin" | "wahoo") {
  const user = await getCurrentUser();
  if (!user) return;
  await deleteIntegration(user.$id, provider);
  revalidatePath("/settings");
}
