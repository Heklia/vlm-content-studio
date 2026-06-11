import { PageTitle } from "@/shared/ui/PageTitle";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <section className="w-full max-w-md rounded-md border border-[var(--border)] bg-[var(--surface)] p-8 shadow-sm">
        <PageTitle
          eyebrow="Accès sécurisé"
          title="VLM Content Studio"
          description="L’authentification Supabase est préparée. La connexion opérationnelle sera activée avec la configuration du projet Supabase."
        />

        <form className="mt-8 space-y-4">
          <label className="block">
            <span className="text-sm font-medium">Email</span>
            <input
              className="mt-2 w-full rounded-md border border-[var(--border)] px-3 py-2"
              name="email"
              placeholder="prenom.nom@vlm.fr"
              type="email"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium">Mot de passe</span>
            <input
              className="mt-2 w-full rounded-md border border-[var(--border)] px-3 py-2"
              name="password"
              type="password"
            />
          </label>
          <button
            className="w-full rounded-md bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white"
            type="button"
          >
            Connexion préparée
          </button>
        </form>
      </section>
    </main>
  );
}

