---
title: "Pourquoi les échecs aléatoires de Fischer ont-ils exactement 960 positions de départ ?"
excerpt: "Un dénombrement par étapes explique le nombre 960 et montre comment construire un tirage uniforme."
specialty: "Mathématiques"
publishDate: "2026-11-28T02:00:00+01:00"
---

<div class="academic-dissertation">

<section class="dissertation-movement" aria-label="Introduction">

<p class="dissertation-movement-start">Aux échecs classiques, la rangée de départ des pièces est fixée. Dans la variante appelée Chess960, les pions restent à leur place, mais les pièces de la première rangée peuvent changer d’ordre. Le règlement fixe deux contraintes : les fous doivent commencer sur des cases de couleurs opposées et le roi doit se trouver entre les deux tours. Les Noirs reproduisent le même arrangement en face des Blancs. Pourquoi ces règles donnent-elles exactement 960 départs ? Pour le montrer, je vais construire chaque rangée par étapes et vérifier que la méthode compte chacune une seule fois.</p>

</section>

<section class="dissertation-movement" aria-label="I. Les fous imposent de décomposer les choix">

<p class="dissertation-movement-start">Écrivons les huit cases de a1 à h1. Elles alternent entre quatre cases sombres et quatre claires. Si je place un fou sur une case sombre, j’ai quatre choix. Une fois cette case fixée, chacune des quatre cases claires reste disponible pour l’autre fou. Je peux ainsi réaliser seize placements des deux fous. La couleur remplace ici une étiquette. Dire « le fou de case claire » détermine déjà lequel des emplacements je suis en train de compter. Il n’y a donc aucune raison de diviser seize par deux.</p>

<p>Une fois les deux fous en place, il reste six cases et une dame à placer. Je peux choisir n’importe laquelle de ces six cases. Il y a donc seize fois six débuts de construction possibles, soit quatre-vingt-seize. Je n’ai pas besoin de supposer que les cas sont identiques dans leur apparence. Il suffit que chaque placement des fous laisse exactement six choix pour la dame. Cette régularité autorise la multiplication.</p>

<p>L’intérêt de cette première étape se voit si l’on essaie de commencer par les tours. On devrait alors distinguer les situations où le roi trouve plusieurs places entre elles et celles où il n’en trouve aucune. Les fous et la dame laissent toujours le même nombre de cases libres. L’ordre dans lequel on construit l’objet simplifie donc le raisonnement, même si le règlement n’oblige pas à installer les pièces dans cet ordre.</p>

<p>On peut vérifier que ce calcul par produit repose sur la stabilité du nombre de choix, et non sur une indépendance au sens des probabilités. Si le premier fou est placé en c1, on ne peut plus y poser la dame. Si le premier fou se trouve en e1, c1 peut rester disponible pour elle. Les cases accessibles à la dame dépendent donc des choix précédents. Ce qui ne change jamais est le nombre de ces cases : six. La liberté de choisir une case particulière varie, tandis que la quantité d’options reste constante. C’est ce critère qui permet de multiplier. Dans un autre problème, si une règle imposait en plus que la dame touche l’un des fous, le nombre de cases disponibles pourrait varier d’une disposition à l’autre. Il faudrait alors séparer les cas ou inventorier autrement les contraintes.</p>

</section>

<section class="dissertation-movement" aria-label="II. Les cavaliers laissent au roi et aux tours un seul arrangement">

<p class="dissertation-movement-start">Après les fous et la dame, il reste cinq cases. Les deux cavaliers blancs ont le même rôle. Choisir d’abord une case pour le premier puis une case pour le second produit cinq fois quatre possibilités ordonnées. Mais chaque paire a alors été comptée deux fois, puisque les deux cavaliers peuvent échanger les étiquettes fictives que je leur ai attribuées. Il y a donc vingt divisé par deux, soit dix possibilités réelles. C’est aussi le nombre de façons de choisir deux cases parmi cinq.</p>

<p>Trois cases restent libres. Pour placer le roi entre les deux tours, je mets une tour sur la case restante la plus à gauche, le roi sur celle du milieu et l’autre tour sur celle de droite. Il y a exactement un choix. Les cases n’ont pas besoin de se suivre. Si les trois cases libres sont a1, d1 et h1, la seule solution place les tours en a1 et h1, et le roi en d1. C’est leur ordre qui compte, et non l’écart entre elles.</p>

<p>Le produit complet vaut donc quatre fois quatre, fois six, fois dix, fois un. Il donne 960. On ne multiplie pas par un nombre de rangées noires, car leur configuration est déjà déterminée par la rangée blanche. Pour vérifier qu’il n’y a ni oubli ni répétition, on peut lire une rangée terminée à l’envers. On y retrouve la case sombre et la case claire des fous, celle de la dame, puis la paire des cavaliers. Une rangée donnée correspond donc à une seule suite de choix.</p>

<p>Je peux construire une rangée pour montrer ce que le calcul contient. Je place les fous en c1 et f1, la dame en b1, puis les cavaliers en a1 et e1. Il reste d1, g1 et h1, dans cet ordre. J’installe donc une tour en d1, le roi en g1 et l’autre tour en h1. Les huit cases portent, de gauche à droite, cavalier, dame, fou, tour, cavalier, fou, roi, tour. On vérifie les contraintes sans reconstruire les 959 autres rangées. On peut ensuite partir de l’arrangement classique et retrouver les mêmes étapes. Les fous sont encore en c1 et f1, mais la dame est en d1 et les cavaliers en b1 et g1. Les cases restantes imposent a1, e1 et h1 pour les tours et le roi. La position classique fait donc partie des 960.</p>

</section>

<section class="dissertation-movement" aria-label="III. Le dénombrement donne une méthode de tirage uniforme">

<p class="dissertation-movement-start">On peut tirer une des quatre cases sombres au hasard, puis une des quatre claires, puis une des six cases de la dame et enfin une des dix paires de cavaliers. Si, à chaque étape, les choix encore possibles sont équiprobables, la probabilité d’une rangée particulière est un sur quatre, fois un sur quatre, fois un sur six, fois un sur dix. Elle vaut un sur 960. La contrainte sur les tours et le roi ne demande aucun tirage supplémentaire.</p>

<p>Une méthode qui choisirait d’abord n’importe quelle case pour le roi et chercherait ensuite à placer les tours pose un problème différent. Le roi ne peut pas occuper une extrémité. Même parmi les cases permises, certaines laissent plus de manières de placer des tours de chaque côté. Donner à chaque emplacement du roi la même probabilité ne suffit donc pas à rendre toutes les rangées finales équiprobables. La méthode par les fous et la dame fonctionne parce que le nombre de prolongements reste le même à chaque étape retenue.</p>

<p>Le biais d’un tirage par le roi peut se calculer à partir de deux exemples. Si le roi est en b1, sa tour de gauche doit occuper a1. La tour de droite a alors six cases possibles si l’on n’a posé aucune autre pièce. Si le roi est en d1, il existe trois emplacements à gauche et quatre à droite, soit douze couples possibles avant de placer les autres pièces. Ce calcul intermédiaire ne remplace pas le dénombrement complet, puisque la répartition des fous doit encore être prise en compte. Il suffit néanmoins à montrer pourquoi une procédure qui tire ensuite les deux tours uniformément selon les places autour du roi ne donne pas à tous les triplets la même chance. La construction par les fous évite ce problème. Elle permet aussi de donner à chaque position une étiquette unique en numérotant les choix successifs dans un ordre fixé.</p>

</section>

<section class="dissertation-movement" aria-label="Conclusion">

<p class="dissertation-movement-start">Le nombre 960 vient d’une construction où chaque contrainte est appliquée au moment où elle devient simple à traiter. La couleur fixe l’identité des fous dans le calcul, les cavaliers se choisissent sans ordre et les trois places finales imposent les tours autour du roi. Cette bijection explique le nombre de départs et fournit une façon de les tirer sans avantager une configuration.</p>

</section>

</div>

## Sources

- Fédération internationale des échecs, [lois du jeu et directives Chess960, annexe II](https://handbook.fide.com/chapter/e012023).
