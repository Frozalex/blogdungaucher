---
title: "Quiescence et tables de cases : le moteur cesse de croire aux cadeaux"
excerpt: >-
  À profondeur 4, un moteur voit qu'il prend la dame et pas qu'on reprend son cavalier. Chercher plus
  profond ne corrige rien, ça déplace le problème d'un cran. La seule solution est de refuser
  d'évaluer une position où les pièces se mangent encore.
publishDate: "2027-08-10"
category: science
featured: false
featuredRank: 99
readingTime: 10 min
pillar: Intelligence artificielle
tags:
  - Python
  - moteur d'échecs
  - quiescence
  - effet d'horizon
  - évaluation
  - recherche
  - tutoriel
  - informatique
seoTitle: "Recherche de quiescence et tables de cases en Python"
seoDescription: >-
  Corriger l'effet d'horizon d'un moteur d'échecs avec une recherche de quiescence, et ajouter des
  tables de cases à l'évaluation. Code Python, stand pat, et mesure de l'écart avant et après.
keyTakeaways:
  - L'effet d'horizon vient de ce qu'on évalue une position au milieu d'une suite de prises. Chercher plus profond ne fait que le déplacer.
  - La quiescence prolonge la recherche aux seules prises, jusqu'à ce que la position soit calme.
  - "Le « stand pat » est correct parce que le camp au trait a toujours le droit de ne pas capturer : l'évaluation immédiate est donc un plancher."
  - "En échec, pas de stand pat : il faut examiner tous les coups, sinon on déclare calme une position où le roi est attaqué."
  - Les tables de cases ajoutent une notion de position pour le prix d'une addition par pièce. Celle du roi est fausse en finale, et c'est assumé.
faq:
  - question: "Qu'est-ce que l'effet d'horizon aux échecs ?"
    answer: >-
      C'est l'erreur d'un moteur qui arrête sa recherche au milieu d'une suite de captures. Il voit
      « je prends sa dame », évalue la position à +900 et s'arrête, sans voir que le demi-coup suivant,
      hors de son horizon, est « il reprend ma pièce ». Le score est faux, et il l'est dans le sens qui
      rend le mauvais coup attirant.
  - question: "Chercher plus profond ne suffit-il pas à corriger l'effet d'horizon ?"
    answer: >-
      Non, cela ne fait que le déplacer. À quelque profondeur qu'on s'arrête, il existe des positions où
      une suite de prises est en cours à cet endroit précis. Le problème n'est pas la profondeur, c'est
      le fait d'évaluer une position instable, et la seule réponse est de ne pas l'évaluer.
  - question: "Qu'est-ce que le « stand pat » dans une recherche de quiescence ?"
    answer: >-
      C'est l'évaluation de la position telle quelle, utilisée comme score plancher. Elle est légitime
      parce que le camp au trait n'est jamais obligé de capturer : s'il a mieux à faire, la valeur de la
      position est au moins celle qu'elle a maintenant. Il ne jouera une prise que si elle améliore ce
      plancher.
  - question: "Que sont les tables de cases (piece-square tables) ?"
    answer: >-
      Un tableau de bonus et de malus par type de pièce et par case : cavalier au centre, bonus ; roi au
      centre en milieu de partie, malus. C'est la façon la moins chère d'introduire du positionnel dans
      une évaluation, puisque tout est pré-calculé et qu'il ne reste qu'une addition par pièce.
  - question: "Faut-il des tables différentes pour le milieu de partie et la finale ?"
    answer: >-
      Oui, au moins pour le roi et les pions. Un roi doit rester à l'abri en milieu de partie et monter
      au centre en finale : une table unique se trompe forcément dans l'une des deux phases. Les moteurs
      sérieux interpolent entre deux jeux de tables selon le matériel restant.
---

Notre moteur [tient une pendule](/fr/blog/approfondissement-iteratif-gestion-du-temps/), cherche avec élagage, ordonne ses coups. Il lui reste un défaut qui fausse ses évaluations plus gravement que tout ce qu'on a corrigé jusqu'ici, et qui ne vient d'aucun bug.

## Le problème

Le moteur cherche à profondeur 4. Il examine la ligne : je prends sa dame avec mon cavalier. Le quatrième demi-coup est consommé, il est arrivé au bout de sa vision, il évalue la position : **+900**, une dame d'avance. Excellent coup.

Le cinquième demi-coup, celui qu'il ne cherche pas, est : il reprend mon cavalier avec son pion. La position réelle vaut +580, pas +900.

Ce n'est pas une petite imprécision. C'est une erreur **orientée** : elle surestime systématiquement les lignes qui se terminent par une prise avantageuse, c'est à dire exactement celles que le moteur va choisir. Un moteur sans correction se jette dans tous les pièges où on lui offre une pièce.

Et chercher plus profond ne règle rien. À profondeur 6, la même chose se produit deux demi-coups plus loin. L'horizon se déplace, il ne disparaît pas.

## La solution : ne pas évaluer, continuer

Le problème n'est pas la profondeur, c'est le fait d'évaluer une position **instable**. La correction consiste donc à ne pas s'arrêter à profondeur zéro, mais à continuer la recherche en ne suivant **que les prises**, jusqu'à ce que plus personne n'ait de capture intéressante à jouer. On évalue alors une position calme.

C'est la recherche de quiescence, et elle tient en une trentaine de lignes.

```python
def quiescence(echiquier, alpha, beta, ply, contexte, restant=QUIESCENCE_MAX):
    contexte.noeuds += 1
    contexte.controler_le_temps()

    coups = echiquier.coups_legaux()
    en_echec = echiquier.en_echec(echiquier.trait == "w")
    if not coups:
        return -(MAT - ply) if en_echec else 0

    if en_echec:
        candidats = coups
    else:
        score = evaluer(echiquier)
        if score >= beta:
            return beta
        alpha = max(alpha, score)
        if restant == 0:
            return alpha
        candidats = [coup for coup in coups if est_une_prise(echiquier, coup)]
        candidats.sort(key=lambda c: score_mvv_lva(echiquier, c), reverse=True)

    for coup in candidats:
        echiquier.jouer(coup)
        score = -quiescence(echiquier, -beta, -alpha, ply + 1, contexte, restant - 1)
        echiquier.annuler()
        if score >= beta:
            return beta
        alpha = max(alpha, score)
    return alpha
```

Trois points méritent d'être compris plutôt que recopiés.

### Le stand pat

```python
score = evaluer(echiquier)
if score >= beta:
    return beta
alpha = max(alpha, score)
```

On commence par évaluer la position **telle quelle**, et on s'en sert comme score plancher. Cela s'appelle le *stand pat*, en français « rester debout », par emprunt au poker.

Pourquoi est-ce légitime ? Parce que le camp au trait n'est jamais **obligé** de capturer. Aux échecs, contrairement aux dames, la prise n'est pas contrainte. S'il a mieux à faire que toutes les prises disponibles, la valeur de la position est au moins celle qu'elle a maintenant. La quiescence n'explore donc les prises que pour voir si l'une d'elles **améliore** ce plancher.

C'est aussi ce qui garantit que la récursion s'arrête : à chaque niveau, il faut qu'une prise fasse mieux que ne rien faire, ce qui devient rapidement impossible.

### L'échec fait exception

```python
if en_echec:
    candidats = coups
```

Quand le roi est en échec, l'option « ne rien faire » n'existe plus : il faut parer. Appliquer le stand pat dans ce cas reviendrait à déclarer calme une position où le roi est attaqué, ce qui est exactement l'inverse du but recherché. On examine donc **tous** les coups, pas seulement les prises.

C'est l'oubli le plus fréquent dans les implémentations de quiescence, et il produit un moteur qui se laisse mater dans des lignes qu'il croit tranquilles.

### La borne

Le paramètre `restant` limite la descente à huit demi-coups. En théorie il est inutile : une suite de prises s'épuise forcément, puisqu'il y a un nombre fini de pièces. En pratique, une position très chargée peut engendrer un arbre de captures considérable, et un seul nœud peut alors coûter une seconde. C'est un garde-fou, pas une correction.

## Les tables de cases

Second ajout de cet article, indépendant du premier mais complémentaire.

Notre évaluation ne compte que le matériel. Elle ne fait donc aucune différence entre un cavalier en e5, qui rayonne sur huit cases, et le même cavalier en a1, qui en contrôle deux. Les **tables de cases** corrigent cela pour le prix d'une addition par pièce : un tableau de bonus et de malus, indexé par type de pièce et par case, consulté au moment de compter.

```python
def materiel_et_position(echiquier):
    score = 0
    for case in CASES:
        piece = echiquier.cases[case]
        if piece is VIDE:
            continue
        valeur = VALEURS[piece.upper()] + TABLES[piece][case]
        score += valeur if piece in BLANCS else -valeur
    return score
```

Il existe des jeux de tables tout faits, recopiés d'un moteur à l'autre depuis vingt ans. J'ai choisi de ne pas les reprendre, et de les **engendrer** par des règles écrites en clair :

```python
def _table_cavalier(case):
    # Le cavalier est la pièce qui souffre le plus du bord : depuis un coin il
    # n'a que deux coups, depuis le centre il en a huit.
    return -30 + 14 * _centralite(case)


def _table_fou(case):
    # Même logique, beaucoup plus douce : un fou au bord garde ses diagonales.
    return -12 + 6 * _centralite(case)
```

La raison est pédagogique et pratique à la fois. Une table de 64 nombres recopiée est une table qu'on ne comprend pas, qu'on ne saura pas ajuster, et dont on ne pourra jamais dire si elle est adaptée à son évaluation. Une table engendrée se discute règle par règle : si le moteur laisse traîner ses cavaliers au bord, on sait quelle ligne modifier.

La table des Noirs est le miroir vertical de celle des Blancs, ce qui se vérifie avec le test de symétrie de l'article 6 : l'évaluation de la position miroir doit rester l'opposé exact.

### Ce que cette table a de faux

Un aveu, parce qu'il est structurel.

```python
def _table_roi(case):
    # En milieu de partie, le roi doit rester derrière ses pions et sur un
    # côté. Cette table est FAUSSE en finale, où le roi doit au contraire
    # monter au centre : c'est la limite assumée d'une table unique.
```

Un roi doit se cacher en milieu de partie et monter au centre en finale. Une table unique se trompe donc nécessairement dans l'une des deux phases. La solution correcte consiste à définir deux jeux de tables et à interpoler entre les deux selon le matériel restant, ce que font tous les moteurs sérieux. Notre moteur, lui, jouera ses finales avec un roi trop timide.

C'est une limite connue, écrite dans le code, et pas une erreur cachée.

### Un effet visible immédiatement

Les tables de cases ont une conséquence qu'on remarque à la première exécution. Jusqu'à l'article précédent, notre moteur jouait `a2a3` dans la position de départ : avec une évaluation purement matérielle, tous les coups valent zéro, et il prenait le premier de la liste. Avec les tables :

```text
$ python3 recherche.py 2
Budget : 2.0 s
  profondeur  1  b1c3       +0.28         40 nœuds    0.01s
  profondeur  2  b1c3       +0.00        140 nœuds    0.04s
  profondeur  3  b1c3       +0.28       1184 nœuds    0.31s
  profondeur  4  b1c3       +0.00       4160 nœuds    1.48s

-> b1c3  +0.00  profondeur 4  6144 nœuds  2.04s
```

`Cc3`. Un développement de cavalier vers le centre, ce qui est un vrai coup d'ouverture. Le moteur ne sait toujours rien de la théorie : il constate simplement qu'un cavalier en c3 vaut 28 centièmes de pion de plus qu'un cavalier en b1, ce que la table lui a dit.

Remarque aussi l'alternance du score entre `+0.28` et `+0.00` selon la parité de la profondeur. Ce n'est pas un bug, c'est l'**effet d'oscillation** : aux profondeurs impaires, les Blancs ont joué un coup de plus que les Noirs et récoltent son bonus ; aux profondeurs paires, les Noirs ont eu le temps de répliquer symétriquement. Tout moteur sans notion de tempo produit cette alternance dans les positions équilibrées.

## Les mesures

Comment vérifier qu'une quiescence sert à quelque chose ? Deux épreuves, dont la première ne fait appel à aucun arbitre extérieur.

**L'écart interne.** Pour chaque position, on compare l'évaluation statique, celle que la recherche utiliserait telle quelle à ses feuilles, à l'évaluation calme obtenue après épuisement des prises. Quand les deux diffèrent nettement, la position n'aurait jamais dû être évaluée en l'état. C'est l'effet d'horizon lui-même, mesuré sans arbitre.

**L'accord avec Stockfish.** On compare les deux évaluations à ce que Stockfish annonce après une vraie recherche à profondeur 8. Si la quiescence sert, elle doit réduire l'écart.

```text
$ STOCKFISH=... python3 verifier_quiescence.py --stockfish 400
400 positions

1. Écart entre évaluation statique et évaluation calme
   positions où l'écart atteint 1 pion : 113/400 (28.2 %)
   écart médian : 0 centièmes de pion, maximum 98825

2. Écart à la recherche de Stockfish (profondeur 8), 376 positions
   évaluation statique : médiane  120 cp, même camp désigné 89.1 %
   évaluation calme    : médiane  107 cp, même camp désigné 91.8 %
```

Trois lectures.

**L'écart médian est nul.** La majorité des positions sont déjà calmes : aucune prise ne vaut la peine d'être jouée, la quiescence rend immédiatement la main sur son *stand pat*, et elle ne coûte donc presque rien. C'est ce qui rend la technique viable : on ne paie que là où il y a quelque chose à payer.

**Plus d'une position sur quatre est trompeuse.** Sur 28,2 % d'entre elles, évaluer sans quiescence se trompe d'au moins un pion entier. Rappelle-toi qu'il ne s'agit pas de positions choisies : ce sont les positions ordinaires de parties ordinaires, celles que la recherche rencontre à ses feuilles des millions de fois.

**Le maximum de 98 825 n'est pas une aberration.** C'est un score de mat. Dans cette position, la suite de prises débouche sur un mat forcé que l'évaluation statique, elle, chiffrait à onze pions de retard. La quiescence ne corrige pas seulement des demi-pions : elle voit parfois des choses d'une tout autre nature.

Le gain face à Stockfish, lui, est réel et modeste : l'écart médian passe de 120 à 107 centièmes de pion, et l'accord sur le camp qui est mieux monte de 89,1 % à 91,8 %. C'est ce qu'on peut attendre. La quiescence ne rend pas l'évaluation plus fine, elle l'empêche seulement de mentir au mauvais moment. Le vrai bénéfice ne se lit pas ici, il se lit dans les parties jouées : un moteur avec quiescence cesse de se précipiter sur les pièces empoisonnées.

## Ce que le moteur est devenu

Reprenons ce qui a été construit. Une représentation vérifiée par 41 millions de positions énumérées. Un générateur de coups confronté à Stockfish sur 41 648 coups. Une recherche négamax avec élagage alpha-bêta, ordonnancement, approfondissement itératif, gestion du temps, et maintenant quiescence et évaluation positionnelle.

Il ne manque qu'une chose, et c'est celle qui le rendra utilisable : il ne sait toujours parler à personne. Il vit dans un script Python et joue contre lui-même.

**Prochain article, le dernier :** parler UCI, se brancher dans une vraie interface d'échecs, et surtout, mesurer honnêtement ce que tout cela vaut en points Elo.
