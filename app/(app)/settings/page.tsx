import Link from "next/link";
import { PageTitle } from "@/shared/ui/PageTitle";

export default function SettingsPage() {
  return (
    <section className="space-y-6">
      <PageTitle
        eyebrow="Paramétrage"
        title="Paramètres"
        description="Paramètres globaux, fournisseurs IA et connecteurs de publication."
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

      <div className="grid gap-4 md:grid-cols-2">
        <Link
          className="rounded-md border border-[var(--border)] bg-[var(--surface)] p-5 transition hover:border-[var(--accent)]"
          href="/settings/connectors/wordpress"
        >
          <h2 className="text-lg font-semibold">Connecteur WordPress</h2>
          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
            Configurez le test de connexion et la création de brouillons
            WordPress.
          </p>
        </Link>

        <Link
          className="rounded-md border border-[var(--border)] bg-[var(--surface)] p-5 transition hover:border-[var(--accent)]"
          href="/settings/referentials"
        >
          <h2 className="text-lg font-semibold">Référentiels</h2>
          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
            Consultez les canaux, piliers, catégories WordPress et fournisseurs
            IA.
          </p>
        </Link>
      </div>
    </section>
  );
}
