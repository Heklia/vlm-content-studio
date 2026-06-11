"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/infrastructure/supabase/server";
import { createSourceSheetChannelRelations } from "@/repositories/source-sheets/source-sheet-channels-repository";
import { createSourceSheetMediaRelations } from "@/repositories/source-sheets/source-sheet-media-repository";
import { createSourceSheet } from "@/repositories/source-sheets/source-sheets-repository";
import { requireAuth } from "@/services/auth/require-auth";

function getTextValue(formData: FormData, key: string) {
  const value = formData.get(key);

  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();

  return trimmed.length > 0 ? trimmed : null;
}

function getSelectedIds(formData: FormData, key: string) {
  return formData
    .getAll(key)
    .filter((value): value is string => typeof value === "string" && value.length > 0);
}

export async function createSourceSheetAction(formData: FormData) {
  const currentUser = await requireAuth();
  const profile = currentUser.profile;

  if (!profile) {
    redirect("/source-sheets/new?error=missing_profile");
  }

  if (profile.role === "viewer") {
    redirect("/source-sheets/new?error=forbidden");
  }

  const title = getTextValue(formData, "title");

  if (!title) {
    redirect("/source-sheets/new?error=missing_title");
  }

  const supabase = await createClient();
  const contentPillarId = getTextValue(formData, "content_pillar_id");
  const wordpressCategoryId = getTextValue(formData, "wordpress_category_id");

  const sourceSheet = await createSourceSheet(supabase, {
    client_or_sector: getTextValue(formData, "client_or_sector"),
    content_pillar_id: contentPillarId,
    context: getTextValue(formData, "context"),
    created_by_profile_id: profile.id,
    know_how: getTextValue(formData, "know_how"),
    location: getTextValue(formData, "location"),
    materials: getTextValue(formData, "materials"),
    status: "draft",
    summary: getTextValue(formData, "summary"),
    technical_details: getTextValue(formData, "technical_details"),
    title,
    wordpress_category_id: wordpressCategoryId,
  });

  const channelIds = getSelectedIds(formData, "channel_ids");
  await createSourceSheetChannelRelations(
    supabase,
    channelIds.map((channelId) => ({
      channel_id: channelId,
      source_sheet_id: sourceSheet.id,
    })),
  );

  const mediaAssetIds = getSelectedIds(formData, "media_asset_ids");
  const primaryMediaAssetId = getTextValue(formData, "primary_media_asset_id");
  await createSourceSheetMediaRelations(
    supabase,
    mediaAssetIds.map((mediaAssetId, index) => ({
      is_primary:
        mediaAssetId === primaryMediaAssetId ||
        (!primaryMediaAssetId && index === 0),
      media_asset_id: mediaAssetId,
      sort_order: index * 10,
      source_sheet_id: sourceSheet.id,
    })),
  );

  redirect(`/source-sheets/${sourceSheet.id}`);
}

