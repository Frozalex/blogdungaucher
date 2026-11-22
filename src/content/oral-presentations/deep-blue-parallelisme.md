---
title: "En quoi plusieurs processeurs ont-ils changé la manière dont Deep Blue jouait aux échecs ?"
excerpt: "Le match contre Kasparov permet de distinguer partage du calcul, choix des variantes et vitesse réellement gagnée."
specialty: "NSI · Sciences de l’ingénieur"
publishDate: "2027-03-13T02:00:00+01:00"
---

<div class="academic-dissertation">

<section class="dissertation-movement" aria-label="Introduction">

<p class="dissertation-movement-start">En 1997, Deep Blue remporte contre Garry Kasparov un match en six parties sur le score de trois points et demi à deux et demi. On pourrait résumer l’événement en affirmant que la machine calcule plus vite. Mais un moteur d’échecs doit aussi choisir les variantes qu’il cherche et déterminer comment répartir le travail entre ses composants. En quoi plusieurs processeurs transforment-ils sa façon de jouer ? Je distinguerai la structure d’un calcul de variantes, le partage possible de ce calcul et les limites d’une explication qui s’appuierait uniquement sur la vitesse.</p>

</section>

<section class="dissertation-movement" aria-label="I. Une machine d’échecs répartit son temps entre plusieurs coups possibles">

<p class="dissertation-movement-start">Pour analyser une position, un moteur peut partir de plusieurs coups légaux. À partir de chacun, il regarde les réponses possibles de l’adversaire et poursuit le raisonnement. Cela forme un arbre, dans lequel les nœuds représentent des positions et les branches des décisions. Si l’on limite la recherche, le moteur doit aussi évaluer les positions où il s’arrête. Lorsque la partie n’est pas terminée, cette évaluation utilise des indices, par exemple le matériel, la sécurité du roi ou la possibilité de développer des pièces.</p>

<p>Ponctuellement, un coup peut demander plus d’attention qu’un autre. Après 1. e4 e5, les Blancs peuvent développer le cavalier g1 en f3 ou le fou f1 en c4. Dans la première branche, le cavalier attaque le pion e5. Dans la seconde, le fou vise le voisinage du roi noir le long de sa diagonale. Les réponses des Noirs ne répondent pas nécessairement au même problème. Examiner sérieusement chaque branche peut demander de suivre des suites différentes. Une estimation faite en regardant seulement le premier mouvement perdrait cette information.</p>

<p>Un moteur doit donc arbitrer avec une ressource limitée : le temps. S’il analyse plus loin, il peut voir certaines conséquences qui demeuraient hors de portée. S’il consacre son budget à des variantes peu utiles, une partie de ce gain disparaît. Le matériel permet d’aller plus vite, mais l’organisation de la recherche décide au moins en partie de ce que cette vitesse permet de voir.</p>

<p>Il est utile de distinguer ce qui est nécessaire pour choisir un coup et ce qui est nécessaire pour le classer précisément parmi tous les autres. Si une branche mène immédiatement à la perte du roi au sens du mat, la recherche peut établir une limite sévère pour ce choix. Pour comparer deux décisions qui restent jouables, une analyse plus profonde peut être nécessaire. Cette inégalité de travail donne une raison stratégique de ne pas attribuer par avance à chaque coup la même quantité de calcul. On peut d’abord explorer les coups qui paraissent les plus prometteurs, puis réutiliser ce qu’ils révèlent pour décider jusqu’où examiner les suivants. Le choix de l’ordre de recherche affecte ainsi la répartition du travail.</p>

</section>

<section class="dissertation-movement" aria-label="II. Le parallélisme fait gagner du temps si les tâches se répartissent bien">

<p class="dissertation-movement-start">Supposons que quatre branches demandent, dans un modèle fictif, deux, deux, trois et neuf secondes. Avec un seul processeur et en ignorant tous les autres coûts, la durée totale vaut seize secondes. Si quatre processeurs traitent les branches simultanément, trois terminent rapidement. Il reste tout de même à attendre la branche à neuf secondes, puisque le résultat final doit les comparer. La durée devient neuf secondes, moins de seize, mais beaucoup plus que les quatre secondes qu’on obtiendrait en divisant mécaniquement le total par quatre.</p>

<p>Pour améliorer ce partage, on pourrait découper la branche difficile en sous-branches. Cela exige de distribuer des données, d’assembler les réponses et parfois de communiquer une nouvelle information dès qu’elle change la suite du calcul. Si une variante déjà explorée montre qu’un coup est insuffisant, continuer toutes ses autres branches peut devenir inutile. Deux processeurs qui n’échangent rien risquent d’accomplir du travail que la découverte d’un seul aurait permis d’éviter. À l’inverse, des échanges trop fréquents peuvent coûter du temps.</p>

<p>Dans leur présentation de Deep Blue, Campbell, Hoane et Hsu mentionnent à la fois des circuits dédiés à la recherche échiquéenne, plusieurs niveaux de parallélisme et des méthodes qui prolongent certaines variantes. Leur description invite ainsi à examiner la distribution des tâches et le choix du travail à poursuivre, en plus des performances du matériel.</p>

<p>Dans le modèle à quatre branches, si l’on sépare la tâche de neuf secondes en trois morceaux indépendants de trois secondes, il existe une meilleure répartition. Trois processeurs prennent chacun un morceau. Le quatrième peut traiter la branche de trois secondes. Au bout de trois secondes, il reste les deux branches de deux secondes, que deux processeurs peuvent prendre en parallèle. Le calcul se termine alors en cinq secondes dans cette organisation idéale. Ce nombre suppose qu’on peut découper et communiquer sans coût. Il donne une référence à laquelle comparer un essai réel. Il montre aussi pourquoi ajouter des processeurs et redessiner les tâches sont deux décisions différentes.</p>

</section>

<section class="dissertation-movement" aria-label="III. Un match mesure le résultat d’un système complet">

<p class="dissertation-movement-start">Le score de 1997 montre que Deep Blue a gagné ce match contre le champion du monde. Pour attribuer une part précise au parallélisme, il faudrait comparer des systèmes aussi proches que possible, en changeant le nombre de processeurs, puis observer la quantité de calcul utile, la qualité des décisions et les résultats. Un match à lui seul ne réalise pas cette comparaison. Entre les rencontres de 1996 et 1997, IBM indique avoir aussi amélioré l’évaluation et les bases utilisées pour certaines finales.</p>

<p>Les échecs offrent tout de même un point d’appui clair. Le système doit produire des coups dans un cadre partagé, et ses choix se mesurent à des réponses adverses. Le résultat donne donc une preuve de capacité dans des conditions de compétition définies. Il ne révèle pas comment la machine traiterait une tâche dépourvue des mêmes règles ou du même type de recherche.</p>

<p>Mesurer la vitesse d’un moteur peut vouloir dire compter des positions par seconde, chronométrer le temps nécessaire pour atteindre un résultat donné ou suivre la proportion de bonnes décisions sur un ensemble de positions. Ces mesures ne sont pas équivalentes. Un moteur peut visiter moins de positions et mieux choisir celles qu’il approfondit. On peut s’en rendre compte avec une série pédagogique mêlant des mats en un et des positions où le danger n’apparaît qu’après plusieurs réponses. Le premier type met surtout en jeu la reconnaissance d’une issue immédiate. Le second donne davantage de poids à l’organisation de la recherche. Ce contraste évite de prendre une mesure de débit pour un jugement complet sur le jeu.</p>

<p>Le modèle à quatre branches suppose aussi que tout le monde commence au même instant. Si la position et une première évaluation ne sont disponibles qu’après une phase commune, les processeurs ne peuvent pas accélérer cette partie du travail de la même façon. Ajouter une seconde de travail initial commun porterait notre seconde estimation de cinq à six secondes, même si la répartition des branches restait idéale. Cet exemple sépare le temps que l’on peut partager de celui que toute organisation doit réserver au départ.</p>

</section>

<section class="dissertation-movement" aria-label="Conclusion">

<p class="dissertation-movement-start">Plusieurs processeurs permettent à Deep Blue d’examiner simultanément une partie des variantes. Leur efficacité dépend de la façon dont on partage le travail, dont on transmet les résultats et dont on évite de chercher inutilement. Le match de 1997 montre ce que l’ensemble du système pouvait accomplir dans un cadre donné. Il invite à distinguer vitesse brute et organisation du calcul.</p>

</section>

</div>

## Sources

- IBM, [histoire de Deep Blue et comptes rendus des matches de 1996 et 1997](https://www.ibm.com/history/deep-blue).
- Murray Campbell, A. Joseph Hoane Jr. et Feng-hsiung Hsu, [*Deep Blue*, résumé de l’article](https://research.ibm.com/publications/deep-blue), 2002.
