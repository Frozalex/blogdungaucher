---
title: "AlphaZero contre Stockfish : la révolution de l'intelligence artificielle aux échecs"
excerpt: >-
  En décembre 2017, DeepMind publiait les résultats d'un match qui a changé la façon dont on pense à la fois à
  l'intelligence artificielle et aux échecs. AlphaZero, entraîné sans données humaines, battait Stockfish avec un style
  de jeu que personne n'avait anticipé.
publishDate: "2026-10-01"
category: science
featured: false
featuredRank: 99
readingTime: 11 min
pillar: Science des échecs
tags:
  - AlphaZero
  - Stockfish
  - intelligence artificielle
  - deep learning
  - apprentissage par renforcement
  - neurones
  - style de jeu
  - avenir des échecs
keyTakeaways:
  - >-
    AlphaZero a été entraîné uniquement avec les règles du jeu et un apprentissage par auto-jeu (44 millions de parties
    en 9 heures sur TPUs Google), sans données de parties humaines, sans heuristiques explicites, sans base de finales.
  - >-
    Dans le match de décembre 2017 (100 parties, une minute de réflexion par coup et non une cadence classique),
    AlphaZero a remporté 28 victoires, fait 72 nulles et perdu 0 partie contre Stockfish 8. Ce résultat a suscité des
    critiques légitimes sur les conditions du match.
  - >-
    Le style de jeu d'AlphaZero est radicalement différent de Stockfish : dynamique, sacrificiel, avec une disposition à
    maintenir des positions 'intuitivement gagnantes' que les moteurs classiques évalueraient comme neutres ou
    légèrement inférieures.
  - >-
    Dans le match de 2017, AlphaZero explorait 80 000 positions par seconde contre 70 millions pour Stockfish, soit un
    rapport de près de 1 à 1 000 : le réseau de neurones compense en concentrant la recherche sur les variantes
    prometteuses au lieu de balayer l'arbre.
  - >-
    Dans la version publiée en 2018, AlphaZero a battu Stockfish depuis chacune des 12 ouvertures humaines les plus
    jouées, et il avait lui-même redécouvert ces ouvertures pendant son auto-apprentissage, sans jamais voir une partie
    humaine.
seoTitle: "AlphaZero contre Stockfish : la révolution de l'IA aux échecs"
seoDescription: >-
  AlphaZero vs Stockfish 2017 : apprentissage par renforcement, réseau de neurones, style de jeu révolutionnaire. Comment l'IA a changé la compréhension des échecs.
ogImage: /images/blog/echecs-alphazero-stockfish-hero.png
heroImage:
  src: /images/blog/echecs-alphazero-stockfish-hero.png
  alt: >-
    Illustration pixel art : réseau de neurones d'un côté, arbre de recherche algorithmique de l'autre, échiquier au
    centre, « AlphaZero vs Stockfish »
  credit: Blog d'un Gaucher
  license: Création originale
faq:
  - question: AlphaZero est-il toujours le meilleur programme d'échecs ?
    answer: >-
      La question est complexe. DeepMind n'a pas publié de version publique d'AlphaZero. Stockfish a été massivement
      amélioré depuis 2017, intégrant des réseaux de neurones dans son évaluation (NNUE, Efficiently Updatable Neural
      Network). Les versions récentes de Stockfish sont très probablement bien plus fortes qu'AlphaZero tel qu'il était
      en 2017, mais la comparaison restera spéculative : DeepMind n'a jamais publié les poids d'AlphaZero, il n'existe
      donc aucun moyen de rejouer le match. Leela Chess Zero (Lc0), l'équivalent open-source, continue d'être développé
      et porte l'approche deep learning. La frontière entre les deux approches s'est estompée.
  - question: Pourquoi les conditions du match AlphaZero-Stockfish sont-elles contestées ?
    answer: >-
      Pour quatre raisons. Stockfish tournait sans base de finales ni bibliothèque d'ouvertures, deux ressources qu'il
      utilise normalement. Son espace de hachage était plafonné à 1 Go, très peu pour 64 threads. La cadence était d'une
      minute fixe par coup, ce qui annulait sa gestion du temps. Et le matériel d'AlphaZero (TPU Google) n'était pas
      comparable à celui de Stockfish. Les résultats publiés dans Science en décembre 2018, avec 3 heures par partie
      plus 15 secondes par coup et 44 cœurs, confirment la supériorité d'AlphaZero mais avec un écart beaucoup plus
      étroit : 155 victoires, 6 défaites et 839 nulles sur 1 000 parties, soit environ 57,5 % du score.
  - question: Qu'est-ce que le système NNUE qui a révolutionné Stockfish ?
    answer: >-
      NNUE (Efficiently Updatable Neural Network) est une architecture de réseau de neurones conçue pour fonctionner
      très rapidement sur des CPUs standards. Intégrée dans Stockfish depuis 2020, elle remplace l'ancienne fonction
      d'évaluation heuristique par un réseau de neurones entraîné sur des millions de positions évaluées par Stockfish
      lui-même. L'idée vient du shogi, où Yu Nasu l'a introduite en 2018, avant d'être portée aux échecs. Résultat :
      Stockfish NNUE combine la vitesse de recherche de l'alpha-bêta avec la richesse d'évaluation des réseaux de
      neurones. Les tests de l'équipe créditaient le seul passage au NNUE d'au moins 80 points Elo, et la version
      Stockfish 12 dans son ensemble a été annoncée environ 130 points au-dessus de Stockfish 11.
  - question: AlphaZero a-t-il vraiment 'redécouvert' des concepts d'échecs perdus ?
    answer: >-
      Plus précisément : il a joué des idées qui étaient connues théoriquement mais considérées comme 'trop risquées' ou
      'insuffisamment solides' par les standards des moteurs classiques. Des pions gambits maintenus pendant de nombreux
      coups pour la compensation dynamique, des structures de pions asymétriques que Stockfish évaluerait négativement
      mais qui contiennent des 'poisons' tactiques. Kasparov résume la chose dans Science : AlphaZero 'privilégie
      l'activité des pièces sur le matériel'. En revanche, l'idée qu'il aurait ressuscité des ouvertures romantiques du
      XIXe siècle est une légende : son répertoire avec les Blancs tourne autour de 1.d4, 1.Cf3 et 1.c4.
  - question: Leela Chess Zero (Lc0) est-il accessible au public ?
    answer: >-
      Oui, complètement. Lc0 est un projet open-source qui implémente l'architecture d'AlphaZero en utilisant des poids
      de réseau de neurones entraînés par la communauté. Il est téléchargeable gratuitement et s'intègre dans des
      interfaces d'analyse comme Arena ou Chessbase. Sur un bon GPU, il joue à très haut niveau, même si Stockfish le
      devance régulièrement dans les finales du TCEC. C'est le moyen pour les joueurs ordinaires d'accéder à un style
      d'analyse 'AlphaZero-like', souvent plus instructif que Stockfish pour comprendre les positions à compensation
      intuitive.
---

Décembre 2017. L'équipe de DeepMind publie un papier de recherche et, en annexe, 10 parties commentées. Ces 10 parties ont électrisé la communauté des échecs d'une façon que rien n'avait faite depuis le match Fischer-Spassky de 1972.

Ce n'était pas simplement qu'un programme battait un autre programme. C'était la façon dont il le battait.

## L'architecture d'AlphaZero

Pour comprendre pourquoi AlphaZero représente une rupture, il faut comprendre ce qu'il fait, et ce qu'il ne fait pas.

AlphaZero est un système de **deep reinforcement learning** (apprentissage par renforcement profond). Il combine deux technologies :

**Un réseau de neurones profond** qui prend en entrée la position de l'échiquier et produit deux sorties : une distribution de probabilité sur tous les coups légaux (la "policy head" : quels coups semblent prometteurs), et une évaluation de la position (-1 à +1, correspondant à une victoire noire, une nulle, ou une victoire blanche : la "value head").

**La recherche arborescente Monte Carlo (MCTS)** qui utilise le réseau de neurones pour guider la recherche. Plutôt que d'explorer l'arbre de jeu de façon exhaustive avec élagage alpha-bêta, MCTS simule des parties jusqu'à la fin en choisissant les coups selon les probabilités de la policy head et en propageant les résultats vers la racine.

Ce qui est remarquable : AlphaZero n'avait reçu que **les règles du jeu**. Aucune partie humaine. Aucune heuristique de position. Aucune base de finales. Aucune connaissance sur ce qu'est une "bonne" position : seulement la règle que le mat est la victoire.

Il a joué 44 millions de parties contre lui-même en neuf heures environ, ajustant ses poids de réseau au fil de l'entraînement. Le "en neuf heures" mérite une précision, parce qu'il est souvent cité comme s'il s'agissait d'un exploit frugal : pendant ces neuf heures, 5 000 TPU de première génération tournaient pour générer les parties et 64 TPU de deuxième génération pour entraîner le réseau. Ce n'est pas un ordinateur dans un garage. À la fin, il avait développé une compréhension du jeu d'une façon que personne n'avait programmée.

## Le match : 28-0-72

Dans le match de décembre 2017, AlphaZero a joué 100 parties contre Stockfish 8 (la meilleure version à l'époque). Résultat : 28 victoires pour AlphaZero, 72 nulles, 0 défaite. Dans le détail : avec les Blancs, 25 victoires et 25 nulles ; avec les Noirs, 3 victoires et 47 nulles.

Un mot sur la cadence, parce que c'est l'erreur la plus répandue à propos de ce match, et elle traînait dans cet article : **ce n'était pas une cadence classique**. Chaque programme disposait d'une minute de réflexion fixe par coup. Ça change la lecture du résultat, puisque Stockfish n'avait aucune latitude pour gérer son temps, répartir l'effort sur les coups critiques, ou réfléchir pendant le temps de l'adversaire. Sa fonction de gestion du temps, qui fait partie de sa force réelle, était tout simplement hors jeu.

Ce score est stupéfiant par plusieurs aspects. Un programme qui bat Stockfish *sans jamais perdre* est extraordinaire, Stockfish 8 était lui-même bien supérieur à n'importe quel humain. Et les victoires n'étaient pas des victoires techniques dans des finales compliquées : elles se construisaient sur des thèmes positionnels clairs.

Des critiques légitimes existent sur les conditions du match :
- Stockfish tournait sans base de finales et sans bibliothèque d'ouvertures
- Son espace de hachage était limité à 1 Go, très peu pour 64 threads
- La cadence d'une minute par coup neutralisait sa gestion du temps
- Le matériel d'AlphaZero (TPU) n'est pas directement comparable aux CPU de Stockfish

Ces critiques ont conduit DeepMind à publier en décembre 2018 une version revue et évaluée par des pairs dans *Science*, avec des conditions nettement plus sérieuses : 1 000 parties, 3 heures par partie plus 15 secondes par coup, 44 cœurs pour Stockfish, et la version de Stockfish championne du TCEC 2016.

Le résultat confirme la supériorité d'AlphaZero, mais l'écart se resserre franchement : **155 victoires, 6 défaites, 839 nulles sur 1 000 parties**, soit environ 57,5 % du score. On est loin du 28-0 de 2017. AlphaZero a par ailleurs battu Stockfish depuis chacune des 12 ouvertures humaines les plus jouées, et en lui laissant dix fois moins de temps de réflexion qu'à son adversaire.

Les chiffres de vitesse changent aussi d'un papier à l'autre, et il vaut la peine de les citer ensemble plutôt que de les mélanger comme je le faisais : 80 000 positions par seconde contre 70 millions en 2017, 60 000 contre 60 millions en 2018. Dans les deux cas, le même ordre de grandeur, un rapport proche de 1 à 1 000.

## Le style de jeu : ce qui a fasciné les Grands Maîtres

Le score impressionnait. Le style stupéfiait.

Les Grands Maîtres qui ont commenté ces parties utilisaient des termes inhabituels dans le contexte de l'analyse de moteurs : "créatif", "humain", "romantique", "vivant". Garry Kasparov a signé un commentaire dans le même numéro de *Science* ; Matthew Sadler et Natasha Regan ont consacré un livre entier, *Game Changer*, à l'analyse du style d'AlphaZero.

**Les sacrifices positionnels**. AlphaZero était remarquablement disposé à sacrifier du matériel (typiquement un pion, parfois plus) pour obtenir une compensation dynamique. Stockfish, avec son évaluation matérielle précise, aurait souvent refusé ces sacrifices ou les aurait évalués comme négatifs. AlphaZero les jouait et maintenait la compensation pendant de nombreux coups, jusqu'à ce que le matériel se transforme en avantage de position.

**La confiance dans les positions "intuitivement gagnantes"**. Des positions où l'évaluation numérique de Stockfish était ~+0,2 (légèrement favorable aux Blancs, presque nulle) mais où AlphaZero maintenait une pression continue, obligeant les Noirs à défendre des positions inconfortables coup après coup, jusqu'à l'erreur.

**Le style "roi actif" dans les finales**. AlphaZero utilisait son roi de façon offensive plus tôt que les moteurs classiques : une pratique connue dans les finales (le roi est une pièce forte dans les finales) mais souvent différée par les moteurs qui évaluent le roi sûr comme une priorité absolue.

Kasparov, dans son commentaire, ne cache pas son contentement : « J'ai été heureux de voir qu'AlphaZero avait un style dynamique et ouvert, comme le mien. » Il relève qu'AlphaZero « privilégie l'activité des pièces sur le matériel, préférant des positions qui, à mes yeux, paraissaient risquées et agressives ». Et il ajoute une remarque qui vaut plus que le compliment : les programmes reflètent d'ordinaire les priorités et les préjugés de leurs programmeurs, mais comme AlphaZero se programme lui-même, « je dirais que son style reflète la vérité ».

## Ce qu'AlphaZero a (re)découvert en théorie des ouvertures

L'impact le plus durable d'AlphaZero sur la pratique des échecs n'est pas le match lui-même : c'est l'influence sur la théorie des ouvertures.

Je dois d'abord rectifier ce que cet article racontait ici, parce que c'était faux. J'y affirmais qu'AlphaZero jouait le Système London et le Gambit du Roi, et que c'est lui qui les avait remis à la mode. Ni l'un ni l'autre ne résiste à la vérification. Le répertoire d'AlphaZero avec les Blancs, tel qu'il est documenté dans le papier de *Science* et analysé en détail par Sadler et Regan, tourne autour de 1.d4, 1.Cf3 et 1.c4. Le Gambit du Roi commence par 1.e4 e5 2.f4 : c'est précisément la famille d'ouvertures qu'AlphaZero délaisse. Quant au retour du London à haut niveau, c'est une tendance humaine, antérieure et indépendante. Au passage, le London n'est pas une "défense" mais un système de développement des Blancs.

Ce qui est réellement documenté est plus intéressant que l'anecdote :

**AlphaZero a redécouvert les ouvertures humaines tout seul.** Les courbes du papier de *Science* montrent la fréquence de chaque ouverture dans ses parties d'auto-apprentissage au fil des heures d'entraînement. Sans avoir jamais vu une partie humaine, il a convergé vers des ouvertures que des générations de joueurs avaient trouvées, puis a progressivement resserré son répertoire. Certaines ouvertures populaires chez les humains, il les a essayées et abandonnées.

**Il gagne depuis n'importe quelle ouverture.** C'est le test le plus parlant du papier de 2018 : pour vérifier que la force d'AlphaZero ne venait pas d'une spécialisation étroite, les auteurs lui ont imposé les 12 ouvertures humaines les plus jouées, des deux couleurs. Il a battu Stockfish depuis toutes.

**Les sacrifices positionnels et l'activité des pièces.** C'est là que l'influence sur la pratique humaine est la plus visible, et c'est le thème que Sadler et Regan développent : la disposition à rendre du matériel pour une pression durable, et l'usage des pions de l'aile du roi comme arme d'espace plutôt que comme bouclier.

Certains Grands Maîtres utilisent Leela Chess Zero, l'équivalent open-source d'AlphaZero, précisément pour faire remonter des idées que Stockfish classe trop vite.

## La convergence : Stockfish NNUE et la fin de la dichotomie

En septembre 2020, avec la version 12, Stockfish a intégré une architecture de réseau de neurones appelée **NNUE** (*Efficiently Updatable Neural Network*), introduite dans le monde du shogi par Yu Nasu en 2018 puis portée aux échecs.

Le NNUE remplace la fonction d'évaluation heuristique de Stockfish par un réseau de neurones entraîné sur des millions de positions évaluées par Stockfish lui-même. Sa particularité est d'être conçu pour tourner vite sur un processeur ordinaire, sans carte graphique. Résultat : Stockfish NNUE combine la vitesse de recherche alpha-bêta de l'ancienne architecture avec la richesse d'évaluation positionnelle des réseaux de neurones.

L'amélioration a été immédiate. Les tests de l'équipe créditaient le seul passage au NNUE d'au moins 80 points Elo ; Stockfish 12 dans son ensemble a été annoncé environ 130 points au-dessus de Stockfish 11. Un saut considérable pour un moteur qui en était à sa douzième version.

La dichotomie "Stockfish (force brute) vs AlphaZero (deep learning)" est devenue obsolète. Les deux approches ont fusionné. Leela Chess Zero continue son développement avec une architecture plus proche d'AlphaZero, et les deux programmes sont aujourd'hui proches en force absolue.

## Implications pour la compréhension humaine des échecs

La question la plus profonde soulevée par AlphaZero n'est pas "quel programme est le meilleur ?" : c'est "que nous apprend un programme qui joue comme ça sur la nature de la compréhension aux échecs ?"

AlphaZero suggère qu'il existe une forme de compréhension positionnelle qui n'est pas réductible à l'évaluation matérielle précise + recherche profonde. Des positions que Stockfish évalue comme ~0 (nulle) contiennent des "gradients" subtils de pression et d'opportunité qu'AlphaZero détecte et exploite.

Ces gradients : difficiles à quantifier numériquement, mais reconnaissables intuitivement par un Grand Maître expérimenté : ressemblent à ce que les joueurs humains appellent "l'initiative", "la dynamique", "les pièces actives". AlphaZero a développé une forme de mesure de ces qualités que les heuristiques classiques n'avaient pas.

Pour les joueurs humains, l'enseignement est contre-intuitif : parfois, la position "objectivement" légèrement inférieure mais dynamiquement riche est meilleure que la position "objectivement" équivalente mais statique. Les évaluations numériques de moteurs, utiles mais imparfaites, ne capturent pas toujours cette dynamique.

C'est peut-être la contribution la plus durable d'AlphaZero aux échecs : rappeler que la mesure du bon coup n'est pas seulement numérique. La beauté, la pression, le sacrifice, l'initiative (des concepts que les joueurs humains ont toujours utilisés) ont une réalité informatique, pas seulement poétique.

---

*AlphaZero n'a jamais joué une partie contre un humain. Ses adversaires étaient des moteurs et ses propres copies antérieures. Il n'a jamais ressenti la pression d'un tournoi, l'inconfort d'une position perdante, la joie d'une belle combinaison trouvée. Et pourtant, les Grands Maîtres ont dit de son jeu qu'il était le plus 'humain' qu'ils aient jamais analysé. Il y a quelque chose dans cette ironie qui mérite réflexion.*

## Sources

- Silver, D., Hubert, T., Schrittwieser, J., Antonoglou, I., Lai, M., Guez, A., Lanctot, M., Sifre, L., Kumaran, D., Graepel, T., Lillicrap, T., Simonyan, K., & Hassabis, D. (2017). *Mastering chess and shogi by self-play with a general reinforcement learning algorithm*. arXiv:1712.01815. [arxiv.org/abs/1712.01815](https://arxiv.org/abs/1712.01815) — la prépublication de décembre 2017, en accès libre : le match 100 parties contre Stockfish 8, la cadence d'une minute par coup (p. 4), les 80 000 contre 70 millions de positions par seconde, les 44 millions de parties d'auto-apprentissage.
- Silver, D., et al. (2018). A general reinforcement learning algorithm that masters chess, shogi, and Go through self-play. *Science*, 362(6419), 1140-1144. [doi:10.1126/science.aar6404](https://doi.org/10.1126/science.aar6404) — la version évaluée par des pairs : 1 000 parties, 3 heures plus 15 secondes par coup, 155 victoires et 6 défaites, et les matchs depuis les 12 ouvertures humaines les plus jouées (fig. 3).
- Kasparov, G. (2018). Chess, a *Drosophila* of reasoning. *Science*, 362(6419), 1087. [doi:10.1126/science.aaw2221](https://doi.org/10.1126/science.aaw2221) — le commentaire d'où viennent les citations de cet article.
- Campbell, M. (2018). Mastering board games. *Science*, 362(6419), 1118. [doi:10.1126/science.aav1175](https://doi.org/10.1126/science.aav1175) — la perspective d'un des créateurs de Deep Blue sur le même résultat.
- Sadler, M., & Regan, N. (2019). *Game Changer: AlphaZero's Groundbreaking Chess Strategies and the Promise of AI*. Alkmaar : New In Chess. — l'analyse échiquéenne de référence sur le style et le répertoire d'AlphaZero.
- McGrath, T., Kapishnikov, A., Tomašev, N., Pearce, A., Wattenberg, M., Hassabis, D., Kim, B., Paquet, U., & Kramnik, V. (2022). Acquisition of chess knowledge in AlphaZero. *Proceedings of the National Academy of Sciences*, 119(47), e2206625119. [doi:10.1073/pnas.2206625119](https://doi.org/10.1073/pnas.2206625119) — ce que le réseau a appris, concept par concept, avec l'analyse de Kramnik.
- *Stockfish 12* (2 septembre 2020), notes de version. [stockfishchess.org/blog/2020/stockfish-12/](https://stockfishchess.org/blog/2020/stockfish-12/) — l'arrivée du NNUE et le gain de niveau annoncé.

## Pour aller plus loin

- [Sujet Grand Oral NSI : Pourquoi AlphaZero représente-t-il une rupture dans l'intelligence artificielle ?](/fr/blog/sujet-grand-oral-nsi-alphazero/)
- [La complexité algorithmique des échecs : pourquoi l'IA a mis 50 ans à battre l'homme](/fr/blog/echecs-et-complexite-algorithmique/)
- [Pourquoi les échecs sont un problème mathématique (presque) impossible et comment l'IA s'en sort quand même](/fr/blog/pourquoi-echecs-probleme-mathematique-impossible-et-ia/)

