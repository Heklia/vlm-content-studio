# Décision 0008 — Sprint 7 : validation et planning

## Statut

Validée.

## Contexte

Les déclinaisons multicanales existent depuis le Sprint 6. Le Sprint 7 ajoute le workflow éditorial et la planification, sans publication réelle et sans appel aux connecteurs.

Le périmètre s’applique aux `channel_variants`.

## Décision

Créer trois tables :

- `validation_reviews` pour les demandes de relecture ;
- `scheduled_publications` pour les publications planifiées ;
- `content_workflow_events` pour tracer les changements métier.

Le workflow préparé est :

- brouillon ;
- à relire ;
- validé ;
- planifié ;
- publié ;
- archivé.

Le statut `published` est réservé aux futurs connecteurs. Aucun service du Sprint 7 ne publie réellement un contenu.

## Règles métier

- une déclinaison doit être en brouillon pour être envoyée en validation ;
- une seule demande de validation active est autorisée par déclinaison ;
- un contributeur peut demander validation, mais pas valider ;
- seuls les rôles `administrator` et `validator` peuvent valider, demander corrections et planifier ;
- une déclinaison doit être validée pour être planifiée ;
- planifier une publication passe la déclinaison au statut planifié, sans appel externe.

## Sécurité

Les politiques RLS suivent les rôles validés :

- lecture pour les utilisateurs actifs ;
- création de validation pour `administrator`, `validator` et `contributor` ;
- mise à jour des validations uniquement pour `administrator` et `validator` ;
- création et mise à jour du planning uniquement pour `administrator` et `validator` ;
- événements de workflow créés par les utilisateurs actifs autorisés ;
- aucun événement de workflow n’est modifiable après création.

## Compatibilité Odoo

Correspondances potentielles futures :

- `validation_reviews` vers `vlm.content.validation.review` ;
- `scheduled_publications` vers `vlm.publication.schedule` ;
- `content_workflow_events` vers `vlm.content.workflow.event`.

Cette séparation garde les responsabilités lisibles entre contenu, validation, planning et future publication externe.
