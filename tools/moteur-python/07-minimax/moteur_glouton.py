"""Le moteur glouton : il joue le coup qui rapporte le plus, tout de suite.

Un seul demi-coup de vision. Il regarde chacun de ses coups, évalue la position
obtenue, et garde le meilleur. C'est le plus petit moteur qui joue autre chose
que n'importe quoi, et il suffit à écraser le hasard.

Il suffit aussi à montrer, dès cet article, la limite qu'aucune fonction
d'évaluation ne corrigera jamais : il prend la dame qu'on lui offre et perd la
sienne au coup suivant, parce qu'il ne voit pas le coup suivant.

Usage :
    python3 moteur_glouton.py            # une partie glouton contre hasard
"""

import random

from evaluation import evaluer
from notation import pgn, san
from partie import MoteurAuHasard, jouer_une_partie


class MoteurGlouton:
    """Profondeur 1 : le meilleur coup selon l'évaluation immédiate."""

    nom = "Glouton"

    def __init__(self, graine=None):
        self.alea = random.Random(graine)

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

        # Départager au hasard : sans cela, le moteur joue toujours le premier
        # coup généré, ce qui produit des parties identiques et un jeu absurde
        # (il pousserait le pion a en boucle dans toute position calme).
        return self.alea.choice(meilleurs)


if __name__ == "__main__":
    blancs = MoteurGlouton(1)
    noirs = MoteurAuHasard(2)
    resultat, motif, coups_san, _ = jouer_une_partie(blancs, noirs)
    entetes = {
        "Event": "Glouton contre Hasard",
        "Site": "blogdungaucher.com",
        "White": blancs.nom,
        "Black": noirs.nom,
        "Result": resultat,
        "Termination": motif,
    }
    print(pgn(entetes, coups_san, resultat))
    print()
    print(f"{len(coups_san)} demi-coups, {motif}")
