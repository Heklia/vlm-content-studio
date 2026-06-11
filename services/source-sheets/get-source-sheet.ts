import { createClient } from "@/infrastructure/supabase/server";
import { getSourceSheetById } from "@/repositories/source-sheets/source-sheets-repository";

export async function getSourceSheet(id: string) {
  const supabase = await createClient();

  return getSourceSheetById(supabase, id);
}

