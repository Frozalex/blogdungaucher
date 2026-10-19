---
title: "Sujet Grand Oral Maths : Dans quelle mesure les probabilités permettent-elles de modéliser la performance aux échecs ?"
excerpt:
  "Modèle binomial, score attendu Elo et limites de convergence : des calculs à expliquer avec leurs hypothèses pour ton Grand Oral."
publishDate: "2026-05-05"
category: grand-oral
featured: false
featuredRank: 99
readingTime: "7 min"
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
ogImage: /images/og/sujet-grand-oral-maths-elo-probabilites-watermarked-og.webp
heroImage:
  src: /images/blog/sujet-grand-oral-maths-elo-probabilites-watermarked-hero.webp
  alt: Une salle de classe vide, tables et chaises groupées, murs couverts
    d'affiches.
  credit: Escuela16de17, CC BY-SA 4.0, via Wikimedia Commons
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

## Présenter le calcul sans perdre les hypothèses

Dans le modèle de dix parties sans nulle, une séquence précise contenant cinq victoires et cinq défaites a pour probabilité $0,5^{10}$. Mais il existe plusieurs ordres possibles. Choisir les cinq places occupées par les victoires donne $\binom{10}{5}=252$. Le produit explique la valeur $252/1024$ ; ce n'est pas un nombre à réciter sans pouvoir le reconstruire.

L'indépendance signifie que connaître les résultats précédents ne change pas la probabilité de la prochaine victoire dans ce modèle. La probabilité constante signifie que l'on emploie le même $p$ à chaque partie. Dans un tournoi réel, la fatigue, la couleur ou l'identité de l'adversaire peuvent mettre ces hypothèses en défaut. Il faut expliquer laquelle on accepte pour rendre le calcul possible.

Tu peux présenter une simulation comme illustration : générer dix tirages indépendants, compter les succès et répéter. Des fréquences proches des valeurs théoriques apparaîtront avec un grand nombre de répétitions, sans égalité exacte imposée pour un échantillon fini. La simulation vérifie un programme et illustre le modèle ; elle ne valide pas l'hypothèse que de vraies parties seraient indépendantes.

## Avec les nulles, même espérance ne veut pas dire même risque

Construisons deux **modèles fictifs** de joueurs également cotés. Dans le modèle A, victoire et défaite ont chacune la probabilité $0,5$, sans nulle. Le score $Y$ vaut 0 ou 1, son espérance est $0,5$ et sa variance vaut $0,25$.

Dans le modèle B, les probabilités de victoire, nulle et défaite valent respectivement $0,25$, $0,50$ et $0,25$. L'espérance reste :

$$E(Y)=0,25\times1+0,50\times0,5+0,25\times0=0,5.$$

Mais $E(Y^2)=0,25+0,50\times0,25=0,375$, donc :

$$V(Y)=0,375-0,5^2=0,125.$$

Le modèle B présente une variance deux fois plus faible. Le score attendu est identique, tandis que la dispersion des résultats diffère. C'est une démonstration simple de la raison pour laquelle une cote ou une espérance ne décrit pas tout un match.

Si l'on suppose dix parties indépendantes avec ces mêmes lois, le score total a pour espérance 5 dans les deux modèles. Sa variance vaut 2,5 pour A et 1,25 pour B, par addition des variances de variables indépendantes. On ne peut pas employer cette addition sans discuter l'indépendance.

## Expliquer la forme de la courbe Elo

Note $d=R_A-R_B$. La courbe pédagogique devient $E(d)=1/(1+10^{-d/400})$. Pour $d=0$, le score attendu vaut $0,5$. Si l'écart devient très grand en faveur de A, la valeur se rapproche de 1 ; s'il devient très défavorable, elle se rapproche de 0. Elle ne les atteint pas pour une différence finie.

Pour $d=200$, on trouve environ $0,7597$. Pour $d=-200$, environ $0,2403$. Leur somme vaut 1 : $E(-d)=1-E(d)$. Cette symétrie concerne les scores attendus des deux camps, pas une disparition des nulles.

Le facteur 400 détermine l'échelle de la relation ; ce n'est pas une constante physique mesurée dans le cerveau des joueurs. La [FIDE](https://www.fide.com/new-fide-rating-and-title-regulations-come-into-effect/) précise les règles de son propre système et leurs dates d'application. À l'oral, présente la courbe comme un outil de modélisation, puis distingue les tables et modalités réglementaires. Les plateformes peuvent employer d'autres systèmes et d'autres populations de joueurs.

## Pourquoi la mise à jour réagit à la surprise

Dans l'exemple $K=20$, un joueur dont le score attendu vaut $0,75$ gagne 5 points s'il gagne : $20(1-0,75)=5$. S'il perd, il en perd 15 : $20(0-0,75)=-15$. S'il fait nulle, sa variation vaut −5. Ce sont des calculs pédagogiques, sans prétendre reproduire chaque arrondi et règle officielle.

Sous une loi fictive cohérente avec l'attente, par exemple 60 % de victoires, 30 % de nulles et 10 % de défaites, le score attendu est $0,60+0,30/2=0,75$. L'espérance de la variation vaut alors :

$$0,60\times5+0,30\times(-5)+0,10\times(-15)=0.$$

Une espérance nulle n'interdit donc pas les mouvements. Elle signifie que les variations se compensent en moyenne dans le modèle. Après une victoire isolée, le classement monte ; après une défaite isolée, il baisse. C'est précisément pourquoi « il converge grâce à la loi des grands nombres » exige une démonstration supplémentaire.

## Questions de jury et réponses à préparer

**« Pourquoi les échecs, sans dés, relèvent-ils des probabilités ? »** Les règles sont déterministes, mais on modélise notre incertitude sur des résultats humains. Le hasard du modèle et l'absence de tirage dans le jeu peuvent coexister.

**« Deux joueurs de même cote gagnent-ils chacun une partie sur deux ? »** Pas nécessairement. Le score attendu de $0,5$ inclut les nulles. Les deux modèles de variance donnent un contre-exemple calculé.

**« Que changer si les adversaires sont différents ? »** La probabilité constante devient discutable. Une somme de résultats indépendants de probabilités différentes n'est plus, en général, la même loi binomiale.

**« Peut-on prédire la prochaine partie avec certitude ? »** Non. Le modèle donne une distribution ou une espérance conditionnelle à des hypothèses. Le résultat unique ne prouve ni son exactitude ni sa fausseté ; il faut examiner un ensemble de prévisions et leurs résultats.

Pour préparer ton exposé, choisis deux démonstrations que tu sais expliquer entièrement. Un calcul de variance maîtrisé est plus défendable qu'une liste de théorèmes de convergence dont tu ne peux pas préciser les hypothèses.

## Ta conclusion pour l'oral

Les probabilités rendent explicites les hypothèses et les limites d'une prévision. Elles ne transforment pas le classement en vérité exacte sur chaque résultat futur.

Pour tes dix minutes de présentation, montre le calcul binomial, puis la distinction entre victoire et score attendu, avant de discuter la suite récurrente. Prépare aussi un exemple où une hypothèse, comme l’indépendance, l’absence de nulle ou le niveau constant, devient discutable.

## Sources

- FIDE (2024), *FIDE Rating Regulations effective from 1 March 2024*, section 8. [Tables et calcul officiels](https://handbook.fide.com/chapter/B022024). Les exemples numériques ci-dessus sont des calculs explicitement effectués sous les hypothèses indiquées.
- Ministère de l'Éducation nationale (2026), *Baccalauréat : comment se passe le Grand oral ?* [Format de l'épreuve](https://www.education.gouv.fr/reussir-au-lycee/baccalaureat-comment-se-passe-le-grand-oral-100028).
