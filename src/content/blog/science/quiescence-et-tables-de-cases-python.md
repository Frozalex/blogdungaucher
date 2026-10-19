---
title: "Quiescence et tables de cases : le moteur cesse de croire aux cadeaux"
excerpt: >-
  À profondeur 4, un moteur voit qu'il prend la dame et pas qu'on reprend son cavalier. Chercher plus profond peut résoudre certains cas, sans éliminer tous les effets d'horizon. Une technique consiste à éviter
  d'évaluer une position où les pièces se mangent encore.
publishDate: "2027-08-10"
category: science
featured: false
featuredRank: 99
readingTime: 9 min
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
  - "La quiescence atténue certains effets d'horizon ; elle ne les élimine pas tous."
  - "Ce prototype examine les prises hors échec et toutes les parades en échec."
  - "Le stand pat est une approximation, particulièrement fragile en zugzwang."
  - "Le budget local et une borne absolue empêchent une suite d'échecs de prolonger indéfiniment la récursion."
  - "Les tables de cases sont des paramètres pédagogiques ; une table unique du roi a des limites selon la phase."
faq:
  - question: "Qu’est-ce que la recherche de quiescence ?"
    answer: "Elle prolonge certaines variantes tactiques au-delà de la profondeur principale. Dans ce tutoriel, elle examine les prises et toutes les parades lorsque le roi est en échec, avec des limites de profondeur."
  - question: "Supprime-t-elle l’effet d’horizon ?"
    answer: "Non. Elle réduit certains arrêts mal placés, mais conserve une sélection de coups et des limites de calcul."
  - question: "Le stand pat est-il une garantie mathématique ?"
    answer: "C'est une hypothèse heuristique qui utilise l'évaluation immédiate comme référence. Le fait de ne pas être obligé de capturer ne permet pas de passer son tour ; le zugzwang en montre la limite. On ne l'utilise pas comme choix normal lorsque le roi est en échec."
  - question: "Que sont les tables de cases ?"
    answer: "Des bonus et malus choisis pour chaque pièce selon sa case. Ils restent des paramètres d'évaluation, qui peuvent varier avec la phase de la partie."
heroImage:
  src: /images/blog/quiescence-et-tables-de-cases-python-hero.webp
  alt: Des ondulations s’apaisent autour de pierres sombres disposées dans l’eau.
ogImage: /images/og/quiescence-et-tables-de-cases-python-og.webp
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

    if ply >= 120:
        return 0 if en_echec else evaluer(echiquier)

    if en_echec:
        candidats = coups
    else:
        score = evaluer(echiquier)
        if score >= beta:
            return beta
        alpha = max(alpha, score)
        if restant <= 0:
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

Le stand pat utilise l'évaluation immédiate comme référence heuristique. Ne pas être obligé de capturer ne signifie pas que tu peux passer ton tour : en zugzwang, tout coup peut dégrader ta position. Ce plancher n'est donc pas une garantie universelle de la valeur réelle.

### L'échec fait exception

```python
if en_echec:
    candidats = coups
```

Quand le roi est en échec, l'option « ne rien faire » n'existe plus : il faut parer. Appliquer le stand pat dans ce cas reviendrait à déclarer calme une position où le roi est attaqué, ce qui est exactement l'inverse du but recherché. On examine donc **tous** les coups, pas seulement les prises.

C'est l'oubli le plus fréquent dans les implémentations de quiescence, et il produit un moteur qui se laisse mater dans des lignes qu'il croit tranquilles.

### La borne

Le paramètre `restant` limite les prolongements hors échec. Les parades peuvent dépasser cette limite, d'où un second garde-fou absolu à 120 demi-coups depuis la racine. À cette borne, on rend une estimation (ou zéro en échec), sans prétendre avoir prouvé une nulle. Le test `restant <= 0` reste valable après une extension qui a fait passer le compteur sous zéro.

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

Un roi doit se cacher en milieu de partie et monter au centre en finale. Une table unique se trompe donc nécessairement dans l'une des deux phases. La solution correcte consiste à définir deux jeux de tables et à interpoler entre les deux selon le matériel restant, une solution possible des moteurs à évaluation par tables. Notre moteur, lui, jouera ses finales avec un roi trop timide.

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

**Plus d'une position sur quatre est trompeuse.** Sur 28,2 % d'entre elles, les évaluations statique et de quiescence diffèrent d'au moins un pion de notre échelle. Rappelle-toi qu'il ne s'agit pas de positions choisies : ce sont les positions de notre corpus ; leur fréquence ne représente pas nécessairement celle des feuilles de recherche.

**Le maximum de 98 825 n'est pas une aberration.** C'est un score de mat. Dans cette position, la suite de prises débouche sur un mat forcé que l'évaluation statique, elle, chiffrait à onze pions de retard. La quiescence ne corrige pas seulement des demi-pions : elle voit parfois des choses d'une tout autre nature.

Le gain face à Stockfish, lui, est réel et modeste : l'écart médian passe de 120 à 107 centièmes de pion, et l'accord sur le camp qui est mieux monte de 89,1 % à 91,8 %. C'est ce qu'on peut attendre. La quiescence ne rend pas l'évaluation plus fine, elle l'empêche seulement de mentir au mauvais moment. Le vrai bénéfice ne se lit pas ici, il se lit dans les parties jouées : un moteur avec quiescence cesse de se précipiter sur les pièces empoisonnées.

## Ce que le moteur est devenu

Reprenons ce qui a été construit. Une représentation vérifiée par 41 millions de positions énumérées. Un générateur de coups confronté à Stockfish sur 41 648 coups. Une recherche négamax avec élagage alpha-bêta, ordonnancement, approfondissement itératif, gestion du temps, et maintenant quiescence et évaluation positionnelle.

Il ne manque qu'une chose, et c'est celle qui le rendra utilisable : il ne sait toujours parler à personne. Il vit dans un script Python et joue contre lui-même.

**Prochain article, le dernier :** parler UCI, se brancher dans une vraie interface d'échecs, et surtout, mesurer honnêtement ce que tout cela vaut en points Elo.

## Sources

Le chapitre de Russell et Norvig décrit les limites de recherche ; le code de Stockfish montre une quiescence avec traitement des échecs et profondeur maximale, ce qui éclaire les garde-fous de ce prototype.

- Russell, S. et Norvig, P. (s. d.), Adversarial Search, chapitre des auteurs, [texte](https://aima.cs.berkeley.edu/4th-ed/pdfs/newchap06.pdf).

- Équipe Stockfish (s. d.), search.cpp, code officiel, [texte](https://raw.githubusercontent.com/official-stockfish/Stockfish/master/src/search.cpp).
