import type { JsonValue } from "@/types/common";

export const contentWorkflowEventTypes = [
  "validation_requested",
  "changes_requested",
  "approved",
  "scheduled",
  "cancelled",
  "archived",
] as const;

export type ContentWorkflowEventType =
  (typeof contentWorkflowEventTypes)[number];

export const contentWorkflowEventTypeLabels: Record<
  ContentWorkflowEventType,
  string
> = {
  approved: "Validé",
  archived: "Archivé",
  cancelled: "Annulé",
  changes_requested: "Corrections demandées",
  scheduled: "Planifié",
  validation_requested: "Validation demandée",
};

export type ContentWorkflowEvent = {
  id: string;
  channelVariantId: string | null;
  eventType: ContentWorkflowEventType;
  fromStatus: string | null;
  toStatus: string | null;
  actorProfileId: string | null;
  note: string | null;
  metadata: JsonValue;
  createdAt: string;
};
