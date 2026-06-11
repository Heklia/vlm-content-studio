# Architecture projet

## Objectif

Le Sprint 0 prepare VLM Content Studio sans developper de fonctionnalites metier.

L'objectif est de definir une architecture lisible, evolutive et compatible avec :

- Vercel pour le deploiement ;
- Supabase pour l'authentification, la base de donnees et le stockage ;
- PostgreSQL comme modele de donnees principal ;
- une future migration vers Odoo Community.

## Couches applicatives

### Domaine metier

Le domaine metier regroupe les concepts stables de l'application :

- utilisateurs ;
- roles ;
- parametres editoriaux ;
- piliers de contenu ;
- medias ;
- fiches sources ;
- contenu maitre ;
- declinaisons multicanales ;
- planning editorial ;
- validation ;
- connecteurs ;
- tableau de bord.

Cette couche ne doit pas dependre directement de Supabase, Vercel, WordPress ou d'un fournisseur IA.

### Interface utilisateur

L'interface sera construite avec Next.js App Router.

Les ecrans devront appeler des services ou cas d'usage applicatifs. Ils ne devront pas executer directement de requetes Supabase.

### Repositories

La couche `repositories` fera le lien entre la logique applicative et les donnees.

Elle permettra de remplacer plus facilement Supabase/PostgreSQL par une autre source de donnees ou par des modeles Odoo plus tard.

### Infrastructure

La couche `infrastructure` contiendra les implementations techniques :

- client Supabase ;
- acces Storage ;
- connecteurs externes ;
- services de publication ;
- fournisseurs IA.

### Services

La couche `services` regroupera les operations applicatives transverses :

- generation de contenu ;
- preparation de publication ;
- changement de statut ;
- calculs de repartition editoriale ;
- orchestration de connecteurs.

## Regles structurantes

- Aucun ecran ne doit acceder directement a Supabase.
- Aucun connecteur externe ne doit etre appele directement depuis un composant UI.
- Aucun fournisseur IA ne doit etre code en dur dans le domaine metier.
- Les statuts editoriaux doivent etre centralises.
- Les roles doivent etre documentes et appliques cote donnees via politiques de securite.
- Les noms metier doivent rester compatibles avec une future migration Odoo.

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

Organisation fonctionnelle par domaine metier.

### `shared`

Elements reutilisables et non lies a un module unique.

### `infrastructure`

Implementations techniques et dependances externes.

### `repositories`

Interfaces et implementations d'acces aux donnees.

### `services`

Cas d'usage applicatifs et orchestration metier.

### `supabase`

Migrations, donnees de seed et politiques de securite.

### `types`

Types transverses partages par plusieurs couches.

### `docs`

Documentation produit, technique et decisions.

## Workflow editorial cible

```text
Brouillon
↓
A relire
↓
Valide
↓
Planifie
↓
Publie
↓
Archive
```

Ce workflow est documente au Sprint 0 mais ne doit pas encore etre implemente.

