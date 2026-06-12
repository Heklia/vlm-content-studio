import Link from "next/link";
import { notFound } from "next/navigation";
import { mandatoryAiVisualNotice } from "@/modules/media/domain/media-asset";
import { deleteMediaAssetAction } from "@/services/media/delete-media-assets";
import { getMediaAsset } from "@/services/media/get-media-asset";
import { updateMediaAssetAction } from "@/services/media/update-media-asset";
import { ConfirmSubmitButton } from "@/shared/ui/ConfirmSubmitButton";
import { FormField } from "@/shared/ui/FormField";
import { FormUnloadGuard } from "@/shared/ui/FormUnloadGuard";
import { PageTitle } from "@/shared/ui/PageTitle";
import { StatusBadge } from "@/shared/ui/StatusBadge";
import { SubmitButton } from "@/shared/ui/SubmitButton";

type MediaDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    error?: string;
    saved?: string;
  }>;
};

const errorMessages: Record<string, string> = {
  forbidden: "Votre rôle ne permet pas de modifier ce média.",
  missing_ai_notice: "La mention IA est obligatoire pour un visuel généré par IA.",
  missing_media: "Le média est introuvable.",
};

function formatFileSize(size: number) {
  if (size < 1024 * 1024) {
    return `${Math.max(1, Math.round(size / 1024))} Ko`;
  }

  return `${(size / 1024 / 1024).toFixed(1)} Mo`;
}

export default async function MediaDetailPage({
  params,
  searchParams,
}: MediaDetailPageProps) {
  const [{ id }, { error, saved }] = await Promise.all([params, searchParams]);
  const asset = await getMediaAsset(id);

  if (!asset) {
    notFound();
  }

  const errorMessage = error ? errorMessages[error] : null;

  return (
    <section className="mx-auto max-w-4xl space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <PageTitle
          eyebrow="Média"
          title={asset.title ?? asset.fileName}
          description="Modifiez les informations éditoriales du média ou supprimez-le de la bibliothèque."
        />
        <Link
          className="rounded-md border border-[var(--border)] px-4 py-2 text-sm font-semibold"
          href="/media"
        >
          Retour aux médias
        </Link>
      </div>

      {errorMessage ? (
        <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {errorMessage}
        </p>
      ) : null}

      {saved ? (
        <p className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          Média enregistré.
        </p>
      ) : null}

      <div className="grid gap-5 md:grid-cols-[220px_1fr]">
        <div className="rounded-md border border-[var(--border)] bg-[var(--surface)] p-4">
          {asset.previewUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              alt={asset.altText ?? asset.title ?? asset.fileName}
              className="aspect-square w-full rounded-md object-cover"
              src={asset.previewUrl}
            />
          ) : (
            <div className="flex aspect-square w-full items-center justify-center rounded-md bg-[var(--background)] text-sm text-[var(--muted)]">
              {asset.fileType}
            </div>
          )}
          <div className="mt-4 space-y-2 text-sm text-[var(--muted)]">
            <p>Fichier : {asset.fileName}</p>
            <p>Type : {asset.mimeType}</p>
            <p>Poids : {formatFileSize(asset.fileSize)}</p>
            <p>Ajouté le : {new Intl.DateTimeFormat("fr-FR").format(new Date(asset.createdAt))}</p>
          </div>
        </div>

        <form
          action={updateMediaAssetAction}
          className="space-y-5 rounded-md border border-[var(--border)] bg-[var(--surface)] p-6"
        >
          <FormUnloadGuard draftKey={`vlm-content-studio:media:${asset.id}`} />
          <input name="media_asset_id" type="hidden" value={asset.id} />

          <div className="flex flex-wrap gap-2">
            <StatusBadge tone={asset.status === "active" ? "success" : "muted"}>
              {asset.status === "active" ? "Actif" : "Archivé"}
            </StatusBadge>
            <StatusBadge tone={asset.isPrimary ? "success" : "muted"}>
              {asset.isPrimary ? "Média principal" : "Secondaire"}
            </StatusBadge>
            <StatusBadge tone={asset.isAiGenerated ? "muted" : "default"}>
              {asset.isAiGenerated ? "Visuel IA" : "Non IA"}
            </StatusBadge>
          </div>

          <FormField
            helpText="Nom lisible utilisé dans la bibliothèque et les futures fiches sources."
            label="Titre"
          >
            <input
              className="w-full rounded-md border border-[var(--border)] px-3 py-2"
              defaultValue={asset.title ?? ""}
              name="title"
              type="text"
            />
          </FormField>

          <FormField
            helpText="Contexte du média : projet, matière, usage, étape de fabrication."
            label="Description"
          >
            <textarea
              className="min-h-24 w-full rounded-md border border-[var(--border)] px-3 py-2"
              defaultValue={asset.description ?? ""}
              name="description"
            />
          </FormField>

          <FormField
            helpText="Description concrète de ce que l’on voit, utile pour l’accessibilité et le référencement."
            label="Texte alternatif"
          >
            <input
              className="w-full rounded-md border border-[var(--border)] px-3 py-2"
              defaultValue={asset.altText ?? ""}
              name="alt_text"
              type="text"
            />
          </FormField>

          <FormField
            helpText="Origine ou droits du média : photographe, atelier, client, banque d’images, outil IA."
            label="Crédit"
          >
            <input
              className="w-full rounded-md border border-[var(--border)] px-3 py-2"
              defaultValue={asset.credit ?? ""}
              name="credit"
              type="text"
            />
          </FormField>

          <div className="grid gap-4 md:grid-cols-2">
            <FormField helpText="Statut interne du média." label="Statut">
              <select
                className="w-full rounded-md border border-[var(--border)] px-3 py-2"
                defaultValue={asset.status}
                name="status"
              >
                <option value="active">Actif</option>
                <option value="archived">Archivé</option>
              </select>
            </FormField>

            <label className="flex items-center gap-3 rounded-md border border-[var(--border)] p-4 text-sm">
              <input
                defaultChecked={asset.isPrimary}
                name="is_primary"
                type="checkbox"
              />
              <span>Marquer comme média principal</span>
            </label>
          </div>

          <label className="flex items-start gap-3 rounded-md border border-[var(--border)] p-4">
            <input
              className="mt-1"
              defaultChecked={asset.isAiGenerated}
              name="is_ai_generated"
              type="checkbox"
            />
            <span>
              <span className="block text-sm font-medium">Visuel généré par IA</span>
              <span className="mt-1 block text-xs leading-5 text-[var(--muted)]">
                Si cette case est cochée, la mention IA obligatoire doit être renseignée.
              </span>
            </span>
          </label>

          <FormField
            helpText="Mention obligatoire pour tout visuel généré par IA."
            label="Mention IA"
          >
            <textarea
              className="min-h-20 w-full rounded-md border border-[var(--border)] px-3 py-2"
              defaultValue={asset.aiVisualNotice ?? mandatoryAiVisualNotice}
              name="ai_visual_notice"
            />
          </FormField>

          <div className="flex flex-wrap justify-between gap-3 border-t border-[var(--border)] pt-5">
            <SubmitButton
              className="rounded-md bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
              pendingLabel="Enregistrement..."
            >
              Enregistrer les modifications
            </SubmitButton>
          </div>
        </form>
      </div>

      <form
        action={deleteMediaAssetAction}
        className="rounded-md border border-red-200 bg-red-50 p-5"
      >
        <input name="media_asset_id" type="hidden" value={asset.id} />
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-red-900">Supprimer ce média</p>
            <p className="mt-1 text-sm text-red-800">
              Cette action supprime la fiche média, ses associations aux fiches
              sources et le fichier stocké.
            </p>
          </div>
          <ConfirmSubmitButton
            className="rounded-md bg-red-700 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
            confirmMessage="Supprimer ce média ? Cette action supprimera aussi le fichier stocké."
            pendingLabel="Suppression..."
          >
            Supprimer
          </ConfirmSubmitButton>
        </div>
      </form>
    </section>
  );
}
