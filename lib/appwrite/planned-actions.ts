"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentUser } from "./server";
import { createPlannedWorkout } from "./db";
import type { Block, Sport } from "@/lib/types";

export interface NewWorkoutInput {
  title: string;
  date: string;
  time?: string;
  sport: Sport;
  estDurationSec: number;
  estDistanceM?: number;
  estTSS?: number;
  estIF?: number;
  blocks: Block[];
  notes?: string;
  status: "draft" | "scheduled";
}

export type CreatePlannedState = { error?: string; id?: string } | null;

export async function createPlannedAction(input: NewWorkoutInput): Promise<CreatePlannedState> {
  const user = await getCurrentUser();
  if (!user) return { error: "No autenticado." };
  if (!input.title.trim()) return { error: "El título es requerido." };
  if (!input.date) return { error: "La fecha es requerida." };

  try {
    const w = await createPlannedWorkout(user.$id, {
      date: input.date,
      sport: input.sport,
      title: input.title,
      estDurationSec: input.estDurationSec,
      estDistanceM: input.estDistanceM,
      estTSS: input.estTSS,
      estIF: input.estIF,
      blocks: input.blocks,
      notes: input.notes,
      source: "manual",
      status: input.status,
    });
    revalidatePath("/", "layout");
    return { id: w.id };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "No se pudo guardar." };
  }
}

export async function createAndRedirect(input: NewWorkoutInput) {
  const res = await createPlannedAction(input);
  if (res?.error) return res;
  redirect("/calendar");
}
