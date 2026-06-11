import { createClient } from "@/infrastructure/supabase/server";
import { getValidationReviewById } from "@/repositories/validation/validation-reviews-repository";

export async function getValidationReview(id: string) {
  const supabase = await createClient();

  return getValidationReviewById(supabase, id);
}
