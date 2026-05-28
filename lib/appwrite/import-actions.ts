"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "./server";
import { createActivity, createPlannedWorkout, findActivityByExternalId } from "./db";
import type { ParsedActivity, ParsedWorkout } from "@/lib/workout-io/types";

export type ImportResult = { id?: string; duplicate?: boolean; error?: string };

export async function importActivityAction(parsed: ParsedActivity): Promise<ImportResult> {
  const user = await getCurrentUser();
  if (!user) return { error: "No autenticado." };

  if (parsed.externalId) {
    const existing = await findActivityByExternalId(user.$id, "import", parsed.externalId);
    if (existing) return { id: existing.$id, duplicate: true };
  }

  try {
    const a = await createActivity(user.$id, {
      source: "import",
      externalId: parsed.externalId,
      date: parsed.date,
      time: parsed.time,
      sport: parsed.sport,
      title: parsed.title,
      durationSec: parsed.durationSec,
      distanceM: parsed.distanceM || undefined,
      elevationM: parsed.elevationM || undefined,
      tss: parsed.tss,
      intensityFactor: parsed.intensityFactor,
      np: parsed.np,
      avgHR: parsed.avgHR,
      pace: parsed.pace,
      cadence: parsed.cadence,
      kj: parsed.kj,
    });
    revalidatePath("/", "layout");
    return { id: a.id };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Error al guardar la actividad.";
    return { error: msg };
  }
}

export async function importPlannedAction(parsed: ParsedWorkout, dateISO?: string): Promise<ImportResult> {
  const user = await getCurrentUser();
  if (!user) return { error: "No autenticado." };
  const date = dateISO ?? new Date().toISOString().slice(0, 10);

  try {
    const w = await createPlannedWorkout(user.$id, {
      date,
      sport: parsed.sport,
      title: parsed.title,
      estDurationSec: parsed.estDurationSec,
      estTSS: parsed.estTSS,
      estIF: parsed.estIF,
      blocks: parsed.blocks,
      notes: parsed.notes,
      source: "imported",
      status: "draft",
    });
    revalidatePath("/", "layout");
    return { id: w.id };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Error al guardar el workout.";
    return { error: msg };
  }
}
