---
title: "Ordonner les coups : l'optimisation qui ne touche pas à l'algorithme"
excerpt: >-
  Alpha-bêta ne peut couper que s'il a déjà trouvé quelque chose de bon. Lui présenter les coups
  prometteurs en premier ne change pas une ligne de la recherche et divise pourtant l'arbre. Trois
  heuristiques suffisent, dont une tient en une multiplication par dix.
publishDate: "2027-07-27"
category: science
featured: false
featuredRank: 99
readingTime: 10 min
pillar: Intelligence artificielle
tags:
  - Python
  - moteur d'échecs
  - alpha-bêta
  - optimisation
  - MVV-LVA
  - recherche
  - tutoriel
  - informatique
seoTitle: "Ordonnancement des coups d'un moteur d'échecs : MVV-LVA, killers"
seoDescription: >-
  Comment ordonner les coups pour rendre l'élagage alpha-bêta efficace : MVV-LVA sur les prises, coups
  killers, heuristique d'historique. Mesure du gain en nœuds et en profondeur atteinte.
keyTakeaways:
  - L'efficacité d'alpha-bêta dépend entièrement de l'ordre des coups, pas de l'algorithme.
  - MVV-LVA classe les prises en pondérant la victime dix fois plus que l'agresseur, ce qui suffit à ordonner correctement toutes les combinaisons.
  - Les coups killers sont les coups tranquilles ayant provoqué une coupure au même étage ailleurs dans l'arbre.
  - "L'heuristique d'historique récompense par le carré de la profondeur : une coupure haute vaut bien plus qu'une coupure dans les feuilles."
  - Trier coûte du temps à chaque nœud. La seule mesure qui compte est donc la profondeur atteinte à budget de temps fixé, pas le nombre de nœuds.
faq:
  - question: "Qu'est-ce que MVV-LVA ?"
    answer: >-
      <em>Most Valuable Victim, Least Valuable Attacker</em> : essayer d'abord de capturer la pièce la
      plus chère avec la moins chère. Le score s'écrit
      <code>10 × valeur(victime) - valeur(agresseur)</code> ; le facteur dix garantit que la valeur de la
      victime domine toujours, si bien que « dame prise par pion » passe avant « pion pris par dame »
      quelles que soient les pièces en jeu.
  - question: "Qu'est-ce qu'un coup killer ?"
    answer: >-
      Un coup <strong>tranquille</strong> (sans prise) qui a provoqué une coupure alpha-bêta à un autre
      endroit de l'arbre, au même étage. L'idée est qu'un coup qui réfute une ligne en réfute souvent une
      autre voisine : la même fourchette, la même menace de mat. On en garde deux par étage, et on les
      essaie juste après les prises.
  - question: "Pourquoi l'heuristique d'historique récompense-t-elle par le carré de la profondeur ?"
    answer: >-
      Parce qu'une coupure trouvée près de la racine élimine un sous-arbre gigantesque, alors qu'une
      coupure trouvée dans les feuilles n'élimine presque rien. Pondérer par <code>profondeur²</code>
      fait que les coups utiles en haut de l'arbre dominent la table, sans qu'il soit nécessaire de la
      remettre à zéro souvent.
  - question: "Trier les coups ne coûte-t-il pas plus cher que ce qu'il rapporte ?"
    answer: >-
      Trier une trentaine de coups à chaque nœud n'est pas gratuit, et c'est pourquoi la bonne mesure
      n'est pas le nombre de nœuds mais la <strong>profondeur atteinte à temps fixé</strong>. En
      pratique, le gain d'élagage domine très largement le coût du tri, parce qu'un nœud évité fait
      économiser tout son sous-arbre.
  - question: "L'ordonnancement change-t-il le coup joué ?"
    answer: >-
      Il ne change jamais le score renvoyé à profondeur égale : c'est le même alpha-bêta, donc la même
      garantie qu'à l'article précédent. Il peut renvoyer un autre coup parmi des ex aequo. En revanche,
      il change bel et bien le jeu du moteur en pratique, parce qu'à temps égal il permet de chercher
      plus profond.
---

L'[article précédent](/fr/blog/negamax-et-elagage-alpha-beta-python/) s'est terminé sur un constat frustrant. L'élagage alpha-bêta nous a fait gagner un facteur 22 sur une position, alors que la théorie en autorise beaucoup plus. Le calcul de Knuth et Moore dit qu'avec un ordre de coups parfait, le nombre de positions visitées passe de $b^d$ à environ $b^{d/2}$, ce qui revient à doubler la profondeur atteignable.

Nous en sommes loin, pour une raison qui n'a rien d'algorithmique : nos coups sont examinés dans l'ordre où le générateur les produit, c'est à dire par case de départ, de a8 vers h1. Cet ordre n'a **aucun rapport** avec la qualité des coups.

Cet article ne change pas une ligne de la recherche. Il change seulement l'ordre dans lequel on lui présente les coups.

## Pourquoi l'ordre décide de tout

Rappelle-toi le mécanisme de la coupure. Alpha-bêta abandonne une branche dès qu'un coup dépasse `beta`, c'est à dire dès qu'il est **trop bon** pour que l'adversaire laisse la partie y arriver.

Pour cela, encore faut-il avoir déjà trouvé quelque chose de bon. Si le meilleur coup est examiné en premier, `alpha` monte immédiatement, la fenêtre se resserre, et tous les coups suivants sont réfutés en quelques nœuds. Si le meilleur coup est examiné en dernier, `alpha` reste bas pendant toute l'exploration, aucune coupure ne se déclenche, et l'on visite exactement le même arbre que minimax, en plus lent.

Le problème est donc : **deviner quels coups sont bons, avant de les avoir cherchés**. Ce qui ressemble à un paradoxe, et se règle avec trois heuristiques grossières.

## MVV-LVA : les prises, de la plus juteuse à la plus risquée

*Most Valuable Victim, Least Valuable Attacker*. Capturer la pièce la plus chère avec la moins chère.

L'intuition est immédiate : prendre une dame avec un pion est presque toujours excellent, prendre un pion avec une dame est presque toujours douteux. Reste à l'écrire de façon à ce que toutes les combinaisons se classent correctement.

```python
return 1_000_000 + 10 * VALEURS[victime.upper()] - VALEURS[agresseur.upper()]
```

Le facteur **dix** est ce qui fait fonctionner la formule. Il garantit que la valeur de la victime domine toujours celle de l'agresseur : la pire des prises d'une dame (dame prise par dame, $10 \times 900 - 900 = 8100$) reste classée au dessus de la meilleure des prises d'une tour (tour prise par pion, $10 \times 500 - 100 = 4900$). Sans ce facteur, les deux critères se mélangeraient.

C'est une heuristique franchement rudimentaire. Elle ignore complètement le fait que la case d'arrivée soit défendue : « dame prend pion défendu par pion » est classée avant beaucoup de bons coups. Il existe mieux, l'échange statique (*SEE*), qui simule toute la suite de prises sur une case. Mais MVV-LVA se calcule en deux lectures de tableau, et l'essentiel du bénéfice est déjà là.

## Les killers : ce qui réfute une ligne en réfute une autre

Les prises classées, restent les coups tranquilles, c'est à dire l'écrasante majorité. Comment les trier ?

L'observation qui fonde l'heuristique dite des *killer moves* : quand un coup provoque une coupure à un endroit de l'arbre, il provoque **souvent la même coupure dans les positions voisines**. Une fourchette de cavalier qui réfute une variante réfute généralement aussi la variante d'à côté, où l'adversaire a joué autre chose ailleurs.

```python
def retenir_killer(self, coup, ply):
    etage = self.killers[ply]
    if coup != etage[0]:
        etage[1] = etage[0]
        etage[0] = coup
```

Deux killers par étage, gérés comme une pile minuscule. Un détail compte : ils sont indexés par **`ply`**, la distance à la racine, et non par la profondeur restante. Ce qui réfute une ligne à trois demi-coups de la racine a des chances de réfuter une autre ligne au même endroit de la partie, pas dans un tout autre secteur de l'arbre.

Second détail : on ne retient que les coups **tranquilles**. Les prises sont déjà bien classées par MVV-LVA ; les mémoriser en plus ne ferait que diluer l'information utile.

## L'historique : une mémoire longue

Les killers sont une mémoire locale, deux coups par étage. L'heuristique d'historique en est la version globale : un compteur par couple (case de départ, case d'arrivée), incrémenté à chaque coupure, valable pour toute la recherche.

```python
def recompenser(self, coup, profondeur):
    cle = (coup.depart, coup.arrivee)
    self.historique[cle] = self.historique.get(cle, 0) + profondeur * profondeur
```

La récompense est le **carré de la profondeur restante**, pas la profondeur. La raison est une question d'échelle : une coupure trouvée près de la racine élimine un sous-arbre gigantesque, une coupure trouvée juste au dessus des feuilles n'élimine presque rien. Sans cette pondération, la table serait noyée sous les milliers de coupures sans intérêt des étages profonds.

L'ensemble donne une fonction de tri qui tient en quinze lignes :

```python
def score(coup):
    victime = echiquier.cases[coup.arrivee]
    agresseur = echiquier.cases[coup.depart]

    if victime is VIDE and agresseur in "Pp" and coup.arrivee == echiquier.en_passant:
        return 1_000_000 + 10 * VALEURS["P"] - VALEURS["P"]
    if victime is not VIDE:
        return 1_000_000 + 10 * VALEURS[victime.upper()] - VALEURS[agresseur.upper()]
    if coup.promotion:
        return 900_000 + VALEURS[coup.promotion.upper()]
    if coup in contexte.killers[ply]:
        return 800_000
    return contexte.historique.get((coup.depart, coup.arrivee), 0)
```

Le cas de la prise en passant mérite sa ligne : la case d'arrivée est vide, donc le test `victime is not VIDE` la manquerait, et elle serait classée parmi les coups tranquilles. Ce n'est pas dramatique, mais c'est exactement le genre d'oubli qui fait qu'une heuristique « ne marche pas aussi bien que dans l'article ».

## Le bug que cette ligne a réveillé

```python
if coup in contexte.killers[ply]:
```

Cette ligne, apparemment inoffensive, a fait planter le moteur dès le premier essai :

```text
AttributeError: 'NoneType' object has no attribute 'depart'
```

La table des killers est initialisée à `None`, puisqu'aucune coupure n'a encore eu lieu. L'opérateur `in` compare donc notre coup à `None`, ce qui appelle la méthode `__eq__` écrite à l'article 2 :

```python
def __eq__(self, autre):
    return (self.depart, self.arrivee, self.promotion) == (
        autre.depart, autre.arrivee, autre.promotion
    )
```

Elle suppose que l'autre opérande est un coup. Elle a tenu sept articles sans broncher, parce qu'on ne comparait jusqu'ici que des coups à des coups.

Le correctif tient en deux lignes, et il vaut la peine de comprendre pourquoi ce n'est pas `return False` :

```python
def __eq__(self, autre):
    if not isinstance(autre, Coup):
        return NotImplemented
    return (self.depart, self.arrivee, self.promotion) == (
        autre.depart, autre.arrivee, autre.promotion
    )
```

`NotImplemented` dit à Python « je ne sais pas comparer ces deux objets, essaie autrement ». Python tente alors la comparaison symétrique, échoue également, et retombe sur l'égalité d'identité, qui vaut `False`. Avec `return False`, on obtiendrait le même résultat ici, mais on interdirait à une classe future de définir sa propre égalité avec un `Coup`. C'est la convention Python, et elle coûte un mot.

## La mesure

Deux chiffres sont possibles, et ils ne racontent pas la même histoire.

Le premier est le **nombre de nœuds à profondeur fixe**. C'est la mesure propre : le score renvoyé doit rester identique, seul l'arbre exploré change. Mais elle flatte l'ordonnancement, parce qu'elle ne compte pas le coût du tri lui-même.

Le second est la **profondeur atteinte à budget de temps fixé**. C'est la mesure honnête, et la seule qui compte pour un joueur. Trier une trentaine de coups à chaque nœud se paie, et il faut vérifier que le jeu en vaut la chandelle.

```text
$ python3 banc_ordonnancement.py 4 5 12
12 positions

À profondeur 4 fixe
  sans tri         405660 nœuds     251.7 s
  avec tri          66886 nœuds      33.8 s
  gain : 6.1x sur les nœuds, 7.5x sur le temps
  scores identiques : 12/12

Avec un budget de 5 s par position
  sans tri   profondeur moyenne 3.58  (min 3, max 6)
  avec tri   profondeur moyenne 4.08  (min 3, max 6)
  6 demi-coups de profondeur gagnés au total sur 12 positions
```

Six fois moins de positions visitées pour le même résultat, et les scores restent identiques : l'ordonnancement n'a rien changé à ce que le moteur pense, seulement à ce qu'il lui en coûte.

Un détail mérite d'être relevé : le gain en temps (7,5x) dépasse le gain en nœuds (6,1x), alors que le tri coûte du travail supplémentaire à chaque nœud. Ce n'est pas une anomalie. Les nœuds éliminés par l'élagage ne sont pas des nœuds moyens : ce sont ceux du fond de l'arbre, les plus nombreux et les plus chers à traiter puisque chacun exige une génération complète des coups. Économiser un nœud profond vaut plus qu'économiser un nœud proche de la racine.

## Une demi-profondeur, et pourquoi c'est déjà beaucoup

Le second tableau est nettement moins spectaculaire, et c'est lui qui dit la vérité.

Six fois moins de nœuds ne donne pas six fois plus de profondeur, mais **une demi-profondeur** en moyenne : 3,58 sans tri, 4,08 avec. Sur douze positions, six demi-coups gagnés au total.

La déception est arithmétique. Avec un facteur de branchement effectif d'environ 5 après élagage, gagner un demi-coup complet de profondeur exige de diviser le travail par 5. Notre facteur 6 nous en offre donc à peine plus d'un, et encore, pas sur toutes les positions : sur les douze testées, la profondeur atteinte ne bouge pas partout.

Et pourtant, une demi-profondeur, en pratique, c'est énorme. C'est la différence entre voir la fourchette de cavalier et ne pas la voir. Chaque demi-coup de vision supplémentaire vaut, dans les estimations courantes, entre 50 et 100 points Elo à ce niveau de jeu.

C'est aussi la leçon générale de tout le travail d'optimisation qui suit : **les gains se comptent en facteurs multiplicatifs sur les nœuds et se paient en fractions de profondeur.** Un moteur qui gagne un facteur 1 000 sur son arbre gagne quatre profondeurs, pas mille.

## La limite de cette mesure, et ce que le prochain article corrige

Il y a une maladresse dans la façon dont ce banc mesure la profondeur atteinte en cinq secondes, et elle est instructive.

Le programme essaie la profondeur 1, puis 2, puis 3, en cumulant les temps, et s'arrête dès que le cumul dépasse le budget. Il garde la dernière profondeur **entièrement terminée**. Pourquoi ne pas simplement lancer une recherche profonde et l'arrêter au bout de cinq secondes ?

Parce qu'une recherche interrompue ne renvoie rien d'exploitable. Si le moteur a examiné douze coups sur trente-cinq quand le temps tombe, le meilleur de ces douze n'est pas le meilleur des trente-cinq, et rien ne garantit qu'il soit même correct : les vingt-trois autres n'ont pas été vus.

Ce qui laisse notre moteur avec un défaut rédhibitoire pour un vrai joueur : **il ne sait pas s'arrêter**. On lui donne une profondeur, il rend un coup quand il a fini, que cela prenne une seconde ou dix minutes. Aucune interface, aucune cadence de jeu ne fonctionne ainsi.

**Prochain article :** l'approfondissement itératif, qui consiste à refaire tout le travail à chaque profondeur, et qui est pourtant plus rapide que de chercher directement à la profondeur finale.
