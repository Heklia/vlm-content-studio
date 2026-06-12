import { createChannelVariantAction } from "@/services/channel-variants/create-channel-variant";
import { getChannels } from "@/services/referentials/get-channels";
import { getWordPressCategories } from "@/services/referentials/get-wordpress-categories";
import { getMasterContents } from "@/services/master-content/get-master-contents";
import { FormField } from "@/shared/ui/FormField";
import { FormUnloadGuard } from "@/shared/ui/FormUnloadGuard";
import { PageTitle } from "@/shared/ui/PageTitle";
import { SubmitButton } from "@/shared/ui/SubmitButton";

type NewChannelVariantPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

const errorMessages: Record<string, string> = {
  forbidden: "Votre rôle ne permet pas de créer une déclinaison.",
  missing_channel: "Le canal est obligatoire.",
  missing_master_content: "Le contenu maître est obligatoire.",
  missing_profile: "Votre profil applicatif est introuvable.",
  missing_title: "Le titre est obligatoire.",
};

const v1ChannelKeys = new Set([
  "wordpress",
  "linkedin",
  "pinterest",
  "google_business",
]);

export default async function NewChannelVariantPage({
  searchParams,
}: NewChannelVariantPageProps) {
  const { error } = await searchParams;
  const [channels, masterContents, wordpressCategories] = await Promise.all([
    getChannels(),
    getMasterContents(),
    getWordPressCategories(),
  ]);
  const availableChannels = channels.filter(
    (channel) => channel.status === "enabled" && v1ChannelKeys.has(channel.key),
  );
  const errorMessage = error ? errorMessages[error] : null;

  return (
    <section className="mx-auto max-w-4xl space-y-6">
      <PageTitle
        eyebrow="Déclinaisons"
        title="Créer une déclinaison"
        description="Préparez manuellement une version adaptée à un canal V1. Aucun connecteur externe et aucun fournisseur IA ne sont appelés au Sprint 6."
      />

      {errorMessage ? (
        <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {errorMessage}
        </p>
      ) : null}

      <form
        action={createChannelVariantAction}
        className="space-y-6 rounded-md border border-[var(--border)] bg-[var(--surface)] p-6"
      >
        <FormUnloadGuard draftKey="vlm-content-studio:channel-variants:new" />
        <div className="grid gap-5 md:grid-cols-2">
          <FormField
            helpText="Contenu central à adapter. Il garde le fond éditorial commun aux différents canaux."
            label="Contenu maître"
          >
            <select
              className="w-full rounded-md border border-[var(--border)] px-3 py-2"
              name="master_content_id"
              required
            >
              <option value="">Sélectionner</option>
              {masterContents.map((content) => (
                <option key={content.id} value={content.id}>
                  {content.title}
                </option>
              ))}
            </select>
          </FormField>

          <FormField
            helpText="Canal de destination V1. Les canaux futurs restent cachés tant qu’ils ne sont pas actifs."
            label="Canal"
          >
            <select
              className="w-full rounded-md border border-[var(--border)] px-3 py-2"
              name="channel_id"
              required
            >
              <option value="">Sélectionner</option>
              {availableChannels.map((channel) => (
                <option key={channel.id} value={channel.id}>
                  {channel.label}
                </option>
              ))}
            </select>
          </FormField>
        </div>

        <FormField
          helpText="Titre de travail de la déclinaison. Il peut reprendre le contenu maître ou être adapté au canal choisi."
          label="Titre"
        >
          <input
            className="w-full rounded-md border border-[var(--border)] px-3 py-2"
            name="title"
            required
            type="text"
          />
        </FormField>

        <FormField
          helpText="Résumé court utile pour un extrait WordPress, une introduction LinkedIn ou un aperçu de publication."
          label="Extrait"
        >
          <textarea
            className="min-h-24 w-full rounded-md border border-[var(--border)] px-3 py-2"
            name="excerpt"
          />
        </FormField>

        <FormField
          helpText="Texte principal adapté au canal. Le style doit rester professionnel, industriel, premium et précis."
          label="Corps de la déclinaison"
        >
          <textarea
            className="min-h-56 w-full rounded-md border border-[var(--border)] px-3 py-2"
            name="body"
          />
        </FormField>

        <div className="grid gap-5 md:grid-cols-2">
          <FormField
            helpText="Un hashtag par ligne ou séparé par une virgule. Le signe # sera ajouté automatiquement si besoin."
            label="Hashtags"
          >
            <textarea
              className="min-h-28 w-full rounded-md border border-[var(--border)] px-3 py-2"
              name="hashtags"
            />
          </FormField>

          <FormField
            helpText="Action proposée au lecteur : demander un devis, contacter l’atelier, découvrir une réalisation, etc."
            label="Appel à l’action"
          >
            <textarea
              className="min-h-28 w-full rounded-md border border-[var(--border)] px-3 py-2"
              name="call_to_action"
            />
          </FormField>
        </div>

        <div className="rounded-md border border-[var(--border)] bg-[var(--background)] p-4">
          <p className="text-sm font-medium">Champs spécifiques par canal</p>
          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
            Ces champs préparent WordPress, Pinterest et Google Business. Ils
            restent optionnels au Sprint 6 et ne déclenchent aucune publication.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <FormField
            helpText="Catégorie cible si la déclinaison doit devenir un article WordPress."
            label="Catégorie WordPress"
          >
            <select
              className="w-full rounded-md border border-[var(--border)] px-3 py-2"
              name="wordpress_category_id"
            >
              <option value="">Non renseignée</option>
              {wordpressCategories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.label}
                </option>
              ))}
            </select>
          </FormField>

          <FormField
            helpText="Type de publication Google Business envisagé, par exemple actualité, offre ou événement."
            label="Type Google Business"
          >
            <input
              className="w-full rounded-md border border-[var(--border)] px-3 py-2"
              name="google_business_post_type"
              type="text"
            />
          </FormField>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <FormField
            helpText="Titre SEO préparatoire pour WordPress. Il pourra être repris par le futur connecteur."
            label="Titre SEO"
          >
            <input
              className="w-full rounded-md border border-[var(--border)] px-3 py-2"
              name="seo_title"
              type="text"
            />
          </FormField>

          <FormField
            helpText="Description SEO préparatoire pour WordPress, courte et orientée recherche."
            label="Description SEO"
          >
            <textarea
              className="min-h-24 w-full rounded-md border border-[var(--border)] px-3 py-2"
              name="seo_description"
            />
          </FormField>
        </div>

        <FormField
          helpText="Tableau ou thématique Pinterest envisagé pour classer la publication plus tard."
          label="Tableau Pinterest"
        >
          <input
            className="w-full rounded-md border border-[var(--border)] px-3 py-2"
            name="pinterest_board"
            type="text"
          />
        </FormField>

        <div className="rounded-md border border-[var(--border)] bg-[var(--background)] p-4">
          <p className="text-sm font-medium">Mode de génération</p>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Sprint 6 utilise uniquement le mode manuel. Les champs de traçabilité
            IA existent en base pour les sprints suivants, mais aucun modèle n’est appelé.
          </p>
        </div>

        <div className="flex justify-end border-t border-[var(--border)] pt-5">
          <SubmitButton
            className="rounded-md bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
            pendingLabel="Création en cours..."
          >
            Créer la déclinaison
          </SubmitButton>
        </div>
      </form>
    </section>
  );
}
