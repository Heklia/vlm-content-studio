import { createClient } from "@/infrastructure/supabase/server";
import { listChannels } from "@/repositories/referentials/channels-repository";

export async function getChannels() {
  const supabase = await createClient();

  return listChannels(supabase);
}

