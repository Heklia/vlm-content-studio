# Decision 0001 - Sprint 0 architecture

## Statut

Validee pour preparation documentaire.

## Contexte

Le repository `Heklia/vlm-content-studio` est un repository GitHub dedie et vide au demarrage.

Le Sprint 0 doit preparer le projet sans developper de fonctionnalites metier.

## Decisions

- Utiliser Next.js App Router, TypeScript, Tailwind CSS, Supabase, Supabase Auth, Supabase Storage, PostgreSQL, Vercel et Zod.
- Organiser le projet autour de modules metier.
- Isoler les acces donnees dans une couche `repositories`.
- Isoler les dependances techniques dans `infrastructure`.
- Prevoir une couche `AI Providers` independante des fournisseurs.
- Documenter la future migration Odoo des le Sprint 0.
- Ne pas developper de fonctionnalite metier pendant le Sprint 0.

## Consequences

- Les prochains sprints pourront demarrer sur une base lisible.
- Les choix techniques restent compatibles avec Vercel et Supabase.
- La future migration Odoo est facilitee par la separation des responsabilites.
- Les fournisseurs IA pourront etre remplaces sans modifier la logique metier.

