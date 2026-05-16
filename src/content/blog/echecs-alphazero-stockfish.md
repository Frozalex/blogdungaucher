---
title: "AlphaZero contre Stockfish : la révolution de l'intelligence artificielle aux échecs"
excerpt: "En décembre 2017, DeepMind publiait les résultats d'un match qui a changé la façon dont on pense à la fois à l'intelligence artificielle et aux échecs. AlphaZero, entraîné sans données humaines, battait Stockfish avec un style de jeu que personne n'avait anticipé."
publishDate: "2026-10-26"
category: "science"
featured: false
featuredRank: 99
readingTime: "19 min"
pillar: "Science des échecs"
tags: ["AlphaZero", "Stockfish", "intelligence artificielle", "deep learning", "apprentissage par renforcement", "neurones", "style de jeu", "avenir des échecs"]
keyTakeaways:
  - "AlphaZero a été entraîné uniquement avec les règles du jeu et un apprentissage par auto-jeu (44 millions de parties en 9 heures sur TPUs Google), sans données de parties humaines, sans heuristiques explicites, sans base de finales."
  - "Dans le match de décembre 2017 (100 parties à cadence classique), AlphaZero a remporté 28 victoires, fait 72 nulles, et perdu 0 parties contre Stockfish 8. Ce résultat est contesté par des critiques légitimes sur les conditions du match."
  - "Le style de jeu d'AlphaZero est radicalement différent de Stockfish : dynamique, sacrificiel, avec une disposition à maintenir des positions 'intuitivement gagnantes' que les moteurs classiques évalueraient comme neutres ou légèrement inférieures."
  - "AlphaZero évalue ~80 000 positions par seconde contre ~60 millions pour Stockfish, mais chaque évaluation par réseau de neurones est beaucoup plus 'riche' en information positionnelle que l'évaluation heuristique de Stockfish."
  - "L'impact sur la théorie des ouvertures a été significatif : AlphaZero a redécouvert et validé des idées positionnelles que les théoriciens humains connaissaient vaguement mais que les moteurs classiques n'avaient jamais recommandées."
seoTitle: "AlphaZero contre Stockfish : la révolution de l'IA aux échecs"
seoDescription: "Match AlphaZero vs Stockfish 2017, apprentissage par renforcement, style de jeu révolutionnaire : comment AlphaZero a changé les échecs et l'IA."
ogImage: "/images/blog/echecs-alphazero-stockfish-hero.png"
heroImage:
  src: "/images/blog/echecs-alphazero-stockfish-hero.png"
  alt: "Illustration pixel art : réseau de neurones d'un côté, arbre de recherche algorithmique de l'autre, échiquier au centre, « AlphaZero vs Stockfish »"
  credit: "Blog d'un Gaucher"
  license: "Création originale"
titleEn: "AlphaZero vs Stockfish : The Artificial Intelligence Revolution in Chess"
excerptEn: "In December 2017, DeepMind published results of a match that changed how we think about both artificial intelligence and chess. AlphaZero, trained without human data, beat Stockfish with a playing style nobody had anticipated."
seoTitleEn: "AlphaZero vs Stockfish : The AI Revolution in Chess"
seoDescriptionEn: "AlphaZero vs Stockfish 2017 match, reinforcement learning, revolutionary playing style : how AlphaZero changed chess and AI."
faq:
  - question: "AlphaZero est-il toujours le meilleur programme d'échecs ?"
    answer: "La question est complexe. DeepMind n'a pas publié de version publique d'AlphaZero. Stockfish a été massivement amélioré depuis 2017, intégrant des réseaux de neurones dans son évaluation (NNUE, Efficiently Updatable Neural Network). La version actuelle de Stockfish (Stockfish 16/17) est probablement meilleure qu'AlphaZero tel qu'il était en 2017. Leela Chess Zero (Lc0), l'équivalent open-source d'AlphaZero, continue à être développé et représente l'approche deep learning. La frontière entre les deux approches s'est estompée."
  - question: "Pourquoi les conditions du match AlphaZero-Stockfish sont-elles contestées ?"
    answer: "Principalement parce que Stockfish tournait sans base de finales de Syzygy (une bibliothèque de finales parfaitement calculées que Stockfish utilise normalement), et parce que la configuration matérielle d'AlphaZero (TPUs Google, matériel spécialisé) n'était pas directement comparable à celle de Stockfish (CPU standard). Des résultats publiés plus tard dans Science (décembre 2018), avec des conditions plus équilibrées, confirmaient néanmoins la supériorité d'AlphaZero, mais avec un avantage moins écrasant."
  - question: "Qu'est-ce que le système NNUE qui a révolutionné Stockfish ?"
    answer: "NNUE (Efficiently Updatable Neural Network) est une architecture de réseau de neurones conçue pour fonctionner très rapidement sur des CPUs standards. Intégrée dans Stockfish depuis 2020, elle remplace l'ancienne fonction d'évaluation heuristique par un réseau de neurones entraîné sur des millions de positions évaluées par Stockfish lui-même. Résultat : Stockfish NNUE combine la vitesse de recherche de l'alpha-bêta avec la richesse d'évaluation des réseaux de neurones : un hybride qui a augmenté son niveau d'environ 80-100 points Elo."
  - question: "AlphaZero a-t-il vraiment 'redécouvert' des concepts d'échecs perdus ?"
    answer: "Plus précisément : il a joué des idées qui étaient connues théoriquement mais considérées comme 'trop risquées' ou 'insuffisamment solides' par les standards des moteurs classiques. Des pions gambits maintenus pendant de nombreux coups pour la compensation dynamique, des structures de pions asymétriques que Stockfish évaluerait négativement mais qui contiennent des 'poisons' tactiques. Des Grands Maîtres comme Kasparov et Seirawan ont commenté que le style d'AlphaZero ressemblait parfois à celui de joueurs romantiques du XIXe siècle : maximiser les pièces actives plutôt que le compte matériel."
  - question: "Leela Chess Zero (Lc0) est-il accessible au public ?"
    answer: "Oui, complètement. Lc0 est un projet open-source qui implémente l'architecture d'AlphaZero en utilisant des poids de réseau de neurones entraînés par la communauté. Il est téléchargeable gratuitement et s'intègre dans des interfaces d'analyse comme Arena ou Chessbase. Sur un bon GPU, il joue à un niveau comparable aux meilleurs Stockfish. C'est le moyen pour les joueurs ordinaires d'accéder à un style d'analyse 'AlphaZero-like' : qui peut être plus instructif que Stockfish pour comprendre les positions à compensation intuitive."
---

Décembre 2017. L'équipe de DeepMind publie un papier de recherche et, en annexe, 10 parties commentées. Ces 10 parties ont électrisé la communauté des échecs d'une façon que rien n'avait faite depuis le match Fischer-Spassky de 1972.

Ce n'était pas simplement qu'un programme battait un autre programme. C'était la façon dont il le battait.

## L'architecture d'AlphaZero

Pour comprendre pourquoi AlphaZero représente une rupture, il faut comprendre ce qu'il fait, et ce qu'il ne fait pas.

AlphaZero est un système de **deep reinforcement learning** (apprentissage par renforcement profond). Il combine deux technologies :

**Un réseau de neurones profond** qui prend en entrée la position de l'échiquier et produit deux sorties : une distribution de probabilité sur tous les coups légaux (la "policy head" : quels coups semblent prometteurs), et une évaluation de la position (-1 à +1, correspondant à une victoire noire, une nulle, ou une victoire blanche : la "value head").

**La recherche arborescente Monte Carlo (MCTS)** qui utilise le réseau de neurones pour guider la recherche. Plutôt que d'explorer l'arbre de jeu de façon exhaustive avec élagage alpha-bêta, MCTS simule des parties jusqu'à la fin en choisissant les coups selon les probabilités de la policy head et en propageant les résultats vers la racine.

Ce qui est remarquable : AlphaZero n'avait reçu que **les règles du jeu**. Aucune partie humaine. Aucune heuristique de position. Aucune base de finales. Aucune connaissance sur ce qu'est une "bonne" position : seulement la règle que le mat est la victoire.

Il a joué 44 millions de parties contre lui-même en 9 heures (sur des TPUs Google, du matériel spécialisé), ajustant ses poids de réseau après chaque partie. À la fin, il avait développé une compréhension du jeu d'une façon que personne n'avait programmée.

## Le match : 28-0-72

Dans le match de décembre 2017, AlphaZero a joué 100 parties contre Stockfish 8 (la meilleure version à l'époque) à cadence classique. Résultat : 28 victoires pour AlphaZero, 72 nulles, 0 défaite.

Ce score est stupéfiant par plusieurs aspects. Un programme qui bat Stockfish *sans jamais perdre* est extraordinaire, Stockfish 8 était lui-même bien supérieur à n'importe quel humain. Et les victoires n'étaient pas des victoires techniques dans des finales compliquées : elles se construisaient sur des thèmes positionnels clairs.

Des critiques légitimes existent sur les conditions du match :
- Stockfish tournait sans ses bases de finales Syzygy
- Le matériel d'AlphaZero (TPUs) n'est pas directement comparable aux CPUs de Stockfish
- Stockfish n'avait pas été ré-optimisé pour le matériel disponible

Ces critiques ont conduit DeepMind à publier en décembre 2018 une version révisée dans la revue *Science*, avec des conditions plus équilibrées. Le résultat confirmait la supériorité d'AlphaZero, mais avec un avantage moins écrasant : environ 64% de victoires dans les positions ouvertes, score global favorable mais pas 28-0.

## Le style de jeu : ce qui a fasciné les Grands Maîtres

Le score impressionnait. Le style stupéfiait.

Les Grands Maîtres qui ont commenté les 10 parties publiées (Kasparov, Nakamura, Seirawan) utilisaient des termes inhabituels dans le contexte de l'analyse de moteurs : "créatif", "humain", "romantique", "vivant".

**Les sacrifices positionnels**. AlphaZero était remarquablement disposé à sacrifier du matériel (typiquement un pion, parfois plus) pour obtenir une compensation dynamique. Stockfish, avec son évaluation matérielle précise, aurait souvent refusé ces sacrifices ou les aurait évalués comme négatifs. AlphaZero les jouait et maintenait la compensation pendant de nombreux coups, jusqu'à ce que le matériel se transforme en avantage de position.

**La confiance dans les positions "biologiquement gagnantes"**. Des positions où l'évaluation numérique de Stockfish était ~+0.2 (légèrement favorables aux Blancs, presque nulle) mais où AlphaZero maintenait une pression continue, obligeant les Noirs à défendre des positions inconfortables coup après coup, jusqu'à l'erreur.

**Le style "roi actif" dans les finales**. AlphaZero utilisait son roi de façon offensive plus tôt que les moteurs classiques : une pratique connue dans les finales (le roi est une pièce forte dans les finales) mais souvent différée par les moteurs qui évaluent le roi sûr comme une priorité absolue.

Garry Kasparov, analysant les parties, a dit qu'il "reconnaissait" ce style : pas comme celui d'un programme, mais comme celui d'un joueur humain brillant avec une profonde compréhension positionnelle. "C'est ainsi que j'aimais jouer quand j'étais au sommet."

## Ce qu'AlphaZero a (re)découvert en théorie des ouvertures

L'impact le plus durable d'AlphaZero sur la pratique des échecs n'est pas le match lui-même : c'est l'influence sur la théorie des ouvertures.

AlphaZero jouait régulièrement plusieurs systèmes que les moteurs classiques avaient dépriorisés :

**La Défense London (1.d4 d5 2.Bf4)** : considérée par les moteurs comme solide mais sans mordant. AlphaZero la jouait avec une énergie positionnelle qui a inspiré des joueurs humains à la réintégrer à haut niveau. Aujourd'hui, Magnus Carlsen et d'autres élites l'utilisent régulièrement.

**Le Gambit du Roi (1.e4 e5 2.f4)** : une ouverture romantique du XIXe siècle, généralement considérée comme insuffisante au plus haut niveau. AlphaZero la jouait et gagnait : révélant des ressources que la théorie moderne n'avait pas pleinement explorées.

**Des structures de pions à îlots multiples** que Stockfish évaluait légèrement négativement mais qui contenaient des dynamiques compensatoires.

Ces "redécouvertes" ont influencé les analyses préparatoires des élites. Certains Grands Maîtres utilisent explicitement Leela Chess Zero (l'équivalent open-source d'AlphaZero) pour trouver des idées que Stockfish aurait rejetées.

## La convergence : Stockfish NNUE et la fin de la dichotomie

En 2020, Stockfish a intégré une architecture de réseau de neurones appelée **NNUE** (Efficiently Updatable Neural Network), développée initialement pour le shogi.

Le NNUE remplace la fonction d'évaluation heuristique de Stockfish par un réseau de neurones entraîné sur des millions de positions évaluées par Stockfish lui-même. Résultat : Stockfish NNUE combine la vitesse de recherche alpha-bêta de l'ancienne architecture avec la richesse d'évaluation positionnelle des réseaux de neurones.

L'amélioration de niveau a été immédiate : environ 80-100 points Elo de gain, faisant de Stockfish NNUE le meilleur programme disponible publiquement.

La dichotomie "Stockfish (force brute) vs AlphaZero (deep learning)" est devenue obsolète. Les deux approches ont fusionné. Leela Chess Zero continue son développement avec une architecture plus proche d'AlphaZero, et les deux programmes sont aujourd'hui proches en force absolue.

## Implications pour la compréhension humaine des échecs

La question la plus profonde soulevée par AlphaZero n'est pas "quel programme est le meilleur ?" : c'est "que nous apprend un programme qui joue comme ça sur la nature de la compréhension aux échecs ?"

AlphaZero suggère qu'il existe une forme de compréhension positionnelle qui n'est pas réductible à l'évaluation matérielle précise + recherche profonde. Des positions que Stockfish évalue comme ~0 (nulle) contiennent des "gradients" subtils de pression et d'opportunité qu'AlphaZero détecte et exploite.

Ces gradients : difficiles à quantifier numériquement, mais reconnaissables intuitivement par un Grand Maître expérimenté : ressemblent à ce que les joueurs humains appellent "l'initiative", "la dynamique", "les pièces actives". AlphaZero a développé une forme de mesure de ces qualités que les heuristiques classiques n'avaient pas.

Pour les joueurs humains, l'enseignement est contre-intuitif : parfois, la position "objectivement" légèrement inférieure mais dynamiquement riche est meilleure que la position "objectivement" équivalente mais statique. Les évaluations numériques de moteurs, utiles mais imparfaites, ne capturent pas toujours cette dynamique.

C'est peut-être la contribution la plus durable d'AlphaZero aux échecs : rappeler que la mesure du bon coup n'est pas seulement numérique. La beauté, la pression, le sacrifice, l'initiative (des concepts que les joueurs humains ont toujours utilisés) ont une réalité informatique, pas seulement poétique.

---

*AlphaZero n'a jamais joué une partie contre un humain. Ses adversaires étaient des moteurs et ses propres copies antérieures. Il n'a jamais ressenti la pression d'un tournoi, l'inconfort d'une position perdante, la joie d'une belle combinaison trouvée. Et pourtant, les Grands Maîtres ont dit de son jeu qu'il était le plus 'humain' qu'ils aient jamais analysé. Il y a quelque chose dans cette ironie qui mérite réflexion.*
