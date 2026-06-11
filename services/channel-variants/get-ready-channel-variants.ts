import { createClient } from "@/infrastructure/supabase/server";
import { listReadyChannelVariants } from "@/repositories/channel-variants/channel-variants-repository";

export async function getReadyChannelVariants() {
  const supabase = await createClient();

  return listReadyChannelVariants(supabase);
}
