---
title: "Sujet Grand Oral Maths : Dans quelle mesure les probabilités permettent-elles de modéliser la performance aux échecs ?"
excerpt:
  "Modèle binomial, score attendu Elo et limites de convergence : des calculs à expliquer avec leurs hypothèses pour ton Grand Oral."
publishDate: "2026-05-05"
category: grand-oral
featured: false
featuredRank: 99
readingTime: 8 min
pillar: Grand Oral
tags:
  - grand-oral
  - mathématiques
  - terminale
  - baccalauréat
  - sujet
  - probabilités
  - loi binomiale
  - Elo
  - suite récurrente
  - convergence
seoTitle: "Grand Oral Maths : Elo, probabilités et limites du modèle"
seoDescription: "Loi binomiale, score attendu Elo et suites récurrentes : refais les calculs, précise les hypothèses et explique les limites du modèle au Grand Oral Maths."
ogImage: /images/og/sujet-grand-oral-maths-elo-probabilites-og.webp
heroImage:
  src: /images/blog/sujet-grand-oral-maths-elo-probabilites-hero.webp
  alt: >-
    Une salle de classe vide, tables et chaises groupées, murs couverts d'affiches.
  credit: "Escuela16de17, CC BY-SA 4.0, via Wikimedia Commons"
  sourceUrl: https://commons.wikimedia.org/wiki/File:3A_665.jpg
  license: CC BY-SA 4.0
---

Dans quelle mesure les probabilités permettent-elles de modéliser la performance aux échecs ? Tu peux partir d'un match fictif, puis montrer pourquoi le classement Elo demande un modèle différent. Cette distinction évite de confondre probabilité de victoire et score attendu.

## Un modèle binomial volontairement simplifié

Suppose dix parties indépendantes, sans nulle, avec une probabilité de victoire constante p. Si X compte les victoires, alors X suit une loi binomiale de paramètres 10 et p :

$$P(X=k)=\binom{10}{k}p^k(1-p)^{10-k}.$$

Avec p = 0,5, un calcul direct donne :

| Événement | Probabilité dans ce modèle |
|---|---:|
| Exactement cinq victoires | 252/1024 ≈ 24,61 % |
| Au moins six victoires | 386/1024 ≈ 37,70 % |
| Au plus quatre victoires | 386/1024 ≈ 37,70 % |

Les deux joueurs sont symétriques : chacun a la même probabilité de remporter le match. Comparer « au moins six » à « exactement cinq » oppose un ensemble de cinq résultats possibles à un seul. Cela ne révèle aucun avantage caché d'un joueur.

La probabilité de ne pas finir à cinq-cinq est 772/1024, soit environ 75,39 %. C'est une propriété du modèle choisi, pas une fréquence vérifiée des matchs réels.

## Pourquoi les nulles changent la question

Une partie d'échecs peut rapporter 1, 0,5 ou 0 point. Le score attendu E vérifie donc :

$$E=P(\text{victoire})+\frac12P(\text{nulle}).$$

Connaître E ne suffit pas à retrouver les trois probabilités. Par exemple, E = 0,5 est compatible avec 50 % de victoires et 50 % de défaites sans nulle, mais aussi avec 100 % de nulles. Ces situations n'ont pas la même variabilité.

Pour modéliser les points d'un match réel, il faut donc prévoir les nulles. Une loi binomiale des seules victoires ne décrit pas directement le score total.

## Une courbe pédagogique pour le score attendu

On utilise souvent l'approximation logistique :

$$E_A=\frac{1}{1+10^{(R_B-R_A)/400}}.$$

Pour R_A = 1600 et R_B = 1800, elle donne environ 0,2403. Lis « score attendu proche de 0,24 point », sans annoncer 24 % de chances de gagner. Le règlement FIDE fournit ses propres tables et modalités de calcul ; la courbe sert ici à expliquer la relation.

La mise à jour pédagogique s'écrit :

$$R'_A=R_A+K(S_A-E_A),$$

où S_A vaut 1, 0,5 ou 0. Avec K = 20 et une victoire, cet exemple donne une hausse théorique proche de 15,19 points avant les modalités officielles de calcul. K = 20 est une hypothèse de l'exemple, pas le coefficient de tous les joueurs.

Les coefficients FIDE peuvent notamment valoir 40, 20 ou 10 selon la situation. Les deux adversaires n'ayant pas nécessairement le même K, leurs variations ne sont pas toujours exactement opposées.

## Une suite récurrente n'est pas forcément convergente

Tu peux écrire la succession des cotes comme une suite récurrente aléatoire. Mais un coefficient K constant laisse les nouveaux résultats faire fluctuer la cote. Dire que l'espérance d'un écart est nulle ne prouve pas que chaque trajectoire converge vers une constante.

La loi des grands nombres concerne des moyennes sous des hypothèses précises ; elle ne démontre pas à elle seule la convergence de cette mise à jour non linéaire. La force peut aussi évoluer, les adversaires changer et les parties dépendre du contexte.

## Ta conclusion pour l'oral

Les probabilités rendent explicites les hypothèses et les limites d'une prévision. Elles ne transforment pas le classement en vérité exacte sur chaque résultat futur.

Pour tes dix minutes de présentation, montre le calcul binomial, puis la distinction entre victoire et score attendu, avant de discuter la suite récurrente. Prépare aussi un exemple où une hypothèse — indépendance, absence de nulle ou niveau constant — devient discutable.

## Sources

- FIDE (2024), *FIDE Rating Regulations effective from 1 March 2024*, section 8. [Tables et calcul officiels](https://handbook.fide.com/chapter/B022024). Les exemples numériques ci-dessus sont des calculs explicitement effectués sous les hypothèses indiquées.
- Ministère de l'Éducation nationale (2026), *Baccalauréat : comment se passe le Grand oral ?* [Format de l'épreuve](https://www.education.gouv.fr/reussir-au-lycee/baccalaureat-comment-se-passe-le-grand-oral-100028).
