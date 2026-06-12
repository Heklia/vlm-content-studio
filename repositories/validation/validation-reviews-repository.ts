import type { SupabaseClient } from "@supabase/supabase-js";
import type { ChannelStatus } from "@/modules/channels/domain/channel";
import type {
  ValidationReview,
  ValidationReviewDetail,
  ValidationReviewListItem,
} from "@/modules/validation/domain/validation-review";
import type { Database } from "@/types/database";

type ValidationReviewRow =
  Database["public"]["Tables"]["validation_reviews"]["Row"];

type ChannelVariantJoinRow =
  Database["public"]["Tables"]["channel_variants"]["Row"] & {
    channels: { id: string; key: string; label: string; status: ChannelStatus } | null;
    master_contents: { id: string; title: string } | null;
    wordpress_categories: { id: string; label: string; wordpress_id: number | null } | null;
  };

type ProfileJoinRow = {
  id: string;
  display_name: string | null;
  email: string;
};

type ValidationReviewListRow = ValidationReviewRow & {
  channel_variants: ChannelVariantJoinRow | null;
  requested_by_profile: ProfileJoinRow | null;
  reviewed_by_profile: ProfileJoinRow | null;
};

function mapValidationReview(row: ValidationReviewRow): ValidationReview {
  return {
    channelVariantId: row.channel_variant_id,
    createdAt: row.created_at,
    id: row.id,
    requestNote: row.request_note,
    requestedAt: row.requested_at,
    requestedByProfileId: row.requested_by_profile_id,
    reviewNote: row.review_note,
    reviewedAt: row.reviewed_at,
    reviewedByProfileId: row.reviewed_by_profile_id,
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

function mapProfile(row: ProfileJoinRow | null) {
  return row
    ? {
        displayName: row.display_name,
        email: row.email,
        id: row.id,
      }
    : null;
}

function mapValidationReviewListItem(
  row: ValidationReviewListRow,
): ValidationReviewListItem {
  return {
    ...mapValidationReview(row),
    channelVariant: row.channel_variants
      ? mapChannelVariant(row.channel_variants)
      : null,
    requestedByProfile: mapProfile(row.requested_by_profile),
    reviewedByProfile: mapProfile(row.reviewed_by_profile),
  };
}

const validationReviewSelect = `
  *,
  channel_variants (
    *,
    channels ( id, key, label, status ),
    master_contents ( id, title ),
    wordpress_categories ( id, label, wordpress_id )
  ),
  requested_by_profile:user_profiles!validation_reviews_requested_by_profile_id_fkey (
    id,
    display_name,
    email
  ),
  reviewed_by_profile:user_profiles!validation_reviews_reviewed_by_profile_id_fkey (
    id,
    display_name,
    email
  )
`;

export async function listValidationReviews(
  supabase: SupabaseClient<Database>,
) {
  const { data, error } = await supabase
    .from("validation_reviews")
    .select(validationReviewSelect)
    .order("requested_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data as ValidationReviewListRow[]).map(mapValidationReviewListItem);
}

export async function getValidationReviewById(
  supabase: SupabaseClient<Database>,
  id: string,
) {
  const { data, error } = await supabase
    .from("validation_reviews")
    .select(validationReviewSelect)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data
    ? (mapValidationReviewListItem(data as ValidationReviewListRow) satisfies ValidationReviewDetail)
    : null;
}

export async function getActiveValidationReviewForVariant(
  supabase: SupabaseClient<Database>,
  channelVariantId: string,
) {
  const { data, error } = await supabase
    .from("validation_reviews")
    .select("*")
    .eq("channel_variant_id", channelVariantId)
    .eq("status", "pending")
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data ? mapValidationReview(data) : null;
}

export async function createValidationReview(
  supabase: SupabaseClient<Database>,
  review: Database["public"]["Tables"]["validation_reviews"]["Insert"],
) {
  const reviewsTable = supabase.from("validation_reviews");
  const { data, error } = await reviewsTable
    .insert([review] as Parameters<typeof reviewsTable.insert>[0])
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return mapValidationReview(data);
}

export async function updateValidationReview(
  supabase: SupabaseClient<Database>,
  id: string,
  review: Database["public"]["Tables"]["validation_reviews"]["Update"],
) {
  const validationReviewsTable = supabase.from("validation_reviews");
  const { data, error } = await validationReviewsTable
    .update(review as Parameters<typeof validationReviewsTable.update>[0])
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return mapValidationReview(data);
}
