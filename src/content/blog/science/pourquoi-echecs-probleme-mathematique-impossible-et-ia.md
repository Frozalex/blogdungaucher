---
title: Pourquoi les échecs sont un problème mathématique (presque) impossible et comment l'IA s'en sort quand même
excerpt: >-
  L'arbre des coups explose, le nombre de Shannon donne le vertige, et pourtant un moteur te corrige en quelques
  secondes. Les échecs sont-ils "impossibles" à résoudre ? Voici ce que les maths, l'informatique et l'IA font vraiment
  sous le capot.
publishDate: "2026-04-09"
updatedDate: "2026-05-21"
category: science
featured: false
featuredRank: 99
readingTime: "15 min"
pillar: Informatique
tags:
  - échecs
  - mathématiques
  - complexité
  - EXPTIME
  - nombre de Shannon
  - arbre des coups
  - minimax
  - alpha-bêta
  - moteur d'échecs
  - IA
  - Stockfish
seoTitle: "Résoudre les échecs : complexité, Shannon et limites de l'IA"
seoDescription: "Nombre de Shannon, recherche exhaustive, évaluation et IA : pourquoi les échecs ne sont pas résolus, sans confondre difficulté pratique et impossibilité démontrée."
ogImage: /images/og/pourquoi-echecs-probleme-mathematique-impossible-et-ia-watermarked-og.webp
heroImage:
  src: /images/blog/pourquoi-echecs-probleme-mathematique-impossible-et-ia-watermarked-hero.webp
  alt: "Vignette pixel art : ordinateur rétro, écran avec arbre de décision
    lumineux, titre sur la complexité mathématique des échecs et l’IA"
  credit: Blog d'un Gaucher
  license: Création originale
faq:
  - question: "Les échecs seront-ils résolus un jour ?"
    answer: "On ne le sait pas. L'exploration exhaustive est hors de portée des méthodes actuelles, mais cela n'exclut pas une autre forme de preuve. Le résultat EXPTIME concerne une généralisation du jeu, pas une impossibilité démontrée pour l'échiquier 8×8."
  - question: "Quelle différence entre résoudre et battre un humain ?"
    answer: "Résoudre exige une preuve du résultat sous jeu parfait. Gagner des parties contre des humains mesure une performance dans certaines conditions, sans établir cette preuve. Les cotes de moteurs et les classements humains ne sont pas directement interchangeables."
  - question: "Le nombre de Shannon est-il exact ?"
    answer: "Non. L'ordre de grandeur $10^{120}$ décrit la taille estimée d'un arbre de parties, pas un décompte exact des positions légales distinctes."

---

Le [jeu d'échecs](https://fr.wikipedia.org/wiki/%C3%89checs) pose deux problèmes distincts : déterminer le résultat sous jeu parfait et choisir un bon coup avec des ressources de calcul limitées. Une réponse efficace au second ne constitue pas une résolution complète du premier.

La taille de l'arbre des variantes rend son exploration exhaustive impraticable avec les moyens considérés ici. Les programmes combinent donc recherche, évaluation et élagage ; certains s'appuient aussi sur l'apprentissage. Il faut comprendre le rôle de ces méthodes pour expliquer leur force sans leur attribuer une connaissance de toutes les parties possibles.

![Schéma d'un plateau 8×8, jeu d'échecs et configurations discrètes](/images/echecs-ia-01-plateau.svg)

Aucune solution complète depuis la position initiale n'est connue. Cette limite reste compatible avec une force de jeu supérieure à celle des meilleurs humains : obtenir de très bonnes décisions en pratique et garantir un résultat contre toute réponse possible sont deux exigences différentes.

## L'échiquier vu de l'intérieur : un graphe d'états, pas un chaos

Pour un mathématicien ou un informaticien, le [jeu d'échecs](https://fr.wikipedia.org/wiki/Jeu_d%27%C3%A9checs) offre une qualité rare : les règles sont exactes, publiques, et le jeu est déterministe. Un [Cavalier](https://fr.wikipedia.org/wiki/Cavalier_(jeu_d%27%C3%A9checs)) saute toujours en L, un Fou reste sur sa couleur : chaque coup légal de ce jeu d'échecs est reproductible, sans hasard ni surprise de règle, même si, devant un humain imprévisible, tu peux avoir l'impression d'incertitude.

- une position complète (pièces, trait, roque, prise en passant…) = un état du jeu ;
- un coup légal = une transition vers un autre état ;
- une partie = une trajectoire, donc une suite d'états dans un espace gigantesque.

Si tu veux être un peu formel, tu peux voir ça comme un [graphe orienté](https://fr.wikipedia.org/wiki/Graphe_orient%C3%A9) : chaque nœud est un état, chaque arête est un coup légal ; depuis un état fixé, tu peux aussi imaginer un arbre d'exploration où les joueurs alternent des branches. Ce cadre est exactement celui exploré en détail dans [théorie des jeux aux échecs](/fr/blog/theorie-des-jeux-aux-echecs/), avec l'angle dual sur les [équilibres dans les ouvertures](/fr/blog/graphes-de-nash-equilibre-ouvertures/).

![Graphe orienté : positions et coups possibles sur le plateau](/images/echecs-ia-02-graphe.svg)

## L'arbre des coups : pourquoi "je calcule tout" est un mythe

À ton niveau de club, tu as peut-être déjà entendu un joueur dire : "J'ai tout calculé." C'est une phrase qui sonne bien, mais elle est presque toujours fausse à la rigueur : même les grands maîtres et les champions ne parcourent qu'une petite partie de l'arbre ; du joueur de club au grand maître, chacun n'effleure qu'une infime partie des branches. Ils calculent une petite partie, et ils le font bien.

Les ouvrages notent souvent \(b\) le nombre moyen de coups possibles (facteur de branchement), \(d\) la profondeur explorée en demi-coups (*plies*), et \(N(b,d)\) le nombre approximatif de nœuds à explorer ; une approximation naïve donne \(N(b,d) \approx b^d\). Dès que tu ajoutes de la profondeur, tu ne rajoutes pas "un peu" de travail : tu multiplies le travail, c'est une loi des mathématiques : l'exponentielle. Elle explique pourquoi même les machines les plus rapides restent contraintes par le temps disponible et la mémoire, même avec les meilleurs algorithmes connus.

$$
N(b,d) \approx b^d
$$

Dans un modèle simplifié, prends un facteur de branchement constant \(b=35\). Le nombre de feuilles croît alors comme \(b^d\) : augmenter la profondeur coûte rapidement cher. Dans une partie réelle, le nombre de coups légaux varie avec la position. La sélection humaine de candidats et la recherche d’un moteur peuvent être comparées comme analogie pratique ; elles ne constituent pas pour autant le même mécanisme.

Pour endiguer cette explosion, il n'y a pas de magie : il faut couper, estimer, ordonner les coups ; autant de méthodes que cet article détaille ensuite.

![Croissance d’un arbre : un modèle à préciser](/images/echecs-ia-03-arbre.svg)

## Le nombre de Shannon : un ordre de grandeur

[Claude Shannon](https://fr.wikipedia.org/wiki/Claude_Shannon) propose en 1950 un ordre de grandeur de \(10^{120}\) sous les hypothèses de son modèle, devenu le [nombre de Shannon](https://fr.wikipedia.org/wiki/Nombre_de_Shannon). Il ne s’agit pas d’un dénombrement exact des parties légales ni des configurations atteignables. Cette estimation illustre le coût d’une exploration exhaustive naïve ; elle ne prouve pas qu’aucune méthode différente ne pourra un jour résoudre le jeu.

![Ordre de grandeur 10^120, nombre de Shannon et information](/images/echecs-ia-04-shannon.svg)

## Pourquoi ce jeu n'est pas "résolu" (et pourquoi ça n'empêche pas de gagner)

Un jeu est "[résolu](https://fr.wikipedia.org/wiki/Jeu_r%C3%A9solu)" au sens des mathématiques lorsque l'issue du jeu parfait (victoire, défaite, nul) est connue depuis la position initiale et/ou qu'une stratégie optimale est entièrement décrite. La [théorie des jeux](https://fr.wikipedia.org/wiki/Th%C3%A9orie_des_jeux), héritée de [John von Neumann](https://fr.wikipedia.org/wiki/John_von_Neumann), fournit un outil pour parler de joueurs rationnels et d'[équilibre de Nash](https://fr.wikipedia.org/wiki/%C3%89quilibre_de_Nash) ; ici, la structure est surtout celle d'un duel à information parfaite.

Le tableau suivant résume la différence entre quelques jeux célèbres et les échecs, le seul tableau de cet article.

| Jeu | Résolu ? | Commentaire rapide |
| --- | --- | --- |
| [Morpion](https://fr.wikipedia.org/wiki/Morpion) | Oui | Espace petit : stratégie optimale connue |
| [Dames anglaises](https://fr.wikipedia.org/wiki/Dames_anglaises) | Faiblement résolues | Position initiale nulle sous jeu parfait ; ne concerne pas toutes les variantes |
| **Échecs** | Non | Espace trop vaste ; aucune preuve complète d'issue |
| [Go](https://fr.wikipedia.org/wiki/Go_%28jeu%29) | Partiellement exploré | IA ([AlphaGo](https://fr.wikipedia.org/wiki/AlphaGo)) a changé le niveau du débat |

Ne pas connaître la valeur de la position initiale n’empêche pas des certitudes locales : un mat forcé démontré ou une table de finales applicable peut fournir un résultat exact dans son cadre. Une évaluation heuristique, en revanche, ne possède pas cette garantie. Un moteur peut donc être très performant sans résoudre le jeu entier. Cette différence est développée dans [le paradoxe de Zermelo](/fr/blog/paradoxe-de-zermelo/).

### EXPTIME-complet : attention à la généralisation

Fraenkel et Lichtenstein (1981) étudient le problème de décider qui peut gagner depuis une position arbitraire dans une généralisation des échecs sur un échiquier $n\times n$. Ce problème est EXPTIME-complet. Les auteurs précisent que leur résultat dit peu de choses directement sur les échecs 8×8.

Il s'agit d'une difficulté dans le pire cas pour une famille de problèmes dont la taille varie. Ce n'est ni un temps de calcul imposé pour chaque position ni une preuve d'impossibilité physique de résoudre la position initiale habituelle. Les échecs de taille fixe restent un problème fini ; « indécidable » ne convient pas pour désigner un calcul trop coûteux en pratique.


## Ce que fait un moteur "classique" : minimax, mais pas naïf

Tu peux résumer l'ossature des moteurs traditionnels (type [Stockfish](https://fr.wikipedia.org/wiki/Stockfish)) en trois briques :

- exploration : parcours de l'arbre de coups ;
- évaluation : estimer qui est mieux sur le diagramme ;
- optimisations : pour ne pas se noyer dans les branches.

L'idée derrière minimax est presque philosophique : toi, tu cherches à maximiser ton avantage ; ton adversaire cherche à minimiser ton avantage ; tu choisis le coup qui maximise le minimum garanti face au meilleur jeu adverse. La version ultra simplifiée ressemble à une récurrence sur les nœuds du graphe :

$$
f(x) = \max_{m \in M} \min_{r \in R} f(x_{m,r})
$$

Si tu veux une traduction club : minimax, c'est "je ne joue pas un coup qui marche seulement si l'autre dort." C'est une logique claire de prudence rationnelle, pas une garantie contre le tilt, mais un modèle du "pire cas".

Minimax brut, seul, te fait explorer un arbre beaucoup trop gros : sans optimisation, le coût devient vite prohibitif ; la bonne nouvelle, c'est qu'une immense partie de l'arbre est inutile si tu sais la couper sans regret. (L'algorithme, ses raffinements modernes (negamax, null-move pruning, table de transposition) et leur version en réseau de neurones sont déroulés dans [minimax aux échecs](/fr/blog/minimax-aux-echecs/).)

![Minimax : maximiser son gain face au pire adversaire](/images/echecs-ia-05-minimax.svg)

## Alpha-bêta : l'art de couper sans regret

L'[élagage alpha-bêta](https://fr.wikipedia.org/wiki/%C3%89lagage_alpha-b%C3%AAta) est une optimisation du parcours minimax : son but n'est pas de trouver une autre vérité, mais de ne pas calculer ce qui ne peut plus changer la décision. **Alpha** est la meilleure valeur déjà garantie pour le joueur qui maximise ; bêta est la meilleure valeur déjà garantie pour le joueur qui minimise ; si une branche ne pourra jamais dépasser ce que tu as déjà trouvé ailleurs, tu la coupes.

C'est le même geste que toi quand tu calcules une tactique : tu explores une ligne, tu vois que même si tout marche, tu n'obtiens pas mieux qu'un autre plan, donc tu arrêtes de t'y attarder. La conséquence est énorme : avec un bon ordre des coups, alpha-bêta peut réduire drastiquement le nombre de nœuds explorés ; le moteur gagne des profondeurs "gratuites" pour la qualité affichée à l'écran.

![Élagage alpha-bêta : branches coupées sans changer la décision](/images/echecs-ia-06-alphabeta.svg)

## L'évaluation : estimer sans tout calculer

Même avec alpha-bêta, tu ne peux pas aller au bout de l'arbre : tu arrives sur des feuilles à profondeur limitée, et tu dois répondre à une question qui ressemble à de la magie : « cette configuration, elle vaut quoi ? ». Les moteurs "classiques" utilisent une fonction d'évaluation faite de critères comme :

- matériel ;
- structure de pions ;
- activité des pièces ;
- sécurité du roi ;
- contrôle de cases (et bien d'autres dans les moteurs de pointe).

Ce n'est pas qu'une addition naïve de points : les moteurs traditionnels combinent des heuristiques et des paramètres optimisés. Stockfish a annoncé en 2020 l'intégration de NNUE, une évaluation par réseau de neurones, tout en conservant une recherche alpha-bêta. Ces approches combinent donc recherche et apprentissage pour obtenir une évaluation corrélée au résultat final sans atteindre ce résultat final. Dans la vraie vie, c'est comme juger une position "prometteuse" sans calculer le mat en vingt-huit coups : tu sais reconnaître un schéma où l'initiative et la paire de fous "sentent bon", même si nulle ligne ne tient lieu de preuve complète. Le moteur formalise ce savoir technique et le fait sans fatigue, pour des milliers de joueurs. (L'article sur [la théorie du chaos aux échecs](/fr/blog/theorie-du-chaos-aux-echecs/) distingue l'analogie d'une instabilité tactique d'une preuve de chaos mathématique.)

![Évaluer une position à une profondeur limitée](/images/echecs-ia-07-evaluation.svg)

## L'IA : quand la machine apprend à évaluer et à choisir, au lieu que tout soit écrit à la main

Depuis quelques années, une idée a gagné une place énorme : au lieu de coder "à la main" une évaluation sophistiquée, il devient possible d'*apprendre* une évaluation à partir de données ou par auto-jeu. Les [réseaux de neurones](https://fr.wikipedia.org/wiki/R%C3%A9seau_de_neurones_artificiels) et l'[apprentissage automatique](https://fr.wikipedia.org/wiki/Apprentissage_automatique) sont au cœur de cette vague. Tu confonds peut-être souvent "IA" et "elle calcule plus" : en réalité, l'IA moderne brille surtout sur deux tâches :

- évaluer un diagramme de façon très riche (représentation compressée) ;
- proposer de bons coups candidats pour orienter l'exploration.

Résultat : le moteur n'a pas besoin d'explorer "tout" : il explore mieux. Tu peux le voir comme une version industrialisée de ce que font les joueurs forts : ils ne regardent pas trente-cinq coups au hasard ; ils en sélectionnent quelques-uns "sérieux", puis ils calculent. L'IA fait pareil avec une cohérence et une profondeur d'entraînement qui dépassent l'intuition.

Le point spectaculaire de certaines approches, c'est l'auto-jeu : une machine s'affronte à elle-même, apprend des positions qu'elle génère, améliore ses évaluations, et recommence. Ce n'est pas un miracle, c'est une boucle simple :

1. générer des expériences ;
2. apprendre à prédire ce qui mène à de bons résultats ;
3. renforcer les choix gagnants ;
4. itérer.

Ce qui est fascinant, c'est qu'en partant d'un jeu aux règles strictes, tu peux faire émerger des préférences stratégiques sans les écrire en français ligne par ligne.

![Réseaux et recherche : des fonctions distinctes](/images/echecs-ia-08-reseau.svg)

## IBM face à Kasparov : un jour historique pour le logiciel (sans "résoudre" le jeu)

En 1997, [Deep Blue](https://fr.wikipedia.org/wiki/Deep_Blue) bat [Garry Kasparov](https://fr.wikipedia.org/wiki/Garry_Kasparov) alors [champion du monde](https://fr.wikipedia.org/wiki/Champion_du_monde_d%27%C3%A9checs) d'échecs, contre une machine [IBM](https://fr.wikipedia.org/wiki/IBM) conçue spécifiquement pour le jeu d'échecs. Ce succès marque le XXe siècle : le monde entier découvre la puissance du calcul spécialisé.

Pourtant, ce succès ne résout pas les échecs au sens théorique : une machine peut gagner des parties contre le meilleur joueur humain sans posséder une stratégie parfaite depuis la position initiale. Les programmeurs modernes, en France comme partout dans le monde, tirent bien plus du jeu qu'en 1997, sans abolir pour autant le socle de mathématiques sous-jacent.

![1997 : la machine d'IBM face à Kasparov, champion du monde](/images/echecs-ia-09-deepblue.svg)

## Modèles stratégiques et mathématiques : ce qu'apporte la science des jeux

La [théorie des jeux](https://fr.wikipedia.org/wiki/Th%C3%A9orie_des_jeux) relie les échecs, via les mathématiques, à toute une famille de modèles où des joueurs choisissent des actions en réaction aux autres. Le formalisme y croise l'économie, l'aide à la décision et le calcul automatisé.

Pour un joueur de club, l'intuition à retenir est simple : tu navigues dans un jeu où les règles ne comportent pas de tirage aléatoire, mais l'incertitude sur les choix adverses est réelle, une structure proche des duels étudiés par la science des jeux, même si le jeu garde sa saveur propre.

**Démonstrations.** La communauté a publié une quantité de travaux sur des sous-problèmes (finales, ouvertures, tables de positions), mais aucune preuve ne fixe l'issue du jeu parfait depuis la position initiale : l'espace des parties résiste à l'exploration exhaustive.

Les notions de [décidabilité](https://fr.wikipedia.org/wiki/D%C3%A9cidabilit%C3%A9) et de [complexité algorithmique](https://fr.wikipedia.org/wiki/Complexit%C3%A9_des_algorithmes) expliquent pourquoi "tout tester" n'est pas réaliste. Cette limite n'appauvrit pas le jeu : elle y mêle rigueur et intuition.

![Le cadre mathématique des échecs](/images/echecs-ia-10-theorie.svg)

## "Impossible" ne veut pas dire "inutilisable" : la leçon au-delà du plateau

Les échecs sont un excellent modèle mental pour des problèmes modernes, par exemple :

- la [sécurité informatique](https://fr.wikipedia.org/wiki/S%C3%A9curit%C3%A9_informatique) (attaque / défense) ;
- la stratégie (anticipation d'un adversaire) ;
- l'optimisation (où investir l'effort machine) ;
- la décision quand tu ne peux pas tout savoir d'un coup.

Le message le plus important n'est pas "l'IA est magique" : c'est que la puissance vient moins du fait de tout calculer que du fait de calculer ce qui compte.

À ton échelle de joueur, c'est la même leçon : tu ne peux pas tout voir ; tu peux apprendre à mieux choisir ce que tu regardes. L'échiquier amplifie ce que tu es : si tu cherches le contrôle partout, il te le renverra ; si tu acceptes de progresser sans te définir par un seul chiffre, tu pourras transformer chaque partie en terrain d'expérience.

## Une démonstration d'élagage que tu peux contrôler

**Arbre pédagogique fictif.** Les Blancs choisissent entre A et B. Après chaque choix, les Noirs peuvent choisir l'une de deux feuilles. Les valeurs, toujours du point de vue des Blancs, sont : A mène à 3 ou 5 ; B mène à 2 ou à une valeur encore inconnue.

Les Noirs minimisent le gain blanc. La valeur de A est donc min(3,5) = 3. En explorant B, tu découvres que les Noirs peuvent obtenir une feuille évaluée à 2. Quelle que soit l'autre feuille, le minimum de B ne dépassera pas 2. Puisque les Blancs disposent déjà de A à 3, B ne peut améliorer leur décision : tu peux laisser sa dernière feuille inexplorée.

Le résultat est le même que celui du minimax complet sur cet arbre, pour les mêmes valeurs de feuilles. C'est le sens précis de la coupure alpha-bêta, exposée dans le [chapitre de Russell et Norvig](https://aima.cs.berkeley.edu/4th-ed/pdfs/newchap06.pdf). Cela ne prouve pas que 3 corresponde à la vraie valeur d'une position d'échecs : les feuilles ont peut-être été évaluées avant la fin de la partie.

Tu peux vérifier le raisonnement en remplaçant la dernière feuille de B par 100, puis par -100. Dans le premier cas, B vaut min(2,100) = 2 ; dans le second, -100. Dans les deux cas, A reste préférable. La branche écartée était sans influence sur ce choix, pas nécessairement dépourvue de bons coups dans un autre contexte.

## Pourquoi une profondeur affichée ne constitue pas une preuve

Un moteur explore jusqu'à des limites et emploie des méthodes qui répartissent inégalement l'effort. Une valeur affichée dépend de son évaluation, de la recherche et de ses conventions. Lire « profondeur 30 » comme « toutes les suites de trente demi-coups ont été examinées » serait une mauvaise description d'une recherche sélective.

La question à poser est : quel résultat serait nécessaire pour prouver la proposition ? Montrer qu'un coup gagne demande de couvrir toutes les défenses adverses pertinentes. Montrer qu'un coup ne perd pas peut demander de fournir une réponse à chacune des tentatives de gain. Une variante spectaculaire ne suffit pas si une défense importante reste ignorée.

C'est aussi pourquoi les parties de machines, même très fortes, n'établissent pas à elles seules la valeur théorique de la position initiale. Elles montrent ce que les programmes ont effectivement choisi dans les conditions de la rencontre. Une solution mathématique doit porter sur les réponses qu'ils n'ont pas jouées aussi.

## Partie finie et problème de taille variable

Le jeu standard sur 64 cases constitue un objet fixé. Les résultats de complexité étudient généralement une famille d'instances dont la taille peut augmenter. Dire qu'une famille de jeux généralisés est difficile n'est pas donner le temps exact nécessaire pour résoudre une instance particulière de taille fixe.

Une autre distinction concerne la finitude. Si tu représentes seulement les pièces et le trait, certaines séquences peuvent revenir au même diagramme. Pour modéliser le jeu réglementaire complet, il faut intégrer les droits et l'historique nécessaires aux règles de fin. La répétition d'une configuration n'autorise pas à effacer ces informations.

Le nombre de Shannon illustre le problème d'une exploration naïve. L'article de [Shannon (1950)](https://d1yx3ys82bpsa0.cloudfront.net/chess/programming-a-computer-for-playing-chess.shannon.062303002.pdf) travaille avec des estimations et des choix de méthode. Ce nombre n'est pas une borne inférieure prouvant que toute démonstration imaginable devrait effectuer exactement autant d'opérations.

## Un test simple pour comprendre l'écart entre jouer et prouver

Imagine un petit jeu où A gagne contre neuf réponses et perd contre une dixième. Un programme qui rencontre rarement la dixième peut afficher un excellent score pratique. Pourtant A n'est pas une stratégie gagnante contre toute défense. Le nombre de victoires observées et l'existence d'une garantie répondent à deux questions différentes.

Aux échecs, tu peux reprendre ce principe dans ton analyse : lorsqu'une attaque semble gagner, cherche la réponse qui refuse ta combinaison. Tu n'as pas besoin de résoudre le jeu entier pour améliorer cette recherche. L'exigence est locale et réaliste : annoncer ce que la variante vérifie, quelle défense reste à examiner et à quel moment l'évaluation devient une estimation.

Le titre de cet article doit ainsi être lu comme une question sur les limites du calcul, pas comme un théorème d'impossibilité définitive. L'avantage actuel des moteurs montre qu'on peut prendre des décisions remarquables avec une connaissance partielle ; il ne dispense pas de distinguer cette réussite d'une preuve exhaustive.

## Ce que ça change pour toi, joueur

**À tester.** Si tu veux voir ce que fait un moteur sur une configuration, ouvre-la dans ton outil d'analyse (Stockfish, en local ou dans le navigateur) : profondeur, score et variantes en direct.

**Sur le blog.**
- [Les échecs rendent-ils meilleur en maths ?](/fr/blog/les-echecs-et-les-mathematiques/)
- [Psychologie du joueur d'échecs](/fr/blog/psychologie-du-joueur-d-echecs/)
- [Les échecs et le cerveau](/fr/blog/les-echecs-et-le-cerveau/)

L’exploration exhaustive naïve dépasse les ressources actuelles. La sélection, l’évaluation et l’élagage permettent pourtant de jouer à un très haut niveau avec un budget limité. Leur efficacité dépend de la position, des algorithmes et des ressources ; elle ne démontre ni une impossibilité mathématique de résoudre le jeu ni une équivalence avec le raisonnement humain.

**Pour aller plus loin :** [chessprogramming.org](https://www.chessprogramming.org/Main_Page), [ICGA](https://www.icga.org/), [arXiv](https://arxiv.org/).

**Après lecture :** ouvre ton outil d'analyse, repère le **premier coup** où ta variante et la ligne du moteur divergent de plus d'un demi-pion, puis rejoue **cette position seule** trois fois dans la journée (sans nouvelle partie).

---


## Sources

- Shannon, C. E. (1950), *Programming a Computer for Playing Chess*, Philosophical Magazine, 41, 256–275, [article original](https://d1yx3ys82bpsa0.cloudfront.net/chess/programming-a-computer-for-playing-chess.shannon.062303002.pdf), pour l’estimation combinatoire présentée plus haut.

- Fraenkel, A. S. et Lichtenstein, D. (1981), *Computing a Perfect Strategy for n×n Chess Requires Time Exponential in n*, Journal of Combinatorial Theory, série A, 31, 199–214, [texte des auteurs](https://kubokovac.eu/zlozitost/mat/chessExptime.pdf).
- Russell, S. et Norvig, P. (s. d.), *Adversarial Search*, chapitre de manuel, [texte](https://aima.cs.berkeley.edu/4th-ed/pdfs/newchap06.pdf), pour minimax, alpha-bêta et les limites de recherche présentées ici.
- Équipe Stockfish (2020), *Introducing NNUE Evaluation*, site officiel, [annonce](https://stockfishchess.org/blog/2020/introducing-nnue-evaluation/).
- IBM (s. d.), *Deep Blue*, archives de l'entreprise, [histoire du match de 1997](https://www.ibm.com/history/deep-blue).
