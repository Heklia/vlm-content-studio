import type { SupabaseClient } from "@supabase/supabase-js";
import type { UserProfile } from "@/modules/users/domain/user-profile";
import type { Database } from "@/types/database";

function mapUserProfile(
  row: Database["public"]["Tables"]["user_profiles"]["Row"],
): UserProfile {
  return {
    id: row.id,
    authUserId: row.auth_user_id,
    email: row.email,
    displayName: row.display_name,
    role: row.role,
    isActive: row.is_active,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getUserProfileByAuthUserId(
  supabase: SupabaseClient<Database>,
  authUserId: string,
) {
  const { data, error } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("auth_user_id", authUserId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data ? mapUserProfile(data) : null;
}

