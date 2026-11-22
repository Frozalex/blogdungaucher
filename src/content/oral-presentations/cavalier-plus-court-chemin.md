---
title: "Comment trouver le plus court chemin d’un cavalier sur un échiquier ?"
excerpt: "La couleur des cases donne une contrainte, puis un parcours en largeur établit le nombre minimal de coups."
specialty: "NSI · Mathématiques"
publishDate: "2027-02-20T02:00:00+01:00"
---

<div class="academic-dissertation">

<section class="dissertation-movement" aria-label="Introduction">

<p class="dissertation-movement-start">Pour amener une tour d’un coin de l’échiquier à l’autre sur un plateau vide, deux déplacements peuvent suffire. Un cavalier se déplace en formant un L : deux cases dans une direction, puis une dans la direction perpendiculaire. Il n’est pas évident de lire la longueur du plus court trajet en regardant seulement la distance entre les cases. Comment trouver ce trajet et prouver qu’il est minimal ? Je commencerai par étudier ce que la couleur des cases permet de savoir. Je représenterai ensuite le plateau comme un graphe et expliquerai la méthode qui explore les distances dans l’ordre.</p>

</section>

<section class="dissertation-movement" aria-label="I. Chaque saut change de couleur">

<p class="dissertation-movement-start">Si je me déplace horizontalement d’une case, la couleur change. Après deux cases, elle redevient la même. Le cavalier réalise un déplacement de deux cases dans une direction et d’une case dans l’autre. Les deux premières font revenir à la couleur de départ et la dernière la change. Une suite de longueur paire ramène donc à la couleur initiale. Une suite de longueur impaire aboutit à l’autre couleur.</p>

<p>Prenons a1 et d4. Elles sont toutes deux foncées. Le cavalier ne peut donc pas passer de l’une à l’autre en un saut. Il existe cependant un trajet de deux coups : de a1 à b3, puis de b3 à d4. Le premier décalage vaut une colonne et deux rangées. Le second vaut deux colonnes et une rangée. Les deux mouvements satisfont la règle. Comme les cases sont distinctes et qu’un coup est impossible, ces deux coups sont nécessaires et suffisants.</p>

<p>La couleur ne donne pas toujours une preuve complète. Entre a1 et b1, les cases sont de couleurs différentes, donc il faut un nombre impair de sauts. Un seul ne suffit pas, car le déplacement horizontal d’une case n’est pas permis au cavalier. On sait déjà qu’il en faut au moins trois. Une construction comme a1-c2-a3-b1 montre que trois suffisent. Pour des cibles plus éloignées, il devient utile de disposer d’une méthode systématique.</p>

<p>Il faut également distinguer la couleur d’une case et sa position dans le réseau des sauts. Depuis a1, le cavalier ne voit que deux destinations, alors qu’un cavalier placé loin des bords peut en avoir huit. Deux cases de même couleur ne proposent donc pas nécessairement le même nombre de chemins. La règle d’alternance est vraie partout et permet d’éliminer certaines longueurs, mais les bords changent les options disponibles. Si je dessine les premiers sauts depuis le coin puis depuis une case du centre, l’écart devient visible. C’est une raison de ne pas déduire automatiquement le trajet le plus court d’une simple distance mesurée sur le quadrillage.</p>

</section>

<section class="dissertation-movement" aria-label="II. Le graphe permet de décrire des étages de distance">

<p class="dissertation-movement-start">Je représente chacune des soixante-quatre cases par un sommet. Deux sommets sont reliés si un saut de cavalier mène de l’un à l’autre. Sur un échiquier vide où chaque saut compte pour une unité, la longueur d’un trajet est le nombre d’arêtes parcourues. Cette représentation permet de changer de question : je ne cherche plus à deviner un mouvement bien orienté, je cherche à savoir par quels sommets on peut atteindre la cible en un, deux, puis trois sauts.</p>

<p>Le parcours en largeur part de a1. Il met ses voisins directs, b3 et c2, dans une file. Ensuite, il examine successivement chacun de ces voisins et ajoute à la file les cases encore inconnues que l’on peut atteindre en un saut supplémentaire. Il marque une case dès qu’elle est ajoutée. Ainsi, quand un autre chemin arrive plus tard à cette case, il n’est pas nécessaire de recommencer toutes ses recherches. Une file traite d’abord ce qui y est entré en premier. Toutes les cases atteintes à un saut sont donc examinées avant celles atteintes à deux sauts.</p>

<p>La première fois que le programme découvre la cible, il connaît sa distance minimale. S’il existait un trajet plus court, il aurait été découvert à un étage exploré plus tôt. On peut aussi conserver, pour chaque case, le sommet d’où elle a été découverte. En remontant ces prédécesseurs depuis la cible jusqu’au départ, on retrouve un trajet complet. Si plusieurs chemins minimaux existent, la file en fournit un selon l’ordre dans lequel on a examiné les voisins.</p>

<p>Je peux montrer le principe de la file avec le trajet vers b1. Au départ, j’écris a1 à la distance zéro. Je note ensuite b3 et c2 à la distance un. En examinant c2, je peux découvrir a3 à la distance deux. Depuis a3, un saut atteint b1. Il reste à expliquer pourquoi le programme n’a pas oublié un trajet plus court : s’il existait, la case aurait été trouvée avant l’examen des cases de distance deux. On peut lire la démonstration même en suivant une seule branche du dessin. La file garantit l’ordre de traitement de toutes les autres et empêche qu’une longue branche commencée tôt soit confondue avec le meilleur trajet.</p>

</section>

<section class="dissertation-movement" aria-label="III. Une partie réelle change le graphe">

<p class="dissertation-movement-start">Le modèle suppose un plateau vide et traite le cavalier comme la seule pièce qui décide. Sur un plateau où certains emplacements sont occupés par des pièces du même camp, on ne peut pas s’y poser. En revanche, le cavalier peut passer par-dessus les pièces entre les deux cases. Il faut donc retirer des destinations, plutôt que de tracer un obstacle continu dans l’espace. Si ces autres pièces restent fixes, on peut garder la même méthode sur le graphe modifié.</p>

<p>Dans une vraie partie, l’adversaire joue entre deux sauts du cavalier. Une case libre peut devenir occupée ou menacée. Le plus court trajet en nombre de coups peut alors être imprudent ou impossible à réaliser. La question stratégique devient : comment construire un trajet dont les étapes restent acceptables selon les réponses adverses ? Ce problème demande de tenir compte de positions successives, alors que l’exposé traitait d’abord la géométrie du cavalier.</p>

<p>Si les sauts ne sont pas tous évalués de la même manière, la définition du plus court chemin peut changer. Dans un exercice pédagogique, on pourrait compter un coût de deux pour entrer sur une case jugée dangereuse et un coût d’un pour les autres. Un trajet en trois sauts pourrait alors coûter davantage qu’un détour en quatre. Le parcours en largeur resterait adapté pour compter les sauts, mais ne traiterait plus automatiquement la somme des coûts. La différence est intéressante pour le joueur : rejoindre vite une case et rejoindre cette case avec le moins de risques ne sont pas des objectifs identiques. Le modèle doit annoncer lequel il cherche à atteindre.</p>

<p>On peut aussi tracer seulement les cases de la première couche et entourer les deux cibles de l’exposé. Ni d4 ni b1 n’est entourée au premier étage. Au deuxième, d4 est atteinte et b1 reste absente. Cette lecture rejoint le raisonnement par la couleur, mais elle donne une preuve qui peut être reproduite systématiquement. En montrant ces deux contrôles ensemble, on distingue une propriété géométrique utile pour expliquer le résultat et une méthode qui peut trouver le chemin même quand la simple couleur ne suffit pas.</p>

</section>

<section class="dissertation-movement" aria-label="Conclusion">

<p class="dissertation-movement-start">Pour trouver un plus court chemin, on traduit l’échiquier en graphe et on explore les cases par distance croissante. La couleur fournit une vérification directe, tandis que le parcours en largeur donne un résultat systématique et peut reconstruire un trajet. La méthode répond exactement au modèle choisi. Ajouter des obstacles ou des réponses adverses change les trajets possibles et, parfois, le sens même du mot « court ».</p>

</section>

</div>

## Sources

- Fédération internationale des échecs, [déplacement du cavalier, article 3.6](https://handbook.fide.com/chapter/e012023).
- Éduscol, [ressources du programme de NSI sur les graphes et leurs parcours](https://eduscol.education.gouv.fr/5823/programmes-et-ressources-en-numerique-et-sciences-informatiques-voie-g).
