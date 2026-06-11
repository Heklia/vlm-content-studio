import { getWordPressCategories } from "@/services/referentials/get-wordpress-categories";
import { PageTitle } from "@/shared/ui/PageTitle";
import { StatusBadge } from "@/shared/ui/StatusBadge";

export default async function WordPressCategoriesPage() {
  const categories = await getWordPressCategories();

  return (
    <section className="space-y-6">
      <PageTitle
        eyebrow="Référentiels"
        title="Catégories WordPress"
        description="Catégories prévues pour les futures publications WordPress. Aucune synchronisation n’est effectuée au Sprint 2."
      />

      <div className="overflow-hidden rounded-md border border-[var(--border)] bg-[var(--surface)]">
        <table className="w-full text-left text-sm">
          <thead className="bg-[var(--background)] text-[var(--muted)]">
            <tr>
              <th className="px-4 py-3 font-medium">Catégorie</th>
              <th className="px-4 py-3 font-medium">Slug</th>
              <th className="px-4 py-3 font-medium">ID WordPress</th>
              <th className="px-4 py-3 font-medium">Statut</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr className="border-t border-[var(--border)]" key={category.id}>
                <td className="px-4 py-3 font-medium">{category.label}</td>
                <td className="px-4 py-3 text-[var(--muted)]">
                  {category.slug}
                </td>
                <td className="px-4 py-3">
                  {category.wordpressId ?? "Non synchronisé"}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge tone={category.isActive ? "success" : "muted"}>
                    {category.isActive ? "Actif" : "Inactif"}
                  </StatusBadge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

