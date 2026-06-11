import { createClient } from "@/infrastructure/supabase/server";
import { listChannelVariants } from "@/repositories/channel-variants/channel-variants-repository";

export async function getChannelVariants() {
  const supabase = await createClient();

  return listChannelVariants(supabase);
}
