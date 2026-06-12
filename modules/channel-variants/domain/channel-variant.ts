import type { Channel } from "@/modules/channels/domain/channel";
import type {
  GenerationMode,
  MasterContent,
} from "@/modules/master-content/domain/master-content";
import type { WordPressCategory } from "@/modules/wordpress-categories/domain/wordpress-category";

export const channelVariantStatuses = [
  "draft",
  "review",
  "ready",
  "scheduled",
  "published",
  "archived",
] as const;

export type ChannelVariantStatus = (typeof channelVariantStatuses)[number];

export const channelVariantStatusLabels: Record<ChannelVariantStatus, string> = {
  archived: "Archivé",
  draft: "Brouillon",
  published: "Publié",
  ready: "Prêt",
  review: "À relire",
  scheduled: "Planifié",
};

export type ChannelVariant = {
  id: string;
  masterContentId: string;
  channelId: string;
  title: string;
  body: string | null;
  excerpt: string | null;
  hashtags: string[];
  callToAction: string | null;
  status: ChannelVariantStatus;
  generationMode: GenerationMode;
  aiProviderKey: string | null;
  aiModelKey: string | null;
  generatedPrompt: string | null;
  wordpressCategoryId: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  pinterestBoard: string | null;
  googleBusinessPostType: string | null;
  createdByProfileId: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ChannelVariantListItem = ChannelVariant & {
  channel: Pick<Channel, "id" | "key" | "label" | "status"> | null;
  masterContent: Pick<MasterContent, "id" | "title"> | null;
  wordpressCategory: Pick<WordPressCategory, "id" | "label" | "wordpressId"> | null;
};

export type ChannelVariantDetail = ChannelVariantListItem;
