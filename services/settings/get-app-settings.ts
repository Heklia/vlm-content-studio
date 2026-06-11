import { createClient } from "@/infrastructure/supabase/server";
import { listAppSettings } from "@/repositories/settings/app-settings-repository";

export async function getAppSettings() {
  const supabase = await createClient();

  return listAppSettings(supabase);
}

