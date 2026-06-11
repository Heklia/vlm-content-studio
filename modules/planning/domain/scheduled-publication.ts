import type { Channel } from "@/modules/channels/domain/channel";
import type { ChannelVariantListItem } from "@/modules/channel-variants/domain/channel-variant";

export const scheduledPublicationStatuses = [
  "scheduled",
  "cancelled",
  "published",
  "archived",
] as const;

export type ScheduledPublicationStatus =
  (typeof scheduledPublicationStatuses)[number];

export const scheduledPublicationStatusLabels: Record<
  ScheduledPublicationStatus,
  string
> = {
  archived: "Archivé",
  cancelled: "Annulé",
  published: "Publié",
  scheduled: "Planifié",
};

export type ScheduledPublication = {
  id: string;
  channelVariantId: string;
  channelId: string;
  scheduledFor: string;
  status: ScheduledPublicationStatus;
  publicationNotes: string | null;
  createdByProfileId: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ScheduledPublicationListItem = ScheduledPublication & {
  channel: Pick<Channel, "id" | "key" | "label"> | null;
  channelVariant: ChannelVariantListItem | null;
};

export type ScheduledPublicationDetail = ScheduledPublicationListItem;
