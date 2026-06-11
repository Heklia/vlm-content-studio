import type { ConnectorStatus } from "@/modules/connectors/domain/connector-provider";
import type { AiProviderStatus } from "@/modules/ai-providers/domain/ai-provider";
import type { ChannelStatus } from "@/modules/channels/domain/channel";
import type { UserRole } from "@/modules/users/domain/user-role";
import type {
  MediaAssetStatus,
  MediaFileType,
} from "@/modules/media/domain/media-asset";
import type { JsonValue } from "@/types/common";
import type { SourceSheetStatus } from "@/modules/source-sheets/domain/source-sheet";
import type {
  GenerationMode,
  MasterContentStatus,
} from "@/modules/master-content/domain/master-content";
import type { ChannelVariantStatus } from "@/modules/channel-variants/domain/channel-variant";
import type { ValidationReviewStatus } from "@/modules/validation/domain/validation-review";
import type { ScheduledPublicationStatus } from "@/modules/planning/domain/scheduled-publication";
import type { ContentWorkflowEventType } from "@/modules/workflow/domain/content-workflow-event";

export type Database = {
  public: {
    Tables: {
      app_settings: {
        Row: {
          id: string;
          key: string;
          value: JsonValue;
          description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          key: string;
          value: JsonValue;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          key?: string;
          value?: JsonValue;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      ai_providers: {
        Row: {
          id: string;
          key: string;
          label: string;
          status: AiProviderStatus;
          is_default: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          key: string;
          label: string;
          status?: AiProviderStatus;
          is_default?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          key?: string;
          label?: string;
          status?: AiProviderStatus;
          is_default?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      audit_logs: {
        Row: {
          id: string;
          actor_profile_id: string | null;
          action: string;
          target_table: string | null;
          target_id: string | null;
          metadata: JsonValue;
          created_at: string;
        };
        Insert: {
          id?: string;
          actor_profile_id?: string | null;
          action: string;
          target_table?: string | null;
          target_id?: string | null;
          metadata?: JsonValue;
          created_at?: string;
        };
        Update: never;
      };
      channels: {
        Row: {
          id: string;
          key: string;
          label: string;
          status: ChannelStatus;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          key: string;
          label: string;
          status?: ChannelStatus;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          key?: string;
          label?: string;
          status?: ChannelStatus;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      channel_variants: {
        Row: {
          id: string;
          master_content_id: string;
          channel_id: string;
          title: string;
          body: string | null;
          excerpt: string | null;
          hashtags: string[];
          call_to_action: string | null;
          status: ChannelVariantStatus;
          generation_mode: GenerationMode;
          ai_provider_key: string | null;
          ai_model_key: string | null;
          generated_prompt: string | null;
          wordpress_category_id: string | null;
          seo_title: string | null;
          seo_description: string | null;
          pinterest_board: string | null;
          google_business_post_type: string | null;
          created_by_profile_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          master_content_id: string;
          channel_id: string;
          title: string;
          body?: string | null;
          excerpt?: string | null;
          hashtags?: string[];
          call_to_action?: string | null;
          status?: ChannelVariantStatus;
          generation_mode?: GenerationMode;
          ai_provider_key?: string | null;
          ai_model_key?: string | null;
          generated_prompt?: string | null;
          wordpress_category_id?: string | null;
          seo_title?: string | null;
          seo_description?: string | null;
          pinterest_board?: string | null;
          google_business_post_type?: string | null;
          created_by_profile_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          master_content_id?: string;
          channel_id?: string;
          title?: string;
          body?: string | null;
          excerpt?: string | null;
          hashtags?: string[];
          call_to_action?: string | null;
          status?: ChannelVariantStatus;
          generation_mode?: GenerationMode;
          ai_provider_key?: string | null;
          ai_model_key?: string | null;
          generated_prompt?: string | null;
          wordpress_category_id?: string | null;
          seo_title?: string | null;
          seo_description?: string | null;
          pinterest_board?: string | null;
          google_business_post_type?: string | null;
          created_by_profile_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      connector_settings: {
        Row: {
          id: string;
          provider: string;
          label: string;
          status: ConnectorStatus;
          config: JsonValue;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          provider: string;
          label: string;
          status?: ConnectorStatus;
          config?: JsonValue;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          provider?: string;
          label?: string;
          status?: ConnectorStatus;
          config?: JsonValue;
          created_at?: string;
          updated_at?: string;
        };
      };
      content_pillars: {
        Row: {
          id: string;
          key: string;
          label: string;
          target_percentage: number;
          is_active: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          key: string;
          label: string;
          target_percentage: number;
          is_active?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          key?: string;
          label?: string;
          target_percentage?: number;
          is_active?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      media_assets: {
        Row: {
          id: string;
          storage_bucket: string;
          storage_path: string;
          file_name: string;
          file_type: MediaFileType;
          mime_type: string;
          file_size: number;
          title: string | null;
          description: string | null;
          alt_text: string | null;
          credit: string | null;
          is_ai_generated: boolean;
          ai_visual_notice: string | null;
          is_primary: boolean;
          status: MediaAssetStatus;
          uploaded_by_profile_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          storage_bucket: string;
          storage_path: string;
          file_name: string;
          file_type: MediaFileType;
          mime_type: string;
          file_size: number;
          title?: string | null;
          description?: string | null;
          alt_text?: string | null;
          credit?: string | null;
          is_ai_generated?: boolean;
          ai_visual_notice?: string | null;
          is_primary?: boolean;
          status?: MediaAssetStatus;
          uploaded_by_profile_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          storage_bucket?: string;
          storage_path?: string;
          file_name?: string;
          file_type?: MediaFileType;
          mime_type?: string;
          file_size?: number;
          title?: string | null;
          description?: string | null;
          alt_text?: string | null;
          credit?: string | null;
          is_ai_generated?: boolean;
          ai_visual_notice?: string | null;
          is_primary?: boolean;
          status?: MediaAssetStatus;
          uploaded_by_profile_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      master_contents: {
        Row: {
          id: string;
          source_sheet_id: string | null;
          title: string;
          angle: string | null;
          hook: string | null;
          body: string | null;
          key_points: JsonValue;
          call_to_action: string | null;
          editorial_notes: string | null;
          status: MasterContentStatus;
          generation_mode: GenerationMode;
          ai_provider_key: string | null;
          ai_model_key: string | null;
          generated_prompt: string | null;
          created_by_profile_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          source_sheet_id?: string | null;
          title: string;
          angle?: string | null;
          hook?: string | null;
          body?: string | null;
          key_points?: JsonValue;
          call_to_action?: string | null;
          editorial_notes?: string | null;
          status?: MasterContentStatus;
          generation_mode?: GenerationMode;
          ai_provider_key?: string | null;
          ai_model_key?: string | null;
          generated_prompt?: string | null;
          created_by_profile_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          source_sheet_id?: string | null;
          title?: string;
          angle?: string | null;
          hook?: string | null;
          body?: string | null;
          key_points?: JsonValue;
          call_to_action?: string | null;
          editorial_notes?: string | null;
          status?: MasterContentStatus;
          generation_mode?: GenerationMode;
          ai_provider_key?: string | null;
          ai_model_key?: string | null;
          generated_prompt?: string | null;
          created_by_profile_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      source_sheet_channels: {
        Row: {
          id: string;
          source_sheet_id: string;
          channel_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          source_sheet_id: string;
          channel_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          source_sheet_id?: string;
          channel_id?: string;
          created_at?: string;
        };
      };
      content_workflow_events: {
        Row: {
          id: string;
          channel_variant_id: string | null;
          event_type: ContentWorkflowEventType;
          from_status: string | null;
          to_status: string | null;
          actor_profile_id: string | null;
          note: string | null;
          metadata: JsonValue;
          created_at: string;
        };
        Insert: {
          id?: string;
          channel_variant_id?: string | null;
          event_type: ContentWorkflowEventType;
          from_status?: string | null;
          to_status?: string | null;
          actor_profile_id?: string | null;
          note?: string | null;
          metadata?: JsonValue;
          created_at?: string;
        };
        Update: never;
      };
      scheduled_publications: {
        Row: {
          id: string;
          channel_variant_id: string;
          channel_id: string;
          scheduled_for: string;
          status: ScheduledPublicationStatus;
          publication_notes: string | null;
          created_by_profile_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          channel_variant_id: string;
          channel_id: string;
          scheduled_for: string;
          status?: ScheduledPublicationStatus;
          publication_notes?: string | null;
          created_by_profile_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          channel_variant_id?: string;
          channel_id?: string;
          scheduled_for?: string;
          status?: ScheduledPublicationStatus;
          publication_notes?: string | null;
          created_by_profile_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      source_sheet_media: {
        Row: {
          id: string;
          source_sheet_id: string;
          media_asset_id: string;
          is_primary: boolean;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          source_sheet_id: string;
          media_asset_id: string;
          is_primary?: boolean;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          source_sheet_id?: string;
          media_asset_id?: string;
          is_primary?: boolean;
          sort_order?: number;
          created_at?: string;
        };
      };
      source_sheets: {
        Row: {
          id: string;
          title: string;
          summary: string | null;
          context: string | null;
          technical_details: string | null;
          materials: string | null;
          know_how: string | null;
          client_or_sector: string | null;
          location: string | null;
          content_pillar_id: string | null;
          wordpress_category_id: string | null;
          status: SourceSheetStatus;
          created_by_profile_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          summary?: string | null;
          context?: string | null;
          technical_details?: string | null;
          materials?: string | null;
          know_how?: string | null;
          client_or_sector?: string | null;
          location?: string | null;
          content_pillar_id?: string | null;
          wordpress_category_id?: string | null;
          status?: SourceSheetStatus;
          created_by_profile_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          summary?: string | null;
          context?: string | null;
          technical_details?: string | null;
          materials?: string | null;
          know_how?: string | null;
          client_or_sector?: string | null;
          location?: string | null;
          content_pillar_id?: string | null;
          wordpress_category_id?: string | null;
          status?: SourceSheetStatus;
          created_by_profile_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      validation_reviews: {
        Row: {
          id: string;
          channel_variant_id: string;
          requested_by_profile_id: string | null;
          reviewed_by_profile_id: string | null;
          status: ValidationReviewStatus;
          request_note: string | null;
          review_note: string | null;
          requested_at: string;
          reviewed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          channel_variant_id: string;
          requested_by_profile_id?: string | null;
          reviewed_by_profile_id?: string | null;
          status?: ValidationReviewStatus;
          request_note?: string | null;
          review_note?: string | null;
          requested_at?: string;
          reviewed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          channel_variant_id?: string;
          requested_by_profile_id?: string | null;
          reviewed_by_profile_id?: string | null;
          status?: ValidationReviewStatus;
          request_note?: string | null;
          review_note?: string | null;
          requested_at?: string;
          reviewed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      user_profiles: {
        Row: {
          id: string;
          auth_user_id: string;
          email: string;
          display_name: string | null;
          role: UserRole;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          auth_user_id: string;
          email: string;
          display_name?: string | null;
          role: UserRole;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          auth_user_id?: string;
          email?: string;
          display_name?: string | null;
          role?: UserRole;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      wordpress_categories: {
        Row: {
          id: string;
          slug: string;
          label: string;
          wordpress_id: number | null;
          is_active: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          label: string;
          wordpress_id?: number | null;
          is_active?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          label?: string;
          wordpress_id?: number | null;
          is_active?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
};
