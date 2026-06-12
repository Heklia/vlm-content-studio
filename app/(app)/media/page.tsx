import Link from "next/link";
import { mandatoryAiVisualNotice } from "@/modules/media/domain/media-asset";
import { deleteSelectedMediaAssetsAction } from "@/services/media/delete-media-assets";
import { getMediaAssets } from "@/services/media/get-media-assets";
import { ConfirmSubmitButton } from "@/shared/ui/ConfirmSubmitButton";
import { MediaQuickDropzone } from "@/app/(app)/media/MediaQuickDropzone";
import { PageTitle } from "@/shared/ui/PageTitle";
import { StatusBadge } from "@/shared/ui/StatusBadge";

function formatFileSize(size: number) {
  if (size < 1024 * 1024) {
    return `${Math.max(1, Math.round(size / 1024))} Ko`;
  }

  return `${(size / 1024 / 1024).toFixed(1)} Mo`;
}

type MediaPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

const errorMessages: Record<string, string> = {
  forbidden: "Votre rôle ne permet pas de supprimer ces médias.",
  missing_media: "Le média demandé est introuvable.",
  no_selection: "Sélectionnez au moins un média à supprimer.",
};

export default async function MediaPage({ searchParams }: MediaPageProps) {
  const { error } = await searchParams;
  const mediaAssets = await getMediaAssets();
  const errorMessage = error ? errorMessages[error] : null;

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

      {errorMessage ? (
        <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {errorMessage}
        </p>
      ) : null}

      <MediaQuickDropzone />

      <form
        action={deleteSelectedMediaAssetsAction}
        className="space-y-3"
      >
        <div className="flex justify-end">
          <ConfirmSubmitButton
            className="rounded-md border border-red-200 px-4 py-2 text-sm font-semibold text-red-700 disabled:cursor-not-allowed disabled:opacity-60"
            confirmMessage="Supprimer les médias cochés ? Cette action supprimera aussi les fichiers stockés."
            pendingLabel="Suppression..."
          >
            Supprimer les médias cochés
          </ConfirmSubmitButton>
        </div>

        <div className="overflow-x-auto rounded-md border border-[var(--border)] bg-[var(--surface)]">
          <table className="min-w-[1400px] text-left text-sm">
            <thead className="bg-[var(--background)] text-[var(--muted)]">
              <tr>
                <th className="px-4 py-3 font-medium">Sélection</th>
                <th className="px-4 py-3 font-medium">Média</th>
                <th className="px-4 py-3 font-medium">Titre</th>
                <th className="px-4 py-3 font-medium">Description</th>
                <th className="px-4 py-3 font-medium">Texte alternatif</th>
                <th className="px-4 py-3 font-medium">Crédit</th>
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 font-medium">Poids</th>
                <th className="px-4 py-3 font-medium">Principal</th>
                <th className="px-4 py-3 font-medium">IA</th>
                <th className="px-4 py-3 font-medium">Mention IA</th>
                <th className="px-4 py-3 font-medium">Statut</th>
                <th className="px-4 py-3 font-medium">Ajouté le</th>
              </tr>
            </thead>
            <tbody>
              {mediaAssets.length === 0 ? (
              <tr>
                <td className="px-4 py-8 text-center text-[var(--muted)]" colSpan={13}>
                  Aucun média pour le moment.
                </td>
              </tr>
            ) : (
              mediaAssets.map((asset) => (
                <tr className="border-t border-[var(--border)]" key={asset.id}>
                  <td className="px-4 py-3">
                    <input
                      aria-label={`Sélectionner ${asset.title ?? asset.fileName}`}
                      name="media_asset_ids"
                      type="checkbox"
                      value={asset.id}
                    />
                  </td>
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
                        <Link
                          className="font-medium hover:text-[var(--accent)]"
                          href={`/media/${asset.id}`}
                        >
                          {asset.fileName}
                        </Link>
                        <p className="text-xs text-[var(--muted)]">
                          Modifier la fiche
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">{asset.title ?? "Non renseigné"}</td>
                  <td className="max-w-xs px-4 py-3 text-[var(--muted)]">
                    {asset.description ?? "Non renseignée"}
                  </td>
                  <td className="max-w-xs px-4 py-3 text-[var(--muted)]">
                    {asset.altText ?? "Non renseigné"}
                  </td>
                  <td className="px-4 py-3 text-[var(--muted)]">
                    {asset.credit ?? "Non renseigné"}
                  </td>
                  <td className="px-4 py-3">{asset.fileType}</td>
                  <td className="px-4 py-3 text-[var(--muted)]">
                    {formatFileSize(asset.fileSize)}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge tone={asset.isPrimary ? "success" : "muted"}>
                      {asset.isPrimary ? "Oui" : "Non"}
                    </StatusBadge>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge tone={asset.isAiGenerated ? "muted" : "default"}>
                      {asset.isAiGenerated ? "Oui" : "Non"}
                    </StatusBadge>
                  </td>
                  <td className="max-w-xs px-4 py-3 text-[var(--muted)]">
                    {asset.aiVisualNotice ?? "Non applicable"}
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
      </form>
    </section>
  );
}
