import type { SupabaseClient } from "@supabase/supabase-js";
import type { Channel } from "@/modules/channels/domain/channel";
import type { Database } from "@/types/database";

function mapChannel(row: Database["public"]["Tables"]["channels"]["Row"]): Channel {
  return {
    id: row.id,
    key: row.key,
    label: row.label,
    status: row.status,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function listChannels(supabase: SupabaseClient<Database>) {
  const { data, error } = await supabase
    .from("channels")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    throw error;
  }

  return data.map(mapChannel);
}

