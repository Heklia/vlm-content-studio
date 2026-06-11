import type { SourceSheet } from "@/modules/source-sheets/domain/source-sheet";
import type { JsonValue } from "@/types/common";

export const masterContentStatuses = ["draft", "ready", "archived"] as const;

export type MasterContentStatus = (typeof masterContentStatuses)[number];

export const masterContentStatusLabels: Record<MasterContentStatus, string> = {
  archived: "Archivé",
  draft: "Brouillon",
  ready: "Prêt",
};

export const generationModes = ["manual", "ai_assisted", "ai_generated"] as const;

export type GenerationMode = (typeof generationModes)[number];

export const generationModeLabels: Record<GenerationMode, string> = {
  ai_assisted: "Assisté par IA",
  ai_generated: "Généré par IA",
  manual: "Manuel",
};

export type MasterContent = {
  id: string;
  sourceSheetId: string | null;
  title: string;
  angle: string | null;
  hook: string | null;
  body: string | null;
  keyPoints: JsonValue;
  callToAction: string | null;
  editorialNotes: string | null;
  status: MasterContentStatus;
  generationMode: GenerationMode;
  aiProviderKey: string | null;
  aiModelKey: string | null;
  generatedPrompt: string | null;
  createdByProfileId: string | null;
  createdAt: string;
  updatedAt: string;
};

export type MasterContentListItem = MasterContent & {
  sourceSheet: Pick<SourceSheet, "id" | "title"> | null;
};

export type MasterContentDetail = MasterContentListItem;

