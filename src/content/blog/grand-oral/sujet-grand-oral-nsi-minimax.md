---
title: "Sujet Grand Oral NSI : Comment un programme informatique peut-il jouer aux échecs ?"
excerpt: >-
  Sujet entièrement rédigé pour le Grand Oral spécialité NSI : récursivité, arbre de décision, fonction d'évaluation
  et minimax expliqués en 10 minutes prêtes à réciter, code Python commenté inclus.
publishDate: "2026-05-08"
category: grand-oral
featured: false
featuredRank: 99
readingTime: 8 min
pillar: Grand Oral
tags:
  - grand-oral
  - NSI
  - terminale
  - baccalauréat
  - sujet
  - minimax
  - récursivité
  - arbre de décision
  - Python
seoTitle: "Grand Oral NSI : fiche de révision minimax"
seoDescription: "Fiche de révision minimax : exemple Python à deux niveaux, perspective des scores et limites de l'évaluation, avec renvoi au code complet du guide NSI."
ogImage: /images/og/sujet-grand-oral-nsi-minimax-watermarked-og.webp
heroImage:
  src: /images/blog/sujet-grand-oral-nsi-minimax-watermarked-hero.webp
  alt: Un couloir d'établissement scolaire bordé de casiers métalliques.
  credit: Htetrasme, CC BY-SA 4.0, via Wikimedia Commons
  sourceUrl: https://commons.wikimedia.org/wiki/File:Corridor_in_Robert_E._Bell_school,_1990s.jpg
  license: CC BY-SA 4.0
noindex: true
---

## Fiche de révision : expliquer minimax

Le code autonome, la fonction d’évaluation et le plan d’exposé sont regroupés dans le [guide Grand Oral NSI](/fr/blog/guide-grand-oral-echecs-nsi/). Cette fiche sert à vérifier les idées avant de travailler le script complet.

Minimax suppose deux joueurs aux intérêts opposés, dans le cadre déterministe à information parfaite présenté ici. MAX choisit le score le plus élevé ; MIN le plus faible. Tous les scores doivent garder la même perspective, par exemple celle des Blancs.

## Un exemple que tu peux refaire

Considère deux réponses MIN sous une racine MAX. La première mène aux scores 3 et 5 ; sa valeur est 3. La seconde mène à 2 et 9 ; sa valeur est 2. La racine retient donc 3.

```python
arbre = ((3, 5), (2, 9))
score = max(min(reponses) for reponses in arbre)
print(score)  # 3
```

Ce petit exemple est exécutable. Il illustre deux niveaux de choix, sans prétendre constituer un moteur d’échecs.

## Ce que fait l’évaluation

Si la recherche s’arrête avant la fin de la partie, une fonction estime la qualité de la position. Cette estimation n’est pas une preuve de sa valeur sous jeu parfait. Un programme complet doit aussi générer les coups légaux et reconnaître les fins de partie.

Le guide fournit une classe de démonstration et une fonction `evaluer` définies. Il ne dépend plus d’un `bonus_position` absent. Pour ton oral, explique d’abord le score remonté sur le petit arbre, puis ce qui change quand les feuilles sont évaluées approximativement.

## La limite à annoncer

Avec un branchement uniforme b et une profondeur d, la recherche complète croît en O(b^d). Alpha-bêta permet des coupures sans changer le résultat du même minimax à la même profondeur. AlphaZero emploie une autre recherche, MCTS ; il n’a pas simplement « abandonné tout arbre ».

## Sources

- Russell, S., & Norvig, P. (2020). *Artificial Intelligence: A Modern Approach*. Pearson. [Recherche adversariale](https://aima.cs.berkeley.edu/4th-ed/pdfs/newchap06.pdf).
- Silver, D., et al. (2017). *Mastering Chess and Shogi by Self-Play with a General Reinforcement Learning Algorithm*. arXiv. [Préprint](https://arxiv.org/html/1712.01815v1).
