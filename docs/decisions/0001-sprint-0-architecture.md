# Décision 0001 - Sprint 0 architecture

## Statut

Validée pour préparation documentaire.

## Contexte

Le repository `Heklia/vlm-content-studio` est un repository GitHub dédié et vide au démarrage.

Le Sprint 0 doit préparer le projet sans développer de fonctionnalités métier.

## Décisions

- Utiliser Next.js App Router, TypeScript, Tailwind CSS, Supabase, Supabase Auth, Supabase Storage, PostgreSQL, Vercel et Zod.
- Organiser le projet autour de modules métier.
- Isoler les accès données dans une couche `repositories`.
- Isoler les dépendances techniques dans `infrastructure`.
- Prévoir une couche `AI Providers` indépendante des fournisseurs.
- Documenter la future migration Odoo dès le Sprint 0.
- Ne pas développer de fonctionnalité métier pendant le Sprint 0.

## Conséquences

- Les prochains sprints pourront démarrer sur une base lisible.
- Les choix techniques restent compatibles avec Vercel et Supabase.
- La future migration Odoo est facilitée par la séparation des responsabilités.
- Les fournisseurs IA pourront être remplacés sans modifier la logique métier.

