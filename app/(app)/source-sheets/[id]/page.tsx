import { notFound } from "next/navigation";
import {
  sourceSheetStatusLabels,
} from "@/modules/source-sheets/domain/source-sheet";
import { getSourceSheet } from "@/services/source-sheets/get-source-sheet";
import { PageTitle } from "@/shared/ui/PageTitle";
import { StatusBadge } from "@/shared/ui/StatusBadge";

type SourceSheetDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

function DetailBlock({
  label,
  value,
}: {
  label: string;
  value: string | null;
}) {
  return (
    <div className="rounded-md border border-[var(--border)] bg-[var(--surface)] p-4">
      <p className="text-sm font-medium">{label}</p>
      <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-[var(--muted)]">
        {value ?? "Non renseigné"}
      </p>
    </div>
  );
}

export default async function SourceSheetDetailPage({
  params,
}: SourceSheetDetailPageProps) {
  const { id } = await params;
  const sourceSheet = await getSourceSheet(id);

  if (!sourceSheet) {
    notFound();
  }

  return (
    <section className="space-y-6">
      <PageTitle
        eyebrow="Fiche source"
        title={sourceSheet.title}
        description="Lecture détaillée de la matière éditoriale. La génération de contenu sera ajoutée dans un sprint ultérieur."
      />

      <div className="flex flex-wrap gap-3">
        <StatusBadge tone={sourceSheet.status === "ready" ? "success" : "default"}>
          {sourceSheetStatusLabels[sourceSheet.status]}
        </StatusBadge>
        <StatusBadge>{sourceSheet.contentPillar?.label ?? "Pilier non défini"}</StatusBadge>
        <StatusBadge>
          {sourceSheet.wordpressCategory?.label ?? "Catégorie WP non définie"}
        </StatusBadge>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <DetailBlock label="Résumé" value={sourceSheet.summary} />
        <DetailBlock label="Contexte" value={sourceSheet.context} />
        <DetailBlock label="Détails techniques" value={sourceSheet.technicalDetails} />
        <DetailBlock label="Matériaux" value={sourceSheet.materials} />
        <DetailBlock label="Savoir-faire" value={sourceSheet.knowHow} />
        <DetailBlock label="Client ou secteur" value={sourceSheet.clientOrSector} />
        <DetailBlock label="Lieu" value={sourceSheet.location} />
      </div>

      <div className="rounded-md border border-[var(--border)] bg-[var(--surface)] p-5">
        <h2 className="text-lg font-semibold">Canaux cibles</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {sourceSheet.channels.length === 0 ? (
            <p className="text-sm text-[var(--muted)]">Aucun canal sélectionné.</p>
          ) : (
            sourceSheet.channels.map((channel) => (
              <StatusBadge key={channel.id}>{channel.label}</StatusBadge>
            ))
          )}
        </div>
      </div>

      <div className="rounded-md border border-[var(--border)] bg-[var(--surface)] p-5">
        <h2 className="text-lg font-semibold">Médias associés</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {sourceSheet.mediaAssets.length === 0 ? (
            <p className="text-sm text-[var(--muted)]">Aucun média associé.</p>
          ) : (
            sourceSheet.mediaAssets.map((mediaAsset) => (
              <article
                className="rounded-md border border-[var(--border)] p-4"
                key={mediaAsset.id}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium">
                      {mediaAsset.title ?? mediaAsset.fileName}
                    </p>
                    <p className="mt-1 text-xs text-[var(--muted)]">
                      {mediaAsset.fileType} · {mediaAsset.fileName}
                    </p>
                  </div>
                  {mediaAsset.relationIsPrimary ? (
                    <StatusBadge tone="success">Principal</StatusBadge>
                  ) : null}
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </section>
  );
}

