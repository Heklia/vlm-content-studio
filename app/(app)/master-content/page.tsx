import Link from "next/link";
import {
  generationModeLabels,
  masterContentStatusLabels,
} from "@/modules/master-content/domain/master-content";
import { getMasterContents } from "@/services/master-content/get-master-contents";
import { PageTitle } from "@/shared/ui/PageTitle";
import { StatusBadge } from "@/shared/ui/StatusBadge";

export default async function MasterContentPage() {
  const masterContents = await getMasterContents();

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <PageTitle
          eyebrow="Contenus"
          title="Contenu maître"
          description="Contenus éditoriaux centraux, rédigés manuellement au Sprint 5, à partir des fiches sources."
        />
        <Link
          className="rounded-md bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white"
          href="/master-content/new"
        >
          Créer un contenu maître
        </Link>
      </div>

      <div className="overflow-hidden rounded-md border border-[var(--border)] bg-[var(--surface)]">
        <table className="w-full text-left text-sm">
          <thead className="bg-[var(--background)] text-[var(--muted)]">
            <tr>
              <th className="px-4 py-3 font-medium">Titre</th>
              <th className="px-4 py-3 font-medium">Fiche source</th>
              <th className="px-4 py-3 font-medium">Statut</th>
              <th className="px-4 py-3 font-medium">Mode</th>
              <th className="px-4 py-3 font-medium">Créé le</th>
            </tr>
          </thead>
          <tbody>
            {masterContents.length === 0 ? (
              <tr>
                <td className="px-4 py-8 text-center text-[var(--muted)]" colSpan={5}>
                  Aucun contenu maître pour le moment.
                </td>
              </tr>
            ) : (
              masterContents.map((content) => (
                <tr className="border-t border-[var(--border)]" key={content.id}>
                  <td className="px-4 py-3">
                    <Link
                      className="font-medium hover:text-[var(--accent)]"
                      href={`/master-content/${content.id}`}
                    >
                      {content.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-[var(--muted)]">
                    {content.sourceSheet?.title ?? "Non liée"}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge tone={content.status === "ready" ? "success" : "default"}>
                      {masterContentStatusLabels[content.status]}
                    </StatusBadge>
                  </td>
                  <td className="px-4 py-3 text-[var(--muted)]">
                    {generationModeLabels[content.generationMode]}
                  </td>
                  <td className="px-4 py-3 text-[var(--muted)]">
                    {new Intl.DateTimeFormat("fr-FR").format(
                      new Date(content.createdAt),
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

