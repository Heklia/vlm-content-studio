import type { SupabaseClient } from "@supabase/supabase-js";
import type { ContentPillar } from "@/modules/content-pillars/domain/content-pillar";
import type { Database } from "@/types/database";

function mapContentPillar(
  row: Database["public"]["Tables"]["content_pillars"]["Row"],
): ContentPillar {
  return {
    id: row.id,
    key: row.key,
    label: row.label,
    targetPercentage: row.target_percentage,
    isActive: row.is_active,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function listContentPillars(supabase: SupabaseClient<Database>) {
  const { data, error } = await supabase
    .from("content_pillars")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    throw error;
  }

  return data.map(mapContentPillar);
}

