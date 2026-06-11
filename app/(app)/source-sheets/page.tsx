import Link from "next/link";
import {
  sourceSheetStatusLabels,
} from "@/modules/source-sheets/domain/source-sheet";
import { getSourceSheets } from "@/services/source-sheets/get-source-sheets";
import { PageTitle } from "@/shared/ui/PageTitle";
import { StatusBadge } from "@/shared/ui/StatusBadge";

export default async function SourceSheetsPage() {
  const sourceSheets = await getSourceSheets();

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <PageTitle
          eyebrow="Contenus"
          title="Fiches sources"
          description="Matière première éditoriale structurée avant génération de contenu maître."
        />
        <Link
          className="rounded-md bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white"
          href="/source-sheets/new"
        >
          Créer une fiche source
        </Link>
      </div>

      <div className="overflow-hidden rounded-md border border-[var(--border)] bg-[var(--surface)]">
        <table className="w-full text-left text-sm">
          <thead className="bg-[var(--background)] text-[var(--muted)]">
            <tr>
              <th className="px-4 py-3 font-medium">Titre</th>
              <th className="px-4 py-3 font-medium">Statut</th>
              <th className="px-4 py-3 font-medium">Pilier</th>
              <th className="px-4 py-3 font-medium">Catégorie WP</th>
              <th className="px-4 py-3 font-medium">Créée le</th>
            </tr>
          </thead>
          <tbody>
            {sourceSheets.length === 0 ? (
              <tr>
                <td className="px-4 py-8 text-center text-[var(--muted)]" colSpan={5}>
                  Aucune fiche source pour le moment.
                </td>
              </tr>
            ) : (
              sourceSheets.map((sourceSheet) => (
                <tr className="border-t border-[var(--border)]" key={sourceSheet.id}>
                  <td className="px-4 py-3">
                    <Link
                      className="font-medium hover:text-[var(--accent)]"
                      href={`/source-sheets/${sourceSheet.id}`}
                    >
                      {sourceSheet.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge
                      tone={sourceSheet.status === "ready" ? "success" : "default"}
                    >
                      {sourceSheetStatusLabels[sourceSheet.status]}
                    </StatusBadge>
                  </td>
                  <td className="px-4 py-3 text-[var(--muted)]">
                    {sourceSheet.contentPillar?.label ?? "Non défini"}
                  </td>
                  <td className="px-4 py-3 text-[var(--muted)]">
                    {sourceSheet.wordpressCategory?.label ?? "Non définie"}
                  </td>
                  <td className="px-4 py-3 text-[var(--muted)]">
                    {new Intl.DateTimeFormat("fr-FR").format(
                      new Date(sourceSheet.createdAt),
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

