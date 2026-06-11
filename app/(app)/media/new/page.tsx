import { mandatoryAiVisualNotice } from "@/modules/media/domain/media-asset";
import { PageTitle } from "@/shared/ui/PageTitle";
import { MediaUploadForm } from "@/app/(app)/media/new/MediaUploadForm";

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
        title="Importer des médias"
        description="Les fichiers seront stockés dans le bucket privé Supabase Storage `media-assets`. Les informations saisies servent à retrouver, comprendre et préparer les médias pour les futurs contenus."
      />

      {errorMessage ? (
        <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {errorMessage}
        </p>
      ) : null}

      <div className="rounded-md border border-[var(--border)] bg-[var(--surface)] p-5">
        <p className="text-sm font-medium">Rappel mention IA</p>
        <p className="mt-2 text-sm text-[var(--muted)]">
          {mandatoryAiVisualNotice}
        </p>
      </div>

      <MediaUploadForm />
    </section>
  );
}
