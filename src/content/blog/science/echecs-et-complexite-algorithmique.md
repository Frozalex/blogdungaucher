---
title: "La complexité algorithmique des échecs : pourquoi l'IA a mis 50 ans à battre l'homme"
excerpt: >-
  L’arbre des variantes devient immense bien avant qu’un moteur puisse tout explorer. De Shannon à Deep Blue
  et AlphaZero, distingue les estimations de taille, la recherche sélective et les limites réellement démontrées.
publishDate: "2026-08-24"
category: science
featured: false
featuredRank: 99
readingTime: 8 min
pillar: Science des échecs
tags:
  - algorithmique
  - complexité
  - intelligence artificielle
  - Deep Blue
  - AlphaZero
  - arbre de jeu
  - combinatoire
  - informatique théorique
keyTakeaways:
  - >-
    Tromp estime environ 4,8×10^44 positions légales. Le repère historique de Shannon, de l’ordre de 10^120,
    concerne des suites de coups sous ses hypothèses ; ce n’est pas un dénombrement exact des parties.
  - >-
    Deep Blue battait Kasparov en 1997 par force brute augmentée : évaluation de 200 millions de positions par seconde +
    heuristiques d'élagage (alpha-beta pruning). Un programme basé sur des règles humaines explicites, poussé à
    l'extrême.
  - >-
    AlphaZero (2017) apprend par autojeu, sans base de parties humaines ni évaluation rédigée à la main. Le préprint de Silver et collègues
    (2017) rapporte un dépassement de Stockfish après quatre heures dans son protocole d’évaluation. Ce résultat
    dépend du matériel et des conditions du match.
  - >-
    Une variante généralisée sur échiquier n×n est EXPTIME-complète. Le résultat porte sur une famille
    d’instances de taille variable ; il ne prouve pas que la position initiale sur 8×8 soit impossible à résoudre.
  - >-
    Alpha-bêta préserve le résultat du même minimax à la même profondeur ; l’approximation vient notamment
    de l’évaluation des feuilles et des autres choix de recherche. Un meilleur score de match ne prouve pas le jeu parfait.
seoTitle: "Complexité des échecs : Shannon, alpha-bêta et AlphaZero"
seoDescription: "Ordres de grandeur de Shannon, recherche alpha-bêta, Deep Blue et AlphaZero : distinguer complexité généralisée, jeu 8×8 et performance des moteurs."
ogImage: /images/og/echecs-et-complexite-algorithmique-og.webp
heroImage:
  src: /images/blog/echecs-et-complexite-algorithmique-hero.webp
  alt: Une main minuscule tenant un dé à coudre au pied d'une immense dune de sable.
faq:
  - question: Qu'est-ce que le 'nombre de Shannon' ?
    answer: >-
      C’est un ordre de grandeur historique de l’arbre des parties, autour de 10^120, obtenu par Shannon
      avec des hypothèses simplificatrices. Il ne faut le confondre ni avec un compte exact des parties
      légales, ni avec l’estimation d’environ 4,8×10^44 positions légales de Tromp. Plusieurs suites de coups
      peuvent mener à une même position ; leur abondance ne démontre pas une impossibilité de résoudre le jeu.
  - question: Comment Deep Blue battait-il Kasparov s'il ne pouvait pas tout calculer ?
    answer: >-
      Par deux techniques combinées. L'alpha-beta pruning (élagage alpha-bêta) élague intelligemment l'arbre de
      recherche : si une branche ne peut pas mener à un résultat meilleur que ce qu'on a déjà trouvé, elle est
      abandonnée sans modifier le score du même minimax. Le gain dépend de l’ordre des coups. Combiné à une fonction d’évaluation de position
      très élaborée (développée avec des Grands Maîtres), Deep Blue évaluait environ 200 millions de positions par
      seconde et utilisait une recherche sélective approfondie dans
      certaines lignes forcées. C'est impressionnant, mais ce n'est pas une
      résolution complète, c'est une heuristique très puissante.
  - question: À quelle vitesse AlphaZero a-t-il dépassé Stockfish ?
    answer: >-
      Dans le protocole de Silver et collègues (2017), la courbe d’évaluation dépasse Stockfish après quatre heures.
      L’entraînement utilise de nombreux TPUs et des parties d’autojeu. Ce délai ne se transpose pas à un ordinateur
      personnel et ne mesure pas une compréhension humaine du jeu.
  - question: Les échecs sont-ils 'résolus' mathématiquement ?
    answer: >-
      La valeur de la position initiale sous jeu parfait reste inconnue. Il faut distinguer une résolution
      depuis cette position d’une résolution forte, qui traite toutes les positions du jeu. Une performance
      supérieure à celle d’un champion ne constitue pas une preuve de stratégie optimale.
  - question: Pourquoi les joueurs humains arrivent-ils encore à jouer aux échecs malgré cette complexité ?
    answer: >-
      Tu n’as pas besoin de résoudre le jeu pour choisir un coup. Tu peux comparer quelques variantes,
      reconnaître une structure familière et évaluer les conséquences de tes choix. Cela permet de jouer,
      sans garantir une décision optimale.

---

En 1950, Claude Shannon (le fondateur de la théorie de l'information) publiait un article intitulé "Programming a Computer for Playing Chess". Il y examine comment faire choisir un coup à une machine malgré la taille de l’arbre des variantes.

Shannon distingue les configurations du plateau des suites de coups. Son ordre de grandeur historique de 10^120 pour l’arbre des parties repose sur des hypothèses de branchement et de durée ; ce n’est pas un dénombrement exact de toutes les parties légales. Il sert à montrer pourquoi explorer naïvement toutes les continuations n’est pas une méthode pratique.

Le problème du nombre de positions est distinct : en 2021, John Tromp présente une estimation d’environ 4,8×10^44 positions légales. Une même position peut être atteinte par plusieurs suites. Comparer ces deux nombres exige donc de nommer ce qu’on compte.

Il fallait donc trouver autre chose.

## Qu'est-ce que la complexité algorithmique ?

La complexité algorithmique est une branche de l'informatique théorique qui étudie les ressources (temps, mémoire) nécessaires pour résoudre des problèmes. Elle classe les problèmes selon leur "difficulté fondamentale" : non pas en pratique sur un ordinateur donné, mais en théorie, asymptotiquement, à mesure que la taille du problème croît.

Les classes les plus connues :
- **P** : problèmes décidables en temps polynomial en fonction de la taille de l’entrée ; cela ne garantit pas une exécution rapide pour toute instance
- **NP** : problèmes dont les solutions peuvent être *vérifiées* en temps polynomial (potentiellement lents à résoudre, rapides à vérifier)
- **PSPACE** : problèmes solubles avec de la mémoire polynomiale (même si le temps est exponentiel)
- **EXPTIME** : problèmes décidables en temps au plus exponentiel, pour un polynôme de la taille de l’entrée
- **EXPSPACE** : problèmes décidables avec une mémoire au plus exponentielle en un polynôme de la taille de l’entrée ; cette classe contient EXPTIME

Les échecs généralisés (sur un échiquier n×n au lieu de 8×8) constituent un problème **EXPTIME-complet** selon les résultats de Fraenkel et Lichtenstein (1981). Cela signifie que la résolution exacte des échecs sur un échiquier arbitraire est, au sens formel, aussi difficile que les problèmes les plus durs de sa classe, et qu'aucun algorithme polynomial ne peut espérer les résoudre.

Ce résultat asymptotique ne donne pas un nombre minimal d’années de calcul pour le seul échiquier 8×8. Les auteurs soulignent eux-mêmes cette limite. Les échecs modernes forment un jeu fini lorsqu’on inclut les règles d’arrêt automatiques ; cela rend une résolution théoriquement définie, sans la rendre praticable aujourd’hui.

## L'arbre de jeu et la malédiction de l'explosion combinatoire

Imagine l'arbre de jeu d'une partie d'échecs. À la racine, la position de départ. Après le premier coup des Blancs (20 possibles), 20 nœuds. Après le premier coup des Noirs (20 possibles), 400 nœuds. Après deux coups de chaque côté, 197 281 suites légales de quatre demi-coups aboutissent aux feuilles de l’arbre. Il faut distinguer les suites de coups des positions distinctes : plusieurs suites peuvent mener à la même position. Le test de génération de coups de Stockfish vérifie, par exemple, 3 195 901 860 suites à sept demi-coups.

Prenons, pour illustration, un branchement uniforme de 35 et une profondeur de 80 demi-coups, soit 40 coups par joueur. Le modèle donne 35^80 ≈ 10^123,5 suites à cette profondeur. C’est un calcul illustratif, pas un dénombrement de l’arbre complet.

Ce modèle illustre l’explosion du **nombre de suites de coups** : multiplier la profondeur ajoute un facteur exponentiel. Ce n’est ni le nombre de positions distinctes ni la preuve qu’aucune méthode ne pourrait déterminer la valeur du jeu sans parcourir chaque suite.

Cette explosion combinatoire explique pourquoi les premiers programmes d'échecs, dans les années 1950-1970, étaient si faibles malgré des ordinateurs de plus en plus puissants. La force brute seule ne pouvait pas fonctionner. Il fallait des heuristiques : des raccourcis intelligents qui sacrifient la garantie d'optimalité pour la praticabilité.

## L'élagage alpha-bêta : le premier grand saut

L’**élagage alpha-bêta** permet d’éviter des calculs inutiles dans minimax. À profondeur, fonction d’évaluation et arbre identiques, il conserve le résultat de minimax : la coupure elle-même n’est pas une approximation.

On garde une même perspective pour tous les scores : MAX les maximise et MIN les minimise. Alpha est une borne inférieure disponible pour MAX ; bêta une borne supérieure disponible pour MIN. Quand bêta ≤ alpha, une branche ne peut plus changer un choix déjà accessible à un ancêtre : on peut la couper. MAX ne désigne donc pas automatiquement les Blancs dans toutes les implémentations.

Sur un arbre uniforme de branchement b et de profondeur d, l’ordre idéal des coups permet un coût de l’ordre de O(b^(d/2)), contre O(b^d) pour minimax. Dans le pire ordre, le gain peut disparaître. Ce résultat asymptotique ne transforme pas directement le nombre de Shannon en une taille précise d’arbre à calculer.

Combiné à une **fonction d'évaluation**, c'est-à-dire une formule qui estime la valeur d'une position sans aller jusqu'aux feuilles de l'arbre, l'alpha-bêta permet de chercher à une profondeur fixe puis d'évaluer les positions résultantes. C'est exactement ce que faisait Deep Blue en 1997.

## Deep Blue : la victoire de l'ingénierie

Deep Blue n'était pas un programme subtil. C'était un chef-d'œuvre d'ingénierie brute appliqué aux heuristiques d'échecs.

IBM avait construit des **puces spécialisées** (ASICs) conçues uniquement pour évaluer des positions d'échecs : des centaines en parallèle. IBM rapporte une capacité d’évaluation de 200 millions de positions par seconde. Avec un élagage alpha-bêta bien optimisé et des heuristiques d'ordonnancement sophistiquées, il approfondissait sélectivement les variantes prometteuses.

La fonction d'évaluation avait été développée avec l'aide de Grands Maîtres : elle codifiait explicitement des concepts comme la structure de pions, la sécurité du roi, l'activité des pièces, les cases faibles. Chaque concept était traduit en termes numériques, avec des poids ajustés par les ingénieurs.

Kasparov avait battu Deep Blue en 1996 (4-2). Il avait perdu en 1997 (3.5-2.5). Ce résultat démontre une performance dans un match, pas une résolution mathématique du jeu. La combinaison de matériel spécialisé, de recherche et d’évaluation suffit à expliquer la démarche technique sans décider si une machine « comprend » comme un humain.

## AlphaZero : une révolution d'une nature différente

Vingt ans plus tard, DeepMind présentait AlphaZero. La différence n'était pas quantitative : c'était qualitative.

AlphaZero apprend sa politique de coups et son évaluation par autojeu, sans base de parties humaines ni fonction d’évaluation échiquéenne rédigée à la main. Cela ne signifie pas une absence de choix d’ingénierie : représentation des positions, architecture et procédure de recherche sont définies par les auteurs.

Il jouait contre lui-même : des millions de parties. À chaque partie, un réseau de neurones profond apprenait : quelles positions tendent à être gagnantes, quels coups tendent à être bons depuis quelles positions. Le préprint de Silver et collègues (2017) rapporte un dépassement de Stockfish après **quatre heures** dans sa courbe d’évaluation. L’entraînement mobilise de nombreux TPUs ; ce délai et ce résultat dépendent du matériel et du protocole.

Le style de jeu qu'AlphaZero avait développé fascinait les Grands Maîtres : dynamique, volontiers sacrificiel, avec des intuitions positionnelles que les théoriciens n'avaient jamais codifiées explicitement. Dans la comparaison du préprint de 2017, AlphaZero explore environ 80 000 positions par seconde contre 70 millions pour Stockfish. Ces mesures concernent des systèmes et du matériel différents ; un nœud exploré n’a pas le même coût ni le même rôle dans les deux recherches.

Le réseau guide une recherche MCTS : AlphaZero explore donc toujours un arbre, avec une autre sélection des variantes et une évaluation apprise. Le mot « intuition » est ici une analogie, pas la preuve d’un mécanisme cognitif humain reproduit.

## Ce que cette histoire change dans ta façon de regarder un moteur

Deep Blue et AlphaZero montrent deux façons de sélectionner les variantes et d’évaluer les positions. Leur succès ne signifie pas qu’ils ont résolu les échecs. Il ne prouve pas davantage qu’un réseau de neurones reproduit le fonctionnement du cerveau d’un grand maître.

Pour toi, la distinction est utile : une analyse moteur propose des coups dans un budget de calcul donné. Elle ne fournit pas une preuve de la valeur exacte de la position initiale. L’explosion combinatoire explique la nécessité de sélectionner ; elle ne dit pas que toute méthode future de résolution est impossible.

## Sources

- Shannon, C. E. (1950). *Programming a Computer for Playing Chess*. Philosophical Magazine, 41, 256–275. [Article original, Computer History Museum](https://www.computerhistory.org/chess/doc-431614f453dde/) : estimation de l’arbre et recherche sélective.
- Tromp, J. (2021). *Number of legal chess positions*. [Page de l’auteur](https://tromp.github.io/chess/chess.html) : estimation d’environ 4,8 × 10^44 positions légales.
- Fraenkel, A. S., & Lichtenstein, D. (1981). *Computing a perfect strategy for n×n chess requires time exponential in n*. Journal of Combinatorial Theory, Series A. [Texte intégral des auteurs](https://kubokovac.eu/zlozitost/mat/chessExptime.pdf) : variante généralisée EXPTIME-complète.
- IBM (sans date). *Deep Blue*. [Histoire du projet](https://www.ibm.com/history/deep-blue) : matériel, vitesse d’évaluation et matchs contre Kasparov.
- Silver, D., et al. (2017). *Mastering Chess and Shogi by Self-Play with a General Reinforcement Learning Algorithm*. arXiv. [Préprint intégral](https://arxiv.org/html/1712.01815v1) : autojeu, comparaison avec Stockfish et conditions expérimentales.
- Équipe Stockfish (sans date). *tests/perft.sh*. GitHub. [Tests du générateur de coups](https://github.com/official-stockfish/Stockfish/blob/master/tests/perft.sh).

## Pour aller plus loin

- [Sujet Grand Oral NSI : Pourquoi AlphaZero représente-t-il une rupture dans l'intelligence artificielle ?](/fr/blog/sujet-grand-oral-nsi-alphazero/)
- [Pourquoi les échecs sont un problème mathématique (presque) impossible et comment l'IA s'en sort quand même](/fr/blog/pourquoi-echecs-probleme-mathematique-impossible-et-ia/)
- [Sujet Grand Oral Maths : En quoi le jeu d'échecs constitue-t-il un modèle de la pensée combinatoire ?](/fr/blog/sujet-grand-oral-maths-combinatoire/)

