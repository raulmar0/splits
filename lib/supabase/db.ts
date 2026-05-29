import "server-only";
import { supabaseAdmin, supabaseServer } from "./server";
import type { ActivityRow, AthleteRow, IntegrationProvider, IntegrationRow, PlannedRow } from "./types";
import type { Activity, Athlete, PlannedWorkout } from "@/lib/types";

function secToHMS(sec: number): string {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = Math.floor(sec % 60);
  if (h === 0) return `${m}:${String(s).padStart(2, "0")}`;
  return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function activityFromRow(r: ActivityRow): Activity {
  return {
    id: r.id,
    date: r.date,
    time: r.time ?? "",
    sport: r.sport,
    title: r.title,
    dur: secToHMS(r.duration_sec),
    dist: r.distance_m ? Math.round((r.distance_m / 1000) * 10) / 10 : 0,
    elev: r.elevation_m ? Math.round(r.elevation_m) : 0,
    tss: r.tss ?? 0,
    if: r.intensity_factor ?? 0,
    np: r.np ?? undefined,
    avgHR: r.avg_hr ?? undefined,
    pace: r.pace ?? undefined,
    cad: r.cadence ?? undefined,
    kj: r.kj ?? undefined,
  };
}

export function plannedFromRow(r: PlannedRow): PlannedWorkout {
  return {
    id: r.id,
    date: r.date,
    sport: r.sport,
    title: r.title,
    est: {
      dur: secToHMS(r.est_duration_sec),
      dist: r.est_distance_m ? Math.round((r.est_distance_m / 1000) * 10) / 10 : undefined,
      tss: r.est_tss ?? 0,
      if: r.est_if ?? 0,
    },
    blocks: r.blocks,
    notes: r.notes ?? undefined,
    source: r.source,
    status: r.status,
  };
}

export function athleteFromRow(r: AthleteRow): Athlete {
  return {
    name: r.name,
    initials: r.initials,
    ftp: r.ftp ?? 0,
    lthr: r.lthr ?? 0,
    maxHR: r.max_hr ?? 0,
    weight: r.weight ?? 0,
    vo2max: r.vo2max ?? 0,
    hrv: r.hrv ?? 0,
    restingHR: r.resting_hr ?? 0,
  };
}

export async function listActivities(limit = 200): Promise<Activity[]> {
  const supabase = await supabaseServer();
  const { data, error } = await supabase
    .from("activities")
    .select("*")
    .order("date", { ascending: false })
    .limit(limit);
  if (error || !data) return [];
  return data.map(activityFromRow);
}

export async function listPlannedWorkouts(limit = 200): Promise<PlannedWorkout[]> {
  const supabase = await supabaseServer();
  const { data, error } = await supabase
    .from("planned_workouts")
    .select("*")
    .order("date", { ascending: true })
    .limit(limit);
  if (error || !data) return [];
  return data.map(plannedFromRow);
}

export async function getAthlete(): Promise<AthleteRow | null> {
  const supabase = await supabaseServer();
  const { data } = await supabase.from("athletes").select("*").maybeSingle();
  return data ?? null;
}

export async function getAthleteById(userId: string): Promise<AthleteRow | null> {
  const supabase = supabaseAdmin();
  const { data } = await supabase.from("athletes").select("*").eq("user_id", userId).maybeSingle();
  return data ?? null;
}

export async function upsertAthlete(userId: string, patch: Partial<AthleteRow>): Promise<AthleteRow | null> {
  const supabase = supabaseAdmin();
  const computedInitials =
    (patch.name ?? "Atleta")
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase() ?? "")
      .join("") || "AT";
  const initials = patch.initials ?? computedInitials;
  const { data, error } = await supabase
    .from("athletes")
    .upsert({ user_id: userId, name: patch.name ?? "Atleta", initials, ...patch }, { onConflict: "user_id" })
    .select("*")
    .single();
  if (error) throw error;
  return data;
}

export interface CreateActivityInput {
  source: ActivityRow["source"];
  externalId?: string;
  date: string;
  time?: string;
  sport: ActivityRow["sport"];
  title: string;
  durationSec: number;
  distanceM?: number;
  elevationM?: number;
  tss?: number;
  intensityFactor?: number;
  np?: number;
  avgHR?: number;
  pace?: string;
  cadence?: number;
  kj?: number;
}

export async function createActivity(userId: string, input: CreateActivityInput): Promise<Activity | null> {
  const supabase = supabaseAdmin();
  const { data, error } = await supabase
    .from("activities")
    .insert({
      user_id: userId,
      source: input.source,
      external_id: input.externalId ?? null,
      date: input.date,
      time: input.time ?? null,
      sport: input.sport,
      title: input.title,
      duration_sec: input.durationSec,
      distance_m: input.distanceM ?? null,
      elevation_m: input.elevationM ?? null,
      tss: input.tss ?? null,
      intensity_factor: input.intensityFactor ?? null,
      np: input.np ?? null,
      avg_hr: input.avgHR ?? null,
      pace: input.pace ?? null,
      cadence: input.cadence ?? null,
      kj: input.kj ?? null,
    })
    .select("*")
    .single();
  if (error) throw error;
  return activityFromRow(data);
}

export async function findActivityByExternalId(userId: string, source: ActivityRow["source"], externalId: string): Promise<ActivityRow | null> {
  const supabase = supabaseAdmin();
  const { data } = await supabase
    .from("activities")
    .select("*")
    .eq("user_id", userId)
    .eq("source", source)
    .eq("external_id", externalId)
    .maybeSingle();
  return data ?? null;
}

export async function deleteActivityRow(rowId: string) {
  const supabase = supabaseAdmin();
  await supabase.from("activities").delete().eq("id", rowId);
}

export interface CreatePlannedInput {
  date: string;
  sport: PlannedRow["sport"];
  title: string;
  estDurationSec: number;
  estDistanceM?: number;
  estTSS?: number;
  estIF?: number;
  blocks: PlannedRow["blocks"];
  notes?: string;
  source: PlannedRow["source"];
  status: PlannedRow["status"];
}

export async function createPlanned(userId: string, input: CreatePlannedInput): Promise<PlannedWorkout> {
  const supabase = await supabaseServer();
  const { data, error } = await supabase
    .from("planned_workouts")
    .insert({
      user_id: userId,
      date: input.date,
      sport: input.sport,
      title: input.title,
      est_duration_sec: input.estDurationSec,
      est_distance_m: input.estDistanceM ?? null,
      est_tss: input.estTSS ?? null,
      est_if: input.estIF ?? null,
      blocks: input.blocks,
      notes: input.notes ?? null,
      source: input.source,
      status: input.status,
    })
    .select("*")
    .single();
  if (error) throw error;
  return plannedFromRow(data);
}

export async function getIntegration(userId: string, provider: IntegrationProvider): Promise<IntegrationRow | null> {
  const supabase = supabaseAdmin();
  const { data } = await supabase
    .from("integrations")
    .select("*")
    .eq("user_id", userId)
    .eq("provider", provider)
    .maybeSingle();
  return data ?? null;
}

export async function upsertIntegration(userId: string, provider: IntegrationProvider, patch: Partial<IntegrationRow>): Promise<IntegrationRow> {
  const supabase = supabaseAdmin();
  const { data, error } = await supabase
    .from("integrations")
    .upsert(
      {
        user_id: userId,
        provider,
        access_token_encrypted: patch.access_token_encrypted ?? "",
        ...patch,
      },
      { onConflict: "user_id,provider" }
    )
    .select("*")
    .single();
  if (error) throw error;
  return data;
}

export async function deleteIntegration(userId: string, provider: IntegrationProvider) {
  const supabase = supabaseAdmin();
  await supabase.from("integrations").delete().eq("user_id", userId).eq("provider", provider);
}

export async function findUserByStravaAthleteId(stravaId: string): Promise<string | null> {
  const supabase = supabaseAdmin();
  const { data } = await supabase
    .from("integrations")
    .select("user_id")
    .eq("provider", "strava")
    .eq("external_user_id", stravaId)
    .maybeSingle();
  return data?.user_id ?? null;
}
