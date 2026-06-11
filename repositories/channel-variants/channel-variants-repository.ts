import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  ChannelVariant,
  ChannelVariantDetail,
  ChannelVariantListItem,
} from "@/modules/channel-variants/domain/channel-variant";
import type { ChannelStatus } from "@/modules/channels/domain/channel";
import type { Database } from "@/types/database";

type ChannelVariantRow =
  Database["public"]["Tables"]["channel_variants"]["Row"];

function mapChannelVariant(row: ChannelVariantRow): ChannelVariant {
  return {
    aiModelKey: row.ai_model_key,
    aiProviderKey: row.ai_provider_key,
    body: row.body,
    callToAction: row.call_to_action,
    channelId: row.channel_id,
    createdAt: row.created_at,
    createdByProfileId: row.created_by_profile_id,
    excerpt: row.excerpt,
    generatedPrompt: row.generated_prompt,
    generationMode: row.generation_mode,
    googleBusinessPostType: row.google_business_post_type,
    hashtags: row.hashtags,
    id: row.id,
    masterContentId: row.master_content_id,
    pinterestBoard: row.pinterest_board,
    seoDescription: row.seo_description,
    seoTitle: row.seo_title,
    status: row.status,
    title: row.title,
    updatedAt: row.updated_at,
    wordpressCategoryId: row.wordpress_category_id,
  };
}

type ChannelVariantListRow = ChannelVariantRow & {
  channels: { id: string; key: string; label: string; status: ChannelStatus } | null;
  master_contents: { id: string; title: string } | null;
  wordpress_categories: { id: string; label: string } | null;
};

function mapChannelVariantListItem(
  row: ChannelVariantListRow,
): ChannelVariantListItem {
  return {
    ...mapChannelVariant(row),
    channel: row.channels,
    masterContent: row.master_contents,
    wordpressCategory: row.wordpress_categories,
  };
}

export async function listChannelVariants(
  supabase: SupabaseClient<Database>,
) {
  const { data, error } = await supabase
    .from("channel_variants")
    .select(
      `
        *,
        channels ( id, key, label, status ),
        master_contents ( id, title ),
        wordpress_categories ( id, label )
      `,
    )
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data as ChannelVariantListRow[]).map(mapChannelVariantListItem);
}

export async function getChannelVariantById(
  supabase: SupabaseClient<Database>,
  id: string,
) {
  const { data, error } = await supabase
    .from("channel_variants")
    .select(
      `
        *,
        channels ( id, key, label, status ),
        master_contents ( id, title ),
        wordpress_categories ( id, label )
      `,
    )
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data
    ? (mapChannelVariantListItem(data as ChannelVariantListRow) satisfies ChannelVariantDetail)
    : null;
}

export async function createChannelVariant(
  supabase: SupabaseClient<Database>,
  channelVariant: Database["public"]["Tables"]["channel_variants"]["Insert"],
) {
  const channelVariantsTable = supabase.from("channel_variants");
  const { data, error } = await channelVariantsTable
    .insert([channelVariant] as Parameters<typeof channelVariantsTable.insert>[0])
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return mapChannelVariant(data);
}

export async function updateChannelVariantStatus(
  supabase: SupabaseClient<Database>,
  id: string,
  status: Database["public"]["Tables"]["channel_variants"]["Update"]["status"],
) {
  const channelVariantsTable = supabase.from("channel_variants");
  const { data, error } = await channelVariantsTable
    .update({ status } as Parameters<typeof channelVariantsTable.update>[0])
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return mapChannelVariant(data);
}

export async function listReadyChannelVariants(
  supabase: SupabaseClient<Database>,
) {
  const { data, error } = await supabase
    .from("channel_variants")
    .select(
      `
        *,
        channels ( id, key, label, status ),
        master_contents ( id, title ),
        wordpress_categories ( id, label )
      `,
    )
    .eq("status", "ready")
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data as ChannelVariantListRow[]).map(mapChannelVariantListItem);
}
