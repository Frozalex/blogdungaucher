---
title: "Minimax aux échecs : l'algorithme qui pense à ta place"
excerpt: "Minimax est l'algorithme fondamental de la réflexion stratégique aux échecs. Des moteurs modernes à ta propre pensée à l'échiquier, voici comment cet outil mathématique structure chaque décision."
publishDate: "2026-05-13"
updatedDate: "2026-05-21"
category: "science"
featured: false
featuredRank: 99
readingTime: "11 min"
pillar: "Intelligence artificielle"
tags: ["minimax", "alpha-bêta", "negamax", "null-move", "intelligence artificielle", "échecs", "informatique", "Stockfish", "calcul"]
seoTitle: "Algorithme minimax aux échecs : alpha-bêta, negamax et calcul des moteurs"
seoDescription: "Minimax, négamax, alpha-bêta et MCTS : comprendre la recherche des moteurs, ses garanties et ses limites, sans en faire un modèle démontré du cerveau humain."
faq:
  - question: Minimax donne-t-il toujours le meilleur coup ?
    answer: >-
      Sur un arbre fini exploré jusqu’aux issues terminales correctement évaluées, il donne une décision optimale.
      Avec une coupure heuristique, sa garantie porte seulement sur cet arbre évalué, pas sur la vérité complète de la position.
  - question: Alpha-bêta change-t-il la valeur de minimax ?
    answer: >-
      À arbre, profondeur et évaluations identiques, l’algorithme exact conserve la valeur minimax. Plusieurs coups
      peuvent partager cette valeur : leur départage peut varier. Les élagages sélectifs supplémentaires ont d’autres garanties.
  - question: Tous les moteurs utilisent-ils negamax et alpha-bêta ?
    answer: >-
      Non. Negamax est une écriture de minimax adaptée aux jeux à somme nulle. Stockfish emploie une recherche alpha-bêta sélective,
      tandis qu’AlphaZero emploie MCTS guidé par un réseau.
  - question: Mon cerveau exécute-t-il minimax ?
    answer: >-
      C’est une analogie de raisonnement : tu compares des coups et des réponses. Les sources présentées ne démontrent
      ni un algorithme cérébral identique ni une profondeur fixe associée à ton Elo.

heroImage:
  src: /images/blog/minimax-aux-echecs-hero.webp
  alt: Un arbre élagué au-dessus d'une pièce d'échecs, la plupart des branches
    coupées net.
ogImage: /images/og/minimax-aux-echecs-og.webp

---

Il y a quelque chose d'étrange dans le fait que la stratégie aux échecs, ce jeu millénaire d'intuition et d'art, puisse être réduite à un algorithme de quelques lignes. L'algorithme minimax fait exactement cela : il formalise le coeur du raisonnement stratégique dans un jeu à somme nulle en une récurrence mathématique élégante. Et ce n'est pas seulement l'âme des moteurs d'échecs modernes : c’est aussi une analogie utile pour organiser ton calcul, sans constituer une description démontrée de ton cerveau. (Pour le cadre théorique général dont minimax est l'algorithme central, voir [théorie des jeux aux échecs](/fr/blog/theorie-des-jeux-aux-echecs/) ; pour le théorème qui garantit l'existence d'une valeur à toute position, [le paradoxe de Zermelo](/fr/blog/paradoxe-de-zermelo/).)

## L'intuition derrière minimax

Imagine que tu joues les Blancs et que tu veux choisir le meilleur coup possible. Comment le définir ? Le meilleur coup est celui qui, en supposant que ton adversaire joue aussi parfaitement, te donne le meilleur résultat final.

Cette définition récursive est l'essence de minimax. Blanc veut maximiser le résultat (du point de vue des Blancs). Noir veut minimiser le résultat (du point de vue des Blancs, ou symétriquement maximiser du sien). Les deux joueurs alternent, et à chaque niveau de l'arbre, c'est l'un ou l'autre qui joue.

La formalisation mathématique est directe :

$$\text{minimax}(p, d) = \begin{cases} \text{évaluation}(p) & \text{si } d = 0 \text{ ou } p \text{ est terminal} \\ \max_{c \in C(p)} \text{minimax}(\text{succ}(p,c), d-1) & \text{si c'est le tour de Blanc} \\ \min_{c \in C(p)} \text{minimax}(\text{succ}(p,c), d-1) & \text{si c'est le tour de Noir} \end{cases}$$

Où $p$ est la position courante, $d$ est la profondeur de recherche restante, $C(p)$ est l'ensemble des coups légaux en $p$, et $\text{succ}(p,c)$ est la position résultant du coup $c$ en $p$.

## La fonction d'évaluation : le coeur du moteur

Minimax pur résoudrait les échecs parfaitement si tu pouvais explorer l'arbre complet jusqu'aux positions terminales. En pratique, c'est impossible en raison de la complexité combinatoire (l’ordre de grandeur de Shannon illustre l’explosion des suites de coups, pas un dénombrement exact des feuilles). Il faut arrêter la recherche à une profondeur finie et évaluer les positions non-terminales avec une **fonction d'évaluation heuristique**.

Une évaluation classique combine des caractéristiques telles que le matériel, la mobilité, la sécurité des rois et la structure de pions. Ces repères aident à lire une position ; ils ne constituent pas des valeurs absolues indépendantes du contexte.

Stockfish a intégré l’évaluation neuronale NNUE en 2020. Il faut distinguer cette architecture des anciennes sommes de critères écrits à la main. Dans la récurrence présentée, « évaluation » doit retourner l’utilité exacte d’une issue terminale et une estimation pour une position simplement coupée à profondeur zéro.

## L'élagage alpha-bêta : l'intelligence de l'abandon

L'algorithme minimax brut est d'une inefficacité spectaculaire. Pour une profondeur de recherche de $d$ demi-coups et un facteur de branchement de $b$ (nombre moyen de coups légaux), le nombre de feuilles est de l’ordre de $b^d$ dans le modèle uniforme. À $b = 35$ et $d = 10$, c'est $35^{10} \approx 2{,}8 \times 10^{15}$ positions. Impossible en pratique.

L'[élagage alpha-bêta](https://fr.wikipedia.org/wiki/%C3%89lagage_alpha-b%C3%AAta), développé indépendamment par plusieurs chercheurs dans les années 1950-1960 et formalisé par John McCarthy, réduit le coût en élaguant les branches qui ne peuvent pas influencer la décision finale.

Le principe est le suivant : si tu as déjà trouvé une option pour Blanc qui garantit un résultat de valeur $\alpha$, et que tu explores une branche où Noir peut forcer un résultat inférieur à $\alpha$ pour Blanc, cette branche peut être abandonnée. Blanc ne la choisira jamais, car il a déjà mieux.

Formellement, tu maintiens deux bornes (dans le pseudo-code ou sur le tableau) :
- $\alpha$ : la meilleure valeur déjà garantie pour le joueur maximisant (Blanc)
- $\beta$ : la meilleure valeur déjà garantie pour le joueur minimisant (Noir)

Quand $\alpha \geq \beta$, la branche courante est élagée : elle ne peut pas produire un résultat meilleur que ce qui est déjà connu.

Dans le cas optimal (si les coups sont ordonnés par ordre de qualité décroissante), alpha-bêta ramène l’ordre de grandeur vers $O(b^{d/2})$. Il ne s’agit pas d’une égalité donnant le nombre exact de nœuds d’une position réelle.

![Arbre minimax à trois niveaux avec élagage alpha-bêta : les branches grisées sont abandonnées car alpha vaut déjà 3, rendant inutile l'exploration de toute branche où MIN peut forcer moins de 3.](/images/minimax-01-alpha-beta.svg)

### Negamax : la simplification qui change le code

Negamax exploite l’identité $\min(a,b)=-\max(-a,-b)$ en évaluant la position du point de vue du joueur au trait. Le signe change lors d’un changement de camp. C’est une reformulation possible de minimax, pas une description de tous les moteurs ni une garantie de code plus court d’un nombre précis de lignes.

### Null-move pruning : faire passer son tour pour gagner du temps

Une heuristique puissante : et si tu **passes ton tour** ? Si la position reste bonne pour toi malgré ce coup gratuit donné à l'adversaire, alors elle est probablement *très* bonne pour toi, et tu peux élaguer profondément le reste de l'analyse. C'est le **null-move pruning**, technique standard depuis les années 1990. Aux échecs, l'astuce a une limite connue (le *zugzwang* : situation où tout coup empire la position, typique des finales de pions), donc les implémentations ajoutent des conditions et des vérifications pour limiter ce risque. Un gain de vitesse universel de deux à quatre n’est pas établi ici.

![Null-move pruning : si la position reste positive après un coup nul (passer son tour), le moteur élague profondément l'arbre — avec la limite du zugzwang en finale où cette heuristique est désactivée.](/images/minimax-03-null-move.svg)

## Les techniques avancées des moteurs modernes

Les moteurs d'échecs modernes comme Stockfish ajoutent de nombreuses techniques au-dessus d'alpha-bêta de base :

**Tables de transposition** : un cache de positions déjà analysées. Si la même position est atteinte par des ordres de coups différents (transposition), le moteur réutilise l'analyse précédente au lieu de la recalculer. Les tables de transposition peuvent économiser des ordres de grandeur en temps de calcul.

![Deux chemins peuvent rejoindre une même position](/images/minimax-04-transposition.svg)

**Approfondissement itératif** : au lieu d'effectuer directement une recherche à profondeur $d$, le moteur enchaîne des recherches successives à profondeur 1, 2, 3, ..., $d$. Chaque itération fournit un meilleur ordonnancement des coups pour l'itération suivante, améliorant l'efficacité de l'élagage.

**Recherche de quiescence** : à la profondeur maximale, au lieu d'évaluer statiquement, la recherche se prolonge sur certains coups tactiques selon l’implémentation ; une position où le roi est en échec demande notamment des réponses légales, pas seulement des captures. Cela évite d'évaluer des positions où un échange de pièces non résolu fausserait l'évaluation.

**Extensions de recherche** : dans certaines positions (mat en vue, pion passé avancé, position critique), la profondeur de recherche est automatiquement étendue au-delà de la limite nominale pour éviter l'effet d'horizon.

**Réductions de recherche (LMR)** : inversement, pour les coups peu prometteurs (late move reduction), la profondeur est réduite pour économiser du temps. Si ces coups s'avèrent meilleurs que prévu, la profondeur est restaurée.

## Une recherche qui évolue

Le code publié de Stockfish combine recherche, tables de transposition, approfondissement itératif et plusieurs mécanismes sélectifs. Ils ne doivent pas être confondus avec l’alpha-bêta exact sur un arbre fixé.

L’annonce NNUE de 2020 illustre une autre évolution : changer l’évaluation sans abandonner la famille de recherche alpha-bêta. Le moteur moderne ne se réduit donc pas à une formule matérielle suivie d’une exploration aveugle.

## AlphaZero et le dépassement de minimax

En 2017, [DeepMind](https://fr.wikipedia.org/wiki/Google_DeepMind) a publié les résultats d'[AlphaZero](https://fr.wikipedia.org/wiki/AlphaZero), un programme qui a appris à jouer aux échecs par auto-jeu en quelques heures et battu Stockfish de façon convaincante.

AlphaZero n'utilise pas minimax classique mais une [Monte Carlo Tree Search](https://fr.wikipedia.org/wiki/Recherche_arborescente_Monte-Carlo) (MCTS) guidée par un réseau de neurones profond. Au lieu d'explorer exhaustivement l'arbre avec élagage, MCTS explore stochastiquement les branches les plus prometteuses selon une politique apprise.

Ce qui a frappé la communauté des échecs n'est pas seulement la performance d'AlphaZero, mais son style de jeu. AlphaZero joue de façon audacieuse et créative, avec des sacrifices de matériel à long terme et une préférence pour l'activité des pièces sur les avantages matériels immédiats. Ce style ressemble plus à un joueur humain intuitif qu'à un moteur de force brute.

AlphaZero associe apprentissage par renforcement et recherche MCTS, une autre architecture que la recherche alpha-bêta classique. Son score dans un match ne mesure pas une « compréhension plus profonde » ni une distance à la stratégie optimale. Les protocoles sont présentés dans [AlphaZero et Stockfish](/fr/blog/echecs-alphazero-stockfish/), les coûts de recherche dans [les limites du calcul](/fr/blog/pourquoi-echecs-probleme-mathematique-impossible-et-ia/) et les limites de l’analogie du chaos dans [la théorie du chaos aux échecs](/fr/blog/theorie-du-chaos-aux-echecs/).

## Minimax comme outil pour ton calcul

Quand tu penses « si je joue là, quelle est sa meilleure réponse ? », tu peux utiliser minimax comme grille de lecture. Cela ne démontre pas que ton cerveau exécute cette procédure et ne permet pas d’attribuer 3–8 ou 7–10 niveaux à une catégorie de joueurs.

Sur une position d’entraînement, choisis deux coups candidats et examine une réponse adverse à chacun. Puis cherche une défense que tu n’avais pas envisagée. L’objectif est d’améliorer la vérification, pas de reproduire une mesure de profondeur humaine.

![Même problème, deux démarches : un algorithme défini sur un arbre et un raisonnement humain dont les limites varient.](/images/minimax-02-profondeur-humain-moteur.svg)

## Sources

- Russell, S., & Norvig, P. (s. d., chapitre en ligne). *Adversarial Search*. Artificial Intelligence: A Modern Approach. [Chapitre](https://aima.cs.berkeley.edu/4th-ed/pdfs/newchap06.pdf).
- Équipe Stockfish (s. d.). *search.cpp*. Dépôt officiel Stockfish. [Code](https://github.com/official-stockfish/Stockfish/blob/master/src/search.cpp).
- Équipe Stockfish (2020). *Introducing NNUE Evaluation*. [Annonce](https://stockfishchess.org/blog/2020/introducing-nnue-evaluation/).
- Silver, D., et al. (2017). *Mastering Chess and Shogi by Self-Play with a General Reinforcement Learning Algorithm*. arXiv. [Article](https://arxiv.org/html/1712.01815v1).
