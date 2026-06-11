"use server";

import { redirect } from "next/navigation";
import { getSupabaseConfig } from "@/infrastructure/supabase/env";
import { createClient } from "@/infrastructure/supabase/server";
import { getUserProfileByAuthUserId } from "@/repositories/users/user-profiles-repository";

function getRequiredFormValue(formData: FormData, key: string) {
  const value = formData.get(key);

  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

export async function signInWithPassword(formData: FormData) {
  if (!getSupabaseConfig().isConfigured) {
    redirect("/login?error=configuration");
  }

  const email = getRequiredFormValue(formData, "email");
  const password = getRequiredFormValue(formData, "password");

  if (!email || !password) {
    redirect("/login?error=missing_credentials");
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.user) {
    redirect("/login?error=invalid_credentials");
  }

  const profile = await getUserProfileByAuthUserId(supabase, data.user.id);

  if (!profile) {
    await supabase.auth.signOut();
    redirect("/login?error=missing_profile");
  }

  if (!profile.isActive) {
    await supabase.auth.signOut();
    redirect("/login?error=inactive_profile");
  }

  redirect("/dashboard");
}

export async function signOut() {
  if (getSupabaseConfig().isConfigured) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }

  redirect("/login");
}

