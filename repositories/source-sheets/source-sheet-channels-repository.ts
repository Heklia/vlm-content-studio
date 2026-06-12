import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

export async function createSourceSheetChannelRelations(
  supabase: SupabaseClient<Database>,
  relations: Database["public"]["Tables"]["source_sheet_channels"]["Insert"][],
) {
  if (relations.length === 0) {
    return;
  }

  const sourceSheetChannelsTable = supabase.from("source_sheet_channels");
  const { error } = await sourceSheetChannelsTable.insert(
    relations as Parameters<typeof sourceSheetChannelsTable.insert>[0],
  );

  if (error) {
    throw error;
  }
}

export async function deleteSourceSheetChannelRelationsBySourceSheetId(
  supabase: SupabaseClient<Database>,
  sourceSheetId: string,
) {
  const { error } = await supabase
    .from("source_sheet_channels")
    .delete()
    .eq("source_sheet_id", sourceSheetId);

  if (error) {
    throw error;
  }
}
