import { createClient } from "@/infrastructure/supabase/server";
import { getMasterContentById } from "@/repositories/master-content/master-contents-repository";

export async function getMasterContent(id: string) {
  const supabase = await createClient();

  return getMasterContentById(supabase, id);
}

