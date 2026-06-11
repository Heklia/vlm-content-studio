# Conventions de developpement

## Langage et framework

- TypeScript pour le code applicatif.
- Next.js App Router pour l'application web.
- Tailwind CSS pour le style.
- Zod pour la validation des donnees.
- Supabase pour auth, base et storage.

## Nommage

- Dossiers : `kebab-case`
- Fichiers TypeScript : `kebab-case.ts`
- Composants React : `PascalCase.tsx`
- Fonctions : `camelCase`
- Types et interfaces : `PascalCase`
- Tables PostgreSQL : `snake_case`
- Colonnes PostgreSQL : `snake_case`
- Variables d'environnement : `UPPER_SNAKE_CASE`

## Organisation

- `modules` contient les domaines fonctionnels.
- `repositories` contient l'acces aux donnees.
- `services` contient l'orchestration applicative.
- `infrastructure` contient les implementations techniques.
- `shared` contient les elements reutilisables.
- `docs` contient la documentation et les decisions.

## Regles de dependance

- L'interface peut appeler les services applicatifs.
- Les services peuvent appeler les repositories.
- Les repositories peuvent appeler l'infrastructure de donnees.
- Le domaine metier ne doit pas dependre de Supabase.
- Les connecteurs externes doivent rester isoles dans `infrastructure`.
- Les fournisseurs IA doivent rester isoles dans `infrastructure/ai-providers`.

## Environnements

Les secrets ne doivent jamais etre commites.

Un fichier `.env.example` sera ajoute lors de l'initialisation applicative pour documenter les variables attendues.

## Documentation

Chaque sprint important doit pouvoir ajouter :

- une note de decision dans `docs/decisions` ;
- une mise a jour de roadmap si necessaire ;
- une documentation d'architecture si une frontiere evolue.

