---
title: "Générer les coups légaux en Python : la moitié d'un moteur d'échecs"
excerpt: >-
  Trouver les coups d'une pièce est facile. Éliminer ceux qui laissent son propre roi en échec l'est
  beaucoup moins, et c'est là que se logent presque tous les bugs. Sur 1 498 positions réelles,
  10,5 % des coups produits par un générateur naïf sont illégaux.
publishDate: "2027-06-15"
category: science
featured: false
featuredRank: 99
readingTime: 13 min
pillar: Intelligence artificielle
tags:
  - Python
  - moteur d'échecs
  - programmation
  - génération de coups
  - roque
  - prise en passant
  - tutoriel
  - informatique
seoTitle: "Générer les coups légaux aux échecs en Python : le guide complet"
seoDescription: >-
  Comment générer les coups légaux d'une position d'échecs en Python : déplacements, pion, roque,
  prise en passant, promotions, et le filtre de légalité qui élimine les coups laissant le roi en échec.
keyTakeaways:
  - Un coup pseudo-légal respecte le déplacement de la pièce. Un coup légal ne laisse pas son propre roi en échec. L'écart est de 10,5 % sur des positions réelles.
  - La légalité paresseuse consiste à jouer le coup, regarder si le roi est pris, puis annuler. Elle est lente mais juste par construction.
  - Le pion concentre à lui seul quatre règles que ne partage aucune autre pièce, dont la promotion qui produit quatre coups et non un.
  - Pour savoir si une case est attaquée, on part de la case et on remonte les directions, au lieu d'énumérer tous les coups adverses.
  - Une prise en passant peut mettre son propre roi en échec en dégageant deux cases d'un coup. Aucun test spécifique ne l'attrape, seul le filtre général y parvient.
faq:
  - question: "Quelle est la différence entre un coup pseudo-légal et un coup légal ?"
    answer: >-
      Un coup <strong>pseudo-légal</strong> respecte le déplacement de la pièce : le cavalier fait un L,
      le fou reste sur sa diagonale, le pion ne recule pas. Un coup <strong>légal</strong> est un coup
      pseudo-légal qui, en plus, ne laisse pas son propre roi en échec. La différence n'est pas
      marginale : sur 1 498 positions issues de vraies parties, 10,5 % des coups pseudo-légaux sont
      illégaux, et plus de la moitié des positions sont concernées.
  - question: "Pourquoi ne pas détecter les clouages directement ?"
    answer: >-
      C'est possible, et c'est ce que font les moteurs rapides : on calcule les pièces clouées une fois
      par position, puis on restreint leurs coups. Mais cette approche doit traiter à part le roi, les
      échecs multiples, et surtout la prise en passant qui dégage deux cases d'un coup. La légalité
      paresseuse (jouer, regarder, annuler) est environ sept fois plus lente et juste par construction :
      c'est le bon compromis tant que la justesse n'est pas acquise.
  - question: "Combien de coups légaux y a-t-il dans la position de départ ?"
    answer: >-
      Vingt : seize poussées de pions (une ou deux cases pour chacun des huit) et quatre coups de
      cavalier. C'est la première valeur de <code>perft</code>, et le premier contrôle que doit passer
      tout générateur de coups.
  - question: "Une promotion compte-t-elle pour un coup ou pour quatre ?"
    answer: >-
      Pour quatre. Un pion arrivant sur la dernière rangée peut devenir dame, tour, fou ou cavalier, et
      ce sont quatre coups distincts qui mènent à quatre positions différentes. Les oublier fausse
      immédiatement les comptages de <code>perft</code>, et prive le moteur de la sous-promotion en
      cavalier, qui est parfois le seul coup gagnant.
  - question: "Le roque peut-il traverser une case attaquée ?"
    answer: >-
      Non. Le roi ne peut ni être en échec avant de roquer, ni traverser une case attaquée, ni arriver
      sur une case attaquée. En revanche la <strong>tour</strong>, elle, peut parfaitement traverser une
      case attaquée : lors du grand roque, la case b1 peut être sous le feu adverse sans que cela gêne.
      C'est une source d'erreur classique.
---

À ce stade de la série, tu as un [échiquier qui tient une position et sait la restaurer](/fr/blog/representer-un-echiquier-en-python/). Il ne sait pas encore quels coups sont autorisés, ce qui en fait un moteur d'échecs aussi utile qu'une voiture sans roues.

Cet article comble ce trou. C'est de très loin celui où se logent le plus de bugs : dans un moteur débutant, la génération des coups concentre à elle seule la majorité des erreurs. Pas parce que les règles sont difficiles, mais parce qu'elles sont **nombreuses, irrégulières, et que les oublis ne provoquent aucune erreur visible**.

La bonne nouvelle est qu'il existe une façon de séparer proprement le problème en deux, dont l'une est facile.

## Les pièces qui glissent et celles qui sautent

Reprenons la structure [mailbox](https://www.chessprogramming.org/Mailbox) de l'article précédent : un tableau de 120 cases, une rangée fait 10 cases, et une bordure de sentinelles entoure l'échiquier. Monter d'une rangée vaut `-10`, avancer d'une colonne vaut `+1`.

Tous les déplacements deviennent alors des additions.

```python
SAUTS = {
    "N": (-21, -19, -12, -8, 8, 12, 19, 21),
    "B": (-11, -9, 9, 11),
    "R": (-10, -1, 1, 10),
    "Q": (-11, -10, -9, -1, 1, 9, 10, 11),
    "K": (-11, -10, -9, -1, 1, 9, 10, 11),
}

GLISSENT = {"B", "R", "Q"}
```

Le cavalier saute de deux rangées et une colonne, soit `2 × 10 + 1 = 21`, ou d'une rangée et deux colonnes, soit `1 × 10 + 2 = 12`, avec les quatre combinaisons de signes. La dame a exactement les directions du fou plus celles de la tour, ce qui n'est pas une coïncidence mais la définition de la pièce.

La seule différence entre la dame et le roi, qui ont les mêmes huit directions, tient en un booléen : la dame **glisse** jusqu'à rencontrer un obstacle, le roi fait un pas. D'où une boucle unique pour les cinq pièces :

```python
glisse = type_piece in GLISSENT
for saut in SAUTS[type_piece]:
    arrivee = depart + saut
    while True:
        cible = self.cases[arrivee]
        if cible is BORD:
            break
        if cible is VIDE:
            coups.append(Coup(depart, arrivee))
        else:
            if cible not in nos_pieces:
                coups.append(Coup(depart, arrivee))
            break
        if not glisse:
            break
        arrivee += saut
```

Vingt lignes pour cavalier, fou, tour, dame et roi. C'est la partie facile, et elle est finie.

## Le pion, ou la pièce la plus compliquée du jeu

Le pion n'apparaît pas dans la table ci-dessus, parce qu'aucune de ses règles ne se partage avec une autre pièce. Il en a quatre.

**Il avance sans capturer, et capture sans avancer.** C'est la seule pièce dont le déplacement et la prise sont deux mouvements différents. Une case occupée devant un pion le bloque, même par une pièce adverse.

**Il peut avancer de deux cases, mais seulement depuis sa rangée de départ, et seulement si les deux cases sont libres.** L'erreur classique est de ne tester que la case d'arrivée, ce qui autorise un pion à sauter par dessus une pièce.

**Il prend en passant.** Seule capture des échecs vers une case vide, et seul coup où la pièce prise n'est pas sur la case d'arrivée.

**Il se promeut.** Et c'est ici que se cache l'erreur la plus coûteuse pour la suite : un pion qui atteint la dernière rangée ne produit pas un coup, il en produit **quatre**. Dame, tour, fou, cavalier. Ce sont quatre positions différentes.

```python
@staticmethod
def _ajouter_poussee(depart, arrivee, rangee_promotion, coups):
    """Un pion qui atteint la dernière rangée produit QUATRE coups, pas un."""
    if arrivee in rangee_promotion:
        for promotion in PROMOTIONS:
            coups.append(Coup(depart, arrivee, promotion))
    else:
        coups.append(Coup(depart, arrivee))
```

On est tenté de ne garder que la dame, puisque c'est presque toujours le meilleur choix. Deux raisons de ne pas le faire. La première est que les comptages de vérification de l'article suivant seraient immédiatement faux. La seconde est qu'il existe des positions où la [sous-promotion](https://fr.wikipedia.org/wiki/Promotion_(%C3%A9checs)) en cavalier est le seul coup gagnant, typiquement quand elle donne échec, et un moteur qui ne peut pas la jouer les perdra toutes.

## Le roque : trois interdits, une table

Le roque demande de vérifier que le droit existe encore, que les cases entre le roi et la tour sont vides, et que le roi n'est ni en échec, ni de passage sur une case attaquée, ni en train de se mettre en échec.

Ces trois derniers points sont en réalité **la même règle** appliquée à trois cases : celle du roi, celle qu'il traverse, celle où il arrive. D'où une table plutôt que des conditions dispersées :

```python
# lettre du droit -> (case du roi, arrivée, cases à vider, cases à ne pas laisser attaquer)
ROQUES = {
    "K": (95, 97, (96, 97), (95, 96, 97)),
    "Q": (95, 93, (94, 93, 92), (95, 94, 93)),
    "k": (25, 27, (26, 27), (25, 26, 27)),
    "q": (25, 23, (24, 23, 22), (25, 24, 23)),
}
```

Regarde attentivement la ligne du grand roque. Trois cases doivent être **vides** (d1, c1, b1) mais seulement deux cases en plus de celle du roi doivent être **non attaquées** (d1, c1). La case b1 peut parfaitement être sous le feu d'une tour adverse : le roi ne la traverse pas, seule la tour la traverse, et une tour a le droit de traverser une case attaquée. C'est l'erreur classique du roque, et elle est invisible sans un comptage exact.

## Le vrai sujet : pseudo-légal contre légal

Voilà les règles de déplacement. Elles produisent ce qu'on appelle des coups **pseudo-légaux** : conformes au mouvement de la pièce, sans garantie que le roi survive.

On pourrait croire le cas marginal. Mesurons-le, sur les 1 498 positions issues de vraies parties constituées à l'article précédent :

```text
$ python3 pourquoi_le_filtre.py
1498 positions
  coups pseudo-légaux : 46553
  coups légaux        : 41648
  illégaux            : 4905 (10.54 %)
  positions concernées : 778 (51.9 %)

Pire position du jeu d'essai :
  7r/2P2p1k/p3b1B1/7p/1b3p1P/6P1/7K/2q5 b - - 0 41
  52 pseudo-légaux, 5 légaux, soit 47 coups illégaux
```

**Un coup sur dix est illégal, et plus d'une position sur deux est concernée.** Dans la pire position du jeu d'essai, le roi noir est en échec : sur 52 coups qui respectent le déplacement des pièces, 5 seulement sont jouables. Un moteur qui ignore ce filtre ne joue pas mal aux échecs, il joue à un autre jeu.

Trois situations produisent ces coups illégaux, et elles sont d'une difficulté croissante :

1. **Le roi se met en échec tout seul.** Facile à détecter séparément.
2. **Une pièce clouée bouge.** Un cavalier devant son roi, avec un fou adverse dans l'alignement, n'a aucun coup légal. Détectable, mais il faut calculer les clouages.
3. **Une prise en passant dégage deux cases d'un coup.** Le pion qui capture quitte sa colonne, et le pion capturé disparaît d'une case voisine : deux cases se vident sur la même rangée. Si le roi et une tour adverse se trouvent sur cette rangée, le coup est illégal. Aucun test de clouage classique ne l'attrape, parce que ni l'un ni l'autre des deux pions n'était cloué.

Le troisième cas est la raison pour laquelle nous choisissons la méthode brutale.

## La légalité paresseuse

Le procédé tient en quatre lignes, et il est juste par construction.

```python
def coups_legaux(self):
    blanc = self.trait == "w"
    legaux = []
    for coup in self.coups_pseudo_legaux():
        self.jouer(coup)
        if not self.en_echec(blanc):
            legaux.append(coup)
        self.annuler()
    return legaux
```

On joue le coup, on regarde si notre roi est pris, on annule. Aucun raisonnement sur les clouages, les découvertes ou les cas tordus : on constate. Tout cas particulier des règles qu'on n'a pas anticipé est traité correctement, y compris la prise en passant qui découvre un échec, puisqu'on ne fait que regarder l'échiquier après coup.

C'est aussi ce qui rend les fonctions `jouer` et `annuler` de l'article précédent absolument critiques. Une annulation qui restaure mal l'état ne provoque pas un coup illégal isolé : elle **corrompt la position pour tout le reste de la recherche**.

Ce que ça coûte :

```text
Génération pseudo-légale seule : 0.08 s
Génération légale complète     : 0.62 s  (x7.3)
```

Un facteur 7,3. C'est énorme, et c'est assumé pour l'instant. La justesse d'abord, la vitesse ensuite : l'article 9 reviendra sur ce poste, qui est le premier candidat à l'optimisation dans tout moteur. Optimiser un générateur faux n'a aucun intérêt.

## Détecter une case attaquée en raisonnant à l'envers

Il reste à écrire `en_echec`, qui repose sur `case_attaquee`. L'approche naïve consiste à générer tous les coups adverses et à regarder s'ils atteignent la case. Elle fonctionne, elle est lente, et elle est circulaire : générer les coups adverses demanderait de vérifier leur légalité, donc de détecter des échecs.

On raisonne donc dans l'autre sens. On part de la case, et on remonte chaque direction pour voir qui s'y trouve. Le travail est le même, mais borné par les huit directions au lieu du nombre de pièces adverses.

```python
# Pièces qui glissent. On avance dans chaque direction jusqu'au premier
# obstacle : s'il s'agit d'une pièce adverse du bon type, la case est attaquée.
diagonales = ("B", "Q") if par_les_blancs else ("b", "q")
lignes = ("R", "Q") if par_les_blancs else ("r", "q")
for sauts, attaquants in ((SAUTS["B"], diagonales), (SAUTS["R"], lignes)):
    for saut in sauts:
        arrivee = case + saut
        while cases[arrivee] is VIDE:
            arrivee += saut
        if cases[arrivee] in attaquants:
            return True
```

Note l'absence de test de sortie dans la boucle `while`. Elle s'arrête forcément, puisque la bordure de sentinelles n'est jamais `VIDE`. C'est le bénéfice de la mailbox, une deuxième fois.

Le cas du pion mérite une seconde de réflexion, parce que le sens s'inverse. Un pion blanc capture vers le haut de l'échiquier ; pour attaquer une case, il doit donc se trouver **en dessous** d'elle :

```python
pion = "P" if par_les_blancs else "p"
sens = 1 if par_les_blancs else -1
if cases[case + 9 * sens] == pion or cases[case + 11 * sens] == pion:
    return True
```

## La dette de l'article 2, remboursée

L'article précédent s'était terminé sur un écart assumé : 78 positions sur 1 498 où notre FEN différait de celle de Stockfish sur le seul champ de la prise en passant. Nous annoncions la case après toute poussée de deux cases ; les moteurs modernes ne l'annoncent que si la prise est réellement jouable.

Impossible à trancher sans générateur de coups. Maintenant que nous en avons un :

```python
def prise_en_passant_possible(self):
    if self.en_passant is None:
        return False
    blanc = self.trait == "w"
    pion = "P" if blanc else "p"
    avant = -10 if blanc else 10
    for cote in (-1, 1):
        depart = self.en_passant - avant + cote
        if self.cases[depart] != pion:
            continue
        coup = Coup(depart, self.en_passant)
        self.jouer(coup)
        legal = not self.en_echec(blanc)
        self.annuler()
        if legal:
            return True
    return False
```

Le point délicat est qu'il ne suffit pas de constater la présence d'un pion à côté. Ce pion peut être cloué, ou la prise peut découvrir un échec sur la rangée : dans ces cas la prise est illégale et la case ne doit pas être annoncée. On rejoue donc réellement le coup. C'est le même filtre que pour les autres, et pour la même raison.

Cette convention n'est pas cosmétique. C'est celle des positions de référence de `perft`, qui sont le sujet du prochain article : une position dont la case de prise en passant est annoncée à tort ferait compter des coups qui n'existent pas, et le comptage serait faux sans que la génération le soit.

## La vérification : 41 648 coups comparés

Le test de cet article utilise une commande de Stockfish qui va devenir une vieille connaissance : `go perft 1`. Elle fait lister au moteur tous les coups légaux de la position courante. On compare ensemble à ensemble, sur les mêmes 1 498 positions.

```text
$ STOCKFISH=... python3 verifier_coups.py
1498 positions dans le jeu d'essai

1. Coups légaux            : 1498/1498 positions (41648 coups comparés)
2. Aller-retour FEN        : 1498/1498
3. Position après le coup  : 1498/1498

Tout est vert.
```

Quarante et un mille six cent quarante-huit coups, chacun confronté à la référence. Et la deuxième ligne confirme le remboursement de la dette : les 78 écarts de l'article précédent ont disparu.

Reste à savoir ce que le script raconte quand ça se passe mal, parce que c'est là que se juge un test. Introduisons une faute plausible : dans la table `ROQUES`, écrivons l'arrivée du grand roque blanc en b1 (indice 92) au lieu de c1 (indice 93). Une case d'écart, le genre d'erreur qu'on relit dix fois sans la voir.

```text
$ STOCKFISH=... python3 verifier_coups.py
1 positions dans le jeu d'essai

  position r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1
    coups en trop    : e1b1
    coups manquants  : e1c1
1. Coups légaux            : 0/1 positions (48 coups comparés)

1 échec(s).
```

La position fautive, le coup en trop, le coup manquant. C'est très exactement ce dont on a besoin, parce qu'un bug de génération de coups ne se trouve pas en relisant le code : il se trouve en isolant la position qui le déclenche.

## Kiwipete

Un dernier contrôle, en attendant le vrai bilan du prochain article. Il existe une position célèbre dans le petit monde des moteurs d'échecs, due à Peter McKenzie, connue sous le nom de **Kiwipete** :

```text
r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1
```

Elle a été construite pour être méchante. Les deux camps peuvent roquer des deux côtés, des pièces sont clouées, un pion noir en b4 est prêt à prendre en passant, et il y a assez de matériel pour que le moindre oubli se voie dans le comptage. Elle a exactement **48 coups légaux**.

```text
$ python3 echiquier.py
20 coups légaux : a2a3 a2a4 b1a3 b1c3 b2b3 b2b4 c2c3 c2c4 d2d3 d2d4 e2e3 e2e4
                  f2f3 f2f4 g1f3 g1h3 g2g3 g2g4 h2h3 h2h4

Kiwipete : 48 coups légaux (48 attendus)
```

Vingt coups dans la position de départ, quarante-huit dans Kiwipete. Ce sont les deux premières valeurs d'une suite de nombres qui va devenir le seul juge de ton générateur.

Parce qu'un générateur juste à la profondeur 1 peut être faux à la profondeur 2 : il suffit qu'il produise une position légèrement fausse dont les coups, eux, sont correctement générés. Compter les coups d'une position ne prouve rien sur les millions de positions qui en descendent.

**Prochain article :** `perft`, le comptage récursif qui prouve, position de référence par position de référence, que ton générateur de coups est exact. Et la technique qui permet, quand le compte est faux, de trouver le coup fautif en quelques minutes au lieu de quelques jours.
