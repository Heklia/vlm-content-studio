import Link from "next/link";
import { mandatoryAiVisualNotice } from "@/modules/media/domain/media-asset";
import { getMediaAssets } from "@/services/media/get-media-assets";
import { PageTitle } from "@/shared/ui/PageTitle";
import { StatusBadge } from "@/shared/ui/StatusBadge";

export default async function MediaPage() {
  const mediaAssets = await getMediaAssets();

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <PageTitle
          eyebrow="Bibliothèque"
          title="Médias"
          description="Médias stockés dans Supabase Storage privé. Les fiches sources et contenus les utiliseront dans les prochains sprints."
        />
        <Link
          className="rounded-md bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white"
          href="/media/new"
        >
          Ajouter un média
        </Link>
      </div>

      <div className="rounded-md border border-[var(--border)] bg-[var(--surface)] p-5">
        <p className="text-sm font-medium">Mention IA obligatoire</p>
        <p className="mt-2 text-sm text-[var(--muted)]">
          {mandatoryAiVisualNotice}
        </p>
      </div>

      <div className="overflow-hidden rounded-md border border-[var(--border)] bg-[var(--surface)]">
        <table className="w-full text-left text-sm">
          <thead className="bg-[var(--background)] text-[var(--muted)]">
            <tr>
              <th className="px-4 py-3 font-medium">Média</th>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">IA</th>
              <th className="px-4 py-3 font-medium">Statut</th>
              <th className="px-4 py-3 font-medium">Ajouté le</th>
            </tr>
          </thead>
          <tbody>
            {mediaAssets.length === 0 ? (
              <tr>
                <td className="px-4 py-8 text-center text-[var(--muted)]" colSpan={5}>
                  Aucun média pour le moment.
                </td>
              </tr>
            ) : (
              mediaAssets.map((asset) => (
                <tr className="border-t border-[var(--border)]" key={asset.id}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {asset.previewUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          alt={asset.altText ?? asset.title ?? asset.fileName}
                          className="h-12 w-12 rounded-md object-cover"
                          src={asset.previewUrl}
                        />
                      ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded-md bg-[var(--background)] text-xs text-[var(--muted)]">
                          {asset.fileType}
                        </div>
                      )}
                      <div>
                        <p className="font-medium">{asset.title ?? asset.fileName}</p>
                        <p className="text-xs text-[var(--muted)]">
                          {asset.fileName}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">{asset.fileType}</td>
                  <td className="px-4 py-3">
                    <StatusBadge tone={asset.isAiGenerated ? "muted" : "default"}>
                      {asset.isAiGenerated ? "Oui" : "Non"}
                    </StatusBadge>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge tone={asset.status === "active" ? "success" : "muted"}>
                      {asset.status === "active" ? "Actif" : "Archivé"}
                    </StatusBadge>
                  </td>
                  <td className="px-4 py-3 text-[var(--muted)]">
                    {new Intl.DateTimeFormat("fr-FR").format(
                      new Date(asset.createdAt),
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

