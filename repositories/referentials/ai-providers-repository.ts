import type { SupabaseClient } from "@supabase/supabase-js";
import type { AiProvider } from "@/modules/ai-providers/domain/ai-provider";
import type { Database } from "@/types/database";

function mapAiProvider(
  row: Database["public"]["Tables"]["ai_providers"]["Row"],
): AiProvider {
  return {
    id: row.id,
    key: row.key,
    label: row.label,
    status: row.status,
    isDefault: row.is_default,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function listAiProviders(supabase: SupabaseClient<Database>) {
  const { data, error } = await supabase
    .from("ai_providers")
    .select("*")
    .order("label", { ascending: true });

  if (error) {
    throw error;
  }

  return data.map(mapAiProvider);
}

