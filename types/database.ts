import type { ConnectorStatus } from "@/modules/connectors/domain/connector-provider";
import type { UserRole } from "@/modules/users/domain/user-role";
import type { JsonValue } from "@/types/common";

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
    };
  };
};

