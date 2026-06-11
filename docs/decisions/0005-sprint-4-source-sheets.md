# Décision 0005 - Sprint 4 fiches sources

## Statut

Validée pour implémentation.

## Contexte

Le Sprint 4 crée la matière première éditoriale qui servira plus tard à générer le contenu maître et les déclinaisons multicanales.

## Décisions

- Créer les tables `source_sheets`, `source_sheet_media` et `source_sheet_channels`.
- Utiliser les statuts `draft`, `ready` et `archived`.
- Autoriser `administrator` et `validator` à modifier toutes les fiches.
- Autoriser `contributor` à modifier ses propres fiches tant qu’elles ne sont pas archivées.
- Garder `viewer` en lecture seule.
- Créer les pages `/source-sheets`, `/source-sheets/new` et `/source-sheets/[id]`.
- Associer des médias existants aux fiches sources.
- Associer des canaux cibles aux fiches sources.
- Ne pas développer de génération IA, de contenu maître, de planning ou de publication au Sprint 4.

## Compatibilité Odoo

| Table | Correspondance Odoo future |
| --- | --- |
| `source_sheets` | modèle `vlm.content.source` |
| `source_sheet_media` | relation entre `vlm.content.source` et `ir.attachment` ou `vlm.media.asset` |
| `source_sheet_channels` | relation many2many entre `vlm.content.source` et `vlm.channel` |

## Conséquences

- Les prochains sprints pourront générer un contenu maître à partir de fiches structurées.
- Les médias et canaux sont déjà reliés à la matière éditoriale.
- Le workflow complet de validation reste réservé à un sprint ultérieur.

