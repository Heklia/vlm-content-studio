import type { SupabaseClient } from "@supabase/supabase-js";
import type { WordPressCategory } from "@/modules/wordpress-categories/domain/wordpress-category";
import type { Database } from "@/types/database";

function mapWordPressCategory(
  row: Database["public"]["Tables"]["wordpress_categories"]["Row"],
): WordPressCategory {
  return {
    id: row.id,
    slug: row.slug,
    label: row.label,
    wordpressId: row.wordpress_id,
    isActive: row.is_active,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function listWordPressCategories(
  supabase: SupabaseClient<Database>,
) {
  const { data, error } = await supabase
    .from("wordpress_categories")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    throw error;
  }

  return data.map(mapWordPressCategory);
}

