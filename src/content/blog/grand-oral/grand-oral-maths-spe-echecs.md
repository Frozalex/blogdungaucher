---
title: "Grand oral spé Maths : les échecs comme terrain d'application du programme de terminale"
excerpt:
  "Combinatoire, score attendu Elo et suites : choisir un modèle, refaire ses calculs et expliquer ses limites pendant ton Grand Oral."
publishDate: "2026-04-28"
category: "grand-oral"
featured: false
featuredRank: 99
readingTime: 15 min
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

### Retrouver la formule et préciser ce qu'elle mesure

Au niveau zéro, tu comptes la racine : une position de départ. Au niveau un d'un arbre régulier, tu comptes b enfants. Chacun donne b nouveaux enfants, donc le niveau deux contient $b\times b=b^2$ nœuds. Une récurrence donne $b^d$ au niveau d.

Si tu comptes tous les niveaux jusqu'à d, tu obtiens une somme géométrique. Pour $b\ne1$ :

$$N_d=1+b+b^2+\cdots+b^d=\frac{b^{d+1}-1}{b-1}.$$

La preuve tient en une soustraction : multiplier la somme par b décale tous les termes d'un rang ; dans $bN_d-N_d$, les termes intermédiaires s'annulent. Il reste $b^{d+1}-1$. Pour b = 2 et d = 3, le dernier niveau comporte 8 feuilles mais l'ensemble compte 15 nœuds. Dire « huit positions examinées » serait ambigu sans préciser si l'on compte seulement les feuilles.

Dans les échecs réels, le nombre de coups dépend du nœud. Une formule avec b constant n'est donc pas un comptage exact. Elle sert à étudier la croissance d'un modèle et à expliquer pourquoi ajouter de la profondeur peut coûter cher.

### Pourquoi les suites et les positions se séparent

Les suites `1. Nf3 Nf6 2. Nc3 Nc6` et `1. Nc3 Nc6 2. Nf3 Nf6` atteignent le même état dans cet exemple, en notation internationale. Les cavaliers sont sur les mêmes cases, le trait est identique, aucun pion n'a bougé et les droits de roque sont conservés. Tu as deux chemins dans l'arbre, mais un état d'arrivée commun : une transposition.

Cela donne un contre-exemple concret à l'idée selon laquelle chaque suite dénombrée créerait une position différente. Réunir les états communs conduit à représenter le jeu par un graphe. Cette possibilité ne rend pas le graphe petit par définition ; elle montre seulement que les deux objets comptés ne sont pas interchangeables.

Pour b = 35 et d = 80, on calcule :

$$\log_{10}(35^{80})=80\log_{10}(35)\approx123,5254.$$

Donc $35^{80}\approx3,35\times10^{123}$. Il s'agit d'un modèle de suites, sans décompte exact des parties légales. Le branchement varie réellement, des parties se terminent plus tôt et des ordres de coups différents peuvent rejoindre une même position.

Shannon (1950) propose un ordre de grandeur historique d'environ $10^{120}$ sous ses hypothèses. Ne le présente ni comme une égalité avec $35^{80}$ ni comme un nombre exact de positions.

### Arrangements et combinaisons : une analogie limitée

Choisir cinq objets distincts parmi vingt en tenant compte de l'ordre donne $20\times19\times18\times17\times16=1\,860\,480$ arrangements. Sans tenir compte de l'ordre, le nombre de choix est $\binom{20}{5}=15\,504$.

Ces calculs portent sur un ensemble fixe d'objets. Ils ne comptent pas les cinq premiers coups blancs d'une partie : les coups disponibles changent et dépendent des réponses noires. Tu peux utiliser l'analogie pour expliquer les notions, puis montrer pourquoi elle ne décrit pas directement un arbre légal.

### Lire correctement un ordre de grandeur

Le logarithme transforme une puissance difficile à écrire en multiplication. Si $\log_{10}N=123,5254$, la partie entière indique que N est compris entre $10^{123}$ et $10^{124}$. La partie décimale donne le facteur $10^{0,5254}$, environ 3,35. Cette explication montre comment retrouver la notation scientifique, au lieu de réciter un grand nombre.

Pour comparer deux quantités, utilise un rapport. Dans le modèle, passer de d à d + 1 multiplie le nombre de feuilles par b. Doubler d fait passer de $b^d$ à $b^{2d}=(b^d)^2$ : la croissance n'est pas linéaire. Ces relations suffisent à expliquer le coût de la profondeur, sans faire une comparaison cosmologique dont les hypothèses resteraient invisibles.

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

### Expliquer le coefficient binomial

La probabilité d'une suite précise de quatorze résultats, avec sept victoires et sept défaites, vaut $2^{-14}$ dans ce modèle. Mais les sept victoires peuvent occuper plusieurs places. Le coefficient $\binom{14}{7}$ compte ces choix de places. Les suites correspondantes sont des événements distincts ; on additionne donc leurs probabilités.

Pour « au moins huit victoires », il faut additionner les cas k = 8 à k = 14. Comme la loi est symétrique autour de 7 :

$$P(X\ge8)=\frac{1-P(X=7)}2.$$

Le cas d'égalité absorbe environ 20,95 % de la probabilité. Les deux joueurs n'ont donc pas chacun 50 % de chances de terminer strictement devant l'autre, même s'ils sont symétriques dans le modèle : il reste la possibilité de finir à égalité.

Cette distinction entre égalité, victoire dans le match et victoire dans une partie est un bon point de départ pour les questions du jury. Elle t'oblige à nommer l'événement avant de calculer.

## Elo : le score attendu inclut les nulles

Pour une partie réelle, le score S vaut 1, 0,5 ou 0. Son espérance est :

$$E(S)=P(\text{victoire})+\frac12P(\text{nulle}).$$

La courbe pédagogique usuelle s'écrit :

$$E_A=\frac{1}{1+10^{(R_B-R_A)/400}}.$$

Un écart de −200 points donne environ 0,2403 point attendu, et un écart de −400 environ 0,0909. Ce ne sont pas séparément des probabilités de victoire. Le règlement FIDE fournit ses tables et ses modalités de calcul ; la courbe sert ici à expliquer la relation.

Pour voir pourquoi E ne suffit pas à décrire les résultats, compare deux modèles à E = 0,5 : toutes les parties nulles, ou autant de victoires que de défaites sans nulle. Leurs espérances sont égales et leurs variances différentes.

Si tu choisis, à titre d'exemple, 30 % de victoires, 40 % de nulles et 30 % de défaites, tu obtiens $E(S)=0,5$, $E(S^2)=0,4$ et $\mathrm{Var}(S)=0,15$. Ces proportions sont des hypothèses pédagogiques, pas des fréquences générales vérifiées.

### Pourquoi un score attendu ne détermine pas une victoire

Notons v, n et l les probabilités de victoire, de nulle et de défaite. Elles vérifient $v+n+l=1$, avec des valeurs positives ou nulles. Le score attendu est $e=v+n/2$. Connaître e fournit une équation supplémentaire, mais ne fixe pas séparément trois probabilités.

Si tu choisis n, tu peux écrire $v=e-n/2$ et $l=1-e-n/2$. Pour que ces quantités restent positives ou nulles, il faut :

$$0\le n\le2\min(e,1-e).$$

Pour e = 0,6, on peut ainsi prendre v = 0,6, n = 0 et l = 0,4 ; ou v = 0,4, n = 0,4 et l = 0,2. Les deux modèles donnent le même score attendu, mais des probabilités de victoire différentes. Ce sont des exemples construits, pas des estimations concernant deux joueurs nommés.

L'argument est plus fort qu'un avertissement général : tu montres par le calcul que plusieurs distributions correspondent à une même espérance. La question n'est pas de savoir si la formule Elo « marche toujours », mais quelle information elle apporte et quelle information supplémentaire manque pour prédire un événement donné.

### Calculer un match avec des nulles

Reprenons l'hypothèse fictive v = 0,3, n = 0,4 et l = 0,3. Nous supposons quatorze parties indépendantes, avec ces probabilités constantes. Le total T n'est pas le nombre de victoires : chaque nulle ajoute un demi-point.

Pour éviter les indices fractionnaires, posons Y = 2S. Une défaite donne 0, une nulle 1 et une victoire 2. La distribution du total doublé se construit partie après partie. Si $p_m(j)$ est la probabilité d'avoir j unités après m parties :

$$p_{m+1}(j)=0,3p_m(j)+0,4p_m(j-1)+0,3p_m(j-2),$$

avec $p_0(0)=1$ et une probabilité nulle pour les indices impossibles. Chaque terme correspond à la dernière partie : défaite, nulle ou victoire. La formule vient de l'addition de trois cas incompatibles, en utilisant l'indépendance annoncée.

Ce code calcule la distribution avec des fractions exactes. Il utilise uniquement la bibliothèque standard de Python.

```python
from fractions import Fraction

distribution = {0: Fraction(1)}
issues = [(0, Fraction(3, 10)),
          (1, Fraction(4, 10)),
          (2, Fraction(3, 10))]

for _ in range(14):
    suivante = {}
    for total, probabilite in distribution.items():
        for gain, chance in issues:
            j = total + gain
            suivante[j] = suivante.get(j, Fraction(0)) + probabilite * chance
    distribution = suivante

egalite = distribution[14]  # 14 demi-points = 7 points
devant = sum((p for j, p in distribution.items() if j > 14), Fraction(0))
assert sum(distribution.values()) == 1
assert devant == (1 - egalite) / 2
print("Egalite :", round(100 * float(egalite), 2), "%")
print("Strictement devant :", round(100 * float(devant), 2), "%")
```

Tu peux modifier le nombre de parties ou les probabilités, puis expliquer ce qui change dans les hypothèses. Ce calcul est exact **dans le modèle**. Il ne prouve pas que la fatigue, la couleur, l'adaptation entre deux rondes ou les choix stratégiques d'un vrai match soient indépendants.

Par linéarité de l'espérance, $E(T)=14\times0,5=7$. Avec l'indépendance, les variances s'additionnent : $\mathrm{Var}(T)=14\times0,15=2,1$. Sans nulles, le modèle symétrique précédent avait une variance de 3,5. Une espérance identique peut donc s'accompagner d'une dispersion différente du score final.

## Une suite récurrente aléatoire

Une mise à jour simplifiée s'écrit :

$$u_{n+1}=u_n+K(S_n-E_n).$$

La nouvelle cote dépend de la précédente, du résultat et du score attendu face à l'adversaire. Le règlement FIDE entré en vigueur en mars 2024 prévoit notamment des coefficients 40, 20 et 10 selon la situation, avec des dispositions particulières. Pour une application officielle, utilise la version du règlement indiquée dans le Handbook et ses tables ; notre suite est un modèle pédagogique simplifié.

Un K plus élevé donne plus de poids au nouvel écart entre résultat et attente. Mais avec K constant, les résultats continuent à faire fluctuer la cote. Une correction de signe favorable en moyenne ne prouve ni monotonie de chaque trajectoire ni convergence certaine vers une « vraie force » fixe.

La loi des grands nombres porte sur des moyennes sous des hypothèses précises. Elle ne transforme pas cette mise à jour non linéaire en suite convergente sans démonstration supplémentaire. La progression du joueur et le changement des adversaires compliquent encore le modèle.

### Un exemple de mise à jour et ses conditions

Suppose u = 1600, un adversaire à 1600 et K = 20. La formule pédagogique donne E = 0,5. Une victoire conduit à 1610, une nulle laisse 1600 et une défaite conduit à 1590. La correction est proportionnelle à l'écart entre score obtenu et score attendu : une victoire attendue avec E proche de 1 produit un petit gain ; une victoire peu attendue produit un gain plus grand.

Si tu recalcules E après chaque partie face au même adversaire, gagner puis perdre n'annule pas exactement les deux changements : après la première victoire, ton score attendu a augmenté. Le modèle séquentiel donne environ 1599,71 après ces deux parties. Ce calcul ne décrit pas à lui seul le traitement officiel d'une période de classement, qui suit ses propres règles.

Pour comprendre la correction « en moyenne », notons q le score réellement attendu dans une situation donnée. À u et adversaire fixés, l'espérance de la variation vaut $K(q-E)$. Si le modèle attend moins que q, elle est positive. Si E = q, elle est nulle. Mais une variation moyenne nulle n'implique pas que chaque résultat laisse la cote inchangée : les victoires et défaites continuent à provoquer des mouvements.

Cette différence entre moyenne et trajectoire répond à une objection fréquente. Une suite aléatoire peut osciller alors même que son comportement moyen paraît stable. Pour parler de convergence, il faudrait formuler un modèle complet, préciser le choix de K et démontrer une propriété adaptée. Il est préférable de traiter correctement la suite simplifiée que de lui attribuer une garantie absente.

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

## Construire un exposé autour d'une seule démonstration

Pour la question « Le classement Elo permet-il de prédire le vainqueur d'un match ? », tu peux suivre un fil continu. Commence par définir le score d'une partie. Présente ensuite la courbe d'espérance, puis les deux distributions qui donnent e = 0,6 avec des probabilités de victoire différentes. Tu as alors démontré pourquoi l'espérance seule ne suffit pas.

Dans un second temps, choisis explicitement une distribution des trois issues et montre comment passer à plusieurs parties. Tu peux expliquer la récurrence avec un match de deux parties sur ton support, avant de mentionner le calcul de quatorze parties. Pour deux parties, une somme de 1 point peut venir d'une victoire et d'une défaite dans deux ordres, ou de deux nulles : on voit immédiatement pourquoi compter seulement les victoires ne suffit pas.

Enfin, distingue l'incertitude interne au modèle de la fragilité de ses hypothèses. Même si les probabilités étaient connues et constantes, l'issue resterait aléatoire. Si ces probabilités changent ou si les parties dépendent les unes des autres, le modèle choisi devient lui-même une approximation à examiner.

La conclusion peut répondre précisément : « Le score attendu relie des classements à une espérance. Pour calculer une probabilité de victoire dans le match, j'ai dû ajouter une répartition des issues et des hypothèses sur leur succession. » Tu montres ainsi une démarche mathématique complète : définition, calcul, contre-exemple et portée du résultat.

## Questions du jury : des réponses à démontrer

**Pourquoi utiliser des probabilités pour un jeu sans dés ?** Le règlement est déterministe, mais tu peux modéliser ton incertitude sur les décisions et les performances des joueurs. L'aléa appartient au modèle de résultats, pas à un tirage prévu par les règles du jeu.

**L'indépendance est-elle nécessaire pour additionner les espérances ?** Non. La linéarité de l'espérance ne l'exige pas. Elle intervient en revanche ici dans la loi binomiale, la récurrence construite avec des probabilités constantes et l'addition simple des variances sans termes de covariance.

**Après trois défaites, une victoire devient-elle plus probable ?** Pas dans le modèle indépendant à probabilité constante. Si tu proposes un effet de fatigue, d'adaptation ou de moral, tu changes le modèle et dois expliciter ce mécanisme.

**Pourquoi ne pas choisir directement une loi binomiale pour le score ?** Une partie avec nulle a trois valeurs de score. Le nombre de victoires peut suivre une loi binomiale sous les hypothèses adaptées, mais il ne représente pas à lui seul le total des points.

**Une grande puissance démontre-t-elle l'impossibilité de résoudre les échecs ?** Non. Elle décrit le coût d'une méthode d'exploration dans un modèle. Elle n'est pas une borne inférieure sur toutes les méthodes possibles.

**Que peux-tu faire vérifier sur ton support ?** Un petit arbre, les deux distributions de même espérance ou la récurrence sur deux parties. Choisis un calcul lisible dont tu peux expliquer chaque terme, plutôt qu'un résultat numérique inaccessible au raisonnement du jury.

## Sources

- Ministère de l'Éducation nationale (2026), *Baccalauréat : comment se passe le Grand oral ?* [Format officiel](https://www.education.gouv.fr/reussir-au-lycee/baccalaureat-comment-se-passe-le-grand-oral-100028).
- FIDE (2024), *FIDE Rating Regulations effective from 1 March 2024*, section 8. [Tables et coefficients](https://handbook.fide.com/chapter/B022024).
- Shannon, C. E. (1950), *Programming a Computer for Playing Chess*, Philosophical Magazine, 41, 256–275. [Article](https://d1yx3ys82bpsa0.cloudfront.net/chess/programming-a-computer-for-playing-chess.shannon.062303002.pdf).
- Russell, S. et Norvig, P. (s. d.), *Adversarial Search*, projet de chapitre d'Artificial Intelligence: A Modern Approach, Berkeley. [Texte](https://aima.cs.berkeley.edu/4th-ed/pdfs/newchap06.pdf).
- Fraenkel, A. S. et Lichtenstein, D. (1981), *Computing a perfect strategy for n×n chess requires time exponential in n*, Journal of Combinatorial Theory A, 31, 199–214. [Article](https://kubokovac.eu/zlozitost/mat/chessExptime.pdf).
- Silver, D. et al. (2017), *Mastering Chess and Shogi by Self-Play with a General Reinforcement Learning Algorithm*, préprint arXiv. [Article](https://arxiv.org/html/1712.01815v1).
