---
title: "Paradoxe de Zermelo : l'imperfection du jeu parfait"
excerpt: "Les échecs ont une vérité mathématique que personne ne connaît. Zermelo l'a démontré en 1913 : le résultat sous jeu parfait est déterminé d'avance. Mais cette certitude théorique cache un vertige pratique fascinant."
publishDate: "2026-05-07"
category: "science"
featured: false
featuredRank: 99
readingTime: "13 min"
pillar: "Mathématiques"
tags: ["Zermelo", "échecs", "mathématiques", "théorie des jeux", "résolution", "complexité", "logique"]
seoTitle: "Paradoxe de Zermelo aux échecs : le jeu parfait existe-t-il ?"
seoDescription: "Ernst Zermelo a prouvé en 1913 que les échecs ont un résultat déterminé sous jeu parfait. Pourquoi ce résultat est-il à la fois certain et inaccessible ?"
---

En 1913, lors du cinquième Congrès International des Mathématiciens à Cambridge, le mathématicien allemand [Ernst Zermelo](https://fr.wikipedia.org/wiki/Ernst_Zermelo) a présenté un résultat qui allait changer la façon dont les mathématiciens, et plus tard les informaticiens, pensent aux jeux de stratégie. Son théorème est court. Sa démonstration est élégante. Et ses implications aux échecs sont à la fois rassurantes et vertigineuses.

> **L'essentiel en 4 points :**
> - Zermelo prouve que dans tout jeu fini à deux joueurs à information parfaite, le résultat sous jeu parfait est déterminé à l'avance
> - Pour les échecs, cela signifie que soit Blanc gagne, soit Noir gagne, soit la partie est nulle sous jeu parfait des deux côtés
> - Personne ne sait encore laquelle de ces trois options est vraie
> - Ce paradoxe révèle que la "perfection" aux échecs est un idéal mathématiquement défini mais physiquement inaccessible

## Ernst Zermelo et la théorie des ensembles

Avant de parler des échecs, il faut comprendre qui était Zermelo. Il est principalement connu pour ses contributions fondamentales à la théorie des ensembles, en particulier l'[axiome du choix](https://fr.wikipedia.org/wiki/Axiome_du_choix) et les [axiomes de Zermelo-Fraenkel](https://fr.wikipedia.org/wiki/Axiomes_de_Zermelo-Fraenkel) qui constituent encore aujourd'hui les fondements standard des mathématiques.

En 1913, son intérêt pour les échecs n'était pas anodin. Les mathématiciens de l'époque cherchaient à formaliser le raisonnement logique dans des systèmes aussi rigoureux que possible. Les jeux de stratégie parfaite représentaient un terrain idéal : des règles précises, un nombre fini d'états, pas de hasard. La question naturelle était : existe-t-il, en théorie, une façon "parfaite" de jouer ?

## Le théorème de Zermelo : énoncé et démonstration

Le théorème de Zermelo s'applique à une classe de jeux qui incluent les échecs : des jeux à deux joueurs qui s'affrontent directement (pas de coalition), à information parfaite (rien n'est caché), sans hasard, où les deux joueurs jouent alternativement, et qui se terminent toujours en un nombre fini de coups.

**Énoncé :** Dans tout jeu de ce type, l'une des trois situations suivantes est nécessairement vraie : le joueur 1 a une stratégie gagnante, ou le joueur 2 a une stratégie gagnante, ou les deux joueurs peuvent forcer le nul.

La démonstration utilise une induction sur la longueur maximale possible de la partie. Elle est remarquablement élégante dans sa logique.

Imagine une fin de partie atteinte. Chaque position terminale est soit une victoire pour Blanc, soit une victoire pour Noir, soit une nulle. Maintenant, remontons d'un coup. Si c'est le tour de Blanc, il peut choisir parmi les positions terminales qui lui sont accessibles celle qui lui est la plus favorable. De même pour Noir. En remontant récursivement ainsi depuis toutes les positions terminales jusqu'à la position initiale, chaque position dans l'arbre du jeu reçoit une valeur définie : victoire Blanc, victoire Noir, ou nulle.

La valeur de la position initiale est donc déterminée. Le premier joueur à jouer a soit une stratégie pour forcer la victoire, soit les deux joueurs peuvent forcer le nul, soit le second joueur a une stratégie pour forcer la victoire.

### Pourquoi c'est paradoxal

Le paradoxe de Zermelo n'est pas logique. C'est un paradoxe pratique. Le théorème te garantit que la réponse existe et est unique. Mais il ne te dit pas laquelle c'est. Et surtout, il ne te dit pas comment la trouver.

Pour trouver la valeur réelle de la position initiale des échecs, il faudrait parcourir l'intégralité de l'arbre du jeu. Cet arbre contient environ $10^{120}$ feuilles selon l'estimation de Shannon. Pour référence, l'âge de l'univers est d'environ $4 \times 10^{17}$ secondes, et le nombre d'atomes dans l'univers observable est d'environ $10^{80}$.

Un ordinateur qui pourrait évaluer $10^{20}$ positions par seconde (soit environ $10^{11}$ fois plus vite que les meilleurs ordinateurs actuels) mettrait environ $10^{100}$ secondes pour résoudre les échecs par force brute. C'est infiniment plus long que l'âge de l'univers. La résolution complète des échecs par exploration exhaustive est physiquement impossible avec toute technologie concevable.

## La vérité inconnue des échecs

La grande question que le théorème de Zermelo laisse en suspens est : quelle est la valeur des échecs sous jeu parfait ?

La majorité des grands maîtres et des théoriciens pensent que la réponse est le nul. L'argument empirique est fort : au plus haut niveau de jeu, les nulles sont très fréquentes, et la position initiale est considérée comme légèrement favorable aux Blancs (qui ont le premier mouvement) mais pas suffisamment pour forcer la victoire contre une défense optimale.

Mais ce n'est qu'une intuition basée sur l'observation du jeu humain. Ce n'est pas une preuve. Il est mathématiquement possible que Blanc ait une victoire forcée cachée dans des profondeurs que nul humain n'a jamais explorées. C'est improbable selon les experts, mais non démontré comme impossible.

Quelques travaux récents en informatique tentent d'aborder la question de façon asymptotique. [Komodo](https://fr.wikipedia.org/wiki/Komodo_(moteur_d%27%C3%A9checs)), [Stockfish](https://fr.wikipedia.org/wiki/Stockfish_(moteur_d%27%C3%A9checs)) et leurs successeurs évaluent la position initiale comme légèrement favorable aux Blancs (de l'ordre de +0,2 à +0,3 pion d'avantage), mais cette évaluation est elle-même basée sur des fonctions heuristiques, pas sur un calcul exhaustif.

## Les fins de parties résolues : une fenêtre sur la vérité

Si résoudre les échecs en entier est impossible, il existe un domaine où la résolution complète a été accomplie : les fins de parties avec peu de pièces.

Les [bases de données de fins de partie](https://fr.wikipedia.org/wiki/Base_de_donn%C3%A9es_d%27%C3%A9checs) (tablebases) développées par Ken Thompson puis Marc Bourzutschky et d'autres ont résolu toutes les fins de partie jusqu'à sept pièces sur l'échiquier. Ce travail monumental a révélé des résultats surprenants.

La fin de partie Roi-Dame-Tour contre Roi-Dame, par exemple, avait été longtemps considérée comme nulle. Les tablebases ont révélé que dans certaines configurations, un camp peut forcer la victoire en... 517 coups. Aucun humain, même le meilleur Grand Maître du monde, ne pourrait trouver ce chemin par raisonnement propre. La profondeur de la vérité échiquéenne dans ces configurations dépasse largement les capacités humaines.

Ce résultat est instructif. Il montre que ton intuition sur ce qui est « gagné » ou « nul » peut être profondément erronée quand tu t'éloignes des positions familières. Il renforce le mystère de Zermelo : la vérité existe, mais elle peut se cacher à des profondeurs qui défient l'entendement humain.

## L'imperfection structurelle du joueur humain

Le paradoxe de Zermelo révèle quelque chose de fondamental sur la condition du joueur humain. Il joue un jeu dont la "perfection" est mathématiquement définie, mais physiquement inaccessible.

Un joueur humain, même le meilleur du monde, joue une approximation de la stratégie optimale. Son niveau de jeu est déterminé par la qualité de cette approximation : à quelle profondeur il peut calculer, combien de patterns tactiques il reconnaît, à quel point son évaluation positionnelle est fidèle à la réalité.

[Magnus Carlsen](https://fr.wikipedia.org/wiki/Magnus_Carlsen), considéré par beaucoup comme le meilleur joueur de l'histoire, commet encore des erreurs. [Stockfish](https://fr.wikipedia.org/wiki/Stockfish_(moteur_d%27%C3%A9checs)), le meilleur moteur d'échecs actuel, commet aussi des erreurs par rapport au jeu parfait théorique, des erreurs bien plus rares et bien plus petites, mais des erreurs tout de même.

La différence entre Carlsen et Stockfish n'est pas qualitative (l'un joue parfaitement et l'autre non), elle est quantitative (l'un est une approximation plus fine que l'autre). Ce point de vue change profondément ta façon de penser le progrès aux échecs : tu ne tends pas vers la perfection, tu tentes de t'en approcher.

## Le jeu parfait n'est pas le jeu idéal

Une autre dimension du paradoxe de Zermelo est philosophique. Même si la stratégie parfaite était écrite noir sur blanc, la jouerais-tu vraiment ?

Imagine que Blanc ait une victoire forcée en 80 coups depuis la position initiale. Jouer cette victoire forcée signifierait que toute partie serait, en réalité, déjà terminée au coup 1. L'adversaire pourrait jouer n'importe quoi, le résultat serait le même. Les échecs, en tant que jeu, cesseraient d'exister. La compétition disparaîtrait. L'art stratégique s'effondrerait.

Le fait que les échecs soient si complexes qu'aucune stratégie parfaite n'est connue est précisément ce qui les rend vivants. L'imperfection des joueurs humains est la condition nécessaire à l'existence du jeu en tant que discipline artistique et sportive.

Ce paradoxe est profond : la beauté et la richesse des échecs reposent sur l'ignorance collective de leur vérité mathématique. Si tout le monde savait tout d'avance, le jeu mourrait. Le mystère est son carburant.

## Zermelo et la hiérarchie des jeux résolus

La communauté informatique a progressivement résolu des jeux plus complexes les uns après les autres, suivant la logique de Zermelo.

Le [morpion](https://fr.wikipedia.org/wiki/Morpion) est nul sous jeu parfait, et cette vérité est accessible à n'importe quel enfant qui apprend la stratégie correcte. Le [Puissance 4](https://fr.wikipedia.org/wiki/Puissance_4) a été résolu en 1988 : victoire du premier joueur. Les [dames](https://fr.wikipedia.org/wiki/Dames_(jeu)) ont été résolues en 2007 par [Jonathan Schaeffer](https://fr.wikipedia.org/wiki/Jonathan_Schaeffer) : nul sous jeu parfait, après 18 ans de calcul et un registre de $5 \times 10^{20}$ positions.

Les [échecs](https://fr.wikipedia.org/wiki/%C3%89checs) restent ouverts. Le [Go](https://fr.wikipedia.org/wiki/Go_(jeu)) aussi. La résolution complète de ces jeux reste hors de portée, non pas en principe (Zermelo garantit qu'une réponse existe), mais en pratique (la complexité combinatoire est trop élevée).

## Ce que Zermelo change pour toi à l'échiquier

Savoir que les échecs ont une vérité mathématique inaccessible change-t-il quelque chose pour le joueur pratique ? Pas directement sur l'échiquier. Mais cela change la façon de penser au jeu.

Chaque coup que tu joues est une approximation. Chaque évaluation de position que tu fais est une estimation. Chaque plan que tu construis est une heuristique. Il n'y a pas de certitude, même pour le Grand Maître le plus solide. Il y a des approximations plus ou moins fines de la vérité.

Cette humilité mathématique est saine. Elle signifie que même face à un adversaire bien plus fort que toi, la vérité de la position n'est pas connue de lui. Il joue, lui aussi, une approximation. Sa pendule tourne. Ses ressources cognitives sont limitées. Dans les complications qu'il ne connaît pas, sa vérité pratique peut s'éloigner significativement de la vérité théorique.

Le génie de Zermelo n'est pas d'avoir résolu les échecs. C'est d'avoir prouvé que la solution existe, de façon définitive, sans pouvoir la trouver. Un exemple rare où la certitude de l'existence est séparée de la possibilité de l'accès.

---

### Sources et références

- **Zermelo, E.** *Über eine Anwendung der Mengenlehre auf die Theorie des Schachspiels.* Proceedings of the Fifth International Congress of Mathematicians, Cambridge, 1913. (Le texte original du théorème.)
- **Schaeffer, J., et al.** [*Checkers Is Solved.*](https://www.science.org/doi/10.1126/science.1144079) Science, 317(5844), 1518-1522, 2007. (La résolution complète du jeu de dames par ordinateur.)
- **Fraenkel, A. S., & Lichtenstein, D.** *Computing a Perfect Strategy for n×n Chess Requires Time Exponential in n.* Journal of Combinatorial Theory, Series A, 31(2), 199-214, 1981. (La complexité computationnelle de la résolution des échecs généralisés.)
- **Stiller, L.** *Multilinear Algebra and Chess Endgames.* Games of No Chance, MSRI Publications, 29, 1996. (Le travail sur les tablebases et les fins de partie résolues.)
- **Shannon, C. E.** *Programming a Computer for Playing Chess.* Philosophical Magazine, Series 7, 41(314), 1950. (L'estimation de la complexité du jeu d'échecs.)
