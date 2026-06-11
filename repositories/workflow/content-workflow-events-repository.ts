import type { SupabaseClient } from "@supabase/supabase-js";
import type { ContentWorkflowEvent } from "@/modules/workflow/domain/content-workflow-event";
import type { Database } from "@/types/database";

type WorkflowEventRow =
  Database["public"]["Tables"]["content_workflow_events"]["Row"];

function mapWorkflowEvent(row: WorkflowEventRow): ContentWorkflowEvent {
  return {
    actorProfileId: row.actor_profile_id,
    channelVariantId: row.channel_variant_id,
    createdAt: row.created_at,
    eventType: row.event_type,
    fromStatus: row.from_status,
    id: row.id,
    metadata: row.metadata,
    note: row.note,
    toStatus: row.to_status,
  };
}

export async function createContentWorkflowEvent(
  supabase: SupabaseClient<Database>,
  event: Database["public"]["Tables"]["content_workflow_events"]["Insert"],
) {
  const eventsTable = supabase.from("content_workflow_events");
  const { data, error } = await eventsTable
    .insert([event] as Parameters<typeof eventsTable.insert>[0])
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return mapWorkflowEvent(data);
}
