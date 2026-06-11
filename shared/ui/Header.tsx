import { signOut } from "@/services/auth/actions";

export function Header() {
  return (
    <header className="border-b border-[var(--border)] bg-[var(--surface)] px-6 py-4">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <p className="text-sm font-semibold">VLM Content Studio</p>
        <div className="flex items-center gap-4">
          <p className="text-sm text-[var(--muted)]">Socle applicatif</p>
          <form action={signOut}>
            <button
              className="rounded-md border border-[var(--border)] px-3 py-1.5 text-sm font-medium"
              type="submit"
            >
              Déconnexion
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
