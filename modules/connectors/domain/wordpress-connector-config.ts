import type { JsonValue } from "@/types/common";

export type SavedWordPressConnectorConfig = {
  applicationPassword?: string;
  siteUrl?: string;
  username?: string;
};

export function parseWordPressConnectorConfig(
  config: JsonValue,
): SavedWordPressConnectorConfig {
  if (!config || typeof config !== "object" || Array.isArray(config)) {
    return {};
  }

  return {
    applicationPassword:
      typeof config.applicationPassword === "string"
        ? config.applicationPassword
        : undefined,
    siteUrl: typeof config.siteUrl === "string" ? config.siteUrl : undefined,
    username: typeof config.username === "string" ? config.username : undefined,
  };
}

export function hasStoredWordPressPassword(
  config: SavedWordPressConnectorConfig,
) {
  return Boolean(config.applicationPassword);
}
