"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/infrastructure/supabase/server";
import {
  getChannelVariantById,
  updateChannelVariantStatus,
} from "@/repositories/channel-variants/channel-variants-repository";
import { createScheduledPublication } from "@/repositories/planning/scheduled-publications-repository";
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

export async function createScheduledPublicationAction(formData: FormData) {
  const currentUser = await requireAuth();
  const profile = currentUser.profile;

  if (!profile || !["administrator", "validator"].includes(profile.role)) {
    redirect("/planning/new?error=forbidden");
  }

  const channelVariantId = getTextValue(formData, "channel_variant_id");
  const scheduledForInput = getTextValue(formData, "scheduled_for");

  if (!channelVariantId) {
    redirect("/planning/new?error=missing_channel_variant");
  }

  if (!scheduledForInput) {
    redirect("/planning/new?error=missing_date");
  }

  const scheduledFor = new Date(scheduledForInput);

  if (Number.isNaN(scheduledFor.getTime())) {
    redirect("/planning/new?error=invalid_date");
  }

  const supabase = await createClient();
  const channelVariant = await getChannelVariantById(supabase, channelVariantId);

  if (!channelVariant) {
    redirect("/planning/new?error=missing_channel_variant");
  }

  if (channelVariant.status !== "ready") {
    redirect("/planning/new?error=invalid_status");
  }

  const publicationNotes = getTextValue(formData, "publication_notes");
  const publication = await createScheduledPublication(supabase, {
    channel_id: channelVariant.channelId,
    channel_variant_id: channelVariant.id,
    created_by_profile_id: profile.id,
    publication_notes: publicationNotes,
    scheduled_for: scheduledFor.toISOString(),
    status: "scheduled",
  });

  await updateChannelVariantStatus(supabase, channelVariant.id, "scheduled");
  await createWorkflowEvent(supabase, {
    actor_profile_id: profile.id,
    channel_variant_id: channelVariant.id,
    event_type: "scheduled",
    from_status: "ready",
    note: publicationNotes,
    to_status: "scheduled",
  });

  redirect(`/planning?scheduled=${publication.id}`);
}
