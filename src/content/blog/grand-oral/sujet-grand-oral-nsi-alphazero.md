---
title: "Sujet Grand Oral NSI : Pourquoi AlphaZero représente-t-il une rupture dans l'intelligence artificielle ?"
excerpt:
  "Réseau, recherche MCTS et auto-jeu : comprendre AlphaZero, son protocole de 2017 et ses différences avec MuZero et AlphaFold."
publishDate: "2026-05-08"
category: grand-oral
featured: false
featuredRank: 99
readingTime: 7 min
pillar: Grand Oral
tags:
  - grand-oral
  - NSI
  - terminale
  - baccalauréat
  - sujet
  - AlphaZero
  - intelligence artificielle
  - apprentissage par renforcement
  - réseaux de neurones
  - MCTS
seoTitle: "Sujet Grand Oral NSI AlphaZero échecs : texte complet à réciter"
seoDescription: >-
  Sujet Grand Oral NSI sur AlphaZero et l'apprentissage par renforcement, entièrement rédigé pour 10 minutes d'exposé.
  Réseaux de neurones, MCTS, rupture épistémologique : copie d'examen prête à utiliser.
ogImage: /images/og/sujet-grand-oral-nsi-alphazero-og.webp
heroImage:
  src: /images/blog/sujet-grand-oral-nsi-alphazero-hero.webp
  alt: >-
    Un espace de travail contemporain dans une bibliothèque, sous un plafond lumineux.
  credit: "Szalax, CC0, via Wikimedia Commons"
  sourceUrl: https://commons.wikimedia.org/wiki/File:University_of_Miskolc_Library_Reading_Room_2025_01.jpg
  license: CC0
---

Pourquoi AlphaZero représente-t-il une étape importante dans l'intelligence artificielle appliquée aux jeux ? Tu peux répondre en expliquant comment une recherche dans un arbre est associée à un apprentissage. L'enjeu n'est pas d'opposer une machine programmée à une machine qui n'aurait reçu aucune intervention humaine.

## Partir de la recherche classique

Un minimax attribue des valeurs aux feuilles puis fait remonter les choix des deux joueurs. Avec une profondeur limitée, une fonction d'évaluation estime les positions qui ne sont pas des fins de partie.

L'élagage alpha-bêta peut éviter certaines branches sans changer le résultat de cette recherche sous les mêmes hypothèses. Les moteurs réels ajoutent des choix de recherche et des optimisations ; ils ne parcourent pas uniformément toutes les positions.

Il faut aussi dater la comparaison. Le Stockfish 8 affronté en 2017 diffère du Stockfish actuel. L'annonce officielle de Stockfish 12 en 2020 documente l'adoption d'une évaluation par réseau NNUE. « Stockfish sans apprentissage contre AlphaZero avec apprentissage » n'est donc pas une opposition intemporelle.

## Un réseau qui guide la recherche

Dans le préprint AlphaZero de 2017, un réseau produit une politique sur les actions et une estimation de valeur. Il guide une recherche MCTS, qui équilibre l'exploration et l'utilisation des informations accumulées.

Le réseau évite d'avoir à jouer chaque simulation jusqu'à la fin avec des coups aléatoires : son estimation contribue à l'évaluation des feuilles. MCTS n'est donc pas ici un abandon de l'arbre, mais une autre manière d'en organiser l'exploration.

AlphaZero apprend par auto-jeu. Les résultats des parties et les distributions issues de la recherche fournissent des cibles d'entraînement. Cette boucle dépend de choix humains : règles, représentation, architecture, objectif et procédure d'apprentissage.

## Lire correctement le résultat de 2017

Le préprint rapporte 28 victoires, 72 nulles et aucune défaite sur 100 parties contre Stockfish 8. Cela représente 64 points sur 100, donc 64 % des points possibles, mais 28 % de victoires.

La comparaison utilise une minute par coup. La courbe d'apprentissage dépasse le niveau de Stockfish après environ quatre heures dans les conditions décrites ; ce repère n'est pas la durée totale de tous les entraînements ni une durée reproductible sur un ordinateur personnel.

Le résultat appartient à un protocole avec des versions et du matériel précis. Il ne suffit pas à classer toutes les versions ultérieures des deux approches.

## Généralité et limites

La même méthode est étudiée sur les échecs, le shogi et le go, avec des entraînements propres à chaque jeu. Un réseau entraîné aux échecs ne sait pas spontanément jouer aux autres.

MuZero est présenté dans un préprint de novembre 2019, environ deux ans après celui d'AlphaZero. Schrittwieser et ses collègues y associent la planification à un modèle appris des quantités utiles à la décision. Il ne s'agit pas d'une évolution publiée quelques mois après 2017.

Il faut enfin distinguer AlphaFold. Le document scientifique du comité Nobel présente la prédiction de structures protéiques comme une tâche distincte, avec ses méthodes et ses données. Ce n'est pas AlphaZero transféré directement aux protéines, ni une simulation générale de toute leur dynamique de repliement.

Le Nobel de chimie 2024 récompense David Baker pour la conception computationnelle de protéines, et Demis Hassabis et John Jumper pour la prédiction de structures. Omettre Baker fausse le partage du prix.

## Construire tes dix minutes

Présente une petite recherche à la main, explique les deux sorties du réseau puis la boucle d'auto-jeu. Termine par une limite : matériel, dépendance au domaine ou interprétation d'un protocole. Les prolongements vers MuZero et AlphaFold servent à comparer des tâches, pas à raconter une filiation technique unique.

Pour le détail de minimax et alpha-bêta, utilise le [guide NSI](/fr/blog/guide-grand-oral-echecs-nsi/).

## Sources

- Silver, D. et al. (2017), *Mastering Chess and Shogi by Self-Play with a General Reinforcement Learning Algorithm*, préprint arXiv. [Article](https://arxiv.org/html/1712.01815v1).
- Équipe Stockfish (2020), *Stockfish 12*, annonce officielle. [NNUE](https://stockfishchess.org/blog/2020/stockfish-12/).
- Schrittwieser, J. et al. (2019), *Mastering Atari, Go, Chess and Shogi by Planning with a Learned Model*, préprint arXiv. [Résumé original](https://arxiv.org/abs/1911.08265).
- Académie royale des sciences de Suède (2024), *Scientific Background on the Nobel Prize in Chemistry 2024*. [Document officiel](https://www.kva.se/app/uploads/2024/10/sciback_ke_en_24_vi3ng84ao4.pdf).
- Ministère de l'Éducation nationale (2026), *Baccalauréat : comment se passe le Grand oral ?* [Format](https://www.education.gouv.fr/reussir-au-lycee/baccalaureat-comment-se-passe-le-grand-oral-100028).
