import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { getSupabaseConfig } from "@/infrastructure/supabase/env";
import type { Database } from "@/types/database";

export async function createClient() {
  const { anonKey, isConfigured, url } = getSupabaseConfig();

  if (!isConfigured) {
    throw new Error("Supabase is not configured.");
  }

  const cookieStore = await cookies();

  return createServerClient<Database>(url!, anonKey!, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // Server Components cannot set cookies. Proxy refreshes sessions.
        }
      },
    },
  });
}
