---
title: "Comment une notation d’échecs peut-elle rester courte quand deux pièces peuvent jouer le même coup ?"
excerpt: "Deux cavaliers capables d’atteindre d2 suffisent à expliquer ce que l’état du jeu permet de coder ou oblige à préciser."
specialty: "NSI · Mathématiques"
publishDate: "2027-05-15T02:00:00+02:00"
---

<div class="academic-dissertation">

<section class="dissertation-movement" aria-label="Introduction">

<p class="dissertation-movement-start">On peut écrire un coup d’échecs en indiquant sa case de départ et sa case d’arrivée. Pourtant, les parties sont souvent enregistrées avec une notation plus courte. Le mouvement d’un cavalier vers f3 peut s’écrire simplement Cf3 en français. Parfois, deux cavaliers pourraient atteindre la même case et cette indication devient ambiguë. Comment conserver un texte court tout en permettant de reconstruire la partie ? Je comparerai la notation complète à celle que l’on déduit du contexte, puis j’examinerai les cas où ce contexte ne suffit plus.</p>

</section>

<section class="dissertation-movement" aria-label="I. Une partie fournit des données que le message n’a pas à répéter">

<p class="dissertation-movement-start">Dans la position initiale, si les Blancs annoncent Cf3, on peut déterminer que le cavalier de g1 se déplace. Celui de b1 peut atteindre a3 ou c3, mais pas f3. Indiquer la nature de la pièce et sa destination suffit. La case d’origine est disponible dans l’état de la partie, pour qui connaît les règles. On pourrait écrire g1-f3 et communiquer le coup de manière plus explicite. On écrirait alors une information que le destinataire peut déjà retrouver.</p>

<p>Pour un programme, le procédé ressemble à une lecture dépendante d’un état. On place d’abord les pièces selon la position initiale. Chaque coup est interprété à partir de cette position, puis la modifie. Le coup suivant ne doit donc pas être lu comme un mot indépendant. Une erreur de transcription au début peut conduire à une position erronée où un coup ultérieur ne peut plus être reconnu, même s’il est correctement écrit. La brièveté de chaque message repose sur la continuité de la suite.</p>

<p>Cette dépendance est utile. Sur un plateau comportant beaucoup de pièces, la case d’arrivée et le type de pièce réduisent déjà fortement les possibilités. On peut donc ajouter des précisions seulement quand le choix d’origine ne se déduit plus de façon unique.</p>

</section>

<section class="dissertation-movement" aria-label="II. Le programme ajoute le renseignement qui sépare les candidats">

<p class="dissertation-movement-start">Prenons une position pédagogique avec les rois en e1 et e8, et deux cavaliers blancs en b1 et f3. Les Blancs ont le trait. Le cavalier b1 peut aller en d2 en se déplaçant de deux colonnes et d’une rangée. Celui de f3 peut aussi aller en d2 en parcourant deux colonnes et une rangée dans l’autre sens. Les deux coups sont légaux dans cette position. Écrire seulement Cd2 laisse donc une ambiguïté réelle.</p>

<p>Les colonnes d’origine permettent de la lever. On écrit Cbd2 ou Cfd2 en français. Dans un fichier PGN utilisant la notation standard anglaise, la lettre du cavalier est N, et les coups correspondants s’écrivent Nbd2 et Nfd2. Nous n’avons pas ajouté toute la case de départ. Il a suffi d’ajouter une lettre. Si deux pièces possibles se trouvent sur la même colonne, la rangée peut les distinguer. Dans certains cas comportant par exemple plusieurs pièces du même type, il faut la case entière.</p>

<p>La précision porte sur les coups légaux. Un cavalier peut, par la géométrie de son mouvement, atteindre une case et pourtant ne pas avoir le droit de jouer. Par exemple, s’il se trouve entre son roi et une tour qui l’attaquerait dès qu’il bouge, son départ peut exposer son propre roi. Si un seul des cavaliers peut réellement effectuer le déplacement, il ne faut pas ajouter une précision pour un concurrent que les règles excluent. Le code de la partie dépend donc de la légalité et de l’image du plateau.</p>

</section>

<section class="dissertation-movement" aria-label="III. La portabilité suppose une convention partagée">

<p class="dissertation-movement-start">L’intérêt d’un fichier PGN est que plusieurs logiciels peuvent relire la même partie. Un programme peut afficher en français les lettres utilisées par le joueur et toujours exporter selon la convention anglaise du format. Le choix de langue à l’écran ne doit pas produire un fichier dont un autre programme interprète mal les pièces. Il faut aussi connaître la position de départ. Si une partie commence dans une configuration particulière, la notation des mouvements ne donne pas, à elle seule, tout l’état nécessaire à sa première lecture.</p>

<p>On peut vérifier ce principe en comparant deux essais : écrire une suite complète à partir de la position initiale, puis donner les mêmes derniers coups sans la position de départ ou les premiers mouvements. Dans le deuxième cas, plusieurs interprétations peuvent devenir possibles. Le format est compact parce qu’une grande partie de l’information se reconstitue à partir d’un contexte fourni.</p>

</section>

<section class="dissertation-movement" aria-label="Conclusion">

<p class="dissertation-movement-start">Une notation d’échecs reste courte lorsqu’elle donne les éléments que le lecteur ne peut pas déduire. Les deux cavaliers capables d’atteindre d2 montrent la limite de cette économie et la manière d’y répondre. Le fichier devient portable si chacun connaît la position de départ, les règles et la convention qui décide quelle précision ajouter.</p>

</section>

</div>

## Sources

- Steven J. Edwards, [*Portable Game Notation Specification and Implementation Guide*, section 8.2.3](https://www.saremba.de/chessgml/standards/pgn/pgn-complete.htm).
- Fédération internationale des échecs, [notation algébrique, annexe C](https://handbook.fide.com/chapter/e012023).
