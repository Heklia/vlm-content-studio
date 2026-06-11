import { createClient } from "@/infrastructure/supabase/server";
import { listScheduledPublications } from "@/repositories/planning/scheduled-publications-repository";

export async function getScheduledPublications() {
  const supabase = await createClient();

  return listScheduledPublications(supabase);
}
