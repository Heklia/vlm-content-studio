"use server";

import { redirect } from "next/navigation";
import {
  inferMediaFileType,
  mandatoryAiVisualNotice,
} from "@/modules/media/domain/media-asset";
import { createClient } from "@/infrastructure/supabase/server";
import {
  mediaAssetsBucket,
  uploadPrivateFile,
} from "@/infrastructure/supabase/storage";
import { createMediaAsset } from "@/repositories/media/media-assets-repository";
import { requireAuth } from "@/services/auth/require-auth";

function getTextValue(formData: FormData, key: string) {
  const value = formData.get(key);

  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();

  return trimmed.length > 0 ? trimmed : null;
}

function buildStoragePath(file: File) {
  const now = new Date();
  const year = String(now.getFullYear());
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const safeFileName = file.name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9.\-_]+/g, "-")
    .replace(/-+/g, "-")
    .toLowerCase();

  return `originals/${year}/${month}/${crypto.randomUUID()}-${safeFileName}`;
}

export async function uploadMediaAsset(formData: FormData) {
  const currentUser = await requireAuth();
  const profile = currentUser.profile;

  if (!profile) {
    redirect("/media/new?error=missing_profile");
  }

  const role = profile.role;

  if (role === "viewer") {
    redirect("/media/new?error=forbidden");
  }

  const files = formData
    .getAll("files")
    .filter((value): value is File => value instanceof File && value.size > 0);

  if (files.length === 0) {
    redirect("/media/new?error=missing_file");
  }

  const primaryFileIndexValue = getTextValue(formData, "primary_file_index");
  const primaryFileIndex =
    primaryFileIndexValue === null ? 0 : Number(primaryFileIndexValue);
  const isAiGenerated = formData.get("is_ai_generated") === "on";
  const aiVisualNotice = getTextValue(formData, "ai_visual_notice");
  const title = getTextValue(formData, "title");
  const description = getTextValue(formData, "description");
  const altText = getTextValue(formData, "alt_text");
  const credit = getTextValue(formData, "credit");

  if (isAiGenerated && !aiVisualNotice) {
    redirect("/media/new?error=missing_ai_notice");
  }

  const supabase = await createClient();

  for (const [index, file] of files.entries()) {
    const storagePath = buildStoragePath(file);
    const isPrimary = index === primaryFileIndex || files.length === 1;

    await uploadPrivateFile(supabase, mediaAssetsBucket, storagePath, file);

    await createMediaAsset(supabase, {
      ai_visual_notice: isAiGenerated
        ? (aiVisualNotice ?? mandatoryAiVisualNotice)
        : null,
      alt_text: altText,
      credit,
      description,
      file_name: file.name,
      file_size: file.size,
      file_type: inferMediaFileType(file.type),
      is_ai_generated: isAiGenerated,
      is_primary: isPrimary,
      mime_type: file.type || "application/octet-stream",
      status: "active",
      storage_bucket: mediaAssetsBucket,
      storage_path: storagePath,
      title: files.length === 1 || isPrimary ? title : null,
      uploaded_by_profile_id: profile.id,
    });
  }

  redirect("/media");
}
