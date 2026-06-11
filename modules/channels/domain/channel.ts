export const channelStatuses = ["enabled", "coming_soon", "disabled"] as const;

export type ChannelStatus = (typeof channelStatuses)[number];

export type Channel = {
  id: string;
  key: string;
  label: string;
  status: ChannelStatus;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

export const channelStatusLabels: Record<ChannelStatus, string> = {
  coming_soon: "À venir",
  disabled: "Désactivé",
  enabled: "Activé",
};

