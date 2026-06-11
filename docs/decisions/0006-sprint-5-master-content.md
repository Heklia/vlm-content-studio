# Décision 0006 - Sprint 5 contenu maître

## Statut

Validée pour implémentation.

## Contexte

Le Sprint 5 crée un contenu éditorial central à partir d’une fiche source. Il prépare la future génération IA et les futures déclinaisons multicanales, sans les développer.

## Décisions

- Créer la table `master_contents`.
- Autoriser plusieurs contenus maîtres par fiche source.
- Utiliser les statuts `draft`, `ready` et `archived`.
- Préparer les modes `manual`, `ai_assisted` et `ai_generated`.
- Utiliser uniquement `manual` au Sprint 5.
- Créer les pages `/master-content`, `/master-content/new` et `/master-content/[id]`.
- Ne pas appeler de fournisseur IA.
- Ne pas créer de déclinaisons multicanales.
- Ne pas créer de planning ou publication.

## Compatibilité Odoo

La table `master_contents` correspondra à terme à un modèle `vlm.master.content`.

Champs préparés pour Odoo :

- fiche source ;
- titre ;
- angle ;
- accroche ;
- texte principal ;
- points clés ;
- appel à l’action ;
- notes éditoriales ;
- statut ;
- mode de génération ;
- traçabilité IA ;
- auteur.

## Conséquences

- Les contenus maîtres deviennent la base des futures déclinaisons WordPress, LinkedIn, Pinterest et Google Business.
- L’architecture IA reste prête, mais non couplée à un fournisseur.
- Le workflow de validation complet reste réservé à un sprint ultérieur.

