import Link from "next/link";
import {
  hasStoredWordPressPassword,
} from "@/modules/connectors/domain/wordpress-connector-config";
import { getWordPressConnector } from "@/services/connectors/get-wordpress-connector";
import {
  saveWordPressConnectorAction,
  testWordPressConnectorAction,
} from "@/services/connectors/wordpress-actions";
import { FormUnloadGuard } from "@/shared/ui/FormUnloadGuard";
import { PageTitle } from "@/shared/ui/PageTitle";
import { StatusBadge } from "@/shared/ui/StatusBadge";
import { SubmitButton } from "@/shared/ui/SubmitButton";

type WordPressConnectorPageProps = {
  searchParams: Promise<{
    error?: string;
    saved?: string;
    tested?: string;
    user?: string;
  }>;
};

const connectorStatusLabels = {
  active: "Actif",
  configured: "Configuré",
  disabled: "Désactivé",
  error: "Erreur",
} as const;

const errorMessages: Record<string, string> = {
  forbidden: "Votre rôle ne permet pas de configurer le connecteur WordPress.",
  missing_config: "Renseignez l’URL WordPress et l’utilisateur.",
  missing_connector: "Le connecteur WordPress est introuvable dans les paramètres.",
  missing_password: "Ajoutez un Application Password WordPress.",
  test_failed: "Le test de connexion WordPress a échoué. Vérifiez l’URL, l’utilisateur et l’Application Password.",
};

export default async function WordPressConnectorPage({
  searchParams,
}: WordPressConnectorPageProps) {
  const [{ error, saved, tested, user }, connector] = await Promise.all([
    searchParams,
    getWordPressConnector(),
  ]);
  const errorMessage = error ? errorMessages[error] : null;
  const config = connector?.wordpressConfig ?? {};
  const hasPassword = hasStoredWordPressPassword(config);

  return (
    <section className="mx-auto max-w-4xl space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <PageTitle
          eyebrow="Connecteurs"
          title="WordPress"
          description="Configurez le connecteur WordPress pour créer des brouillons depuis les déclinaisons validées. Aucune publication automatique n’est effectuée."
        />
        <Link
          className="rounded-md border border-[var(--border)] px-4 py-2 text-sm font-semibold"
          href="/settings"
        >
          Retour paramètres
        </Link>
      </div>

      {errorMessage ? (
        <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {errorMessage}
        </p>
      ) : null}

      {saved ? (
        <p className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          Configuration WordPress enregistrée.
        </p>
      ) : null}

      {tested ? (
        <p className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          Connexion WordPress réussie{user ? ` avec ${user}` : ""}.
        </p>
      ) : null}

      <div className="rounded-md border border-[var(--border)] bg-[var(--surface)] p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">État du connecteur</h2>
            <p className="mt-1 text-sm text-[var(--muted)]">
              Le Sprint 8 crée uniquement des brouillons WordPress.
            </p>
          </div>
          <StatusBadge
            tone={connector?.status === "active" ? "success" : "default"}
          >
            {connector
              ? connectorStatusLabels[connector.status]
              : "Non initialisé"}
          </StatusBadge>
        </div>
      </div>

      <form
        action={saveWordPressConnectorAction}
        className="space-y-5 rounded-md border border-[var(--border)] bg-[var(--surface)] p-6"
      >
        <FormUnloadGuard draftKey="vlm-content-studio:connectors:wordpress" />
        <div>
          <label className="text-sm font-medium" htmlFor="site_url">
            URL du site WordPress
          </label>
          <input
            className="mt-2 w-full rounded-md border border-[var(--border)] px-3 py-2"
            defaultValue={config.siteUrl ?? ""}
            id="site_url"
            name="site_url"
            placeholder="https://www.example.com"
            type="url"
          />
          <p className="mt-1 text-xs leading-5 text-[var(--muted)]">
            Adresse du site WordPress cible. Le connecteur utilise l’API REST
            `/wp-json/wp/v2`.
          </p>
        </div>

        <div>
          <label className="text-sm font-medium" htmlFor="username">
            Utilisateur WordPress
          </label>
          <input
            className="mt-2 w-full rounded-md border border-[var(--border)] px-3 py-2"
            defaultValue={config.username ?? ""}
            id="username"
            name="username"
            type="text"
          />
          <p className="mt-1 text-xs leading-5 text-[var(--muted)]">
            Utilisateur WordPress autorisé à créer des articles brouillons.
          </p>
        </div>

        <div>
          <label className="text-sm font-medium" htmlFor="application_password">
            Application Password
          </label>
          <input
            className="mt-2 w-full rounded-md border border-[var(--border)] px-3 py-2"
            id="application_password"
            name="application_password"
            placeholder={hasPassword ? "Mot de passe déjà enregistré" : ""}
            type="password"
          />
          <p className="mt-1 text-xs leading-5 text-[var(--muted)]">
            Laissez vide pour conserver le mot de passe déjà enregistré.
          </p>
        </div>

        <div>
          <label className="text-sm font-medium" htmlFor="status">
            Statut
          </label>
          <select
            className="mt-2 w-full rounded-md border border-[var(--border)] px-3 py-2"
            defaultValue={connector?.status === "disabled" ? "disabled" : "configured"}
            id="status"
            name="status"
          >
            <option value="configured">Configuré</option>
            <option value="disabled">Désactivé</option>
          </select>
        </div>

        <div className="flex justify-end border-t border-[var(--border)] pt-5">
          <SubmitButton
            className="rounded-md bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
            pendingLabel="Enregistrement..."
          >
            Enregistrer
          </SubmitButton>
        </div>
      </form>

      <form
        action={testWordPressConnectorAction}
        className="rounded-md border border-[var(--border)] bg-[var(--surface)] p-5"
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold">Tester la connexion</h2>
            <p className="mt-1 text-sm text-[var(--muted)]">
              Vérifie les identifiants avec l’utilisateur WordPress courant.
            </p>
          </div>
          <SubmitButton
            className="rounded-md border border-[var(--border)] px-4 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-60"
            pendingLabel="Test en cours..."
          >
            Tester
          </SubmitButton>
        </div>
      </form>
    </section>
  );
}
