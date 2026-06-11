import { notFound } from "next/navigation";
import {
  channelVariantStatusLabels,
} from "@/modules/channel-variants/domain/channel-variant";
import { generationModeLabels } from "@/modules/master-content/domain/master-content";
import { getChannelVariant } from "@/services/channel-variants/get-channel-variant";
import { PageTitle } from "@/shared/ui/PageTitle";
import { StatusBadge } from "@/shared/ui/StatusBadge";

type ChannelVariantDetailPageProps = {
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

export default async function ChannelVariantDetailPage({
  params,
}: ChannelVariantDetailPageProps) {
  const { id } = await params;
  const variant = await getChannelVariant(id);

  if (!variant) {
    notFound();
  }

  return (
    <section className="space-y-6">
      <PageTitle
        eyebrow="Déclinaison"
        title={variant.title}
        description="Version multicanale préparée manuellement. Elle n’est pas publiée et aucun connecteur externe n’est appelé."
      />

      <div className="flex flex-wrap gap-3">
        <StatusBadge tone={variant.status === "ready" ? "success" : "default"}>
          {channelVariantStatusLabels[variant.status]}
        </StatusBadge>
        <StatusBadge>{generationModeLabels[variant.generationMode]}</StatusBadge>
        <StatusBadge>{variant.channel?.label ?? "Canal inconnu"}</StatusBadge>
        <StatusBadge>
          {variant.masterContent?.title ?? "Contenu maître non lié"}
        </StatusBadge>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <DetailBlock label="Extrait" value={variant.excerpt} />
        <DetailBlock label="Appel à l’action" value={variant.callToAction} />
      </div>

      <DetailBlock label="Corps de la déclinaison" value={variant.body} />

      <div className="rounded-md border border-[var(--border)] bg-[var(--surface)] p-4">
        <p className="text-sm font-medium">Hashtags</p>
        {variant.hashtags.length === 0 ? (
          <p className="mt-2 text-sm text-[var(--muted)]">Non renseigné</p>
        ) : (
          <div className="mt-3 flex flex-wrap gap-2">
            {variant.hashtags.map((hashtag) => (
              <span
                className="rounded-full bg-[var(--background)] px-3 py-1 text-xs text-[var(--muted)]"
                key={hashtag}
              >
                {hashtag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <DetailBlock
          label="Catégorie WordPress"
          value={variant.wordpressCategory?.label ?? null}
        />
        <DetailBlock label="Tableau Pinterest" value={variant.pinterestBoard} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <DetailBlock label="Titre SEO" value={variant.seoTitle} />
        <DetailBlock label="Description SEO" value={variant.seoDescription} />
      </div>

      <DetailBlock
        label="Type Google Business"
        value={variant.googleBusinessPostType}
      />

      <div className="rounded-md border border-[var(--border)] bg-[var(--surface)] p-4">
        <p className="text-sm font-medium">Traçabilité IA</p>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Aucun appel IA au Sprint 6. Fournisseur :{" "}
          {variant.aiProviderKey ?? "non renseigné"} · Modèle :{" "}
          {variant.aiModelKey ?? "non renseigné"}
        </p>
      </div>
    </section>
  );
}
