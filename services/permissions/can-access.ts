import type { Permission } from "@/modules/users/permissions/permissions";
import { roleCan } from "@/modules/users/permissions/permissions";
import type { UserRole } from "@/modules/users/domain/user-role";

export function canAccess(role: UserRole, permission: Permission) {
  return roleCan(role, permission);
}

