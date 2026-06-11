import { redirect } from "next/navigation";
import { getSupabaseConfig } from "@/infrastructure/supabase/env";
import { getCurrentUser } from "@/services/auth/get-current-user";

export async function requireAuth() {
  if (!getSupabaseConfig().isConfigured) {
    redirect("/login");
  }

  const currentUser = await getCurrentUser();

  if (!currentUser?.authUser) {
    redirect("/login");
  }

  if (!currentUser.profile) {
    redirect("/login?error=missing_profile");
  }

  if (currentUser.profile && !currentUser.profile.isActive) {
    redirect("/login?error=inactive_profile");
  }

  return currentUser;
}
