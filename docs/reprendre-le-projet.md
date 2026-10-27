# Reprendre le projet sur un autre ordinateur

Le dépôt fournit un contexte transportable : le code représente l’état actuel,
les commits expliquent son évolution, `AGENTS.md` conserve les consignes du
projet, et les documents d’audit décrivent les problèmes et les décisions.
Les tests et la compilation permettent de vérifier ce contexte avant de modifier
le site. Une conversation antérieure n’est donc pas indispensable pour reprendre
une tâche suffisamment documentée.

Cela ne restitue pas les conversations privées des autres ordinateurs. Une
intention, une modification non poussée ou un fichier ignoré par Git reste absent
si aucune autre source accessible ne le fournit. Lors de la reprise du
27 octobre 2026, le message de départ et le rapport local cité ont aussi apporté
le contexte de l’audit ; le dépôt seul ne contenait pas ce rapport initial.

## Pour faciliter la prochaine reprise

- Pousser les changements utiles sur une branche et garder une PR avec un bilan.
- Conserver les règles durables dans `AGENTS.md` et les décisions dans `docs/`.
- Indiquer ce qui a été testé et ce qui reste à appliquer sur le serveur.
- Réinstaller les dépendances avec les fichiers de verrouillage, puis exécuter
  `npm test`, `npm run check`, `npm run build` et `npm run check:languages`.
- Reconfigurer séparément les secrets et services nécessaires : les variables
  locales, les accès VPS et les données des abonnés ne sont pas transportés
  automatiquement par un clone du dépôt.

Le bilan de cette reprise est dans
[Corrections de fiabilité du 27 octobre](corrections-fiabilite-2026-10-27.md).

La documentation officielle OpenAI décrit `AGENTS.md` comme un support de
consignes persistantes du dépôt et les documents de contexte comme des
conventions utiles pour les reprises :
https://developers.openai.com/cookbook/examples/codex/iterating-development-workflows-with-codex
