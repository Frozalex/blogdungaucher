---
title: "Pourquoi promouvoir un pion en dame peut-il faire perdre une victoire aux échecs ?"
excerpt: "Une finale de trois pièces permet de démontrer un pat et de comparer chaque promotion à partir des coups légaux."
specialty: "Mathématiques · NSI"
publishDate: "2027-03-06T02:00:00+01:00"
---

<div class="academic-dissertation">

<section class="dissertation-movement" aria-label="Introduction">

<p class="dissertation-movement-start">Quand un pion atteint la dernière rangée, on choisit souvent de le remplacer par une dame. Celle-ci se déplace avec plus de liberté qu’une tour et paraît donc être un meilleur outil pour gagner. Pourtant, cette liberté supplémentaire peut être la cause d’une partie nulle. Pour comprendre ce paradoxe, je partirai d’une finale très courte à représenter. Je montrerai d’abord que la dame peut bloquer tous les coups sans donner échec, puis que la tour laisse une réponse. Nous pourrons alors distinguer la puissance d’une pièce et la valeur du résultat qu’elle produit.</p>

</section>

<section class="dissertation-movement" aria-label="I. La promotion en dame peut enlever le dernier coup disponible">

<p class="dissertation-movement-start">Plaçons le roi blanc en c6 et le pion blanc en c7. Le roi noir est en a7. Les Blancs ont le trait. Le pion peut avancer à c8 et être remplacé par une dame. Pour juger le coup, il faut d’abord demander si le roi noir est en échec. De c8 à a7, le décalage vaut deux colonnes et une rangée. Cette relation ne correspond ni à une ligne ni à une diagonale. La dame n’attaque donc pas a7. Le roi blanc en c6 n’est pas non plus adjacent au roi noir.</p>

<p>Il faut ensuite examiner toutes les destinations voisines du roi noir. Depuis a7, au bord de l’échiquier, il ne peut envisager que cinq cases : a8, b8, b7, b6 et a6. La dame en c8 attaque a8 et b8 sur la huitième rangée. Elle attaque b7 et a6 sur la même diagonale. Le roi blanc en c6 contrôle b6 et contrôle aussi b7. Aucune des cinq cases n’est accessible au roi noir. Il ne possède pas d’autre pièce et il n’est pas en échec. Cette situation correspond à un pat, donc à une partie nulle.</p>

<p>La démonstration utilise deux conditions distinctes. Si le roi était attaqué et ne disposait d’aucun coup permettant de répondre, ce serait un mat. Ici, l’absence de coup légal ne suffit pas à produire une victoire. Il faut connaître la différence entre interdire un déplacement et attaquer le roi à sa place actuelle.</p>

</section>

<section class="dissertation-movement" aria-label="II. La promotion en tour laisse une case que la dame contrôlait">

<p class="dissertation-movement-start">Reprenons la position avant la promotion. Cette fois, le pion devient une tour en c8. Elle contrôle a8 et b8 sur la même rangée, mais ne contrôle pas la diagonale vers a6. Le roi blanc interdit toujours b6 et b7. La case a6 reste donc accessible. Le roi noir n’est pas en échec et dispose exactement d’un coup légal : aller de a7 à a6.</p>

<p>La partie continue avec un roi et une tour blancs contre le roi noir. La tour peut couper un rang ou une colonne, et son roi peut se rapprocher pour restreindre progressivement les mouvements du roi adverse. L’idée du mat est de pousser celui-ci vers un bord, de contrôler les cases de fuite avec le roi et de donner le dernier échec avec la tour. Les Blancs conservent ici leurs pièces et disposent du matériel qui permet de forcer le mat. Cette promotion donne donc à jouer une victoire que le choix de la dame aurait annulée immédiatement.</p>

<p>Ce résultat n’affirme pas qu’une tour est en général plus forte qu’une dame. Dans cette position, l’attaque supplémentaire de la dame sur la diagonale est précisément ce qui retire l’unique réponse noire. Une propriété utile dans de nombreuses situations produit ici un autre effet parce que la règle du pat donne une valeur particulière à l’absence de coup.</p>

</section>

<section class="dissertation-movement" aria-label="III. Il faut comparer les états obtenus, promotion par promotion">

<p class="dissertation-movement-start">Un programme peut être tenté de générer seulement les promotions en dame, parce que c’est souvent celle que les joueurs choisissent. Il manquerait alors des coups pourtant légaux et, dans notre position, une solution gagnante. Après l’avance du pion, le programme doit générer quatre candidats distincts : dame, tour, fou et cavalier. Même si les quatre coups ont la même case de départ et la même case d’arrivée, la pièce produite change l’état.</p>

<p>Il faut ensuite analyser le résultat. La dame donne un pat. La tour mène à une finale gagnable par les Blancs. Un roi avec un seul fou ou un seul cavalier contre un roi seul ne dispose pas du matériel permettant de donner mat. Le meilleur choix vient donc de la comparaison des conséquences, pas d’une valeur fixe attribuée à la pièce.</p>

</section>

<section class="dissertation-movement" aria-label="Conclusion">

<p class="dissertation-movement-start">Promouvoir en dame peut faire perdre une victoire parce que le jeu s’arrête si l’adversaire a le trait, n’est pas en échec et ne peut plus jouer. Dans la finale étudiée, la tour laisse au roi noir une case et permet au jeu de continuer. Le cas montre pourquoi une méthode rigoureuse compare les possibilités légales et leurs résultats avant de privilégier la pièce qui se déplace le plus.</p>

</section>

</div>

## Sources

- Fédération internationale des échecs, [promotion, mat et pat, articles 3 et 5](https://handbook.fide.com/chapter/e012023).
