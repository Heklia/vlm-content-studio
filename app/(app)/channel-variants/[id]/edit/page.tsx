import Link from "next/link";
import { notFound } from "next/navigation";
import { getChannelVariant } from "@/services/channel-variants/get-channel-variant";
import { updateChannelVariantAction } from "@/services/channel-variants/manage-channel-variants";
import { getWordPressCategories } from "@/services/referentials/get-wordpress-categories";
import { FormField } from "@/shared/ui/FormField";
import { FormUnloadGuard } from "@/shared/ui/FormUnloadGuard";
import { PageTitle } from "@/shared/ui/PageTitle";
import { SubmitButton } from "@/shared/ui/SubmitButton";

type EditChannelVariantPageProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    error?: string;
  }>;
};

const errorMessages: Record<string, string> = {
  forbidden: "Votre rôle ne permet pas de modifier cette déclinaison.",
  missing_title: "Le titre est obligatoire.",
};

export default async function EditChannelVariantPage({
  params,
  searchParams,
}: EditChannelVariantPageProps) {
  const [{ id }, { error }, wordpressCategories] = await Promise.all([
    params,
    searchParams,
    getWordPressCategories(),
  ]);
  const variant = await getChannelVariant(id);

  if (!variant) {
    notFound();
  }

  const errorMessage = error ? errorMessages[error] : null;

  return (
    <section className="mx-auto max-w-4xl space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <PageTitle
          eyebrow="Déclinaison"
          title={`Modifier ${variant.title}`}
          description="Ajustez la version multicanale après lecture. Aucun connecteur externe n’est appelé."
        />
        <Link
          className="rounded-md border border-[var(--border)] px-4 py-2 text-sm font-semibold"
          href={`/channel-variants/${variant.id}`}
        >
          Retour à la lecture
        </Link>
      </div>

      {errorMessage ? (
        <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {errorMessage}
        </p>
      ) : null}

      <form
        action={updateChannelVariantAction}
        className="space-y-6 rounded-md border border-[var(--border)] bg-[var(--surface)] p-6"
      >
        <FormUnloadGuard draftKey={`vlm-content-studio:channel-variant:${variant.id}`} />
        <input name="channel_variant_id" type="hidden" value={variant.id} />

        <div className="rounded-md border border-[var(--border)] bg-[var(--background)] p-4 text-sm text-[var(--muted)]">
          Canal : {variant.channel?.label ?? "Canal inconnu"} · Contenu maître :{" "}
          {variant.masterContent?.title ?? "Non lié"}
        </div>

        <FormField
          helpText="Titre de travail de la déclinaison."
          label="Titre"
        >
          <input
            className="w-full rounded-md border border-[var(--border)] px-3 py-2"
            defaultValue={variant.title}
            name="title"
            required
            type="text"
          />
        </FormField>

        <FormField
          helpText="Résumé court utile pour un extrait ou une introduction."
          label="Extrait"
        >
          <textarea
            className="min-h-24 w-full rounded-md border border-[var(--border)] px-3 py-2"
            defaultValue={variant.excerpt ?? ""}
            name="excerpt"
          />
        </FormField>

        <FormField
          helpText="Texte principal adapté au canal."
          label="Corps de la déclinaison"
        >
          <textarea
            className="min-h-56 w-full rounded-md border border-[var(--border)] px-3 py-2"
            defaultValue={variant.body ?? ""}
            name="body"
          />
        </FormField>

        <div className="grid gap-5 md:grid-cols-2">
          <FormField
            helpText="Un hashtag par ligne ou séparé par une virgule."
            label="Hashtags"
          >
            <textarea
              className="min-h-28 w-full rounded-md border border-[var(--border)] px-3 py-2"
              defaultValue={variant.hashtags.join("\n")}
              name="hashtags"
            />
          </FormField>

          <FormField
            helpText="Action proposée au lecteur."
            label="Appel à l’action"
          >
            <textarea
              className="min-h-28 w-full rounded-md border border-[var(--border)] px-3 py-2"
              defaultValue={variant.callToAction ?? ""}
              name="call_to_action"
            />
          </FormField>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <FormField
            helpText="Catégorie cible si la déclinaison devient un article WordPress."
            label="Catégorie WordPress"
          >
            <select
              className="w-full rounded-md border border-[var(--border)] px-3 py-2"
              defaultValue={variant.wordpressCategoryId ?? ""}
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
            helpText="Type de publication Google Business envisagé."
            label="Type Google Business"
          >
            <input
              className="w-full rounded-md border border-[var(--border)] px-3 py-2"
              defaultValue={variant.googleBusinessPostType ?? ""}
              name="google_business_post_type"
              type="text"
            />
          </FormField>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <FormField
            helpText="Titre SEO préparatoire pour WordPress."
            label="Titre SEO"
          >
            <input
              className="w-full rounded-md border border-[var(--border)] px-3 py-2"
              defaultValue={variant.seoTitle ?? ""}
              name="seo_title"
              type="text"
            />
          </FormField>

          <FormField
            helpText="Description SEO courte et orientée recherche."
            label="Description SEO"
          >
            <textarea
              className="min-h-24 w-full rounded-md border border-[var(--border)] px-3 py-2"
              defaultValue={variant.seoDescription ?? ""}
              name="seo_description"
            />
          </FormField>
        </div>

        <FormField
          helpText="Tableau ou thématique Pinterest envisagé."
          label="Tableau Pinterest"
        >
          <input
            className="w-full rounded-md border border-[var(--border)] px-3 py-2"
            defaultValue={variant.pinterestBoard ?? ""}
            name="pinterest_board"
            type="text"
          />
        </FormField>

        <div className="flex justify-end border-t border-[var(--border)] pt-5">
          <SubmitButton
            className="rounded-md bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
            pendingLabel="Enregistrement..."
          >
            Enregistrer les modifications
          </SubmitButton>
        </div>
      </form>
    </section>
  );
}
