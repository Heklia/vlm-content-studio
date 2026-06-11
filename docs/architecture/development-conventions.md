# Conventions de développement

## Langage et framework

- TypeScript pour le code applicatif.
- Next.js App Router pour l’application web.
- Tailwind CSS pour le style.
- Zod pour la validation des données.
- Supabase pour auth, base et storage.

## Nommage

- Dossiers : `kebab-case`
- Fichiers TypeScript : `kebab-case.ts`
- Composants React : `PascalCase.tsx`
- Fonctions : `camelCase`
- Types et interfaces : `PascalCase`
- Tables PostgreSQL : `snake_case`
- Colonnes PostgreSQL : `snake_case`
- Variables d’environnement : `UPPER_SNAKE_CASE`

## Organisation

- `modules` : logique métier organisée par domaine fonctionnel.
- `repositories` : accès aux données uniquement.
- `services` : orchestration métier, génération, publication et automatisations.
- `infrastructure` : clients techniques externes Supabase, IA, connecteurs et stockage.
- `shared` contient les éléments réutilisables.
- `docs` contient la documentation et les décisions.

## Règles de dépendance

- L’interface peut appeler les services applicatifs.
- Les services peuvent appeler les repositories.
- Les repositories peuvent appeler l’infrastructure de données.
- Le domaine métier ne doit pas dépendre de Supabase.
- Les connecteurs externes doivent rester isolés dans `infrastructure`.
- Les fournisseurs IA doivent rester isolés dans `infrastructure/ai-providers`.

## Encodage

Les fichiers de documentation doivent être conservés en UTF-8 afin de préserver les accents français, les apostrophes typographiques et les flèches de workflow.

## Environnements

Les secrets ne doivent jamais être commités.

Un fichier `.env.example` sera ajouté lors de l’initialisation applicative pour documenter les variables attendues.

## Documentation

Chaque sprint important doit pouvoir ajouter :

- une note de décision dans `docs/decisions` ;
- une mise à jour de roadmap si nécessaire ;
- une documentation d’architecture si une frontière évolue.

