import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

export async function createSourceSheetMediaRelations(
  supabase: SupabaseClient<Database>,
  relations: Database["public"]["Tables"]["source_sheet_media"]["Insert"][],
) {
  if (relations.length === 0) {
    return;
  }

  const sourceSheetMediaTable = supabase.from("source_sheet_media");
  const { error } = await sourceSheetMediaTable.insert(
    relations as Parameters<typeof sourceSheetMediaTable.insert>[0],
  );

  if (error) {
    throw error;
  }
}

export async function deleteSourceSheetMediaRelationsByMediaAssetIds(
  supabase: SupabaseClient<Database>,
  mediaAssetIds: string[],
) {
  if (mediaAssetIds.length === 0) {
    return;
  }

  const { error } = await supabase
    .from("source_sheet_media")
    .delete()
    .in("media_asset_id", mediaAssetIds);

  if (error) {
    throw error;
  }
}

export async function deleteSourceSheetMediaRelationsBySourceSheetId(
  supabase: SupabaseClient<Database>,
  sourceSheetId: string,
) {
  const { error } = await supabase
    .from("source_sheet_media")
    .delete()
    .eq("source_sheet_id", sourceSheetId);

  if (error) {
    throw error;
  }
}
