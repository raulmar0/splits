-- Splits — initial schema
-- Apply with: psql "$DATABASE_URL" -f supabase/migrations/0001_init.sql
-- Or paste into Supabase Studio → SQL editor.

create extension if not exists "pgcrypto";

-- ATHLETES — 1 row per auth user
create table if not exists public.athletes (
  user_id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  initials text not null,
  ftp integer check (ftp is null or (ftp between 50 and 700)),
  lthr integer check (lthr is null or (lthr between 80 and 220)),
  max_hr integer check (max_hr is null or (max_hr between 100 and 230)),
  weight numeric check (weight is null or (weight between 30 and 200)),
  vo2max numeric check (vo2max is null or (vo2max between 20 and 90)),
  hrv integer check (hrv is null or (hrv between 10 and 200)),
  resting_hr integer check (resting_hr is null or (resting_hr between 30 and 100)),
  main_sport text,
  goal text,
  llm_provider text check (llm_provider is null or llm_provider in ('anthropic','openai')),
  llm_api_key_encrypted text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ACTIVITIES — completed sessions (manual + imports + connected services)
create table if not exists public.activities (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  external_id text,
  source text not null check (source in ('manual','import','strava','garmin','wahoo','zwift')),
  date date not null,
  time text,
  sport text not null check (sport in ('ride','run','swim','strength','trail','mtb','rest')),
  title text not null,
  duration_sec integer not null check (duration_sec >= 0),
  distance_m numeric check (distance_m is null or distance_m >= 0),
  elevation_m numeric check (elevation_m is null or elevation_m >= 0),
  tss integer check (tss is null or (tss between 0 and 1000)),
  intensity_factor numeric check (intensity_factor is null or (intensity_factor between 0 and 2)),
  np integer check (np is null or (np between 0 and 2000)),
  avg_hr integer check (avg_hr is null or (avg_hr between 0 and 250)),
  pace text,
  cadence integer check (cadence is null or (cadence between 0 and 250)),
  kj integer check (kj is null or kj >= 0),
  created_at timestamptz not null default now()
);
create index if not exists activities_user_date_idx on public.activities(user_id, date desc);
create unique index if not exists activities_user_source_external_idx
  on public.activities(user_id, source, external_id)
  where external_id is not null;

-- PLANNED_WORKOUTS — scheduled sessions, blocks stored as JSONB
create table if not exists public.planned_workouts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  date date not null,
  sport text not null check (sport in ('ride','run','swim','strength','trail','mtb','rest')),
  title text not null,
  est_duration_sec integer not null check (est_duration_sec >= 0),
  est_distance_m numeric,
  est_tss integer check (est_tss is null or (est_tss between 0 and 1000)),
  est_if numeric check (est_if is null or (est_if between 0 and 2)),
  blocks jsonb not null,
  notes text,
  source text not null check (source in ('manual','ai','template','imported')),
  status text not null check (status in ('draft','scheduled','completed','skipped')),
  created_at timestamptz not null default now()
);
create index if not exists planned_workouts_user_date_idx on public.planned_workouts(user_id, date);

-- INTEGRATIONS — OAuth tokens per (user, provider), encrypted at app layer
create table if not exists public.integrations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  provider text not null check (provider in ('strava','garmin','wahoo')),
  access_token_encrypted text not null,
  refresh_token_encrypted text,
  expires_at integer,
  external_user_id text,
  scope text,
  last_sync_at integer,
  created_at timestamptz not null default now(),
  unique(user_id, provider)
);
create index if not exists integrations_external_user_idx on public.integrations(provider, external_user_id);

-- RLS — every row scoped to its owner
alter table public.athletes enable row level security;
alter table public.activities enable row level security;
alter table public.planned_workouts enable row level security;
alter table public.integrations enable row level security;

drop policy if exists "own athlete" on public.athletes;
drop policy if exists "own activities" on public.activities;
drop policy if exists "own planned" on public.planned_workouts;
drop policy if exists "own integrations" on public.integrations;

create policy "own athlete" on public.athletes
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own activities" on public.activities
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own planned" on public.planned_workouts
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own integrations" on public.integrations
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- updated_at trigger for athletes
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end
$$;

drop trigger if exists athletes_set_updated_at on public.athletes;
create trigger athletes_set_updated_at
  before update on public.athletes
  for each row execute function public.set_updated_at();
