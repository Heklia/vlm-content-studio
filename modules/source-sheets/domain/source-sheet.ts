import type { Channel } from "@/modules/channels/domain/channel";
import type { ContentPillar } from "@/modules/content-pillars/domain/content-pillar";
import type { MediaAsset } from "@/modules/media/domain/media-asset";
import type { WordPressCategory } from "@/modules/wordpress-categories/domain/wordpress-category";

export const sourceSheetStatuses = ["draft", "ready", "archived"] as const;

export type SourceSheetStatus = (typeof sourceSheetStatuses)[number];

export const sourceSheetStatusLabels: Record<SourceSheetStatus, string> = {
  archived: "Archivée",
  draft: "Brouillon",
  ready: "Prête",
};

export type SourceSheet = {
  id: string;
  title: string;
  summary: string | null;
  context: string | null;
  technicalDetails: string | null;
  materials: string | null;
  knowHow: string | null;
  clientOrSector: string | null;
  location: string | null;
  contentPillarId: string | null;
  wordpressCategoryId: string | null;
  status: SourceSheetStatus;
  createdByProfileId: string | null;
  createdAt: string;
  updatedAt: string;
};

export type SourceSheetMedia = {
  id: string;
  sourceSheetId: string;
  mediaAssetId: string;
  isPrimary: boolean;
  sortOrder: number;
  createdAt: string;
};

export type SourceSheetChannel = {
  id: string;
  sourceSheetId: string;
  channelId: string;
  createdAt: string;
};

export type SourceSheetListItem = SourceSheet & {
  contentPillar: Pick<ContentPillar, "id" | "label"> | null;
  wordpressCategory: Pick<WordPressCategory, "id" | "label"> | null;
};

export type SourceSheetDetail = SourceSheetListItem & {
  channels: Pick<Channel, "id" | "key" | "label" | "status">[];
  mediaAssets: (MediaAsset & {
    relationIsPrimary: boolean;
    relationSortOrder: number;
  })[];
};

