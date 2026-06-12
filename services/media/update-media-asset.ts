"use server";

import { redirect } from "next/navigation";
import { mandatoryAiVisualNotice } from "@/modules/media/domain/media-asset";
import { createClient } from "@/infrastructure/supabase/server";
import { getMediaAssetById, updateMediaAsset } from "@/repositories/media/media-assets-repository";
import { requireAuth } from "@/services/auth/require-auth";

function getTextValue(formData: FormData, key: string) {
  const value = formData.get(key);

  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();

  return trimmed.length > 0 ? trimmed : null;
}

export async function updateMediaAssetAction(formData: FormData) {
  const currentUser = await requireAuth();
  const profile = currentUser.profile;
  const mediaAssetId = getTextValue(formData, "media_asset_id");

  if (!profile || !mediaAssetId) {
    redirect("/media?error=missing_media");
  }

  const supabase = await createClient();
  const asset = await getMediaAssetById(supabase, mediaAssetId);

  if (!asset) {
    redirect("/media?error=missing_media");
  }

  if (
    profile.role === "viewer" ||
    (profile.role === "contributor" && asset.uploadedByProfileId !== profile.id)
  ) {
    redirect(`/media/${mediaAssetId}?error=forbidden`);
  }

  const isAiGenerated = formData.get("is_ai_generated") === "on";
  const aiVisualNotice = getTextValue(formData, "ai_visual_notice");

  if (isAiGenerated && !aiVisualNotice) {
    redirect(`/media/${mediaAssetId}?error=missing_ai_notice`);
  }

  await updateMediaAsset(supabase, mediaAssetId, {
    ai_visual_notice: isAiGenerated
      ? (aiVisualNotice ?? mandatoryAiVisualNotice)
      : null,
    alt_text: getTextValue(formData, "alt_text"),
    credit: getTextValue(formData, "credit"),
    description: getTextValue(formData, "description"),
    is_ai_generated: isAiGenerated,
    is_primary: formData.get("is_primary") === "on",
    status: getTextValue(formData, "status") === "archived" ? "archived" : "active",
    title: getTextValue(formData, "title"),
  });

  redirect(`/media/${mediaAssetId}?saved=1`);
}
