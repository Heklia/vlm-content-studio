# Architecture projet

## Objectif

Le Sprint 0 prépare VLM Content Studio sans développer de fonctionnalités métier.

L’objectif est de définir une architecture lisible, évolutive et compatible avec :

- Vercel pour le déploiement ;
- Supabase pour l’authentification, la base de données et le stockage ;
- PostgreSQL comme modèle de données principal ;
- une future migration vers Odoo Community.

## Couches applicatives

### Domaine métier

Le domaine métier regroupe les concepts stables de l’application :

- utilisateurs ;
- rôles ;
- paramètres éditoriaux ;
- piliers de contenu ;
- médias ;
- fiches sources ;
- contenu maître ;
- déclinaisons multicanales ;
- planning éditorial ;
- validation ;
- connecteurs ;
- tableau de bord.

Cette couche ne doit pas dépendre directement de Supabase, Vercel, WordPress ou d’un fournisseur IA.

### Interface utilisateur

L’interface sera construite avec Next.js App Router.

Les écrans devront appeler des services ou cas d’usage applicatifs. Ils ne devront pas exécuter directement de requêtes Supabase.

### Repositories

La couche `repositories` fera le lien entre la logique applicative et les données.

Elle permettra de remplacer plus facilement Supabase/PostgreSQL par une autre source de données ou par des modèles Odoo plus tard.

### Infrastructure

La couche `infrastructure` contiendra les implémentations techniques :

- client Supabase ;
- accès Storage ;
- connecteurs externes ;
- services de publication ;
- fournisseurs IA.

### Services

La couche `services` regroupera les opérations applicatives transverses :

- génération de contenu ;
- préparation de publication ;
- changement de statut ;
- calculs de répartition éditoriale ;
- orchestration de connecteurs.

## Règles structurantes

- Aucun écran ne doit accéder directement à Supabase.
- Aucun connecteur externe ne doit être appelé directement depuis un composant UI.
- Aucun fournisseur IA ne doit être codé en dur dans le domaine métier.
- Les statuts éditoriaux doivent être centralisés.
- Les rôles doivent être documentés et appliqués côté données via politiques de sécurité.
- Les noms métier doivent rester compatibles avec une future migration Odoo.

## Responsabilités des dossiers

- `modules` : logique métier organisée par domaine fonctionnel.
- `repositories` : accès aux données uniquement.
- `services` : orchestration métier, génération, publication et automatisations.
- `infrastructure` : clients techniques externes Supabase, IA, connecteurs et stockage.

## Structure des dossiers

```text
app/
modules/
shared/
infrastructure/
repositories/
services/
supabase/
types/
docs/
```

### `app`

Futur dossier Next.js App Router.

### `modules`

Logique métier organisée par domaine fonctionnel.

### `shared`

Éléments réutilisables et non liés à un module unique.

### `infrastructure`

Clients techniques externes Supabase, IA, connecteurs et stockage.

### `repositories`

Accès aux données uniquement.

### `services`

Orchestration métier, génération, publication et automatisations.

### `supabase`

Migrations, données de seed et politiques de sécurité.

### `types`

Types transverses partagés par plusieurs couches.

### `docs`

Documentation produit, technique et décisions.

## Workflow éditorial cible

```text
Brouillon
↓
À relire
↓
Validé
↓
Planifié
↓
Publié
↓
Archivé
```

Ce workflow est documenté au Sprint 0 mais ne doit pas encore être implémenté.

