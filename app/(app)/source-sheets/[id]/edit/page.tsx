import Link from "next/link";
import { notFound } from "next/navigation";
import { MediaSelector } from "@/app/(app)/source-sheets/new/MediaSelector";
import { getChannels } from "@/services/referentials/get-channels";
import { getContentPillars } from "@/services/referentials/get-content-pillars";
import { getMediaAssets } from "@/services/media/get-media-assets";
import { getSourceSheet } from "@/services/source-sheets/get-source-sheet";
import { getWordPressCategories } from "@/services/referentials/get-wordpress-categories";
import { updateSourceSheetAction } from "@/services/source-sheets/manage-source-sheet";
import { FormField } from "@/shared/ui/FormField";
import { FormUnloadGuard } from "@/shared/ui/FormUnloadGuard";
import { PageTitle } from "@/shared/ui/PageTitle";
import { SubmitButton } from "@/shared/ui/SubmitButton";

type EditSourceSheetPageProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    error?: string;
  }>;
};

const errorMessages: Record<string, string> = {
  forbidden: "Votre rôle ne permet pas de modifier cette fiche source.",
  missing_title: "Le titre est obligatoire.",
};

export default async function EditSourceSheetPage({
  params,
  searchParams,
}: EditSourceSheetPageProps) {
  const [{ id }, { error }] = await Promise.all([params, searchParams]);
  const [
    sourceSheet,
    channels,
    contentPillars,
    mediaAssets,
    wordpressCategories,
  ] = await Promise.all([
    getSourceSheet(id),
    getChannels(),
    getContentPillars(),
    getMediaAssets(),
    getWordPressCategories(),
  ]);

  if (!sourceSheet) {
    notFound();
  }

  const connectedChannels = channels.filter(
    (channel) => channel.status === "enabled",
  );
  const selectedChannelIds = new Set(
    sourceSheet.channels.map((channel) => channel.id),
  );
  const selectedMediaIds = sourceSheet.mediaAssets.map((asset) => asset.id);
  const primaryMediaAssetId =
    sourceSheet.mediaAssets.find((asset) => asset.relationIsPrimary)?.id ?? "";
  const errorMessage = error ? errorMessages[error] : null;

  return (
    <section className="mx-auto max-w-4xl space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <PageTitle
          eyebrow="Fiche source"
          title={`Modifier ${sourceSheet.title}`}
          description="Mettez à jour la matière éditoriale, les canaux et les médias associés."
        />
        <Link
          className="rounded-md border border-[var(--border)] px-4 py-2 text-sm font-semibold"
          href={`/source-sheets/${sourceSheet.id}`}
        >
          Retour à la fiche
        </Link>
      </div>

      {errorMessage ? (
        <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {errorMessage}
        </p>
      ) : null}

      <form
        action={updateSourceSheetAction}
        className="space-y-6 rounded-md border border-[var(--border)] bg-[var(--surface)] p-6"
      >
        <FormUnloadGuard draftKey={`vlm-content-studio:source-sheets:${sourceSheet.id}`} />
        <input name="source_sheet_id" type="hidden" value={sourceSheet.id} />

        <FormField helpText="Titre interne clair pour reconnaître la fiche." label="Titre">
          <input
            className="w-full rounded-md border border-[var(--border)] px-3 py-2"
            defaultValue={sourceSheet.title}
            name="title"
            required
            type="text"
          />
        </FormField>

        <div className="grid gap-5 md:grid-cols-2">
          <FormField helpText="Statut de préparation de la fiche." label="Statut">
            <select
              className="w-full rounded-md border border-[var(--border)] px-3 py-2"
              defaultValue={sourceSheet.status}
              name="status"
            >
              <option value="draft">Brouillon</option>
              <option value="ready">Prête</option>
            </select>
          </FormField>

          <FormField helpText="Pilier éditorial principal." label="Pilier de contenu">
            <select
              className="w-full rounded-md border border-[var(--border)] px-3 py-2"
              defaultValue={sourceSheet.contentPillarId ?? ""}
              name="content_pillar_id"
            >
              <option value="">Non défini</option>
              {contentPillars.map((pillar) => (
                <option key={pillar.id} value={pillar.id}>
                  {pillar.label}
                </option>
              ))}
            </select>
          </FormField>
        </div>

        <FormField
          helpText="Résumé court du sujet, utile pour cadrer les futurs contenus."
          label="Résumé"
        >
          <textarea
            className="min-h-20 w-full rounded-md border border-[var(--border)] px-3 py-2"
            defaultValue={sourceSheet.summary ?? ""}
            name="summary"
          />
        </FormField>

        <FormField
          helpText="Contexte du projet, de la réalisation, du matériau ou du sujet."
          label="Contexte"
        >
          <textarea
            className="min-h-24 w-full rounded-md border border-[var(--border)] px-3 py-2"
            defaultValue={sourceSheet.context ?? ""}
            name="context"
          />
        </FormField>

        <FormField
          helpText="Dimensions, contraintes, usinage, assemblage, finition ou points techniques."
          label="Détails techniques"
        >
          <textarea
            className="min-h-24 w-full rounded-md border border-[var(--border)] px-3 py-2"
            defaultValue={sourceSheet.technicalDetails ?? ""}
            name="technical_details"
          />
        </FormField>

        <div className="grid gap-5 md:grid-cols-2">
          <FormField helpText="Matériaux utilisés ou évoqués." label="Matériaux">
            <input
              className="w-full rounded-md border border-[var(--border)] px-3 py-2"
              defaultValue={sourceSheet.materials ?? ""}
              name="materials"
              type="text"
            />
          </FormField>

          <FormField helpText="Savoir-faire VLM à mettre en avant." label="Savoir-faire">
            <input
              className="w-full rounded-md border border-[var(--border)] px-3 py-2"
              defaultValue={sourceSheet.knowHow ?? ""}
              name="know_how"
              type="text"
            />
          </FormField>

          <FormField
            helpText="Client, secteur ou cible si l'information peut être utilisée."
            label="Client ou secteur"
          >
            <input
              className="w-full rounded-md border border-[var(--border)] px-3 py-2"
              defaultValue={sourceSheet.clientOrSector ?? ""}
              name="client_or_sector"
              type="text"
            />
          </FormField>

          <FormField helpText="Lieu du projet ou du sujet si pertinent." label="Lieu">
            <input
              className="w-full rounded-md border border-[var(--border)] px-3 py-2"
              defaultValue={sourceSheet.location ?? ""}
              name="location"
              type="text"
            />
          </FormField>
        </div>

        <FormField
          helpText="Catégorie cible pour une future publication WordPress."
          label="Catégorie WordPress"
        >
          <select
            className="w-full rounded-md border border-[var(--border)] px-3 py-2"
            defaultValue={sourceSheet.wordpressCategoryId ?? ""}
            name="wordpress_category_id"
          >
            <option value="">Non définie</option>
            {wordpressCategories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.label}
              </option>
            ))}
          </select>
        </FormField>

        <fieldset className="rounded-md border border-[var(--border)] p-4">
          <legend className="px-1 text-sm font-medium">Canaux cibles</legend>
          <div className="mt-3 grid gap-2 md:grid-cols-2">
            {connectedChannels.map((channel) => (
              <label className="flex items-center gap-2 text-sm" key={channel.id}>
                <input
                  defaultChecked={selectedChannelIds.has(channel.id)}
                  name="channel_ids"
                  type="checkbox"
                  value={channel.id}
                />
                <span>{channel.label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <MediaSelector
          draftKey={`vlm-content-studio:source-sheets:${sourceSheet.id}`}
          initialPrimaryMediaAssetId={primaryMediaAssetId}
          initialSelectedIds={selectedMediaIds}
          mediaAssets={mediaAssets}
        />

        <div className="flex justify-end border-t border-[var(--border)] pt-5">
          <SubmitButton
            className="rounded-md bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
            pendingLabel="Enregistrement..."
          >
            Enregistrer les modifications
          </SubmitButton>
        </div>
      </form>
    </section>
  );
}
