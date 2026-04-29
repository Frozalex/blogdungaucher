---
title: "Grand oral spé Maths : les échecs comme terrain d'application du programme de terminale"
excerpt: "Suites récurrentes, loi binomiale, combinatoire, espérance mathématique et algorithmique : comment chaque chapitre de terminale Maths trouve son illustration parfaite sur l'échiquier."
publishDate: "2026-04-28"
category: "grand-oral"
featured: false
featuredRank: 99
readingTime: "22 min"
pillar: "Cognition"
tags: ["grand-oral", "mathématiques", "terminale", "spécialité maths", "combinatoire", "loi binomiale", "suites", "Elo", "algorithme", "baccalauréat"]
seoTitle: "Grand oral spé Maths : échecs et programme de terminale, plan complet"
seoDescription: "Grand oral spécialité Maths avec les échecs : combinatoire, probabilités, suites récurrentes Elo, loi binomiale, algorithmique. Plan détaillé, formules et questions jury."
faq:
  - question: "Quelles notions du programme de terminale Maths peut-on illustrer avec les échecs ?"
    answer: "Les échecs couvrent les quatre grandes parties du programme de terminale Maths : la combinatoire et le dénombrement (nombre de Shannon, $10^{120}$ parties possibles), les probabilités et la loi binomiale (modélisation d'un tournoi, espérance de résultat Elo), les suites récurrentes (la mise à jour Elo est une suite $u_{n+1} = u_n + K(r_n - p_n)$), et l'algorithmique (minimax comme exemple de récursivité et de complexité)."
  - question: "Comment modéliser le classement Elo avec les suites en terminale Maths ?"
    answer: "Le classement Elo est une suite récurrente : $u_{n+1} = u_n + K(r_n - p_n)$, où $u_n$ est la cote après $n$ parties, $K$ est le coefficient d'ajustement (16 ou 32), $r_n$ est le résultat réel (1, 0.5 ou 0) et $p_n$ est la probabilité de victoire prédite par la formule logistique. Cette suite converge vers la 'vraie' force du joueur si celui-ci joue suffisamment. C'est une application directe du chapitre suites et convergence en terminale."
  - question: "Comment appliquer la loi binomiale aux tournois d'échecs pour un Grand Oral ?"
    answer: "Si deux joueurs de même force (p=0.5) s'affrontent dans un match de 10 parties, la probabilité que l'un d'eux gagne exactement k parties suit une loi binomiale B(10, 0.5). On peut calculer la probabilité de gagner au moins 5.5 points sur 10 (donc remporter le match), la probabilité d'un résultat exact de 6-4, ou construire l'histogramme de la distribution. C'est une application directe et calculable du programme terminale."
  - question: "Qu'est-ce que la suite convergente appliquée aux échecs ?"
    answer: "La suite de mises à jour Elo converge : si un joueur dont la vraie force est $E$ joue de nombreuses parties, sa cote $u_n$ tend vers $E$. On peut montrer que $|u_{n+1} - E| < |u_n - E|$ sous certaines conditions, ce qui prouve la convergence. Cette démonstration mobilise la définition de suite convergente et peut être présentée au jury avec les notions de limite et d'asymptote vues en terminale."
  - question: "Quelles problématiques choisir pour un Grand Oral Maths sur les échecs ?"
    answer: "Les trois meilleures problématiques sont : (1) 'En quoi le jeu d'échecs constitue-t-il un modèle de la pensée combinatoire ?' (angle dénombrement + arbre des coups), (2) 'Dans quelle mesure les probabilités permettent-elles de modéliser et prédire la performance aux échecs ?' (angle loi binomiale + formule Elo), et (3) 'Comment les mathématiques expliquent-elles pourquoi les échecs ne seront jamais résolus par la force brute ?' (angle complexité algorithmique + nombre de Shannon)."
---

Tu es en terminale spécialité Maths. Ton Grand Oral approche. Et tu te demandes comment trouver un sujet qui soit à la fois **ancré dans le programme**, personnel, et suffisamment original pour se démarquer de la vingtième présentation sur les fractales ou la suite de Fibonacci.

Voici ce sujet : **les échecs comme terrain d'application du programme de terminale Maths**.

Pas en survol : en profondeur. Chaque chapitre du programme a son illustration exacte sur l'échiquier. La combinatoire dans l'explosion des positions. La loi binomiale dans la modélisation d'un tournoi. Les suites récurrentes dans le mécanisme de mise à jour Elo. L'algorithmique dans la récursivité du minimax. Et la théorie des probabilités dans la prédiction du résultat d'une partie entre deux joueurs de niveaux connus.

Ce que cet article te donne : le contenu mathématique précis avec les formules de terminale, les exemples numériques calculables devant le jury, trois problématiques prêtes à l'emploi, et un plan minuté pour les vingt minutes de l'épreuve.

> **L'essentiel en 5 points :**
> - La mise à jour Elo est une suite récurrente : $u_{n+1} = u_n + K(r_n - p_n)$
> - La loi binomiale $B(n,p)$ modélise directement un match d'échecs à $n$ parties
> - Le nombre de Shannon ($10^{120}$) est un argument de combinatoire calculable pas à pas
> - L'algorithme minimax est le cas concret de récursivité le plus puissant du programme NSI-Maths
> - Les trois problématiques de fin d'article correspondent aux trois chapitres-clés du jury

## Combinatoire et dénombrement : l'explosion des possibles

### Le nombre de Shannon, argument d'ouverture idéal

[Claude Shannon](https://fr.wikipedia.org/wiki/Claude_Shannon), mathématicien et père de la théorie de l'information, a calculé en 1950 le nombre de parties d'échecs distinctes. Son estimation : $10^{120}$. Pour l'ancrer dans le cours de terminale, voici le raisonnement de dénombrement que tu peux développer devant le jury.

Au premier coup des Blancs : **20 coups possibles** (16 déplacements de pions + 4 sauts de cavaliers). Au premier coup des Noirs : **20 réponses**. Après un coup de chaque côté : $20 \times 20 = 400$ positions. Ce calcul utilise le **principe multiplicatif** vu en début de chapitre combinatoire.

En généralisant : si chaque joueur dispose en moyenne de $b \approx 35$ coups légaux à chaque tour, et qu'une partie dure en moyenne $d \approx 80$ demi-coups (40 coups de chaque joueur), le nombre de parties est de l'ordre de :

$$
N \approx b^d = 35^{80} \approx 10^{124}
$$

C'est le **principe de l'arbre de dénombrement** : à chaque nœud, le nombre de branches se multiplie par le facteur de branchement. La croissance est exponentielle, et la base du programme de terminale Maths permet de comprendre exactement pourquoi ce nombre est si spectaculaire.

À titre de comparaison : le nombre d'atomes dans l'univers observable est estimé à $10^{80}$. Le nombre de parties d'échecs le dépasse de **44 ordres de grandeur**.

### Arrangements et permutations dans les ouvertures

Le programme de terminale distingue les arrangements (ordre important) des combinaisons (ordre non important). Les ouvertures d'échecs mobilisent directement ces deux notions.

Le nombre d'**arrangements** de 5 coups différents parmi 20 coups possibles (situation au début d'une partie) est $A(20,5) = 20 \times 19 \times 18 \times 17 \times 16 = 1\,860\,480$. C'est le nombre de séquences d'ouvertures distinctes sur les 5 premiers coups des Blancs uniquement.

En revanche, si l'ordre n'importe pas (quelle que soit l'ordre dans lequel certaines pièces occupent les mêmes cases), on parle de **combinaisons** $C(20,5) = 15\,504$. La distinction arrangements / combinaisons a une traduction concrète en termes d'ouvertures : deux séquences de coups qui aboutissent à la même position sont mathématiquement équivalentes pour l'analyse de la position, mais différentes pour le compte d'arbres de partie.

Ce point peut être développé en 3 minutes devant le jury avec des exemples sur les premiers coups de la partie italienne (1.e4 e5 2.Cf3 Cc6 3.Fc4).

## Probabilités et variables aléatoires

### La formule Elo : une loi logistique en terminale

Le [classement Elo](https://fr.wikipedia.org/wiki/Classement_Elo), inventé par le physicien [Arpad Elo](https://fr.wikipedia.org/wiki/Arpad_Elo), repose sur la **fonction logistique**, que l'on rencontre dans le programme de terminale sous le nom de fonction sigmoïde dans les cours sur les suites et les fonctions.

La probabilité que le joueur A batte le joueur B est :

$$
\mathbb{P}(\text{A bat B}) = \frac{1}{1 + 10^{(R_B - R_A)/400}}
$$

où $R_A$ et $R_B$ sont les cotes Elo respectives. Deux cas particuliers que le jury appréciera :

- Si $R_A = R_B$ (joueurs égaux) : $P = \frac{1}{2}$ (**50 %**)
- Si $R_A - R_B = 400$ : $P = \dfrac{1}{1+10^{-1}} \approx 0{,}91$ (**91 %**)
- Si $R_A - R_B = -200$ (A est 200 points en dessous de B) : $P = \dfrac{1}{1+10^{1/2}} \approx 0{,}24$ (**24 %**)

Ces calculs sont exactement dans le registre de terminale : exposants, valeurs numériques, interprétation probabiliste. Tu peux les faire en direct au tableau.

La fonction logistique est également visible dans le programme comme fonction d'activation des réseaux de neurones (AlphaZero) et comme modèle de croissance limitée en épidémiologie. Signaler ces ponts montre que tu as compris la **portée générale** du modèle.

### La loi binomiale appliquée aux tournois

Un match de championnat du monde d'échecs se joue en **14 parties** (format actuel FIDE). Supposons que les deux joueurs soient d'égale force : $p = \mathbb{P}(\text{victoire à chaque partie}) = \tfrac{1}{2}$.

Le nombre de victoires de l'un des joueurs sur 14 parties suit une **loi binomiale** $\mathcal{B}(14,\tfrac{1}{2})$.

La probabilité de gagner exactement $k$ parties est :

$$
\mathbb{P}(X = k) = \binom{14}{k} \left(\tfrac{1}{2}\right)^k \left(\tfrac{1}{2}\right)^{14-k} = \frac{\binom{14}{k}}{2^{14}}
$$

Quelques valeurs calculables en terminale :

- $\mathbb{P}(X = 7) = \binom{14}{7} / 2^{14} \approx$ **21 %** (égalité parfaite)
- $\mathbb{P}(X \geq 8) = \sum_{k=8}^{14} \binom{14}{k} / 2^{14} \approx$ **39,5 %** (remporter le match ou gagner au moins 8 parties)
- $\mathbb{P}(X = 10) = \binom{14}{10} / 2^{14} \approx$ **6,1 %**

L'**espérance** de cette variable aléatoire est $\mathbb{E}(X) = np = 7$. L'**écart-type** est $\sigma = \sqrt{npq} = \sqrt{14 \times \tfrac{1}{4}} = \sqrt{3{,}5} \approx 1{,}87$.

Ces valeurs ont une interprétation concrète : un match équilibré finit en moyenne à 7-7, et environ 95 % des résultats se trouvent dans l'intervalle $7 \pm 2\sigma$, soit entre **3,3** et **10,7** parties gagnées. C'est l'**intervalle de fluctuation** vu en terminale.

Pour aller plus loin, tu peux modéliser un match avec des joueurs d'égale force mais tenir compte des nulles (qui représentent environ 40 % des parties à haut niveau). Dans ce cas, $p_{\text{victoire}} \approx 0{,}30$ et $p_{\text{nulle}} \approx 0{,}40$, et on parle de **variable aléatoire à trois issues**, que tu peux décrire avec son espérance : $\mathbb{E} = 1 \times 0{,}30 + \tfrac{1}{2} \times 0{,}40 + 0 = 0{,}50$ (résultat attendu d'une partie entre égaux, quelle que soit la distribution victoire/nulle/défaite).

### Espérance et écart-type dans la gestion d'une carrière

L'**espérance mathématique du résultat Elo** d'une partie est directement donnée par la formule logistique. Si tu joues contre un adversaire de 200 points de moins que toi, ton résultat attendu est $\mathbb{E} = 1 \times 0{,}76 + \tfrac{1}{2} \times 0 + 0 \times 0{,}24 = 0{,}76$ points (en simplifiant, sans tenir compte des nulles).

La **variance** des résultats est $\mathrm{Var}(X) = \mathbb{E}(X^2) - (\mathbb{E}(X))^2 = 0{,}76 - 0{,}76^2 \approx 0{,}182$. L'écart-type $\sigma \approx 0{,}43$ mesure la « volatilité » d'une rencontre entre ces deux joueurs.

Ces notions (espérance, variance, écart-type) sont exactement au programme de terminale et peuvent être présentées avec des valeurs numériques précises en appui de la formule Elo. C'est ce niveau de détail qui distingue un Grand Oral solide d'une présentation superficielle.

## Suites récurrentes : l'Elo comme modèle dynamique

C'est le chapitre de terminale le moins exploité sur les échecs, et c'est justement là que tu peux créer une différence.

### La mise à jour Elo comme suite récurrente

La cote Elo d'un joueur après $n$ parties est une **suite récurrente** :

$$
u_{n+1} = u_n + K\,(r_n - p_n)
$$

où :
- $u_n$ est la cote après $n$ parties
- $K$ est le **coefficient d'ajustement** ($K = 32$ pour les débutants, $K = 16$ pour les joueurs établis, $K = 10$ pour les joueurs de plus de 2400)
- $r_n$ est le **résultat réel** de la $(n+1)$-ième partie : $1$ (victoire), $\tfrac{1}{2}$ (nulle), $0$ (défaite)
- $p_n$ est la **probabilité de victoire prédite** par la formule logistique avant la partie

Cette suite ressemble à ce qu'on appelle en terminale une **suite de type** $u_{n+1} = f(u_n)$, où la fonction $f$ dépend aussi de paramètres externes (les résultats des parties).

### Convergence et limite

Un résultat mathématique élégant : si un joueur joue un nombre infini de parties contre des adversaires représentatifs de son niveau, sa cote Elo **converge** vers sa vraie force.

Pour démontrer la convergence (niveau terminale), on peut raisonner ainsi : si $u_n$ est trop élevé (joueur surestimé), ses résultats $r_n$ seront en moyenne inférieurs à $p_n$, donc $u_{n+1} < u_n$ (la suite décroît). Si $u_n$ est trop bas (joueur sous-estimé), $r_n > p_n$ en moyenne, donc $u_{n+1} > u_n$ (la suite croît). La suite est donc **contractive** autour de la vraie force, ce qui implique la convergence.

En termes de terminale : cette suite a un **point fixe** (la vraie force E), et on peut montrer que la suite est monotone et bornée à partir d'un certain rang, garantissant la convergence vers ce point fixe.

### L'asymptote : combien de parties pour être bien classé ?

La question pratique « combien de parties faut-il jouer pour que sa cote soit fiable ? » est une question sur la **vitesse de convergence**. Elle dépend de K : avec K = 32, la cote fluctue plus vite et converge plus rapidement mais avec plus de variance ; avec K = 10, la convergence est plus lente mais plus stable.

Ce compromis biais-variance est exactement la même tension que celle évoquée dans les cours de statistiques : un estimateur convergent rapidement mais instable versus un estimateur lent mais précis. Mentionner ce lien en conclusion de la section montre une vraie maîtrise du programme.

## Algorithmique : la récursivité illustrée par le minimax

### L'algorithme minimax comme cas d'école

Le chapitre d'algorithmique de terminale Maths aborde la **récursivité** : une fonction qui s'appelle elle-même. Le minimax est l'exemple le plus puissant de récursivité qu'un lycéen peut comprendre intuitivement.

Voici la structure logique de l'algorithme, que tu peux présenter sans code :

> **minimax(position, profondeur, joueur)** :
> - Si profondeur = 0 ou partie terminée : retourner évaluation(position)
> - Si c'est le tour du joueur MAX : retourner max sur tous les coups de minimax(nouveau_pos, profondeur−1, MIN)
> - Si c'est le tour du joueur MIN : retourner min sur tous les coups de minimax(nouveau_pos, profondeur−1, MAX)

La **profondeur de récursion** est le paramètre clé : à profondeur $d$, l'algorithme explore $b^d$ nœuds (où $b \approx 35$). Pour $d = 4$ : $35^4 = 1\,500\,625$ nœuds. Pour $d = 8$ : $35^8 \approx 2{,}25 \times 10^{12}$ nœuds. La **complexité temporelle** est $O(b^d)$ (croissance exponentielle), notion au programme de terminale.

### Complexité algorithmique : pourquoi les échecs ne sont pas résolus

Un jury de terminale Maths connaît la notion de complexité. Voici l'argument que tu peux développer en deux minutes :

La complexité en $O(b^d)$ est exponentielle. Pour « résoudre » les échecs (trouver le coup parfait depuis n'importe quelle position), il faudrait explorer tout l'arbre jusqu'aux feuilles, soit de l'ordre de $10^{120}$ nœuds. Même un ordinateur capable d'évaluer $10^{18}$ positions par seconde mettrait de l'ordre de $10^{102}$ secondes, soit **$10^{94}$ fois l'âge de l'univers**.

Les échecs sont donc, selon la terminologie de la théorie de la complexité, un problème **PSPACE-complet** (famille des problèmes difficiles exhaustivement). La notion n'est pas au programme de terminale, mais la **croissance exponentielle versus polynomiale** l'est : c'est l'argument central.

L'élagage **alpha-bêta** réduit la complexité effective à $O(b^{d/2})$ dans le cas optimal : pour $d = 8$, on explore environ $35^4 \approx 1{,}5 \times 10^6$ nœuds au lieu de $35^8$. Cette optimisation illustre l'**analyse algorithmique** au programme de terminale.

## Trois problématiques prêtes à l'emploi

### Problématique 1 : combinatoire

*« En quoi les échecs constituent-ils un modèle de la pensée combinatoire, et pourquoi la complexité de ce jeu dépasse-t-elle les capacités calculatoires de toute machine ? »*

**Plan suggéré :**
1. Calcul du nombre de parties par l'arbre de dénombrement (principe multiplicatif, $10^{120}$)
2. Arrangements et combinaisons dans les ouvertures ($A(n,k)$ et $C(n,k)$)
3. Complexité algorithmique : croissance exponentielle $b^d$ et impossibilité de la résolution par force brute
4. **Conclusion** : les mathématiques discrètes posent une limite formelle à ce que le calcul peut atteindre

### Problématique 2 : probabilités

*« Dans quelle mesure les probabilités et la loi binomiale permettent-elles de modéliser la performance aux échecs et de prédire l'issue d'un match ? »*

**Plan suggéré :**
1. La loi binomiale $\mathcal{B}(n,p)$ appliquée à un match de 14 parties : $\mathbb{P}(X=k)$, $\mathbb{E}(X)$, $\sigma$
2. La formule logistique Elo : probabilité de victoire en fonction de l'écart de cotes
3. Espérance et écart-type : interprétation et valeurs numériques
4. **Conclusion** : les probabilités réduisent l'incertitude sans l'éliminer : les échecs restent un jeu où la surprise est possible

### Problématique 3 : suites et analyse

*« Comment la suite récurrente Elo modélise-t-elle la progression d'un joueur, et en quoi sa convergence illustre-t-elle le concept mathématique de limite ? »*

**Plan suggéré :**
1. La suite $u_{n+1} = u_n + K(r_n - p_n)$ : définition et interprétation
2. Étude de la monotonie et de la convergence (raisonnement biais-correction)
3. Vitesse de convergence et paramètre K : le compromis biais-variance
4. **Conclusion** : un système probabiliste auto-correcteur, microcosme de la statistique bayésienne

## Structurer le Grand Oral : minutage précis

**Introduction (3 min)** : accroche sur $10^{120}$, positionner ta problématique, annoncer le plan en trois parties.

**Partie I : Combinatoire (6 min)** : calcul de l'arbre des coups au tableau (2 niveaux, puis généralisation), formule $b^d$, comparaison avec $10^{80}$ atomes, arrangements vs combinaisons dans une ouverture concrète.

**Partie II : Probabilités (7 min)** : formule Elo (calcul numérique de deux exemples), loi $\mathcal{B}(14,\tfrac{1}{2})$ pour un match, calcul de $\mathbb{P}(X=7)$ et $\mathbb{P}(X\geq 8)$, espérance et écart-type interprétés.

**Partie III : Suites (4 min)** : écriture de la suite récurrente Elo, argument de convergence, complexité minimax en $O(b^d)$.

**Conclusion et ouverture (2 min)** : les mathématiques posent la limite de ce qui est calculable ; l'IA n'a pas « résolu » les échecs, elle a trouvé comment y jouer sans les résoudre. Ouverture sur l'apprentissage automatique (AlphaZero), pour ceux qui ont aussi la spécialité NSI.

## Anticiper les questions du jury

**1. « Pouvez-vous calculer P(A bat B) pour R_A = 1800, R_B = 2200 ? »**
$\mathbb{P} = \dfrac{1}{1+10^{(2200-1800)/400}} = \dfrac{1}{11} \approx 9\,\%$. Calcul direct.

**2. « La loi binomiale suppose-t-elle l'indépendance des parties ? »**
Oui, et c'est une limite du modèle : en pratique, le moral, la fatigue et la préparation créent des corrélations entre les parties. C'est une limite honnête à mentionner ; les jurys apprécient la lucidité sur les hypothèses des modèles.

**3. « En quoi l'espérance du résultat Elo est-elle différente de la probabilité de victoire ? »**
$\mathbb{E}(\text{résultat}) = \mathbb{P}(\text{victoire}) + \tfrac{1}{2}\mathbb{P}(\text{nulle})$ tient compte des nulles ; $\mathbb{P}(\text{victoire})$ seule ne les compte pas. La formule Elo standard utilise l'espérance.

**4. « Qu'est-ce qui garantit la convergence de la suite Elo ? »**
Le fait que la correction $K(r_n - p_n)$ est de signe opposé à l'erreur $(u_n - E)$ en moyenne, si les résultats suivent les prédictions. Argument qualitatif suffisant en terminale.

**5. « Pourquoi dit-on que minimax est en $O(b^d)$ ? »**
À chaque niveau, le nombre de nœuds est multiplié par $b$. Après $d$ niveaux : $b^d$ nœuds ; croissance exponentielle au programme.

---

### Sources et références

- **Shannon, C. E. (1950).** [*Programming a Computer for Playing Chess.*](https://www.cs.mcgill.ca/~dprecup/courses/AI/Materials/shannon1950.pdf) *Philosophical Magazine*, 41(314). (Calcul du nombre de parties possibles, fondement du dénombrement combinatoire.)
- **Elo, A. E. (1978).** *The Rating of Chessplayers, Past and Present.* Arco Publishing. (Présentation de la suite récurrente et du modèle probabiliste Elo.)
- **Sala, G. & Gobet, F. (2016).** [*Do the benefits of chess instruction transfer to academic and cognitive skills?*](https://www.sciencedirect.com/science/article/pii/S1747938X16300112) *Educational Research Review.* (Méta-analyse sur les transferts cognitifs, dont les compétences mathématiques.)
- **von Neumann, J. & Morgenstern, O. (1944).** *Theory of Games and Economic Behavior.* Princeton University Press. (Fondation du minimax et de la théorie des jeux.)
- **Silver, D., et al. (2018).** [*A general reinforcement learning algorithm that masters chess, shogi, and Go.*](https://www.science.org/doi/10.1126/science.aar6404) *Science*, 362(6419). (AlphaZero et apprentissage par renforcement, ouverture vers NSI.)
