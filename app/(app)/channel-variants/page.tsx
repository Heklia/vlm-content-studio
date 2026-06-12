import Link from "next/link";
import {
  channelVariantStatusLabels,
} from "@/modules/channel-variants/domain/channel-variant";
import { generationModeLabels } from "@/modules/master-content/domain/master-content";
import {
  deleteSelectedChannelVariantsAction,
  invalidateChannelVariantAction,
  validateChannelVariantAction,
} from "@/services/channel-variants/manage-channel-variants";
import { getChannelVariants } from "@/services/channel-variants/get-channel-variants";
import { ConfirmSubmitButton } from "@/shared/ui/ConfirmSubmitButton";
import { PageTitle } from "@/shared/ui/PageTitle";
import { StatusBadge } from "@/shared/ui/StatusBadge";
import { SubmitButton } from "@/shared/ui/SubmitButton";

type ChannelVariantsPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

const errorMessages: Record<string, string> = {
  forbidden: "Votre rôle ne permet pas cette action.",
  missing_variant: "La déclinaison est introuvable.",
  no_selection: "Sélectionnez au moins une déclinaison à supprimer.",
};

export default async function ChannelVariantsPage({
  searchParams,
}: ChannelVariantsPageProps) {
  const { error } = await searchParams;
  const channelVariants = await getChannelVariants();
  const errorMessage = error ? errorMessages[error] : null;

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <PageTitle
          eyebrow="Multicanal"
          title="Déclinaisons"
          description="Versions préparées manuellement pour WordPress, LinkedIn, Pinterest et Google Business."
        />
        <Link
          className="rounded-md bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white"
          href="/channel-variants/new"
        >
          Créer une déclinaison
        </Link>
      </div>

      {errorMessage ? (
        <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {errorMessage}
        </p>
      ) : null}

      <form action={deleteSelectedChannelVariantsAction} id="delete-channel-variants-form">
        <ConfirmSubmitButton
          className="rounded-md border border-red-200 px-4 py-2 text-sm font-semibold text-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          confirmMessage="Supprimer les déclinaisons cochées ?"
          pendingLabel="Suppression..."
        >
          Supprimer les déclinaisons cochées
        </ConfirmSubmitButton>
      </form>

      <div className="overflow-x-auto rounded-md border border-[var(--border)] bg-[var(--surface)]">
        <table className="w-full text-left text-sm">
          <thead className="bg-[var(--background)] text-[var(--muted)]">
            <tr>
              <th className="px-4 py-3 font-medium">Sélection</th>
              <th className="px-4 py-3 font-medium">Titre</th>
              <th className="px-4 py-3 font-medium">Canal</th>
              <th className="px-4 py-3 font-medium">Contenu maître</th>
              <th className="px-4 py-3 font-medium">Statut</th>
              <th className="px-4 py-3 font-medium">Mode</th>
              <th className="px-4 py-3 font-medium">Créée le</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {channelVariants.length === 0 ? (
              <tr>
                <td className="px-4 py-8 text-center text-[var(--muted)]" colSpan={8}>
                  Aucune déclinaison pour le moment.
                </td>
              </tr>
            ) : (
              channelVariants.map((variant) => (
                <tr className="border-t border-[var(--border)]" key={variant.id}>
                  <td className="px-4 py-3">
                    <input
                      aria-label={`Sélectionner ${variant.title}`}
                      form="delete-channel-variants-form"
                      name="channel_variant_ids"
                      type="checkbox"
                      value={variant.id}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      className="font-medium hover:text-[var(--accent)]"
                      href={`/channel-variants/${variant.id}`}
                    >
                      {variant.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-[var(--muted)]">
                    {variant.channel?.label ?? "Canal inconnu"}
                  </td>
                  <td className="px-4 py-3 text-[var(--muted)]">
                    {variant.masterContent?.title ?? "Non lié"}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge tone={variant.status === "ready" ? "success" : "default"}>
                      {channelVariantStatusLabels[variant.status]}
                    </StatusBadge>
                  </td>
                  <td className="px-4 py-3 text-[var(--muted)]">
                    {generationModeLabels[variant.generationMode]}
                  </td>
                  <td className="px-4 py-3 text-[var(--muted)]">
                    {new Intl.DateTimeFormat("fr-FR").format(
                      new Date(variant.createdAt),
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <form action={validateChannelVariantAction}>
                        <input name="channel_variant_id" type="hidden" value={variant.id} />
                        <input name="redirect_to" type="hidden" value="/channel-variants" />
                        <SubmitButton
                          className="rounded-md border border-emerald-200 px-3 py-1.5 text-xs font-semibold text-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                          pendingLabel="..."
                        >
                          Valider
                        </SubmitButton>
                      </form>
                      <form action={invalidateChannelVariantAction}>
                        <input name="channel_variant_id" type="hidden" value={variant.id} />
                        <input name="redirect_to" type="hidden" value="/channel-variants" />
                        <SubmitButton
                          className="rounded-md border border-[var(--border)] px-3 py-1.5 text-xs font-semibold disabled:cursor-not-allowed disabled:opacity-60"
                          pendingLabel="..."
                        >
                          Invalider
                        </SubmitButton>
                      </form>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
