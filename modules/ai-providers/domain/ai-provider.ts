export const aiProviderStatuses = ["available", "coming_soon", "disabled"] as const;

export type AiProviderStatus = (typeof aiProviderStatuses)[number];

export type AiProvider = {
  id: string;
  key: string;
  label: string;
  status: AiProviderStatus;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
};

export const aiProviderStatusLabels: Record<AiProviderStatus, string> = {
  available: "Disponible",
  coming_soon: "À venir",
  disabled: "Désactivé",
};

