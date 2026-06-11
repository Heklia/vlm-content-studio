import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  ConnectorProvider,
  ConnectorStatus,
} from "@/modules/connectors/domain/connector-provider";
import type { Database } from "@/types/database";
import type { JsonValue } from "@/types/common";

export type ConnectorSetting = {
  id: string;
  provider: ConnectorProvider;
  label: string;
  status: ConnectorStatus;
  config: JsonValue;
  createdAt: string;
  updatedAt: string;
};

function mapConnectorSetting(
  row: Database["public"]["Tables"]["connector_settings"]["Row"],
): ConnectorSetting {
  return {
    id: row.id,
    provider: row.provider as ConnectorProvider,
    label: row.label,
    status: row.status,
    config: row.config,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function listConnectorSettings(
  supabase: SupabaseClient<Database>,
) {
  const { data, error } = await supabase
    .from("connector_settings")
    .select("*")
    .order("provider", { ascending: true });

  if (error) {
    throw error;
  }

  return data.map(mapConnectorSetting);
}

