"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { PUBLIC_ENV } from "@/lib/env";

let _client: SupabaseClient | null = null;

export function supabaseBrowser(): SupabaseClient {
  if (_client) return _client;
  _client = createBrowserClient(PUBLIC_ENV.SUPABASE_URL, PUBLIC_ENV.SUPABASE_ANON_KEY);
  return _client;
}
