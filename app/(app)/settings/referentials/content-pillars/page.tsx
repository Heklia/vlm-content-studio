import { getContentPillars } from "@/services/referentials/get-content-pillars";
import { PageTitle } from "@/shared/ui/PageTitle";
import { StatusBadge } from "@/shared/ui/StatusBadge";

export default async function ContentPillarsPage() {
  const pillars = await getContentPillars();
  const totalTarget = pillars.reduce(
    (total, pillar) => total + pillar.targetPercentage,
    0,
  );

  return (
    <section className="space-y-6">
      <PageTitle
        eyebrow="Référentiels"
        title="Piliers de contenu"
        description="Objectifs de répartition éditoriale initiaux. Le suivi réalisé / écart sera ajouté plus tard."
      />

      <div className="rounded-md border border-[var(--border)] bg-[var(--surface)] p-5">
        <p className="text-sm text-[var(--muted)]">Total cible</p>
        <p className="mt-2 text-2xl font-semibold">{totalTarget}%</p>
      </div>

      <div className="overflow-hidden rounded-md border border-[var(--border)] bg-[var(--surface)]">
        <table className="w-full text-left text-sm">
          <thead className="bg-[var(--background)] text-[var(--muted)]">
            <tr>
              <th className="px-4 py-3 font-medium">Pilier</th>
              <th className="px-4 py-3 font-medium">Clé</th>
              <th className="px-4 py-3 font-medium">Cible</th>
              <th className="px-4 py-3 font-medium">Statut</th>
            </tr>
          </thead>
          <tbody>
            {pillars.map((pillar) => (
              <tr className="border-t border-[var(--border)]" key={pillar.id}>
                <td className="px-4 py-3 font-medium">{pillar.label}</td>
                <td className="px-4 py-3 text-[var(--muted)]">{pillar.key}</td>
                <td className="px-4 py-3">{pillar.targetPercentage}%</td>
                <td className="px-4 py-3">
                  <StatusBadge tone={pillar.isActive ? "success" : "muted"}>
                    {pillar.isActive ? "Actif" : "Inactif"}
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

