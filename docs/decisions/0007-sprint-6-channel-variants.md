# Décision 0007 — Sprint 6 : déclinaisons multicanales

## Statut

Validée.

## Contexte

Le Sprint 5 a introduit le contenu maître manuel. Le Sprint 6 prépare les versions adaptées aux canaux V1 sans déclencher de publication, sans appel IA et sans connecteur externe.

Canaux V1 concernés :

- WordPress
- LinkedIn
- Pinterest
- Google Business

Les canaux futurs restent exclus de l’interface de création tant qu’ils ne sont pas activés.

## Décision

Créer le module `channel-variants` pour stocker des déclinaisons multicanales manuelles.

La table `channel_variants` contient :

- le lien vers le contenu maître ;
- le canal cible ;
- les champs éditoriaux communs : titre, extrait, corps, hashtags, appel à l’action ;
- les champs préparatoires spécifiques : catégorie WordPress, SEO, tableau Pinterest, type Google Business ;
- la traçabilité IA future : fournisseur, modèle, prompt généré ;
- le statut de préparation.

Le Sprint 6 impose `generation_mode = manual` lors de la création. Les valeurs `ai_assisted` et `ai_generated` sont réservées aux sprints futurs.

## Sécurité

Les règles RLS suivent le modèle des contenus maîtres :

- les utilisateurs actifs peuvent lire ;
- les rôles `administrator`, `validator` et `contributor` peuvent créer ;
- un contributeur ne peut créer qu’en son nom ;
- les validateurs et administrateurs pourront modifier toutes les déclinaisons ;
- un contributeur pourra modifier ses propres déclinaisons tant qu’elles ne sont pas archivées ;
- le rôle `viewer` reste en lecture seule.

## Compatibilité Odoo

Correspondance potentielle future :

- `channel_variants` vers un modèle Odoo `vlm.channel.variant`
- lien vers `vlm.master.content`
- lien vers un référentiel canal
- champs de publication spécifiques conservés comme attributs métier ou sous-modèles selon le connecteur final

Cette séparation évite de mélanger le contenu central, les déclinaisons par canal et les futurs services de publication.
