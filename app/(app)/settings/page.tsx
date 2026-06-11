import { PageTitle } from "@/shared/ui/PageTitle";

export default function SettingsPage() {
  return (
    <section className="space-y-6">
      <PageTitle
        eyebrow="Paramétrage"
        title="Paramètres"
        description="Les paramètres globaux, fournisseurs IA et connecteurs sont préparés côté base, sans configuration active au Sprint 1."
      />

      <div className="rounded-md border border-[var(--border)] bg-[var(--surface)] p-5">
        <h2 className="text-lg font-semibold">Paramètres préparés</h2>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-[var(--muted)]">
          <li>Fournisseur IA par défaut.</li>
          <li>Modèle texte par défaut.</li>
          <li>Notice obligatoire pour les visuels IA.</li>
          <li>Fréquences éditoriales initiales par canal.</li>
          <li>Connecteurs désactivés par défaut.</li>
        </ul>
      </div>
    </section>
  );
}

