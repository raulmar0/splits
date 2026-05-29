import type { Block, Sport } from "@/lib/types";

export type ActivitySource = "manual" | "import" | "strava" | "garmin" | "wahoo" | "zwift";
export type PlannedSource = "manual" | "ai" | "template" | "imported";
export type PlannedStatus = "draft" | "scheduled" | "completed" | "skipped";
export type IntegrationProvider = "strava" | "garmin" | "wahoo";
export type LlmProvider = "anthropic" | "openai";

export interface AthleteRow {
  user_id: string;
  name: string;
  initials: string;
  ftp: number | null;
  lthr: number | null;
  max_hr: number | null;
  weight: number | null;
  vo2max: number | null;
  hrv: number | null;
  resting_hr: number | null;
  main_sport: string | null;
  goal: string | null;
  llm_provider: LlmProvider | null;
  llm_api_key_encrypted: string | null;
  created_at: string;
  updated_at: string;
}

export interface ActivityRow {
  id: string;
  user_id: string;
  external_id: string | null;
  source: ActivitySource;
  date: string;
  time: string | null;
  sport: Sport;
  title: string;
  duration_sec: number;
  distance_m: number | null;
  elevation_m: number | null;
  tss: number | null;
  intensity_factor: number | null;
  np: number | null;
  avg_hr: number | null;
  pace: string | null;
  cadence: number | null;
  kj: number | null;
  created_at: string;
}

export interface PlannedRow {
  id: string;
  user_id: string;
  date: string;
  sport: Sport;
  title: string;
  est_duration_sec: number;
  est_distance_m: number | null;
  est_tss: number | null;
  est_if: number | null;
  blocks: Block[];
  notes: string | null;
  source: PlannedSource;
  status: PlannedStatus;
  created_at: string;
}

export interface IntegrationRow {
  id: string;
  user_id: string;
  provider: IntegrationProvider;
  access_token_encrypted: string;
  refresh_token_encrypted: string | null;
  expires_at: number | null;
  external_user_id: string | null;
  scope: string | null;
  last_sync_at: number | null;
  created_at: string;
}

export type Database = {
  public: {
    Tables: {
      athletes: {
        Row: AthleteRow;
        Insert: Partial<AthleteRow> & { user_id: string; name: string; initials: string };
        Update: Partial<AthleteRow>;
        Relationships: [];
      };
      activities: {
        Row: ActivityRow;
        Insert: Omit<ActivityRow, "id" | "created_at"> & { id?: string; created_at?: string };
        Update: Partial<ActivityRow>;
        Relationships: [];
      };
      planned_workouts: {
        Row: PlannedRow;
        Insert: Omit<PlannedRow, "id" | "created_at"> & { id?: string; created_at?: string };
        Update: Partial<PlannedRow>;
        Relationships: [];
      };
      integrations: {
        Row: IntegrationRow;
        Insert: Omit<IntegrationRow, "id" | "created_at"> & { id?: string; created_at?: string };
        Update: Partial<IntegrationRow>;
        Relationships: [];
      };
    };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
};
