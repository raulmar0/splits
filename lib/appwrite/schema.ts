export const COLLECTIONS = {
  athletes: "athletes",
  activities: "activities",
  plannedWorkouts: "planned_workouts",
  integrations: "integrations",
} as const;

export type CollectionId = (typeof COLLECTIONS)[keyof typeof COLLECTIONS];

type AttrBase = { key: string; required?: boolean; array?: boolean };
type StringAttr = AttrBase & { type: "string"; size: number };
type EnumAttr = AttrBase & { type: "enum"; elements: string[] };
type IntegerAttr = AttrBase & { type: "integer"; min?: number; max?: number };
type FloatAttr = AttrBase & { type: "float"; min?: number; max?: number };
type BoolAttr = AttrBase & { type: "boolean" };
type DatetimeAttr = AttrBase & { type: "datetime" };
export type Attribute = StringAttr | EnumAttr | IntegerAttr | FloatAttr | BoolAttr | DatetimeAttr;

export type IndexDef = {
  key: string;
  type: "key" | "unique" | "fulltext";
  attributes: string[];
  orders?: ("ASC" | "DESC")[];
};

export type CollectionSpec = {
  id: CollectionId;
  name: string;
  attributes: Attribute[];
  indexes: IndexDef[];
};

const SPORTS = ["ride", "run", "swim", "strength", "trail", "mtb", "rest"];

export const SCHEMA: CollectionSpec[] = [
  {
    id: COLLECTIONS.athletes,
    name: "Athletes",
    attributes: [
      { key: "userId", type: "string", size: 64, required: true },
      { key: "name", type: "string", size: 120, required: true },
      { key: "initials", type: "string", size: 8, required: true },
      { key: "ftp", type: "integer", required: false, min: 50, max: 700 },
      { key: "lthr", type: "integer", required: false, min: 80, max: 220 },
      { key: "maxHR", type: "integer", required: false, min: 100, max: 230 },
      { key: "weight", type: "float", required: false, min: 30, max: 200 },
      { key: "vo2max", type: "float", required: false, min: 20, max: 90 },
      { key: "hrv", type: "integer", required: false, min: 10, max: 200 },
      { key: "restingHR", type: "integer", required: false, min: 30, max: 100 },
      { key: "mainSport", type: "string", size: 32, required: false },
      { key: "goal", type: "string", size: 200, required: false },
      { key: "llmProvider", type: "enum", elements: ["anthropic", "openai"], required: false },
      { key: "llmApiKeyEncrypted", type: "string", size: 2048, required: false },
    ],
    indexes: [{ key: "userId_idx", type: "unique", attributes: ["userId"] }],
  },
  {
    id: COLLECTIONS.activities,
    name: "Activities",
    attributes: [
      { key: "userId", type: "string", size: 64, required: true },
      { key: "externalId", type: "string", size: 128, required: false },
      { key: "source", type: "enum", elements: ["manual", "import", "strava", "garmin", "wahoo", "zwift"], required: true },
      { key: "date", type: "string", size: 10, required: true },
      { key: "time", type: "string", size: 5, required: false },
      { key: "sport", type: "enum", elements: SPORTS, required: true },
      { key: "title", type: "string", size: 200, required: true },
      { key: "durationSec", type: "integer", required: true, min: 0 },
      { key: "distanceM", type: "float", required: false, min: 0 },
      { key: "elevationM", type: "float", required: false, min: 0 },
      { key: "tss", type: "integer", required: false, min: 0, max: 1000 },
      { key: "intensityFactor", type: "float", required: false, min: 0, max: 2 },
      { key: "np", type: "integer", required: false, min: 0, max: 2000 },
      { key: "avgHR", type: "integer", required: false, min: 0, max: 250 },
      { key: "pace", type: "string", size: 16, required: false },
      { key: "cadence", type: "integer", required: false, min: 0, max: 250 },
      { key: "kj", type: "integer", required: false, min: 0 },
    ],
    indexes: [
      { key: "userId_date", type: "key", attributes: ["userId", "date"], orders: ["ASC", "DESC"] },
      { key: "external", type: "key", attributes: ["userId", "source", "externalId"] },
    ],
  },
  {
    id: COLLECTIONS.plannedWorkouts,
    name: "Planned Workouts",
    attributes: [
      { key: "userId", type: "string", size: 64, required: true },
      { key: "date", type: "string", size: 10, required: true },
      { key: "sport", type: "enum", elements: SPORTS, required: true },
      { key: "title", type: "string", size: 200, required: true },
      { key: "estDurationSec", type: "integer", required: true, min: 0 },
      { key: "estDistanceM", type: "float", required: false, min: 0 },
      { key: "estTSS", type: "integer", required: false, min: 0, max: 1000 },
      { key: "estIF", type: "float", required: false, min: 0, max: 2 },
      { key: "blocks", type: "string", size: 16384, required: true },
      { key: "notes", type: "string", size: 2000, required: false },
      { key: "source", type: "enum", elements: ["manual", "ai", "template", "imported"], required: true },
      { key: "status", type: "enum", elements: ["draft", "scheduled", "completed", "skipped"], required: true },
    ],
    indexes: [
      { key: "userId_date", type: "key", attributes: ["userId", "date"], orders: ["ASC", "ASC"] },
    ],
  },
  {
    id: COLLECTIONS.integrations,
    name: "Integrations",
    attributes: [
      { key: "userId", type: "string", size: 64, required: true },
      { key: "provider", type: "enum", elements: ["strava", "garmin", "wahoo"], required: true },
      { key: "accessTokenEncrypted", type: "string", size: 2048, required: true },
      { key: "refreshTokenEncrypted", type: "string", size: 2048, required: false },
      { key: "expiresAt", type: "integer", required: false },
      { key: "externalUserId", type: "string", size: 64, required: false },
      { key: "scope", type: "string", size: 256, required: false },
      { key: "lastSyncAt", type: "integer", required: false },
    ],
    indexes: [
      { key: "userId_provider", type: "unique", attributes: ["userId", "provider"] },
    ],
  },
];
