import { createMasterContentAction } from "@/services/master-content/create-master-content";
import { getSourceSheets } from "@/services/source-sheets/get-source-sheets";
import { FormField } from "@/shared/ui/FormField";
import { FormUnloadGuard } from "@/shared/ui/FormUnloadGuard";
import { PageTitle } from "@/shared/ui/PageTitle";
import { SubmitButton } from "@/shared/ui/SubmitButton";

type NewMasterContentPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

const errorMessages: Record<string, string> = {
  forbidden: "Votre rôle ne permet pas de créer un contenu maître.",
  missing_profile: "Votre profil applicatif est introuvable.",
  missing_title: "Le titre est obligatoire.",
};

export default async function NewMasterContentPage({
  searchParams,
}: NewMasterContentPageProps) {
  const { error } = await searchParams;
  const sourceSheets = await getSourceSheets();
  const errorMessage = error ? errorMessages[error] : null;

  return (
    <section className="mx-auto max-w-4xl space-y-6">
      <PageTitle
        eyebrow="Contenu maître"
        title="Créer un contenu maître"
        description="Rédigez manuellement le contenu central qui servira plus tard aux déclinaisons multicanales."
      />

      {errorMessage ? (
        <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {errorMessage}
        </p>
      ) : null}

      <form
        action={createMasterContentAction}
        className="space-y-6 rounded-md border border-[var(--border)] bg-[var(--surface)] p-6"
      >
        <FormUnloadGuard draftKey="vlm-content-studio:master-content:new" />
        <FormField
          helpText="Fiche source utilisée comme matière éditoriale. Le contenu maître reste manuel au Sprint 5."
          label="Fiche source"
        >
          <select
            className="w-full rounded-md border border-[var(--border)] px-3 py-2"
            name="source_sheet_id"
          >
            <option value="">Non liée</option>
            {sourceSheets.map((sourceSheet) => (
              <option key={sourceSheet.id} value={sourceSheet.id}>
                {sourceSheet.title}
              </option>
            ))}
          </select>
        </FormField>

        <FormField helpText="Titre de travail du contenu maître." label="Titre">
          <input
            className="w-full rounded-md border border-[var(--border)] px-3 py-2"
            name="title"
            required
            type="text"
          />
        </FormField>

        <FormField
          helpText="Angle éditorial principal : savoir-faire, matériau, réalisation, conseil, étude de projet."
          label="Angle"
        >
          <input
            className="w-full rounded-md border border-[var(--border)] px-3 py-2"
            name="angle"
            type="text"
          />
        </FormField>

        <FormField
          helpText="Accroche ou début fort du contenu."
          label="Accroche"
        >
          <textarea
            className="min-h-20 w-full rounded-md border border-[var(--border)] px-3 py-2"
            name="hook"
          />
        </FormField>

        <FormField
          helpText="Texte principal, encore indépendant des formats WordPress ou réseaux sociaux."
          label="Corps du contenu"
        >
          <textarea
            className="min-h-48 w-full rounded-md border border-[var(--border)] px-3 py-2"
            name="body"
          />
        </FormField>

        <FormField
          helpText="Un point par ligne. Ces points guideront les futures déclinaisons."
          label="Points clés"
        >
          <textarea
            className="min-h-28 w-full rounded-md border border-[var(--border)] px-3 py-2"
            name="key_points"
          />
        </FormField>

        <FormField
          helpText="Action attendue : demander un devis, découvrir un matériau, contacter l’atelier, etc."
          label="Appel à l’action"
        >
          <input
            className="w-full rounded-md border border-[var(--border)] px-3 py-2"
            name="call_to_action"
            type="text"
          />
        </FormField>

        <FormField
          helpText="Notes internes pour la relecture ou les futures déclinaisons."
          label="Notes éditoriales"
        >
          <textarea
            className="min-h-24 w-full rounded-md border border-[var(--border)] px-3 py-2"
            name="editorial_notes"
          />
        </FormField>

        <div className="rounded-md border border-[var(--border)] bg-[var(--background)] p-4">
          <p className="text-sm font-medium">Mode de génération</p>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Sprint 5 utilise uniquement le mode manuel. Les champs de traçabilité IA
            sont préparés en base, mais aucun fournisseur IA n’est appelé.
          </p>
        </div>

        <div className="flex justify-end border-t border-[var(--border)] pt-5">
          <SubmitButton
            className="rounded-md bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
            pendingLabel="Création en cours..."
          >
            Créer le contenu maître
          </SubmitButton>
        </div>
      </form>
    </section>
  );
}
