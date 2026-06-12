import type { SupabaseClient } from "@supabase/supabase-js";
import type { ChannelStatus } from "@/modules/channels/domain/channel";
import type {
  ScheduledPublication,
  ScheduledPublicationListItem,
} from "@/modules/planning/domain/scheduled-publication";
import type { Database } from "@/types/database";

type ScheduledPublicationRow =
  Database["public"]["Tables"]["scheduled_publications"]["Row"];

type ChannelVariantJoinRow =
  Database["public"]["Tables"]["channel_variants"]["Row"] & {
    channels: { id: string; key: string; label: string; status: ChannelStatus } | null;
    master_contents: { id: string; title: string } | null;
    wordpress_categories: { id: string; label: string; wordpress_id: number | null } | null;
  };

type ScheduledPublicationListRow = ScheduledPublicationRow & {
  channels: { id: string; key: string; label: string } | null;
  channel_variants: ChannelVariantJoinRow | null;
};

function mapScheduledPublication(
  row: ScheduledPublicationRow,
): ScheduledPublication {
  return {
    channelId: row.channel_id,
    channelVariantId: row.channel_variant_id,
    createdAt: row.created_at,
    createdByProfileId: row.created_by_profile_id,
    id: row.id,
    publicationNotes: row.publication_notes,
    scheduledFor: row.scheduled_for,
    status: row.status,
    updatedAt: row.updated_at,
  };
}

function mapChannelVariant(row: ChannelVariantJoinRow) {
  return {
    aiModelKey: row.ai_model_key,
    aiProviderKey: row.ai_provider_key,
    body: row.body,
    callToAction: row.call_to_action,
    channel: row.channels,
    channelId: row.channel_id,
    createdAt: row.created_at,
    createdByProfileId: row.created_by_profile_id,
    excerpt: row.excerpt,
    generatedPrompt: row.generated_prompt,
    generationMode: row.generation_mode,
    googleBusinessPostType: row.google_business_post_type,
    hashtags: row.hashtags,
    id: row.id,
    masterContent: row.master_contents,
    masterContentId: row.master_content_id,
    pinterestBoard: row.pinterest_board,
    seoDescription: row.seo_description,
    seoTitle: row.seo_title,
    status: row.status,
    title: row.title,
    updatedAt: row.updated_at,
    wordpressCategory: row.wordpress_categories
      ? {
          id: row.wordpress_categories.id,
          label: row.wordpress_categories.label,
          wordpressId: row.wordpress_categories.wordpress_id,
        }
      : null,
    wordpressCategoryId: row.wordpress_category_id,
  };
}

function mapScheduledPublicationListItem(
  row: ScheduledPublicationListRow,
): ScheduledPublicationListItem {
  return {
    ...mapScheduledPublication(row),
    channel: row.channels,
    channelVariant: row.channel_variants
      ? mapChannelVariant(row.channel_variants)
      : null,
  };
}

const scheduledPublicationSelect = `
  *,
  channels ( id, key, label ),
  channel_variants (
    *,
    channels ( id, key, label, status ),
    master_contents ( id, title ),
    wordpress_categories ( id, label, wordpress_id )
  )
`;

export async function listScheduledPublications(
  supabase: SupabaseClient<Database>,
) {
  const { data, error } = await supabase
    .from("scheduled_publications")
    .select(scheduledPublicationSelect)
    .order("scheduled_for", { ascending: true });

  if (error) {
    throw error;
  }

  return (data as ScheduledPublicationListRow[]).map(
    mapScheduledPublicationListItem,
  );
}

export async function createScheduledPublication(
  supabase: SupabaseClient<Database>,
  publication: Database["public"]["Tables"]["scheduled_publications"]["Insert"],
) {
  const publicationsTable = supabase.from("scheduled_publications");
  const { data, error } = await publicationsTable
    .insert([publication] as Parameters<typeof publicationsTable.insert>[0])
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return mapScheduledPublication(data);
}
