import { createSourceSheetAction } from "@/services/source-sheets/create-source-sheet";
import { getChannels } from "@/services/referentials/get-channels";
import { getContentPillars } from "@/services/referentials/get-content-pillars";
import { getMediaAssets } from "@/services/media/get-media-assets";
import { getWordPressCategories } from "@/services/referentials/get-wordpress-categories";
import { FormField } from "@/shared/ui/FormField";
import { PageTitle } from "@/shared/ui/PageTitle";

type NewSourceSheetPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

const errorMessages: Record<string, string> = {
  forbidden: "Votre rôle ne permet pas de créer une fiche source.",
  missing_profile: "Votre profil applicatif est introuvable.",
  missing_title: "Le titre est obligatoire.",
};

export default async function NewSourceSheetPage({
  searchParams,
}: NewSourceSheetPageProps) {
  const { error } = await searchParams;
  const [channels, contentPillars, mediaAssets, wordpressCategories] =
    await Promise.all([
      getChannels(),
      getContentPillars(),
      getMediaAssets(),
      getWordPressCategories(),
    ]);
  const errorMessage = error ? errorMessages[error] : null;

  return (
    <section className="mx-auto max-w-4xl space-y-6">
      <PageTitle
        eyebrow="Fiches sources"
        title="Créer une fiche source"
        description="Structurez la matière éditoriale avant les futurs contenus générés."
      />

      {errorMessage ? (
        <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {errorMessage}
        </p>
      ) : null}

      <form
        action={createSourceSheetAction}
        className="space-y-6 rounded-md border border-[var(--border)] bg-[var(--surface)] p-6"
      >
        <FormField
          helpText="Titre interne clair pour reconnaître la fiche."
          label="Titre"
        >
          <input
            className="w-full rounded-md border border-[var(--border)] px-3 py-2"
            name="title"
            required
            type="text"
          />
        </FormField>

        <FormField
          helpText="Résumé court du sujet, utile pour cadrer les futurs contenus."
          label="Résumé"
        >
          <textarea
            className="min-h-20 w-full rounded-md border border-[var(--border)] px-3 py-2"
            name="summary"
          />
        </FormField>

        <FormField
          helpText="Contexte du projet, de la réalisation, du matériau ou du sujet."
          label="Contexte"
        >
          <textarea
            className="min-h-24 w-full rounded-md border border-[var(--border)] px-3 py-2"
            name="context"
          />
        </FormField>

        <FormField
          helpText="Dimensions, contraintes, usinage, assemblage, finition ou points techniques."
          label="Détails techniques"
        >
          <textarea
            className="min-h-24 w-full rounded-md border border-[var(--border)] px-3 py-2"
            name="technical_details"
          />
        </FormField>

        <div className="grid gap-5 md:grid-cols-2">
          <FormField helpText="Matériaux utilisés ou évoqués." label="Matériaux">
            <input
              className="w-full rounded-md border border-[var(--border)] px-3 py-2"
              name="materials"
              type="text"
            />
          </FormField>

          <FormField
            helpText="Savoir-faire VLM à mettre en avant."
            label="Savoir-faire"
          >
            <input
              className="w-full rounded-md border border-[var(--border)] px-3 py-2"
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
              name="client_or_sector"
              type="text"
            />
          </FormField>

          <FormField helpText="Lieu du projet ou du sujet si pertinent." label="Lieu">
            <input
              className="w-full rounded-md border border-[var(--border)] px-3 py-2"
              name="location"
              type="text"
            />
          </FormField>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <FormField helpText="Pilier éditorial principal." label="Pilier de contenu">
            <select
              className="w-full rounded-md border border-[var(--border)] px-3 py-2"
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

          <FormField
            helpText="Catégorie cible pour une future publication WordPress."
            label="Catégorie WordPress"
          >
            <select
              className="w-full rounded-md border border-[var(--border)] px-3 py-2"
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
        </div>

        <fieldset className="rounded-md border border-[var(--border)] p-4">
          <legend className="px-1 text-sm font-medium">Canaux cibles</legend>
          <p className="mt-1 text-xs leading-5 text-[var(--muted)]">
            Sélectionnez les canaux envisagés. Aucune publication ne sera créée
            au Sprint 4.
          </p>
          <div className="mt-3 grid gap-2 md:grid-cols-2">
            {channels.map((channel) => (
              <label className="flex items-center gap-2 text-sm" key={channel.id}>
                <input name="channel_ids" type="checkbox" value={channel.id} />
                <span>{channel.label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="rounded-md border border-[var(--border)] p-4">
          <legend className="px-1 text-sm font-medium">Médias associés</legend>
          <p className="mt-1 text-xs leading-5 text-[var(--muted)]">
            Associez des médias déjà importés. Le média principal servira de
            repère pour les futurs contenus.
          </p>
          {mediaAssets.length === 0 ? (
            <p className="mt-3 text-sm text-[var(--muted)]">
              Aucun média disponible. Ajoutez d’abord des médias dans la bibliothèque.
            </p>
          ) : (
            <div className="mt-3 space-y-3">
              {mediaAssets.map((asset, index) => (
                <div className="rounded-md border border-[var(--border)] p-3" key={asset.id}>
                  <label className="flex items-center gap-2 text-sm font-medium">
                    <input
                      name="media_asset_ids"
                      type="checkbox"
                      value={asset.id}
                    />
                    <span>{asset.title ?? asset.fileName}</span>
                  </label>
                  <label className="mt-2 flex items-center gap-2 text-xs text-[var(--muted)]">
                    <input
                      defaultChecked={index === 0}
                      name="primary_media_asset_id"
                      type="radio"
                      value={asset.id}
                    />
                    <span>Définir comme média principal</span>
                  </label>
                </div>
              ))}
            </div>
          )}
        </fieldset>

        <div className="flex justify-end border-t border-[var(--border)] pt-5">
          <button
            className="rounded-md bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-white"
            type="submit"
          >
            Créer la fiche source
          </button>
        </div>
      </form>
    </section>
  );
}

