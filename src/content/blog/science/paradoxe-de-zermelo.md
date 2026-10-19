---
title: "Paradoxe de Zermelo : l'imperfection du jeu parfait"
excerpt: "Les échecs ont une vérité mathématique que personne ne connaît. Zermelo l'a démontré en 1913 : le résultat sous jeu parfait est déterminé d'avance. Mais cette certitude théorique cache un vertige pratique fascinant."
publishDate: "2026-05-07"
updatedDate: "2026-05-21"
category: "science"
featured: false
featuredRank: 99
readingTime: "13 min"
pillar: "Mathématiques"
tags: ["Zermelo", "échecs", "mathématiques", "théorie des jeux", "tablebases", "induction rétrograde", "König", "complexité", "logique"]
seoTitle: "Paradoxe de Zermelo aux échecs : vérité déterminée mais inaccessible"
seoDescription: "Ernst Zermelo (1913) a prouvé que les échecs ont un résultat sous jeu parfait : gain Blanc, gain Noir ou nulle. Pourquoi cette certitude reste hors d'atteinte."
faq:
  - question: "Le théorème de Zermelo prouve-t-il que les Blancs gagnent ?"
    answer: >-
      Non. Il prouve qu'<strong>une</strong> réponse existe parmi trois possibles : victoire Blancs, victoire
      Noirs, ou nulle. Il ne dit pas laquelle. La position initiale n’est pas résolue ; une évaluation de moteur n’est pas une preuve de sa valeur.
  - question: "Pourquoi appelle-t-on cela un \"paradoxe\" ?"
    answer: >-
      Au sens mathématique, ce n'en est pas un : c'est un résultat parfaitement cohérent. Le "paradoxe" est
      <strong>épistémique</strong> : on sait qu'il existe une réponse unique, mais sa valeur depuis la position initiale reste inconnue. Rares sont
      les propositions où la <em>certitude de l'existence</em> est aussi proprement séparée de la
      <em>possibilité de l'accès</em>.
  - question: "Les tablebases ne contredisent-elles pas Zermelo ?"
    answer: >-
      Au contraire, elles le <strong>confirment</strong> sur un sous-ensemble du problème. Sur les positions couvertes par une tablebase, le résultat est déterminé selon ses règles et ses métriques ; les exceptions comme les droits de roque doivent être prises en compte. Les tablebases sont la preuve constructive que la démonstration de Zermelo n'est pas vide :
      appliquée à un nombre fini accessible de positions, elle produit bien une vérité unique calculable.
  - question: "Pourquoi AlphaZero peut-il battre Stockfish s'il ne joue pas \"parfaitement\" ?"
    answer: >-
      Parce que ni l'un ni l'autre ne joue parfaitement au sens Zermelo. Tous deux sont des
      <strong>approximations</strong> de la stratégie optimale, simplement avec des architectures différentes
      (recherche + heuristiques pour Stockfish, réseau de neurones + Monte Carlo Tree Search pour AlphaZero).
      Un meilleur score dans un match n’est pas une mesure de distance à une stratégie optimale inconnue.
  - question: "Cette vérité mathématique pourrait-elle être un jour découverte ?"
    answer: >-
      La résolution exhaustive dépasse les moyens actuels. Cela ne démontre pas qu’aucune méthode future
      ne pourra résoudre le jeu. L’algorithme de Grover concerne la recherche non structurée : on ne peut
      pas simplement diviser par deux l’exposant de l’arbre minimax des échecs.

heroImage:
  src: /images/blog/paradoxe-de-zermelo-hero.webp
  alt: Un labyrinthe circulaire sombre traversé par un chemin bleu vers son centre
    vide.
ogImage: /images/og/paradoxe-de-zermelo-og.webp
---

En 1912, lors du cinquième Congrès International des Mathématiciens à Cambridge, le mathématicien allemand [Ernst Zermelo](https://fr.wikipedia.org/wiki/Ernst_Zermelo) a présenté un résultat qui allait changer la façon dont les mathématiciens, et plus tard les informaticiens, pensent aux jeux de stratégie. Son théorème est court. Sa démonstration est élégante. Et ses implications aux échecs sont à la fois rassurantes et vertigineuses.

## Ernst Zermelo et la théorie des ensembles

Avant de parler des échecs, il faut comprendre qui était Zermelo. Il est principalement connu pour ses contributions fondamentales à la théorie des ensembles, en particulier l'[axiome du choix](https://fr.wikipedia.org/wiki/Axiome_du_choix) et les [axiomes de Zermelo-Fraenkel](https://fr.wikipedia.org/wiki/Axiomes_de_Zermelo-Fraenkel) qui constituent encore aujourd'hui les fondements standard des mathématiques.

Son intérêt pour les échecs n'était pas anodin. Les mathématiciens de l'époque cherchaient à formaliser le raisonnement logique dans des systèmes aussi rigoureux que possible. Les jeux de stratégie parfaite représentaient un terrain idéal : des règles précises, un nombre fini d'états, pas de hasard. La question naturelle était : existe-t-il, en théorie, une façon "parfaite" de jouer ?

## Le théorème de Zermelo : énoncé et démonstration

Le théorème de Zermelo s'applique à une classe de jeux qui incluent les échecs : des jeux à deux joueurs qui s'affrontent directement (pas de coalition), à information parfaite (rien n'est caché), sans hasard, où les deux joueurs jouent alternativement, et qui se terminent toujours en un nombre fini de coups.

**Énoncé :** Dans tout jeu de ce type, l'une des trois situations suivantes est nécessairement vraie : le joueur 1 a une stratégie gagnante, ou le joueur 2 a une stratégie gagnante, ou les deux joueurs peuvent forcer le nul.

![Les trois issues déterminées par Zermelo : victoire forcée des Blancs, victoire forcée des Noirs, ou nulle forcée — la nulle étant l'hypothèse dominante non prouvée à ce jour.](/images/zermelo-01-trois-issues.svg)

Pour un arbre fini, tu peux comprendre ce résultat par **induction rétrograde**, comme dans [minimax](/fr/blog/minimax-aux-echecs/). Cette présentation pédagogique n’est pas la preuve originale de Zermelo : Schwalbe et Walker soulignent précisément que son texte de 1913 ne procède pas ainsi. Shannon publie son article en 1950, soit 37 ans plus tard, sans que cela établisse une reprise « telle quelle » de la preuve.

Imagine une fin de partie atteinte. Chaque position terminale est soit une victoire pour Blanc, soit une victoire pour Noir, soit une nulle. Maintenant, remontons d'un coup. Si c'est le tour de Blanc, il peut choisir parmi les positions terminales qui lui sont accessibles celle qui lui est la plus favorable. De même pour Noir. En remontant récursivement ainsi depuis toutes les positions terminales jusqu'à la position initiale, chaque position dans l'arbre du jeu reçoit une valeur définie : victoire Blanc, victoire Noir, ou nulle.

La valeur de la position initiale est donc déterminée. Le premier joueur à jouer a soit une stratégie pour forcer la victoire, soit les deux joueurs peuvent forcer le nul, soit le second joueur a une stratégie pour forcer la victoire.

![Induction rétrograde de Zermelo : l'arbre est parcouru de bas en haut, chaque nœud héritant de la valeur optimale selon le joueur au trait, jusqu'à ce que la racine reçoive sa valeur définitive.](/images/zermelo-02-backward-induction.svg)

### Une démonstration affinée après coup

Schwalbe et Walker distinguent le texte original de 1913 de ses formulations modernes. Zermelo admet des suites de coups infinies et s’intéresse notamment à la longueur nécessaire pour forcer un gain. König (1927) et Kalmár (1928/1929) prolongent cette analyse. Il faut donc séparer cette histoire de la démonstration élémentaire sur un arbre fini présentée ici.

Pour traiter les échecs modernes comme un jeu fini, il faut inclure les règles d’arrêt. La triple répétition et les 50 coups ouvrent un droit à réclamer la nulle ; les règles automatiques de quintuple répétition et des 75 coups jouent un rôle distinct, comme le rappelle le manuel FIDE des arbitres.

### Pourquoi c'est paradoxal

Le paradoxe de Zermelo n'est pas logique. C'est un paradoxe pratique. Le théorème te garantit que la réponse existe et est unique. Mais il ne te dit pas laquelle c'est. Et surtout, il ne te dit pas comment la trouver.

Une exploration exhaustive naïve envisagerait un nombre considérable de suites. Shannon propose l'ordre de grandeur $10^{120}$ sous ses hypothèses : il ne s'agit pas d'un dénombrement exact de toutes les parties légales.

À titre de calcul hypothétique, examiner $10^{120}$ éléments à raison de $10^{20}$ par seconde demanderait $10^{100}$ secondes. Cela illustre un coût sous des hypothèses données ; ce n'est pas une preuve qu'aucune autre méthode ne pourrait établir la valeur du jeu. L'article sur [les limites du calcul aux échecs](/fr/blog/pourquoi-echecs-probleme-mathematique-impossible-et-ia/) développe cette distinction.

## La vérité inconnue des échecs

La grande question que le théorème de Zermelo laisse en suspens est : quelle est la valeur des échecs sous jeu parfait ? (Le théorème lui-même est l'un des cinq concepts fondateurs de la [théorie des jeux appliquée aux échecs](/fr/blog/theorie-des-jeux-aux-echecs/).)

La majorité des grands maîtres et des théoriciens pensent que la réponse est le nul. L'argument empirique est fort : au plus haut niveau de jeu, les nulles sont très fréquentes, et la position initiale est considérée comme légèrement favorable aux Blancs (qui ont le premier mouvement) mais pas suffisamment pour forcer la victoire contre une défense optimale.

Mais ce n'est qu'une intuition basée sur l'observation du jeu humain. Ce n'est pas une preuve. Il est mathématiquement possible que Blanc ait une victoire forcée cachée dans des profondeurs que nul humain n'a jamais explorées. C'est improbable selon les experts, mais non démontré comme impossible.

Quelques travaux récents en informatique tentent d'aborder la question de façon asymptotique. [Komodo](https://fr.wikipedia.org/wiki/Komodo_(moteur_d%27%C3%A9checs)), [Stockfish](https://fr.wikipedia.org/wiki/Stockfish_(moteur_d%27%C3%A9checs)) et leurs successeurs évaluent la position initiale comme légèrement favorable aux Blancs (de l'ordre de +0,2 à +0,3 pion d'avantage), mais cette évaluation est elle-même basée sur des fonctions heuristiques, pas sur un calcul exhaustif.

## Les fins de parties résolues : une fenêtre sur la vérité

Si la position initiale des échecs reste non résolue, il existe un domaine où la résolution complète a été accomplie : les fins de parties avec peu de pièces.

Les [bases de données de fins de partie](https://fr.wikipedia.org/wiki/Base_de_donn%C3%A9es_d%27%C3%A9checs) (tablebases) développées par Ken Thompson puis Marc Bourzutschky et d'autres ont résolu toutes les fins de partie jusqu'à sept pièces sur l'échiquier. Ce travail monumental a révélé des résultats surprenants.

Les tablebases montrent surtout pourquoi il faut préciser les règles et la métrique. La documentation de Ronald de Man présente, par exemple, une finale avec une valeur DTZ50 de 164 demi-coups et une « victoire maudite » : gagnante sans la limite des 50 coups, elle ne l’est pas forcément avec cette règle.

### DTM et DTZ : deux distances différentes

DTM mesure la distance au mat ; DTZ la distance à une prise ou à un mouvement de pion qui remet le compteur à zéro. Les optimiser peut conduire à choisir des coups différents. Cela ne crée pas deux vérités contradictoires : on pose deux questions distinctes, et il faut préciser si la règle des 50 coups est prise en compte. Les tables Syzygy usuelles fournissent WDL et DTZ, pas une distance DTM universelle.

![Deux distances à distinguer dans une tablebase : distance au mat et distance à une remise à zéro du compteur, avec prise en compte explicite des règles.](/images/zermelo-04-dtm-dtz.svg)

## L'imperfection structurelle du joueur humain

Le paradoxe de Zermelo révèle quelque chose de fondamental sur la condition du joueur humain. Il joue un jeu dont la "perfection" est mathématiquement définie, mais encore inconnue depuis la position initiale.

Un joueur humain, même le meilleur du monde, joue une approximation de la stratégie optimale. Son niveau de jeu est déterminé par la qualité de cette approximation : à quelle profondeur il peut calculer, combien de patterns tactiques il reconnaît, à quel point son évaluation positionnelle est fidèle à la réalité.

Les performances de joueurs et de moteurs peuvent être comparées dans des parties. Elles ne donnent pas une distance mesurée à la stratégie parfaite, puisque celle-ci reste inconnue dans l'ensemble du jeu. Certaines positions couvertes par des tablebases permettent en revanche de vérifier une décision selon leurs règles.

## Le jeu parfait n'est pas le jeu idéal

Une autre dimension du paradoxe de Zermelo est philosophique. Même si la stratégie parfaite était écrite noir sur blanc, la jouerais-tu vraiment ?

Imagine que Blanc ait une victoire forcée en 80 coups depuis la position initiale. Jouer cette victoire forcée signifierait que toute partie serait, en réalité, déjà terminée au coup 1. L'adversaire pourrait jouer n'importe quoi, le résultat serait le même. Cela changerait l'enjeu théorique. La pratique humaine pourrait pourtant subsister : connaître l'existence d'une stratégie et savoir l'appliquer dans chaque position sont deux choses différentes.

Le fait que les échecs soient si complexes qu'aucune stratégie parfaite n'est connue est précisément ce qui les rend vivants. L'imperfection des joueurs humains est la condition nécessaire à l'existence du jeu en tant que discipline artistique et sportive.

Ce paradoxe est profond : la beauté et la richesse des échecs reposent sur l'ignorance collective de leur vérité mathématique. Si tout le monde savait tout d'avance, le jeu mourrait. Le mystère est son carburant.

## Zermelo et la hiérarchie des jeux résolus

La communauté informatique a progressivement résolu des jeux plus complexes les uns après les autres, suivant la logique de Zermelo.

Le [morpion](https://fr.wikipedia.org/wiki/Morpion) est nul sous jeu parfait, et cette vérité est accessible à n'importe quel enfant qui apprend la stratégie correcte. Le [Puissance 4](https://fr.wikipedia.org/wiki/Puissance_4) a été résolu en 1988 : victoire du premier joueur. Les dames anglaises sur 8×8 (*checkers*) ont été résolues en 2007 par [Jonathan Schaeffer](https://fr.wikipedia.org/wiki/Jonathan_Schaeffer) : nul sous jeu parfait, après 18 ans de calcul dans un jeu comptant environ $5 \times 10^{20}$ positions possibles ; toutes n’ont pas été parcourues individuellement.

![Hiérarchie des jeux résolus selon la logique de Zermelo : du morpion (trivial) au Puissance 4 (1988), aux dames (2007), jusqu'aux échecs et au Go qui restent ouverts bien que leur solution soit garantie d'exister.](/images/zermelo-03-jeux-resolus.svg)

Les [échecs](https://fr.wikipedia.org/wiki/%C3%89checs) restent ouverts. Le [Go](https://fr.wikipedia.org/wiki/Go_(jeu)) aussi. La résolution complète de ces jeux reste hors de portée, non pas en principe (Zermelo garantit qu'une réponse existe), mais en pratique (la complexité combinatoire est trop élevée).

## Ce que Zermelo change pour toi à l'échiquier

Savoir que les échecs ont une vérité mathématique inaccessible change-t-il quelque chose pour le joueur pratique ? Pas directement sur l'échiquier. Mais cela change la façon de penser au jeu.

Chaque coup que tu joues est une approximation. Chaque évaluation de position que tu fais est une estimation. Chaque plan que tu construis est une heuristique. Il n'y a pas de certitude, même pour le Grand Maître le plus solide. Il y a des approximations plus ou moins fines de la vérité.

Cette humilité mathématique est saine. Elle signifie que même face à un adversaire bien plus fort que toi, la vérité de la position n'est pas connue de lui. Il joue, lui aussi, une approximation. Sa pendule tourne. Ses ressources cognitives sont limitées. Dans les complications qu'il ne connaît pas, sa vérité pratique peut s'éloigner significativement de la vérité théorique.

Le génie de Zermelo n'est pas d'avoir résolu les échecs. C'est d'avoir prouvé que la solution existe, de façon définitive, sans pouvoir la trouver. Un exemple rare où la certitude de l'existence est séparée de la possibilité de l'accès.

**Après lecture :** garde en tête une **phrase d'humilité mathématique** en partie longue : tu joues des approximations, pas la vérité de tablebase ; ça peut lever du perfectionnisme au mauvais moment.

---

## Questions fréquentes

### Le théorème de Zermelo prouve-t-il que les Blancs gagnent ?

Non. Il prouve qu'**une** réponse existe parmi trois possibles : victoire Blancs, victoire Noirs, ou nulle. Il ne dit pas laquelle. La position initiale n’est pas résolue ; une évaluation de moteur n’est pas une preuve de sa valeur.

### Pourquoi appelle-t-on cela un "paradoxe" ?

Au sens mathématique, ce n'en est pas un : c'est un résultat parfaitement cohérent. Le "paradoxe" est **épistémique** : on sait qu'il existe une réponse unique, mais on ne peut pas la connaître ni en pratique ni dans aucune extrapolation raisonnable des capacités de calcul. Rares sont les propositions où la *certitude de l'existence* est aussi proprement séparée de la *possibilité de l'accès*.

### Les tablebases ne contredisent-elles pas Zermelo ?

Au contraire, elles le **confirment** sur un sous-ensemble du problème. Sur les positions couvertes par une tablebase, le résultat est déterminé selon ses règles et ses métriques ; les exceptions comme les droits de roque doivent être prises en compte. Les tablebases sont la preuve constructive que la démonstration de Zermelo n'est pas vide : appliquée à un nombre fini accessible de positions, elle produit bien une vérité unique calculable.

### Pourquoi AlphaZero peut-il battre Stockfish s'il ne joue pas "parfaitement" ?

Parce que ni l'un ni l'autre ne joue parfaitement au sens Zermelo. Tous deux sont des **approximations** de la stratégie optimale, simplement avec des architectures différentes (recherche + heuristiques pour Stockfish, réseau de neurones + Monte Carlo Tree Search pour AlphaZero). Un meilleur score dans un match n’est pas une mesure de distance à une stratégie optimale inconnue.

### Cette vérité mathématique pourrait-elle être un jour découverte ?

La résolution exhaustive dépasse les moyens actuels. Cela ne démontre pas qu’aucune méthode future ne pourra résoudre le jeu. Invoquer Grover pour remplacer directement $10^{120}$ par $10^{60}$ est injustifié : un arbre adversarial n’est pas une simple liste de solutions à rechercher.

## Sources

- Zermelo, E. (1913). *Über eine Anwendung der Mengenlehre auf die Theorie des Schachspiels*. Actes du cinquième Congrès international des mathématiciens, vol. II, 501–504. [Traduction en annexe du texte de Schwalbe et Walker](https://studylib.net/doc/28166551/zermelo-work).
- Schwalbe, U., & Walker, P. (1999, version révisée du document de travail de 1997). *Zermelo and the Early History of Game Theory*. University of Mannheim / University of Canterbury. [Texte intégral consulté](https://studylib.net/doc/28166551/zermelo-work) : différence entre preuve originale et présentation moderne.
- Shannon, C. E. (1950). *Programming a Computer for Playing Chess*. Philosophical Magazine, 41, 256–275. [Article original](https://www.computerhistory.org/chess/doc-431614f453dde/).
- De Man, R. (sans date). *Probetool*. GitHub. [Documentation des tables Syzygy](https://github.com/syzygy1/probetool) : WDL, DTZ50 et exemple de victoire maudite.
- FIDE (2022). *Arbiters’ Manual*. [Manuel, règles des nulles](https://arbiters.fide.com/wp-content/uploads/Publications/Manual/ARBManual2022_1st_October.pdf).
- Allis, V. (1988). *A Knowledge-based Approach of Connect-Four*. Vrije Universiteit Amsterdam. [Mémoire](https://tromp.github.io/c4/connect4_thesis.pdf) : exemple du Puissance 4 cité dans le corps.

- Schaeffer, J., et al. (2007). *Checkers Is Solved*. Science, 317, 1518–1522. [Article intégral](https://www.cs.cornell.edu/courses/cs6700/2013sp/readings/06-b-Checkers-Solved-Science-2007.pdf).
