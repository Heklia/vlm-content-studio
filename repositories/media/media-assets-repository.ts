import type { SupabaseClient } from "@supabase/supabase-js";
import type { MediaAsset } from "@/modules/media/domain/media-asset";
import type { Database } from "@/types/database";

function mapMediaAsset(
  row: Database["public"]["Tables"]["media_assets"]["Row"],
): MediaAsset {
  return {
    id: row.id,
    storageBucket: row.storage_bucket,
    storagePath: row.storage_path,
    fileName: row.file_name,
    fileType: row.file_type,
    mimeType: row.mime_type,
    fileSize: row.file_size,
    title: row.title,
    description: row.description,
    altText: row.alt_text,
    credit: row.credit,
    isAiGenerated: row.is_ai_generated,
    aiVisualNotice: row.ai_visual_notice,
    status: row.status,
    uploadedByProfileId: row.uploaded_by_profile_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function listMediaAssets(supabase: SupabaseClient<Database>) {
  const { data, error } = await supabase
    .from("media_assets")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data.map(mapMediaAsset);
}

export async function createMediaAsset(
  supabase: SupabaseClient<Database>,
  mediaAsset: Database["public"]["Tables"]["media_assets"]["Insert"],
) {
  const mediaAssetsTable = supabase.from("media_assets");
  const { data, error } = await mediaAssetsTable
    .insert([mediaAsset] as Parameters<typeof mediaAssetsTable.insert>[0])
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return mapMediaAsset(data);
}
