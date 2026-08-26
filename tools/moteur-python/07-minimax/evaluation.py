"""Évaluer une position : combien vaut ce qui est sur l'échiquier.

Article 6 de la série. L'évaluation répond à « qui est mieux, et de combien ? »
sans jouer un seul coup de plus. C'est une heuristique, jamais une vérité : la
seule évaluation exacte serait « gagné, nul ou perdu », et personne ne sait la
calculer aux échecs.

Deux points de vue coexistent, et les confondre est LE bug classique :
  - `materiel()` compte du point de vue des Blancs. Un score positif veut dire
    « les Blancs sont mieux », quel que soit le camp au trait. C'est la
    convention d'affichage, celle des barres d'évaluation.
  - `evaluer()` compte du point de vue du camp au trait. C'est celle qu'exige
    le négamax de l'article 8, et elle change de signe à chaque demi-coup.
"""

from echiquier import BLANCS, CASES, VIDE

# En centièmes de pion, l'unité universelle des moteurs. Les valeurs viennent
# de Shannon (1949) et n'ont pas bougé depuis : elles restent, à quelques
# points près, celles des moteurs modernes. Le roi ne vaut rien parce qu'il est
# toujours sur l'échiquier des deux côtés : lui donner une valeur ne ferait
# qu'ajouter la même constante aux deux camps.
VALEURS = {
    "P": 100,
    "N": 320,
    "B": 330,
    "R": 500,
    "Q": 900,
    "K": 0,
}


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


def evaluer(echiquier):
    """Évaluation du point de vue du camp au trait.

    C'est cette fonction que la recherche appellera. Le changement de signe
    n'est pas un détail cosmétique : sans lui, le moteur joue les meilleurs
    coups des Blancs et les pires des Noirs.
    """
    score = materiel(echiquier)
    return score if echiquier.trait == "w" else -score


def miroir(echiquier):
    """La même position, camps échangés et échiquier retourné.

    Sert uniquement à tester l'évaluation : une fonction correcte doit renvoyer
    l'opposé exact sur la position miroir. C'est le test de symétrie, et il
    attrape à peu près toutes les erreurs de signe et de casse.
    """
    from echiquier import Echiquier

    champs = echiquier.fen().split()
    rangees = champs[0].split("/")
    # On inverse l'ordre des rangées et on change la casse de chaque pièce :
    # un pion blanc en e2 devient un pion noir en e7.
    inversees = [rangee.swapcase() for rangee in reversed(rangees)]

    trait = "b" if champs[1] == "w" else "w"
    roques = "".join(sorted(champs[2].swapcase())) if champs[2] != "-" else "-"
    if champs[3] == "-":
        en_passant = "-"
    else:
        en_passant = champs[3][0] + str(9 - int(champs[3][1]))

    return Echiquier(" ".join(["/".join(inversees), trait, roques, en_passant,
                               champs[4], champs[5]]))
