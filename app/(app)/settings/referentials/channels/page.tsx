import { channelStatusLabels } from "@/modules/channels/domain/channel";
import { getChannels } from "@/services/referentials/get-channels";
import { PageTitle } from "@/shared/ui/PageTitle";
import { StatusBadge } from "@/shared/ui/StatusBadge";

export default async function ChannelsPage() {
  const channels = await getChannels();

  return (
    <section className="space-y-6">
      <PageTitle
        eyebrow="Référentiels"
        title="Canaux"
        description="Canaux éditoriaux disponibles ou prévus. Les connecteurs techniques restent gérés séparément."
      />

      <div className="overflow-hidden rounded-md border border-[var(--border)] bg-[var(--surface)]">
        <table className="w-full text-left text-sm">
          <thead className="bg-[var(--background)] text-[var(--muted)]">
            <tr>
              <th className="px-4 py-3 font-medium">Canal</th>
              <th className="px-4 py-3 font-medium">Clé</th>
              <th className="px-4 py-3 font-medium">Statut</th>
            </tr>
          </thead>
          <tbody>
            {channels.map((channel) => (
              <tr className="border-t border-[var(--border)]" key={channel.id}>
                <td className="px-4 py-3 font-medium">{channel.label}</td>
                <td className="px-4 py-3 text-[var(--muted)]">{channel.key}</td>
                <td className="px-4 py-3">
                  <StatusBadge
                    tone={channel.status === "enabled" ? "success" : "muted"}
                  >
                    {channelStatusLabels[channel.status]}
                  </StatusBadge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

