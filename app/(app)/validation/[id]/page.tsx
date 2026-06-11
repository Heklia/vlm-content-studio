import Link from "next/link";
import { notFound } from "next/navigation";
import { channelVariantStatusLabels } from "@/modules/channel-variants/domain/channel-variant";
import { validationReviewStatusLabels } from "@/modules/validation/domain/validation-review";
import { requireAuth } from "@/services/auth/require-auth";
import { approveValidationAction } from "@/services/validation/approve-validation";
import { getValidationReview } from "@/services/validation/get-validation-review";
import { requestChangesAction } from "@/services/validation/request-changes";
import { FormField } from "@/shared/ui/FormField";
import { PageTitle } from "@/shared/ui/PageTitle";
import { StatusBadge } from "@/shared/ui/StatusBadge";

type ValidationDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    error?: string;
  }>;
};

const errorMessages: Record<string, string> = {
  forbidden: "Votre rôle ne permet pas cette action.",
  invalid_status: "Cette demande n’est plus en attente.",
  missing_review: "La demande de validation est introuvable.",
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

export default async function ValidationDetailPage({
  params,
  searchParams,
}: ValidationDetailPageProps) {
  const [{ id }, { error }, currentUser] = await Promise.all([
    params,
    searchParams,
    requireAuth(),
  ]);
  const review = await getValidationReview(id);

  if (!review) {
    notFound();
  }

  const canReview =
    currentUser.profile?.role === "administrator" ||
    currentUser.profile?.role === "validator";
  const errorMessage = error ? errorMessages[error] : null;

  return (
    <section className="space-y-6">
      <PageTitle
        eyebrow="Validation"
        title={review.channelVariant?.title ?? "Demande de validation"}
        description="Relecture éditoriale d’une déclinaison multicanale. Aucune publication n’est déclenchée."
      />

      {errorMessage ? (
        <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {errorMessage}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <StatusBadge tone={review.status === "approved" ? "success" : "default"}>
          {validationReviewStatusLabels[review.status]}
        </StatusBadge>
        {review.channelVariant ? (
          <StatusBadge>
            {channelVariantStatusLabels[review.channelVariant.status]}
          </StatusBadge>
        ) : null}
        <StatusBadge>{review.channelVariant?.channel?.label ?? "Canal inconnu"}</StatusBadge>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <DetailBlock
          label="Contenu maître"
          value={review.channelVariant?.masterContent?.title ?? null}
        />
        <DetailBlock
          label="Demandée par"
          value={
            review.requestedByProfile?.displayName ??
            review.requestedByProfile?.email ??
            null
          }
        />
      </div>

      <DetailBlock label="Note de demande" value={review.requestNote} />
      <DetailBlock label="Extrait" value={review.channelVariant?.excerpt ?? null} />
      <DetailBlock label="Corps de la déclinaison" value={review.channelVariant?.body ?? null} />
      <DetailBlock label="Note de relecture" value={review.reviewNote} />

      {review.channelVariant ? (
        <Link
          className="inline-flex rounded-md border border-[var(--border)] px-4 py-2 text-sm font-medium hover:border-[var(--accent)]"
          href={`/channel-variants/${review.channelVariant.id}`}
        >
          Voir la déclinaison complète
        </Link>
      ) : null}

      {canReview && review.status === "pending" ? (
        <div className="grid gap-5 md:grid-cols-2">
          <form
            action={approveValidationAction}
            className="space-y-4 rounded-md border border-emerald-200 bg-emerald-50 p-5"
          >
            <input name="review_id" type="hidden" value={review.id} />
            <FormField
              helpText="Note optionnelle conservée dans la demande et dans le journal de workflow."
              label="Note de validation"
            >
              <textarea
                className="min-h-24 w-full rounded-md border border-emerald-200 px-3 py-2"
                name="review_note"
              />
            </FormField>
            <button
              className="rounded-md bg-emerald-700 px-4 py-2 text-sm font-semibold text-white"
              type="submit"
            >
              Valider
            </button>
          </form>

          <form
            action={requestChangesAction}
            className="space-y-4 rounded-md border border-[var(--border)] bg-[var(--surface)] p-5"
          >
            <input name="review_id" type="hidden" value={review.id} />
            <FormField
              helpText="Expliquez précisément les corrections attendues avant une nouvelle demande."
              label="Corrections demandées"
            >
              <textarea
                className="min-h-24 w-full rounded-md border border-[var(--border)] px-3 py-2"
                name="review_note"
              />
            </FormField>
            <button
              className="rounded-md border border-[var(--border)] px-4 py-2 text-sm font-semibold"
              type="submit"
            >
              Demander corrections
            </button>
          </form>
        </div>
      ) : null}
    </section>
  );
}
