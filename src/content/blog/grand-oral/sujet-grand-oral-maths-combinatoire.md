---
title: "Sujet Grand Oral Maths : En quoi le jeu d'échecs constitue-t-il un modèle de la pensée combinatoire ?"
excerpt: >-
  Sujet entièrement rédigé pour le Grand Oral spécialité Maths : principe multiplicatif, nombre de Shannon, arbres
  de dénombrement, croissance exponentielle. Texte de 10 minutes prêt à réciter.
publishDate: "2026-05-05"
category: grand-oral
featured: false
featuredRank: 99
readingTime: 7 min
pillar: Grand Oral
tags:
  - grand-oral
  - mathématiques
  - terminale
  - baccalauréat
  - sujet
  - combinatoire
  - dénombrement
  - principe multiplicatif
  - nombre de Shannon
seoTitle: "Grand Oral Maths : fiche combinatoire et échecs"
seoDescription: "Fiche de révision sur la combinatoire aux échecs : arbre uniforme, demi-coups, ordre de grandeur de Shannon et distinctions à expliquer au jury."
ogImage: /images/og/sujet-grand-oral-maths-combinatoire-og.webp
heroImage:
  src: /images/blog/sujet-grand-oral-maths-combinatoire-hero.webp
  alt: >-
    L'entrée en bois d'un ancien bâtiment scolaire, avec un tableau noir posé sur un chevalet.
  credit: "Tokumeigakarinoaoshima, CC BY-SA 4.0, via Wikimedia Commons"
  sourceUrl: https://commons.wikimedia.org/wiki/File:Toyosato_Elementary_School_Old_Building_Conference_Room_Entrance_on_21st_July_2019.jpg
  license: CC BY-SA 4.0
noindex: true
---

## Fiche de révision : compter des suites de coups

Le développement complet de ce sujet est intégré au [guide Grand Oral Maths](/fr/blog/grand-oral-maths-spe-echecs/), dans la partie combinatoire. Cette fiche en conserve les distinctions à expliquer au jury.

Une branche de l’arbre représente un demi-coup, donc un mouvement d’un seul joueur. Avec un branchement uniforme b et une profondeur d, le modèle donne b^d feuilles. Le nombre total de nœuds inclut aussi les niveaux précédents.

Pour b = 35 et d = 80 :

$$\log_{10}(35^{80})=80\log_{10}(35)\approx123{,}53.$$

On obtient donc environ 3,35 × 10^123 suites dans ce modèle. Ce n’est ni le nombre de positions légales distinctes, ni un décompte exact de toutes les parties possibles. Plusieurs suites peuvent rejoindre la même position et le nombre de coups légaux varie.

## La distinction à défendre

L’ordre de grandeur 10^120 proposé par Shannon en 1950 est un repère historique de complexité de l’arbre des parties. Il ne résulte pas exactement du calcul 35^80. Ne change pas la valeur d’un exposant pour faire coïncider deux estimations issues d’hypothèses différentes.

Le décompte des positions légales est une autre question : Tromp rapporte une estimation d’environ 4,8 × 10^44. Une position n’est pas une partie ; une suite de coups est un chemin dans l’arbre.

## Préparer ton explication

Dessine un arbre à petit branchement pour montrer le principe multiplicatif. Définis le demi-coup, précise les hypothèses, puis explique pourquoi une estimation ne devient pas une preuve d’impossibilité de résoudre le jeu. Le guide propose le plan et les calculs développés ; adapte-les à un exposé de dix minutes.

## Sources

- Shannon, C. E. (1950). *Programming a Computer for Playing Chess*. Philosophical Magazine. [Article original](https://www.computerhistory.org/chess/doc-431614f453dde/).
- Tromp, J. (2021). *Number of legal chess positions*. [Estimation de l’auteur](https://tromp.github.io/chess/chess.html).
