# Décision 0003 - Sprint 2 référentiels

## Statut

Validée pour implémentation.

## Contexte

Le Sprint 2 met en place les référentiels éditoriaux de base, en lecture seule dans l’interface.

Les fonctionnalités suivantes restent exclues :

- médias ;
- fiches sources ;
- génération IA ;
- contenus ;
- planning ;
- publication réelle ;
- synchronisation WordPress ;
- modification des référentiels depuis l’interface.

## Décisions

- Créer les tables `channels`, `content_pillars`, `wordpress_categories` et `ai_providers`.
- Afficher les référentiels dans `/settings/referentials`.
- Garder les écrans en lecture seule.
- Afficher les canaux V2 comme `coming_soon`.
- Afficher les fournisseurs IA sans effectuer aucun appel IA.
- Conserver la séparation entre `channels` et `connector_settings`.

## Correspondances Odoo futures

| Table | Correspondance Odoo future |
| --- | --- |
| `channels` | modèle `vlm.channel` |
| `content_pillars` | modèle `vlm.content.pillar` |
| `wordpress_categories` | modèle `vlm.wordpress.category` |
| `ai_providers` | modèle `vlm.ai.provider` ou configuration module |

## Conséquences

- Les prochains sprints pourront associer médias, fiches sources et contenus à des référentiels stables.
- Les objectifs éditoriaux initiaux sont stockés en base.
- Les connecteurs techniques restent séparés des canaux éditoriaux.
- L’architecture IA reste déclarative, sans dépendance fournisseur.

