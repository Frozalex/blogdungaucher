---
title: "Pourquoi deux échiquiers identiques ne représentent-ils pas toujours la même position aux échecs ?"
excerpt: "Le trait, les droits de roque et la prise en passant montrent ce qu’un programme doit mémoriser pour reconnaître une répétition."
specialty: "NSI"
publishDate: "2027-02-27T02:00:00+01:00"
---

<div class="academic-dissertation">

<section class="dissertation-movement" aria-label="Introduction">

<p class="dissertation-movement-start">Un diagramme d’échecs montre les pièces présentes sur soixante-quatre cases. Si la partie ramène les pièces sur les mêmes cases, l’image semble se répéter. Pourtant, les règles n’assimilent pas toujours ces deux moments. Un joueur peut avoir perdu le droit de roquer ou ne plus pouvoir jouer la même prise. Comment un programme peut-il alors reconnaître une répétition ? Il faut définir les informations qui font partie de la position, puis distinguer l’égalité de deux états et le nombre de fois où un état est apparu.</p>

</section>

<section class="dissertation-movement" aria-label="I. Une position doit dire à qui appartient le prochain coup">

<p class="dissertation-movement-start">Considérons le début de partie pédagogique 1. Cf3 Cf6, 2. Cg1 Cg8. Les deux cavaliers reviennent à leurs cases de départ. Les autres pièces n’ont pas bougé. Comme chacun des deux camps vient de jouer le même nombre de coups, c’est à nouveau aux Blancs de jouer, comme avant le premier coup. Les droits de roque n’ont pas changé et aucune prise en passant n’est possible. La position initiale est donc revenue au sens du règlement.</p>

<p>Si le programme comparait seulement des images sans indiquer le camp au trait, il pourrait prendre pour égales deux situations où l’action suivante appartient à des joueurs différents. Un même emplacement des pièces permet, selon le trait, de poursuivre le jeu par des coups qui ne sont pas de la même couleur. L’état doit donc contenir cette information. Elle peut tenir dans une seule valeur, « blanc » ou « noir », mais elle modifie le sens du reste des données.</p>

<p>Si on rejoue exactement la séquence des cavaliers une deuxième fois, la position apparaît pour la troisième fois, en comptant celle du début. On voit ici pourquoi il faut conserver un historique ou un compteur. La dernière image ne porte pas en elle le nombre d’occurrences d’une position.</p>

</section>

<section class="dissertation-movement" aria-label="II. L’histoire peut modifier les coups encore disponibles">

<p class="dissertation-movement-start">Plaçons-nous maintenant dans une position pédagogique avec le roi blanc en e1, la tour blanche en h1, le roi noir en e8, aucune pièce sur f1 ou g1 et un droit de petit roque pour les Blancs. Supposons que la tour blanche aille en h2, que le roi noir se déplace en d8, que la tour revienne en h1 et que le roi noir revienne en e8. Les mêmes pièces occupent à nouveau les mêmes cases et les Blancs ont encore le trait. Mais leur tour a bougé. Le droit de roquer avec cette tour est perdu. L’état de départ et l’état final ne permettent donc pas les mêmes possibilités. Ce raisonnement suppose une position initiale de finale où le droit de roquer a réellement été conservé.</p>

<p>La prise en passant fournit un autre exemple. Après 1. e4 a6, 2. e5 d5, les Blancs peuvent prendre le pion noir en passant : leur pion quitte e5 et arrive en d6 tandis que le pion noir de d5 disparaît. Cette possibilité dépend du dernier coup. Elle doit être exercée immédiatement. La présence des deux pions sur des cases voisines ne suffit donc pas à décider si la prise est disponible. Pour la répétition au sens de la FIDE, la question pratique est de savoir si cette prise pouvait effectivement être jouée.</p>

<p>On peut stocker l’occupation des cases, le trait, les droits de roque et l’information relative à la prise en passant. Si une représentation encode une case de passage alors qu’aucune prise légale n’est possible, la clé utilisée pour reconnaître une répétition doit traiter ce détail correctement. Sinon, le programme peut déclarer différentes deux situations qui permettent les mêmes coups au sens de la règle.</p>

</section>

<section class="dissertation-movement" aria-label="III. Une clé d’état et un décompte jouent des rôles différents">

<p class="dissertation-movement-start">Le programme peut construire une clé à partir des données retenues et l’associer au nombre de fois où elle a été observée. Lorsque le coup suivant est joué, il construit une nouvelle clé et met à jour le décompte. Ce procédé permet de reconnaître l’apparition même si les coups qui l’ont précédée n’ont pas été exactement les mêmes. Une boucle répétée à l’identique est seulement un cas simple de retour.</p>

<p>Il reste à interpréter le nombre. L’article 9 des règles distingue notamment le cas de la troisième occurrence, qui donne matière à une réclamation correcte dans les conditions prévues, et celui de la cinquième occurrence, qui entraîne la nulle. Le programme peut donc savoir que la position est revenue sans confondre cette information avec la décision de clore la partie. La règle du jeu indique ce que le nombre rend possible à chaque étape.</p>

</section>

<section class="dissertation-movement" aria-label="Conclusion">

<p class="dissertation-movement-start">Un échiquier visible indique où se trouvent les pièces. Une position, au sens de la répétition, comprend aussi ce qui permet de déterminer les actions encore accessibles. Le trait, le roque et la prise en passant expliquent pourquoi l’historique peut changer le jeu sans changer le dessin. Le programme doit représenter cet état et compter séparément ses apparitions.</p>

</section>

</div>

## Sources

- Fédération internationale des échecs, [prise en passant, roque et répétition, articles 3 et 9](https://handbook.fide.com/chapter/e012023).
