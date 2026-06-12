import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

export async function createAuditLog(
  supabase: SupabaseClient<Database>,
  auditLog: Database["public"]["Tables"]["audit_logs"]["Insert"],
) {
  const auditLogsTable = supabase.from("audit_logs");
  const { error } = await auditLogsTable.insert(
    auditLog as unknown as Parameters<typeof auditLogsTable.insert>[0],
  );

  if (error) {
    throw error;
  }
}
