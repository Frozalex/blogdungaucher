---
title: "Minimax aux échecs : l'algorithme qui pense à ta place"
excerpt: "Minimax est l'algorithme fondamental de la réflexion stratégique aux échecs. Des moteurs modernes à ta propre pensée à l'échiquier, voici comment cet outil mathématique structure chaque décision."
publishDate: "2026-05-13"
category: "science"
featured: false
featuredRank: 99
readingTime: "15 min"
pillar: "Intelligence artificielle"
tags: ["minimax", "algorithme", "intelligence artificielle", "échecs", "informatique", "Stockfish", "calcul"]
seoTitle: "Minimax aux échecs : l'algorithme de la stratégie parfaite"
seoDescription: "Comment fonctionne l'algorithme minimax aux échecs. Des premières machines à Stockfish et AlphaZero, l'histoire et le fonctionnement du calcul stratégique."
---

Il y a quelque chose d'étrange dans le fait que la stratégie aux échecs, ce jeu millénaire d'intuition et d'art, puisse être réduite à un algorithme de quelques lignes. L'algorithme minimax fait exactement cela : il formalise le coeur du raisonnement stratégique dans un jeu à somme nulle en une récurrence mathématique élégante. Et ce n'est pas seulement l'âme des moteurs d'échecs modernes : c'est aussi la description formelle de ce que tu fais dans ta tête quand tu calcules.

> **L'essentiel en 4 points :**
> - Minimax est l'algorithme qui explore l'arbre des parties en alternant maximisation (Blanc) et minimisation (Noir)
> - L'élagage alpha-bêta réduit dramatiquement le nombre de noeuds à explorer sans changer le résultat
> - Les moteurs modernes ajoutent des fonctions d'évaluation heuristiques, des tables de transposition et des techniques de recherche avancées
> - AlphaZero a montré qu'une approche basée sur l'apprentissage profond peut surpasser minimax pur pour les jeux complexes

## L'intuition derrière minimax

Imagine que tu joues les Blancs et que tu veux choisir le meilleur coup possible. Comment le définir ? Le meilleur coup est celui qui, en supposant que ton adversaire joue aussi parfaitement, te donne le meilleur résultat final.

Cette définition récursive est l'essence de minimax. Blanc veut maximiser le résultat (du point de vue des Blancs). Noir veut minimiser le résultat (du point de vue des Blancs, ou symétriquement maximiser du sien). Les deux joueurs alternent, et à chaque niveau de l'arbre, c'est l'un ou l'autre qui joue.

La formalisation mathématique est directe :

$$\text{minimax}(p, d) = \begin{cases} \text{évaluation}(p) & \text{si } d = 0 \text{ ou } p \text{ est terminal} \\ \max_{c \in C(p)} \text{minimax}(\text{succ}(p,c), d-1) & \text{si c'est le tour de Blanc} \\ \min_{c \in C(p)} \text{minimax}(\text{succ}(p,c), d-1) & \text{si c'est le tour de Noir} \end{cases}$$

Où $p$ est la position courante, $d$ est la profondeur de recherche restante, $C(p)$ est l'ensemble des coups légaux en $p$, et $\text{succ}(p,c)$ est la position résultant du coup $c$ en $p$.

## La fonction d'évaluation : le coeur du moteur

Minimax pur résoudrait les échecs parfaitement si tu pouvais explorer l'arbre complet jusqu'aux positions terminales. En pratique, c'est impossible en raison de la complexité combinatoire ($10^{120}$ feuilles selon Shannon). Il faut arrêter la recherche à une profondeur finie et évaluer les positions non-terminales avec une **fonction d'évaluation heuristique**.

Historiquement, les premières fonctions d'évaluation étaient simples : comptage du matériel (dame = 9 pions, tour = 5, fou/cavalier = 3). Les moteurs modernes comme [Stockfish](https://fr.wikipedia.org/wiki/Stockfish_(moteur_d%27%C3%A9checs)) utilisent des fonctions d'évaluation extrêmement sophistiquées qui intègrent :

**La valeur du matériel** : avec des tables de valeurs contextuelles qui varient selon la phase de jeu. Un cavalier vaut davantage en milieu de jeu fermé que dans une fin de partie ouverte.

**La mobilité des pièces** : le nombre de coups légaux disponibles pour chaque pièce. Une pièce avec plus de mobilité est généralement plus forte.

**La sécurité du roi** : la solidité de la structure de pions autour du roi, les lignes ouvertes vers lui, les pièces adverses menaçantes.

**La structure des pions** : les pions doublés (affaiblis), isolés (sans soutien), arriérés (ne pouvant plus avancer), passés (sans pions adverses sur leur chemin vers la promotion).

**Le contrôle du centre** : l'occupation et le contrôle des cases centrales e4, d4, e5, d5 et leurs environs.

Ces éléments sont pondérés et combinés dans une formule qui tente d'approximer la "vraie" valeur de la position.

## L'élagage alpha-bêta : l'intelligence de l'abandon

L'algorithme minimax brut est d'une inefficacité spectaculaire. Pour une profondeur de recherche de $d$ coups et un facteur de branchement de $b$ (nombre moyen de coups légaux), il faut évaluer $b^d$ positions. À $b = 35$ et $d = 10$, c'est $35^{10} \approx 2{,}8 \times 10^{15}$ positions. Impossible en pratique.

L'[élagage alpha-bêta](https://fr.wikipedia.org/wiki/%C3%89lagage_alpha-b%C3%AAta), développé indépendamment par plusieurs chercheurs dans les années 1950-1960 et formalisé par [John McCarthy](https://fr.wikipedia.org/wiki/John_McCarthy_(informaticien)), résout ce problème en élaguant les branches qui ne peuvent pas influencer la décision finale.

Le principe est le suivant : si tu as déjà trouvé une option pour Blanc qui garantit un résultat de valeur $\alpha$, et que tu explores une branche où Noir peut forcer un résultat inférieur à $\alpha$ pour Blanc, cette branche peut être abandonnée. Blanc ne la choisira jamais, car il a déjà mieux.

Formellement, tu maintiens deux bornes (dans le pseudo-code ou sur le tableau) :
- $\alpha$ : la meilleure valeur déjà garantie pour le joueur maximisant (Blanc)
- $\beta$ : la meilleure valeur déjà garantie pour le joueur minimisant (Noir)

Quand $\alpha \geq \beta$, la branche courante est élagée : elle ne peut pas produire un résultat meilleur que ce qui est déjà connu.

Dans le cas optimal (si les coups sont ordonnés par ordre de qualité décroissante), alpha-bêta réduit le nombre de noeuds de $b^d$ à $b^{d/2}$, doublant effectivement la profondeur de recherche possible pour un même budget de calcul.

## Les techniques avancées des moteurs modernes

Les moteurs d'échecs modernes comme Stockfish ajoutent de nombreuses techniques au-dessus d'alpha-bêta de base :

**Tables de transposition** : un cache de positions déjà analysées. Si la même position est atteinte par des ordres de coups différents (transposition), le moteur réutilise l'analyse précédente au lieu de la recalculer. Les tables de transposition peuvent économiser des ordres de grandeur en temps de calcul.

**Approfondissement itératif** : au lieu d'effectuer directement une recherche à profondeur $d$, le moteur enchaîne des recherches successives à profondeur 1, 2, 3, ..., $d$. Chaque itération fournit un meilleur ordonnancement des coups pour l'itération suivante, améliorant l'efficacité de l'élagage.

**Recherche de quiescence** : à la profondeur maximale, au lieu d'évaluer statiquement, la recherche se prolonge jusqu'à une position "quiescente" (stable), en n'explorant que les captures et promotions. Cela évite d'évaluer des positions où un échange de pièces non résolu fausserait l'évaluation.

**Extensions de recherche** : dans certaines positions (mat en vue, pion passé avancé, position critique), la profondeur de recherche est automatiquement étendue au-delà de la limite nominale pour éviter l'effet d'horizon.

**Réductions de recherche (LMR)** : inversement, pour les coups peu prometteurs (late move reduction), la profondeur est réduite pour économiser du temps. Si ces coups s'avèrent meilleurs que prévu, la profondeur est restaurée.

## L'histoire des moteurs minimax : de Claude Shannon à Stockfish

L'histoire des moteurs d'échecs est l'histoire des améliorations successives de minimax.

En 1950, [Claude Shannon](https://fr.wikipedia.org/wiki/Claude_Shannon) a posé les bases théoriques dans son article "Programming a Computer for Playing Chess", identifiant les deux approches (force brute vs. sélection heuristique) et les défis fondamentaux.

En 1957, [Alex Bernstein](https://fr.wikipedia.org/wiki/Alex_Bernstein) a créé le premier programme d'échecs fonctionnel sur IBM 704, utilisant une version simplifiée de minimax avec une évaluation rudimentaire.

Les années 1970-1980 ont vu l'essor des puces dédiées aux échecs. [Belle](https://fr.wikipedia.org/wiki/Belle_(programme_d%27%C3%A9checs)) de Ken Thompson et Joe Condon fut le premier programme à atteindre le niveau maître. [Deep Thought](https://fr.wikipedia.org/wiki/Deep_Thought_(programme_d%27%C3%A9checs)) d'Hsu et Campbell atteignit le niveau Grand Maître.

L'apogée du minimax classique fut [Deep Blue](https://fr.wikipedia.org/wiki/Deep_Blue), qui battit [Kasparov](https://fr.wikipedia.org/wiki/Garry_Kasparov) en 1997. Deep Blue évaluait 200 millions de positions par seconde avec une fonction d'évaluation développée en collaboration avec des Grand Maîtres.

[Stockfish](https://fr.wikipedia.org/wiki/Stockfish_(moteur_d%27%C3%A9checs)), développé depuis 2008, représente l'aboutissement de l'approche minimax classique avec une évaluation manuelle. Depuis 2020, il intègre [NNUE](https://fr.wikipedia.org/wiki/NNUE) (Efficiently Updatable Neural Network), un réseau de neurones intégré à la fonction d'évaluation.

## AlphaZero et le dépassement de minimax

En 2017, [DeepMind](https://fr.wikipedia.org/wiki/Google_DeepMind) a publié les résultats d'[AlphaZero](https://fr.wikipedia.org/wiki/AlphaZero), un programme qui a appris à jouer aux échecs par auto-jeu en quelques heures et battu Stockfish de façon convaincante.

AlphaZero n'utilise pas minimax classique mais une [Monte Carlo Tree Search](https://fr.wikipedia.org/wiki/Recherche_arborescente_Monte-Carlo) (MCTS) guidée par un réseau de neurones profond. Au lieu d'explorer exhaustivement l'arbre avec élagage, MCTS explore stochastiquement les branches les plus prometteuses selon une politique apprise.

Ce qui a frappé la communauté des échecs n'est pas seulement la performance d'AlphaZero, mais son style de jeu. AlphaZero joue de façon audacieuse et créative, avec des sacrifices de matériel à long terme et une préférence pour l'activité des pièces sur les avantages matériels immédiats. Ce style ressemble plus à un joueur humain intuitif qu'à un moteur de force brute.

AlphaZero a montré que minimax n'est pas la seule voie vers la maîtrise des échecs. L'apprentissage par renforcement peut produire une compréhension différente et parfois plus profonde du jeu.

## Minimax dans ta tête

L'aspect le plus fascinant de minimax pour le joueur pratique est qu'il décrit ce que tu fais déjà quand tu calcules des variantes. Quand tu penses "si je joue là, il peut répondre ça ou ça. S'il répond ça, je joue ceci et il est forcé de...", tu exécutes mentalement un algorithme minimax tronqué.

Tes limites humaines déterminent la "profondeur" de ta recherche. Un joueur à 1200 explore peut-être 2-3 niveaux de façon fiable. Un Grand Maître explore 7-10 niveaux dans des positions stratégiques et davantage dans les positions tactiques forcées.

La différence entre un joueur moyen et un Grand Maître n'est pas seulement la profondeur : c'est aussi la qualité de la fonction d'évaluation interne (l'intuition positionnelle) et l'efficacité de l'élagage (la capacité à identifier rapidement les coups pertinents et à ignorer les mauvais sans les calculer).

Entraîner ces deux aspects est au coeur du développement d'un joueur : enrichir son sens positionnel pour améliorer son évaluation, et affiner son instinct des "coups candidats" pour améliorer son élagage. Minimax est la description formelle de ce processus.

---

### Sources et références

- **Shannon, C. E.** *Programming a Computer for Playing Chess.* Philosophical Magazine, Series 7, 41(314), 256-275, 1950. (L'article fondateur des moteurs d'échecs et de l'application de minimax.)
- **Silver, D., et al.** [*Mastering Chess and Shogi by Self-Play with a General Reinforcement Learning Algorithm.*](https://arxiv.org/abs/1712.01815) arXiv, 2017. (La publication originale d'AlphaZero.)
- **Knuth, D. E., & Moore, R. W.** *An Analysis of Alpha-Beta Pruning.* Artificial Intelligence, 6(4), 293-326, 1975. (L'analyse formelle de l'algorithme alpha-bêta.)
- **Campbell, M., Hoane, A. J., & Hsu, F.** [*Deep Blue.*](https://www.sciencedirect.com/science/article/pii/S0004370201001291) Artificial Intelligence, 134(1-2), 57-83, 2002. (La description du système Deep Blue qui battit Kasparov.)
- **Iyengar, S.** *Chess Programming: From Minimax to Neural Networks.* ACM Computing Surveys, 2019. (La revue des approches algorithmiques en informatique des échecs.)
