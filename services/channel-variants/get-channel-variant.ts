import { createClient } from "@/infrastructure/supabase/server";
import { getChannelVariantById } from "@/repositories/channel-variants/channel-variants-repository";

export async function getChannelVariant(id: string) {
  const supabase = await createClient();

  return getChannelVariantById(supabase, id);
}
