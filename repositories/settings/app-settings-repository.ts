import type { SupabaseClient } from "@supabase/supabase-js";
import type { AppSetting } from "@/modules/editorial-settings/domain/app-setting";
import type { Database } from "@/types/database";

function mapAppSetting(
  row: Database["public"]["Tables"]["app_settings"]["Row"],
): AppSetting {
  return {
    id: row.id,
    key: row.key,
    value: row.value,
    description: row.description,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function listAppSettings(supabase: SupabaseClient<Database>) {
  const { data, error } = await supabase
    .from("app_settings")
    .select("*")
    .order("key", { ascending: true });

  if (error) {
    throw error;
  }

  return data.map(mapAppSetting);
}

