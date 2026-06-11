import { notFound } from "next/navigation";
import {
  generationModeLabels,
  masterContentStatusLabels,
} from "@/modules/master-content/domain/master-content";
import { getMasterContent } from "@/services/master-content/get-master-content";
import { PageTitle } from "@/shared/ui/PageTitle";
import { StatusBadge } from "@/shared/ui/StatusBadge";

type MasterContentDetailPageProps = {
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

export default async function MasterContentDetailPage({
  params,
}: MasterContentDetailPageProps) {
  const { id } = await params;
  const masterContent = await getMasterContent(id);

  if (!masterContent) {
    notFound();
  }

  const keyPoints = Array.isArray(masterContent.keyPoints)
    ? masterContent.keyPoints
    : [];

  return (
    <section className="space-y-6">
      <PageTitle
        eyebrow="Contenu maître"
        title={masterContent.title}
        description="Contenu central manuel. Les déclinaisons multicanales seront ajoutées dans un sprint ultérieur."
      />

      <div className="flex flex-wrap gap-3">
        <StatusBadge tone={masterContent.status === "ready" ? "success" : "default"}>
          {masterContentStatusLabels[masterContent.status]}
        </StatusBadge>
        <StatusBadge>{generationModeLabels[masterContent.generationMode]}</StatusBadge>
        <StatusBadge>
          {masterContent.sourceSheet?.title ?? "Fiche source non liée"}
        </StatusBadge>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <DetailBlock label="Angle" value={masterContent.angle} />
        <DetailBlock label="Accroche" value={masterContent.hook} />
      </div>

      <DetailBlock label="Corps du contenu" value={masterContent.body} />

      <div className="rounded-md border border-[var(--border)] bg-[var(--surface)] p-4">
        <p className="text-sm font-medium">Points clés</p>
        {keyPoints.length === 0 ? (
          <p className="mt-2 text-sm text-[var(--muted)]">Non renseigné</p>
        ) : (
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-[var(--muted)]">
            {keyPoints.map((point, index) => (
              <li key={`${point}-${index}`}>{String(point)}</li>
            ))}
          </ul>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <DetailBlock label="Appel à l’action" value={masterContent.callToAction} />
        <DetailBlock label="Notes éditoriales" value={masterContent.editorialNotes} />
      </div>

      <div className="rounded-md border border-[var(--border)] bg-[var(--surface)] p-4">
        <p className="text-sm font-medium">Traçabilité IA</p>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Aucun appel IA au Sprint 5. Fournisseur :{" "}
          {masterContent.aiProviderKey ?? "non renseigné"} · Modèle :{" "}
          {masterContent.aiModelKey ?? "non renseigné"}
        </p>
      </div>
    </section>
  );
}

