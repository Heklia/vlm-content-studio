import { createClient } from "@/infrastructure/supabase/server";
import { listWordPressCategories } from "@/repositories/referentials/wordpress-categories-repository";

export async function getWordPressCategories() {
  const supabase = await createClient();

  return listWordPressCategories(supabase);
}

