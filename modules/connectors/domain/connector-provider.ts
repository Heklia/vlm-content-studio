export const connectorProviders = [
  "wordpress",
  "linkedin",
  "pinterest",
  "google_business",
  "instagram",
  "facebook",
  "newsletter",
] as const;

export type ConnectorProvider = (typeof connectorProviders)[number];

export const connectorStatuses = [
  "disabled",
  "configured",
  "active",
  "error",
] as const;

export type ConnectorStatus = (typeof connectorStatuses)[number];

