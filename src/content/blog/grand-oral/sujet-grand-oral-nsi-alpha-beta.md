---
title: "Sujet Grand Oral NSI : En quoi l'élagage alpha-bêta illustre-t-il l'optimisation d'une recherche arborescente ?"
excerpt: >-
  Sujet entièrement rédigé pour le Grand Oral spécialité NSI : optimisation algorithmique, élagage alpha-bêta,
  réduction de complexité O(b^d) à O(b^(d/2)), code Python commenté. Texte de 10 minutes prêt à réciter.
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
  - alpha-bêta
  - élagage
  - optimisation
  - complexité
  - Python
seoTitle: "Grand Oral NSI : fiche sur l'élagage alpha-bêta"
seoDescription: "Fiche de révision alpha-bêta : expliquer une coupure, comprendre la conservation du score minimax et nuancer le gain de calcul, avec renvoi au guide NSI."
ogImage: /images/og/sujet-grand-oral-nsi-alpha-beta-watermarked-og.webp
heroImage:
  src: /images/blog/sujet-grand-oral-nsi-alpha-beta-watermarked-hero.webp
  alt: Les rayonnages ordonnés d'une bibliothèque universitaire moderne.
  credit: Szalax, CC0, via Wikimedia Commons
  sourceUrl: https://commons.wikimedia.org/wiki/File:University_of_Miskolc_Library_Reading_Room_2025_03.jpg
  license: CC0
noindex: true
---

## Fiche de révision : comprendre une coupure alpha-bêta

Le code complet et exécutable sur un arbre de démonstration est intégré au [guide Grand Oral NSI](/fr/blog/guide-grand-oral-echecs-nsi/). Commence par la [fiche minimax](/fr/blog/sujet-grand-oral-nsi-minimax/) si le principe de remontée des scores n’est pas encore clair.

Alpha-bêta garde le résultat de minimax à la même profondeur et avec la même évaluation. Il évite d’explorer des branches qui ne peuvent plus modifier un choix déjà disponible à un ancêtre.

## Montrer une coupure au jury

La racine MAX a déjà obtenu une valeur 3 sur une première branche. Dans une deuxième branche MIN, une première feuille vaut 2. MIN peut donc obtenir au plus 2 dans cette branche, quelle que soit la valeur des autres feuilles. MAX possède déjà 3 ailleurs : les feuilles restantes ne changeront pas son choix.

Alpha est une borne inférieure disponible pour MAX ; bêta une borne supérieure disponible pour MIN, dans la même échelle de scores. La condition de coupure est beta ≤ alpha. Elle peut se rencontrer à un nœud MAX comme à un nœud MIN.

## Expliquer le gain sans le promettre

Le coût de minimax sur un arbre uniforme est O(b^d). Avec un tri idéal des coups, alpha-bêta atteint O(b^(d/2)) ; dans le pire cas, il peut conserver le coût de minimax. Ce sont des ordres de grandeur asymptotiques, pas une garantie de temps d’exécution.

Pour b = 35 et d = 6, comparer seulement les puissances donne un rapport 35^3 = 42 875. Ne présente pas ce rapport comme un gain exactement mesuré : le décompte précis dépend de l’arbre, de sa profondeur et de l’ordre des coups.

## Comparer correctement avec AlphaZero

Le préprint de Silver et collègues décrit AlphaZero comme un réseau appris par autojeu associé à MCTS. Il change la manière de guider la recherche ; il continue à explorer un arbre. Le contraste historique avec Stockfish 8 ne décrit pas à lui seul tous les moteurs actuels.

Pour dix minutes d’exposé, le guide propose un plan. Cette fiche se concentre sur la coupure ; tu peux l’utiliser comme aide de révision et refaire l’exemple de scores à la main.

## Sources

- Russell, S., & Norvig, P. (2020). *Artificial Intelligence: A Modern Approach*. Pearson. [Alpha-bêta et ordre des coups](https://aima.cs.berkeley.edu/4th-ed/pdfs/newchap06.pdf).
- Silver, D., et al. (2017). *Mastering Chess and Shogi by Self-Play with a General Reinforcement Learning Algorithm*. arXiv. [Préprint](https://arxiv.org/html/1712.01815v1).
