"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/infrastructure/supabase/server";
import { removePrivateFiles } from "@/infrastructure/supabase/storage";
import {
  deleteMediaAssetsByIds,
  listMediaAssetsByIds,
} from "@/repositories/media/media-assets-repository";
import { deleteSourceSheetMediaRelationsByMediaAssetIds } from "@/repositories/source-sheets/source-sheet-media-repository";
import { requireAuth } from "@/services/auth/require-auth";

function getSelectedIds(formData: FormData, key: string) {
  return formData
    .getAll(key)
    .filter((value): value is string => typeof value === "string" && value.length > 0);
}

async function deleteMediaAssets(ids: string[], redirectTo: string) {
  const currentUser = await requireAuth();
  const profile = currentUser.profile;

  if (ids.length === 0) {
    redirect(`${redirectTo}?error=no_selection`);
  }

  if (!profile || profile.role === "viewer") {
    redirect(`${redirectTo}?error=forbidden`);
  }

  const supabase = await createClient();
  const assets = await listMediaAssetsByIds(supabase, ids);

  if (assets.length === 0) {
    redirect(`${redirectTo}?error=missing_media`);
  }

  const hasForbiddenAsset =
    profile.role === "contributor" &&
    assets.some((asset) => asset.uploadedByProfileId !== profile.id);

  if (hasForbiddenAsset) {
    redirect(`${redirectTo}?error=forbidden`);
  }

  await deleteSourceSheetMediaRelationsByMediaAssetIds(
    supabase,
    assets.map((asset) => asset.id),
  );

  const pathsByBucket = assets.reduce<Record<string, string[]>>((buckets, asset) => {
    buckets[asset.storageBucket] = buckets[asset.storageBucket] ?? [];
    buckets[asset.storageBucket].push(asset.storagePath);

    return buckets;
  }, {});

  for (const [bucket, paths] of Object.entries(pathsByBucket)) {
    await removePrivateFiles(supabase, bucket, paths);
  }

  await deleteMediaAssetsByIds(
    supabase,
    assets.map((asset) => asset.id),
  );

  redirect(redirectTo);
}

export async function deleteMediaAssetAction(formData: FormData) {
  const mediaAssetId = formData.get("media_asset_id");

  if (typeof mediaAssetId !== "string" || mediaAssetId.length === 0) {
    redirect("/media?error=missing_media");
  }

  await deleteMediaAssets([mediaAssetId], "/media");
}

export async function deleteSelectedMediaAssetsAction(formData: FormData) {
  const ids = getSelectedIds(formData, "media_asset_ids");

  await deleteMediaAssets(ids, "/media");
}
