"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/infrastructure/supabase/server";
import {
  createSourceSheetChannelRelations,
  deleteSourceSheetChannelRelationsBySourceSheetId,
} from "@/repositories/source-sheets/source-sheet-channels-repository";
import {
  createSourceSheetMediaRelations,
  deleteSourceSheetMediaRelationsBySourceSheetId,
} from "@/repositories/source-sheets/source-sheet-media-repository";
import {
  deleteSourceSheetById,
  getSourceSheetById,
  updateSourceSheet,
} from "@/repositories/source-sheets/source-sheets-repository";
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

function canManageSourceSheet(
  role: string | undefined,
  profileId: string,
  sourceSheet: { createdByProfileId: string | null; status: string },
) {
  return (
    role === "administrator" ||
    role === "validator" ||
    (role === "contributor" &&
      sourceSheet.createdByProfileId === profileId &&
      sourceSheet.status !== "archived")
  );
}

export async function updateSourceSheetAction(formData: FormData) {
  const currentUser = await requireAuth();
  const profile = currentUser.profile;
  const sourceSheetId = getTextValue(formData, "source_sheet_id");

  if (!profile || !sourceSheetId) {
    redirect("/source-sheets?error=missing_source_sheet");
  }

  const title = getTextValue(formData, "title");

  if (!title) {
    redirect(`/source-sheets/${sourceSheetId}/edit?error=missing_title`);
  }

  const supabase = await createClient();
  const sourceSheet = await getSourceSheetById(supabase, sourceSheetId);

  if (!sourceSheet) {
    redirect("/source-sheets?error=missing_source_sheet");
  }

  if (!canManageSourceSheet(profile.role, profile.id, sourceSheet)) {
    redirect(`/source-sheets/${sourceSheetId}/edit?error=forbidden`);
  }

  await updateSourceSheet(supabase, sourceSheetId, {
    client_or_sector: getTextValue(formData, "client_or_sector"),
    content_pillar_id: getTextValue(formData, "content_pillar_id"),
    context: getTextValue(formData, "context"),
    know_how: getTextValue(formData, "know_how"),
    location: getTextValue(formData, "location"),
    materials: getTextValue(formData, "materials"),
    status: getTextValue(formData, "status") === "ready" ? "ready" : "draft",
    summary: getTextValue(formData, "summary"),
    technical_details: getTextValue(formData, "technical_details"),
    title,
    wordpress_category_id: getTextValue(formData, "wordpress_category_id"),
  });

  const channelIds = getSelectedIds(formData, "channel_ids");
  await deleteSourceSheetChannelRelationsBySourceSheetId(supabase, sourceSheetId);
  await createSourceSheetChannelRelations(
    supabase,
    channelIds.map((channelId) => ({
      channel_id: channelId,
      source_sheet_id: sourceSheetId,
    })),
  );

  const mediaAssetIds = getSelectedIds(formData, "media_asset_ids");
  const primaryMediaAssetId = getTextValue(formData, "primary_media_asset_id");
  await deleteSourceSheetMediaRelationsBySourceSheetId(supabase, sourceSheetId);
  await createSourceSheetMediaRelations(
    supabase,
    mediaAssetIds.map((mediaAssetId, index) => ({
      is_primary:
        mediaAssetId === primaryMediaAssetId ||
        (!primaryMediaAssetId && index === 0),
      media_asset_id: mediaAssetId,
      sort_order: index * 10,
      source_sheet_id: sourceSheetId,
    })),
  );

  redirect(`/source-sheets/${sourceSheetId}?saved=1`);
}

export async function deleteSourceSheetAction(formData: FormData) {
  const currentUser = await requireAuth();
  const profile = currentUser.profile;
  const sourceSheetId = getTextValue(formData, "source_sheet_id");

  if (!profile || !sourceSheetId) {
    redirect("/source-sheets?error=missing_source_sheet");
  }

  const supabase = await createClient();
  const sourceSheet = await getSourceSheetById(supabase, sourceSheetId);

  if (!sourceSheet) {
    redirect("/source-sheets?error=missing_source_sheet");
  }

  if (!canManageSourceSheet(profile.role, profile.id, sourceSheet)) {
    redirect(`/source-sheets/${sourceSheetId}?error=forbidden`);
  }

  await deleteSourceSheetById(supabase, sourceSheetId);

  redirect("/source-sheets");
}
