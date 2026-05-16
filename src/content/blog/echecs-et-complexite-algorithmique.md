---
title: "La complexité algorithmique des échecs : pourquoi l'IA a mis 50 ans à battre l'homme"
excerpt: "Le nombre de parties d'échecs possibles dépasse le nombre d'atomes dans l'univers observable. Comprendre la complexité algorithmique des échecs, c'est comprendre pourquoi Deep Blue en 1997 fut un exploit, et pourquoi AlphaZero en 2017 fut une révolution d'une nature complètement différente."
publishDate: "2026-09-14"
category: "science"
featured: false
featuredRank: 99
readingTime: "19 min"
pillar: "Science des échecs"
tags: ["algorithmique", "complexité", "intelligence artificielle", "Deep Blue", "AlphaZero", "arbre de jeu", "combinatoire", "informatique théorique"]
keyTakeaways:
  - "Le nombre de positions légales d'échecs est estimé entre 10^44 et 10^47 — le 'nombre de Shannon'. L'univers observable contient environ 10^80 atomes. L'espace de recherche exhaustif est impossible par définition."
  - "Deep Blue battait Kasparov en 1997 par force brute augmentée : évaluation de 200 millions de positions par seconde + heuristiques d'élagage (alpha-beta pruning). Un programme basé sur des règles humaines explicites, poussé à l'extrême."
  - "AlphaZero (2017) n'a reçu que les règles du jeu et a joué contre lui-même 44 millions de parties en 9 heures. Il a développé des concepts de jeu inconnus des théoriciens — sans jamais avoir vu une base de données de parties humaines."
  - "La complexité des échecs est EXPSPACE-complète dans la version généralisée (échiquier n×n) — une classe de complexité supérieure à NP, ce qui signifie qu'aucun algorithme polynomial ne peut résoudre les échecs de façon générale."
  - "La compréhension humaine des échecs n'est pas une version dégradée de la recherche arborescente — c'est un type de cognition radicalement différent, basé sur la reconnaissance de patterns et l'intuition, que les IA basées sur le deep learning commencent seulement à approximer."
seoTitle: "Complexité algorithmique des échecs : pourquoi l'IA a mis 50 ans"
seoDescription: "Nombre de Shannon, alpha-beta pruning, Deep Blue, AlphaZero : la complexité algorithmique des échecs expliquée, et pourquoi battre l'humain fut si difficile."
ogImage: "/images/blog/echecs-et-complexite-algorithmique-hero.png"
heroImage:
  src: "/images/blog/echecs-et-complexite-algorithmique-hero.png"
  alt: "Illustration pixel art : arbre de jeu d'échecs en données numériques, branches infinies, fond cosmique — « Complexité algorithmique des échecs »"
  credit: "Blog d'un Gaucher"
  license: "Création originale"
titleEn: "The Algorithmic Complexity of Chess: Why AI Took 50 Years to Beat Humans"
excerptEn: "The number of possible chess games exceeds the number of atoms in the observable universe. Understanding chess algorithmic complexity means understanding why Deep Blue in 1997 was an exploit, and why AlphaZero in 2017 was a revolution of a completely different nature."
seoTitleEn: "Chess Algorithmic Complexity: Why AI Took 50 Years"
seoDescriptionEn: "Shannon number, alpha-beta pruning, Deep Blue, AlphaZero: chess algorithmic complexity explained, and why beating humans was so difficult."
faq:
  - question: "Qu'est-ce que le 'nombre de Shannon' ?"
    answer: "C'est une estimation du nombre de positions légales d'échecs, proposée par Claude Shannon en 1950. Il l'estimait à environ 10^43. Des travaux ultérieurs ont affiné cette estimation entre 10^44 et 10^47. Pour donner une échelle : l'univers observable contient environ 10^80 atomes, et une seconde contient 10^43 femtosecondes. Le nombre de Shannon illustre pourquoi une recherche exhaustive de toutes les positions est physiquement impossible, même avec des ordinateurs infiniment rapides."
  - question: "Comment Deep Blue battait-il Kasparov s'il ne pouvait pas tout calculer ?"
    answer: "Par deux techniques combinées. L'alpha-beta pruning (élagage alpha-bêta) élague intelligemment l'arbre de recherche : si une branche ne peut pas mener à un résultat meilleur que ce qu'on a déjà trouvé, elle est abandonnée. Cela réduit exponentiellement l'espace de recherche. Combiné à une fonction d'évaluation de position très élaborée (développée avec des Grands Maîtres), Deep Blue évaluait environ 200 millions de positions par seconde et cherchait typiquement à 12-15 coups de profondeur. C'est impressionnant — mais ce n'est pas une résolution complète, c'est une heuristique très puissante."
  - question: "AlphaZero a-t-il vraiment appris les échecs en 9 heures ?"
    answer: "Oui, dans un sens précis : à partir de zéro connaissance humaine (seulement les règles), en jouant contre lui-même avec de l'apprentissage par renforcement et des réseaux de neurones profonds, AlphaZero a atteint un niveau dépassant Stockfish (le meilleur moteur 'classique') après 9 heures d'entraînement sur du matériel spécialisé (TPUs Google). Ce qui est remarquable n'est pas seulement la vitesse mais le style de jeu développé : dynamique, sacrificiel, avec des intuitions positionnelles que les théoriciens n'avaient pas codifiées."
  - question: "Les échecs sont-ils 'résolus' mathématiquement ?"
    answer: "Non. Un jeu est 'résolu' quand on peut calculer la décision optimale depuis n'importe quelle position. Les dames (checkers) ont été résolus en 2007 par Jonathan Schaeffer — c'est un match nul parfait. Les échecs ne sont pas résolus et ne le seront probablement jamais avec la technologie prévisible : l'espace de jeu est trop grand. On peut jouer aux échecs mieux que n'importe quel humain, mais pas de façon prouvablement parfaite."
  - question: "Pourquoi les joueurs humains arrivent-ils encore à jouer aux échecs malgré cette complexité ?"
    answer: "Parce que les humains ne cherchent pas dans l'espace de toutes les positions. Ils reconnaissent des patterns, élaguent intuitivement les coups mauvais, et raisonnent principalement à partir de concepts (pression, structure de pions, activité des pièces) plutôt que de calcul brut. Un Grand Maître calcule rarement plus de 3-5 coups en profondeur dans une position normale — il en élimine 95% par intuition avant même de commencer à calculer. C'est un type de traitement radicalement différent de la recherche arborescente, et il a ses propres forces (créativité, intuition positionnelle) et faiblesses (calcul moins précis sous pression)."
---

En 1950, Claude Shannon — le fondateur de la théorie de l'information — publiait un article intitulé "Programming a Computer for Playing Chess". Il n'avait pas encore écrit les programmes. Il calculait si c'était seulement *possible*.

Sa conclusion : le nombre de positions légales d'échecs est d'environ 10^43. Le nombre de parties distinctes possibles est encore plus grand. Une recherche exhaustive de l'arbre de jeu complet dépasserait les capacités de n'importe quel ordinateur physiquement réalisable — pas par manque de vitesse, mais parce que le temps nécessaire dépasserait l'âge de l'univers.

Il fallait donc trouver autre chose.

## Qu'est-ce que la complexité algorithmique ?

La complexité algorithmique est une branche de l'informatique théorique qui étudie les ressources (temps, mémoire) nécessaires pour résoudre des problèmes. Elle classe les problèmes selon leur "difficulté fondamentale" — non pas en pratique sur un ordinateur donné, mais en théorie, asymptotiquement, à mesure que la taille du problème croît.

Les classes les plus connues :
- **P** : problèmes solubles en temps polynomial (rapides)
- **NP** : problèmes dont les solutions peuvent être *vérifiées* en temps polynomial (potentiellement lents à résoudre, rapides à vérifier)
- **PSPACE** : problèmes solubles avec de la mémoire polynomiale (même si le temps est exponentiel)
- **EXPTIME** : problèmes qui nécessitent un temps exponentiel dans le pire cas
- **EXPSPACE** : la classe la plus redoutable, nécessitant à la fois temps et mémoire exponentiels

Les échecs généralisés (sur un échiquier n×n au lieu de 8×8) appartiennent à la classe **EXPTIME-complets** selon les résultats de Fraser et al. (1981). Cela signifie que la résolution exacte des échecs sur un échiquier arbitraire est, au sens formel, aussi difficile que les problèmes les plus durs de sa classe — et qu'aucun algorithme polynomial ne peut espérer les résoudre.

Pour les échecs sur échiquier 8×8 standard, la question est légèrement différente : la partie se termine toujours (règle des 50 coups, répétition), donc le problème est fini. Mais l'espace de recherche reste astronomique.

## L'arbre de jeu et la malédiction de l'explosion combinatoire

Imaginez l'arbre de jeu d'une partie d'échecs. À la racine, la position de départ. Après le premier coup des Blancs (20 possibles), 20 nœuds. Après le premier coup des Noirs (20 possibles), 400 nœuds. Après deux coups de chaque côté : environ 8 902 positions. Après cinq coups de chaque côté : environ 69 milliards.

Le facteur de branchement moyen d'une partie d'échecs est d'environ 35 (le nombre de coups légaux dans une position typique). La longueur moyenne d'une partie est d'environ 40 coups par joueur. L'arbre complet a donc approximativement 35^80 ≈ 10^123 nœuds.

C'est le **nombre de parties distinctes possibles**. Il dépasse de loin le nombre d'atomes dans l'univers observable (10^80). Même si chaque atome de l'univers était un ordinateur analysant un milliard de positions par seconde depuis le Big Bang, on n'aurait exploré qu'une fraction infinitésimale de cet espace.

Cette explosion combinatoire explique pourquoi les premiers programmes d'échecs, dans les années 1950-1970, étaient si faibles malgré des ordinateurs de plus en plus puissants. La force brute seule ne pouvait pas fonctionner. Il fallait des heuristiques — des raccourcis intelligents qui sacrifient la garantie d'optimalité pour la praticabilité.

## L'élagage alpha-bêta : le premier grand saut

L'algorithme **alpha-bêta pruning**, développé dans les années 1950-1960 par plusieurs chercheurs (dont John McCarthy et Donald Knuth), est l'heuristique fondamentale des moteurs d'échecs classiques.

L'idée : si on recherche l'arbre de jeu et qu'on trouve une branche qui ne peut pas être meilleure que ce qu'on a déjà trouvé, on arrête de l'explorer. Plus précisément : on maintient deux valeurs, alpha (le meilleur score que les Blancs peuvent garantir) et bêta (le meilleur score que les Noirs peuvent garantir). Dès qu'une branche produit un score en dehors de cette fenêtre [alpha, bêta], elle est abandonnée.

Dans le meilleur cas, l'élagage alpha-bêta réduit le nombre de nœuds à explorer de la racine carrée de l'arbre complet. À partir d'un espace de 10^123, on peut espérer chercher 10^61 — toujours astronomique, mais beaucoup plus gérable avec de bonnes heuristiques d'ordonnancement des coups (chercher d'abord les coups probablement bons rend l'élagage plus efficace).

Combiné à une **fonction d'évaluation** — une formule qui estime la valeur d'une position sans aller jusqu'aux feuilles de l'arbre — l'alpha-bêta permet de chercher à une profondeur fixe et d'évaluer les positions résultantes. C'est exactement ce que faisait Deep Blue en 1997.

## Deep Blue : la victoire de l'ingénierie

Deep Blue n'était pas un programme subtil. C'était un chef-d'œuvre d'ingénierie brute appliqué aux heuristiques d'échecs.

IBM avait construit des **puces spécialisées** (ASICs) conçues uniquement pour évaluer des positions d'échecs — des centaines en parallèle. Deep Blue évaluait entre 100 et 300 millions de positions par seconde. Avec un élagage alpha-bêta bien optimisé et des heuristiques d'ordonnancement sophistiquées, il cherchait typiquement à une profondeur de 12 à 16 coups, parfois plus dans les positions critiques ("recherche d'extension").

La fonction d'évaluation avait été développée avec l'aide de Grands Maîtres : elle codifiait explicitement des concepts comme la structure de pions, la sécurité du roi, l'activité des pièces, les cases faibles. Chaque concept était traduit en termes numériques, avec des poids ajustés par les ingénieurs.

Kasparov avait battu Deep Blue en 1996 (4-2). Il avait perdu en 1997 (3.5-2.5). Sa défaite n'était pas due à la "compréhension" du jeu par Deep Blue — il n'y en avait aucune au sens cognitif. C'était de la puissance de calcul + des heuristiques humaines codifiées + de l'ingénierie matérielle, poussés jusqu'à un seuil où la force de calcul brut compensait les limitations de l'approche.

## AlphaZero : une révolution d'une nature différente

Vingt ans plus tard, DeepMind présentait AlphaZero. La différence n'était pas quantitative — c'était qualitative.

AlphaZero n'avait reçu que les **règles du jeu** : quelles pièces existent, comment elles bougent, quand une partie se termine. Aucune base de données de parties humaines. Aucune heuristique explicitée. Aucun concept codifié par des Grands Maîtres.

Il jouait contre lui-même — des millions de parties. À chaque partie, un réseau de neurones profond apprenait : quelles positions tendent à être gagnantes, quels coups tendent à être bons depuis quelles positions. Après **9 heures** d'entraînement sur des TPUs (processeurs spécialisés de Google), AlphaZero avait atteint un niveau qui dépassait Stockfish, le meilleur moteur "classique" de l'époque.

Le style de jeu qu'AlphaZero avait développé fascinait les Grands Maîtres : dynamique, volontiers sacrificiel, avec des intuitions positionnelles que les théoriciens n'avaient jamais codifiées explicitement. AlphaZero cherchait nettement moins de positions que Stockfish (environ 80 000 par seconde contre 60 millions), mais chacune était évaluée par un réseau de neurones qui encodait une "intuition" apprise par l'expérience plutôt que par des règles explicites.

Ce n'était plus de la recherche exhaustive améliorée. C'était quelque chose de structurellement différent — une approximation de l'intuition par apprentissage profond.

## Ce que l'IA révèle sur la cognition humaine aux échecs

La trajectoire Deep Blue → AlphaZero révèle quelque chose d'important sur la nature de la cognition humaine aux échecs.

Deep Blue battait les humains en faisant *différemment* : plus de calcul brut, plus vite, plus profond. AlphaZero bat les humains en faisant quelque chose de *plus similaire* à ce que les humains font — de la reconnaissance de patterns, de l'évaluation intuitive, une recherche très élaguée dans l'arbre de jeu.

Les études IRMf sur les joueurs d'échecs experts montrent que leur cerveau n'est pas un calculateur brut. Face à une position, un Grand Maître ne "calcule" pas d'abord toutes les variantes. Il **reconnaît** la position comme appartenant à une famille, identifie les thèmes clés, et n'explore en profondeur que 3 à 5 coups candidats maximum. La plupart des 35 coups légaux disponibles sont rejetés en quelques centièmes de secondes par un processus intuitif, avant même la réflexion consciente.

Ce traitement — rapide, pattern-based, économique — est ce qu'AlphaZero reproduit mieux que Deep Blue. Et c'est probablement pourquoi AlphaZero a développé des concepts de jeu que les humains reconnaissent comme "beaux" ou "audacieux" — contrairement au jeu solide mais mécanique de Stockfish.

La complexité algorithmique des échecs était si grande qu'il a fallu attendre non pas un ordinateur assez rapide pour la résoudre de force, mais un nouveau paradigme computationnel — l'apprentissage profond — pour approximer la cognition qui, depuis toujours, permettait aux humains de jouer malgré cette complexité.

Shannon avait vu juste en 1950. La recherche exhaustive était impossible. La solution n'était pas de chercher plus vite. C'était d'apprendre à ne pas chercher.

---

*Claude Shannon jouait lui-même aux échecs, avec un niveau "raisonnable" selon ses contemporains. Il aurait probablement trouvé ironique que la meilleure solution à son problème soit d'imiter non pas l'ordinateur, mais l'humain.*
