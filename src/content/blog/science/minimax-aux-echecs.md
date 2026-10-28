---
title: "Minimax aux échecs : comment les moteurs explorent les réponses adverses"
excerpt: "Minimax, alpha-bêta, transpositions et évaluation : suis des calculs vérifiables, comprends les garanties des algorithmes et distingue recherche informatique et réflexion humaine."
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

Minimax formalise un choix dans lequel chaque joueur anticipe la meilleure réponse adverse selon le même critère d'évaluation. L'algorithme fait remonter les valeurs d'un arbre : un joueur maximise le score, l'autre le minimise.

Ce principe fournit une base pour comprendre la recherche dans un programme d'échecs. Il faut toutefois distinguer le résultat sur un arbre entièrement exploré et celui d'une recherche interrompue à une profondeur donnée, où les feuilles doivent être évaluées. Minimax peut aussi servir d'analogie pour organiser ton calcul, sans décrire à lui seul le fonctionnement démontré du cerveau.

Le cadre général est présenté dans [la théorie des jeux aux échecs](/fr/blog/theorie-des-jeux-aux-echecs/) ; la question de l'existence d'une valeur théorique est développée dans [le paradoxe de Zermelo](/fr/blog/paradoxe-de-zermelo/).

## L'intuition derrière minimax

Imagine que tu joues les Blancs et que tu veux choisir le meilleur coup possible. Comment le définir ? Le meilleur coup est celui qui, en supposant que ton adversaire joue aussi parfaitement, te donne le meilleur résultat final.

Cette définition récursive est l'essence de minimax. Blanc veut maximiser le résultat (du point de vue des Blancs). Noir veut minimiser le résultat (du point de vue des Blancs, ou symétriquement maximiser du sien). Les deux joueurs alternent, et à chaque niveau de l'arbre, c'est l'un ou l'autre qui joue.

La formalisation mathématique est directe :

$$\text{minimax}(p, d) = \begin{cases} \text{évaluation}(p) & \text{si } d = 0 \text{ ou } p \text{ est terminal} \\ \max_{c \in C(p)} \text{minimax}(\text{succ}(p,c), d-1) & \text{si c'est le tour de Blanc} \\ \min_{c \in C(p)} \text{minimax}(\text{succ}(p,c), d-1) & \text{si c'est le tour de Noir} \end{cases}$$

Où $p$ est la position courante, $d$ est la profondeur de recherche restante, $C(p)$ est l'ensemble des coups légaux en $p$, et $\text{succ}(p,c)$ est la position résultant du coup $c$ en $p$.

## La fonction d'évaluation : le coeur du moteur

Minimax pur résoudrait les échecs parfaitement si tu pouvais explorer l'arbre complet jusqu'aux positions terminales. Avec les moyens actuels, une telle exploration complète n'est pas réalisable en raison de la complexité combinatoire (l’ordre de grandeur de Shannon illustre l’explosion des suites de coups, pas un dénombrement exact des feuilles). Il faut arrêter la recherche à une profondeur finie et évaluer les positions non-terminales avec une **fonction d'évaluation heuristique**.

Une évaluation classique combine des caractéristiques telles que le matériel, la mobilité, la sécurité des rois et la structure de pions. Ces repères aident à lire une position ; ils ne constituent pas des valeurs absolues indépendantes du contexte.

Stockfish a intégré l’évaluation neuronale NNUE en 2020. Il faut distinguer cette architecture des anciennes sommes de critères écrits à la main. Dans la récurrence présentée, « évaluation » doit retourner l’utilité exacte d’une issue terminale et une estimation pour une position simplement coupée à profondeur zéro.

## L'élagage alpha-bêta : l'intelligence de l'abandon

L'algorithme minimax brut est d'une inefficacité spectaculaire. Pour une profondeur de recherche de $d$ demi-coups et un facteur de branchement de $b$ (nombre moyen de coups légaux), le nombre de feuilles est de l’ordre de $b^d$ dans le modèle uniforme. À $b = 35$ et $d = 10$, c'est $35^{10} \approx 2{,}8 \times 10^{15}$ positions. Impossible en pratique.

L'[élagage alpha-bêta](https://fr.wikipedia.org/wiki/%C3%89lagage_alpha-b%C3%AAta), présenté dans le chapitre de Russell et Norvig, réduit le coût en élaguant les branches qui ne peuvent pas influencer la décision finale.

Le principe est le suivant : si tu as déjà trouvé une option pour Blanc qui garantit un résultat de valeur $\alpha$, et que tu explores une branche où Noir peut forcer un résultat inférieur à $\alpha$ pour Blanc, cette branche peut être abandonnée. Blanc ne la choisira jamais, car il a déjà mieux.

Formellement, tu maintiens deux bornes (dans le pseudo-code ou sur le tableau) :
- $\alpha$ : la meilleure valeur déjà garantie pour le joueur maximisant (Blanc)
- $\beta$ : la meilleure valeur déjà garantie pour le joueur minimisant (Noir)

Quand $\alpha \geq \beta$, la branche courante est élagée : elle ne peut pas produire un résultat meilleur que ce qui est déjà connu.

Dans le cas optimal (si les meilleurs coups pour le camp au trait sont examinés en premier), alpha-bêta ramène l’ordre de grandeur vers $O(b^{d/2})$. Il ne s’agit pas d’une égalité donnant le nombre exact de nœuds d’une position réelle.

![Arbre minimax à trois niveaux avec élagage alpha-bêta : les branches grisées sont abandonnées car alpha vaut déjà 3, rendant inutile l'exploration de toute branche où MIN peut forcer moins de 3.](/images/minimax-01-alpha-beta.svg)

### Negamax : la simplification qui change le code

Negamax exploite l’identité $\min(a,b)=-\max(-a,-b)$ en évaluant la position du point de vue du joueur au trait. Le signe change lors d’un changement de camp. C’est une reformulation possible de minimax, pas une description de tous les moteurs ni une garantie de code plus court d’un nombre précis de lignes.

### Null-move pruning : faire passer son tour pour gagner du temps

Une heuristique puissante : et si tu **passes ton tour** ? Si la position reste bonne pour toi malgré ce coup gratuit donné à l'adversaire, alors elle est probablement *très* bonne pour toi, et tu peux élaguer profondément le reste de l'analyse. C'est le **null-move pruning**, technique standard depuis les années 1990. Aux échecs, l'astuce a une limite connue (le *zugzwang* : situation où tout coup empire la position, typique des finales de pions), donc les implémentations ajoutent des conditions et des vérifications pour limiter ce risque. Un gain de vitesse universel de deux à quatre n’est pas établi ici.

![Null-move pruning : si la position reste positive après un coup nul (passer son tour), le moteur élague profondément l'arbre ; avec la limite du zugzwang, que les implémentations cherchent à traiter par des conditions et vérifications.](/images/minimax-03-null-move.svg)

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

## AlphaZero : une autre architecture de recherche

En 2017, [DeepMind](https://fr.wikipedia.org/wiki/Google_DeepMind) a publié les résultats d'[AlphaZero](https://fr.wikipedia.org/wiki/AlphaZero), un programme qui a appris à jouer aux échecs par auto-jeu en quelques heures et battu Stockfish de façon convaincante.

AlphaZero emploie une [recherche arborescente Monte-Carlo](https://fr.wikipedia.org/wiki/Recherche_arborescente_Monte-Carlo) (MCTS), guidée par un réseau qui propose des probabilités de coups et une estimation de la valeur. La sélection des branches répartit les visites selon ces estimations et l'exploration, sans se confondre avec un parcours minimax exhaustif.

On peut analyser des sacrifices et l'activité des pièces dans les parties publiées, mais ces descriptions stylistiques n'établissent pas une intuition humaine dans le programme. La force du résultat doit se lire avec les conditions du match, le matériel et les versions comparées.

AlphaZero associe apprentissage par renforcement et recherche MCTS, une autre architecture que la recherche alpha-bêta classique. Son score dans un match ne mesure pas une « compréhension plus profonde » ni une distance à la stratégie optimale. Les protocoles sont présentés dans [AlphaZero et Stockfish](/fr/blog/echecs-alphazero-stockfish/), les coûts de recherche dans [les limites du calcul](/fr/blog/pourquoi-echecs-probleme-mathematique-impossible-et-ia/) et les limites de l’analogie du chaos dans [la théorie du chaos aux échecs](/fr/blog/theorie-du-chaos-aux-echecs/).

## Minimax comme outil pour ton calcul

Quand tu penses « si je joue là, quelle est sa meilleure réponse ? », tu peux utiliser minimax comme grille de lecture. Cela ne démontre pas que ton cerveau exécute cette procédure et ne permet pas d’attribuer 3–8 ou 7–10 niveaux à une catégorie de joueurs.

Sur une position d’entraînement, choisis deux coups candidats et examine une réponse adverse à chacun. Puis cherche une défense que tu n’avais pas envisagée. L’objectif est d’améliorer la vérification, pas de reproduire une mesure de profondeur humaine.

![Même problème, deux démarches : un algorithme défini sur un arbre et un raisonnement humain dont les limites varient.](/images/minimax-02-profondeur-humain-moteur.svg)

## Un calcul alpha-bêta entièrement vérifiable

Construisons un **arbre fictif** où les Blancs choisissent A, B ou C, puis les Noirs répondent. Les valeurs sont des unités d'évaluation choisies pour l'exercice, pas des résultats d'une partie historique.

| Coup blanc | Valeurs possibles après les réponses noires | Valeur retenue par MIN |
|---|---|---:|
| A | 5 ; 2 ; 4 | 2 |
| B | 1 ; 8 ; 9 | 1 |
| C | 3 ; 6 ; 4 | 3 |

Minimax choisit C, car $\max(2,1,3)=3$. Il ne choisit pas B malgré la feuille à 9 : les Noirs peuvent imposer 1. Ces calculs ne demandent aucune intuition sur le style d'un moteur.

Examine les branches dans l'ordre A, B, C. Après A, les Blancs disposent d'une option de valeur 2. Dans B, la première réponse noire vaut 1. Comme les Noirs peuvent déjà limiter cette branche à 1 ou moins, les feuilles 8 et 9 n'ont plus besoin d'être lues pour choisir à la racine : B ne dépassera pas A. La branche C doit encore être examinée, car sa première valeur 3 laisse ouverte une option meilleure.

Inverse maintenant l'ordre des réponses noires dans B et lis 9, puis 8, puis 1. Tu devras aller jusqu'à la troisième feuille pour trouver la borne utile. La valeur finale reste identique, mais le coût change. L'ordre des coups améliore donc l'efficacité d'alpha-bêta sans modifier la question mathématique.

## Une transposition demande un état correctement défini

Un même placement de pièces peut apparaître après des ordres différents. Par exemple, 1.Cf3 d5 2.d4 et 1.d4 d5 2.Cf3 conduisent au même placement et au même camp au trait. Cet exemple simple explique l'intérêt de réutiliser une analyse plutôt que de refaire tout le sous-arbre.

Mais un cache naïf fondé uniquement sur les cases occupées serait insuffisant. Les droits de roque, la possibilité d'une prise en passant et les informations nécessaires aux règles de nulle peuvent changer la suite légale ou son résultat. Il faut aussi connaître la profondeur de la recherche et le type de valeur enregistré : exacte pour la recherche effectuée, borne inférieure ou borne supérieure.

Pourquoi une borne ? Après une coupure, on peut savoir qu'une branche vaut au plus 1 sans avoir calculé sa valeur exacte. Remplacer « au plus 1 » par « exactement 1 » dans toutes les recherches ultérieures serait une erreur de programmation. Les tables réelles doivent préserver le sens de l'information qu'elles réemploient.

## L'effet d'horizon ne disparaît pas avec une belle évaluation

Imagine un **cas pédagogique fictif** : une capture gagne une tour à la profondeur où la recherche s'arrête, mais la reprise adverse, juste au-delà, perd la dame. Si la feuille tronquée est évaluée avant cette reprise, elle donne une image trompeuse du gain matériel. Prolonger certaines suites tactiques permet de réduire ce problème.

Cela explique le rôle d'une recherche de quiescence, sans lui donner un pouvoir universel. Il faut choisir quels coups poursuivre, traiter les échecs et éviter une explosion nouvelle de l'arbre. Toutes les erreurs d'évaluation ne sont pas des échanges inachevés. Une faiblesse positionnelle ou un plan à longue portée peut aussi rester hors de l'horizon utile.

Le [code officiel de Stockfish](https://github.com/official-stockfish/Stockfish/blob/master/src/search.cpp) distingue plusieurs mécanismes de recherche. Lire un fichier de moteur permet de voir une architecture concrète ; cela ne transforme pas toutes ses heuristiques en théorèmes d'exactitude. Les paramètres et les implémentations évoluent avec les versions.

## Trois niveaux de garantie à ne pas mélanger

Le premier niveau est **le jeu résolu jusqu'aux issues terminales** : la valeur correspond aux règles et aux résultats exacts de cet arbre complet. Le deuxième est **l'arbre tronqué avec une évaluation définie** : alpha-bêta exact retrouve la même valeur que minimax pour cet arbre, même si l'évaluation n'est pas la vérité échiquéenne. Le troisième est **la recherche sélective pratique**, qui gagne du temps en concentrant ou réduisant l'effort selon des heuristiques.

Cette distinction explique comment un moteur peut être extraordinairement fort sans prouver chaque évaluation affichée. Elle explique aussi pourquoi deux profondeurs, deux versions ou deux ressources de calcul peuvent modifier le choix. Une valeur affichée constitue une information d'analyse à interpréter avec son contexte de recherche.

Pour t'entraîner, compare deux candidats dans une de tes parties et précise le statut de ta conclusion : mat démontré, gain matériel après une ligne vérifiée, ou préférence de position. Tu ne reproduis pas Stockfish ; tu apprends à dire exactement ce que ton calcul établit.

## Sources

- Russell, S., & Norvig, P. (s. d., chapitre en ligne). *Adversarial Search*. Artificial Intelligence: A Modern Approach. [Chapitre](https://aima.cs.berkeley.edu/4th-ed/pdfs/newchap06.pdf).
- Équipe Stockfish (s. d.). *search.cpp*. Dépôt officiel Stockfish. [Code](https://github.com/official-stockfish/Stockfish/blob/master/src/search.cpp).
- Équipe Stockfish (2020). *Introducing NNUE Evaluation*. [Annonce](https://stockfishchess.org/blog/2020/introducing-nnue-evaluation/).
- Silver, D., et al. (2017). *Mastering Chess and Shogi by Self-Play with a General Reinforcement Learning Algorithm*. arXiv. [Article](https://arxiv.org/html/1712.01815v1).
