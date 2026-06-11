export const mediaAssetStatuses = ["active", "archived"] as const;

export type MediaAssetStatus = (typeof mediaAssetStatuses)[number];

export const mediaFileTypes = ["image", "video", "document", "other"] as const;

export type MediaFileType = (typeof mediaFileTypes)[number];

export type MediaAsset = {
  id: string;
  storageBucket: string;
  storagePath: string;
  fileName: string;
  fileType: MediaFileType;
  mimeType: string;
  fileSize: number;
  title: string | null;
  description: string | null;
  altText: string | null;
  credit: string | null;
  isAiGenerated: boolean;
  aiVisualNotice: string | null;
  isPrimary: boolean;
  status: MediaAssetStatus;
  uploadedByProfileId: string | null;
  createdAt: string;
  updatedAt: string;
};

export const mandatoryAiVisualNotice =
  "Visuel d’illustration réalisé dans le cadre d’une étude de projet.";

export function inferMediaFileType(mimeType: string): MediaFileType {
  if (mimeType.startsWith("image/")) {
    return "image";
  }

  if (mimeType.startsWith("video/")) {
    return "video";
  }

  if (
    mimeType === "application/pdf" ||
    mimeType.includes("document") ||
    mimeType.includes("spreadsheet") ||
    mimeType.includes("presentation")
  ) {
    return "document";
  }

  return "other";
}
