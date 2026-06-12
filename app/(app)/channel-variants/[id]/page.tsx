import Link from "next/link";
import { notFound } from "next/navigation";
import {
  channelVariantStatusLabels,
} from "@/modules/channel-variants/domain/channel-variant";
import { generationModeLabels } from "@/modules/master-content/domain/master-content";
import { getChannelVariant } from "@/services/channel-variants/get-channel-variant";
import {
  invalidateChannelVariantAction,
  validateChannelVariantAction,
} from "@/services/channel-variants/manage-channel-variants";
import { createWordPressDraftFromVariantAction } from "@/services/connectors/wordpress-actions";
import { PageTitle } from "@/shared/ui/PageTitle";
import { StatusBadge } from "@/shared/ui/StatusBadge";
import { SubmitButton } from "@/shared/ui/SubmitButton";

type ChannelVariantDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    saved?: string;
    wordpress_draft?: string;
    wordpress_error?: string;
  }>;
};

const wordpressErrorMessages: Record<string, string> = {
  draft_failed: "La création du brouillon WordPress a échoué.",
  forbidden: "Votre rôle ne permet pas d’envoyer cette déclinaison vers WordPress.",
  invalid_status: "La déclinaison doit être validée ou planifiée avant l’envoi WordPress.",
  not_configured: "Le connecteur WordPress n’est pas encore configuré ou activé.",
  not_wordpress: "Cette déclinaison n’est pas associée au canal WordPress.",
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
  searchParams,
}: ChannelVariantDetailPageProps) {
  const [
    { id },
    {
      saved,
      wordpress_draft: wordpressDraft,
      wordpress_error: wordpressError,
    },
  ] = await Promise.all([params, searchParams]);
  const variant = await getChannelVariant(id);

  if (!variant) {
    notFound();
  }

  const canCreateWordPressDraft =
    variant.channel?.key === "wordpress" &&
    ["ready", "scheduled"].includes(variant.status);
  const wordpressErrorMessage = wordpressError
    ? wordpressErrorMessages[wordpressError]
    : null;

  return (
    <section className="space-y-6">
      <PageTitle
        eyebrow="Déclinaison"
        title={variant.title}
        description="Version multicanale préparée manuellement. Les connecteurs externes restent déclenchés manuellement."
      />

      {saved ? (
        <p className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          Déclinaison enregistrée.
        </p>
      ) : null}

      {wordpressDraft ? (
        <p className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          Brouillon WordPress créé avec l’ID {wordpressDraft}.
        </p>
      ) : null}

      {wordpressErrorMessage ? (
        <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {wordpressErrorMessage}
        </p>
      ) : null}

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

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-[var(--border)] bg-[var(--surface)] p-4">
        <div>
          <p className="text-sm font-medium">Actions après lecture</p>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Validez la déclinaison, renvoyez-la en brouillon ou modifiez son contenu.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <form action={validateChannelVariantAction}>
            <input name="channel_variant_id" type="hidden" value={variant.id} />
            <input name="redirect_to" type="hidden" value={`/channel-variants/${variant.id}`} />
            <SubmitButton
              className="rounded-md bg-emerald-700 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
              pendingLabel="Validation..."
            >
              Valider
            </SubmitButton>
          </form>
          <form action={invalidateChannelVariantAction}>
            <input name="channel_variant_id" type="hidden" value={variant.id} />
            <input name="redirect_to" type="hidden" value={`/channel-variants/${variant.id}`} />
            <SubmitButton
              className="rounded-md border border-[var(--border)] px-4 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-60"
              pendingLabel="Invalidation..."
            >
              Invalider
            </SubmitButton>
          </form>
          <Link
            className="rounded-md bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white"
            href={`/channel-variants/${variant.id}/edit`}
          >
            Modifier
          </Link>
        </div>
      </div>

      {variant.channel?.key === "wordpress" ? (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-[var(--border)] bg-[var(--surface)] p-4">
          <div>
            <p className="text-sm font-medium">Connecteur WordPress</p>
            <p className="mt-1 text-sm text-[var(--muted)]">
              Crée un brouillon WordPress depuis cette déclinaison. La
              publication reste manuelle dans WordPress.
            </p>
          </div>
          {canCreateWordPressDraft ? (
            <form action={createWordPressDraftFromVariantAction}>
              <input name="channel_variant_id" type="hidden" value={variant.id} />
              <SubmitButton
                className="rounded-md bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
                pendingLabel="Envoi..."
              >
                Créer un brouillon WordPress
              </SubmitButton>
            </form>
          ) : (
            <p className="text-sm text-[var(--muted)]">
              Disponible après validation ou planification.
            </p>
          )}
        </div>
      ) : null}
    </section>
  );
}
