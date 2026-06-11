export type AppSetting = {
  id: string;
  key: string;
  value: unknown;
  description: string | null;
  createdAt: string;
  updatedAt: string;
};

export const initialAppSettingKeys = [
  "default_ai_provider",
  "default_text_model",
  "mandatory_ai_visual_notice",
  "publication_frequency_wordpress",
  "publication_frequency_linkedin",
  "publication_frequency_pinterest",
  "publication_frequency_google_business",
] as const;

export type InitialAppSettingKey = (typeof initialAppSettingKeys)[number];

