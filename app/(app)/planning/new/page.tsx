import { getReadyChannelVariants } from "@/services/channel-variants/get-ready-channel-variants";
import { createScheduledPublicationAction } from "@/services/planning/create-scheduled-publication";
import { FormField } from "@/shared/ui/FormField";
import { PageTitle } from "@/shared/ui/PageTitle";

type NewPlanningPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

const errorMessages: Record<string, string> = {
  forbidden: "Votre rôle ne permet pas de planifier une publication.",
  invalid_date: "La date de publication est invalide.",
  invalid_status: "La déclinaison doit être validée avant planification.",
  missing_channel_variant: "La déclinaison est obligatoire.",
  missing_date: "La date de publication est obligatoire.",
};

export default async function NewPlanningPage({
  searchParams,
}: NewPlanningPageProps) {
  const [{ error }, readyVariants] = await Promise.all([
    searchParams,
    getReadyChannelVariants(),
  ]);
  const errorMessage = error ? errorMessages[error] : null;

  return (
    <section className="mx-auto max-w-3xl space-y-6">
      <PageTitle
        eyebrow="Planning"
        title="Planifier une publication"
        description="Choisissez une déclinaison validée et une date cible. Aucun connecteur n’est appelé au Sprint 7."
      />

      {errorMessage ? (
        <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {errorMessage}
        </p>
      ) : null}

      <form
        action={createScheduledPublicationAction}
        className="space-y-6 rounded-md border border-[var(--border)] bg-[var(--surface)] p-6"
      >
        <FormField
          helpText="Seules les déclinaisons au statut validé sont proposées."
          label="Déclinaison validée"
        >
          <select
            className="w-full rounded-md border border-[var(--border)] px-3 py-2"
            name="channel_variant_id"
            required
          >
            <option value="">Sélectionner</option>
            {readyVariants.map((variant) => (
              <option key={variant.id} value={variant.id}>
                {variant.title} — {variant.channel?.label ?? "Canal inconnu"}
              </option>
            ))}
          </select>
        </FormField>

        <FormField
          helpText="Date et heure prévues pour la publication future. La publication reste manuelle à ce stade."
          label="Date prévue"
        >
          <input
            className="w-full rounded-md border border-[var(--border)] px-3 py-2"
            name="scheduled_for"
            required
            type="datetime-local"
          />
        </FormField>

        <FormField
          helpText="Notes internes : contexte de publication, priorité, consigne pour le futur connecteur."
          label="Notes de publication"
        >
          <textarea
            className="min-h-28 w-full rounded-md border border-[var(--border)] px-3 py-2"
            name="publication_notes"
          />
        </FormField>

        <div className="rounded-md border border-[var(--border)] bg-[var(--background)] p-4">
          <p className="text-sm font-medium">Publication externe</p>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Le Sprint 7 prépare seulement le planning. WordPress et les réseaux
            seront traités dans les sprints connecteurs.
          </p>
        </div>

        <div className="flex justify-end border-t border-[var(--border)] pt-5">
          <button
            className="rounded-md bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-white"
            type="submit"
          >
            Planifier
          </button>
        </div>
      </form>
    </section>
  );
}
