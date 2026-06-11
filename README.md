# VLM Content Studio

VLM Content Studio est une application métier marketing destinée au groupe VLM et à la BU Les Ateliers VLM.

L’application a vocation à aider les équipes à préparer, structurer, valider, planifier et publier des contenus multicanaux, avec une communication professionnelle, industrielle, premium, précise et orientée savoir-faire.

Ce repository est indépendant du site WordPress Les Ateliers VLM, du plugin Ateliers VLM Core et du thème enfant BeTheme Child.

## Vision produit

VLM Content Studio servira progressivement à :

- gérer des médias ;
- créer des fiches sources de contenu ;
- générer des contenus ;
- préparer des publications multicanales ;
- planifier les publications ;
- valider les contenus avant publication ;
- publier automatiquement ;
- piloter la stratégie éditoriale ;
- alimenter WordPress et les réseaux sociaux ;
- préparer une future migration vers un module Odoo Community.

## Stack validée

- Next.js App Router
- TypeScript
- Tailwind CSS
- Supabase
- Supabase Auth
- Supabase Storage
- PostgreSQL
- Vercel
- Zod

## Principes d’architecture

L’application doit séparer clairement :

- le domaine métier ;
- l’interface utilisateur ;
- l’accès aux données ;
- les connecteurs externes ;
- les fournisseurs IA ;
- les services de publication.

Aucun écran ne doit accéder directement à Supabase. Les accès aux données passeront par une couche `repositories`.

L’architecture doit aussi rester compatible avec une future migration vers Odoo Community. Les entités métier doivent donc être nommées et documentées de manière stable.

## Responsabilités des dossiers

- `modules` : logique métier organisée par domaine fonctionnel.
- `repositories` : accès aux données uniquement.
- `services` : orchestration métier, génération, publication et automatisations.
- `infrastructure` : clients techniques externes Supabase, IA, connecteurs et stockage.

## Arborescence Sprint 0

```text
vlm-content-studio/
  app/
  modules/
    users/
    roles/
    editorial-settings/
    content-pillars/
    media/
    source-sheets/
    master-content/
    channel-variants/
    editorial-planning/
    validation/
    connectors/
    dashboard/
  shared/
    ui/
    domain/
    config/
    utils/
  infrastructure/
    supabase/
    ai-providers/
    external-connectors/
    publishing/
  repositories/
  services/
  supabase/
    migrations/
    seed/
    policies/
  types/
  docs/
    architecture/
    roadmap/
    decisions/
```

Cette structure est préparatoire. Elle ne contient pas encore de fonctionnalités métier.

## Modules futurs

- Utilisateurs
- Rôles
- Paramètres éditoriaux
- Piliers de contenu
- Médias
- Fiches sources
- Contenu maître
- Déclinaisons multicanales
- Planning éditorial
- Validation
- Connecteurs
- Tableau de bord

## Rôles futurs

- Administrateur : gère les paramètres, les utilisateurs, les rôles, les connecteurs et les validations critiques.
- Validateur : relit, corrige, approuve ou refuse les contenus.
- Contributeur : crée des fiches sources, ajoute des médias et prépare des brouillons.
- Consultation : consulte les contenus, le planning et les tableaux de bord sans modifier.

## Workflow éditorial futur

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

## Canaux

V1 :

- WordPress
- LinkedIn
- Pinterest
- Google Business

V2 :

- Instagram
- Facebook
- Newsletter

## Piliers de contenu initiaux

Les piliers doivent rester paramétrables.

- Études de projet : 35 %
- Savoir-faire : 20 %
- Matériaux : 20 %
- Réalisations : 10 %
- Actualités / événements : 10 %
- Conseils / tendances : 5 %

L’application devra comparer :

- cible ;
- réalisé ;
- écart.

## Catégories WordPress futures

- Réalisations
- Matériaux
- Événements
- Actualités
- Études de projet

Ces catégories sont documentées pour préparation. Aucune synchronisation WordPress n’est développée au Sprint 0.

## Mention obligatoire pour les visuels IA

Pour tout visuel généré par IA, la mention obligatoire est :

> Visuel d’illustration réalisé dans le cadre d’une étude de projet.

## Principes IA

L’application doit prévoir une couche `AI Providers` indépendante des fournisseurs.

Aucun fournisseur IA ne doit être codé en dur dans la logique métier. Les futurs paramètres prévus sont :

- `default_ai_provider`
- `default_text_model`

Les fournisseurs potentiels incluent OpenAI, Anthropic, Google Gemini, Ollama, Mistral et d’autres modèles.

## Roadmap

- Sprint 0 : architecture, documentation, conventions et préparation du repository.
- Sprint 1 : socle applicatif.
- Sprint 2 : référentiels.
- Sprint 3 : médias.
- Sprint 4 : fiches sources.
- Sprint 5 : contenu maître.
- Sprint 6 : déclinaisons multicanales.
- Sprint 7 : validation et planning.
- Sprint 8 : connecteur WordPress.
- Sprint 9 : connecteurs réseaux.
- Sprint 10 : tableau de bord.

## Documents de référence

- [Architecture](docs/architecture/architecture.md)
- [Architecture IA](docs/architecture/ai-providers.md)
- [Migration Odoo](docs/architecture/odoo-migration.md)
- [Conventions de développement](docs/architecture/development-conventions.md)
- [Roadmap](docs/roadmap/sprints.md)
- [Décisions initiales](docs/decisions/0001-sprint-0-architecture.md)

