---
title: "Pourquoi peut-on placer au plus quatorze fous sur un échiquier sans qu’ils s’attaquent ?"
excerpt: "La construction de quatorze placements et l’impossibilité d’en ajouter un quinzième donnent une preuve complète d’optimalité."
specialty: "Mathématiques"
publishDate: "2027-06-12T02:00:00+02:00"
---

<div class="academic-dissertation">

<section class="dissertation-movement" aria-label="Introduction">

<p class="dissertation-movement-start">Un fou se déplace le long des diagonales. Avec un seul fou, la règle est facile à appliquer. Avec beaucoup de fous, on peut se demander comment les disposer pour qu’aucun ne soit attaqué par un autre. Dans ce problème, je considère un échiquier de huit cases sur huit et des fous qui se menacent dès qu’ils se trouvent sur une même diagonale sans pièce entre eux, sans distinguer leur camp. Pourquoi le maximum vaut-il quatorze ? Pour répondre, je vais établir une limite, exclure le seul cas qui semble encore possible et montrer une disposition qui atteint le nombre annoncé.</p>

</section>

<section class="dissertation-movement" aria-label="I. Une famille de diagonales donne une première limite">

<p class="dissertation-movement-start">Repérons les colonnes de un à huit et les rangées de un à huit. Si je me déplace le long d’une diagonale montante vers la droite, j’augmente les deux coordonnées du même nombre. Leur différence reste constante. On peut donc numéroter les diagonales de cette famille par « colonne moins rangée ». Les différences vont de moins sept à plus sept. Cela représente quinze diagonales distinctes, et chaque case appartient à l’une d’entre elles.</p>

<p>Deux fous ne peuvent partager une de ces diagonales. Même si un autre fou se trouve entre eux, deux fous consécutifs sur cette diagonale se verraient sans obstacle. Dans notre problème, seules les pièces que l’on place peuvent servir d’obstacles. Il suffit donc de regarder les deux plus proches le long d’une même diagonale pour obtenir une attaque. Chaque diagonale de cette famille peut accueillir au plus un fou.</p>

<p>Puisqu’il y a quinze diagonales, ce premier raisonnement donne une borne de quinze. Il ne démontre pas encore qu’une disposition de quinze fous est possible. Les fous se déplacent aussi selon une autre famille de diagonales. Il faut examiner si l’occupation de toutes les diagonales de la première famille laisse apparaître une attaque dans la seconde.</p>

<p>Pour vérifier le nombre de diagonales, on peut commencer avec les trois valeurs centrales. La différence zéro décrit a1, b2 et toutes les cases jusqu’à h8. Avec une différence de un, on commence en b1 et on poursuit jusqu’à h7. Avec une différence de moins un, on commence en a2 et on poursuit jusqu’à g8. En s’éloignant de zéro, les diagonales raccourcissent d’une case à chaque étape, jusqu’à ce qu’il ne reste qu’un coin. Cette construction aide à justifier que toutes les différences de moins sept à sept existent. Dans l’exposé, dessiner deux ou trois diagonales seulement suffit à faire comprendre comment les autres suivent le même principe.</p>

</section>

<section class="dissertation-movement" aria-label="II. Placer quinze fous contraint deux coins à s’attaquer">

<p class="dissertation-movement-start">Si je veux placer quinze fous, je dois occuper exactement une case sur chacune des quinze diagonales repérées. Les deux diagonales extrêmes de cette famille n’ont qu’une seule case. La différence moins sept correspond à a8 et la différence plus sept correspond à h1. Une disposition de quinze fous doit donc placer un fou dans chacun de ces deux coins.</p>

<p>Mais a8 et h1 se trouvent sur la même diagonale descendante. Si cette diagonale ne contient que ces deux fous, ils s’attaquent directement. Si elle en contient d’autres entre eux, les fous consécutifs s’attaquent. Dans tous les cas, l’obligation d’occuper les deux diagonales extrêmes rend impossible une disposition de quinze fous. Le maximum est donc au plus quatorze.</p>

<p>La preuve procède en deux temps. La première famille donne un nombre de places possibles. La seconde empêche d’utiliser toutes ces places à la fois. Ce n’est pas simplement parce que les coins sont proches ou éloignés. C’est leur appartenance simultanée à deux familles de diagonales qui crée le blocage.</p>

<p>L’argument des coins peut être repris comme un raisonnement par contradiction. Je suppose d’abord qu’un placement de quinze fous existe. Puisque chacun exige une diagonale distincte de la première famille, les quinze diagonales doivent être utilisées. Je n’ai alors plus aucun choix pour les deux diagonales qui ne contiennent qu’une seule case. Une fois ces deux cases occupées, la seconde famille de diagonales donne une attaque. La supposition de départ ne peut donc pas être vraie. Cette manière de présenter la preuve montre que le problème ne vient pas d’une disposition mal choisie. Il apparaît dans toutes les dispositions qui tenteraient d’atteindre la même borne.</p>

</section>

<section class="dissertation-movement" aria-label="III. Une disposition de quatorze fous montre que la limite est atteignable">

<p class="dissertation-movement-start">Plaçons sept fous sur les cases a1 à g1, puis sept autres sur les cases a8 à g8. Deux fous d’une même rangée ne partagent pas de diagonale. Pour que deux fous appartenant aux deux rangées opposées soient sur la même diagonale, l’écart vertical est de sept rangées. L’écart horizontal doit donc aussi être de sept colonnes. Or, dans les deux rangées, seules les colonnes a à g sont occupées. L’écart le plus grand est alors de six colonnes. Aucun fou de la première rangée ne peut donc attaquer un fou de la seconde.</p>

<p>Nous avons maintenant deux affirmations complémentaires. Une disposition de quinze fous est impossible. Une disposition de quatorze fous existe et on peut la dessiner directement. Le premier raisonnement empêche de dépasser la borne. Le second prouve qu’il n’est pas nécessaire de descendre jusqu’à treize. On obtient un maximum démontré, plutôt qu’un record trouvé au hasard par essais successifs.</p>

<p>Cette distinction est générale dans les problèmes d’optimisation. Énumérer de bons exemples donne confiance dans une réponse, mais ne ferme pas la possibilité d’un meilleur exemple. Construire une borne sans montrer qu’elle est atteinte ne donne pas non plus la solution exacte. Le plateau permet de voir comment ces deux étapes s’articulent.</p>

<p>L’idée peut être prolongée sur un plateau carré de côté différent. Sur un plateau de quatre cases sur quatre, on peut occuper les trois premières colonnes de la rangée du bas et de la rangée du haut. Le décalage vertical vaut trois, tandis que le décalage horizontal disponible ne dépasse pas deux. On obtient six fous. Le même argument appliqué aux diagonales extrêmes exclut une disposition de sept. En formulant ce prolongement, on voit quelles propriétés de la démonstration dépendent de la taille huit et lesquelles restent stables. Il n’est pas nécessaire de parcourir toutes les positions. On utilise les mêmes relations de coordonnées et de diagonales pour comprendre pourquoi la construction fonctionne.</p>

<p>On peut encore vérifier la construction en séparant les deux sens du déplacement. Un fou placé sur la première rangée et un autre placé sur la dernière ne peuvent se rencontrer sur une droite à quarante-cinq degrés que si l’un occupe a et l’autre h. Ce sont les seules colonnes dont l’écart vaut sept. En supprimant h des deux rangées, je retire donc toutes les rencontres possibles entre elles. Cette observation donne un moyen rapide d’expliquer le dessin à voix haute, même si le public n’a pas suivi chaque étape du calcul avec les coordonnées.</p>

</section>

<section class="dissertation-movement" aria-label="Conclusion">

<p class="dissertation-movement-start">Quatorze fous peuvent occuper les deux rangées extrêmes en laissant la colonne h libre. Quinze fous forceraient l’occupation de a8 et h1, qui appartiennent à la même diagonale. La règle de déplacement du fou permet ainsi de passer d’une observation locale à une preuve exacte sur tout l’échiquier.</p>

</section>

</div>

## Sources

- Fédération internationale des échecs, [déplacement du fou et obstruction sur la diagonale, article 3](https://handbook.fide.com/chapter/e012023).
