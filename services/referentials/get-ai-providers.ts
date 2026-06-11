import { createClient } from "@/infrastructure/supabase/server";
import { listAiProviders } from "@/repositories/referentials/ai-providers-repository";

export async function getAiProviders() {
  const supabase = await createClient();

  return listAiProviders(supabase);
}

