---
title: "Grand oral spé Maths : les échecs comme terrain d'application du programme de terminale"
excerpt:
  "Combinatoire, score attendu Elo et suites : choisir un modèle, refaire ses calculs et expliquer ses limites pendant ton Grand Oral."
publishDate: "2026-04-28"
category: "grand-oral"
featured: false
featuredRank: 99
readingTime: "22 min"
pillar: "Cognition"
tags: ["grand-oral", "mathématiques", "terminale", "spécialité maths", "combinatoire", "loi binomiale", "suites", "Elo", "algorithme", "baccalauréat"]
seoTitle: "Grand oral spé Maths : échecs et programme de terminale, plan complet"
seoDescription: "Préparer un Grand Oral de spécialité Maths sur les échecs : combinatoire, probabilités, score attendu Elo et minimax, avec exemples et questions de jury."
ogImage: /images/og/grand-oral-maths-spe-echecs-watermarked-og.webp
heroImage:
  src: /images/blog/grand-oral-maths-spe-echecs-watermarked-hero.webp
  alt: Une salle de cours dont les murs sont couverts de tableaux noirs remplis de
    calculs.
  credit: Anthony J. Bentley, Public domain, via Wikimedia Commons
  sourceUrl: https://commons.wikimedia.org/wiki/File:Blackboards_%E2%80%93_UNM_Astrophysics.JPG
  license: Public domain
faq:
  - question: "Le score attendu est-il une probabilité de victoire ?"
    answer: "Non. Il additionne la probabilité de victoire et la moitié de la probabilité de nulle."
  - question: "La cote converge-t-elle forcément ?"
    answer: "Non. Un K constant laisse des fluctuations ; une correction en moyenne ne suffit pas à prouver la convergence de chaque trajectoire."
  - question: "Combien de temps dure la présentation ?"
    answer: "Dix minutes, suivies de dix minutes d'échange, après vingt minutes de préparation."
  - question: "35 puissance 80 compte-t-il les positions légales ?"
    answer: "Non. Il compte les feuilles d'un arbre régulier hypothétique ; ce n'est pas un dénombrement exact du jeu."
---

Les échecs te donnent des exemples de dénombrement, de probabilités et de suites. Pour un Grand Oral, choisis une question centrale : un modèle devient intéressant quand tu peux expliquer son calcul et ce qu'il laisse de côté.

Ce guide rassemble plusieurs pistes. Tu n'as pas à tout présenter pendant l'épreuve.

## Le format de ta présentation

Le ministère décrit vingt minutes de préparation, puis dix minutes de présentation et dix minutes d'échange. Le jury choisit une de tes deux questions. Tu peux préparer et utiliser un support dans les conditions prévues par l'épreuve. Il n'existe plus de troisième phase distincte de cinq minutes sur l'orientation.

Choisis une question liée à tes enseignements, avec ton professeur. Aucun quota universel de calculs à faire de tête ne remplace la maîtrise des hypothèses et de l'argumentation.

## Combinatoire : que compte-t-on ?

Depuis la position initiale, les Blancs ont vingt coups légaux et les Noirs vingt réponses à chacun. Cela donne 400 suites de deux demi-coups. Dans cet exemple particulier, elles conduisent aussi à 400 positions distinctes ; cette égalité ne se généralise pas à tous les niveaux.

Un demi-coup est le coup d'un seul joueur. Dans un arbre régulier hypothétique avec b choix à chaque étape et une profondeur d, le nombre de feuilles est $b^d$. Le nombre total de nœuds inclut les niveaux précédents.

Pour b = 35 et d = 80, on calcule :

$$\log_{10}(35^{80})=80\log_{10}(35)\approx123,5254.$$

Donc $35^{80}\approx3,35\times10^{123}$. Il s'agit d'un modèle de suites, sans décompte exact des parties légales. Le branchement varie réellement, des parties se terminent plus tôt et des ordres de coups différents peuvent rejoindre une même position.

Shannon (1950) propose un ordre de grandeur historique d'environ $10^{120}$ sous ses hypothèses. Ne le présente ni comme une égalité avec $35^{80}$ ni comme un nombre exact de positions.

### Arrangements et combinaisons : une analogie limitée

Choisir cinq objets distincts parmi vingt en tenant compte de l'ordre donne $20\times19\times18\times17\times16=1\,860\,480$ arrangements. Sans tenir compte de l'ordre, le nombre de choix est $\binom{20}{5}=15\,504$.

Ces calculs portent sur un ensemble fixe d'objets. Ils ne comptent pas les cinq premiers coups blancs d'une partie : les coups disponibles changent et dépendent des réponses noires. Tu peux utiliser l'analogie pour expliquer les notions, puis montrer pourquoi elle ne décrit pas directement un arbre légal.

## Probabilités : un match fictif sans nulles

Suppose quatorze parties indépendantes, sans nulle, avec une probabilité de victoire constante p = 0,5. Si X compte les victoires d'un joueur, alors :

$$P(X=k)=\binom{14}{k}2^{-14}.$$

| Calcul dans ce modèle | Valeur arrondie |
| --- | ---:|
| Exactement sept victoires | 20,95 % |
| Au moins huit victoires | 39,53 % |
| Exactement dix victoires | 6,11 % |

L'espérance vaut 7 et l'écart-type $\sqrt{3,5}\approx1,87$. Les probabilités se calculent par sommation de la loi ; un intervalle « moyenne ± deux écarts-types » n'est pas automatiquement une garantie exacte de 95 % dans cette loi discrète.

Ce modèle permet d'expliquer un calcul, sans établir que les résultats d'un vrai championnat sont indépendants ou qu'il n'y a pas de nulles.

## Elo : le score attendu inclut les nulles

Pour une partie réelle, le score S vaut 1, 0,5 ou 0. Son espérance est :

$$E(S)=P(\text{victoire})+\frac12P(\text{nulle}).$$

La courbe pédagogique usuelle s'écrit :

$$E_A=\frac{1}{1+10^{(R_B-R_A)/400}}.$$

Un écart de −200 points donne environ 0,2403 point attendu, et un écart de −400 environ 0,0909. Ce ne sont pas séparément des probabilités de victoire. Le règlement FIDE fournit ses tables et ses modalités de calcul ; la courbe sert ici à expliquer la relation.

Pour voir pourquoi E ne suffit pas à décrire les résultats, compare deux modèles à E = 0,5 : toutes les parties nulles, ou autant de victoires que de défaites sans nulle. Leurs espérances sont égales et leurs variances différentes.

Si tu choisis, à titre d'exemple, 30 % de victoires, 40 % de nulles et 30 % de défaites, tu obtiens $E(S)=0,5$, $E(S^2)=0,4$ et $\mathrm{Var}(S)=0,15$. Ces proportions sont des hypothèses pédagogiques, pas des fréquences générales vérifiées.

## Une suite récurrente aléatoire

Une mise à jour simplifiée s'écrit :

$$u_{n+1}=u_n+K(S_n-E_n).$$

La nouvelle cote dépend de la précédente, du résultat et du score attendu face à l'adversaire. Le règlement FIDE prévoit notamment des coefficients 40, 20 et 10 selon la situation, avec des dispositions particulières. Il ne faut pas annoncer 16 et 32 comme coefficients FIDE actuels.

Un K plus élevé donne plus de poids au nouvel écart entre résultat et attente. Mais avec K constant, les résultats continuent à faire fluctuer la cote. Une correction de signe favorable en moyenne ne prouve ni monotonie de chaque trajectoire ni convergence certaine vers une « vraie force » fixe.

La loi des grands nombres porte sur des moyennes sous des hypothèses précises. Elle ne transforme pas cette mise à jour non linéaire en suite convergente sans démonstration supplémentaire. La progression du joueur et le changement des adversaires compliquent encore le modèle.

## Le pont vers l'algorithmique

Le minimax permet d'étudier une décision en faisant remonter des valeurs dans un arbre. À profondeur limitée, l'évaluation des feuilles non terminales est une approximation. Sur un arbre régulier, le coût naïf est de l'ordre de $O(b^d)$.

Avec un ordre idéal des coups, alpha-bêta peut atteindre l'ordre de grandeur $O(b^{d/2})$ ; son pire cas reste $O(b^d)$. Ces puissances ne donnent pas le nombre exact de tous les appels d'un programme réel.

Fraenkel et Lichtenstein (1981) étudient une généralisation des échecs sur des échiquiers de taille variable et obtiennent un résultat EXPTIME-complet. Ce résultat asymptotique ne démontre pas l'impossibilité future de résoudre l'instance fixe 8 × 8.

De même, le nombre de suites du modèle de Shannon ne constitue pas une borne inférieure sur toutes les méthodes de résolution possibles. AlphaZero (Silver et collègues, 2017) illustre une recherche guidée par apprentissage ; sa performance en match n'est pas une preuve de la valeur théorique initiale.

## Deux fiches intégrées : combinatoire et limites des modèles

Les développements des fiches [combinatoire](/fr/blog/sujet-grand-oral-maths-combinatoire/) et [modèles et limites](/fr/blog/sujet-grand-oral-maths-modeles-limites/) sont regroupés dans ce guide. Leurs pages restent des points d'entrée courts.

Pour la combinatoire, retiens la distinction entre feuilles, suites et positions. Pour les modèles, distingue une hypothèse commode d'une observation : branchement constant, indépendance et niveau constant doivent être annoncés avant le calcul.

La loi des grands nombres ne prévoit pas une victoire compensatrice après plusieurs défaites. Une durée d'entraînement d'AlphaZero sans le matériel et le protocole ne permet pas non plus de comparer des coûts.

## Trois questions possibles

- Comment un arbre de dénombrement aide-t-il à comprendre les limites d'une exploration exhaustive ?
- Pourquoi le score attendu Elo ne suffit-il pas à prédire l'issue d'un match ?
- Que permet d'expliquer une suite de mises à jour Elo, sans supposer sa convergence ?

Pour les développements ciblés, consulte le [sujet Elo et probabilités](/fr/blog/sujet-grand-oral-maths-elo-probabilites/) et le [sujet Zermelo et complexité](/fr/blog/sujet-grand-oral-maths-zermelo-complexite/).

## Un plan à répéter en dix minutes

| Durée indicative | Étape |
| --- | --- |
| 1 min | Question et objet compté ou modélisé |
| 3 min | Définition des hypothèses et premier calcul |
| 3 min | Deuxième exemple ou contre-exemple |
| 2 min | Limites et lien avec la question |
| 1 min | Réponse et ouverture délimitée |

Choisis l'un des axes. Tu n'as pas à comprimer combinatoire, Elo, suites et moteurs dans la même démonstration. Prépare les calculs et une explication orale de chaque symbole.

Pour l'échange, entraîne-toi à répondre à ces questions : pourquoi ce modèle ? Où interviennent les nulles ? Qu'est-ce qui est calculé exactement ? Qu'est-ce qui n'est pas démontré ? Une limite expliquée vaut mieux qu'une preuve annoncée mais absente.

## Sources

- Ministère de l'Éducation nationale (2026), *Baccalauréat : comment se passe le Grand oral ?* [Format officiel](https://www.education.gouv.fr/reussir-au-lycee/baccalaureat-comment-se-passe-le-grand-oral-100028).
- FIDE (2024), *FIDE Rating Regulations effective from 1 March 2024*, section 8. [Tables et coefficients](https://handbook.fide.com/chapter/B022024).
- Shannon, C. E. (1950), *Programming a Computer for Playing Chess*, Philosophical Magazine, 41, 256–275. [Article](https://d1yx3ys82bpsa0.cloudfront.net/chess/programming-a-computer-for-playing-chess.shannon.062303002.pdf).
- Russell, S. et Norvig, P. (s. d.), *Adversarial Search*, projet de chapitre d'Artificial Intelligence: A Modern Approach, Berkeley. [Texte](https://aima.cs.berkeley.edu/4th-ed/pdfs/newchap06.pdf).
- Fraenkel, A. S. et Lichtenstein, D. (1981), *Computing a perfect strategy for n×n chess requires time exponential in n*, Journal of Combinatorial Theory A, 31, 199–214. [Article](https://kubokovac.eu/zlozitost/mat/chessExptime.pdf).
- Silver, D. et al. (2017), *Mastering Chess and Shogi by Self-Play with a General Reinforcement Learning Algorithm*, préprint arXiv. [Article](https://arxiv.org/html/1712.01815v1).
