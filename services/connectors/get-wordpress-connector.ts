import { createClient } from "@/infrastructure/supabase/server";
import { parseWordPressConnectorConfig } from "@/modules/connectors/domain/wordpress-connector-config";
import { getConnectorSettingByProvider } from "@/repositories/connectors/connector-settings-repository";

export async function getWordPressConnector() {
  const supabase = await createClient();
  const setting = await getConnectorSettingByProvider(supabase, "wordpress");

  if (!setting) {
    return null;
  }

  return {
    ...setting,
    wordpressConfig: parseWordPressConnectorConfig(setting.config),
  };
}
