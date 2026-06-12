import Link from "next/link";
import { notFound } from "next/navigation";
import {
  sourceSheetStatusLabels,
} from "@/modules/source-sheets/domain/source-sheet";
import { deleteSourceSheetAction } from "@/services/source-sheets/manage-source-sheet";
import { getSourceSheet } from "@/services/source-sheets/get-source-sheet";
import { ConfirmSubmitButton } from "@/shared/ui/ConfirmSubmitButton";
import { PageTitle } from "@/shared/ui/PageTitle";
import { StatusBadge } from "@/shared/ui/StatusBadge";

type SourceSheetDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    error?: string;
    saved?: string;
  }>;
};

const errorMessages: Record<string, string> = {
  forbidden: "Votre rôle ne permet pas de supprimer cette fiche source.",
  missing_source_sheet: "La fiche source est introuvable.",
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
  searchParams,
}: SourceSheetDetailPageProps) {
  const [{ id }, { error, saved }] = await Promise.all([params, searchParams]);
  const sourceSheet = await getSourceSheet(id);

  if (!sourceSheet) {
    notFound();
  }

  const errorMessage = error ? errorMessages[error] : null;

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <PageTitle
          eyebrow="Fiche source"
          title={sourceSheet.title}
          description="Lecture détaillée de la matière éditoriale. La génération de contenu sera ajoutée dans un sprint ultérieur."
        />
        <Link
          className="rounded-md bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white"
          href={`/source-sheets/${sourceSheet.id}/edit`}
        >
          Modifier
        </Link>
      </div>

      {errorMessage ? (
        <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {errorMessage}
        </p>
      ) : null}

      {saved ? (
        <p className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          Fiche source enregistrée.
        </p>
      ) : null}

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

      <form
        action={deleteSourceSheetAction}
        className="rounded-md border border-red-200 bg-red-50 p-5"
      >
        <input name="source_sheet_id" type="hidden" value={sourceSheet.id} />
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-red-900">
              Supprimer cette fiche source
            </p>
            <p className="mt-1 text-sm text-red-800">
              Cette action supprime la fiche source et ses associations aux
              canaux et aux médias.
            </p>
          </div>
          <ConfirmSubmitButton
            className="rounded-md bg-red-700 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
            confirmMessage="Supprimer cette fiche source ?"
            pendingLabel="Suppression..."
          >
            Supprimer
          </ConfirmSubmitButton>
        </div>
      </form>
    </section>
  );
}
