# Décision 0004 - Sprint 3 médias

## Statut

Validée pour implémentation.

## Contexte

Le Sprint 3 met en place la gestion des médias sans créer les fiches sources, contenus, planning ou publication.

## Décisions

- Créer la table `media_assets`.
- Créer le bucket Supabase Storage privé `media-assets`.
- Autoriser la lecture aux utilisateurs actifs.
- Autoriser l’upload aux rôles `administrator`, `validator` et `contributor`.
- Garder `viewer` en lecture seule.
- Ne pas développer de suppression physique.
- Imposer la mention IA si `is_ai_generated = true`.
- Ajouter les pages `/media` et `/media/new`.
- Ne pas lier les médias aux fiches sources ou contenus au Sprint 3.

## Compatibilité Odoo

La table `media_assets` correspondra à terme à `ir.attachment` ou à un modèle dédié `vlm.media.asset`.

Champs préparés pour Odoo :

- nom du fichier ;
- type MIME ;
- taille ;
- titre ;
- description ;
- texte alternatif ;
- crédit ;
- statut ;
- auteur ;
- origine IA ;
- mention obligatoire IA.

## Conséquences

- Les prochains sprints pourront relier les médias aux fiches sources.
- Les visuels IA sont identifiables et encadrés.
- Les fichiers restent privés dans Supabase Storage.

