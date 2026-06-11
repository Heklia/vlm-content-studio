import Link from "next/link";
import { channelVariantStatusLabels } from "@/modules/channel-variants/domain/channel-variant";
import { validationReviewStatusLabels } from "@/modules/validation/domain/validation-review";
import { getChannelVariants } from "@/services/channel-variants/get-channel-variants";
import { requireAuth } from "@/services/auth/require-auth";
import { requestValidationAction } from "@/services/validation/request-validation";
import { getValidationReviews } from "@/services/validation/get-validation-reviews";
import { FormField } from "@/shared/ui/FormField";
import { PageTitle } from "@/shared/ui/PageTitle";
import { StatusBadge } from "@/shared/ui/StatusBadge";

type ValidationPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

const errorMessages: Record<string, string> = {
  forbidden: "Votre rôle ne permet pas cette action.",
  missing_channel_variant: "La déclinaison est obligatoire.",
};

export default async function ValidationPage({
  searchParams,
}: ValidationPageProps) {
  const [{ error }, currentUser, reviews, channelVariants] = await Promise.all([
    searchParams,
    requireAuth(),
    getValidationReviews(),
    getChannelVariants(),
  ]);
  const profile = currentUser.profile;
  const canRequestValidation = profile?.role !== "viewer";
  const draftVariants = channelVariants.filter(
    (variant) => variant.status === "draft",
  );
  const errorMessage = error ? errorMessages[error] : null;

  return (
    <section className="space-y-6">
      <PageTitle
        eyebrow="Workflow"
        title="Validation"
        description="Demandes de relecture des déclinaisons multicanales. Le Sprint 7 ne publie aucun contenu."
      />

      {errorMessage ? (
        <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {errorMessage}
        </p>
      ) : null}

      {canRequestValidation ? (
        <form
          action={requestValidationAction}
          className="space-y-4 rounded-md border border-[var(--border)] bg-[var(--surface)] p-5"
        >
          <div>
            <h2 className="text-base font-semibold">Demander une relecture</h2>
            <p className="mt-1 text-sm text-[var(--muted)]">
              Sélectionnez une déclinaison encore en brouillon pour la passer au
              statut à relire.
            </p>
          </div>

          <FormField
            helpText="Seules les déclinaisons au statut brouillon sont proposées."
            label="Déclinaison"
          >
            <select
              className="w-full rounded-md border border-[var(--border)] px-3 py-2"
              name="channel_variant_id"
              required
            >
              <option value="">Sélectionner</option>
              {draftVariants.map((variant) => (
                <option key={variant.id} value={variant.id}>
                  {variant.title} — {variant.channel?.label ?? "Canal inconnu"}
                </option>
              ))}
            </select>
          </FormField>

          <FormField
            helpText="Note interne pour guider la relecture : point d’attention, objectif, doute éditorial."
            label="Note de demande"
          >
            <textarea
              className="min-h-20 w-full rounded-md border border-[var(--border)] px-3 py-2"
              name="request_note"
            />
          </FormField>

          <div className="flex justify-end">
            <button
              className="rounded-md bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white"
              type="submit"
            >
              Envoyer en validation
            </button>
          </div>
        </form>
      ) : null}

      <div className="overflow-hidden rounded-md border border-[var(--border)] bg-[var(--surface)]">
        <table className="w-full text-left text-sm">
          <thead className="bg-[var(--background)] text-[var(--muted)]">
            <tr>
              <th className="px-4 py-3 font-medium">Déclinaison</th>
              <th className="px-4 py-3 font-medium">Canal</th>
              <th className="px-4 py-3 font-medium">Statut validation</th>
              <th className="px-4 py-3 font-medium">Statut contenu</th>
              <th className="px-4 py-3 font-medium">Demandée le</th>
            </tr>
          </thead>
          <tbody>
            {reviews.length === 0 ? (
              <tr>
                <td className="px-4 py-8 text-center text-[var(--muted)]" colSpan={5}>
                  Aucune demande de validation pour le moment.
                </td>
              </tr>
            ) : (
              reviews.map((review) => (
                <tr className="border-t border-[var(--border)]" key={review.id}>
                  <td className="px-4 py-3">
                    <Link
                      className="font-medium hover:text-[var(--accent)]"
                      href={`/validation/${review.id}`}
                    >
                      {review.channelVariant?.title ?? "Déclinaison inconnue"}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-[var(--muted)]">
                    {review.channelVariant?.channel?.label ?? "Canal inconnu"}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge tone={review.status === "approved" ? "success" : "default"}>
                      {validationReviewStatusLabels[review.status]}
                    </StatusBadge>
                  </td>
                  <td className="px-4 py-3">
                    {review.channelVariant ? (
                      <StatusBadge>
                        {channelVariantStatusLabels[review.channelVariant.status]}
                      </StatusBadge>
                    ) : (
                      "Non renseigné"
                    )}
                  </td>
                  <td className="px-4 py-3 text-[var(--muted)]">
                    {new Intl.DateTimeFormat("fr-FR").format(
                      new Date(review.requestedAt),
                    )}
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
