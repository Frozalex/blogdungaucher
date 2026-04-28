---
title: "Grand oral Maths + NSI : les échecs comme pont entre les deux spécialités"
excerpt: "Le sujet transversal le plus puissant pour les élèves Maths+NSI : comment la combinatoire (Maths) explique pourquoi le minimax (NSI) est nécessaire, et comment les probabilités (Maths) fondent l'IA (NSI) qui a révolutionné les échecs."
publishDate: "2026-04-28"
category: "science"
featured: false
featuredRank: 99
readingTime: "24 min"
pillar: "Cognition"
tags: ["grand oral", "mathématiques", "NSI", "terminale", "combinatoire", "théorie des jeux", "IA", "Elo", "minimax", "baccalauréat", "transversal"]
seoTitle: "Grand oral Maths + NSI : les échecs, pont entre les deux spécialités"
seoDescription: "Le sujet transversal Maths+NSI le plus puissant : combinatoire ↔ minimax, probabilités Elo ↔ bases de données, graphes ↔ structures de données. Plan, formules et code."
titleEn: "Grand Oral Maths + CS: Chess as a Bridge Between Both Specialities"
excerptEn: "The most powerful cross-disciplinary subject for Maths+CS students: how combinatorics (Maths) explains why minimax (CS) is necessary, and how probability (Maths) underpins the AI (CS) that revolutionised chess."
seoTitleEn: "Grand Oral Maths + CS: Chess, the Bridge Between Both Specialities"
seoDescriptionEn: "The most powerful cross-disciplinary Grand Oral subject: combinatorics ↔ minimax, Elo probability ↔ databases, graphs ↔ data structures. Outline, formulas and code."
faq:
  - question: "Pourquoi le lien entre les mathématiques et les échecs est-il un bon sujet de Grand Oral ?"
    answer: "Ce sujet mêle des notions du programme de terminale (combinatoire, probabilités, théorie des graphes, algorithmique) à un objet culturel concret et connu du jury. Il permet une démonstration visuelle sur l'échiquier, une ouverture vers l'intelligence artificielle et une conclusion philosophique sur la pensée formelle, ce qui facilite la structuration en trois parties et anticipe naturellement les questions du jury."
  - question: "Quelle est la part des mathématiques dans le jeu d'échecs ?"
    answer: "Les échecs s'appuient sur plusieurs domaines mathématiques : la combinatoire (le nombre de Shannon évalue à 10^120 le nombre de parties possibles), la théorie des jeux (l'algorithme minimax, formalisé par John von Neumann), la théorie des graphes (problème du cavalier, graphe des déplacements de pièces), les probabilités (évaluation statistique des ouvertures), et l'algèbre linéaire (apprentissage par renforcement dans AlphaZero). Chaque pièce, chaque coup, chaque classement a un substrat mathématique précis."
  - question: "Comment expliquer le classement Elo lors d'un Grand Oral ?"
    answer: "Le classement Elo, inventé par le physicien Arpad Elo, repose sur la loi logistique : la probabilité qu'un joueur A batte un joueur B vaut 1/(1+10^((Rb-Ra)/400)). Chaque partie met à jour les deux cotes selon l'écart entre le résultat attendu et le résultat réel. C'est un exemple direct de probabilités appliquées et de statistiques bayésiennes accessibles en terminale, ce qui en fait un argument fort pour le jury de mathématiques."
  - question: "Qu'est-ce que le problème du cavalier et pourquoi est-il utile au Grand Oral ?"
    answer: "Le problème du cavalier consiste à trouver un chemin sur un échiquier 8×8 où le cavalier visite exactement une fois chacune des 64 cases. Il appartient à la théorie des graphes (chercher un chemin hamiltonien dans le graphe de déplacements du cavalier) et peut être résolu par des algorithmes de backtracking ou la règle de Warnsdorff. C'est un exemple parfait pour illustrer comment la mathématique formelle s'applique à un objet physique posé devant le jury."
  - question: "Comment utiliser AlphaZero comme argument dans un Grand Oral sur les maths et les échecs ?"
    answer: "AlphaZero (DeepMind, 2017) est un programme d'apprentissage par renforcement qui n'a utilisé aucune partie humaine : il a appris uniquement en jouant contre lui-même. En moins de 24 heures, il atteignait un niveau supérieur à Stockfish. Pour un Grand Oral, il illustre le passage de l'approche algorithmique classique (minimax, élagage alpha-bêta) à l'apprentissage automatique par réseaux de neurones, ancrant les maths dans l'actualité de l'IA."
  - question: "Quelles questions peut poser le jury sur les maths et les échecs au Grand Oral ?"
    answer: "Les questions fréquentes du jury portent sur : le calcul explicite du nombre de parties possibles, la démonstration du problème du cavalier (graphe hamiltonien), la formule Elo et son interprétation probabiliste, la différence entre arbre minimax et apprentissage par renforcement, et les limites de la modélisation (la résolution complète des échecs reste hors de portée). Préparer ces cinq angles couvre la majorité des questions possibles."
---

Tu as Maths **et** NSI en terminale. Et tu veux un sujet de Grand Oral qui exploite **les deux** — pas un sujet Maths avec un saupoudrage informatique, ni un sujet NSI avec une formule mathématique décorative.

Les échecs sont ce sujet transversal. La combinatoire (Maths) explique *pourquoi* l'algorithme minimax (NSI) est indispensable. Les probabilités (Maths) fondent le classement Elo que les bases de données (NSI) stockent et interrogent. Les graphes (Maths) sont la structure de données (NSI) sur laquelle le problème du cavalier est défini. AlphaZero repose sur l'algèbre linéaire (Maths) implémentée sous forme de réseau de neurones (NSI).

Ce n'est pas un sujet où Maths et NSI se côtoient par hasard. C'est un sujet où chaque notion mathématique *engendre* un besoin informatique, et chaque implémentation informatique *suppose* un fondement mathématique. C'est le pont réel entre les deux disciplines.

> **Pourquoi cet article est différent des deux autres de la série ?**
> - L'article [Grand oral spé Maths](/fr/blog/grand-oral-maths-spe-echecs/) développe le détail des formules, suites et loi binomiale pour les candidats avec Maths uniquement
> - L'article [Grand oral spé NSI](/fr/blog/grand-oral-nsi-echecs/) développe le code Python, les structures de données et l'IA pour les candidats avec NSI uniquement
> - **Cet article construit les ponts entre les deux disciplines** : il est fait pour les élèves Maths+NSI qui veulent un sujet transversal et un jury qui peut interroger dans les deux directions

Cet article te donne le plan complet, le contenu des deux programmes, les points de connexion entre les disciplines, et les conseils pour tenir la distance face à un jury qui connaît les deux spécialités.

> **L'essentiel en 5 points :**
> - La combinatoire (Maths) produit 10^120 parties → rend le minimax (NSI) **nécessaire**
> - Les probabilités Elo (Maths) sont stockées et interrogées en SQL (NSI)
> - Les graphes hamiltoniens (Maths) sont implémentés comme arbres de décision (NSI)
> - AlphaZero = algèbre linéaire des réseaux de neurones (Maths) + apprentissage par renforcement (NSI)
> - Un sujet transversal oblige le jury à poser des questions *entre* les deux disciplines : c'est l'avantage compétitif

## Les trois ponts Maths ↔ NSI : l'angle unique du sujet transversal

Avant d'entrer dans le contenu, la structure de pensée est essentielle. Un jury de Grand Oral transversal Maths+NSI n'attend pas deux exposés collés l'un à l'autre. Il attend un candidat qui **montre comment les deux disciplines se nécessitent**.

| Côté Maths | Pont | Côté NSI |
|---|---|---|
| Combinatoire : 10^120 parties | → nécessite → | Algorithme minimax (pas de force brute possible) |
| Probabilités : formule Elo | → est stockée et calculée via → | Bases de données SQL, requêtes statistiques |
| Théorie des graphes : chemin hamiltonien | → est implémenté comme → | Arbre de décision, DFS récursif |
| Algèbre linéaire : matrices, fonctions | → est la structure de → | Réseaux de neurones d'AlphaZero |

Ce tableau est la colonne vertébrale de ton Grand Oral. Chaque ligne est une transition entre une partie et la suivante. Et c'est ce que les candidats Maths-seuls ou NSI-seuls **ne peuvent pas faire** : montrer que l'un engendre l'autre.

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

[Claude Shannon](https://fr.wikipedia.org/wiki/Claude_Shannon), père de la théorie de l'information, a calculé en 1950 le nombre de parties d'échecs distinctes. Son estimation, appelée le **nombre de Shannon**, est de l'ordre de **10^120**. Pour donner une échelle : le nombre d'atomes dans l'univers observable est estimé à environ 10^80. Le nombre de parties d'échecs possibles dépasse donc de quarante ordres de grandeur le nombre de particules connues dans l'univers.

Comment arrive-t-on à ce chiffre ? Voici l'argument de dénombrement que tu peux dérouler devant le jury :

1. Au premier coup des Blancs, il y a **20 coups possibles** (16 coups de pions + 4 coups de cavaliers).
2. Au premier coup des Noirs, il y a également **20 réponses possibles**.
3. Après un coup de chaque côté, on a donc **20 × 20 = 400 positions**.
4. Au deuxième coup, il y a environ **29 coups possibles en moyenne** pour chaque joueur.
5. L'arbre des coups grandit exponentiellement : après 3 coups de chaque côté, on dépasse **9 millions de positions**.

La formule générale est de la forme **b^d**, où **b** est le facteur de branchement moyen (≈ 35 aux échecs) et **d** la profondeur (nombre de coups moyen d'une partie, ≈ 80). On obtient 35^80 ≈ 10^124, dans le même ordre de grandeur que l'estimation de Shannon.

Ce calcul est parfait pour un Grand Oral : il repose uniquement sur la multiplication et la notion de puissance, des outils de première. Le jury peut suivre chaque étape, et le résultat est spectaculaire.

#### L'arbre des coups comme objet mathématique

Formellement, cet arbre est un **arbre enraciné orienté** : la racine est la position initiale, chaque nœud est une position, chaque arc est un coup légal, et les feuilles sont les positions finales (mat, nulle, abandon). Le nombre de nœuds de cet arbre est le nombre total de positions légales, estimé à environ **10^44** (nombre de positions légales distinctes, différent du nombre de parties car une même position peut être atteinte par des séquences différentes).

Cette distinction entre *nombre de parties* et *nombre de positions* est un bon point de précision que le jury peut creuser.

### Logique et résolution de problèmes : la pensée stratégique comme raisonnement formel

Au-delà du dénombrement, les échecs sont un système **logique formel** : il y a des axiomes (les règles du jeu), des états (les positions), et des transformations valides (les coups légaux). Résoudre une position tactique, c'est construire une démonstration : « Si je joue A, il répond B ou C. Si B, alors D est forcing. Si C, alors E est mat en deux coups. »

Cette structure est exactement celle d'une **démonstration par disjonction de cas** en mathématiques, un outil fondamental de la logique formelle que le jury reconnaîtra immédiatement.

Les joueurs d'échecs de haut niveau décrivent souvent leur processus de calcul comme « construire une ligne forcée » : identifier une séquence de coups où, quelle que soit la réponse de l'adversaire, la conclusion est inévitable. C'est la définition d'une **implication universelle** : ∀ réponse de l'adversaire, ∃ continuation gagnante. Cette formalisation peut être présentée en deux phrases devant le jury et crée un pont immédiat entre les deux disciplines.

## Probabilités et analyse dans le jeu d'échecs

### Calculer les chances de victoire : la formule Elo

Le [classement Elo](https://fr.wikipedia.org/wiki/Classement_Elo), inventé par le physicien et mathématicien [Arpad Elo](https://fr.wikipedia.org/wiki/Arpad_Elo) dans les années 1960, est l'une des applications les plus élégantes des probabilités à un jeu. Il repose sur une idée simple : **la différence de cote entre deux joueurs doit prédire la probabilité de victoire de chacun**.

La formule est la suivante. La probabilité que le joueur A batte le joueur B est :

**P(A bat B) = 1 / (1 + 10^((Rb − Ra) / 400))**

où Ra et Rb sont les cotes Elo respectifs. Si Ra = Rb (cotes égales), on obtient P = 1/2, soit 50 % de victoire pour A. Si Ra = 2000 et Rb = 1600 (400 points d'écart), on obtient P ≈ 91 %.

Cette formule est la **fonction logistique**, une fonction en forme de S que l'on rencontre aussi en modélisation démographique, en médecine (probabilité d'un événement clinique) et dans les réseaux de neurones (fonction d'activation sigmoïde). Le faire remarquer au jury montre que tu places l'exemple dans une famille mathématique plus large.

La mise à jour des cotes après chaque partie obéit à une règle simple :

**Nouvelle cote de A = Ra + K × (résultat réel − résultat attendu)**

où K est un coefficient d'ajustement (32 pour les débutants, 16 pour les joueurs établis), le résultat réel vaut 1 (victoire), 0,5 (nulle) ou 0 (défaite), et le résultat attendu est le P calculé ci-dessus.

C'est un **estimateur bayésien** : chaque partie apporte de l'information sur la vraie force d'un joueur, et la cote converge vers cette vraie valeur au fil du temps. Ce mécanisme est directement lié aux notions de statistiques inférentielles du programme de terminale.

### L'impact des probabilités sur les ouvertures et les stratégies

Les bases de données de parties (Lichess dispose d'une base publique de plus de **3 milliards de parties**) permettent de calculer la fréquence de chaque ouverture et le taux de victoire associé pour les Blancs et les Noirs.

Par exemple, après 1.e4 e5 2.Nf3 Nc6 (ouverture italienne), les bases contemporaines donnent une victoire des Blancs dans environ 40 % des cas, une nulle dans 30 %, une victoire des Noirs dans 30 %. Ce sont des **fréquences relatives** qui convergent vers des probabilités théoriques à mesure que la taille de l'échantillon grandit.

Cette approche statistique est à la base de la préparation des joueurs professionnels : ils choisissent leurs ouvertures en optimisant leur espérance de gain mathématique. Un joueur de 2700 Elo qui joue une ouverture avec un taux de victoire moyen de 42 % au lieu de 38 % gagne 4 points d'espérance sur chaque partie — un avantage décisif sur un tournoi de 10 parties.

Pour un Grand Oral, c'est l'exemple parfait de l'**espérance mathématique appliquée** : E(gain) = P(victoire) × 1 + P(nulle) × 0,5 + P(défaite) × 0.

## L'intelligence artificielle et les échecs : une révolution mathématique

### Algorithmes de recherche : minimax et élagage alpha-bêta

La question naturelle après le calcul du nombre de Shannon est : comment un ordinateur peut-il jouer aux échecs si l'arbre complet des parties est inexplorable ? La réponse est l'**algorithme minimax**, formalisé par John von Neumann dans sa théorie des jeux.

Le principe est simple : à chaque nœud de l'arbre, le joueur dont c'est le tour cherche à **maximiser** son évaluation (si c'est lui) ou à **minimiser** celle de l'adversaire (si c'est l'adversaire). L'algorithme explore l'arbre en alternant ces deux opérations, d'où le nom « min-max ».

En pratique, on ne peut pas aller jusqu'aux feuilles de l'arbre (le mat). On s'arrête à une profondeur fixe et on applique une **fonction d'évaluation** qui donne une valeur numérique à chaque position intermédiaire (matériel restant, contrôle de l'espace, sécurité du roi...). Cette fonction est l'intelligence du programme : deux moteurs avec le même minimax mais des fonctions d'évaluation différentes auront des forces très différentes.

L'**élagage alpha-bêta**, développé par [John McCarthy](https://fr.wikipedia.org/wiki/John_McCarthy_(informaticien)) et ses collaborateurs dans les années 1950-60, est une optimisation du minimax qui permet d'éliminer des branches entières de l'arbre sans les explorer, dès qu'il est prouvé qu'elles ne peuvent pas améliorer le résultat. En pratique, il réduit la complexité effective de O(b^d) à environ O(b^(d/2)), ce qui, pour un facteur de branchement b = 35 et une profondeur d = 10, réduit le nombre de nœuds de 2,7 × 10^15 à environ 52 millions. Un gain de huit ordres de grandeur. C'est un résultat d'algorithmique parfaitement accessible en terminale NSI.

### L'apprentissage automatique et les supercalculateurs d'échecs

En 2017, [DeepMind](https://fr.wikipedia.org/wiki/DeepMind) a publié [AlphaZero](https://fr.wikipedia.org/wiki/AlphaZero), un programme d'apprentissage par renforcement qui a bouleversé le monde des échecs. Contrairement à [Stockfish](https://fr.wikipedia.org/wiki/Stockfish_(logiciel)), qui utilise une fonction d'évaluation codée à la main par des experts, AlphaZero **n'a reçu que les règles du jeu**. Il a ensuite joué contre lui-même en boucle, pendant moins de 24 heures, et a atteint un niveau supérieur à Stockfish — le meilleur programme classique — en 100 parties de test.

AlphaZero utilise un **réseau de neurones convolutif** (une architecture mathématique inspirée du traitement visuel biologique) pour évaluer les positions, et une méthode de **Monte Carlo Tree Search (MCTS)** pour guider son exploration de l'arbre des coups. La MCTS ajoute une dimension probabiliste à la recherche : au lieu d'explorer l'arbre de manière uniforme, elle concentre les ressources de calcul sur les branches qui ont produit des résultats positifs lors des simulations précédentes.

Ce résultat est l'un des arguments les plus frappants pour la conclusion d'un Grand Oral : **l'intelligence artificielle aux échecs est passée de la programmation explicite (dire à la machine quelles positions sont bonnes) à l'apprentissage implicite (laisser la machine découvrir par elle-même ce qui est bon)**. Ce glissement mathématique correspond au passage de l'optimisation combinatoire à l'apprentissage statistique, deux piliers des mathématiques contemporaines.

Pour aller plus loin sur la complexité mathématique sous-jacente, l'article [Pourquoi les échecs sont un problème mathématique (presque) impossible](/fr/blog/pourquoi-echecs-probleme-mathematique-impossible-et-ia/) décortique en détail l'arbre des coups, minimax et alpha-bêta.

## Applications pratiques et exemples concrets

### Le problème du cavalier et la théorie des graphes

C'est l'exemple à avoir en poche pour la démonstration en direct. Le problème du cavalier est le suivant : **est-il possible de déplacer un cavalier sur un échiquier 8×8 de façon à visiter exactement une fois chacune des 64 cases ?** Si oui, on appelle cette séquence un « tour du cavalier ».

Reformulé en théorie des graphes, c'est un problème de **chemin hamiltonien** : on construit un graphe G = (V, E) où les 64 cases sont les sommets, et on trace une arête entre deux cases si un cavalier peut se déplacer de l'une à l'autre en un coup. La question devient : ce graphe admet-il un chemin hamiltonien (passant par chaque sommet exactement une fois) ?

La réponse est **oui** : il existe des tours du cavalier sur l'échiquier standard. On en connaît des milliers (Leonard Euler, au XVIIIe siècle, a été l'un des premiers à les étudier systématiquement). Le graphe des déplacements du cavalier a des propriétés intéressantes : chaque case de coin n'a que 2 voisins, une case de centre peut en avoir jusqu'à 8. La non-uniformité du degré des sommets est précisément ce qui rend la recherche difficile.

**La règle de Warnsdorff** (1823) est un heuristique qui permet souvent de trouver un tour du cavalier rapidement : depuis la case actuelle, toujours aller vers la case qui a le **moins de successeurs encore non visités**. C'est un algorithme glouton (greedy) : on prend localement la meilleure décision, et empiriquement cela conduit souvent à la solution globale, bien qu'aucune preuve générale d'optimalité ne soit connue.

Pour un Grand Oral, tu peux montrer les 3 ou 4 premiers coups d'un tour du cavalier sur un mini-échiquier 5×5 (plus simple à dessiner au tableau), en expliquant à chaque étape que tu appliques la règle de Warnsdorff. C'est une démonstration visible, interactive, et qui mobilise des notions de graphes accessibles.

### L'analyse des coups et l'optimisation des stratégies

Les moteurs d'échecs modernes comme Stockfish produisent, pour chaque position, une **évaluation en centièmes de pion** : +0.30 signifie un léger avantage pour les Blancs, +2.50 un avantage décisif, −1.20 un avantage pour les Noirs. Cette évaluation est une approximation continue d'une valeur théoriquement discrète (victoire / nulle / défaite).

L'**analyse de partie** avec un moteur permet de mesurer précisément la qualité d'un joueur : on compare, pour chaque coup joué, l'évaluation avant et après. La somme des pertes d'évaluation divisée par le nombre de coups donne un **taux d'erreur moyen**, utilisé dans des études scientifiques pour comparer le niveau des joueurs à travers les époques (était [Kasparov](https://fr.wikipedia.org/wiki/Garry_Kasparov) meilleur que [Capablanca](https://fr.wikipedia.org/wiki/Jos%C3%A9_Ra%C3%BAl_Capablanca) ?) ou pour détecter la triche (un joueur qui joue systématiquement le coup optimal, comme le moteur, sur de nombreuses parties successives devient suspect).

Cette mesure est une application directe de la **statistique descriptive** : calcul de moyenne, de variance, comparaison d'échantillons.

### Comment les mathématiques aident à classer les joueurs d'échecs

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

## Structurer votre Grand Oral : un plan détaillé

Un Grand Oral dure vingt minutes : cinq minutes de questions et quinze à vingt minutes d'exposé. La structure ci-dessous est optimisée pour tenir ce cadre.

### Reformulation du plan pour l'angle transversal

Le plan en trois parties devient :
1. **Pourquoi les échecs débordent le calcul** → Maths (combinatoire) + NSI (complexité algorithmique)
2. **Comment les mesurer et les modéliser** → Maths (probabilités, Elo, graphes) + NSI (SQL, structures de données)
3. **Comment l'IA a dépassé la programmation** → Maths (algèbre linéaire) + NSI (réseaux de neurones, AlphaZero)

### Introduction percutante (3 minutes)

**Objectif :** capter l'attention et poser la problématique.

Commence par la mise en scène : *« Voici un échiquier. Il y a 64 cases, 32 pièces, et un nombre de parties possibles supérieur au nombre d'atomes de l'univers. »* Pose ce chiffre — 10^120 — sur le tableau. Le jury note le nombre. Tu as leur attention.

Puis formule ta **problématique** : *« En quoi les échecs sont-ils un objet mathématique, et comment cette nature mathématique a-t-elle transformé notre façon de penser l'intelligence artificielle ? »*

Annonce ton plan en trois parties : les fondements mathématiques du jeu, l'application des probabilités et des statistiques, et la révolution de l'intelligence artificielle.

### Partie I — Combinatoire (Maths) → Complexité (NSI) (7 minutes)

**Transition** : *« Je vais commencer par montrer pourquoi les échecs ne peuvent pas être résolus par la force brute — et cela va relier directement les mathématiques et l'informatique. »*

1. **[Maths] Combinatoire** : calcul de 10^120 par l'arbre (principe multiplicatif b^d), dessiner 2 niveaux au tableau. (2 min)
2. **Pont** : *« Cette explosion combinatoire est exactement pourquoi en NSI, on ne peut pas explorer tout l'arbre. Il faut un algorithme intelligent. »* (30 s)
3. **[NSI] Minimax + élagage alpha-bêta** : récursivité, coupure, O(b^d) → O(b^(d/2)). (2 min)
4. **Problème du cavalier** : chemin hamiltonien [Maths] / DFS récursif [NSI], règle de Warnsdorff en pseudo-code. (2 min 30)

### Partie II — Probabilités (Maths) → Données (NSI) (5 minutes)

**Transition** : *« Comment mesurer statistiquement ce jeu si complexe ? Les probabilités mathématiques rencontrent ici les bases de données informatiques. »*

1. **[Maths] Formule Elo** : formule logistique, calcul numérique deux exemples, suite récurrente. (2 min)
2. **Pont** : *« Ce modèle probabiliste est stocké et interrogé dans des bases de 3 milliards de parties. »*
3. **[NSI] SQL sur base de parties** : requête taux de victoire par ouverture, format PGN comme données structurées. (3 min)

### Partie III — Algèbre (Maths) → IA (NSI) (5 minutes)

**Transition** : *« La révolution d'AlphaZero illustre comment l'algèbre linéaire mathématique se traduit en apprentissage automatique. »*

1. **[NSI] Stockfish vs AlphaZero** : tableau comparatif, apprentissage par renforcement. (1 min 30)
2. **Pont** : *« AlphaZero repose sur des réseaux de neurones — dont la structure est purement algébrique. »*
3. **[Maths] Réseaux de neurones** : chaque couche = matrice de poids, activation sigmoïde = fonction logistique déjà vue avec Elo. (2 min)
4. **Portée** : le même AlphaZero a résolu le Go (10^170 parties) et le shogi avec les mêmes principes. (1 min 30)

### Conclusion et ouverture (2 minutes)

**Résumé** en trois phrases : les échecs sont un jeu fini mais combinatoirement inépuisable, les probabilités permettent de le mesurer statistiquement, et l'IA a montré que l'apprentissage pouvait supplanter la programmation.

**Ouverture** : *« Le théorème de Zermelo nous dit que l'issue parfaite des échecs est déterminée. Nous ne la connaissons pas encore. Et peut-être que la machine qui finira par la trouver n'aura été programmée par personne : elle l'aura appris seule. »*

C'est une conclusion philosophique qui reste dans les esprits du jury. Elle dit quelque chose d'important : les mathématiques formelles et l'apprentissage automatique se rejoignent à la frontière de la connaissance.

## Anticiper le jury transversal Maths+NSI

Un jury transversal peut interroger dans les deux directions. Voici les cinq questions les plus probables et leurs réponses synthétiques :

**1. « Vous dites que la combinatoire explique le minimax : pouvez-vous préciser ce lien ? »**
La croissance b^d (Maths, combinatoire) rend l'exploration complète impossible. Le minimax (NSI) est la réponse algorithmique : explorer jusqu'à une profondeur d limitée, évaluer les feuilles avec une heuristique, et propager les scores par récursivité. Sans la borne combinatoire, le minimax ne serait pas nécessaire.

**2. « Quel est le lien entre la fonction logistique Elo et la sigmoïde des réseaux de neurones ? »**
Ce sont la même fonction : f(x) = 1/(1+e^(−x)) (version continue) ou 1/(1+10^(−x/400)) (version Elo). Dans les deux cas, elle transforme un score réel en probabilité dans [0,1]. AlphaZero utilise la sigmoïde comme fonction d'activation dans ses couches internes — c'est le même outil mathématique que l'Elo.

**3. « Pourquoi l'élagage alpha-bêta réduit-il la complexité de O(b^d) à O(b^(d/2)) ? »**
Dans le meilleur cas (coups triés parfaitement), alpha-bêta n'explore que √(b^d) = b^(d/2) nœuds. Intuition : au lieu d'un arbre complet de b^d branches, on obtient un arbre « plié » dont la moitié des branches est élagée à chaque niveau.

**4. « En quoi AlphaZero est-il différent de Stockfish du point de vue mathématique ? »**
Stockfish maximise une fonction d'évaluation codée à la main (règle explicite). AlphaZero minimise une fonction de perte définie par le résultat des parties (apprentissage automatique). Mathématiquement, l'un est une optimisation combinatoire, l'autre est une descente de gradient dans un espace de paramètres de réseaux de neurones (algèbre linéaire + analyse).

**5. « Quel est le rapport entre le chemin hamiltonien (Maths) et la DFS (NSI) ? »**
Un parcours en profondeur (DFS) est exactement l'algorithme qui explore un graphe en cherchant un chemin hamiltonien par backtracking. Le graphe hamiltonien est l'objet mathématique ; la DFS est son implémentation informatique naturelle. C'est un exemple direct du pont Maths → NSI.

## Conseils pour un Grand Oral réussi

### Maîtriser le sujet et les outils de terminale

La règle d'or est simple : **ne mets dans ton exposé que ce que tu peux expliquer et défendre**. Si tu cites le réseau de neurones d'AlphaZero, tu dois être capable de répondre à « qu'est-ce qu'un réseau de neurones ? ». Si tu écris la formule Elo au tableau, tu dois pouvoir calculer un exemple numérique devant le jury.

Cela ne signifie pas que tu dois tout savoir. Cela signifie que tu dois savoir exactement où s'arrêtent tes connaissances. Un candidat qui dit *« AlphaZero utilise des réseaux de neurones, dont la structure interne dépasse le cadre de ce Grand Oral, mais dont le principe général est... »* montre sa lucidité. C'est plus valorisant que de broder.

Pour les notions du programme directement mobilisées (combinatoire, formule de probabilité, représentation graphique), l'exactitude est attendue. Revois les chapitres correspondants et prépare un ou deux calculs numériques que tu peux exécuter de tête ou rapidement au tableau.

### Anticiper les questions du jury

Les cinq angles de question les plus probables sur ce sujet sont :

1. **« Pouvez-vous calculer numériquement la probabilité Elo pour des cotes données ? »** → Prépare le calcul pour Ra=1800, Rb=2000, et pour Ra=2000, Rb=2000.

2. **« Quelle est la différence entre l'arbre minimax et l'apprentissage par renforcement ? »** → Minimax explore un arbre fixe avec une évaluation codée ; l'apprentissage par renforcement apprend la fonction d'évaluation par l'expérience.

3. **« Le problème du cavalier a-t-il toujours une solution ? »** → Sur un échiquier 8×8, oui. Sur un échiquier n×n, non systématiquement (les petits échiquiers comme 2×2 ou 3×3 n'ont pas de tour du cavalier).

4. **« Qu'est-ce que le théorème de Zermelo implique concrètement pour les échecs ? »** → Que l'une des trois issues (victoire des Blancs, victoire des Noirs, nulle) est « vraie » avec le jeu parfait. Mais que trouver cette stratégie parfaite reste hors de portée de toute machine actuelle.

5. **« Pourquoi dit-on que la formule Elo est probabiliste si les échecs sont un jeu déterministe ? »** → Les échecs sont déterministes dans leur structure (pas de hasard), mais les performances humaines varient selon la forme, la fatigue, la préparation. La loi normale modélise cette variabilité humaine, pas le jeu lui-même.

### Un mot sur la présentation physique

Si tu apportes l'échiquier, prépare une **position de départ d'un exemple précis** (les 4 premiers coups d'une ouverture classique, ou la position de départ du problème du cavalier). Ne laisse pas l'échiquier vide sur la table : le jury doit toujours savoir à quoi il sert à chaque moment de l'exposé.

Ton tableau (blanc ou noir) doit avoir deux ou trois éléments préparés à l'avance : le plan en trois parties, la formule Elo, et l'arbre des deux premiers coups. Tout le reste peut être ajouté en direct, mais ces trois éléments ancrent visuellement ton exposé dès le départ.

## Les trois articles de la série : choisir le bon

Ce sujet existe en trois versions adaptées à chaque profil :

- **Tu as uniquement la spécialité Maths** → [Grand oral spé Maths : suites, loi binomiale et combinatoire](/fr/blog/grand-oral-maths-spe-echecs/) : formules détaillées, calculs numériques, loi binomiale pour les tournois, suite récurrente Elo.

- **Tu as uniquement la spécialité NSI** → [Grand oral spé NSI : minimax Python, bitboard et AlphaZero](/fr/blog/grand-oral-nsi-echecs/) : code Python commenté, structures de données, format PGN, SQL, progression Stockfish → AlphaZero.

- **Tu as Maths + NSI** → **Cet article** : les ponts entre les deux disciplines, le plan transversal, les questions du jury croisées.

## Ce que ce sujet dit de toi au jury

Un jury de Grand Oral ne juge pas seulement les connaissances. Il observe comment tu penses. Un candidat qui choisit ce sujet et le présente avec cette structure montre trois choses distinctes :

Premièrement, qu'il sait **lier abstraction et concret** : la formule Elo n'est pas récitée, elle est calculée sur un exemple vivant. Le théorème de Zermelo n'est pas cité en note de bas de page, il est le pivot philosophique de la conclusion.

Deuxièmement, qu'il a **une curiosité qui dépasse le programme** : AlphaZero n'est pas au programme de terminale, mais sa présentation montre que le candidat a lu au-delà des manuels. Le jury voit quelqu'un qui a cherché, pas quelqu'un qui a révisé.

Troisièmement, qu'il sait **structurer un raisonnement en public** : vingt minutes, trois parties, un fil rouge qui part du dénombrement pour finir sur l'apprentissage automatique. Ce fil n'est pas accidentel : il suit la logique des mathématiques du plus fondamental (compter) au plus contemporain (apprendre).

Les meilleurs Grands Oraux ne sont pas ceux où le candidat en sait le plus. Ce sont ceux où le jury comprend **pourquoi ce candidat a choisi ce sujet, et ce que ce sujet lui a appris sur lui-même**.

Et si l'on te demande pourquoi tu as choisi les échecs, la réponse honnête et la plus forte est aussi la plus simple : parce que c'est un jeu où l'on pense à voix haute. Et les mathématiques aussi.

---

### Sources et références

- **Shannon, C. E. (1950).** [*Programming a Computer for Playing Chess.*](https://www.cs.mcgill.ca/~dprecup/courses/AI/Materials/shannon1950.pdf) *Philosophical Magazine*, 41(314), 256–275. (Estimation du nombre de parties d'échecs possibles, fondement du « nombre de Shannon ».)
- **Zermelo, E. (1913).** *Über eine Anwendung der Mengenlehre auf die Theorie des Schachspiels.* Proceedings of the Fifth International Congress of Mathematicians. (Démonstration de l'existence d'une stratégie gagnante dans tout jeu fini à information parfaite.)
- **von Neumann, J. & Morgenstern, O. (1944).** [*Theory of Games and Economic Behavior.*](https://press.princeton.edu/books/paperback/9780691130613/theory-of-games-and-economic-behavior) Princeton University Press. (Fondation formelle de la théorie des jeux et de l'algorithme minimax.)
- **Elo, A. E. (1978).** *The Rating of Chessplayers, Past and Present.* Arco Publishing. (Présentation du système probabiliste de classement Elo et de son fondement statistique.)
- **Silver, D., et al. (DeepMind, 2018).** [*A general reinforcement learning algorithm that masters chess, shogi, and Go through self-play.*](https://www.science.org/doi/10.1126/science.aar6404) *Science*, 362(6419), 1140–1144. (Publication originale d'AlphaZero et de ses résultats contre Stockfish.)
- **Euler, L. (1759).** *Solution d'une question curieuse qui ne paroit soumise à aucune analyse.* Mémoires de l'Académie Royale des Sciences. (Étude pionnière du problème du cavalier et de la règle de Warnsdorff.)
- **Warnsdorff, H. C. (1823).** *Des Rösselsprunges einfachste und allgemeinste Lösung.* Schmalkalden. (Formulation originale de la règle heuristique pour le tour du cavalier.)
