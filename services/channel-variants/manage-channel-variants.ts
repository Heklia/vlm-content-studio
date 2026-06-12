"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/infrastructure/supabase/server";
import {
  deleteChannelVariantsByIds,
  getChannelVariantById,
  updateChannelVariant,
  updateChannelVariantStatus,
} from "@/repositories/channel-variants/channel-variants-repository";
import { requireAuth } from "@/services/auth/require-auth";
import { createWorkflowEvent } from "@/services/workflow/create-workflow-event";

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

function getHashtags(formData: FormData) {
  const raw = getTextValue(formData, "hashtags");

  if (!raw) {
    return [];
  }

  return raw
    .split(/[\r\n,]+/)
    .map((tag) => tag.trim())
    .filter(Boolean)
    .map((tag) => (tag.startsWith("#") ? tag : `#${tag}`));
}

function canManage(role: string | undefined) {
  return role === "administrator" || role === "validator";
}

export async function validateChannelVariantAction(formData: FormData) {
  const currentUser = await requireAuth();
  const profile = currentUser.profile;
  const channelVariantId = getTextValue(formData, "channel_variant_id");
  const redirectTo = getTextValue(formData, "redirect_to") ?? "/channel-variants";

  if (!profile || !canManage(profile.role) || !channelVariantId) {
    redirect(`${redirectTo}?error=forbidden`);
  }

  const supabase = await createClient();
  const variant = await getChannelVariantById(supabase, channelVariantId);

  if (!variant) {
    redirect(`${redirectTo}?error=missing_variant`);
  }

  await updateChannelVariantStatus(supabase, variant.id, "ready");
  await createWorkflowEvent(supabase, {
    actor_profile_id: profile.id,
    channel_variant_id: variant.id,
    event_type: "approved",
    from_status: variant.status,
    note: "Validation directe depuis les déclinaisons.",
    to_status: "ready",
  });

  redirect(redirectTo);
}

export async function invalidateChannelVariantAction(formData: FormData) {
  const currentUser = await requireAuth();
  const profile = currentUser.profile;
  const channelVariantId = getTextValue(formData, "channel_variant_id");
  const redirectTo = getTextValue(formData, "redirect_to") ?? "/channel-variants";

  if (!profile || !canManage(profile.role) || !channelVariantId) {
    redirect(`${redirectTo}?error=forbidden`);
  }

  const supabase = await createClient();
  const variant = await getChannelVariantById(supabase, channelVariantId);

  if (!variant) {
    redirect(`${redirectTo}?error=missing_variant`);
  }

  await updateChannelVariantStatus(supabase, variant.id, "draft");
  await createWorkflowEvent(supabase, {
    actor_profile_id: profile.id,
    channel_variant_id: variant.id,
    event_type: "changes_requested",
    from_status: variant.status,
    note: "Invalidation directe depuis les déclinaisons.",
    to_status: "draft",
  });

  redirect(redirectTo);
}

export async function deleteSelectedChannelVariantsAction(formData: FormData) {
  const currentUser = await requireAuth();
  const profile = currentUser.profile;
  const ids = getSelectedIds(formData, "channel_variant_ids");

  if (ids.length === 0) {
    redirect("/channel-variants?error=no_selection");
  }

  if (!profile || !canManage(profile.role)) {
    redirect("/channel-variants?error=forbidden");
  }

  const supabase = await createClient();
  await deleteChannelVariantsByIds(supabase, ids);

  redirect("/channel-variants");
}

export async function updateChannelVariantAction(formData: FormData) {
  const currentUser = await requireAuth();
  const profile = currentUser.profile;
  const channelVariantId = getTextValue(formData, "channel_variant_id");

  if (!profile || !channelVariantId) {
    redirect("/channel-variants?error=missing_variant");
  }

  const supabase = await createClient();
  const variant = await getChannelVariantById(supabase, channelVariantId);

  if (!variant) {
    redirect("/channel-variants?error=missing_variant");
  }

  if (
    profile.role === "viewer" ||
    (profile.role === "contributor" &&
      variant.createdByProfileId !== profile.id) ||
    variant.status === "archived"
  ) {
    redirect(`/channel-variants/${channelVariantId}/edit?error=forbidden`);
  }

  const title = getTextValue(formData, "title");

  if (!title) {
    redirect(`/channel-variants/${channelVariantId}/edit?error=missing_title`);
  }

  await updateChannelVariant(supabase, channelVariantId, {
    body: getTextValue(formData, "body"),
    call_to_action: getTextValue(formData, "call_to_action"),
    excerpt: getTextValue(formData, "excerpt"),
    google_business_post_type: getTextValue(formData, "google_business_post_type"),
    hashtags: getHashtags(formData),
    pinterest_board: getTextValue(formData, "pinterest_board"),
    seo_description: getTextValue(formData, "seo_description"),
    seo_title: getTextValue(formData, "seo_title"),
    title,
    wordpress_category_id: getTextValue(formData, "wordpress_category_id"),
  });

  redirect(`/channel-variants/${channelVariantId}?saved=1`);
}
