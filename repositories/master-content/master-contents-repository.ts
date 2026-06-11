import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  MasterContent,
  MasterContentDetail,
  MasterContentListItem,
} from "@/modules/master-content/domain/master-content";
import type { Database } from "@/types/database";

type MasterContentRow = Database["public"]["Tables"]["master_contents"]["Row"];

function mapMasterContent(row: MasterContentRow): MasterContent {
  return {
    aiModelKey: row.ai_model_key,
    aiProviderKey: row.ai_provider_key,
    angle: row.angle,
    body: row.body,
    callToAction: row.call_to_action,
    createdAt: row.created_at,
    createdByProfileId: row.created_by_profile_id,
    editorialNotes: row.editorial_notes,
    generatedPrompt: row.generated_prompt,
    generationMode: row.generation_mode,
    hook: row.hook,
    id: row.id,
    keyPoints: row.key_points,
    sourceSheetId: row.source_sheet_id,
    status: row.status,
    title: row.title,
    updatedAt: row.updated_at,
  };
}

type MasterContentListRow = MasterContentRow & {
  source_sheets: { id: string; title: string } | null;
};

function mapMasterContentListItem(
  row: MasterContentListRow,
): MasterContentListItem {
  return {
    ...mapMasterContent(row),
    sourceSheet: row.source_sheets,
  };
}

export async function listMasterContents(supabase: SupabaseClient<Database>) {
  const { data, error } = await supabase
    .from("master_contents")
    .select(
      `
        *,
        source_sheets ( id, title )
      `,
    )
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data as MasterContentListRow[]).map(mapMasterContentListItem);
}

export async function getMasterContentById(
  supabase: SupabaseClient<Database>,
  id: string,
) {
  const { data, error } = await supabase
    .from("master_contents")
    .select(
      `
        *,
        source_sheets ( id, title )
      `,
    )
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data
    ? (mapMasterContentListItem(data as MasterContentListRow) satisfies MasterContentDetail)
    : null;
}

export async function createMasterContent(
  supabase: SupabaseClient<Database>,
  masterContent: Database["public"]["Tables"]["master_contents"]["Insert"],
) {
  const masterContentsTable = supabase.from("master_contents");
  const { data, error } = await masterContentsTable
    .insert([masterContent] as Parameters<typeof masterContentsTable.insert>[0])
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return mapMasterContent(data);
}

