import { signInWithPassword } from "@/services/auth/actions";
import { PageTitle } from "@/shared/ui/PageTitle";

type LoginPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

const errorMessages: Record<string, string> = {
  configuration:
    "Supabase n’est pas encore configuré dans les variables d’environnement.",
  inactive_profile: "Ce profil utilisateur est désactivé.",
  invalid_credentials: "Email ou mot de passe incorrect.",
  missing_credentials: "Merci de renseigner l’email et le mot de passe.",
  missing_profile:
    "L’utilisateur existe dans Supabase Auth, mais aucun profil applicatif actif n’est associé.",
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { error } = await searchParams;
  const errorMessage = error ? errorMessages[error] : null;

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <section className="w-full max-w-md rounded-md border border-[var(--border)] bg-[var(--surface)] p-8 shadow-sm">
        <PageTitle
          eyebrow="Accès sécurisé"
          title="VLM Content Studio"
          description="Connectez-vous avec le compte créé dans Supabase Auth."
        />

        {errorMessage ? (
          <p className="mt-6 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {errorMessage}
          </p>
        ) : null}

        <form action={signInWithPassword} className="mt-8 space-y-4">
          <label className="block">
            <span className="text-sm font-medium">Email</span>
            <input
              className="mt-2 w-full rounded-md border border-[var(--border)] px-3 py-2"
              name="email"
              placeholder="prenom.nom@vlm.fr"
              required
              type="email"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium">Mot de passe</span>
            <input
              className="mt-2 w-full rounded-md border border-[var(--border)] px-3 py-2"
              name="password"
              required
              type="password"
            />
          </label>
          <button
            className="w-full rounded-md bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white"
            type="submit"
          >
            Se connecter
          </button>
        </form>
      </section>
    </main>
  );
}
