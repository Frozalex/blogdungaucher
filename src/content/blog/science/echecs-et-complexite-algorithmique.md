---
title: "La complexité algorithmique des échecs : pourquoi l'IA a mis 50 ans à battre l'homme"
excerpt: >-
  Le nombre de parties d'échecs possibles dépasse le nombre d'atomes dans l'univers observable. Comprendre la complexité
  algorithmique des échecs, c'est comprendre pourquoi Deep Blue en 1997 fut un exploit, et pourquoi AlphaZero en 2017
  fut une révolution d'une nature complètement différente.
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
    Le nombre de positions légales d'échecs vaut environ 4,8×10^44 (estimation de John Tromp). Le "nombre de Shannon",
    lui, désigne autre chose : les ~10^120 parties possibles. L'univers observable contient environ 10^80 atomes.
    Une exploration exhaustive est hors de portée des moyens de calcul actuels.
  - >-
    Deep Blue battait Kasparov en 1997 par force brute augmentée : évaluation de 200 millions de positions par seconde +
    heuristiques d'élagage (alpha-beta pruning). Un programme basé sur des règles humaines explicites, poussé à
    l'extrême.
  - >-
    AlphaZero (2017) n'a reçu que les règles du jeu et a appris par autojeu, sans base de parties humaines. Le préprint de Silver et collègues
    (2017) rapporte un dépassement de Stockfish après quatre heures dans son protocole d’évaluation. Ce résultat
    dépend du matériel et des conditions du match.
  - >-
    La complexité des échecs est EXPTIME-complète dans la version généralisée (échiquier n×n) : un problème dont la difficulté exclut un algorithme polynomial général, ce qui signifie qu'aucun algorithme polynomial ne peut résoudre les échecs de façon générale.
  - >-
    La compréhension humaine des échecs n'est pas une version dégradée de la recherche arborescente : c'est un type de
    cognition radicalement différent, basé sur la reconnaissance de patterns et l'intuition, que les IA basées sur le
    deep learning commencent seulement à approximer.
seoTitle: "Complexité algorithmique des échecs : pourquoi l'IA a mis 50 ans"
seoDescription: >-
  Nombre de Shannon, alpha-beta pruning, Deep Blue, AlphaZero : la complexité algorithmique des échecs expliquée, et
  pourquoi battre l'humain fut si difficile.
ogImage: /images/og/echecs-et-complexite-algorithmique-og.webp
heroImage:
  src: /images/blog/echecs-et-complexite-algorithmique-hero.webp
  alt: Une main minuscule tenant un dé à coudre au pied d'une immense dune de sable.
faq:
  - question: Qu'est-ce que le 'nombre de Shannon' ?
    answer: >-
      C'est la borne basse que Claude Shannon a donnée en 1950 au nombre de parties d'échecs possibles : environ
      10^120. Attention à ne pas le confondre avec le nombre de <em>positions</em> légales, bien plus petit, que
      Shannon estimait dans le même article autour de 10^43 et que le estimation de John Tromp place depuis
      autour de 4,8×10^44. Pour donner une échelle : l'univers observable contient environ 10^80 atomes, soit un nombre
      négligeable devant 10^120. Le nombre de Shannon illustre pourquoi une recherche exhaustive de l'arbre de jeu
      est hors de portée des ordinateurs actuels. Ce constat pratique ne prouve pas une impossibilité mathématique de résoudre le jeu.
  - question: Comment Deep Blue battait-il Kasparov s'il ne pouvait pas tout calculer ?
    answer: >-
      Par deux techniques combinées. L'alpha-beta pruning (élagage alpha-bêta) élague intelligemment l'arbre de
      recherche : si une branche ne peut pas mener à un résultat meilleur que ce qu'on a déjà trouvé, elle est
      abandonnée. Cela réduit exponentiellement l'espace de recherche. Combiné à une fonction d'évaluation de position
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
      Non. Un jeu est 'résolu' quand on peut calculer la décision optimale depuis n'importe quelle position. Les dames
      (checkers) ont été résolus en 2007 par Jonathan Schaeffer : c'est un match nul parfait. Les échecs ne sont pas
      résolus et ne le seront probablement jamais avec la technologie prévisible : l'espace de jeu est trop grand. On
      peut jouer aux échecs mieux que n'importe quel humain, mais pas de façon prouvablement parfaite.
  - question: Pourquoi les joueurs humains arrivent-ils encore à jouer aux échecs malgré cette complexité ?
    answer: >-
      Tu n’as pas besoin de résoudre le jeu pour choisir un coup. Tu peux comparer quelques variantes,
      reconnaître une structure familière et évaluer les conséquences de tes choix. Cela permet de jouer,
      sans garantir une décision optimale.

---

En 1950, Claude Shannon (le fondateur de la théorie de l'information) publiait un article intitulé "Programming a Computer for Playing Chess". Il n'avait pas encore écrit les programmes. Il calculait si c'était seulement *possible*.

Sa conclusion : le nombre de positions légales d'échecs tourne autour de 10^43, et le nombre de parties distinctes possibles est bien plus grand encore, au moins 10^120. C'est ce second nombre qu'on appelle aujourd'hui le nombre de Shannon. Une recherche exhaustive de l'arbre de jeu complet dépasserait les capacités de n'importe quel ordinateur physiquement réalisable : pas par manque de vitesse, mais parce que le temps nécessaire dépasserait l'âge de l'univers.

Son estimation des positions était une approximation grossière, qui incluait des configurations illégales. Elle a depuis été resserrée : le travail de estimation de John Tromp place le nombre de positions légales autour de 4,8×10^44.

Il fallait donc trouver autre chose.

## Qu'est-ce que la complexité algorithmique ?

La complexité algorithmique est une branche de l'informatique théorique qui étudie les ressources (temps, mémoire) nécessaires pour résoudre des problèmes. Elle classe les problèmes selon leur "difficulté fondamentale" : non pas en pratique sur un ordinateur donné, mais en théorie, asymptotiquement, à mesure que la taille du problème croît.

Les classes les plus connues :
- **P** : problèmes solubles en temps polynomial (rapides)
- **NP** : problèmes dont les solutions peuvent être *vérifiées* en temps polynomial (potentiellement lents à résoudre, rapides à vérifier)
- **PSPACE** : problèmes solubles avec de la mémoire polynomiale (même si le temps est exponentiel)
- **EXPTIME** : problèmes décidables en temps au plus exponentiel, pour un polynôme de la taille de l’entrée
- **EXPSPACE** : problèmes nécessitant une mémoire exponentielle, la plus redoutable des cinq (elle contient EXPTIME)

Les échecs généralisés (sur un échiquier n×n au lieu de 8×8) constituent un problème **EXPTIME-complet** selon les résultats de Fraenkel et Lichtenstein (1981). Cela signifie que la résolution exacte des échecs sur un échiquier arbitraire est, au sens formel, aussi difficile que les problèmes les plus durs de sa classe, et qu'aucun algorithme polynomial ne peut espérer les résoudre.

Pour les échecs sur échiquier 8×8 standard, la question est légèrement différente : la partie se termine toujours (règle des 50 coups, répétition), donc le problème est fini. Mais l'espace de recherche reste astronomique.

## L'arbre de jeu et la malédiction de l'explosion combinatoire

Imagine l'arbre de jeu d'une partie d'échecs. À la racine, la position de départ. Après le premier coup des Blancs (20 possibles), 20 nœuds. Après le premier coup des Noirs (20 possibles), 400 nœuds. Après deux coups de chaque côté, 197 281 suites légales de quatre demi-coups aboutissent aux feuilles de l’arbre. Il faut distinguer les suites de coups des positions distinctes : plusieurs suites peuvent mener à la même position. Le test de génération de coups de Stockfish vérifie, par exemple, 3 195 901 860 suites à sept demi-coups.

Le facteur de branchement moyen d'une partie d'échecs est d'environ 35 (le nombre de coups légaux dans une position typique). Si tu prends une partie hypothétique de 40 coups par joueur, ce modèle uniforme donne 35^80 ≈ 10^123,5 suites de 80 demi-coups. C’est un calcul illustratif, pas un dénombrement de l’arbre complet.

Ce modèle illustre l’explosion du **nombre de suites de coups**. Il dépasse de loin le nombre d'atomes dans l'univers observable (10^80). Même si chaque atome de l'univers était un ordinateur analysant un milliard de positions par seconde depuis le Big Bang, on n'aurait exploré qu'une fraction infinitésimale de cet espace.

Cette explosion combinatoire explique pourquoi les premiers programmes d'échecs, dans les années 1950-1970, étaient si faibles malgré des ordinateurs de plus en plus puissants. La force brute seule ne pouvait pas fonctionner. Il fallait des heuristiques : des raccourcis intelligents qui sacrifient la garantie d'optimalité pour la praticabilité.

## L'élagage alpha-bêta : le premier grand saut

L'algorithme **alpha-bêta pruning**, développé dans les années 1950-1960 par plusieurs chercheurs (dont John McCarthy et Donald Knuth), est l'heuristique fondamentale des moteurs d'échecs classiques.

L'idée : si on recherche l'arbre de jeu et qu'on trouve une branche qui ne peut pas être meilleure que ce qu'on a déjà trouvé, on arrête de l'explorer. Plus précisément : on maintient deux valeurs, alpha (le meilleur score que les Blancs peuvent garantir) et bêta (le meilleur score que les Noirs peuvent garantir). Dès qu'une branche produit un score en dehors de cette fenêtre [alpha, bêta], elle est abandonnée.

Dans le meilleur cas, l'élagage alpha-bêta réduit le nombre de nœuds à explorer de la racine carrée de l'arbre complet. À partir d'un espace de 10^123, on peut espérer chercher 10^61, toujours astronomique, mais beaucoup plus gérable avec de bonnes heuristiques d'ordonnancement des coups (chercher d'abord les coups probablement bons rend l'élagage plus efficace).

Combiné à une **fonction d'évaluation**, c'est-à-dire une formule qui estime la valeur d'une position sans aller jusqu'aux feuilles de l'arbre, l'alpha-bêta permet de chercher à une profondeur fixe puis d'évaluer les positions résultantes. C'est exactement ce que faisait Deep Blue en 1997.

## Deep Blue : la victoire de l'ingénierie

Deep Blue n'était pas un programme subtil. C'était un chef-d'œuvre d'ingénierie brute appliqué aux heuristiques d'échecs.

IBM avait construit des **puces spécialisées** (ASICs) conçues uniquement pour évaluer des positions d'échecs : des centaines en parallèle. Deep Blue évaluait entre 100 et 200 millions de positions par seconde selon le type de position. Avec un élagage alpha-bêta bien optimisé et des heuristiques d'ordonnancement sophistiquées, il approfondissait sélectivement les variantes prometteuses.

La fonction d'évaluation avait été développée avec l'aide de Grands Maîtres : elle codifiait explicitement des concepts comme la structure de pions, la sécurité du roi, l'activité des pièces, les cases faibles. Chaque concept était traduit en termes numériques, avec des poids ajustés par les ingénieurs.

Kasparov avait battu Deep Blue en 1996 (4-2). Il avait perdu en 1997 (3.5-2.5). Sa défaite n'était pas due à la "compréhension" du jeu par Deep Blue : il n'y en avait aucune au sens cognitif. C'était de la puissance de calcul + des heuristiques humaines codifiées + de l'ingénierie matérielle, poussés jusqu'à un seuil où la force de calcul brut compensait les limitations de l'approche.

## AlphaZero : une révolution d'une nature différente

Vingt ans plus tard, DeepMind présentait AlphaZero. La différence n'était pas quantitative : c'était qualitative.

AlphaZero n'avait reçu que les **règles du jeu** : quelles pièces existent, comment elles bougent, quand une partie se termine. Aucune base de données de parties humaines. Aucune heuristique explicitée. Aucun concept codifié par des Grands Maîtres.

Il jouait contre lui-même : des millions de parties. À chaque partie, un réseau de neurones profond apprenait : quelles positions tendent à être gagnantes, quels coups tendent à être bons depuis quelles positions. Après **quatre heures** d'entraînement sur des TPUs (processeurs spécialisés de Google), AlphaZero avait atteint un niveau qui dépassait Stockfish, le meilleur moteur "classique" de l'époque.

Le style de jeu qu'AlphaZero avait développé fascinait les Grands Maîtres : dynamique, volontiers sacrificiel, avec des intuitions positionnelles que les théoriciens n'avaient jamais codifiées explicitement. AlphaZero cherchait nettement moins de positions que Stockfish (environ 80 000 par seconde contre 70 millions), mais chacune était évaluée par un réseau de neurones qui encodait une "intuition" apprise par l'expérience plutôt que par des règles explicites.

Ce n'était plus de la recherche exhaustive améliorée. C'était quelque chose de structurellement différent : une approximation de l'intuition par apprentissage profond.

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

