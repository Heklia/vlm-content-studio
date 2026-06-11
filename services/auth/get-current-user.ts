import { createClient } from "@/infrastructure/supabase/server";
import { getUserProfileByAuthUserId } from "@/repositories/users/user-profiles-repository";

export async function getCurrentUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const profile = await getUserProfileByAuthUserId(supabase, user.id);

  return {
    authUser: user,
    profile,
  };
}

