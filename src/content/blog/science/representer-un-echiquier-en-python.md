---
title: "Représenter un échiquier en Python : le tableau de 64 cases est un piège"
excerpt: >-
  Une liste de 64 éléments pour 64 cases, ça semble évident. C'est le premier bug de tout moteur
  débutant : le cavalier sort par la droite et rentre par la gauche. Voici la structure à utiliser à
  la place, et les deux fonctions que ta recherche appellera des millions de fois.
publishDate: "2027-06-08"
category: science
featured: false
featuredRank: 99
readingTime: 15 min
pillar: Intelligence artificielle
tags:
  - Python
  - moteur d'échecs
  - programmation
  - mailbox
  - FEN
  - structure de données
  - tutoriel
  - informatique
seoTitle: "Représenter un échiquier en Python : mailbox 10x12 et FEN"
seoDescription: >-
  Comment représenter un échiquier en Python pour un moteur : pourquoi le tableau de 64 cases échoue,
  la structure mailbox 10x12, la lecture et l'écriture de FEN, et les fonctions jouer/annuler.
keyTakeaways:
  - Un tableau de 64 cases laisse le cavalier sortir d'un bord et rentrer par l'autre, sans aucune erreur visible.
  - "La solution mailbox entoure l'échiquier d'une bordure de sentinelles : le test de débordement devient une simple lecture de case."
  - "Un moteur ne copie jamais la position pour explorer une variante : il joue le coup, descend, puis l'annule."
  - "Annuler exige de mémoriser ce qu'on ne peut pas recalculer : la pièce prise, sa case, les droits de roque et le compteur des cinquante coups."
  - La prise en passant est le seul coup où la pièce capturée n'est pas sur la case d'arrivée. C'est là que casse la fonction annuler.
faq:
  - question: "Pourquoi 10x12 cases plutôt que 8x8 ?"
    answer: >-
      Parce que la bordure supprime le test de débordement. Dans un tableau 8×8, un cavalier en h4 qui
      saute « deux à droite, une en haut » atterrit sur une case parfaitement valide de l'autre côté de
      l'échiquier, et rien dans le code ne signale l'anomalie. Avec deux rangées de sentinelles en haut
      et en bas et une colonne de chaque côté, il atterrit sur une sentinelle : il suffit de lire la case
      pour savoir qu'on est sorti. Deux rangées et non une, parce qu'un cavalier peut sauter de deux
      rangées d'un coup.
  - question: "Les bitboards ne sont-ils pas meilleurs ?"
    answer: >-
      Plus rapides, oui, et c'est ce qu'utilisent tous les moteurs sérieux, Stockfish compris : la
      position tient dans une douzaine d'entiers de 64 bits et la génération des coups devient une
      suite d'opérations bit à bit. Mais l'avantage vient de ce que le processeur traite un entier de
      64 bits en une instruction, ce que Python ne fait pas : ses entiers sont des objets de taille
      illimitée. On paierait donc la complexité des bitboards sans en toucher le bénéfice.
  - question: "Pourquoi annuler un coup au lieu de copier la position ?"
    answer: >-
      Pour la vitesse. Une recherche à profondeur 6 visite des centaines de milliers de positions, et
      chacune impliquerait de recopier l'ensemble de la structure. La technique <em>make/unmake</em>
      modifie l'échiquier en place, descend dans l'arbre, puis remet exactement l'état d'avant. Elle est
      plus rapide d'un ordre de grandeur, au prix d'une exigence : tout ce qui n'est pas recalculable
      doit avoir été mémorisé.
  - question: "Faut-il vraiment un compteur de demi-coups dans la FEN ?"
    answer: >-
      Oui, et c'est précisément le champ que les implémentations oublient de restaurer. Il compte les
      demi-coups depuis la dernière prise ou le dernier coup de pion, pour la règle des cinquante coups.
      On ne peut pas le recalculer après avoir joué : une fois remis à zéro par une prise, l'information
      « il valait 37 » est définitivement perdue si on ne l'a pas empilée.
  - question: "Pourquoi ma FEN diffère de celle de Stockfish sur la case de prise en passant ?"
    answer: >-
      Parce qu'il existe deux conventions. La FEN d'origine annonce la case survolée après toute poussée
      de deux cases. Stockfish et la plupart des moteurs modernes ne l'annoncent que si la prise en
      passant est <strong>réellement jouable</strong> par le camp au trait. Les deux positions sont
      identiques sur l'échiquier, mais les chaînes diffèrent. Adopter la seconde convention suppose de
      savoir générer les coups, ce qui vient à l'article suivant.
---

Un échiquier a soixante-quatre cases. Python a des listes. La conclusion semble s'imposer toute seule, et c'est exactement pour cela qu'elle est piégeuse.

Cet article construit la structure de données sur laquelle reposera tout le reste de la série : les dix articles suivants ne feront qu'appeler ses fonctions. Un mauvais choix ici ne se rattrape pas, il se paie en lenteur et en bugs jusqu'à la fin. Bonne nouvelle : le bon choix pour un moteur en Python est aussi le plus lisible des trois candidats.

*Cet article fait suite à [Programmer un moteur d'échecs en Python : par où commencer](/fr/blog/moteur-echecs-python-par-ou-commencer/), qui installe l'atelier.*

## Le cavalier qui traverse le mur

Commençons par la version évidente. Une liste de 64 éléments, l'indice 0 pour a8, l'indice 63 pour h1, dans l'ordre de lecture d'une FEN. La colonne se retrouve par `index % 8`, la rangée par `index // 8`.

Les déplacements d'un cavalier deviennent alors huit décalages d'indice : deux colonnes et une rangée, ou l'inverse, dans les quatre directions. Soit `±6`, `±10`, `±15` et `±17`.

```python
SAUTS_64 = [-17, -15, -10, -6, 6, 10, 15, 17]


def cavalier_64(depart):
    arrivees = []
    for saut in SAUTS_64:
        arrivee = depart + saut
        if 0 <= arrivee <= 63:  # la seule vérification possible ici
            arrivees.append(nom_64(arrivee))
    return arrivees
```

Le test `0 <= arrivee <= 63` a l'air de suffire. Il ne suffit pas. Voici ce que ce code produit vraiment :

```text
$ python3 le_piege_des_64_cases.py
Cavalier en h4
  64 cases  : a1 a5 b2 b4 f3 f5 g2 g6   (8 coups)
  mailbox   : f3 f5 g2 g6   (4 coups)

Cavalier en a4
  64 cases  : b2 b6 c3 c5 g4 g6 h3 h7   (8 coups)
  mailbox   : b2 b6 c3 c5   (4 coups)
```

Un cavalier en h4 a quatre coups. Le code en trouve huit. Les quatre supplémentaires (a1, a5, b2, b4) sont ceux où la pièce est sortie par le bord droit de l'échiquier et est réapparue à gauche, une ou deux rangées plus loin. Vu comme une bande de 64 cases, le déplacement est parfaitement légitime : h4 est à l'indice 39, moins six donne 33, et l'indice 33 existe. C'est b4.

Ce bug a trois propriétés qui en font le pire ennemi du débutant. Il ne lève **aucune exception**. Il ne se déclenche que sur les colonnes a et h, donc pas dans les positions qu'on teste au début. Et il produit des coups plausibles : dans une partie, tu verras un cavalier faire quelque chose d'aberrant sans jamais soupçonner la structure de données, puisque le générateur de coups « fonctionne » ailleurs.

On peut le corriger en comparant les colonnes de départ et d'arrivée à chaque coup. C'est possible, c'est laid, et surtout c'est une vérification à répéter dans chaque fonction de génération, donc à oublier quelque part.

## Trois façons de représenter un échiquier

| Représentation | Idée | Pour | Contre |
|---|---|---|---|
| Tableau 8×8 | 64 cases, tests de bornes explicites | Immédiat à comprendre | Un test de débordement à ne jamais oublier, dans chaque fonction |
| Mailbox 10×12 | 64 cases utiles entourées de sentinelles | Le débordement se lit dans le tableau lui-même | 56 cases inutilisées, indices moins intuitifs |
| Bitboards | 12 entiers de 64 bits, un par type de pièce | Très rapide, génération par opérations bit à bit | Illisible pour un débutant, et sans intérêt en Python |

Le choix des bitboards mérite qu'on s'y arrête, parce que c'est celui de tous les moteurs sérieux et qu'on pourrait croire à un renoncement de notre part. Leur intérêt tient à une propriété du processeur : il manipule un entier de 64 bits en une seule instruction. Un échiquier tenant dans un entier de 64 bits, « toutes les cases attaquées par les tours blanches » se calcule en quelques opérations. Or les entiers de Python ne sont pas des mots machine : ce sont des objets de taille illimitée, alloués sur le tas. On paierait toute la complexité conceptuelle des bitboards sans en toucher le bénéfice.

Reste la mailbox, et c'est notre choix pour le reste de la série.

## La bordure de sentinelles

L'idée tient en une phrase : on entoure l'échiquier de cases qui ne sont pas des cases.

```text
    0   1   2   3   4   5   6   7   8   9
   10  11  12  13  14  15  16  17  18  19
   20 [21  22  23  24  25  26  27  28] 29   <- rangée 8 (a8 = 21, h8 = 28)
   30 [31  32  33  34  35  36  37  38] 39
   ...
   90 [91  92  93  94  95  96  97  98] 99   <- rangée 1 (a1 = 91, h1 = 98)
  100 101 102 103 104 105 106 107 108 109
  110 111 112 113 114 115 116 117 118 119
```

Le tableau fait 120 cases. Les 64 utiles sont au milieu, entourées d'une colonne de sentinelles à gauche et à droite, et de **deux** rangées en haut et en bas. Deux, et non une : un cavalier peut sauter de deux rangées d'un coup, il faut donc deux rangées de garde pour qu'il ne puisse pas passer par dessus la bordure.

Comme une rangée fait maintenant dix cases, les décalages changent : monter d'une rangée, c'est `-10`, avancer d'une colonne, c'est `+1`. Le cavalier devient `±21`, `±19`, `±12`, `±8`. Et le test de débordement disparaît :

```python
def cavalier_120(depart, plateau):
    arrivees = []
    for saut in SAUTS_120:
        arrivee = depart + saut
        if plateau[arrivee] is not BORD:  # une simple lecture de case
            arrivees.append(nom_120(arrivee))
    return arrivees
```

Le cavalier en h4 sort à droite et tombe sur la colonne de sentinelles. Quatre coups, comme il se doit. Il n'y a plus rien à oublier, parce qu'il n'y a plus de vérification particulière à faire : la bordure fait partie du tableau.

Deux fonctions de conversion suffisent pour le reste :

```python
CASES = [21 + rangee * 10 + colonne for rangee in range(8) for colonne in range(8)]


def nom_de_case(index):
    """21 -> 'a8', 98 -> 'h1'."""
    colonne = (index % 10) - 1
    rangee = (index // 10) - 2
    return "abcdefgh"[colonne] + "87654321"[rangee]


def index_de_case(nom):
    """'a8' -> 21, 'h1' -> 98."""
    colonne = "abcdefgh".index(nom[0])
    rangee = "87654321".index(nom[1])
    return 21 + rangee * 10 + colonne
```

`CASES` est la liste des 64 indices utiles, dans l'ordre de lecture d'une FEN. On s'en servira pour charger la position **et** pour l'écrire, ce qui garantit qu'on ne peut pas se tromper dans un sens sans se tromper dans l'autre : un aller-retour raté saute immédiatement aux yeux.

## Charger et écrire une FEN

Le chargement reprend le principe vu à l'article précédent, mais écrit maintenant dans le tableau de 120 cases. On commence par remplir tout le tableau de sentinelles, puis on vide les 64 cases utiles :

```python
self.cases = [BORD] * 120
for index in CASES:
    self.cases[index] = VIDE
```

Le reste des champs se lit directement, avec une seule subtilité : la case de prise en passant est convertie en indice tout de suite, pour ne pas avoir à trimballer une chaîne dans le reste du moteur.

```python
self.trait = champs[1]
self.roques = champs[2]
self.en_passant = index_de_case(champs[3]) if champs[3] != "-" else None
self.demi_coups = int(champs[4])
self.numero = int(champs[5])
```

L'écriture parcourt les mêmes 64 indices, huit par huit, en comptant les cases vides consécutives :

```python
def fen(self):
    rangees = []
    for debut in range(0, 64, 8):
        texte = ""
        vides = 0
        for index in CASES[debut:debut + 8]:
            piece = self.cases[index]
            if piece is VIDE:
                vides += 1
            else:
                if vides:
                    texte += str(vides)
                    vides = 0
                texte += piece
        if vides:
            texte += str(vides)
        rangees.append(texte)
    ...
```

Il y a une raison pratique de savoir écrire une FEN, au delà de la symétrie : c'est le seul moyen de comparer ta position à celle d'un autre programme. Toute la vérification de cet article repose là dessus.

## Le coup, volontairement pauvre

```python
class Coup:
    __slots__ = ("depart", "arrivee", "promotion")
```

Trois champs. Ni « c'est un roque », ni « c'est une prise en passant », ni « c'est une prise ».

La tentation est forte d'enrichir cette classe, et il faut y résister. Ces informations se **déduisent** de la position au moment où le coup est joué : un roi qui se déplace de deux colonnes roque, un pion qui arrive sur la case de prise en passant prend en passant. Les stocker en double, c'est créer la possibilité qu'un coup dise « roque » dans une position où ce n'en est pas un. Et un objet à trois attributs se crée et se compare bien plus vite qu'un objet à sept, ce qui compte quand on en fabrique des centaines de milliers par seconde.

La notation de sortie est celle qu'exige le protocole UCI, et rien d'autre :

```python
def __str__(self):
    """Notation UCI : e2e4, e7e8q."""
    return nom_de_case(self.depart) + nom_de_case(self.arrivee) + (self.promotion or "")
```

Pas de notation algébrique (`Cf3`, `O-O`, `e8=D`) pour l'instant : elle est ambiguë sans le contexte de la position, elle demande de savoir si un autre cavalier peut aller sur la même case, et le moteur n'en a strictement pas besoin. Elle viendra à l'article 5, uniquement pour écrire des PGN lisibles.

## Jouer et annuler : les deux fonctions les plus appelées du moteur

Voici le point où l'article bascule du confortable vers le délicat.

Un moteur explore un arbre de variantes. À profondeur 6, il visite des centaines de milliers de positions. La façon naïve d'explorer est de copier l'échiquier avant de jouer un coup, puis de jeter la copie en remontant. La façon dont procèdent tous les moteurs est de **jouer le coup sur l'échiquier lui-même, descendre, puis l'annuler**. C'est la technique dite *make/unmake*, et l'écart de performance est d'un ordre de grandeur.

Elle a un prix : annuler exige que tout ce qui n'est pas recalculable ait été mémorisé. On empile donc un enregistrement avant chaque coup.

```python
self.historique.append(
    (coup, capturee, case_capture, self.roques, self.en_passant,
     self.demi_coups, self.numero)
)
```

Regarde le compteur `demi_coups`, celui de la règle des cinquante coups. Après une prise, il vaut 0. Il est alors impossible de savoir s'il valait 37 ou 12 juste avant. Certains états sont reconstructibles après coup (les droits de roque, par déduction), d'autres non. Comme la distinction est subtile et l'oubli silencieux, la règle est simple : on empile tout.

### Piège n° 1 : la prise en passant

C'est le seul coup des échecs où la pièce capturée n'est pas sur la case d'arrivée. Un pion blanc en e5 qui prend en passant arrive en d6, mais le pion noir qu'il capture est en d5.

```python
if pion and coup.arrivee == self.en_passant:
    case_capture = coup.arrivee + (10 if blanc else -10)
else:
    case_capture = coup.arrivee
capturee = self.cases[case_capture]
```

On mémorise donc **la case de la capture**, pas seulement la pièce capturée. Une fonction `annuler` qui repose la pièce prise sur la case d'arrivée fait disparaître un pion de l'échiquier à chaque prise en passant annulée. Le moteur continue de tourner, avec un pion en moins, dans une branche de recherche sur mille.

### Piège n° 2 : les droits de roque perdus sans que le roi bouge

Le cas classique est de retirer le droit au roque quand le roi ou la tour se déplace. Il en manque un : quand la tour **est capturée sur sa case d'origine**, le droit disparaît aussi. Un fou qui prend la tour h1 annule le petit roque blanc, sans qu'aucune pièce blanche n'ait bougé.

La solution tient dans une table indexée par case, appliquée à la fois au départ et à l'arrivée du coup :

```python
ROQUES_PERDUS = {
    95: "KQ",  # e1, le roi blanc
    98: "K",   # h1
    91: "Q",   # a1
    25: "kq",  # e8, le roi noir
    28: "k",   # h8
    21: "q",   # a8
}

for case in (coup.depart, coup.arrivee):
    for lettre in ROQUES_PERDUS.get(case, ""):
        self.roques = self.roques.replace(lettre, "")
```

Six lignes de table, et le cas de la tour capturée est traité par construction. C'est plus sûr que six `if` répartis dans la fonction.

### Piège n° 3 : la promotion, à l'aller comme au retour

À l'aller, la notation UCI écrit toujours la promotion en minuscule, y compris pour les Blancs : `e7e8q`. C'est à nous de rétablir la casse selon le camp.

```python
if coup.promotion:
    self.cases[coup.arrivee] = coup.promotion.upper() if blanc else coup.promotion
else:
    self.cases[coup.arrivee] = piece
```

Au retour, l'erreur est plus fine : `annuler` reprend la pièce sur la case d'arrivée pour la reposer sur la case de départ. Si le coup était une promotion, cette pièce est une dame, et on repose donc une dame sur la septième rangée. Il faut la retransformer en pion.

```python
piece = self.cases[coup.arrivee]
if coup.promotion:
    piece = "P" if piece in BLANCS else "p"
```

Ces trois pièges ont un point commun : ils ne cassent rien de visible. Le moteur joue, la partie avance, et la position est fausse une fois sur mille dans une variante que personne ne regarde. D'où ce qui suit.

## La vérification : 1 498 positions, trois épreuves

Le fichier [`verifier_echiquier.py`](https://github.com/Frozalex/blogdungaucher/blob/main/tools/moteur-python/02-echiquier/verifier_echiquier.py) passe la structure à trois épreuves, de la moins exigeante à la plus exigeante.

**Épreuve 1, l'aller-retour FEN.** Charger une FEN puis la réécrire doit redonner exactement la même chaîne. C'est une épreuve interne : elle ne prouve que la cohérence du code avec lui-même, mais elle attrape les inversions de rangées et les erreurs de comptage des cases vides.

**Épreuve 2, jouer puis annuler.** On charge une position, on joue le coup, on l'annule, et la FEN obtenue doit être identique caractère pour caractère à celle de départ. C'est l'épreuve qui attrape les trois pièges de la section précédente.

**Épreuve 3, la confrontation à Stockfish.** On joue le coup, et on compare la position obtenue à celle que Stockfish obtient en jouant le même coup depuis la même position. C'est la seule épreuve externe, donc la seule qui prouve que notre définition d'un coup est la bonne et pas seulement cohérente.

Reste à trouver des positions. Comme on ne sait pas encore générer les coups légaux, c'est Stockfish qui joue les parties : [`generer_positions.py`](https://github.com/Frozalex/blogdungaucher/blob/main/tools/moteur-python/02-echiquier/generer_positions.py) lui fait disputer douze parties en tirant chaque coup au sort parmi ses quatre meilleurs, ce qui évite douze fois la même ouverture. On obtient 1 489 positions, chacune accompagnée du coup joué.

Avec un trou. Sur ces 1 489 positions, il y a huit promotions, treize roques, et **zéro prise en passant** : elle est trop rare pour apparaître par hasard sur douze parties. Or c'est précisément le coup qui casse `annuler`. Un jeu d'essai qui ne contient pas le cas qu'on redoute ne prouve rien.

D'où un second script, [`generer_cas_particuliers.py`](https://github.com/Frozalex/blogdungaucher/blob/main/tools/moteur-python/02-echiquier/generer_cas_particuliers.py), qui rejoue neuf séquences écrites à la main : les deux prises en passant, les quatre roques, deux promotions dont une sous-promotion en cavalier, et la capture de la tour h8 qui fait tomber le petit roque noir. Là encore, c'est Stockfish qui produit les FEN, de sorte qu'aucune position n'est recopiée à la main dans le jeu d'essai.

Le résultat :

```text
$ STOCKFISH=... python3 verifier_echiquier.py --stockfish
1498 positions dans le jeu d'essai

1. Aller-retour FEN        : 1498/1498
2. jouer puis annuler      : 1498/1498
3. Position après le coup  : 1420/1498 identiques à Stockfish, 78 écarts sur la seule case en passant

Tout est vert.
```

## Les 78 écarts, et pourquoi on les garde

Le troisième chiffre demande une explication, parce qu'un tutoriel honnête ne balaie pas les écarts sous le tapis.

Ces 78 positions ne sont pas fausses : l'échiquier, le trait, les droits de roque et les compteurs sont identiques à ceux de Stockfish. Seul le champ de prise en passant diffère. Il y a en fait **deux conventions** pour ce champ.

La FEN d'origine annonce la case survolée après toute poussée de deux cases. C'est ce que fait notre code : après 1.e4, il écrit `e3`.

Stockfish, et la plupart des moteurs modernes, ne l'annoncent que si la prise en passant est **réellement jouable** par le camp au trait. Après 1.e4 sans pion noir en d4 ou f4, il écrit `-`. C'est la convention retenue par les positions de référence de `perft`, ce qui n'est pas un détail : à l'article suivant, une position dont la case de prise en passant est annoncée à tort compterait des coups qui n'existent pas.

Pourquoi ne pas corriger tout de suite ? Parce que savoir si une prise en passant est jouable suppose de savoir générer les coups, et de vérifier qu'aucun d'eux ne laisse son propre roi en échec. C'est exactement le sujet de l'article 3. Corriger maintenant obligerait à écrire un demi générateur de coups dans une fonction d'écriture de FEN.

C'est une dette, pas un oubli. Elle est écrite noir sur blanc dans la sortie du test, avec son compteur, et elle sera remboursée à l'article suivant.

## Ce que tu as maintenant

Une structure de données de 120 cases où le débordement est impossible, la lecture et l'écriture de FEN vérifiées sur 1 498 positions réelles, et un couple `jouer` / `annuler` qui restaure exactement l'état, y compris dans les trois cas qui cassent tous les moteurs débutants.

Ce n'est pas encore un moteur : il ne sait pas quels coups sont autorisés. C'est le sujet du prochain article, le plus long et le plus ingrat de la série, celui qui contient à lui seul la majorité des bugs d'un moteur d'échecs.

**Prochain article :** générer les coups légaux en Python, où l'on découvre que la difficulté n'est pas de trouver les coups, mais d'éliminer ceux qui laissent son propre roi en échec.
