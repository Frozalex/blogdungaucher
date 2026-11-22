---
title: "Comment savoir si un programme d’échecs connaît les coups légaux ?"
excerpt: "Le dénombrement des chemins de jeu permet de localiser une erreur sans demander à un moteur quel coup il préfère."
specialty: "NSI"
publishDate: "2026-12-05T02:00:00+01:00"
---

<div class="academic-dissertation">

<section class="dissertation-movement" aria-label="Introduction">

<p class="dissertation-movement-start">Quand un programme d’échecs annonce un bon coup, il suppose que les déplacements qu’il examine sont autorisés. Une erreur dans cette première étape peut rendre tout le reste du calcul inutile. Il est donc nécessaire de vérifier le générateur de coups indépendamment de la force du moteur. Comment le faire ? Je vais partir du nombre de coups légaux depuis la position initiale, présenter un comptage récursif et montrer comment une différence de résultat aide à repérer une erreur de programmation.</p>

</section>

<section class="dissertation-movement" aria-label="I. Trouver un bon coup suppose de savoir ce qui est autorisé">

<p class="dissertation-movement-start">Au départ, les Blancs disposent de huit pions et de deux cavaliers capables de jouer. Chaque pion peut avancer d’une ou de deux cases, puisque la voie est libre devant lui. Cela donne seize déplacements. Chaque cavalier blanc a deux cases disponibles : le cavalier b1 peut aller en a3 ou c3, et celui de g1 peut aller en f3 ou h3. Les autres pièces restent bloquées par les leurs. Le total est donc vingt. Ce calcul simple constitue une référence que l’on peut vérifier à la main.</p>

<p>Après chacun de ces premiers coups, les Noirs ont encore vingt réponses possibles. En effet, aucun déplacement blanc du départ ne capture une pièce noire et aucun n’empêche les réponses ordinaires des pions et cavaliers noirs. Au bout de deux demi-coups, il existe donc quatre cents chemins. Le mot « chemin » désigne une succession de coups, pas seulement le plateau observé à la fin. Lorsque deux ordres différents mènent au même plateau, ils restent deux histoires de jeu dans ce calcul.</p>

<p>Plus on progresse, plus les nombres de réponses varient. Une pièce peut libérer la voie d’un fou, une prise peut ouvrir une colonne, un échec peut réduire fortement les réponses. Le produit uniforme de vingt par vingt ne peut pas être prolongé. Il faut une méthode qui additionne les branches avec leurs tailles réelles.</p>

<p>Le troisième demi-coup montre déjà pourquoi le nombre des prolongements varie. Dans la suite e4 puis e5, l’avance initiale du pion blanc libère la diagonale du fou f1. Le fou peut même prendre le long de cette diagonale si une pièce adverse s’y trouve sans obstacle, alors qu’il ne pouvait pas traverser son pion en position de départ. Comparons avec un premier coup du cavalier vers f3. Le pion e2 est encore en place. Le fou f1, encadré par les pions e2 et g2, ne dispose toujours d’aucune diagonale ouverte. Chaque branche doit donc être comptée en tenant compte du plateau qu’elle produit. Multiplier vingt par lui-même une troisième fois reviendrait à supposer que la possibilité de jouer est restée constante. Or les premiers coups ont justement pour effet de modifier les possibilités.</p>

</section>

<section class="dissertation-movement" aria-label="II. Le comptage récursif se définit par une règle et un arrêt">

<p class="dissertation-movement-start">On appelle souvent perft le comptage des chemins légaux d’une profondeur donnée. À profondeur zéro, je compte un chemin : celui qui s’arrête à la position actuelle. À profondeur positive, je prends chaque coup légal, le joue provisoirement puis compte les prolongements à la profondeur inférieure. J’additionne les résultats et je restaure la position avant de passer au coup suivant. Une position sans coup légal a zéro prolongement si l’on demande encore au moins un demi-coup.</p>

<p>Ce procédé est récursif. Le problème « compter à profondeur trois » appelle plusieurs problèmes « compter à profondeur deux », qui se ramènent à des problèmes de profondeur un, puis à des arrêts. On le justifie en remarquant que chaque chemin possède un premier coup unique. Deux chemins appartenant à des branches d’ouverture différentes ne peuvent pas être confondus. Additionner leurs nombres donne donc le nombre total.</p>

<p>La restauration de l’état est une étape importante. Quand je joue provisoirement un coup de roi ou de tour, les droits de roque peuvent changer. Si je replace la pièce mais que j’oublie de rétablir ces droits, le prochain coup sera analysé depuis un état qui ne correspond plus à l’origine. La présence des pièces ne suffit pas à représenter toute l’information utile. Le trait et les possibilités de roque ou de prise en passant doivent également être gérés.</p>

<p>Une distinction utile concerne les positions terminales. Si une branche arrive à un mat au dernier niveau demandé, le chemin qui y conduit compte bien pour un. Il a la longueur attendue. Si le mat intervient alors qu’il reste encore un demi-coup à fournir, cette branche contribue zéro au nombre de chemins de longueur exacte. Le nombre total dépend donc aussi de ce que l’on veut mesurer. Un compteur de parties arrêtées au plus tard après un certain nombre de coups pourrait inclure dans son bilan une partie terminée plus tôt. Pour contrôler un programme à l’aide d’un résultat connu, il faut que les deux programmes comptent le même objet. Le nom de la fonction ne suffit pas. Une façon simple de convaincre est de dessiner un arbre où une branche s’arrête tôt et une autre atteint la profondeur voulue, puis de compter séparément leurs feuilles.</p>

</section>

<section class="dissertation-movement" aria-label="III. Pour trouver la faute, il faut regarder plus finement que le total">

<p class="dissertation-movement-start">Supposons qu’un programme affiche dix-neuf coups au départ. Si j’obtiens la liste, je peux retrouver celui qui manque et remonter à la règle correspondante. Le diagnostic devient plus délicat quand une erreur n’apparaît qu’en profondeur. Une solution consiste à demander un total pour chaque premier coup, puis à ouvrir seulement la branche qui diffère d’une référence. Si c’est la branche e2-e4 qui pose problème, je compare ensuite les résultats pour chaque réponse des Noirs. La recherche de l’erreur suit la structure de l’arbre.</p>

<p>Un total correct ne prouve cependant pas que la liste est correcte. Une omission et un coup ajouté à tort peuvent se compenser. Il faut donc utiliser plusieurs positions et, lorsqu’un cas est simple, comparer les coups eux-mêmes. Un test particulier avec un roi en échec, un autre avec un roque et un autre avec une promotion exercent des règles que la position initiale n’atteint qu’après plusieurs tours. Une position où deux roques semblent possibles mais où l’un traverse une case attaquée illustre aussi la différence entre un geste géométriquement possible et un coup autorisé.</p>

<p>Pour isoler un problème de légalité, imaginons une position où un cavalier blanc occupe e2 devant son roi en e1, tandis qu’une tour noire occupe e8 sur une colonne par ailleurs vide. Le cavalier a plusieurs destinations selon la forme de son saut. Mais quitter e2 découvre la colonne et laisse le roi blanc exposé à la tour. Ces déplacements doivent donc être filtrés. Un générateur qui compte les déplacements géométriques avant de contrôler le roi peut les produire comme candidats, puis vérifier chacun dans la position qui en résulte. En faisant apparaître les deux listes, je peux expliquer si l’erreur vient de la génération brute ou du filtre de légalité. Ce diagnostic est plus précis qu’un simple désaccord entre deux grands nombres. La position choisie relie l’échec du comptage à une règle déterminée.</p>

</section>

<section class="dissertation-movement" aria-label="Conclusion">

<p class="dissertation-movement-start">Pour vérifier que le programme connaît les coups légaux, on peut compter les chemins qu’il génère et comparer leurs branches à des références. La position initiale donne des résultats faciles à reconstruire, tandis que des configurations ciblées permettent d’examiner les exceptions. Cette méthode évalue une condition de la force du moteur : la correction de l’espace dans lequel il calcule.</p>

</section>

</div>

## Sources

- Fédération internationale des échecs, [déplacements et légalité, article 3](https://handbook.fide.com/chapter/e012023).
- Stockfish, [documentation des commandes UCI, perft](https://official-stockfish.github.io/docs/stockfish-wiki/UCI-%26-Commands.html).
