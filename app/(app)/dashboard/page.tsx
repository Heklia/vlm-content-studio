import { PageTitle } from "@/shared/ui/PageTitle";

export default function DashboardPage() {
  return (
    <section className="space-y-6">
      <PageTitle
        eyebrow="Sprint 1"
        title="Tableau de bord"
        description="Socle applicatif initial. Les indicateurs éditoriaux seront ajoutés dans les prochains sprints."
      />

      <div className="grid gap-4 md:grid-cols-3">
        {["Modules prêts", "Authentification préparée", "Supabase préparé"].map(
          (label) => (
            <article
              className="rounded-md border border-[var(--border)] bg-[var(--surface)] p-5"
              key={label}
            >
              <p className="text-sm text-[var(--muted)]">{label}</p>
              <p className="mt-3 text-2xl font-semibold">À venir</p>
            </article>
          ),
        )}
      </div>
    </section>
  );
}

