---
title: "Grand oral Maths + NSI : les échecs comme pont entre les deux spécialités"
excerpt: "Le sujet transversal le plus puissant pour les élèves Maths+NSI : comment la combinatoire (Maths) explique pourquoi le minimax (NSI) est nécessaire, et comment les probabilités (Maths) fondent l'IA (NSI) qui a révolutionné les échecs."
publishDate: "2026-04-28"
category: "grand-oral"
featured: false
featuredRank: 99
readingTime: "26 min"
pillar: "Cognition"
tags: ["grand-oral", "mathématiques", "NSI", "terminale", "combinatoire", "théorie des jeux", "IA", "Elo", "minimax", "baccalauréat", "transversal"]
seoTitle: "Grand oral Maths + NSI : les échecs, pont entre les deux spécialités"
seoDescription: "Grand Oral Maths et NSI échecs : combinatoire, minimax, probabilités Elo, graphes et structures de données. Plan, formules et code Python prêts."
ogImage: /images/og/grand-oral-mathematiques-echecs-og.webp
heroImage:
  src: /images/blog/grand-oral-mathematiques-echecs-hero.webp
  alt: >-
    Une salle de lecture symétrique, alignement de lampes sur les tables de travail.
  credit: "Dr. Marcus Gossler, CC BY-SA 3.0, via Wikimedia Commons"
  sourceUrl: https://commons.wikimedia.org/wiki/File:Graz_University-Library_reading-room.jpg
  license: CC BY-SA 3.0
faq:
  - question: "Pourquoi le lien entre les mathématiques et les échecs est-il un bon sujet de Grand Oral ?"
    answer: "Ce sujet mêle des notions du programme de terminale (combinatoire, probabilités, théorie des graphes, algorithmique) à un objet culturel concret et connu du jury. Il permet une démonstration visuelle sur l'échiquier, une ouverture vers l'intelligence artificielle et une conclusion philosophique sur la pensée formelle, ce qui facilite la structuration en trois parties et anticipe naturellement les questions du jury."
  - question: "Quelle est la part des mathématiques dans le jeu d'échecs ?"
    answer: "Les échecs s'appuient sur plusieurs domaines mathématiques : la combinatoire (le nombre de Shannon évalue à 10^120 le nombre de parties possibles), la théorie des jeux (l'algorithme minimax, formalisé par John von Neumann), la théorie des graphes (problème du cavalier, graphe des déplacements de pièces), les probabilités (évaluation statistique des ouvertures), et l'algèbre linéaire (apprentissage par renforcement dans AlphaZero). Chaque pièce, chaque coup, chaque classement a un substrat mathématique précis."
  - question: "Comment expliquer le classement Elo lors d'un Grand Oral ?"
    answer: "L’approximation logistique 1/(1+10^((Rb-Ra)/400)) représente le score attendu : une victoire vaut 1, une nulle 0,5 et une défaite 0. Ce n’est pas directement la probabilité de gagner. La cote évolue selon l’écart entre score obtenu et score attendu ; la FIDE applique ses tables réglementaires."
  - question: "Qu'est-ce que le problème du cavalier et pourquoi est-il utile au Grand Oral ?"
    answer: "Le problème du cavalier consiste à trouver un chemin sur un échiquier 8×8 où le cavalier visite exactement une fois chacune des 64 cases. Il appartient à la théorie des graphes (chercher un chemin hamiltonien dans le graphe de déplacements du cavalier) et peut être résolu par des algorithmes de backtracking ou la règle de Warnsdorff. C'est un exemple parfait pour illustrer comment la mathématique formelle s'applique à un objet physique posé devant le jury."
  - question: "Comment utiliser AlphaZero comme argument dans un Grand Oral sur les maths et les échecs ?"
    answer: "AlphaZero (DeepMind, 2017) est un programme d'apprentissage par renforcement qui n'a utilisé aucune partie humaine : il a appris uniquement en jouant contre lui-même. En moins de 24 heures, il atteignait un niveau supérieur à Stockfish. Pour un Grand Oral, il illustre le passage de l'approche algorithmique classique (minimax, élagage alpha-bêta) à l'apprentissage automatique par réseaux de neurones, ancrant les maths dans l'actualité de l'IA."
  - question: "Quelles questions peut poser le jury sur les maths et les échecs au Grand Oral ?"
    answer: "Les questions fréquentes du jury portent sur : le calcul explicite du nombre de parties possibles, la démonstration du problème du cavalier (graphe hamiltonien), la formule Elo et son interprétation probabiliste, la différence entre arbre minimax et apprentissage par renforcement, et les limites de la modélisation (la résolution complète des échecs reste hors de portée). Préparer ces cinq angles couvre la majorité des questions possibles."
---

Tu as Maths **et** NSI en terminale. Et tu veux un sujet de Grand Oral qui exploite **les deux** : pas un sujet Maths avec un saupoudrage informatique, ni un sujet NSI avec une formule mathématique décorative.

Les échecs sont ce sujet transversal. La combinatoire (Maths) explique *pourquoi* l'algorithme minimax (NSI) est indispensable. Les probabilités (Maths) fondent le classement Elo que les bases de données (NSI) stockent et interrogent. Les graphes (Maths) sont la structure de données (NSI) sur laquelle le problème du cavalier est défini. AlphaZero repose sur l'algèbre linéaire (Maths) implémentée sous forme de réseau de neurones (NSI).

Ce n'est pas un sujet où Maths et NSI se côtoient par hasard. C'est un sujet où chaque notion mathématique *engendre* un besoin informatique, et chaque implémentation informatique *suppose* un fondement mathématique. C'est le pont réel entre les deux disciplines.

> **Pourquoi cet article est différent des deux autres de la série ?**
> - L'article [Guide Grand oral spé Maths](/fr/blog/grand-oral-maths-spe-echecs/) développe le script minuté, les formules, suites et loi binomiale pour les candidats avec Maths uniquement
> - L'article [Grand oral spé NSI](/fr/blog/grand-oral-nsi-echecs/) développe le code Python, les structures de données et l'IA pour les candidats avec NSI uniquement
> - **Cet article construit les ponts entre les deux disciplines** : il est fait pour les élèves Maths+NSI qui veulent un sujet transversal et un jury qui peut interroger dans les deux directions

Cet article te donne le plan complet, le contenu des deux programmes, les points de connexion entre les disciplines, et les conseils pour tenir la distance face à un jury qui connaît les deux spécialités.

## Les trois ponts Maths-NSI : l'angle unique du sujet transversal

Avant d'entrer dans le contenu, la structure de pensée est essentielle. Un jury de Grand Oral transversal Maths+NSI n'attend pas deux exposés collés l'un à l'autre. Il attend un candidat qui **montre comment les deux disciplines se nécessitent**.

| Côté Maths | Pont | Côté NSI |
|---|---|---|
| Combinatoire : $\sim 10^{120}$ parties | → nécessite → | Algorithme minimax (pas de force brute possible) |
| Probabilités : formule Elo | → est stockée et calculée via → | Bases de données SQL, requêtes statistiques |
| Théorie des graphes : chemin hamiltonien | → est implémenté comme → | Arbre de décision, DFS récursif |
| Algèbre linéaire : matrices, fonctions | → est la structure de → | Réseaux de neurones d'AlphaZero |

Ce tableau est la colonne vertébrale de ton Grand Oral. Chaque ligne est une transition entre une partie et la suivante. Et c'est ce que les candidats Maths-seuls ou NSI-seuls **ne peuvent pas faire** : montrer que l'un engendre l'autre.

![Les quatre ponts entre Mathématiques et NSI illustrés par les échecs : combinatoire, probabilités Elo, théorie des graphes, algèbre linéaire.](/images/go-maths-01-ponts-disciplines.svg)

## Pourquoi Maths + NSI font un sujet idéal pour le Grand Oral

Avant de plonger dans le contenu, il faut comprendre pourquoi ce sujet fonctionne structurellement.

### Un sujet à la croisée de deux disciplines

Le Grand Oral du baccalauréat valorise les sujets transversaux. Un candidat qui parle de la résolution d'une équation différentielle fait de la mathématique. Un candidat qui parle de l'impact culturel d'une œuvre fait des humanités. Mais un candidat qui explique **pourquoi les mathématiques rendent les échecs compréhensibles, et pourquoi les échecs rendent les mathématiques visibles**, fait quelque chose de plus rare : il tisse un pont qui prouve qu'il maîtrise les deux rives.

Les examinateurs ont vu passer des milliers de sujets. Ce qui les marque, c'est la capacité du candidat à faire résonner deux mondes. Ici, chaque notion mathématique trouve une illustration physique immédiate sur l'échiquier. Et chaque mécanisme du jeu cache une structure formelle que les mathématiques nomment et décrivent précisément.

### Les notions du programme directement concernées

Ce sujet est taillé pour la terminale car il mobilise des notions explicitement au programme :

- **Combinatoire** (dénombrement, factorielles, arrangements) : nombre de parties, arbre des coups
- **Probabilités** : évaluation statistique des ouvertures, formule Elo, espérance de gain
- **Théorie des graphes** (algorithmique, première et terminale NSI) : problème du cavalier, chemin hamiltonien
- **Algorithmique** : minimax, élagage alpha-bêta, ordre de complexité
- **Statistiques** : régression, analyse de données de parties
- **Algèbre linéaire** (spécialité maths) : réseaux de neurones, AlphaZero

Un sujet qui couvre autant du programme en un seul objet se structure naturellement en trois parties et génère des questions du jury ancrées dans des notions précises, ce qui est prévisible et préparable.

### La puissance de l'objet concret

Beaucoup de candidats font un Grand Oral sans support visuel efficace. Toi, tu poses un échiquier sur la table. C'est un geste qui change l'atmosphère : tu matérialises le sujet. Le jury peut le voir, le toucher. Tu peux démontrer le problème du cavalier en déplaçant une pièce. Tu peux montrer l'explosion des possibilités après deux coups en dessinant rapidement un arbre au tableau. L'abstraction mathématique prend une forme physique, et cette forme physique reste dans la mémoire du jury bien après la fin de l'épreuve.

## Les fondements mathématiques du jeu d'échecs

### La théorie des jeux appliquée aux échecs

La théorie des jeux est la branche des mathématiques qui étudie les situations de décision stratégique entre acteurs rationnels. Elle a été formalisée par [John von Neumann](https://fr.wikipedia.org/wiki/John_von_Neumann) et [Oskar Morgenstern](https://fr.wikipedia.org/wiki/Oskar_Morgenstern) en 1944 dans leur traité fondateur *Theory of Games and Economic Behavior*. Les échecs y occupent une place de choix.

Les échecs sont ce qu'on appelle un **jeu à somme nulle, à deux joueurs, à information parfaite et à stratégie pure**. Chacune de ces quatre propriétés a une définition mathématique précise :

- **Somme nulle** : ce que l'un gagne, l'autre le perd. Il n'y a pas de gain collectif possible. La somme des gains des deux joueurs est toujours zéro (victoire +1 / défaite -1 / nulle 0+0).
- **Information parfaite** : les deux joueurs voient toujours l'état complet du plateau. Pas de cartes cachées, pas de dés, aucun élément d'incertitude externe. (À distinguer des jeux d'information imparfaite comme le poker ou la Belote.)
- **Stratégie pure** : une stratégie est un ensemble de règles de décision qui associe à chaque état de jeu un coup précis. En théorie des jeux, on peut décrire formellement l'ensemble des stratégies pures possibles pour chaque joueur.
- **Jeu déterministe** : le résultat d'une séquence de coups est entièrement déterminé par les coups eux-mêmes, sans hasard.

Ce cadre formel a une conséquence importante, connue sous le nom de **théorème de Zermelo** (1913) : dans tout jeu à deux joueurs, à information parfaite, fini et à somme nulle, l'un des deux joueurs a une stratégie gagnante, ou les deux peuvent forcer la nulle. Les échecs ont donc **une issue théoriquement déterminée** : soit les Blancs gagnent avec le jeu parfait, soit les Noirs gagnent, soit c'est nulle. Personne ne le sait encore. Mais on sait que l'une de ces trois issues est la « vraie » réponse aux échecs.

Ce théorème est souvent le moment-choc d'une introduction : « On ne sait toujours pas si les Blancs gagnent avec le jeu parfait. Et les mathématiques disent que la réponse existe. »

### Combinatoire et permutations : l'art de calculer les possibilités

La combinatoire est probablement la branche mathématique la plus directement visible aux échecs.

[Claude Shannon](https://fr.wikipedia.org/wiki/Claude_Shannon), père de la théorie de l'information, a calculé en 1950 le nombre de parties d'échecs distinctes. Son estimation, appelée le **nombre de Shannon**, est de l'ordre de $10^{120}$. Pour donner une échelle : le nombre d'atomes dans l'univers observable est estimé à environ $10^{80}$. Le nombre de parties d'échecs possibles dépasse donc de **quarante ordres de grandeur** le nombre de particules connues dans l'univers.

Comment arrive-t-on à ce chiffre ? Voici l'argument de dénombrement que tu peux dérouler devant le jury :

1. Au premier coup des Blancs, il y a **20 coups possibles** (16 coups de pions + 4 coups de cavaliers).
2. Au premier coup des Noirs, il y a également **20 réponses possibles**.
3. Après un coup de chaque côté, on a donc **20 × 20 = 400 positions**.
4. Au deuxième coup, il y a environ **29 coups possibles en moyenne** pour chaque joueur.
5. L'arbre des coups grandit exponentiellement : après 3 coups de chaque côté, on dépasse **119 060 324 suites de six demi-coups**, soit environ 10^8 feuilles.

La formule générale est $N \approx b^d$, où $b$ est le facteur de branchement moyen ($\approx 35$ aux échecs) et $d$ la profondeur ($\approx 80$ demi-coups). On obtient $35^{80} \approx 10^{124}$, dans le même ordre de grandeur que l'estimation de Shannon.

Ce calcul est parfait pour un Grand Oral : il repose uniquement sur la multiplication et la notion de puissance, des outils de première. Le jury peut suivre chaque étape, et le résultat est spectaculaire.

#### L'arbre des coups comme objet mathématique

Formellement, cet arbre est un **arbre enraciné orienté** : la racine est la position initiale, chaque nœud est une position, chaque arc est un coup légal, et les feuilles sont les positions finales (mat, nulle, abandon). Le nombre de nœuds de cet arbre est le nombre total de positions légales, estimé à environ $10^{44}$ (positions légales distinctes ; différent du nombre de parties car une même position peut être atteinte par des séquences différentes).

Cette distinction entre *nombre de parties* et *nombre de positions* est un bon point de précision que le jury peut creuser.

### Logique et résolution de problèmes : la pensée stratégique comme raisonnement formel

Au-delà du dénombrement, les échecs sont un système **logique formel** : il y a des axiomes (les règles du jeu), des états (les positions), et des transformations valides (les coups légaux). Résoudre une position tactique, c'est construire une démonstration : « Si je joue A, il répond B ou C. Si B, alors D est forcing. Si C, alors E est mat en deux coups. »

Cette structure est exactement celle d'une **démonstration par disjonction de cas** en mathématiques, un outil fondamental de la logique formelle que le jury reconnaîtra immédiatement.

Les joueurs d'échecs de haut niveau décrivent souvent leur processus de calcul comme « construire une ligne forcée » : identifier une séquence de coups où, quelle que soit la réponse de l'adversaire, la conclusion est inévitable. C'est la définition d'une **implication universelle** : ∀ réponse de l'adversaire, ∃ continuation gagnante. Cette formalisation peut être présentée en deux phrases devant le jury et crée un pont immédiat entre les deux disciplines.

![L'explosion combinatoire des échecs sur échelle logarithmique, jusqu'au nombre de Shannon (10^120).](/images/go-maths-05-explosion-combinatoire.svg)

![Théorème de Zermelo (1913) : aux échecs, une seule des trois issues (gain blanc, gain noir, nulle) est théoriquement déterminée.](/images/go-maths-03-zermelo-jeu-determine.svg)

## Probabilités et analyse dans le jeu d'échecs

### Calculer un score attendu : la formule Elo

Le [classement Elo](https://fr.wikipedia.org/wiki/Classement_Elo), inventé par le physicien et mathématicien [Arpad Elo](https://fr.wikipedia.org/wiki/Arpad_Elo) dans les années 1960, est l'une des applications les plus élégantes des probabilités à un jeu. Il repose sur une idée simple : **la différence de cote sert à estimer le score attendu**.

Une approximation logistique du score attendu de A est :

$$
\mathbb{E}(S_A) = \frac{1}{1 + 10^{(R_B - R_A)/400}}
$$

où $R_A$ et $R_B$ sont les cotes Elo respectives. Si $R_A = R_B$, on obtient $\mathbb{P} = \tfrac{1}{2}$. Si $R_A = 2000$ et $R_B = 1600$, on obtient $\mathbb{P} \approx 91\,\%$.

Le score vaut 1, 0,5 ou 0 selon le résultat. Une espérance de 0,5 n’est donc pas une probabilité de victoire de 50 %. Cette formule est une approximation logistique pédagogique ; la FIDE utilise ses tables réglementaires. Cette **fonction logistique** a une forme en S que l’on rencontre aussi en modélisation démographique, en médecine (probabilité d'un événement clinique) et dans les réseaux de neurones (fonction d'activation sigmoïde). Le faire remarquer au jury montre que tu places l'exemple dans une famille mathématique plus large.

#### Code (Maths → NSI) : calculer un score attendu Elo en Python

<div data-pytrace></div>

```python
def proba_elo(ra: int, rb: int) -> float:
    return 1 / (1 + 10 ** ((rb - ra) / 400))

print(round(proba_elo(1800, 2000), 3))  # ≈ 0.240
print(round(proba_elo(2000, 2000), 3))  # 0.500
```

La mise à jour des cotes après chaque partie obéit à une règle simple :

$$\text{Nouvelle cote de } A = R_A + K\,(\text{résultat réel} - \text{résultat attendu})$$

où $K$ est un coefficient (40, 20 ou 10 selon les conditions du règlement FIDE), le résultat réel vaut $1$, $\tfrac{1}{2}$ ou $0$, et le résultat attendu est l'espérance de score définie ci-dessus.

C'est un **estimateur bayésien** : chaque partie apporte de l'information sur la vraie force d'un joueur, et la cote converge vers cette vraie valeur au fil du temps. Ce mécanisme est directement lié aux notions de statistiques inférentielles du programme de terminale.

### L'impact des probabilités sur les ouvertures et les stratégies

Les bases de données de parties (Lichess dispose d'une base publique de plus de **3 milliards de parties**) permettent de calculer la fréquence de chaque ouverture et le taux de victoire associé pour les Blancs et les Noirs.

#### Code (NSI)  -  requête SQL simple sur une base de parties

```sql
SELECT
  ouverture,
  COUNT(*) AS nb_parties,
  ROUND(100.0 * SUM(CASE WHEN resultat = '1-0' THEN 1 ELSE 0 END) / COUNT(*), 1) AS pct_blanc
FROM parties
GROUP BY ouverture
ORDER BY nb_parties DESC
LIMIT 10;
```

Par exemple, si une base sélectionnée contient 40 % de victoires blanches, 30 % de nulles et 30 % de victoires noires après une ouverture, ces fréquences décrivent cet échantillon. Ce sont ici des proportions fictives pour expliquer le calcul, pas des statistiques vérifiées d'une ouverture réelle.

Un échantillon plus grand ne supprime pas les biais de sélection. Le niveau, la cadence et la période peuvent modifier les fréquences ; elles ne convergent pas automatiquement vers une probabilité universelle de l'ouverture. Après 1.e4 e5 2.Cf3 Cc6, plusieurs ouvertures restent possibles : l'Italienne se précise avec 3.Fc4.



![Le problème du cavalier comme chemin hamiltonien dans un graphe : visiter chaque case une seule fois.](/images/go-maths-04-cavalier-hamiltonien.svg)

## L'intelligence artificielle et les échecs : une révolution mathématique

### Algorithmes de recherche : minimax et élagage alpha-bêta

La question naturelle après le calcul du nombre de Shannon est : comment un ordinateur peut-il jouer aux échecs si l'arbre complet des parties est inexplorable ? La réponse est l'**algorithme minimax**, formalisé par John von Neumann dans sa théorie des jeux.

Le principe est simple : à chaque nœud de l'arbre, le joueur dont c'est le tour cherche à **maximiser** son évaluation (si c'est lui) ou à **minimiser** celle de l'adversaire (si c'est l'adversaire). L'algorithme explore l'arbre en alternant ces deux opérations, d'où le nom « min-max ».

En pratique, on ne peut pas aller jusqu'aux feuilles de l'arbre (le mat). On s'arrête à une profondeur fixe et on applique une **fonction d'évaluation** qui donne une valeur numérique à chaque position intermédiaire (matériel restant, contrôle de l'espace, sécurité du roi...). Cette fonction est l'intelligence du programme : deux moteurs avec le même minimax mais des fonctions d'évaluation différentes auront des forces très différentes.

#### Code (NSI)  -  minimax (récursivité en Python)

```python
def minimax(position, profondeur, est_max):
    if profondeur == 0 or position.terminee():
        return position.evaluer()

    coups = position.coups_legaux()

    if est_max:
        meilleur = float("-inf")
        for coup in coups:
            meilleur = max(meilleur, minimax(position.jouer(coup), profondeur - 1, False))
        return meilleur
    else:
        meilleur = float("+inf")
        for coup in coups:
            meilleur = min(meilleur, minimax(position.jouer(coup), profondeur - 1, True))
        return meilleur
```

L'**élagage alpha-bêta**, développé par [John McCarthy](https://fr.wikipedia.org/wiki/John_McCarthy_(informaticien)) et ses collaborateurs dans les années 1950-60, est une optimisation du minimax qui permet d'éliminer des branches entières de l'arbre sans les explorer. Dans le meilleur cas, avec un tri idéal des coups, il réduit l’ordre de grandeur de $O(b^d)$ à environ $O(b^{d/2})$ ; pour $b = 35$ et $d = 10$, les puissances indicatives passent d’environ $2{,}7 \times 10^{15}$ à $\sim 5{,}2 \times 10^7$. C'est un résultat d'algorithmique accessible en terminale NSI.

#### Code (NSI)  -  alpha-bêta (l'optimisation "visible")

```python
def alpha_beta(position, profondeur, alpha, beta, est_max):
    if profondeur == 0 or position.terminee():
        return position.evaluer()

    coups = position.coups_legaux()

    if est_max:
        for coup in coups:
            alpha = max(alpha, alpha_beta(position.jouer(coup), profondeur - 1, alpha, beta, False))
            if beta <= alpha:
                break
        return alpha
    else:
        for coup in coups:
            beta = min(beta, alpha_beta(position.jouer(coup), profondeur - 1, alpha, beta, True))
            if beta <= alpha:
                break
        return beta
```

### L'apprentissage automatique et les supercalculateurs d'échecs

En 2017, [DeepMind](https://fr.wikipedia.org/wiki/DeepMind) a publié [AlphaZero](https://fr.wikipedia.org/wiki/AlphaZero), un programme d'apprentissage par renforcement qui a bouleversé le monde des échecs. Contrairement à [Stockfish](https://fr.wikipedia.org/wiki/Stockfish_(logiciel)), qui utilise une fonction d'évaluation codée à la main par des experts, AlphaZero **n'a reçu que les règles du jeu**. Il a ensuite joué contre lui-même en boucle, pendant moins de 24 heures, et a atteint un niveau supérieur à Stockfish (le meilleur programme classique) en 100 parties de test.

AlphaZero utilise un **réseau de neurones convolutif** (une architecture mathématique inspirée du traitement visuel biologique) pour évaluer les positions, et une méthode de **Monte Carlo Tree Search (MCTS)** pour guider son exploration de l'arbre des coups. La MCTS ajoute une dimension probabiliste à la recherche : au lieu d'explorer l'arbre de manière uniforme, elle concentre les ressources de calcul sur les branches qui ont produit des résultats positifs lors des simulations précédentes.

Ce résultat est l'un des arguments les plus frappants pour la conclusion d'un Grand Oral : **l'intelligence artificielle aux échecs est passée de la programmation explicite (dire à la machine quelles positions sont bonnes) à l'apprentissage implicite (laisser la machine découvrir par elle-même ce qui est bon)**. Ce glissement mathématique correspond au passage de l'optimisation combinatoire à l'apprentissage statistique, deux piliers des mathématiques contemporaines.

Pour aller plus loin sur la complexité mathématique sous-jacente, l'article [Pourquoi les échecs sont un problème mathématique (presque) impossible](/fr/blog/pourquoi-echecs-probleme-mathematique-impossible-et-ia/) décortique en détail l'arbre des coups, minimax et alpha-bêta.

![L'algèbre linéaire derrière AlphaZero : la position devient un vecteur transformé par des matrices en politique et valeur.](/images/go-maths-06-algebre-reseau-neurones.svg)

## Applications pratiques et exemples concrets

### Le problème du cavalier et la théorie des graphes

C'est l'exemple à avoir en poche pour la démonstration en direct. Le problème du cavalier est le suivant : **est-il possible de déplacer un cavalier sur un échiquier 8×8 de façon à visiter exactement une fois chacune des 64 cases ?** Si oui, on appelle cette séquence un « tour du cavalier ».

Reformulé en théorie des graphes, c'est un problème de **chemin hamiltonien** : on construit un graphe G = (V, E) où les 64 cases sont les sommets, et on trace une arête entre deux cases si un cavalier peut se déplacer de l'une à l'autre en un coup. La question devient : ce graphe admet-il un chemin hamiltonien (passant par chaque sommet exactement une fois) ?

La réponse est **oui** : il existe des tours du cavalier sur l'échiquier standard. On en connaît des milliers (Leonard Euler, au XVIIIe siècle, a été l'un des premiers à les étudier systématiquement). Le graphe des déplacements du cavalier a des propriétés intéressantes : chaque case de coin n'a que 2 voisins, une case de centre peut en avoir jusqu'à 8. La non-uniformité du degré des sommets est précisément ce qui rend la recherche difficile.

**La règle de Warnsdorff** (1823) est un heuristique qui permet souvent de trouver un tour du cavalier rapidement : depuis la case actuelle, toujours aller vers la case qui a le **moins de successeurs encore non visités**. C'est un algorithme glouton (greedy) : on prend localement la meilleure décision, et empiriquement cela conduit souvent à la solution globale, bien qu'aucune preuve générale d'optimalité ne soit connue.

Pour un Grand Oral, tu peux montrer les 3 ou 4 premiers coups d'un tour du cavalier sur un mini-échiquier 5×5 (plus simple à dessiner au tableau), en expliquant à chaque étape que tu appliques la règle de Warnsdorff. C'est une démonstration visible, interactive, et qui mobilise des notions de graphes accessibles.

### L'analyse des coups et l'optimisation des stratégies

Les moteurs d'échecs modernes comme Stockfish produisent, pour chaque position, une **évaluation en centièmes de pion** : +0.30 signifie un léger avantage pour les Blancs, +2.50 un avantage décisif, −1.20 un avantage pour les Noirs. Cette évaluation est une approximation continue d'une valeur théoriquement discrète (victoire / nulle / défaite).

L'analyse de partie peut comparer des choix à des évaluations obtenues avec un moteur et un protocole donnés. Ce n'est ni une mesure exhaustive de la qualité d'un joueur ni, à elle seule, une preuve de triche. Version du moteur, profondeur, difficulté des positions et taille de l'échantillon comptent dans l'interprétation.

La courbe logistique présentée ici modélise un score attendu. Elle ne garantit pas une transitivité des résultats : A peut battre B, qui bat C, sans que A batte C. Elle ne démontre pas non plus une calibration parfaite sur toutes les populations.

## Comment les mathématiques aident à classer les joueurs d'échecs

Pour boucler la boucle sur le classement Elo, il est utile d'expliquer sa construction historique. [Arpad Elo](https://fr.wikipedia.org/wiki/Arpad_Elo) était professeur de physique. Il a observé que la distribution des performances d'un joueur sur une longue période suivait approximativement une **loi normale** (gaussienne). Il a ensuite posé que la différence de performance entre deux joueurs déterminait la probabilité de victoire selon la formule logistique décrite plus haut.

Ce modèle a une élégance mathématique réelle : il est **cohérent** (si A bat B et B bat C, la cote de A est systématiquement plus haute que celle de C), **adaptatif** (une série de victoires contre des adversaires forts fait monter la cote plus vite que des victoires contre des adversaires faibles), et **calibré** (la probabilité prédite par la formule correspond à la fréquence observée sur les grandes bases de données).

Le classement Elo a depuis été repris dans de nombreux autres domaines : jeux vidéo compétitifs (League of Legends, échecs en ligne), matchs de football (FIFA World Rankings), évaluation de modèles d'IA, et même systèmes de vote par comparaisons par paires en psychologie sociale. Signaler cela au jury montre que tu as compris la **portée générale** du modèle, pas seulement son application aux échecs.

## Trois problématiques transversales prêtes à l'emploi

*« Comment les mathématiques et l'informatique se complètent-elles pour modéliser l'intelligence aux échecs ? »*
→ Angle : la combinatoire pose le problème, l'algorithmique le contourne, l'IA le transcende.

*« En quoi le jeu d'échecs illustre-t-il les interactions entre mathématiques discrètes et algorithmique ? »*
→ Angle : chaque notion mathématique (graphe, probabilité, suite) a une implémentation informatique directe.

*« Des mathématiques de Shannon à l'IA d'AlphaZero : comment l'informatique a-t-elle transformé les échecs ? »*
→ Angle : progression historique de 1950 à 2017, chaque étape correspond à un outil Maths et un outil NSI.

## Structurer ton Grand Oral en dix minutes

Choisis un pont central plutôt que de développer les trois au même niveau. Pour la méthode générale, consulte le [guide toutes spécialités](/fr/blog/guide-grand-oral-echecs-toutes-specialites/). Pour un exposé centré sur le code, utilise le [guide NSI](/fr/blog/guide-grand-oral-echecs-nsi/) ; pour les calculs, le [guide Maths](/fr/blog/grand-oral-maths-spe-echecs/).

Voici une proposition de découpage à chronométrer :

- Introduction, 1 minute : pourquoi un programme ne peut-il pas explorer uniformément toutes les variantes ?
- Combinatoire, 3 minutes : construire un petit arbre et expliquer le modèle b^d, avec ses hypothèses.
- Algorithmique, 4 minutes : montrer minimax sur cet arbre, puis une coupure alpha-bêta ; préciser le rôle du tri des coups.
- Conclusion, 2 minutes : distinguer performance et résolution, puis ouvrir sur la sélection des variantes par apprentissage dans AlphaZero.

Ce découpage totalise dix minutes. Le ministère prévoit ensuite dix minutes d’échange ; ce second temps ne doit pas être ajouté à la durée de ton exposé.

## Anticiper le jury transversal Maths+NSI

Un jury transversal peut interroger dans les deux directions. Voici les cinq questions les plus probables et leurs réponses synthétiques :

**1. « Vous dites que la combinatoire explique le minimax : pouvez-vous préciser ce lien ? »**
La croissance b^d (Maths, combinatoire) rend l'exploration complète impossible. Le minimax (NSI) est la réponse algorithmique : explorer jusqu'à une profondeur d limitée, évaluer les feuilles avec une heuristique, et propager les scores par récursivité. Sans la borne combinatoire, le minimax ne serait pas nécessaire.

**2. « Quel est le lien entre la fonction logistique Elo et la sigmoïde des réseaux de neurones ? »**
Une logistique peut transformer un réel en valeur entre 0 et 1. Ce rapprochement mathématique ne décrit pas les couches internes d’AlphaZero : sa publication décrit notamment des activations ReLU, une sortie de politique softmax et une sortie de valeur tanh. Le modèle Elo et ce réseau ont des fonctions différentes.


**3. « Pourquoi l'élagage alpha-bêta réduit-il la complexité de O(b^d) à O(b^(d/2)) ? »**
O(b^(d/2)) est une borne asymptotique dans le meilleur cas de tri. Une coupure évite d’examiner des réponses qui ne peuvent plus changer le choix d’un ancêtre. Cela ne signifie pas qu’exactement la moitié des branches disparaît à chaque niveau.


**4. « En quoi AlphaZero est-il différent de Stockfish du point de vue mathématique ? »**
Le contraste historique porte sur Stockfish 8 et AlphaZero dans l’étude de 2017 : recherche alpha-bêta et évaluation conçue à la main d’un côté, réseau entraîné par autojeu associé à MCTS de l’autre. Le Stockfish actuel emploie aussi des réseaux NNUE ; ce n’est donc pas une opposition permanente entre « programmation » et « apprentissage ».


**5. « Quel est le rapport entre le chemin hamiltonien (Maths) et la DFS (NSI) ? »**
Un parcours en profondeur (DFS) est exactement l'algorithme qui explore un graphe en cherchant un chemin hamiltonien par backtracking. Le graphe hamiltonien est l'objet mathématique ; la DFS est son implémentation informatique naturelle. C'est un exemple direct du pont Maths → NSI.

## Conseils pour un Grand Oral réussi

### Maîtriser le sujet et les outils de terminale

La règle d'or est simple : **ne mets dans ton exposé que ce que tu peux expliquer et défendre**. Si tu cites le réseau de neurones d'AlphaZero, tu dois être capable de répondre à « qu'est-ce qu'un réseau de neurones ? ». Si tu écris la formule Elo au tableau, tu dois pouvoir calculer un exemple numérique devant le jury.

Cela ne signifie pas que tu dois tout savoir. Cela signifie que tu dois savoir exactement où s'arrêtent tes connaissances. Un candidat qui dit *« AlphaZero utilise des réseaux de neurones, dont la structure interne dépasse le cadre de ce Grand Oral, mais dont le principe général est... »* montre sa lucidité. C'est plus valorisant que de broder.

Pour les notions du programme directement mobilisées (combinatoire, formule de score attendu, représentation graphique), l'exactitude est attendue. Revois les chapitres correspondants et prépare un ou deux calculs numériques que tu peux exécuter de tête ou rapidement au tableau.

### Anticiper les questions du jury

Les cinq angles de question les plus probables sur ce sujet sont :

1. **« Pouvez-vous calculer numériquement le score attendu pour des cotes données ? »** → Prépare le calcul pour Ra=1800, Rb=2000, et pour Ra=2000, Rb=2000.

2. **« Quelle est la différence entre l'arbre minimax et l'apprentissage par renforcement ? »** → Minimax explore un arbre fixe avec une évaluation codée ; l'apprentissage par renforcement apprend la fonction d'évaluation par l'expérience.

3. **« Le problème du cavalier a-t-il toujours une solution ? »** → Sur un échiquier 8×8, oui. Sur un échiquier n×n, non systématiquement (les petits échiquiers comme 2×2 ou 3×3 n'ont pas de tour du cavalier).

4. **« Qu'est-ce que le théorème de Zermelo implique concrètement pour les échecs ? »** → Que l'une des trois issues (victoire des Blancs, victoire des Noirs, nulle) est « vraie » avec le jeu parfait. Mais que trouver cette stratégie parfaite reste hors de portée de toute machine actuelle.

5. **« Pourquoi dit-on que la formule Elo est probabiliste si les échecs sont un jeu déterministe ? »** → Les échecs sont déterministes dans leur structure (pas de hasard), mais les performances humaines varient selon la forme, la fatigue, la préparation. La loi normale modélise cette variabilité humaine, pas le jeu lui-même.

### Un mot sur la présentation physique

Si tu apportes l'échiquier, prépare une **position de départ d'un exemple précis** (les 4 premiers coups d'une ouverture classique, ou la position de départ du problème du cavalier). Ne laisse pas l'échiquier vide sur la table : le jury doit toujours savoir à quoi il sert à chaque moment de l'exposé.

Ton tableau (blanc ou noir) doit avoir deux ou trois éléments préparés à l'avance : le plan en trois parties, la formule Elo, et l'arbre des deux premiers coups. Tout le reste peut être ajouté en direct, mais ces trois éléments ancrent visuellement ton exposé dès le départ.

## Les trois articles de la série : choisir le bon

Ce sujet existe en trois versions adaptées à chaque profil :

- **Tu as uniquement la spécialité Maths** → [Guide Grand oral spé Maths : modèles, calculs et questions](/fr/blog/grand-oral-maths-spe-echecs/) : script minuté, formules détaillées, calculs numériques, loi binomiale pour les tournois, suite récurrente Elo.

- **Tu as uniquement la spécialité NSI** → [Grand oral spé NSI : minimax Python, bitboard et AlphaZero](/fr/blog/grand-oral-nsi-echecs/) : code Python commenté, structures de données, format PGN, SQL, progression Stockfish → AlphaZero.

- **Tu as Maths + NSI** → **Cet article** : les ponts entre les deux disciplines, le plan transversal, les questions du jury croisées.

## Ce que ce sujet dit de toi au jury

Un jury de Grand Oral ne juge pas seulement les connaissances. Il observe comment tu penses. Un candidat qui choisit ce sujet et le présente avec cette structure montre trois choses distinctes :

Premièrement, qu'il sait **lier abstraction et concret** : la formule Elo n'est pas récitée, elle est calculée sur un exemple vivant. Le théorème de Zermelo n'est pas cité en note de bas de page, il est le pivot philosophique de la conclusion.

Deuxièmement, qu'il a **une curiosité qui dépasse le programme** : AlphaZero n'est pas au programme de terminale, mais sa présentation montre que le candidat a lu au-delà des manuels. Le jury voit quelqu'un qui a cherché, pas quelqu'un qui a révisé.

Troisièmement, qu'il sait **structurer un raisonnement en public** : dix minutes de présentation, trois parties, un fil rouge qui part du dénombrement pour finir sur l'apprentissage automatique. Ce fil n'est pas accidentel : il suit la logique des mathématiques du plus fondamental (compter) au plus contemporain (apprendre).

Les meilleurs Grands Oraux ne sont pas ceux où le candidat en sait le plus. Ce sont ceux où le jury comprend **pourquoi ce candidat a choisi ce sujet, et ce que ce sujet lui a appris sur lui-même**.

Et si l'on te demande pourquoi tu as choisi les échecs, la réponse honnête et la plus forte est aussi la plus simple : parce que c'est un jeu où l'on pense à voix haute. Et les mathématiques aussi.

**Après lecture :** fais une **répétition hybride** : cinq minutes maths au tableau (Elo ou combinatoire), cinq minutes oral sur le lien avec une idée NSI (minimax ou données), avec le support que tu comptes utiliser.

---

## Sources

- Ministère de l’Éducation nationale (2026). *Baccalauréat : comment se passe le Grand oral ?* [Présentation officielle](https://www.education.gouv.fr/reussir-au-lycee/baccalaureat-comment-se-passe-le-grand-oral-100028).
- Shannon, C. E. (1950). *Programming a Computer for Playing Chess*. Philosophical Magazine. [Article original](https://www.computerhistory.org/chess/doc-431614f453dde/).
- FIDE (2024). *FIDE Rating Regulations*. [Score attendu et coefficients K](https://handbook.fide.com/chapter/B022024).
- Russell, S., & Norvig, P. (s. d.). *Adversarial Search*, projet de chapitre d’Artificial Intelligence: A Modern Approach, Berkeley. [Recherche adversariale](https://aima.cs.berkeley.edu/4th-ed/pdfs/newchap06.pdf).
- Silver, D., et al. (2017). *Mastering Chess and Shogi by Self-Play with a General Reinforcement Learning Algorithm*. arXiv. [Préprint](https://arxiv.org/html/1712.01815v1).
- Équipe Stockfish (sans date). *Stockfish*. [Projet officiel et description NNUE](https://github.com/official-stockfish/Stockfish).
- Edwards, S., et contributeurs (sans date). *Perft Results*. Chess Programming Wiki. [Décompte des suites légales](https://www.chessprogramming.org/Perft_Results).
