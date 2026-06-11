# Preparation migration Odoo

## Vision

VLM Content Studio est concu comme :

```text
Application autonome aujourd'hui
↓
Module Odoo Community demain
```

Le projet doit rester exploitable sur Vercel et Supabase tout en conservant des frontieres metier compatibles avec une future migration vers Odoo Community.

## Principes

- Stabiliser les noms metier.
- Eviter de melanger logique metier et acces aux donnees.
- Passer par des repositories.
- Documenter les entites importantes.
- Garder les connecteurs externes separes.
- Eviter les dependances directes entre interface et base de donnees.

## Correspondances futures

| VLM Content Studio | Correspondance Odoo future |
| --- | --- |
| `users_profiles` | utilisateurs Odoo |
| `roles` | groupes et droits Odoo |
| `editorial_settings` | configuration module Odoo |
| `content_pillars` | modele Odoo |
| `channels` | modele Odoo |
| `media_assets` | pieces jointes ou modele media |
| `content_sources` | modele Odoo |
| `master_contents` | modele Odoo |
| `channel_variants` | modele Odoo |
| `editorial_planning` | modele Odoo ou calendrier |
| `validation_steps` | workflow / etats Odoo |
| `publication_logs` | historique Odoo |
| `connectors` | configuration technique Odoo |

## Entites metier a preserver

Les entites suivantes devront etre pensees comme futures classes ou modeles Odoo :

- utilisateurs et profils ;
- roles ;
- piliers de contenu ;
- canaux ;
- medias ;
- fiches sources ;
- contenus maitres ;
- declinaisons ;
- planning editorial ;
- validations ;
- connecteurs ;
- historiques de publication.

## Choix a confirmer plus tard

- Strategie de migration des medias.
- Mapping entre Supabase Auth et utilisateurs Odoo.
- Gestion des droits et groupes Odoo.
- Conservation de l'historique des contenus generes.
- Synchronisation ou migration complete des donnees.

