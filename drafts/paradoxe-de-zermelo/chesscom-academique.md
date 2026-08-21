# Paradoxe de Zermelo : les échecs ont une vérité que personne ne connaîtra jamais

En 1913, au cinquième Congrès international des mathématiciens à Cambridge, Ernst Zermelo présente un résultat court, élégant, aux implications vertigineuses pour les échecs. Il démontre qu'une partie d'échecs possède déjà, dès le premier coup, un résultat déterminé sous jeu parfait. Cette certitude théorique cache un vertige pratique : on sait que la réponse existe, on sait qu'elle est unique, et on ne pourra jamais la connaître. Cet article explique le théorème, sa portée et ce qu'il change pour le joueur.

## Qui était Zermelo, et pourquoi les échecs

Zermelo est surtout connu pour ses contributions fondatrices à la théorie des ensembles, notamment l'axiome du choix et les axiomes qui portent son nom, encore au socle des mathématiques. Son intérêt de 1913 pour les échecs n'était pas anecdotique : les mathématiciens de l'époque cherchaient à formaliser le raisonnement logique dans des systèmes rigoureux, et les jeux à information parfaite (règles précises, états finis, pas de hasard) offraient un terrain idéal pour une question naturelle : existe-t-il, en théorie, une façon parfaite de jouer ?

## Le théorème et sa démonstration

Le théorème s'applique aux jeux à deux joueurs qui s'affrontent directement, à information parfaite, sans hasard, alternés et finis, ce qui inclut les échecs. Son énoncé : dans un tel jeu, l'une des trois situations suivantes est nécessairement vraie, le premier joueur a une stratégie gagnante, le second en a une, ou les deux peuvent forcer le nul. La démonstration repose sur une induction rétrograde, exactement le mécanisme du minimax moderne formulé trente-cinq ans plus tôt. On part des positions terminales, chacune valant victoire blanche, victoire noire ou nulle, puis on remonte coup par coup : à chaque position, le joueur au trait choisit l'issue qui lui est la plus favorable parmi celles accessibles. En remontant ainsi jusqu'à la position initiale, chaque position de l'arbre reçoit une valeur définie, et celle de départ est donc déterminée.

Un détail historique mérite mention : le texte original contenait une subtilité non triviale sur la finitude, Zermelo ne traitant pas correctement le cas où le perdant retarde indéfiniment le mat. C'est Dénes König (1927) puis László Kalmár (1928) qui complètent la preuve avec le lemme de König sur les arbres infinis à branchement fini. Aux échecs, la règle des cinquante coups et la triple répétition garantissent en pratique cette finitude.

## Thèse : une certitude d'existence absolue

Ce que le théorème établit est puissant : la vérité de la position initiale n'est pas à construire, elle est déjà là. Soit les Blancs disposent d'un gain forcé, soit les Noirs, soit les deux camps peuvent garantir la nulle. Cette valeur ne dépend ni des joueurs, ni de l'époque, ni des modes d'ouverture : elle est une propriété intrinsèque du jeu. Les tablebases en sont la confirmation constructive sur un sous-ensemble accessible : pour toute position d'au plus sept pièces, la valeur de Zermelo est connue exactement, avec sa profondeur. La démonstration n'est donc pas une abstraction vide ; appliquée à un nombre fini accessible de positions, elle produit bien une vérité unique calculable.

## Antithèse : une inaccessibilité tout aussi absolue

Le paradoxe n'est pas logique mais épistémique. Le théorème garantit que la réponse existe et qu'elle est unique, mais ne dit ni laquelle, ni comment la trouver. Or l'arbre des échecs compte environ 10 puissance 120 feuilles. Pour référence, l'univers compte environ 10 puissance 80 atomes et a vécu environ 4 fois 10 puissance 17 secondes. Un ordinateur évaluant 10 puissance 20 positions par seconde, soit cent milliards de fois plus vite que les meilleures machines actuelles, mettrait encore environ 10 puissance 100 secondes à résoudre les échecs par force brute, infiniment plus que l'âge de l'univers. La résolution exhaustive est donc physiquement impossible avec toute technologie concevable. Le calcul quantique ne sauve rien : l'algorithme de Grover ne divise l'exposant que par deux, et 10 puissance 60 reste astronomique.

Les tablebases illustrent par ailleurs combien la vérité peut défier l'intuition. La finale dame-tour contre dame, longtemps tenue pour nulle, s'est révélée gagnante dans certaines configurations en plus de 500 coups, chemin qu'aucun humain ne trouverait par raisonnement propre. Elles distinguent même deux mesures de la victoire (distance au mat et distance au prochain coup remettant à zéro le compteur des cinquante coups), montrant qu'une même position peut avoir une vérité longue de 517 coups et une victoire pratique en sept, selon le critère choisi.

## Synthèse : le joueur joue des approximations

Ce paradoxe éclaire la condition même du joueur. Il pratique un jeu dont la perfection est mathématiquement définie mais physiquement inaccessible, et ne peut donc jouer qu'une approximation de la stratégie optimale. Son niveau se mesure à la finesse de cette approximation : profondeur de calcul, nombre de motifs reconnus, fidélité de l'évaluation positionnelle. Carlsen commet encore des erreurs ; Stockfish aussi, par rapport au jeu parfait, des erreurs plus rares et plus petites, mais réelles. La différence entre eux n'est pas qualitative (l'un parfait, l'autre non) mais quantitative : l'un approxime plus finement que l'autre. Cette perspective change la façon de penser le progrès : on ne tend pas vers la perfection, on tente de s'en approcher.

## Application et dimension philosophique

Sur l'échiquier, savoir cela ne change rien directement, mais cela installe une humilité saine. Face à un adversaire bien plus fort, la vérité de la position ne lui est pas connue non plus : il approxime, sa pendule tourne, ses ressources sont bornées, et dans les complications qu'il ne maîtrise pas, sa vérité pratique peut s'éloigner de la vérité théorique. C'est là que se logent tes chances. Il y a même une dimension philosophique : si la stratégie parfaite était connue, toute partie serait déjà jouée au premier coup, la compétition s'effondrerait, l'art stratégique disparaîtrait. La richesse des échecs repose précisément sur l'ignorance collective de leur vérité mathématique. Le mystère est leur carburant.

## Conclusion

Le génie de Zermelo n'est pas d'avoir résolu les échecs, mais d'avoir prouvé que la solution existe, définitivement, sans pouvoir la trouver, un cas rare où la certitude de l'existence est proprement séparée de la possibilité de l'accès. Les jeux plus simples sont tombés (morpion, puissance 4, dames résolues en 2007 après dix-huit ans de calcul), mais les échecs, comme le Go, resteront ouverts non par défaut de principe mais par excès de complexité. Pour le joueur, la leçon est libératrice : puisque même les plus forts ne jouent que des approximations, le perfectionnisme paralysant n'a, mathématiquement, aucun fondement.

---

*Version complète, avec les références et le détail des tablebases, à lire sur le blog : [Paradoxe de Zermelo : l'imperfection du jeu parfait](https://blogdungaucher.com/fr/blog/paradoxe-de-zermelo/).*
