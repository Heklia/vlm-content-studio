import Link from "next/link";
import { scheduledPublicationStatusLabels } from "@/modules/planning/domain/scheduled-publication";
import { getScheduledPublications } from "@/services/planning/get-scheduled-publications";
import { PageTitle } from "@/shared/ui/PageTitle";
import { StatusBadge } from "@/shared/ui/StatusBadge";

export default async function PlanningPage() {
  const publications = await getScheduledPublications();

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <PageTitle
          eyebrow="Planning"
          title="Planning éditorial"
          description="Publications préparées dans le calendrier. Le Sprint 7 ne publie pas automatiquement."
        />
        <Link
          className="rounded-md bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white"
          href="/planning/new"
        >
          Planifier une publication
        </Link>
      </div>

      <div className="overflow-hidden rounded-md border border-[var(--border)] bg-[var(--surface)]">
        <table className="w-full text-left text-sm">
          <thead className="bg-[var(--background)] text-[var(--muted)]">
            <tr>
              <th className="px-4 py-3 font-medium">Date prévue</th>
              <th className="px-4 py-3 font-medium">Déclinaison</th>
              <th className="px-4 py-3 font-medium">Canal</th>
              <th className="px-4 py-3 font-medium">Statut</th>
              <th className="px-4 py-3 font-medium">Notes</th>
            </tr>
          </thead>
          <tbody>
            {publications.length === 0 ? (
              <tr>
                <td className="px-4 py-8 text-center text-[var(--muted)]" colSpan={5}>
                  Aucune publication planifiée pour le moment.
                </td>
              </tr>
            ) : (
              publications.map((publication) => (
                <tr className="border-t border-[var(--border)]" key={publication.id}>
                  <td className="px-4 py-3 text-[var(--muted)]">
                    {new Intl.DateTimeFormat("fr-FR", {
                      dateStyle: "short",
                      timeStyle: "short",
                    }).format(new Date(publication.scheduledFor))}
                  </td>
                  <td className="px-4 py-3 font-medium">
                    {publication.channelVariant?.title ?? "Déclinaison inconnue"}
                  </td>
                  <td className="px-4 py-3 text-[var(--muted)]">
                    {publication.channel?.label ?? "Canal inconnu"}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge>
                      {scheduledPublicationStatusLabels[publication.status]}
                    </StatusBadge>
                  </td>
                  <td className="px-4 py-3 text-[var(--muted)]">
                    {publication.publicationNotes ?? "Non renseigné"}
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
