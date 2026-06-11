import type { UserRole } from "@/modules/users/domain/user-role";

export type UserProfile = {
  id: string;
  authUserId: string;
  email: string;
  displayName: string | null;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

