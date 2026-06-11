import type { ChannelVariantListItem } from "@/modules/channel-variants/domain/channel-variant";

export const validationReviewStatuses = [
  "pending",
  "approved",
  "changes_requested",
  "cancelled",
] as const;

export type ValidationReviewStatus =
  (typeof validationReviewStatuses)[number];

export const validationReviewStatusLabels: Record<
  ValidationReviewStatus,
  string
> = {
  approved: "Validé",
  cancelled: "Annulé",
  changes_requested: "Corrections demandées",
  pending: "À relire",
};

export type ValidationReview = {
  id: string;
  channelVariantId: string;
  requestedByProfileId: string | null;
  reviewedByProfileId: string | null;
  status: ValidationReviewStatus;
  requestNote: string | null;
  reviewNote: string | null;
  requestedAt: string;
  reviewedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ValidationReviewListItem = ValidationReview & {
  channelVariant: ChannelVariantListItem | null;
  requestedByProfile: { id: string; displayName: string | null; email: string } | null;
  reviewedByProfile: { id: string; displayName: string | null; email: string } | null;
};

export type ValidationReviewDetail = ValidationReviewListItem;
