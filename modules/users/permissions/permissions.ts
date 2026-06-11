import type { UserRole } from "@/modules/users/domain/user-role";

export const permissions = [
  "settings:read",
  "settings:write",
  "users:read",
  "users:write",
  "connectors:read",
  "connectors:write",
] as const;

export type Permission = (typeof permissions)[number];

const rolePermissions: Record<UserRole, Permission[]> = {
  administrator: [
    "settings:read",
    "settings:write",
    "users:read",
    "users:write",
    "connectors:read",
    "connectors:write",
  ],
  validator: ["settings:read", "connectors:read"],
  contributor: ["settings:read"],
  viewer: ["settings:read"],
};

export function roleCan(role: UserRole, permission: Permission) {
  return rolePermissions[role].includes(permission);
}

