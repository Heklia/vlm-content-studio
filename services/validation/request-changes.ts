"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/infrastructure/supabase/server";
import { updateChannelVariantStatus } from "@/repositories/channel-variants/channel-variants-repository";
import {
  getValidationReviewById,
  updateValidationReview,
} from "@/repositories/validation/validation-reviews-repository";
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

export async function requestChangesAction(formData: FormData) {
  const currentUser = await requireAuth();
  const profile = currentUser.profile;

  if (!profile || !["administrator", "validator"].includes(profile.role)) {
    redirect("/validation?error=forbidden");
  }

  const reviewId = getTextValue(formData, "review_id");

  if (!reviewId) {
    redirect("/validation?error=missing_review");
  }

  const supabase = await createClient();
  const review = await getValidationReviewById(supabase, reviewId);

  if (!review) {
    redirect("/validation?error=missing_review");
  }

  if (review.status !== "pending") {
    redirect(`/validation/${review.id}?error=invalid_status`);
  }

  const reviewNote = getTextValue(formData, "review_note");

  await updateValidationReview(supabase, review.id, {
    reviewed_at: new Date().toISOString(),
    reviewed_by_profile_id: profile.id,
    review_note: reviewNote,
    status: "changes_requested",
  });
  await updateChannelVariantStatus(supabase, review.channelVariantId, "draft");
  await createWorkflowEvent(supabase, {
    actor_profile_id: profile.id,
    channel_variant_id: review.channelVariantId,
    event_type: "changes_requested",
    from_status: "review",
    note: reviewNote,
    to_status: "draft",
  });

  redirect(`/validation/${review.id}`);
}
