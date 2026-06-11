# VLM Content Studio

VLM Content Studio est une application metier marketing destinee au groupe VLM et a la BU Les Ateliers VLM.

L'application a vocation a aider les equipes a preparer, structurer, valider, planifier et publier des contenus multicanaux, avec une communication professionnelle, industrielle, premium, precise et orientee savoir-faire.

Ce repository est independant du site WordPress Les Ateliers VLM, du plugin Ateliers VLM Core et du theme enfant BeTheme Child.

## Vision produit

VLM Content Studio servira progressivement a :

- gerer des medias ;
- creer des fiches sources de contenu ;
- generer des contenus ;
- preparer des publications multicanales ;
- planifier les publications ;
- valider les contenus avant publication ;
- publier automatiquement ;
- piloter la strategie editoriale ;
- alimenter WordPress et les reseaux sociaux ;
- preparer une future migration vers un module Odoo Community.

## Stack validee

- Next.js App Router
- TypeScript
- Tailwind CSS
- Supabase
- Supabase Auth
- Supabase Storage
- PostgreSQL
- Vercel
- Zod

## Principes d'architecture

L'application doit separer clairement :

- le domaine metier ;
- l'interface utilisateur ;
- l'acces aux donnees ;
- les connecteurs externes ;
- les fournisseurs IA ;
- les services de publication.

Aucun ecran ne doit acceder directement a Supabase. Les acces aux donnees passeront par une couche `repositories`.

L'architecture doit aussi rester compatible avec une future migration vers Odoo Community. Les entites metier doivent donc etre nommees et documentees de maniere stable.

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

Cette structure est preparatoire. Elle ne contient pas encore de fonctionnalites metier.

## Modules futurs

- Utilisateurs
- Roles
- Parametres editoriaux
- Piliers de contenu
- Medias
- Fiches sources
- Contenu maitre
- Declinaisons multicanales
- Planning editorial
- Validation
- Connecteurs
- Tableau de bord

## Roles futurs

- Administrateur : gere les parametres, les utilisateurs, les roles, les connecteurs et les validations critiques.
- Validateur : relit, corrige, approuve ou refuse les contenus.
- Contributeur : cree des fiches sources, ajoute des medias et prepare des brouillons.
- Consultation : consulte les contenus, le planning et les tableaux de bord sans modifier.

## Workflow editorial futur

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

Les piliers doivent rester parametrables.

- Etudes de projet : 35 %
- Savoir-faire : 20 %
- Materiaux : 20 %
- Realisations : 10 %
- Actualites / evenements : 10 %
- Conseils / tendances : 5 %

L'application devra comparer :

- cible ;
- realise ;
- ecart.

## Categories WordPress futures

- Realisations
- Materiaux
- Evenements
- Actualites
- Etudes de projet

Ces categories sont documentees pour preparation. Aucune synchronisation WordPress n'est developpee au Sprint 0.

## Mention obligatoire pour les visuels IA

Pour tout visuel généré par IA, la mention obligatoire est :

> Visuel d’illustration réalisé dans le cadre d’une étude de projet.

## Principes IA

L'application doit prevoir une couche `AI Providers` independante des fournisseurs.

Aucun fournisseur IA ne doit etre code en dur dans la logique metier. Les futurs parametres prevus sont :

- `default_ai_provider`
- `default_text_model`

Les fournisseurs potentiels incluent OpenAI, Anthropic, Google Gemini, Ollama, Mistral et d'autres modeles.

## Roadmap

- Sprint 0 : architecture, documentation, conventions et preparation du repository.
- Sprint 1 : socle applicatif.
- Sprint 2 : referentiels.
- Sprint 3 : medias.
- Sprint 4 : fiches sources.
- Sprint 5 : contenu maitre.
- Sprint 6 : declinaisons multicanales.
- Sprint 7 : validation et planning.
- Sprint 8 : connecteur WordPress.
- Sprint 9 : connecteurs reseaux.
- Sprint 10 : tableau de bord.

## Documents de reference

- [Architecture](docs/architecture/architecture.md)
- [Architecture IA](docs/architecture/ai-providers.md)
- [Migration Odoo](docs/architecture/odoo-migration.md)
- [Conventions de developpement](docs/architecture/development-conventions.md)
- [Roadmap](docs/roadmap/sprints.md)
- [Decisions initiales](docs/decisions/0001-sprint-0-architecture.md)
