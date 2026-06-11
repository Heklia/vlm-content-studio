export const userRoles = [
  "administrator",
  "validator",
  "contributor",
  "viewer",
] as const;

export type UserRole = (typeof userRoles)[number];

export const userRoleLabels: Record<UserRole, string> = {
  administrator: "Administrateur",
  validator: "Validateur",
  contributor: "Contributeur",
  viewer: "Consultation",
};

