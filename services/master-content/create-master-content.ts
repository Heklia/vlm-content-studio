"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/infrastructure/supabase/server";
import { createMasterContent } from "@/repositories/master-content/master-contents-repository";
import { requireAuth } from "@/services/auth/require-auth";

function getTextValue(formData: FormData, key: string) {
  const value = formData.get(key);

  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();

  return trimmed.length > 0 ? trimmed : null;
}

function getKeyPoints(formData: FormData) {
  const raw = getTextValue(formData, "key_points");

  if (!raw) {
    return [];
  }

  return raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

export async function createMasterContentAction(formData: FormData) {
  const currentUser = await requireAuth();
  const profile = currentUser.profile;

  if (!profile) {
    redirect("/master-content/new?error=missing_profile");
  }

  if (profile.role === "viewer") {
    redirect("/master-content/new?error=forbidden");
  }

  const title = getTextValue(formData, "title");

  if (!title) {
    redirect("/master-content/new?error=missing_title");
  }

  const supabase = await createClient();
  const masterContent = await createMasterContent(supabase, {
    angle: getTextValue(formData, "angle"),
    body: getTextValue(formData, "body"),
    call_to_action: getTextValue(formData, "call_to_action"),
    created_by_profile_id: profile.id,
    editorial_notes: getTextValue(formData, "editorial_notes"),
    generation_mode: "manual",
    hook: getTextValue(formData, "hook"),
    key_points: getKeyPoints(formData),
    source_sheet_id: getTextValue(formData, "source_sheet_id"),
    status: "draft",
    title,
  });

  redirect(`/master-content/${masterContent.id}`);
}

