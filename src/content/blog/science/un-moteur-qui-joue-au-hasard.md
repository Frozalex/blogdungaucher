---
title: "Un moteur d'échecs qui joue au hasard : le premier qui joue vraiment"
excerpt: >-
  Le plus mauvais moteur possible est aussi le plus instructif à écrire. Il met en place tout ce qui
  entoure le choix du coup : la boucle de partie, les cinq façons de finir, la notation. Après lui, il
  ne restera qu'une seule ligne à changer pour que le moteur devienne intelligent.
publishDate: "2027-06-29"
category: science
featured: false
featuredRank: 99
readingTime: 10 min
pillar: Intelligence artificielle
tags:
  - Python
  - moteur d'échecs
  - programmation
  - PGN
  - règles du jeu
  - nulle
  - tutoriel
  - informatique
seoTitle: "Coder un moteur d'échecs qui joue une partie complète en Python"
seoDescription: >-
  La boucle de partie d'un moteur d'échecs en Python : détection du mat et du pat, règle des cinquante
  coups, matériel insuffisant, triple répétition, et génération d'un PGN lisible.
keyTakeaways:
  - Le mat et le pat se détectent par le même test, l'absence de coup légal, et se distinguent par un second, l'échec.
  - "Une partie jouée au hasard se termine toujours : la règle des cinquante coups garantit la terminaison."
  - Sur 500 parties jouées au hasard, 86 % finissent en nulle, dont plus de la moitié par épuisement du matériel. La médiane est de 356 demi-coups.
  - La triple répétition compare l'échiquier, le trait, les droits de roque et les prises en passant disponibles, mais aucun des deux compteurs.
  - La notation algébrique n'a d'utilité que pour les humains. Le moteur travaille en notation UCI du début à la fin.
faq:
  - question: "Comment détecter un échec et mat en programmation ?"
    answer: >-
      En deux tests, dans cet ordre. D'abord : le camp au trait a-t-il au moins un coup légal ? Si oui,
      la partie continue. Si non, second test : son roi est-il en échec ? Si oui c'est un mat, si non
      c'est un pat. Il n'existe pas de test direct du mat, et c'est heureux : celui-ci découle
      entièrement du générateur de coups déjà écrit.
  - question: "Une partie jouée au hasard se termine-t-elle toujours ?"
    answer: >-
      Oui, et c'est démontrable. La règle des cinquante coups met fin à la partie après cent demi-coups
      sans prise ni coup de pion. Or le compteur ne se remet à zéro que sur une prise ou un coup de
      pion, et il n'y a qu'un nombre fini de pièces à prendre et de cases devant les pions, qui ne
      reculent jamais. Le nombre de remises à zéro est donc borné, donc la partie l'est aussi.
  - question: "Quelles sont les cinq façons de terminer une partie d'échecs ?"
    answer: >-
      Échec et mat, pat, règle des cinquante coups, matériel insuffisant et triple répétition. Un moteur
      doit toutes les implémenter : oublier la triple répétition, par exemple, lui fera jouer
      indéfiniment une position gagnante qu'il ne sait pas convertir.
  - question: "Qu'est-ce que le matériel insuffisant exactement ?"
    answer: >-
      Les positions où aucun des deux camps ne peut mater, même avec la coopération de l'autre : roi
      contre roi, roi et fou contre roi, roi et cavalier contre roi, et roi et fou contre roi et fou de
      même couleur de case. Attention au cas classique du <strong>roi et deux cavaliers</strong> : le
      mat y est possible mais pas forçable, la partie n'est donc pas déclarée nulle immédiatement.
  - question: "Pourquoi mon moteur a-t-il besoin de la notation algébrique ?"
    answer: >-
      Il n'en a pas besoin. Le protocole UCI et toutes les interfaces graphiques travaillent en notation
      longue (<code>e2e4</code>, <code>e7e8q</code>), qui est sans ambiguïté. La notation algébrique
      abrégée n'existe que pour produire des PGN lisibles par un humain, et son seul coût réel est la
      désambiguïsation quand deux pièces identiques peuvent atteindre la même case.
---

La [phase 1 de cette série](/fr/blog/perft-verifier-son-generateur-de-coups/) s'est terminée sur un programme qui connaît parfaitement les règles des échecs et qui ne joue pas. Il sait ce qui est permis. Il n'a aucune idée de ce qui est bon.

On pourrait attaquer directement l'évaluation et la recherche. Ce serait une erreur, parce qu'entre « connaître les coups » et « jouer une partie » il reste toute une plomberie : la boucle qui alterne les camps, les cinq façons de terminer, l'écriture de la partie dans un format lisible. Autant l'écrire une bonne fois pendant que le choix du coup est trivial.

D'où le moteur de cet article, le pire qu'on puisse écrire tout en restant légal.

```python
class MoteurAuHasard:
    nom = "Hasard"

    def __init__(self, graine=None):
        self.alea = random.Random(graine)

    def choisir(self, echiquier, coups):
        return self.alea.choice(coups)
```

C'est tout. Et l'intérêt de la chose est précisément là : **à partir de maintenant, tous les moteurs de la série ne différeront que par le contenu de `choisir`**. Toute la suite consistera à remplacer cette seule ligne.

## La boucle de partie

```python
def jouer_une_partie(blancs, noirs, avec_notation=True):
    echiquier = Echiquier()
    cles_vues = Counter()
    coups_san = []
    coups_uci = []

    while True:
        cles_vues[echiquier.cle_position()] += 1
        verdict = echiquier.resultat(cles_vues)
        if verdict:
            resultat, motif = verdict
            return resultat, motif, coups_san, coups_uci

        coups = echiquier.coups_legaux()
        moteur = blancs if echiquier.trait == "w" else noirs
        coup = moteur.choisir(echiquier, coups)

        if avec_notation:
            coups_san.append(san(echiquier, coup))
        coups_uci.append(str(coup))
        echiquier.jouer(coup)
```

Rien de surprenant, à un détail près : on comptabilise la position **avant** de tester le verdict, jamais après. La triple répétition se juge sur la position courante, celle où le camp au trait s'apprête à jouer ; l'inverser décale le compte d'un demi-coup et fait déclarer la nulle une répétition trop tôt ou trop tard.

Autre détail que la boucle ne contient pas : aucune limite de coups. Ce n'est pas un oubli, et c'est démontrable.

La règle des cinquante coups met fin à la partie après cent demi-coups sans prise ni coup de pion. Le compteur ne se remet à zéro que dans ces deux cas. Or il n'y a qu'un nombre fini de pièces à prendre, et les pions ne reculent jamais : le nombre de remises à zéro possibles est donc borné. Une partie au hasard, aussi absurde soit-elle, se termine toujours.

## Les cinq façons de finir, et l'ordre dans lequel les tester

```python
def resultat(self, cles_vues=None):
    if not self.coups_legaux():
        if self.en_echec(self.trait == "w"):
            return ("0-1" if self.trait == "w" else "1-0", "échec et mat")
        return ("1/2-1/2", "pat")

    if self.demi_coups >= 100:
        return ("1/2-1/2", "règle des cinquante coups")
    if self.materiel_insuffisant():
        return ("1/2-1/2", "matériel insuffisant")
    if cles_vues is not None and cles_vues.get(self.cle_position(), 0) >= 3:
        return ("1/2-1/2", "triple répétition")
    return None
```

**Le mat et le pat sont le même test.** Il n'existe pas de fonction « détecter le mat » : il y a une absence de coup légal, puis une question subsidiaire, le roi est-il en échec. Cette élégance est offerte par le générateur de coups de l'article 3 ; un moteur qui essaierait de détecter le mat directement réécrirait la moitié de ce générateur, moins bien.

**L'ordre compte.** Le mat prime sur tout. Une position où le compteur des cinquante coups atteint 100 par un coup qui donne mat est un mat, pas une nulle : la règle FIDE est explicite là dessus, et c'est exactement le genre de cas qu'un moteur rencontre une fois sur cent mille parties, au pire moment.

## Le matériel insuffisant, plus subtil qu'il n'y paraît

```python
mineures = [case for case in occupees if self.cases[case] in "BbNn"]
if len(mineures) <= 1:
    return True
if len(mineures) == 2 and all(self.cases[case] in "Bb" for case in mineures):
    couleurs = {(case // 10 + case % 10) % 2 for case in mineures}
    return len(couleurs) == 1
return False
```

Quatre cas seulement sont des nulles immédiates : roi contre roi, roi et fou, roi et cavalier, et les deux fous de même couleur de case. La condition sur la couleur des cases se lit directement dans les indices mailbox : la somme de la rangée et de la colonne a la même parité pour toutes les cases d'une même teinte.

Le piège est ailleurs, dans un cas qu'on croit en faire partie : **roi et deux cavaliers contre roi**. Le mat y est possible, il n'est simplement pas forçable si l'adversaire joue bien. La FIDE ne déclare donc pas la nulle : la partie continue, et se terminera par la règle des cinquante coups. Un moteur qui range ce cas parmi les nulles immédiates abandonne une position qu'il aurait pu gagner contre un adversaire distrait.

## Ce qu'est « la même position »

La triple répétition demande de comparer des positions, ce qui suppose de définir l'égalité.

```python
def cle_position(self):
    return (
        tuple(self.cases[case] for case in CASES),
        self.trait,
        self.roques,
        self.en_passant if self.prise_en_passant_possible() else None,
    )
```

Deux positions sont les mêmes si l'échiquier, le trait, les droits de roque et les prises en passant disponibles coïncident. **Les deux compteurs n'en font pas partie.** Une position répétée l'est même si le compteur des cinquante coups a avancé entre temps : sinon aucune position ne serait jamais répétée, puisque ce compteur ne cesse de monter.

Note que le champ de prise en passant n'entre dans la clé que si la prise est **jouable**, exactement comme dans la FEN de l'article 3. Deux positions identiques dont l'une suit une poussée de deux cases sans preneur possible sont bien la même position au sens des règles.

Cette clé est correcte et lente : elle construit un tuple de 64 éléments à chaque coup, et appelle `prise_en_passant_possible`, qui joue et annule des coups. C'est acceptable ici, où on l'appelle une fois par demi-coup. Ça ne le sera plus quand la recherche en demandera des centaines de milliers par seconde, et l'article 10 la remplacera par un [hachage de Zobrist](https://www.chessprogramming.org/Zobrist_Hashing), qui met à jour un simple entier à chaque coup.

## La notation algébrique n'est pas pour le moteur

Le moteur travaille en notation UCI du début à la fin : `e2e4`, `e7e8q`, deux tranches de deux caractères et une éventuelle promotion. C'est sans ambiguïté, ça se lit sans connaître la position, et c'est ce qu'attendent le protocole UCI et toutes les interfaces graphiques.

La notation algébrique abrégée n'existe que pour nous. Elle a un coût, et il est entier dans un seul cas : quand deux pièces identiques peuvent atteindre la même case, `Cf3` ne suffit plus.

```python
def _desambiguiser(echiquier, coup, piece):
    rivales = [
        autre.depart
        for autre in echiquier.coups_legaux()
        if autre.arrivee == coup.arrivee
        and autre.depart != coup.depart
        and echiquier.cases[autre.depart] == piece
    ]
    if not rivales:
        return ""

    depart = nom_de_case(coup.depart)
    if all(nom_de_case(case)[0] != depart[0] for case in rivales):
        return depart[0]
    if all(nom_de_case(case)[1] != depart[1] for case in rivales):
        return depart[1]
    return depart
```

La colonne d'abord, la rangée ensuite, les deux en dernier recours. Et remarque que les rivales sont cherchées parmi les coups **légaux** : deux cavaliers peuvent aller en f3, mais si l'un des deux est cloué, il n'y a pas d'ambiguïté et la notation reste `Cf3`.

## Une vraie partie

Voici un extrait d'une partie complète produite par deux moteurs au hasard, telle que le programme l'écrit :

```text
[Event "Partie au hasard"]
[Site "blogdungaucher.com"]
[White "Hasard"]
[Black "Hasard"]
[Result "1/2-1/2"]
[Termination "matériel insuffisant"]

1.b3 g6 2.h4 Fh6 3.e3 a6 4.Ch3 Fg5 5.Fb2 Fxh4 6.c4 Ch6 7.Fe5 Tf8 8.a3 Ta7 9.
Df3 d6 10.Dxf7+ Txf7 11.Fc3 c5 12.Fa5 Ff5 13.Ta2 Ff6 14.Tb2 Fd3 15.f3 Cc6 16.
[...]
95.Rb2 Tb3+ 96.Rxb3 Rf8 97.e7+ Rf7 98.e8=T a5 99.Te5 a4+ 100.Rc2 Rf8 101.Tc5
[...]
141.Tg3 Rc4 142.Tc3+ Rb4 143.Rb7 Rxc3
1/2-1/2

286 demi-coups, matériel insuffisant
```

Ce PGN s'ouvre dans n'importe quel visualiseur. Deux détails valent le coup d'œil. Au coup 10, `Dxf7+` : la dame blanche se donne gratuitement avec échec, et le coup est correctement noté. Au coup 98, `e8=T` : le hasard a promu en tour plutôt qu'en dame, ce qui ne serait pas arrivé avec un générateur qui oublie les sous-promotions.

## Cinq cents parties au hasard

Une fois la boucle en place, rien n'empêche de la lancer cinq cents fois. On obtient au passage un portrait statistique du hasard aux échecs, que je n'ai trouvé nulle part ailleurs sous cette forme.

```text
$ python3 partie.py 500
500 parties au hasard

Résultats
  0-1         30  (  6.0 %)
  1-0         39  (  7.8 %)
  1/2-1/2    431  ( 86.2 %)

Motifs de fin
  matériel insuffisant           271  ( 54.2 %)
  règle des cinquante coups      117  ( 23.4 %)
  échec et mat                    69  ( 13.8 %)
  pat                             35  (  7.0 %)
  triple répétition                8  (  1.6 %)

Longueur : 27 à 628 demi-coups, médiane 356
```

Trois choses méritent qu'on s'y arrête.

**Le hasard fait nulle dans 86 % des cas**, et pour l'essentiel par épuisement du matériel : les deux camps se dévorent mutuellement jusqu'à ce qu'il ne reste plus de quoi mater. C'est le portrait exact d'un jeu sans plan, où chaque pièce posée en prise est prise.

**Le mat survient tout de même une fois sur sept.** C'est plus que ce à quoi on s'attend, et l'explication est un peu vexante pour le hasard : avec un roi qui se promène au centre et une dame adverse encore sur l'échiquier, le mat finit par arriver tout seul. Il n'est pas construit, il est subi.

**Le pat représente 7 % des fins**, contre une fraction de pourcent dans les parties humaines. Les positions dépouillées où un roi n'a plus de case sont précisément celles où le hasard passe le plus de temps.

La médiane de 356 demi-coups, soit 178 coups, dit tout le reste : une partie humaine en fait rarement plus de quatre-vingts. Le hasard ne va nulle part, très longtemps.

C'est une bonne mesure du problème que la suite de la série doit résoudre. Le moteur ne manque pas de coups gagnants, il manque de **continuité** : il faut, pour mater, une suite de coups cohérents entre eux, et le hasard défait au coup suivant ce qu'il a construit au précédent.

## La vérification : des parties entières, position par position

Les articles 3 et 4 vérifiaient le générateur sur un jeu d'essai figé. Ici, les positions sont neuves à chaque exécution, et surtout elles sont bizarres : une partie au hasard va là où aucune partie humaine ne va, dans des positions à trois dames où tout est cloué et où le roi se promène au centre. C'est un excellent terrain de chasse.

Pour chaque demi-coup de chaque partie, on compare notre ensemble de coups légaux à celui de Stockfish. À la fin, on vérifie le verdict lui-même : qu'aucun coup n'est légal quand on annonce mat ou pat, et que le camp est bien en échec dans le premier cas et pas dans le second.

```text
$ STOCKFISH=... python3 verifier_partie.py 20
20 parties, 6150 demi-coups vérifiés position par position
  matériel insuffisant         8
  règle des cinquante coups    5
  échec et mat                 4
  pat                          3

Aucun coup illégal.
```

Six mille cent cinquante positions, dont aucune ne figurait dans le jeu d'essai des articles précédents, et sur lesquelles notre générateur produit exactement l'ensemble de coups de Stockfish. Chaque exécution en explore six mille autres.

## Ce que tu as maintenant

Un programme qui joue des parties d'échecs complètes, du premier coup au verdict final, sans jamais produire un coup illégal ni se tromper sur la fin. Il ne lui manque qu'une chose : une raison de préférer un coup à un autre.

C'est l'objet du prochain article, et le premier moment de la série où le moteur commence à ressembler à quelque chose.

**Prochain article :** évaluer une position, en commençant par ce que tout le monde sait faire, compter le matériel. Avec une surprise à la clé : un moteur qui ne fait que ça, sans chercher plus loin qu'un demi-coup, est déjà infiniment meilleur que le hasard, et reste très mauvais.
