"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/infrastructure/supabase/server";
import { createChannelVariant } from "@/repositories/channel-variants/channel-variants-repository";
import { requireAuth } from "@/services/auth/require-auth";

function getTextValue(formData: FormData, key: string) {
  const value = formData.get(key);

  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();

  return trimmed.length > 0 ? trimmed : null;
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

export async function createChannelVariantAction(formData: FormData) {
  const currentUser = await requireAuth();
  const profile = currentUser.profile;

  if (!profile) {
    redirect("/channel-variants/new?error=missing_profile");
  }

  if (profile.role === "viewer") {
    redirect("/channel-variants/new?error=forbidden");
  }

  const masterContentId = getTextValue(formData, "master_content_id");
  const channelId = getTextValue(formData, "channel_id");
  const title = getTextValue(formData, "title");

  if (!masterContentId) {
    redirect("/channel-variants/new?error=missing_master_content");
  }

  if (!channelId) {
    redirect("/channel-variants/new?error=missing_channel");
  }

  if (!title) {
    redirect("/channel-variants/new?error=missing_title");
  }

  const supabase = await createClient();
  const channelVariant = await createChannelVariant(supabase, {
    body: getTextValue(formData, "body"),
    call_to_action: getTextValue(formData, "call_to_action"),
    channel_id: channelId,
    created_by_profile_id: profile.id,
    excerpt: getTextValue(formData, "excerpt"),
    generation_mode: "manual",
    google_business_post_type: getTextValue(
      formData,
      "google_business_post_type",
    ),
    hashtags: getHashtags(formData),
    master_content_id: masterContentId,
    pinterest_board: getTextValue(formData, "pinterest_board"),
    seo_description: getTextValue(formData, "seo_description"),
    seo_title: getTextValue(formData, "seo_title"),
    status: "draft",
    title,
    wordpress_category_id: getTextValue(formData, "wordpress_category_id"),
  });

  redirect(`/channel-variants/${channelVariant.id}`);
}
