import "server-only";
import { ID, Query, Permission, Role } from "node-appwrite";
import { COLLECTIONS } from "./schema";
import { createSessionClient, createAdminClient } from "./server";
import { serverEnv } from "@/lib/env";
import type { Activity, Athlete, PlannedWorkout, Sport } from "@/lib/types";

const DB = () => serverEnv().APPWRITE_DATABASE_ID;

type ActivityDoc = {
  $id: string;
  userId: string;
  externalId?: string;
  source: "manual" | "import" | "strava" | "garmin" | "wahoo" | "zwift";
  date: string;
  time?: string;
  sport: Sport;
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
};

type PlannedDoc = {
  $id: string;
  userId: string;
  date: string;
  sport: Sport;
  title: string;
  estDurationSec: number;
  estDistanceM?: number;
  estTSS?: number;
  estIF?: number;
  blocks: string;
  notes?: string;
  source: "manual" | "ai" | "template" | "imported";
  status: "draft" | "scheduled" | "completed" | "skipped";
};

type AthleteDoc = {
  $id: string;
  userId: string;
  name: string;
  initials: string;
  ftp?: number;
  lthr?: number;
  maxHR?: number;
  weight?: number;
  vo2max?: number;
  hrv?: number;
  restingHR?: number;
  mainSport?: string;
  goal?: string;
  llmProvider?: "anthropic" | "openai";
  llmApiKeyEncrypted?: string;
};

function secToHMS(sec: number): string {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = Math.floor(sec % 60);
  if (h === 0) return `${m}:${String(s).padStart(2, "0")}`;
  return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function activityFromDoc(d: ActivityDoc): Activity {
  return {
    id: d.$id,
    date: d.date,
    time: d.time ?? "",
    sport: d.sport,
    title: d.title,
    dur: secToHMS(d.durationSec),
    dist: d.distanceM ? Math.round((d.distanceM / 1000) * 10) / 10 : 0,
    elev: d.elevationM ? Math.round(d.elevationM) : 0,
    tss: d.tss ?? 0,
    if: d.intensityFactor ?? 0,
    np: d.np,
    avgHR: d.avgHR,
    pace: d.pace,
    cad: d.cadence,
    kj: d.kj,
  };
}

export function plannedFromDoc(d: PlannedDoc): PlannedWorkout {
  return {
    id: d.$id,
    date: d.date,
    sport: d.sport,
    title: d.title,
    est: {
      dur: secToHMS(d.estDurationSec),
      dist: d.estDistanceM ? Math.round((d.estDistanceM / 1000) * 10) / 10 : undefined,
      tss: d.estTSS ?? 0,
      if: d.estIF ?? 0,
    },
    blocks: JSON.parse(d.blocks),
    notes: d.notes,
    source: d.source,
    status: d.status,
  };
}

export function athleteFromDoc(d: AthleteDoc): Athlete {
  return {
    name: d.name,
    initials: d.initials,
    ftp: d.ftp ?? 0,
    lthr: d.lthr ?? 0,
    maxHR: d.maxHR ?? 0,
    weight: d.weight ?? 0,
    vo2max: d.vo2max ?? 0,
    hrv: d.hrv ?? 0,
    restingHR: d.restingHR ?? 0,
  };
}

function userPerms(userId: string) {
  return [
    Permission.read(Role.user(userId)),
    Permission.update(Role.user(userId)),
    Permission.delete(Role.user(userId)),
  ];
}

export async function listActivities(userId: string, limit = 200): Promise<Activity[]> {
  const s = await createSessionClient();
  if (!s) return [];
  const res = await s.databases.listDocuments(DB(), COLLECTIONS.activities, [
    Query.equal("userId", userId),
    Query.orderDesc("date"),
    Query.limit(limit),
  ]);
  return (res.documents as unknown as ActivityDoc[]).map(activityFromDoc);
}

export async function createActivity(userId: string, data: Omit<ActivityDoc, "$id" | "userId">): Promise<Activity> {
  const admin = createAdminClient();
  const doc = (await admin.databases.createDocument(
    DB(),
    COLLECTIONS.activities,
    ID.unique(),
    { ...data, userId },
    userPerms(userId)
  )) as unknown as ActivityDoc;
  return activityFromDoc(doc);
}

export async function findActivityByExternalId(userId: string, source: string, externalId: string) {
  const admin = createAdminClient();
  const res = await admin.databases.listDocuments(DB(), COLLECTIONS.activities, [
    Query.equal("userId", userId),
    Query.equal("source", source),
    Query.equal("externalId", externalId),
    Query.limit(1),
  ]);
  return res.documents[0] ?? null;
}

export async function listPlannedWorkouts(userId: string, limit = 200): Promise<PlannedWorkout[]> {
  const s = await createSessionClient();
  if (!s) return [];
  const res = await s.databases.listDocuments(DB(), COLLECTIONS.plannedWorkouts, [
    Query.equal("userId", userId),
    Query.orderAsc("date"),
    Query.limit(limit),
  ]);
  return (res.documents as unknown as PlannedDoc[]).map(plannedFromDoc);
}

export async function createPlannedWorkout(
  userId: string,
  data: Omit<PlannedDoc, "$id" | "userId" | "blocks"> & { blocks: unknown }
): Promise<PlannedWorkout> {
  const s = await createSessionClient();
  if (!s) throw new Error("not authenticated");
  const doc = (await s.databases.createDocument(
    DB(),
    COLLECTIONS.plannedWorkouts,
    ID.unique(),
    { ...data, userId, blocks: JSON.stringify(data.blocks) },
    userPerms(userId)
  )) as unknown as PlannedDoc;
  return plannedFromDoc(doc);
}

export async function getAthlete(userId: string): Promise<AthleteDoc | null> {
  const admin = createAdminClient();
  const res = await admin.databases.listDocuments(DB(), COLLECTIONS.athletes, [
    Query.equal("userId", userId),
    Query.limit(1),
  ]);
  return (res.documents[0] as unknown as AthleteDoc) ?? null;
}

export async function upsertAthlete(
  userId: string,
  patch: Partial<Omit<AthleteDoc, "$id" | "userId">>
): Promise<AthleteDoc> {
  const admin = createAdminClient();
  const existing = await getAthlete(userId);
  if (existing) {
    return (await admin.databases.updateDocument(
      DB(),
      COLLECTIONS.athletes,
      existing.$id,
      patch
    )) as unknown as AthleteDoc;
  }
  const initials =
    (patch.name ?? "Atleta")
      .trim()
      .split(/\s+/)
      .map((p) => p[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "AT";
  return (await admin.databases.createDocument(
    DB(),
    COLLECTIONS.athletes,
    ID.unique(),
    {
      userId,
      name: patch.name ?? "Atleta",
      initials: patch.initials ?? initials,
      ...patch,
    },
    userPerms(userId)
  )) as unknown as AthleteDoc;
}

type IntegrationDoc = {
  $id: string;
  userId: string;
  provider: "strava" | "garmin" | "wahoo";
  accessTokenEncrypted: string;
  refreshTokenEncrypted?: string;
  expiresAt?: number;
  externalUserId?: string;
  scope?: string;
  lastSyncAt?: number;
};

export async function getIntegration(userId: string, provider: IntegrationDoc["provider"]) {
  const admin = createAdminClient();
  const res = await admin.databases.listDocuments(DB(), COLLECTIONS.integrations, [
    Query.equal("userId", userId),
    Query.equal("provider", provider),
    Query.limit(1),
  ]);
  return (res.documents[0] as unknown as IntegrationDoc) ?? null;
}

export async function upsertIntegration(
  userId: string,
  provider: IntegrationDoc["provider"],
  patch: Partial<Omit<IntegrationDoc, "$id" | "userId" | "provider">>
): Promise<IntegrationDoc> {
  const admin = createAdminClient();
  const existing = await getIntegration(userId, provider);
  if (existing) {
    return (await admin.databases.updateDocument(
      DB(),
      COLLECTIONS.integrations,
      existing.$id,
      patch
    )) as unknown as IntegrationDoc;
  }
  return (await admin.databases.createDocument(
    DB(),
    COLLECTIONS.integrations,
    ID.unique(),
    { userId, provider, ...patch },
    userPerms(userId)
  )) as unknown as IntegrationDoc;
}

export async function deleteIntegration(userId: string, provider: IntegrationDoc["provider"]) {
  const existing = await getIntegration(userId, provider);
  if (!existing) return;
  const admin = createAdminClient();
  await admin.databases.deleteDocument(DB(), COLLECTIONS.integrations, existing.$id);
}

export type { ActivityDoc, PlannedDoc, AthleteDoc, IntegrationDoc };
