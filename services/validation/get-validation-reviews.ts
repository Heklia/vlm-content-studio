import { createClient } from "@/infrastructure/supabase/server";
import { listValidationReviews } from "@/repositories/validation/validation-reviews-repository";

export async function getValidationReviews() {
  const supabase = await createClient();

  return listValidationReviews(supabase);
}
