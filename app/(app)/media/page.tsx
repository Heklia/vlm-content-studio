import Link from "next/link";
import { getMediaAssets } from "@/services/media/get-media-assets";
import { MediaList } from "@/app/(app)/media/MediaList";
import { MediaQuickDropzone } from "@/app/(app)/media/MediaQuickDropzone";
import { PageTitle } from "@/shared/ui/PageTitle";

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
      </div>

      {errorMessage ? (
        <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {errorMessage}
        </p>
      ) : null}

      <div className="grid items-stretch gap-4 lg:grid-cols-[1fr_220px]">
        <MediaQuickDropzone />
        <Link
          className="flex min-h-32 items-center justify-center rounded-md bg-[var(--accent)] px-4 py-2 text-center text-sm font-semibold text-white"
          href="/media/new"
        >
          Ajouter un média
        </Link>
      </div>

      <MediaList mediaAssets={mediaAssets} />
    </section>
  );
}
