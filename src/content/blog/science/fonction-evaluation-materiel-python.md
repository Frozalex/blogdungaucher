---
title: "Évaluer une position en Python : compter le matériel ne suffit pas"
excerpt: >-
  Un moteur qui joue toujours le coup qui gagne le plus de matériel écrase le hasard. Il mène en
  moyenne de vingt-huit pions au moment où la partie s'arrête. Et il ne gagne qu'une partie sur
  quatre, parce qu'il met son adversaire pat deux fois sur trois.
publishDate: "2027-07-06"
category: science
featured: false
featuredRank: 99
readingTime: 9 min
pillar: Intelligence artificielle
tags:
  - Python
  - moteur d'échecs
  - évaluation
  - programmation
  - valeur des pièces
  - Stockfish
  - tutoriel
  - informatique
seoTitle: "Fonction d'évaluation d'un moteur d'échecs en Python : le matériel"
seoDescription: >-
  Coder la fonction d'évaluation d'un moteur d'échecs en Python : valeur des pièces, centièmes de pion,
  point de vue du camp au trait, test de symétrie et confrontation à l'évaluation de Stockfish.
keyTakeaways:
  - Les moteurs comptent en centièmes de pion. Le roi vaut zéro parce qu'il est toujours présent des deux côtés.
  - "Deux points de vue coexistent : celui des Blancs pour l'affichage, celui du camp au trait pour la recherche. Les confondre est le bug classique."
  - Le test de symétrie (l'évaluation de la position miroir doit être l'opposé exact) attrape presque toutes les erreurs de signe.
  - Notre évaluation matérielle désigne le même camp que Stockfish dans 86,5 % des positions, avec un écart médian de 1,5 pion.
  - "Un moteur glouton finit ses parties avec 28 pions d'avance en moyenne et ne les convertit pas : il fait pat dans deux tiers des cas."
faq:
  - question: "Combien vaut chaque pièce dans un moteur d'échecs ?"
    answer: >-
      L'échelle usuelle, en centièmes de pion : pion 100, cavalier 320, fou 330, tour 500, dame 900. Les
      valeurs entières 1/3/3/5/9 remontent à Claude Shannon en 1949 ; le léger avantage donné au fou sur
      le cavalier est une correction plus tardive, tirée de statistiques de parties. Le roi vaut zéro.
  - question: "Pourquoi le roi vaut-il zéro dans l'évaluation ?"
    answer: >-
      Parce qu'il est toujours présent des deux côtés de l'échiquier. Lui attribuer une valeur, même
      énorme, ajouterait exactement la même constante aux deux camps et ne changerait donc jamais la
      différence. La perte du roi n'est pas gérée par l'évaluation mais par le générateur de coups : une
      position sans coup légal est un mat, avec un score séparé.
  - question: "Qu'est-ce qu'un centième de pion (centipawn) ?"
    answer: >-
      L'unité universelle des moteurs : un centième de la valeur d'un pion. Elle permet de travailler en
      nombres entiers, plus rapides et sans erreur d'arrondi, tout en gardant assez de finesse pour
      exprimer des différences positionnelles. Le <code>score cp 36</code> d'une sortie UCI et la barre
      d'évaluation d'un site d'échecs sont la même chose.
  - question: "Faut-il évaluer du point de vue des Blancs ou du camp au trait ?"
    answer: >-
      Les deux, séparément. L'affichage se fait du point de vue des Blancs (un score positif veut dire
      « les Blancs sont mieux »), c'est la convention des barres d'évaluation. La recherche, elle, exige
      le point de vue du <strong>camp au trait</strong>, sans quoi l'algorithme négamax de l'article 8
      joue les meilleurs coups d'un camp et les pires de l'autre.
  - question: "Pourquoi un moteur qui gagne du matériel ne gagne-t-il pas la partie ?"
    answer: >-
      Parce que le matériel est un moyen, pas un but. Mesuré sur 500 parties, un moteur purement glouton
      termine avec 28 pions d'avance en moyenne et ne gagne qu'une partie sur quatre : il met son
      adversaire <strong>pat</strong> dans deux tiers des cas, faute de savoir qu'une position sans coup
      légal et sans échec est une nulle. Voir loin est plus important que bien compter.
---

Ton moteur [joue des parties complètes](/fr/blog/un-moteur-qui-joue-au-hasard/) et n'a aucune raison de préférer un coup à un autre. Il est temps de lui en donner une.

C'est le rôle de la **fonction d'évaluation** : répondre à « qui est mieux, et de combien ? » en regardant la position, sans jouer un seul coup de plus. Elle rend un nombre, et ce nombre est une opinion. La seule évaluation exacte serait « gagné, nul ou perdu », et [personne ne sait la calculer aux échecs](/fr/blog/paradoxe-de-zermelo/).

Cet article code la plus simple des évaluations, celle que tout le monde connaît : compter les pièces. Et il se termine par un résultat que je ne m'attendais pas à mesurer aussi net.

## L'unité : le centième de pion

Les moteurs ne comptent pas en pions, ils comptent en **centièmes de pion**, le fameux *centipawn*. Deux raisons : on travaille en nombres entiers, plus rapides et sans erreur d'arrondi, et on garde assez de finesse pour exprimer des différences positionnelles qui ne valent pas un pion entier.

C'est cette unité qui s'affiche quand Stockfish répond `score cp 36`, et c'est elle que dessine la barre d'évaluation de ton site d'échecs.

```python
VALEURS = {
    "P": 100,
    "N": 320,
    "B": 330,
    "R": 500,
    "Q": 900,
    "K": 0,
}
```

Les valeurs entières 1, 3, 3, 5, 9 remontent à [Claude Shannon](https://fr.wikipedia.org/wiki/Claude_Shannon) et à son article fondateur de 1949, *Programming a Computer for Playing Chess*. Elles n'ont quasiment pas bougé depuis, ce qui est remarquable pour un domaine où tout le reste a changé trois fois. Le léger avantage donné ici au fou sur le cavalier est une correction plus tardive, tirée de statistiques sur de grandes bases de parties.

**Le roi vaut zéro**, et c'est le point qui surprend toujours. Ce n'est pas une négligence : il est présent des deux côtés de l'échiquier, en permanence. Lui donner une valeur, même énorme, ajouterait la même constante aux deux camps et ne changerait jamais la différence. La perte du roi n'est pas gérée par l'évaluation : elle est gérée par le générateur de coups, puisqu'une position sans coup légal est un mat.

## Le bug de signe, et comment ne pas l'écrire

Voici la fonction, et elle est aussi courte qu'on l'imagine.

```python
def materiel(echiquier):
    """Différence de matériel, en centièmes de pion, du point de vue des Blancs."""
    score = 0
    for case in CASES:
        piece = echiquier.cases[case]
        if piece is VIDE:
            continue
        valeur = VALEURS[piece.upper()]
        score += valeur if piece in BLANCS else -valeur
    return score
```

Ce qui suit est plus important que la fonction elle-même.

Il existe **deux points de vue** sur une évaluation, et les confondre est le bug le plus classique de tout moteur débutant.

Le premier est celui des Blancs : un score positif veut dire « les Blancs sont mieux », quel que soit le camp au trait. C'est la convention d'affichage, celle des barres d'évaluation, celle de la sortie de Stockfish.

Le second est celui du **camp au trait** : un score positif veut dire « celui qui doit jouer est mieux ». Il change donc de signe à chaque demi-coup. C'est celui qu'exigera l'algorithme négamax de l'article 8, et c'est pour cela qu'on l'écrit tout de suite, séparément.

```python
def evaluer(echiquier):
    """Évaluation du point de vue du camp au trait."""
    score = materiel(echiquier)
    return score if echiquier.trait == "w" else -score
```

Quatre lignes. Sans elles, le moteur cherche les meilleurs coups d'un camp et les **pires** de l'autre, ce qui produit un programme qui joue à peu près correctement avec les Blancs et se suicide méthodiquement avec les Noirs. Le symptôme est si étrange qu'on cherche le bug partout ailleurs.

## Le test qui attrape les erreurs de signe

On ne peut pas prouver qu'une évaluation est « juste », puisqu'elle est une opinion. On peut prouver qu'elle est **cohérente**, et le test standard s'appelle la symétrie.

L'idée : construire la position miroir, échiquier retourné et camps échangés. Une évaluation correcte doit y renvoyer l'opposé exact. Si elle ne le fait pas, elle favorise structurellement un camp, ce qui est toujours un bug.

```python
def miroir(echiquier):
    champs = echiquier.fen().split()
    rangees = champs[0].split("/")
    # On inverse l'ordre des rangées et on change la casse de chaque pièce :
    # un pion blanc en e2 devient un pion noir en e7.
    inversees = [rangee.swapcase() for rangee in reversed(rangees)]
    ...
```

Le retournement se fait sur la FEN plutôt que sur le tableau de cases, parce que la FEN encode déjà tout ce qu'il faut retourner : les rangées dans l'ordre, la casse pour la couleur, les droits de roque et la case de prise en passant. Trois lignes au lieu de trente.

Une précaution vaut d'être notée : le test vérifie aussi que **le miroir du miroir redonne la position de départ**. Sans cela, une fonction miroir fausse pourrait valider une évaluation fausse, les deux erreurs se compensant.

```text
$ STOCKFISH=... python3 verifier_evaluation.py --stockfish
1498 positions

1. Symétrie de l'évaluation : 1498/1498
2. Accord avec Stockfish    : 1305 positions comparées (193 en échec, non évaluables)
   même camp désigné meilleur      : 1129 (86.5 %)
   désaccords nets (≥ 1 pion des deux côtés) : 31 (2.4 %)
   écart médian : 151 centièmes de pion, 9e décile : 765

Tout est vert.
```

La seconde épreuve demande une explication, parce qu'elle ne cherche **pas** l'égalité. Stockfish évalue avec un réseau de neurones entraîné sur des milliards de positions ; nous comptons des pions. Attendre les mêmes nombres n'aurait aucun sens.

Ce qu'on mesure, c'est l'accord sur ce qui compte : **désigner le même camp comme étant mieux**. Sur 1 305 positions évaluables, c'est le cas 86,5 % du temps, avec seulement 2,4 % de désaccords nets où les deux annoncent au moins un pion d'avance en sens contraire. L'écart médian de 1,5 pion mesure exactement ce que le matériel ne voit pas : l'activité des pièces, la sécurité du roi, la structure de pions.

Un mot sur les 193 positions écartées. Stockfish refuse d'évaluer une position où le camp au trait est en échec, au motif qu'une évaluation statique n'a pas de sens tant qu'une capture forcée est en l'air. C'est exactement le problème que l'article 11 traitera sous le nom d'effet d'horizon, et il est intéressant de constater que le meilleur moteur du monde le contourne en refusant de répondre.

## Le moteur glouton

Une évaluation seule ne joue toujours pas. Le plus petit moteur qu'on puisse en tirer regarde chacun de ses coups, évalue la position obtenue, et garde le meilleur. Un seul demi-coup de vision.

```python
def choisir(self, echiquier, coups):
    meilleurs = []
    meilleur_score = None

    for coup in coups:
        echiquier.jouer(coup)
        # `evaluer` renvoie le score du camp au trait, or après `jouer`
        # c'est l'adversaire qui a le trait : on prend donc l'opposé pour
        # revenir à notre point de vue.
        score = -evaluer(echiquier)
        echiquier.annuler()

        if meilleur_score is None or score > meilleur_score:
            meilleur_score, meilleurs = score, [coup]
        elif score == meilleur_score:
            meilleurs.append(coup)

    return self.alea.choice(meilleurs)
```

Le `-evaluer(...)` après `jouer` est la première application concrète de la section précédente. Une fois le coup joué, c'est l'adversaire qui a le trait : l'évaluation est de son point de vue, il faut la retourner.

Et la dernière ligne n'est pas une coquetterie. Sans le tirage au sort entre coups de score égal, le moteur joue systématiquement le premier coup généré, c'est à dire le coup de la pièce la plus proche de a8. Dans toute position calme, où tous les coups valent zéro, il pousse indéfiniment le même pion. Départager au hasard coûte une ligne et évite un comportement absurde.

## Cinq cents parties contre le hasard

```text
$ python3 tournoi.py 250
Glouton contre Hasard : 314.5 / 500 (62.9 %)
  130 victoires, 369 nulles, 1 défaites
  écart Elo estimé : +92 ± 32

  Motifs de fin
    pat                            331  ( 66.2 %)
    échec et mat                   131  ( 26.2 %)
    matériel insuffisant            29  (  5.8 %)
    règle des cinquante coups        8  (  1.6 %)
    triple répétition                1  (  0.2 %)

  Avance matérielle de Glouton au moment des nulles :
    moyenne +27.82 pion, médiane +29.50, maximum +50.70
```

Le premier chiffre est celui qu'on attendait : le glouton ne perd pratiquement jamais, **une partie sur cinq cents**. Compter le matériel suffit à ne plus donner ses pièces, et un adversaire au hasard donne les siennes en permanence.

Le reste est beaucoup plus intéressant.

**Le glouton mène de vingt-huit pions au moment où la partie s'arrête.** Vingt-huit. C'est plus que le matériel initial d'un camp. Il a mangé absolument tout ce qui passait, promu des pions en dames, et il ne gagne toujours pas.

**Deux tiers des parties se terminent par un pat.** C'est là que tout se joue. Le glouton dévore les pièces noires jusqu'à ce qu'il n'en reste plus une seule capable de bouger, et le roi noir se retrouve sans coup légal, sans être en échec. Nulle. Il a fait exactement ce qu'on lui a demandé, maximiser le matériel, et cette instruction ne dit rien sur le fait de laisser un coup à l'adversaire.

Personne n'a besoin d'une meilleure fonction d'évaluation pour corriger cela. Un moteur qui verrait **un seul demi-coup de plus** constaterait qu'après sa prise, l'adversaire n'a plus de coup, et que le score est donc nul plutôt que +2800. C'est précisément ce que fait la recherche.

## Ce que cet article démontre, et qui n'était pas évident

Le matériel est un moyen, pas un but. On le sait quand on joue aux échecs ; on le mesure ici : **+28 pions d'avance ne valent que 62,9 % au score** quand la vision s'arrête à un demi-coup.

C'est aussi une bonne nouvelle pour la suite de la série. Elle indique que l'effort ne doit pas porter en priorité sur la finesse de l'évaluation, mais sur la profondeur de la recherche. Un moteur qui voit à quatre coups avec une évaluation grossière bat très largement un moteur qui voit à un coup avec une évaluation raffinée. C'est la raison pour laquelle les six articles suivants parlent presque uniquement de recherche.

**Prochain article :** minimax, l'algorithme qui suppose que l'adversaire joue bien. Le moteur cesse enfin de mettre son adversaire pat, et commence à trouver des mats en deux.
