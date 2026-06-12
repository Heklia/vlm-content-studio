import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  SourceSheet,
  SourceSheetDetail,
  SourceSheetListItem,
} from "@/modules/source-sheets/domain/source-sheet";
import type { Database } from "@/types/database";

type SourceSheetRow = Database["public"]["Tables"]["source_sheets"]["Row"];

function mapSourceSheet(row: SourceSheetRow): SourceSheet {
  return {
    id: row.id,
    title: row.title,
    summary: row.summary,
    context: row.context,
    technicalDetails: row.technical_details,
    materials: row.materials,
    knowHow: row.know_how,
    clientOrSector: row.client_or_sector,
    location: row.location,
    contentPillarId: row.content_pillar_id,
    wordpressCategoryId: row.wordpress_category_id,
    status: row.status,
    createdByProfileId: row.created_by_profile_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

type SourceSheetListRow = SourceSheetRow & {
  content_pillars: { id: string; label: string } | null;
  wordpress_categories: { id: string; label: string } | null;
};

function mapSourceSheetListItem(row: SourceSheetListRow): SourceSheetListItem {
  return {
    ...mapSourceSheet(row),
    contentPillar: row.content_pillars,
    wordpressCategory: row.wordpress_categories,
  };
}

type SourceSheetDetailRow = SourceSheetListRow & {
  source_sheet_channels: {
    channels: {
      id: string;
      key: string;
      label: string;
      status: "enabled" | "coming_soon" | "disabled";
    } | null;
  }[];
  source_sheet_media: {
    is_primary: boolean;
    sort_order: number;
    media_assets: Database["public"]["Tables"]["media_assets"]["Row"] | null;
  }[];
};

function mapMediaRow(row: Database["public"]["Tables"]["media_assets"]["Row"]) {
  return {
    aiVisualNotice: row.ai_visual_notice,
    altText: row.alt_text,
    createdAt: row.created_at,
    credit: row.credit,
    description: row.description,
    fileName: row.file_name,
    fileSize: row.file_size,
    fileType: row.file_type,
    id: row.id,
    isAiGenerated: row.is_ai_generated,
    isPrimary: row.is_primary,
    mimeType: row.mime_type,
    status: row.status,
    storageBucket: row.storage_bucket,
    storagePath: row.storage_path,
    title: row.title,
    updatedAt: row.updated_at,
    uploadedByProfileId: row.uploaded_by_profile_id,
  };
}

function mapSourceSheetDetail(row: SourceSheetDetailRow): SourceSheetDetail {
  return {
    ...mapSourceSheetListItem(row),
    channels: row.source_sheet_channels
      .map((relation) => relation.channels)
      .filter((channel): channel is NonNullable<typeof channel> => Boolean(channel)),
    mediaAssets: row.source_sheet_media
      .filter((relation) => relation.media_assets)
      .map((relation) => ({
        ...mapMediaRow(relation.media_assets!),
        relationIsPrimary: relation.is_primary,
        relationSortOrder: relation.sort_order,
      }))
      .sort((a, b) => a.relationSortOrder - b.relationSortOrder),
  };
}

export async function listSourceSheets(supabase: SupabaseClient<Database>) {
  const { data, error } = await supabase
    .from("source_sheets")
    .select(
      `
        *,
        content_pillars ( id, label ),
        wordpress_categories ( id, label )
      `,
    )
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data as SourceSheetListRow[]).map(mapSourceSheetListItem);
}

export async function getSourceSheetById(
  supabase: SupabaseClient<Database>,
  id: string,
) {
  const { data, error } = await supabase
    .from("source_sheets")
    .select(
      `
        *,
        content_pillars ( id, label ),
        wordpress_categories ( id, label ),
        source_sheet_channels (
          channels ( id, key, label, status )
        ),
        source_sheet_media (
          is_primary,
          sort_order,
          media_assets ( * )
        )
      `,
    )
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data ? mapSourceSheetDetail(data as SourceSheetDetailRow) : null;
}

export async function createSourceSheet(
  supabase: SupabaseClient<Database>,
  sourceSheet: Database["public"]["Tables"]["source_sheets"]["Insert"],
) {
  const sourceSheetsTable = supabase.from("source_sheets");
  const { data, error } = await sourceSheetsTable
    .insert([sourceSheet] as Parameters<typeof sourceSheetsTable.insert>[0])
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return mapSourceSheet(data);
}

export async function updateSourceSheet(
  supabase: SupabaseClient<Database>,
  id: string,
  sourceSheet: Database["public"]["Tables"]["source_sheets"]["Update"],
) {
  const sourceSheetsTable = supabase.from("source_sheets");
  const { data, error } = await sourceSheetsTable
    .update(sourceSheet as Parameters<typeof sourceSheetsTable.update>[0])
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return mapSourceSheet(data);
}

export async function deleteSourceSheetById(
  supabase: SupabaseClient<Database>,
  id: string,
) {
  const { error } = await supabase.from("source_sheets").delete().eq("id", id);

  if (error) {
    throw error;
  }
}
