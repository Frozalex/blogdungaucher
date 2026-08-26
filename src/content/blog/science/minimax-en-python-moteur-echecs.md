---
title: "Minimax en Python : le moteur commence à voir venir les coups"
excerpt: >-
  Le moteur glouton mettait son adversaire pat deux fois sur trois. Minimax corrige cela en supposant
  que l'adversaire joue bien. Vingt lignes suffisent, et le moteur trouve alors tous les mats en deux.
  Au prix d'une explosion combinatoire qui l'arrête net à la profondeur suivante.
publishDate: "2027-07-13"
category: science
featured: false
featuredRank: 99
readingTime: 9 min
pillar: Intelligence artificielle
tags:
  - Python
  - moteur d'échecs
  - minimax
  - recherche
  - programmation
  - algorithmique
  - tutoriel
  - informatique
seoTitle: "Implémenter minimax en Python pour un moteur d'échecs"
seoDescription: >-
  Coder l'algorithme minimax en Python pour un moteur d'échecs : récursion, scores de mat, distance au
  mat, ordre des tests, et pourquoi la profondeur 5 devient hors de portée sans élagage.
keyTakeaways:
  - Minimax suppose que l'adversaire joue son meilleur coup. C'est cette hypothèse, et non l'évaluation, qui fait disparaître les pats accidentels.
  - Un score de mat doit intégrer la distance à la racine, sinon le moteur voit le mat sans jamais le porter.
  - Le test « aucun coup légal » doit précéder la coupure de profondeur, sans quoi les mats à l'horizon sont évalués comme des positions ordinaires.
  - Sur 34 mats forcés en un et deux coups, le moteur les trouve tous.
  - Le nombre de positions visitées est multiplié par une trentaine à chaque demi-coup de profondeur supplémentaire. C'est ce mur que l'élagage alpha-bêta abat.
faq:
  - question: "Quelle est la différence entre minimax et négamax ?"
    answer: >-
      Aucune, sur le fond. Minimax écrit deux branches, une qui maximise pour les Blancs et une qui
      minimise pour les Noirs, en comptant du point de vue des Blancs. Négamax exploite l'identité
      $\min(a,b) = -\max(-a,-b)$ pour n'écrire qu'une seule branche, en comptant du point de vue du camp
      au trait. Le résultat est identique ; le code fait moitié moins de lignes.
  - question: "Pourquoi faut-il intégrer la distance dans le score de mat ?"
    answer: >-
      Sans elle, tous les mats valent la même chose, et le moteur n'a aucune raison de préférer mater en
      un coup plutôt qu'en trois. En pratique il tourne en rond : il voit le mat, joue un coup qui le
      conserve sans s'en rapprocher, et recommence indéfiniment. Compter <code>MAT - distance</code>
      rend le mat proche strictement préférable.
  - question: "À quelle profondeur faut-il chercher pour trouver un mat en 2 ?"
    answer: >-
      Trois demi-coups : le coup qui mate en deux, la réponse adverse, puis le coup qui mate. La règle
      générale est <strong>2n-1</strong> demi-coups pour un mat en n coups. Un mat en 3 demande donc une
      profondeur 5, ce qui, sans élagage, est déjà hors de portée d'un moteur en Python.
  - question: "Pourquoi mon moteur ne voit-il pas les mats alors que minimax est correct ?"
    answer: >-
      Vérifie l'ordre de tes tests. Si la coupure de profondeur (<code>if profondeur == 0</code>) précède
      le test d'absence de coup légal, une position de mat située exactement à l'horizon est évaluée
      comme une position ordinaire, et son score matériel est renvoyé au lieu du score de mat. Le mat
      existe dans l'arbre, mais le moteur ne le voit pas.
  - question: "Minimax garantit-il le meilleur coup ?"
    answer: >-
      Il garantit le meilleur coup <em>selon l'évaluation et la profondeur utilisées</em>, ce qui n'est
      pas la même chose. À profondeur finie avec une évaluation heuristique, minimax est optimal par
      rapport à ses propres hypothèses. Ses erreurs viennent toujours de l'évaluation ou de l'horizon,
      jamais de l'algorithme.
---

L'article précédent s'est terminé sur un chiffre embarrassant : notre moteur glouton, celui qui joue toujours le coup rapportant le plus de matériel, finit ses parties avec **vingt-huit pions d'avance** et n'en gagne qu'une sur quatre. Deux tiers de ses parties s'achèvent sur un pat, parce qu'il mange tout ce qui bouge jusqu'à ce que l'adversaire n'ait plus un seul coup légal.

Le problème n'est pas son évaluation. Le problème est qu'il ne regarde pas ce qui se passe **après**.

## L'hypothèse qui change tout

L'idée de [minimax](/fr/blog/minimax-aux-echecs/) tient en une phrase : le meilleur coup est celui qui, **en supposant que l'adversaire réponde du mieux qu'il peut**, mène à la meilleure position atteignable.

Cette hypothèse n'est pas anodine. Elle est même fausse en pratique, puisque l'adversaire joue rarement parfaitement. Mais elle est la seule qui soit sûre : un moteur qui suppose l'adversaire mauvais construit des pièges qui ne fonctionnent que si l'adversaire tombe dedans, et se fait punir dès qu'il joue quelqu'un de correct.

Formellement, c'est une récurrence sur la profondeur restante :

$$\text{minimax}(p, d) = \begin{cases} \text{éval}(p) & \text{si } d = 0 \\ \max_{c} \text{minimax}(\text{succ}(p,c), d-1) & \text{si Blanc joue} \\ \min_{c} \text{minimax}(\text{succ}(p,c), d-1) & \text{si Noir joue} \end{cases}$$

Et le pat disparaît tout seul, sans qu'on ait à en parler. Quand le glouton envisageait de rafler la dernière pièce noire, il évaluait la position à +2800 et s'arrêtait là. Minimax pousse un demi-coup plus loin, constate que l'adversaire n'a alors aucun coup légal, reconnaît un pat, et lui attribue un score de **zéro**. Le coup qui menait au pat devient soudain le pire de tous.

## Le code

Volontairement écrit à deux branches, au plus près de la définition. L'article suivant le condensera.

```python
def minimax(echiquier, profondeur, ply, compteur):
    """Score de la position, DU POINT DE VUE DES BLANCS."""
    compteur[0] += 1

    coups = echiquier.coups_legaux()
    if not coups:
        if echiquier.en_echec(echiquier.trait == "w"):
            return -(MAT - ply) if echiquier.trait == "w" else MAT - ply
        return 0  # pat

    if profondeur == 0:
        return materiel(echiquier)

    if echiquier.trait == "w":
        meilleur = -INFINI
        for coup in coups:
            echiquier.jouer(coup)
            meilleur = max(meilleur, minimax(echiquier, profondeur - 1, ply + 1, compteur))
            echiquier.annuler()
        return meilleur

    meilleur = INFINI
    for coup in coups:
        echiquier.jouer(coup)
        meilleur = min(meilleur, minimax(echiquier, profondeur - 1, ply + 1, compteur))
        echiquier.annuler()
    return meilleur
```

Vingt lignes. Trois détails les rendent correctes, et chacun est un bug classique quand il manque.

### L'ordre des tests

Le test « aucun coup légal » vient **avant** la coupure de profondeur. Ce n'est pas un choix de style.

Si tu écris `if profondeur == 0: return materiel(...)` en premier, une position de mat située exactement à l'horizon est évaluée comme une position ordinaire : le moteur renvoie son score matériel, ignore qu'elle est un mat, et passe à côté. Le mat existe pourtant dans l'arbre. Ce bug est particulièrement pénible parce que le moteur trouve les mats à profondeur 3 et les rate à profondeur 2, ce qui ressemble à un manque de profondeur plutôt qu'à une erreur.

### La valeur d'un mat

```python
MAT = 100_000
```

Cent mille centièmes de pion, soit mille pions. Il faut que le score d'un mat écrase toute considération matérielle : on ne renonce pas à un mat pour gagner une dame. Une valeur trop petite, disons 5 000, et le moteur préfère promouvoir cinq dames plutôt que mater.

### La distance au mat

C'est le paramètre `ply`, et c'est le plus subtil des trois. Le score n'est pas `MAT` mais `MAT - ply`, où `ply` est la distance à la racine.

Sans lui, tous les mats valent exactement la même chose, et le moteur n'a **aucune raison de préférer mater en un coup plutôt qu'en trois**. En pratique, il tourne en rond : il voit le mat, joue un coup qui le conserve sans s'en rapprocher, voit à nouveau le mat, et recommence. C'est le comportement qui rend fou, parce que le moteur annonce fièrement un mat pendant cinquante coups sans jamais le porter, jusqu'à la nulle par répétition.

## Ce que le moteur voit maintenant

```text
$ python3 recherche.py 4
profondeur 1 : a2a3  score      +0.00          20 nœuds
profondeur 2 : a2a3  score      +0.00         420 nœuds
profondeur 3 : a2a3  score      +0.00        9322 nœuds
profondeur 4 : a2a3  score      +0.00      206603 nœuds
```

Depuis la position de départ, toutes les profondeurs donnent le même score : zéro. C'est normal, notre évaluation ne compte que le matériel, et aucun camp ne peut en gagner en quatre demi-coups. Le coup choisi est le premier de la liste à égalité, faute de mieux.

Ces chiffres ne sont donc pas intéressants pour la qualité du jeu. Ils le sont pour autre chose : **20, puis 420, puis 9 322, puis 206 603**. À chaque demi-coup ajouté, le nombre de positions visitées est multiplié par une vingtaine. C'est le mur, et on y revient à la fin.

## La vérification : 43 mats forcés

Une évaluation ne peut pas être déclarée juste. Une recherche, si, au moins sur un point : **les mats forcés**. Il n'y a pas d'opinion sur un mat. Si le moteur cherche assez profond et qu'il est correct, il doit le trouver.

Le jeu d'essai se construit en balayant les 1 498 positions de partie déjà collectées et en demandant à Stockfish s'il y voit un mat forcé pour le camp au trait. On obtient 43 positions : 20 mats en un coup, 14 en deux, 9 en trois.

Et c'est là que ce test m'a appris quelque chose.

### Le faux échec qui valait un correctif

Ma première version demandait à Stockfish, en MultiPV, **la liste de tous les coups qui matent** dans chaque position. Le test vérifiait ensuite que le coup de notre moteur figurait dans cette liste.

Le moteur a échoué sur une position :

```text
Mats en 2 (profondeur 3) : 14/15
  1k6/2b1R3/p7/Pp1Q1B1p/1Pp1p2P/2P1B3/4P3/1N3KR1 w - - 1 46
    attendu un de b1a3 b1d2 d5c6 ... g1h1, obtenu e7d7 (mat en 2)
```

Dix-neuf coups matent en deux dans cette position, et notre moteur en a trouvé un vingtième, `Rd7`, absent de la liste. Deux hypothèses : soit notre recherche annonce un mat qui n'existe pas, soit la liste est incomplète.

Vérification à la main : après 1.Td7, les Noirs ont neuf coups. Sur 1...Fh2, 2.Db7 est mat, la dame étant protégée par la tour sur la septième rangée. Sur 1...Rc8, 2.Td8 est mat : c'est un **échec double**, du fou f5 et de la tour, et un échec double ne se pare jamais autrement qu'en bougeant le roi, lequel n'a plus de case. Le mat est réel.

La liste était donc fausse. En la redemandant à Stockfish à des profondeurs croissantes :

```text
depth 8 : 58 variantes, 19 matent en 2, e7d7 dedans ? False
depth 14: 58 variantes, 20 matent en 2, e7d7 dedans ? True
```

À profondeur 8, Stockfish n'avait pas encore résolu cette variante là. Mon oracle était incomplet, et il faisait échouer un moteur correct.

La leçon vaut plus que le test : **ne jamais vérifier par appartenance à une liste dont on ne contrôle pas l'exhaustivité.** La version corrigée ne demande plus de liste. Elle prend le coup que notre moteur a produit, quel qu'il soit, le joue, et demande à Stockfish si le camp au trait est maintenant maté en `n-1` coups. N'importe quel coup matant passe, y compris un que Stockfish ne jouerait pas.

```text
$ STOCKFISH=... python3 verifier_mats.py
43 mats forcés dans le jeu d'essai

Mats en 1 (profondeur 1) : 20/20         870 nœuds      0.2 s
Mats en 2 (profondeur 3) : 14/14      248593 nœuds     77.9 s

Tous les mats trouvés.
```

Au passage, note l'écart entre les deux lignes. Vingt mats en un coup coûtent 870 positions et deux dixièmes de seconde. Quatorze mats en deux coups en coûtent 248 593 et **soixante-dix-huit secondes**. Deux demi-coups de plus, trois cents fois plus de travail.

## Le mur

Tu auras remarqué que le test s'arrête aux mats en deux coups, alors que le jeu d'essai en contient neuf en trois coups. Ce n'est pas un oubli.

Un mat en trois demande une recherche à profondeur 5. J'ai lancé la mesure sur **une seule** de ces neuf positions, et je l'ai interrompue au bout de plusieurs minutes sans qu'elle ait abouti. L'ordre de grandeur se déduit de la ligne précédente : deux demi-coups de profondeur en plus multiplient le travail par environ 300, donc les 78 secondes du lot des mats en deux deviennent plusieurs heures. Pour neuf positions. Sur un moteur qui ne fait rien d'autre.

Les mats en trois ne sont donc pas hors de portée du programme : ils sont hors de portée de **cet algorithme**. Ils reviendront à l'article suivant, où ils passeront en quelques secondes.

C'est la limite structurelle de minimax, et elle n'a rien à voir avec Python. Le facteur de branchement aux échecs est d'une trentaine de coups en moyenne : chaque demi-coup supplémentaire multiplie l'arbre par trente. Un moteur qui cherche à profondeur $d$ visite de l'ordre de $30^d$ positions.

| Profondeur | Positions visitées (position de départ) |
|---|---|
| 1 | 20 |
| 2 | 420 |
| 3 | 9 322 |
| 4 | 206 603 |

Et pourtant, les moteurs cherchent couramment à vingt demi-coups. $30^{20}$ est un nombre à trente chiffres ; l'univers n'a pas assez d'atomes. Ils ne visitent donc évidemment pas tout l'arbre.

La clé n'est pas de chercher plus vite. Elle est de **ne pas chercher** l'écrasante majorité des branches, en démontrant qu'elles ne peuvent pas contenir le meilleur coup. Et le plus beau est que cette démonstration ne coûte presque rien, et qu'elle ne change **jamais** le résultat.

**Prochain article :** négamax et l'élagage alpha-bêta. Le même coup joué, les mêmes scores, un arbre dix fois plus petit.
