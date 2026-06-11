import Link from "next/link";
import { PageTitle } from "@/shared/ui/PageTitle";

const referentials = [
  {
    href: "/settings/referentials/channels",
    label: "Canaux",
    description: "Canaux éditoriaux V1 et V2, visibles en lecture seule.",
  },
  {
    href: "/settings/referentials/content-pillars",
    label: "Piliers de contenu",
    description: "Répartition éditoriale cible initiale.",
  },
  {
    href: "/settings/referentials/wordpress-categories",
    label: "Catégories WordPress",
    description: "Catégories prévues pour les futures publications WordPress.",
  },
  {
    href: "/settings/referentials/ai-providers",
    label: "Fournisseurs IA",
    description: "Fournisseurs déclaratifs, sans appel IA au Sprint 2.",
  },
] as const;

export default function ReferentialsPage() {
  return (
    <section className="space-y-6">
      <PageTitle
        eyebrow="Paramètres"
        title="Référentiels"
        description="Référentiels éditoriaux préparés pour les prochains sprints. Les écrans sont en lecture seule."
      />

      <div className="grid gap-4 md:grid-cols-2">
        {referentials.map((item) => (
          <Link
            className="rounded-md border border-[var(--border)] bg-[var(--surface)] p-5 transition hover:border-[var(--accent)]"
            href={item.href}
            key={item.href}
          >
            <h2 className="text-lg font-semibold">{item.label}</h2>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
              {item.description}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}

