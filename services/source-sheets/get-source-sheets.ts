import { createClient } from "@/infrastructure/supabase/server";
import { listSourceSheets } from "@/repositories/source-sheets/source-sheets-repository";

export async function getSourceSheets() {
  const supabase = await createClient();

  return listSourceSheets(supabase);
}

