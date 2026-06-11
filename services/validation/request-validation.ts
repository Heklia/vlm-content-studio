"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/infrastructure/supabase/server";
import {
  getChannelVariantById,
  updateChannelVariantStatus,
} from "@/repositories/channel-variants/channel-variants-repository";
import {
  createValidationReview,
  getActiveValidationReviewForVariant,
} from "@/repositories/validation/validation-reviews-repository";
import { createWorkflowEvent } from "@/services/workflow/create-workflow-event";
import { requireAuth } from "@/services/auth/require-auth";

function getTextValue(formData: FormData, key: string) {
  const value = formData.get(key);

  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();

  return trimmed.length > 0 ? trimmed : null;
}

export async function requestValidationAction(formData: FormData) {
  const currentUser = await requireAuth();
  const profile = currentUser.profile;

  if (!profile || profile.role === "viewer") {
    redirect("/validation?error=forbidden");
  }

  const channelVariantId = getTextValue(formData, "channel_variant_id");

  if (!channelVariantId) {
    redirect("/validation?error=missing_channel_variant");
  }

  const supabase = await createClient();
  const channelVariant = await getChannelVariantById(supabase, channelVariantId);

  if (!channelVariant) {
    redirect("/validation?error=missing_channel_variant");
  }

  if (channelVariant.status !== "draft") {
    redirect(`/channel-variants/${channelVariant.id}?error=invalid_status`);
  }

  if (
    profile.role === "contributor" &&
    channelVariant.createdByProfileId !== profile.id
  ) {
    redirect("/validation?error=forbidden");
  }

  const activeReview = await getActiveValidationReviewForVariant(
    supabase,
    channelVariant.id,
  );

  if (activeReview) {
    redirect(`/validation/${activeReview.id}?error=already_pending`);
  }

  const review = await createValidationReview(supabase, {
    channel_variant_id: channelVariant.id,
    request_note: getTextValue(formData, "request_note"),
    requested_by_profile_id: profile.id,
    status: "pending",
  });

  await updateChannelVariantStatus(supabase, channelVariant.id, "review");
  await createWorkflowEvent(supabase, {
    actor_profile_id: profile.id,
    channel_variant_id: channelVariant.id,
    event_type: "validation_requested",
    from_status: "draft",
    note: review.requestNote,
    to_status: "review",
  });

  redirect(`/validation/${review.id}`);
}
