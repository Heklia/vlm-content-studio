# Architecture IA

## Objectif

VLM Content Studio devra pouvoir utiliser des modeles IA pour assister la generation de contenus.

Le Sprint 0 ne developpe aucun connecteur IA. Il prepare seulement une architecture independante des fournisseurs.

## Principe majeur

Aucun fournisseur IA ne doit etre code en dur dans la logique metier.

La logique metier doit demander une intention, par exemple :

- generer un contenu maitre ;
- reformuler pour LinkedIn ;
- proposer un titre WordPress ;
- preparer une description Pinterest ;
- synthetiser une fiche source.

La selection du fournisseur et du modele doit rester une decision de configuration.

## Couche `AI Providers`

La future couche `infrastructure/ai-providers` devra isoler les fournisseurs :

- OpenAI ;
- Anthropic ;
- Google Gemini ;
- Ollama ;
- Mistral ;
- autres modeles.

## Parametres futurs

Les parametres suivants sont prevus :

- `default_ai_provider`
- `default_text_model`

Ils pourront etre stockes plus tard dans les parametres editoriaux ou techniques de l'application.

## Responsabilites attendues

La couche IA devra gerer :

- la selection du fournisseur ;
- la selection du modele ;
- la normalisation des entrees ;
- la normalisation des sorties ;
- la journalisation des generations ;
- la conservation du prompt utilise ;
- la tracabilite des contenus generes.

## Ce qui est exclu du Sprint 0

Le Sprint 0 ne doit pas :

- appeler une API IA ;
- stocker une cle API ;
- creer un prompt operationnel ;
- generer du contenu ;
- developper un connecteur IA.

## Mention obligatoire pour les visuels IA

Pour tout visuel généré par IA, la mention obligatoire est :

> Visuel d’illustration réalisé dans le cadre d’une étude de projet.

Cette mention devra etre appliquee plus tard dans les modules medias, contenus generes et publications.
