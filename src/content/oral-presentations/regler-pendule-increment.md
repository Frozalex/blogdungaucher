---
title: "Pourquoi ajouter quelques secondes après chaque coup change-t-il la façon de terminer une partie d’échecs ?"
excerpt: "Une suite récurrente permet d’expliquer la réserve de temps et la différence entre moyenne des coups et risque de perdre à la pendule."
specialty: "Mathématiques · EPPCS"
publishDate: "2027-01-02T02:00:00+01:00"
---

<div class="academic-dissertation">

<section class="dissertation-movement" aria-label="Introduction">

<p class="dissertation-movement-start">Une pendule d’échecs oblige chaque joueur à décider combien de temps il consacre à un coup. Dans une cadence avec incrément, quelques secondes sont ajoutées à sa réserve lorsqu’il a joué et pressé la pendule avant l’expiration. Une règle aussi courte paraît seulement allonger la partie. Elle change pourtant la façon dont un joueur peut conserver du temps ou rattraper une dépense. Comment ? J’écrirai l’évolution de la réserve, puis je comparerai des séquences dont les moyennes sont identiques et j’expliquerai en quoi cela modifie une décision en finale.</p>

</section>

<section class="dissertation-movement" aria-label="I. La réserve après un coup dépend de ce qui restait avant lui">

<p class="dissertation-movement-start">Considérons une cadence avec un incrément de dix secondes par coup pour un joueur blanc. Pour expliquer le principe, je prends une réserve de trente secondes au début de la séquence étudiée. Si les Blancs mettent huit secondes pour jouer et valident le coup à temps, il reste vingt-deux secondes auxquelles s’ajoutent dix secondes. La réserve devient trente-deux. Si, au coup d’après, ils dépensent quinze secondes, la réserve descend à dix-sept avant l’ajout et atteint vingt-sept après celui-ci.</p>

<p>On peut écrire cette évolution en une phrase mathématique. La réserve après le prochain coup est égale à la réserve actuelle, diminuée du temps consommé et augmentée de l’incrément. Cette égalité est valable si le joueur a pu terminer le coup sans dépasser la réserve disponible. En répétant la relation, le temps après plusieurs coups est le temps de départ, plus le nombre de coups multiplié par dix, moins la somme des temps dépensés.</p>

<p>Cette relation éclaire le sens d’une moyenne. Si, sur une séquence jouée entièrement, les Blancs dépensent moins de dix secondes par coup en moyenne, leur réserve a augmenté. S’ils en dépensent davantage, elle a diminué. La moyenne donne donc le bilan de la séquence, mais elle n’indique pas ce qui se passe pendant chacun de ses coups.</p>

<p>Pour fixer les termes, je peux représenter une réserve sur une frise avec un seul joueur. À gauche se trouve le temps dont il dispose avant de réfléchir. À droite apparaissent le temps restant avant qu’il presse la pendule et celui qui sera disponible lors de son prochain tour. Entre ces deux valeurs, la pendule a changé de camp et l’incrément a été compté. Le temps pris par l’adversaire intervient dans la durée vécue de la partie, mais il ne se soustrait pas de la réserve du joueur qui attend normalement son tour. Si je mélange ces deux durées, je ne peux plus expliquer pourquoi un joueur dont la partie dure quatre-vingt-dix minutes peut avoir dépensé beaucoup moins de temps sur sa propre pendule. Le modèle suit une réserve individuelle à des instants bien définis.</p>

</section>

<section class="dissertation-movement" aria-label="II. Deux séquences de même moyenne ne présentent pas le même risque">

<p class="dissertation-movement-start">Je compare deux séquences fictives avec vingt secondes de réserve et dix secondes d’incrément. Dans la première, les Blancs prennent sept secondes, sept secondes, puis vingt-et-une secondes. Après le premier coup, la réserve passe à vingt-trois, puis à vingt-six après le deuxième. Ils disposent donc d’assez de temps pour le troisième et terminent avec quinze secondes. Le calcul total donne bien vingt, plus trente, moins trente-cinq.</p>

<p>Dans la deuxième séquence, les trois durées envisagées sont les mêmes, mais la plus longue arrive en premier. Le joueur voudrait réfléchir vingt-et-une secondes dès son premier coup. Il ne dispose que de vingt, et l’incrément n’arrive qu’après un coup effectué à temps. Il dépasse la réserve avant de pouvoir profiter des coups rapides suivants. Les deux listes ont la même moyenne calculée sur le papier, mais une seule peut être exécutée dans son intégralité.</p>

<p>La différence tient à une condition que le bilan final ne montre pas. À chaque étape, la somme des temps déjà dépensés doit rester compatible avec les ajouts déjà reçus. On ne peut pas dépenser d’avance le temps qu’un prochain coup pourrait rendre. On peut représenter le principe avec trois barres de durée, puis déplacer visuellement la plus longue vers le début. Le seul changement d’ordre suffit à faire apparaître le risque.</p>

<p>À partir de cette frise, on peut calculer un seuil sans connaître le bilan final. Dans la première séquence, la réserve juste avant chaque dépense vaut vingt, vingt-trois, puis vingt-six secondes. Le joueur garde donc une marge de treize secondes sur le premier coup, seize sur le deuxième et cinq sur le dernier. La marge la plus faible se trouve au moment où le temps de réflexion approche le plus de la réserve disponible, même si la réserve après le troisième coup vaut quinze secondes. Cette différence permet de poser une question pratique : quel est le moment où l’on risque le plus de perdre à la pendule ? Ce n’est pas forcément celui où le total après le coup est le plus bas. Pour l’estimer, il faut observer la réserve avant de recevoir l’ajout suivant.</p>

</section>

<section class="dissertation-movement" aria-label="III. L’incrément donne une valeur stratégique aux coups simples">

<p class="dissertation-movement-start">Lorsqu’un joueur sait exactement comment répondre à une menace, il peut jouer en moins de dix secondes et reconstituer une partie de sa réserve. Il dispose alors de plus de temps pour une décision où plusieurs réponses s’affrontent. Dans une finale, par exemple, poursuivre un plan connu peut coûter peu de réflexion, alors qu’un échange de tours demande de vérifier si la finale de pions obtenue est favorable. Le temps gagné plus tôt devient disponible pour cette comparaison.</p>

<p>Cela ne veut pas dire que jouer vite est toujours préférable quand un coup semble facile. Si une réponse adverse a été omise, une réserve plus grande ne répare pas automatiquement l’erreur. Le joueur compare deux coûts : celui des secondes consommées et celui d’une vérification négligée. Plus la position offre de réponses critiques, plus le second coût peut devenir important. Un entraînement spécifique consisterait à distinguer les coups où une vérification courte suffit et ceux où la position justifie de dépenser une part de la réserve.</p>

<p>On peut comparer les premières secondes de deux cadences fictives en gardant la même position au départ. Dans la première, le joueur dispose de trente secondes et n’en récupère jamais. S’il joue trois fois en six secondes, il lui en reste douze. Dans la seconde, il dispose aussi de trente secondes mais reçoit dix secondes par coup terminé à temps. Après les trois mêmes dépenses, il dispose de quarante-deux secondes. Les premiers coups simples ont ici un effet que leur rapidité seule ne ferait pas voir. Une méthode d’entraînement peut demander au joueur de repérer les positions où une réponse se vérifie rapidement et celles qui exigent un examen plus long. Une dépense volontaire devient plus compréhensible si l’on sait de quelle marge elle part et ce qui reste à traiter ensuite.</p>

</section>

<section class="dissertation-movement" aria-label="Conclusion">

<p class="dissertation-movement-start">L’incrément change la fin d’une partie parce qu’il donne à chaque coup joué à temps la possibilité de reconstruire la réserve. La relation récurrente explique la différence entre un bon bilan moyen et une séquence effectivement jouable. Pour le joueur, l’enjeu est d’allouer un budget de secondes à des décisions dont la difficulté n’arrive pas toujours au moment le plus favorable.</p>

</section>

</div>

## Sources

- Fédération internationale des échecs, [lois du jeu, pendule et contrôle de temps à l’article 6](https://handbook.fide.com/chapter/e012023).
