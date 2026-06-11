export const workflowStatuses = [
  "draft",
  "review",
  "validated",
  "scheduled",
  "published",
  "archived",
] as const;

export type WorkflowStatus = (typeof workflowStatuses)[number];

