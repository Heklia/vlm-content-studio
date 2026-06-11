# Décision 0002 - Sprint 1 socle applicatif

## Statut

Validée pour implémentation du socle.

## Contexte

Le Sprint 1 doit mettre en place le socle applicatif sans développer de fonctionnalité métier complète.

Les tables métier suivantes sont explicitement exclues du Sprint 1 :

- médias ;
- fiches sources ;
- piliers ;
- contenus ;
- planning.

## Décisions

- Initialiser l’application avec Next.js App Router, TypeScript et Tailwind CSS.
- Préparer Supabase Auth sans finaliser un parcours métier d’administration des utilisateurs.
- Créer uniquement les tables `user_profiles`, `app_settings`, `connector_settings` et `audit_logs`.
- Activer RLS sur toutes les tables applicatives.
- Préparer les rôles techniques `administrator`, `validator`, `contributor` et `viewer`.
- Créer une page `/settings` placeholder.
- Préparer les connecteurs sans les configurer ni les appeler.
- Préparer les fournisseurs IA sans les appeler.
- Ajouter les seeds initiaux pour les paramètres applicatifs et les connecteurs désactivés.

## Conséquences

- Le socle peut démarrer sans embarquer de logique métier prématurée.
- Les prochains sprints pourront ajouter les référentiels et modules métier sur des frontières déjà posées.
- Les paramètres IA et connecteurs restent configurables sans dépendance fournisseur.
- Les futures correspondances Odoo restent lisibles grâce aux tables métier stables du socle.

