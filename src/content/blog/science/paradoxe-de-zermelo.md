---
title: "Paradoxe de Zermelo : l'imperfection du jeu parfait"
excerpt: "Depuis la position initiale, la valeur des échecs sous jeu parfait reste inconnue. La détermination du jeu, la preuve historique de Zermelo et les tablebases permettent de distinguer existence d’une réponse, calcul et performance pratique."
publishDate: "2026-05-07"
updatedDate: "2026-05-21"
category: "science"
featured: false
featuredRank: 99
readingTime: "13 min"
pillar: "Mathématiques"
tags: ["Zermelo", "échecs", "mathématiques", "théorie des jeux", "tablebases", "induction rétrograde", "König", "complexité", "logique"]
seoTitle: "Zermelo et échecs : valeur théorique et résultat encore inconnu"
seoDescription: "Détermination du résultat sous jeu parfait, règles de fin et tablebases : ce que le cadre de Zermelo garantit, sans prétendre connaître la valeur du jeu initial."
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
      Aucun des deux n’a démontré une stratégie parfaite depuis la position initiale. Dans le match de 2017,
      Stockfish 8 associe recherche alpha-bêta et évaluation conçue à la main ; AlphaZero associe réseau appris
      et Monte Carlo Tree Search.
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

Avant de parler des échecs, il faut comprendre qui était Zermelo. Il est principalement connu pour ses contributions fondamentales à la théorie des ensembles, en particulier l'[axiome du choix](https://fr.wikipedia.org/wiki/Axiome_du_choix) et les axiomes de Zermelo-Fraenkel qui constituent encore aujourd'hui les fondements standard des mathématiques.

Son intérêt pour les échecs n'était pas anodin. Les mathématiciens de l'époque cherchaient à formaliser le raisonnement logique dans des systèmes aussi rigoureux que possible. Les jeux de stratégie parfaite représentaient un terrain idéal : des règles précises, un nombre fini d'états, pas de hasard. La question naturelle était : existe-t-il, en théorie, une façon "parfaite" de jouer ?

## Le théorème de Zermelo : énoncé et démonstration

Le théorème de Zermelo s'applique à une classe de jeux qui incluent les échecs : des jeux à deux joueurs qui s'affrontent directement (pas de coalition), à information parfaite (rien n'est caché), sans hasard, où les deux joueurs jouent alternativement, et qui se terminent toujours en un nombre fini de coups.

**Énoncé moderne dans ce cadre fini :** l’un des deux joueurs peut forcer un gain, ou chacun dispose d’une stratégie garantissant au moins la nulle. Dans ce dernier cas, leur opposition optimale conduit au nul. Cet énoncé doit être distingué du contenu exact du texte historique de Zermelo, discuté plus bas.

![Trois valeurs possibles sous jeu parfait, sans solution connue depuis la position initiale](/images/zermelo-01-trois-issues.svg)

Pour un arbre fini, tu peux comprendre ce résultat par **induction rétrograde**, comme dans [minimax](/fr/blog/minimax-aux-echecs/). Cette présentation pédagogique n’est pas la preuve originale de Zermelo : Schwalbe et Walker soulignent précisément que son texte de 1913 ne procède pas ainsi. Shannon publie son article en 1950, soit 37 ans plus tard, sans que cela établisse une reprise « telle quelle » de la preuve.

Imagine une fin de partie atteinte. Chaque position terminale est soit une victoire pour Blanc, soit une victoire pour Noir, soit une nulle. Maintenant, remontons d'un coup. Si c'est le tour de Blanc, il peut choisir parmi les positions terminales qui lui sont accessibles celle qui lui est la plus favorable. De même pour Noir. En remontant récursivement ainsi depuis toutes les positions terminales jusqu'à la position initiale, chaque position dans l'arbre du jeu reçoit une valeur définie : victoire Blanc, victoire Noir, ou nulle.

La valeur de la position initiale est donc déterminée. Le premier joueur à jouer a soit une stratégie pour forcer la victoire, soit les deux joueurs peuvent forcer le nul, soit le second joueur a une stratégie pour forcer la victoire.

![Exemple moderne d’induction rétrograde dans un arbre fictif](/images/zermelo-02-backward-induction.svg)

### Une démonstration affinée après coup

Schwalbe et Walker distinguent le texte original de 1913 de ses formulations modernes. Zermelo admet des suites de coups infinies et s’intéresse notamment à la longueur nécessaire pour forcer un gain. König (1927) et Kalmár (1928/1929) prolongent cette analyse. Il faut donc séparer cette histoire de la démonstration élémentaire sur un arbre fini présentée ici.

Pour traiter les échecs modernes comme un jeu fini, il faut inclure les règles d’arrêt. La triple répétition et les 50 coups ouvrent un droit à réclamer la nulle ; les règles automatiques de quintuple répétition et des 75 coups jouent un rôle distinct, comme le rappelle le manuel FIDE des arbitres.

### Pourquoi c'est paradoxal

Le paradoxe de Zermelo n'est pas logique. C'est un paradoxe pratique. Le théorème te garantit que la réponse existe et est unique. Mais il ne te dit pas laquelle c'est. Et surtout, il ne te dit pas comment la trouver.

Une exploration exhaustive naïve envisagerait un nombre considérable de suites. Shannon propose l'ordre de grandeur $10^{120}$ sous ses hypothèses : il ne s'agit pas d'un dénombrement exact de toutes les parties légales.

À titre de calcul hypothétique, examiner $10^{120}$ éléments à raison de $10^{20}$ par seconde demanderait $10^{100}$ secondes. Cela illustre un coût sous des hypothèses données ; ce n'est pas une preuve qu'aucune autre méthode ne pourrait établir la valeur du jeu. L'article sur [les limites du calcul aux échecs](/fr/blog/pourquoi-echecs-probleme-mathematique-impossible-et-ia/) développe cette distinction.

## La vérité inconnue des échecs

La grande question que le théorème de Zermelo laisse en suspens est : quelle est la valeur des échecs sous jeu parfait ? (Le théorème lui-même est l'un des cinq concepts fondateurs de la [théorie des jeux appliquée aux échecs](/fr/blog/theorie-des-jeux-aux-echecs/).)

On peut conjecturer une nulle, mais ni la fréquence des nulles entre joueurs forts ni une évaluation de moteur ne constituent une preuve. Ces observations portent sur des adversaires et des budgets de calcul particuliers, pas sur toutes les réponses possibles à une stratégie.

Une évaluation de Stockfish dépend de sa version, de la profondeur et du temps accordé. Un petit avantage numérique ne signifie ni victoire forcée ni distance mesurée à la solution parfaite. Le théorème laisse ouvertes les trois valeurs possibles depuis la position initiale.

## Les fins de parties résolues : une fenêtre sur la vérité

Si la position initiale des échecs reste non résolue, il existe un domaine où la résolution complète a été accomplie : les fins de parties avec peu de pièces.

Les bases de données de fins de partie (tablebases) développées par Ken Thompson puis Marc Bourzutschky et d'autres permettent de traiter de vastes ensembles de finales, notamment des positions à sept pièces. La couverture et la signification d’un résultat dépendent du jeu de tables : les droits de roque et la règle des 50 coups, par exemple, demandent une attention particulière.

Les tablebases montrent surtout pourquoi il faut préciser les règles et la métrique. La documentation de Ronald de Man présente, par exemple, une finale avec une valeur DTZ50 de 164 demi-coups et une « victoire maudite » : gagnante sans la limite des 50 coups, elle ne l’est pas forcément avec cette règle.

### DTM et DTZ : deux distances différentes

DTM mesure la distance au mat ; DTZ la distance à une prise ou à un mouvement de pion qui remet le compteur à zéro. Les optimiser peut conduire à choisir des coups différents. Cela ne crée pas deux vérités contradictoires : on pose deux questions distinctes, et il faut préciser si la règle des 50 coups est prise en compte. Les tables Syzygy usuelles fournissent WDL et DTZ, pas une distance DTM universelle.

![Deux distances à distinguer dans une tablebase : distance au mat et distance à une remise à zéro du compteur, avec prise en compte explicite des règles.](/images/zermelo-04-dtm-dtz.svg)

## L'imperfection structurelle du joueur humain

Le paradoxe de Zermelo révèle quelque chose de fondamental sur la condition du joueur humain. Il joue un jeu dont la "perfection" est mathématiquement définie, mais encore inconnue depuis la position initiale.

Un joueur s’appuie sur le calcul, la reconnaissance de configurations et l’évaluation positionnelle. On peut observer ses décisions et comparer ses résultats à ceux d’adversaires ; cela ne fournit pas une mesure générale de sa distance à une stratégie optimale inconnue.

Les performances de joueurs et de moteurs peuvent être comparées dans des parties. Elles ne donnent pas une distance mesurée à la stratégie parfaite, puisque celle-ci reste inconnue dans l'ensemble du jeu. Certaines positions couvertes par des tablebases permettent en revanche de vérifier une décision selon leurs règles.

## Le jeu parfait n'est pas le jeu idéal

Une autre dimension du paradoxe de Zermelo est philosophique. Même si la stratégie parfaite était écrite noir sur blanc, la jouerais-tu vraiment ?

Imagine que Blanc ait une victoire forcée en 80 coups depuis la position initiale. Jouer cette victoire forcée signifierait que toute partie serait, en réalité, déjà terminée au coup 1. L'adversaire pourrait jouer n'importe quoi, le résultat serait le même. Cela changerait l'enjeu théorique. La pratique humaine pourrait pourtant subsister : connaître l'existence d'une stratégie et savoir l'appliquer dans chaque position sont deux choses différentes.

Le fait que les échecs soient si complexes qu'aucune stratégie parfaite n'est connue est précisément ce qui les rend vivants. L'imperfection des joueurs humains est la condition nécessaire à l'existence du jeu en tant que discipline artistique et sportive.

Ce paradoxe est profond : la beauté et la richesse des échecs reposent sur l'ignorance collective de leur vérité mathématique. Si tout le monde savait tout d'avance, le jeu mourrait. Le mystère est son carburant.

## Zermelo et la hiérarchie des jeux résolus

La communauté informatique a progressivement résolu des jeux plus complexes les uns après les autres, suivant la logique de Zermelo.

Le [morpion](https://fr.wikipedia.org/wiki/Morpion) est nul sous jeu parfait, et cette vérité est accessible à n'importe quel enfant qui apprend la stratégie correcte. Le [Puissance 4](https://fr.wikipedia.org/wiki/Puissance_4) a été résolu en 1988 : victoire du premier joueur. Les dames anglaises sur 8×8 (*checkers*) ont été résolues en 2007 par [Jonathan Schaeffer](https://fr.wikipedia.org/wiki/Jonathan_Schaeffer) : nul sous jeu parfait, après 18 ans de calcul dans un jeu comptant environ $5 \times 10^{20}$ positions possibles ; toutes n’ont pas été parcourues individuellement.

![Statut de quelques jeux, sans comparaison de tailles incompatibles](/images/zermelo-03-jeux-resolus.svg)

Les [échecs](https://fr.wikipedia.org/wiki/%C3%89checs) restent ouverts. Le [Go](https://fr.wikipedia.org/wiki/Go_(jeu)) aussi. La valeur depuis leur position initiale n’est pas établie. L’explosion combinatoire gêne les méthodes exhaustives actuelles ; elle ne démontre pas l’impossibilité de toute preuve future, et les règles exactes doivent être précisées pour chaque jeu.

## Ce que Zermelo change pour toi à l'échiquier

Savoir que la valeur de la position initiale reste inconnue change-t-il quelque chose pour le joueur pratique ? Pas directement sur l'échiquier. Mais cela change la façon de penser au jeu.

Dans une position complexe, tes variantes et ton évaluation restent généralement partielles. Il existe pourtant des certitudes locales : un mat forcé correctement établi ou une position couverte par une tablebase peut être résolu selon des règles précises. Il faut distinguer ces cas de l’inconnu qui subsiste depuis la position initiale.

Cette distinction est utile face à un adversaire plus fort : une meilleure performance ne garantit pas une solution exacte de chaque position. Mais elle ne dit pas non plus qu’il ignore une finale connue ou un mat forcé. Compare les variantes concrètes, le temps disponible et la justification d’un coup, plutôt qu’un niveau supposé de proximité avec la perfection.

L’apport de Zermelo n’est pas une stratégie pour gagner depuis la position initiale. Son texte fonde une analyse mathématique de la valeur des positions ; les formulations modernes permettent de séparer l’existence d’une valeur sous des règles fixées des moyens de la calculer.

**Après lecture :** garde en tête une **phrase d'humilité mathématique** en partie longue : tu joues des approximations, pas la vérité de tablebase ; ça peut lever du perfectionnisme au mauvais moment.

---

## Questions fréquentes

### Le théorème de Zermelo prouve-t-il que les Blancs gagnent ?

Non. Il prouve qu'**une** réponse existe parmi trois possibles : victoire Blancs, victoire Noirs, ou nulle. Il ne dit pas laquelle. La position initiale n’est pas résolue ; une évaluation de moteur n’est pas une preuve de sa valeur.

### Pourquoi appelle-t-on cela un "paradoxe" ?

Au sens mathématique, ce n'en est pas un : c'est un résultat parfaitement cohérent. Le "paradoxe" est **épistémique** : on sait qu’il existe une valeur sous les règles fixées, mais celle de la position initiale reste inconnue. Cela ne prouve pas qu’aucune méthode future ne pourra la déterminer. Rares sont les propositions où la *certitude de l'existence* est aussi proprement séparée de la *possibilité de l'accès*.

### Les tablebases ne contredisent-elles pas Zermelo ?

Au contraire, elles le **confirment** sur un sous-ensemble du problème. Sur les positions couvertes par une tablebase, le résultat est déterminé selon ses règles et ses métriques ; les exceptions comme les droits de roque doivent être prises en compte. Les tablebases sont la preuve constructive que la démonstration de Zermelo n'est pas vide : appliquée à un nombre fini accessible de positions, elle produit bien une vérité unique calculable.

### Pourquoi AlphaZero peut-il battre Stockfish s'il ne joue pas "parfaitement" ?

Aucun des deux n’a démontré une stratégie parfaite depuis la position initiale. Ils associent recherche et évaluation, avec des **architectures différentes** dans le match de 2017 : Stockfish 8 utilise une recherche alpha-bêta et une évaluation conçue à la main ; AlphaZero associe réseau appris et Monte Carlo Tree Search. Un meilleur score dans un match n’est pas une mesure de distance à une stratégie optimale inconnue.

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
