import type { SupabaseClient } from "@supabase/supabase-js";
import { createContentWorkflowEvent } from "@/repositories/workflow/content-workflow-events-repository";
import type { Database } from "@/types/database";

export async function createWorkflowEvent(
  supabase: SupabaseClient<Database>,
  event: Database["public"]["Tables"]["content_workflow_events"]["Insert"],
) {
  return createContentWorkflowEvent(supabase, event);
}
