"use client";

import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseConfig } from "@/infrastructure/supabase/env";
import type { Database } from "@/types/database";

export function createClient() {
  const { anonKey, isConfigured, url } = getSupabaseConfig();

  if (!isConfigured) {
    throw new Error("Supabase is not configured.");
  }

  return createBrowserClient<Database>(url!, anonKey!);
}
