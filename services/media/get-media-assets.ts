import { createClient } from "@/infrastructure/supabase/server";
import { createSignedMediaUrl } from "@/infrastructure/supabase/storage";
import { listMediaAssets } from "@/repositories/media/media-assets-repository";

export async function getMediaAssets() {
  const supabase = await createClient();
  const mediaAssets = await listMediaAssets(supabase);

  return Promise.all(
    mediaAssets.map(async (asset) => ({
      ...asset,
      previewUrl:
        asset.fileType === "image"
          ? await createSignedMediaUrl(supabase, asset.storagePath)
          : null,
    })),
  );
}

