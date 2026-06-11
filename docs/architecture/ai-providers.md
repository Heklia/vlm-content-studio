# Architecture IA

## Objectif

VLM Content Studio devra pouvoir utiliser des modèles IA pour assister la génération de contenus.

Le Sprint 0 ne développe aucun connecteur IA. Il prépare seulement une architecture indépendante des fournisseurs.

## Principe majeur

Aucun fournisseur IA ne doit être codé en dur dans la logique métier.

La logique métier doit demander une intention, par exemple :

- générer un contenu maître ;
- reformuler pour LinkedIn ;
- proposer un titre WordPress ;
- préparer une description Pinterest ;
- synthétiser une fiche source.

La sélection du fournisseur et du modèle doit rester une décision de configuration.

## Couche `AI Providers`

La future couche `infrastructure/ai-providers` devra isoler les fournisseurs :

- OpenAI ;
- Anthropic ;
- Google Gemini ;
- Ollama ;
- Mistral ;
- autres modèles.

## Paramètres futurs

Les paramètres suivants sont prévus :

- `default_ai_provider`
- `default_text_model`

Ils pourront être stockés plus tard dans les paramètres éditoriaux ou techniques de l’application.

## Responsabilités attendues

La couche IA devra gérer :

- la sélection du fournisseur ;
- la sélection du modèle ;
- la normalisation des entrées ;
- la normalisation des sorties ;
- la journalisation des générations ;
- la conservation du prompt utilisé ;
- la traçabilité des contenus générés.

## Ce qui est exclu du Sprint 0

Le Sprint 0 ne doit pas :

- appeler une API IA ;
- stocker une clé API ;
- créer un prompt opérationnel ;
- générer du contenu ;
- développer un connecteur IA.

## Mention obligatoire pour les visuels IA

Pour tout visuel généré par IA, la mention obligatoire est :

> Visuel d’illustration réalisé dans le cadre d’une étude de projet.

Cette mention devra être appliquée plus tard dans les modules médias, contenus générés et publications.

