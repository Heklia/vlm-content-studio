import { aiProviderStatusLabels } from "@/modules/ai-providers/domain/ai-provider";
import { getAiProviders } from "@/services/referentials/get-ai-providers";
import { PageTitle } from "@/shared/ui/PageTitle";
import { StatusBadge } from "@/shared/ui/StatusBadge";

export default async function AiProvidersPage() {
  const providers = await getAiProviders();

  return (
    <section className="space-y-6">
      <PageTitle
        eyebrow="Référentiels"
        title="Fournisseurs IA"
        description="Fournisseurs déclarés pour préparer les futurs choix de modèles. Aucun appel IA n’est effectué au Sprint 2."
      />

      <div className="overflow-hidden rounded-md border border-[var(--border)] bg-[var(--surface)]">
        <table className="w-full text-left text-sm">
          <thead className="bg-[var(--background)] text-[var(--muted)]">
            <tr>
              <th className="px-4 py-3 font-medium">Fournisseur</th>
              <th className="px-4 py-3 font-medium">Clé</th>
              <th className="px-4 py-3 font-medium">Statut</th>
              <th className="px-4 py-3 font-medium">Défaut</th>
            </tr>
          </thead>
          <tbody>
            {providers.map((provider) => (
              <tr className="border-t border-[var(--border)]" key={provider.id}>
                <td className="px-4 py-3 font-medium">{provider.label}</td>
                <td className="px-4 py-3 text-[var(--muted)]">
                  {provider.key}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge
                    tone={provider.status === "available" ? "success" : "muted"}
                  >
                    {aiProviderStatusLabels[provider.status]}
                  </StatusBadge>
                </td>
                <td className="px-4 py-3">
                  {provider.isDefault ? "Oui" : "Non"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

