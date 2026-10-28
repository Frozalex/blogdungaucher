---
title: "Décision sous incertitude aux échecs : choisir sans connaître toutes les variantes"
excerpt: "Les échecs sont à information parfaite, mais ton analyse reste limitée. Tu décides toujours sans calculer jusqu'au bout, sans savoir ce que l'adversaire va répondre, sans certitude sur ton évaluation. Les outils de la théorie de la décision permettent de préciser les hypothèses, les objectifs et les limites de ce choix."
publishDate: "2026-11-05"
category: "science"
featured: false
featuredRank: 99
affiliate: true
readingTime: "7 min"
pillar: "Théorie de la décision"
tags: ["décision sous incertitude", "échecs", "utilité espérée", "Bayes", "Kahneman", "Simon", "rationalité limitée"]
seoTitle: "Décision sous incertitude aux échecs : utilité espérée, Bayes et rationalité limitée"
seoDescription: "Utilité espérée, critère bayésien, aversion à la perte, rationalité limitée : la décision appliquée quand tu choisis un coup dans l'incertitude."
heroImage:
  src: /images/blog/decision-sous-incertitude-aux-echecs-hero.webp
  alt: Des chemins partent d’un seuil de pierre et disparaissent dans la brume.
ogImage: /images/og/decision-sous-incertitude-aux-echecs-og.webp

---

Décider aux échecs suppose de choisir malgré un calcul limité et une évaluation parfois incertaine. Les règles et la position sont accessibles aux deux joueurs, mais les conséquences de chaque coup ne peuvent pas toujours être explorées jusqu'au bout dans le temps disponible.

Il faut donc distinguer l'information parfaite au sens de la théorie des jeux et la connaissance effective du joueur. La question est de construire une décision raisonnable à partir des candidats examinés, des réponses anticipées et des limites de l'analyse.

## Information parfaite, analyse incomplète

Au sens de la théorie des jeux, les échecs sont à information parfaite : les actions jouées et l'état du jeu sont accessibles aux deux camps. Cela ne te donne ni la valeur exacte de chaque position ni les intentions de l'adversaire.

Le chapitre de Russell et Norvig sur la recherche adversariale distingue précisément le calcul jusqu'aux issues terminales d'une recherche limitée avec évaluation heuristique. L'incertitude du joueur sur la suite ne transforme pas les règles en jeu de hasard.

Le résultat EXPTIME concerne une famille d'échecs généralisés ; il ne démontre pas une incapacité de résoudre chaque position 8×8. Pour cette distinction, vois [l'article sur la complexité](/fr/blog/pourquoi-echecs-probleme-mathematique-impossible-et-ia/).

## Une espérance exige un modèle

Si tu attribues une utilité $U(s)$ aux issues et une probabilité $p(s\mid a)$ à chacune sous l'action $a$, tu peux calculer :

$$E[U(a)]=\sum_s p(s\mid a)U(s).$$

Les nombres doivent correspondre au même objectif. Par exemple, avec victoire = 1 et défaite = 0, une chance hypothétique de victoire de 60 % donne une espérance de 0,6. Il faut intégrer les nulles si le modèle en prévoit.

Ce calcul n'extrait pas les probabilités d'une position. Elles viennent de données ou d'hypothèses qu'il faut expliquer. Un score moteur en centièmes de pion n'est ni une probabilité de victoire ni une utilité personnelle que tu pourrais moyenner sans justification.

## Minimax et chances pratiques

Minimax suppose que l'autre camp choisit sa meilleure continuation dans l'arbre étudié. Il cherche une garantie selon les valeurs utilisées, pas la réponse la plus probable d'un humain particulier.

Un autre modèle pourrait attribuer des probabilités aux coups adverses pour estimer un score pratique. Il dépendrait alors de sa calibration : contre qui, à quelle cadence, dans quelles positions ? Appeler un coup « solide » ne prouve pas sa valeur minimax, et un sacrifice peut être le seul choix qui résiste à la meilleure défense.

## Bayes : mettre à jour une hypothèse

La formule s'écrit, lorsque la probabilité des données est non nulle :

$$P(H\mid D)=\frac{P(D\mid H)P(H)}{P(D)}.$$

$P(H)$ est une probabilité a priori ; $P(D\mid H)$ est la vraisemblance des données si l'hypothèse est vraie. La mise à jour ne consiste pas à choisir librement un « poids de l'intuition » et un « poids du calcul ».

Tu peux employer cette idée pour construire un modèle de comportement adverse, à condition de définir les hypothèses et les observations. En revanche, dire que tous les grands maîtres mettent naturellement Bayes en œuvre ne serait pas démontré par leur seule expérience. [Les réseaux bayésiens](/fr/blog/reseaux-bayesiens-predire-blunder/) présentent une application explicite de la modélisation.

## Ce que tes préférences peuvent changer

Kahneman et Tversky (1979) étudient des choix sous risque et proposent une évaluation relative à un point de référence. Cela invite à interroger la façon dont tu ressens une perte matérielle ou un résultat inférieur à ton attente.

Leur article ne mesure pas le coût psychologique d'un pion ni un rapport universel de deux pour un dans les échecs. Il ne permet pas d'attribuer systématiquement chaque refus de nulle à une aversion à la perte. L'article dédié (article à venir) précise l'analogie et ses limites.

## Décider avec une pendule

Ton temps est limité ; un budget consacré à ce coup ne sera plus disponible au suivant. C'est une contrainte de décision réelle, sans qu'on puisse en déduire un barème universel de 1, 5 ou 20 minutes.

La valeur d'une minute supplémentaire n'est pas forcément décroissante à chaque instant : elle peut te permettre de découvrir une réfutation qui change tout. De même, garder des options ouvertes peut être utile, mais attendre peut aussi perdre un tempo décisif.

Pour travailler cette décision, essaie une routine simple : repère la menace adverse, formule quelques candidats, cherche ce qui pourrait réfuter ton choix et contrôle le temps restant. Ajuste le nombre de candidats et la durée à la cadence, plutôt qu'à un quota présenté comme scientifique.


## Trois incertitudes qui n'appellent pas le même outil

Tu peux ignorer **la valeur de la position** : le calcul est trop court pour savoir si une attaque fonctionne. Tu peux ignorer **la réponse probable de l'adversaire** : plusieurs coups sont légaux et plausibles. Tu peux enfin hésiter sur **ton objectif** : assurer la nulle ou rechercher une victoire nécessaire à la qualification. Calculer davantage ne résout pas automatiquement ces trois questions.

Le premier problème relève surtout de la recherche et de l'évaluation. Le deuxième demande un modèle de comportement, donc des données et des hypothèses. Le troisième demande une fonction d'utilité cohérente avec le tournoi. Cette distinction évite d'introduire des probabilités pour masquer une variante que l'on n'a pas vérifiée.

Dans le [chapitre de Russell et Norvig](https://aima.cs.berkeley.edu/4th-ed/pdfs/newchap06.pdf), la recherche adversariale formalise les décisions contre un autre agent. Une garantie sur un arbre évalué n'est pas une fréquence de victoire contre un humain. Ce cadre mathématique permet de préciser ce qui manque à l'analyse, sans prétendre connaître la pensée du joueur.

## Une espérance calculée, puis mise à l'épreuve

Voici un **exemple fictif** avec les points de tournoi. Le plan A est supposé donner 40 % de victoires, 40 % de nulles et 20 % de défaites. Son score attendu vaut $0,4+0,4/2=0,6$. Le plan B donne hypothétiquement 55 % de victoires, 5 % de nulles et 40 % de défaites, soit $0,55+0,05/2=0,575$.

Si tu maximises le score moyen, A est préféré. Si seule une victoire permet de te qualifier, B a une probabilité de victoire supérieure dans ce modèle. Le bon calcul dépend donc de l'objectif explicité. Les nombres restent inventés pour montrer cette différence ; ils ne proviennent d'aucune position évaluée.

Il faut ensuite examiner leur robustesse. Si la probabilité de victoire de B a été surestimée parce que tu pensais l'adversaire mal préparé, la préférence peut changer. Présenter un chiffre avec trois décimales ne rend pas une hypothèse fiable. Un intervalle de scénarios plausibles peut être plus honnête qu'une valeur unique trop précise.

## Bayes avec des nombres que tu peux refaire

Supposons, de manière **entièrement fictive**, deux types de préparation : H, l'adversaire a préparé cette variante, et non-H, il ne l'a pas préparée. Avant la partie, tu attribues 30 % à H. L'observation D est une réponse immédiate dans une position précise. Dans ton modèle, $P(D\mid H)=0,8$ et $P(D\mid\neg H)=0,2$.

La probabilité totale de D vaut $0,8\times0,3+0,2\times0,7=0,38$. Après l'observation :

$$P(H\mid D)=\frac{0,8\times0,3}{0,38}\approx0,632.$$

L'indice fait passer la croyance de 30 % à environ 63 %, sans donner la certitude. Mais les vraisemblances 0,8 et 0,2 sont des hypothèses. Une réponse rapide peut aussi venir d'un coup forcé ou d'une décision impulsive. Si tu changes ces hypothèses, le résultat change. La formule n'invente pas la qualité des informations d'entrée.

Ce calcul illustre la différence entre « j'ai un indice » et « je sais ». Il ne recommande pas de calculer des pourcentages à la pendule ni de chercher des signes dans chaque regard adverse.

## Combien vaut une vérification supplémentaire ?

Une minute peut être décisive si elle révèle une réfutation ; elle peut aussi répéter une suite déjà comprise. Avant de poursuivre, identifie la question restante : un échec intermédiaire, la reprise correcte ou l'évaluation d'une finale. Tu pourras mieux reconnaître ce qui justifie de continuer.

**Situation fictive :** deux candidats paraissent équivalents. Tu n'as pas besoin de comprendre toutes leurs suites pour jouer, mais tu dois contrôler que l'un ne perd pas une pièce immédiatement. Le temps doit d'abord répondre à cette différence d'enjeu. Dans une finale forcée, la même vérification superficielle ne suffirait pas.

Après la partie, distingue la décision et son issue. Un pari raisonnable dans ton modèle peut échouer ; un mauvais pari peut réussir grâce à une erreur adverse. Pour améliorer la prochaine décision, il faut évaluer les hypothèses disponibles au moment du choix, et non seulement le résultat connu après coup.

À l'analyse, reconstruis ce que tu savais au moment de jouer. Distingue une mauvaise estimation, une variante oubliée et une décision raisonnable dont l'issue a été défavorable. C'est une manière concrète d'améliorer ton jugement sans prétendre disposer de probabilités exactes pour chaque coup.

## Sources

- Russell, S. et Norvig, P. (s. d.), *Adversarial Search*, chapitre de manuel, [texte des auteurs](https://aima.cs.berkeley.edu/4th-ed/pdfs/newchap06.pdf).
- Kahneman, D. et Tversky, A. (1979), *Prospect Theory: An Analysis of Decision under Risk*, Econometrica, 47(2), 263–292, [original](https://web.mit.edu/curhan/www/docs/Articles/15341_Readings/Behavioral_Decision_Theory/Kahneman_Tversky_1979_Prospect_theory.pdf).
