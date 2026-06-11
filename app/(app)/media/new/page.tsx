import { mandatoryAiVisualNotice } from "@/modules/media/domain/media-asset";
import { uploadMediaAsset } from "@/services/media/upload-media-asset";
import { FormField } from "@/shared/ui/FormField";
import { PageTitle } from "@/shared/ui/PageTitle";

type NewMediaPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

const errorMessages: Record<string, string> = {
  forbidden: "Votre rôle ne permet pas d’ajouter un média.",
  missing_ai_notice: "La mention IA est obligatoire pour un visuel généré par IA.",
  missing_file: "Merci de sélectionner un fichier.",
  missing_profile: "Votre profil applicatif est introuvable.",
};

export default async function NewMediaPage({ searchParams }: NewMediaPageProps) {
  const { error } = await searchParams;
  const errorMessage = error ? errorMessages[error] : null;

  return (
    <section className="mx-auto max-w-3xl space-y-6">
      <PageTitle
        eyebrow="Médias"
        title="Ajouter un média"
        description="Le fichier sera stocké dans le bucket privé Supabase Storage `media-assets`."
      />

      {errorMessage ? (
        <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {errorMessage}
        </p>
      ) : null}

      <form
        action={uploadMediaAsset}
        className="space-y-5 rounded-md border border-[var(--border)] bg-[var(--surface)] p-6"
      >
        <FormField label="Fichier">
          <input
            className="w-full rounded-md border border-[var(--border)] px-3 py-2"
            name="file"
            required
            type="file"
          />
        </FormField>

        <FormField label="Titre">
          <input
            className="w-full rounded-md border border-[var(--border)] px-3 py-2"
            name="title"
            type="text"
          />
        </FormField>

        <FormField label="Description">
          <textarea
            className="min-h-24 w-full rounded-md border border-[var(--border)] px-3 py-2"
            name="description"
          />
        </FormField>

        <FormField label="Texte alternatif">
          <input
            className="w-full rounded-md border border-[var(--border)] px-3 py-2"
            name="alt_text"
            type="text"
          />
        </FormField>

        <FormField label="Crédit">
          <input
            className="w-full rounded-md border border-[var(--border)] px-3 py-2"
            name="credit"
            type="text"
          />
        </FormField>

        <label className="flex items-start gap-3 rounded-md border border-[var(--border)] p-4">
          <input className="mt-1" name="is_ai_generated" type="checkbox" />
          <span>
            <span className="block text-sm font-medium">
              Visuel généré par IA
            </span>
            <span className="mt-1 block text-xs leading-5 text-[var(--muted)]">
              Si cette case est cochée, la mention IA obligatoire doit rester
              renseignée.
            </span>
          </span>
        </label>

        <FormField
          helpText="Obligatoire si le média est un visuel généré par IA."
          label="Mention IA"
        >
          <textarea
            className="min-h-20 w-full rounded-md border border-[var(--border)] px-3 py-2"
            defaultValue={mandatoryAiVisualNotice}
            name="ai_visual_notice"
          />
        </FormField>

        <div className="flex justify-end">
          <button
            className="rounded-md bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white"
            type="submit"
          >
            Ajouter le média
          </button>
        </div>
      </form>
    </section>
  );
}
