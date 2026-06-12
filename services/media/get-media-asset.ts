import { createClient } from "@/infrastructure/supabase/server";
import { createSignedMediaUrl } from "@/infrastructure/supabase/storage";
import { getMediaAssetById } from "@/repositories/media/media-assets-repository";

export async function getMediaAsset(id: string) {
  const supabase = await createClient();
  const asset = await getMediaAssetById(supabase, id);

  if (!asset) {
    return null;
  }

  return {
    ...asset,
    previewUrl:
      asset.fileType === "image"
        ? await createSignedMediaUrl(supabase, asset.storagePath)
        : null,
  };
}
