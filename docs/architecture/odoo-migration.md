# Préparation migration Odoo

## Vision

VLM Content Studio est conçu comme :

```text
Application autonome aujourd’hui
↓
Module Odoo Community demain
```

Le projet doit rester exploitable sur Vercel et Supabase tout en conservant des frontières métier compatibles avec une future migration vers Odoo Community.

## Principes

- Stabiliser les noms métier.
- Éviter de mélanger logique métier et accès aux données.
- Passer par des repositories.
- Documenter les entités importantes.
- Garder les connecteurs externes séparés.
- Éviter les dépendances directes entre interface et base de données.

## Correspondances futures

| VLM Content Studio | Correspondance Odoo future |
| --- | --- |
| `users_profiles` | utilisateurs Odoo |
| `roles` | groupes et droits Odoo |
| `editorial_settings` | configuration module Odoo |
| `content_pillars` | modèle Odoo |
| `channels` | modèle Odoo |
| `media_assets` | pièces jointes ou modèle média |
| `content_sources` | modèle Odoo |
| `master_contents` | modèle Odoo |
| `channel_variants` | modèle Odoo |
| `editorial_planning` | modèle Odoo ou calendrier |
| `validation_steps` | workflow / états Odoo |
| `publication_logs` | historique Odoo |
| `connectors` | configuration technique Odoo |

## Entités métier à préserver

Les entités suivantes devront être pensées comme futures classes ou modèles Odoo :

- utilisateurs et profils ;
- rôles ;
- piliers de contenu ;
- canaux ;
- médias ;
- fiches sources ;
- contenus maîtres ;
- déclinaisons ;
- planning éditorial ;
- validations ;
- connecteurs ;
- historiques de publication.

## Choix à confirmer plus tard

- Stratégie de migration des médias.
- Mapping entre Supabase Auth et utilisateurs Odoo.
- Gestion des droits et groupes Odoo.
- Conservation de l’historique des contenus générés.
- Synchronisation ou migration complète des données.

