import Link from "next/link";
import {
  channelVariantStatusLabels,
} from "@/modules/channel-variants/domain/channel-variant";
import { generationModeLabels } from "@/modules/master-content/domain/master-content";
import { getChannelVariants } from "@/services/channel-variants/get-channel-variants";
import { PageTitle } from "@/shared/ui/PageTitle";
import { StatusBadge } from "@/shared/ui/StatusBadge";

export default async function ChannelVariantsPage() {
  const channelVariants = await getChannelVariants();

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <PageTitle
          eyebrow="Multicanal"
          title="Déclinaisons"
          description="Versions préparées manuellement pour WordPress, LinkedIn, Pinterest et Google Business."
        />
        <Link
          className="rounded-md bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white"
          href="/channel-variants/new"
        >
          Créer une déclinaison
        </Link>
      </div>

      <div className="overflow-hidden rounded-md border border-[var(--border)] bg-[var(--surface)]">
        <table className="w-full text-left text-sm">
          <thead className="bg-[var(--background)] text-[var(--muted)]">
            <tr>
              <th className="px-4 py-3 font-medium">Titre</th>
              <th className="px-4 py-3 font-medium">Canal</th>
              <th className="px-4 py-3 font-medium">Contenu maître</th>
              <th className="px-4 py-3 font-medium">Statut</th>
              <th className="px-4 py-3 font-medium">Mode</th>
              <th className="px-4 py-3 font-medium">Créée le</th>
            </tr>
          </thead>
          <tbody>
            {channelVariants.length === 0 ? (
              <tr>
                <td className="px-4 py-8 text-center text-[var(--muted)]" colSpan={6}>
                  Aucune déclinaison pour le moment.
                </td>
              </tr>
            ) : (
              channelVariants.map((variant) => (
                <tr className="border-t border-[var(--border)]" key={variant.id}>
                  <td className="px-4 py-3">
                    <Link
                      className="font-medium hover:text-[var(--accent)]"
                      href={`/channel-variants/${variant.id}`}
                    >
                      {variant.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-[var(--muted)]">
                    {variant.channel?.label ?? "Canal inconnu"}
                  </td>
                  <td className="px-4 py-3 text-[var(--muted)]">
                    {variant.masterContent?.title ?? "Non lié"}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge tone={variant.status === "ready" ? "success" : "default"}>
                      {channelVariantStatusLabels[variant.status]}
                    </StatusBadge>
                  </td>
                  <td className="px-4 py-3 text-[var(--muted)]">
                    {generationModeLabels[variant.generationMode]}
                  </td>
                  <td className="px-4 py-3 text-[var(--muted)]">
                    {new Intl.DateTimeFormat("fr-FR").format(
                      new Date(variant.createdAt),
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
