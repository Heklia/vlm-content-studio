import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

export const mediaAssetsBucket = "media-assets";

export async function uploadPrivateFile(
  supabase: SupabaseClient<Database>,
  bucket: string,
  path: string,
  file: File,
) {
  const { data, error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });

  if (error) {
    throw error;
  }

  return data;
}

export async function createSignedMediaUrl(
  supabase: SupabaseClient<Database>,
  path: string,
) {
  const { data, error } = await supabase.storage
    .from(mediaAssetsBucket)
    .createSignedUrl(path, 60 * 10);

  if (error) {
    return null;
  }

  return data.signedUrl;
}

