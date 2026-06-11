# Roadmap par sprints

## Sprint 0 - Architecture

Objectif :

- préparer le repository ;
- documenter l’architecture ;
- poser les conventions ;
- cadrer les modules futurs ;
- préparer la migration Odoo ;
- préparer l’architecture IA.

Livrables :

- structure projet ;
- README ;
- documentation architecture ;
- documentation IA ;
- documentation Odoo ;
- conventions de développement ;
- roadmap.

## Sprint 1 - Socle applicatif

Objectif :

- initialiser Next.js ;
- configurer TypeScript ;
- configurer Tailwind CSS ;
- préparer Supabase ;
- mettre en place le layout applicatif ;
- préparer l’authentification.

Livrables validés :

- application Next.js démarrable ;
- pages placeholders `/login`, `/dashboard` et `/settings` ;
- clients Supabase navigateur, serveur et middleware ;
- repositories pour profils, paramètres et connecteurs ;
- services d’authentification, permissions et paramètres ;
- migration Supabase pour `user_profiles`, `app_settings`, `connector_settings` et `audit_logs` ;
- seed initial des paramètres applicatifs et connecteurs désactivés.

## Sprint 2 - Référentiels

Objectif :

- paramétrer les rôles ;
- paramétrer les canaux ;
- paramétrer les piliers de contenu ;
- paramétrer les catégories WordPress ;
- préparer les paramètres éditoriaux.

Livrables validés :

- tables `channels`, `content_pillars`, `wordpress_categories` et `ai_providers` ;
- seeds initiaux des canaux V1/V2, piliers, catégories WordPress et fournisseurs IA ;
- pages référentiels en lecture seule ;
- séparation conservée entre canaux éditoriaux et connecteurs techniques ;
- aucun appel IA, aucune synchronisation WordPress et aucune fonctionnalité métier avancée.

## Sprint 3 - Médias

Objectif :

- gérer les médias ;
- préparer Supabase Storage ;
- documenter les droits ;
- tracer les visuels IA ;
- appliquer la mention obligatoire.

Livrables validés :

- table `media_assets` ;
- bucket privé `media-assets` ;
- upload réservé aux rôles `administrator`, `validator` et `contributor` ;
- lecture pour utilisateurs actifs ;
- page `/media` ;
- page `/media/new` ;
- mention IA obligatoire si le média est généré par IA ;
- aucun lien encore avec fiches sources, contenus ou planning.

## Sprint 4 - Fiches sources

Objectif :

- créer les fiches sources ;
- relier les médias ;
- associer les piliers ;
- préparer la matière de génération.

Livrables validés :

- tables `source_sheets`, `source_sheet_media` et `source_sheet_channels` ;
- pages `/source-sheets`, `/source-sheets/new` et `/source-sheets/[id]` ;
- association à un pilier de contenu ;
- association à une catégorie WordPress cible ;
- association à des médias existants ;
- association à des canaux cibles ;
- aucune génération IA, aucun contenu maître, aucun planning et aucune publication.

## Sprint 5 - Contenu maître

Objectif :

- produire un contenu maître à partir d’une fiche source ;
- garder la traçabilité ;
- préparer les validations.

## Sprint 6 - Déclinaisons multicanales

Objectif :

- préparer les variantes WordPress ;
- préparer les variantes LinkedIn ;
- préparer les variantes Pinterest ;
- préparer les variantes Google Business.

## Sprint 7 - Validation et planning

Objectif :

- appliquer le workflow éditorial ;
- gérer les statuts ;
- planifier les publications ;
- organiser les validations.

## Sprint 8 - Connecteur WordPress

Objectif :

- préparer l’envoi vers WordPress ;
- mapper les catégories ;
- tracer les publications ;
- gérer les erreurs.

## Sprint 9 - Connecteurs réseaux

Objectif :

- préparer LinkedIn ;
- préparer Pinterest ;
- préparer Google Business ;
- documenter Instagram, Facebook et Newsletter pour la V2.

## Sprint 10 - Tableau de bord

Objectif :

- suivre les publications ;
- comparer cible, réalisé et écart ;
- suivre les piliers de contenu ;
- suivre les canaux ;
- suivre les statuts.
