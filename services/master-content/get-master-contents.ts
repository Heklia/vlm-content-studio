import { createClient } from "@/infrastructure/supabase/server";
import { listMasterContents } from "@/repositories/master-content/master-contents-repository";

export async function getMasterContents() {
  const supabase = await createClient();

  return listMasterContents(supabase);
}

