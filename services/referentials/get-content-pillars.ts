import { createClient } from "@/infrastructure/supabase/server";
import { listContentPillars } from "@/repositories/referentials/content-pillars-repository";

export async function getContentPillars() {
  const supabase = await createClient();

  return listContentPillars(supabase);
}

