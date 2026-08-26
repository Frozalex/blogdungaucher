"""Minimax : chercher en supposant que l'adversaire joue bien.

Article 7 de la série. Le moteur glouton de l'article 6 regardait un seul
demi-coup. Minimax en regarde `profondeur`, en alternant deux hypothèses : les
Blancs choisissent le maximum, les Noirs le minimum, tout étant compté du point
de vue des Blancs.

C'est volontairement la version « à deux fonctions », la plus proche de la
définition. L'article 8 la remplacera par le négamax, qui fait la même chose en
deux fois moins de lignes, puis par l'élagage alpha-bêta, qui fait la même
chose beaucoup plus vite.

Usage :
    python3 recherche.py 3 "<fen>"
"""

import sys

from echiquier import DEPART, Echiquier
from evaluation import materiel

# Un score de mat doit écraser toute considération matérielle : on ne renonce
# pas à un mat pour gagner une dame. 100 000 centièmes de pion valent mille
# pions, soit largement plus que tout ce qui tient sur un échiquier.
MAT = 100_000
INFINI = 1_000_000


def minimax(echiquier, profondeur, ply, compteur):
    """Score de la position, DU POINT DE VUE DES BLANCS.

    `ply` est la distance à la racine. Elle sert uniquement aux scores de mat :
    un mat proche doit valoir plus qu'un mat lointain, sans quoi le moteur,
    voyant deux mats, peut choisir le plus long et tourner en rond
    indéfiniment sans jamais le porter.
    """
    compteur[0] += 1

    coups = echiquier.coups_legaux()
    if not coups:
        if echiquier.en_echec(echiquier.trait == "w"):
            # Le camp au trait est maté : c'est une catastrophe pour lui.
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


def chercher(echiquier, profondeur, alea=None):
    """Choisir un coup à la racine. Renvoie (coup, score côté trait, nœuds).

    Le score renvoyé est ramené au point de vue du camp au trait, parce que
    c'est ce qu'attend un utilisateur : « je suis mieux de tant ».
    """
    compteur = [0]
    blanc = echiquier.trait == "w"
    meilleurs = []
    meilleur_score = None

    for coup in echiquier.coups_legaux():
        echiquier.jouer(coup)
        score = minimax(echiquier, profondeur - 1, 1, compteur)
        echiquier.annuler()

        # Du point de vue du camp qui joue.
        score = score if blanc else -score
        if meilleur_score is None or score > meilleur_score:
            meilleur_score, meilleurs = score, [coup]
        elif score == meilleur_score:
            meilleurs.append(coup)

    coup = alea.choice(meilleurs) if alea else meilleurs[0]
    return coup, meilleur_score, compteur[0]


def texte_du_score(score):
    """« +1.50 » ou « mat en 3 », comme le ferait une interface."""
    if abs(score) >= MAT - 1000:
        coups = (MAT - abs(score) + 1) // 2
        return f"mat en {coups}" if score > 0 else f"maté en {coups}"
    return f"{score / 100:+.2f}"


if __name__ == "__main__":
    profondeur = int(sys.argv[1]) if len(sys.argv) > 1 else 3
    fen = sys.argv[2] if len(sys.argv) > 2 else DEPART

    echiquier = Echiquier(fen)
    print(echiquier)
    print()
    for n in range(1, profondeur + 1):
        coup, score, noeuds = chercher(Echiquier(fen), n)
        print(f"profondeur {n} : {coup}  score {texte_du_score(score):>10}  "
              f"{noeuds:>10} nœuds")
