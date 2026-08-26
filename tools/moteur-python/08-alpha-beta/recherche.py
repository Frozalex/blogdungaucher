"""Trois recherches qui donnent le même résultat, à des prix très différents.

Article 8 de la série. Les trois fonctions renvoient exactement le même score
pour une position et une profondeur données. C'est la propriété qui rend la
comparaison possible, et c'est ce que le test de cet article vérifie.

  - `minimax`    : la définition, deux branches, du point de vue des Blancs.
  - `negamax`    : la même chose en une branche, du point de vue du camp au
                   trait, grâce à min(a,b) = -max(-a,-b).
  - `alpha_beta` : négamax augmenté d'un élagage qui abandonne une branche dès
                   qu'elle est démontrée inutile. Même résultat, arbre bien
                   plus petit.

Usage :
    python3 recherche.py 4
    python3 recherche.py 4 "<fen>"
"""

import sys
import time

from echiquier import DEPART, Echiquier
from evaluation import evaluer, materiel

MAT = 100_000
INFINI = 1_000_000


# --------------------------------------------------------------------- minimax

def minimax(echiquier, profondeur, ply, compteur):
    """Score du point de vue des BLANCS. Conservé pour la comparaison."""
    compteur[0] += 1

    coups = echiquier.coups_legaux()
    if not coups:
        if echiquier.en_echec(echiquier.trait == "w"):
            return -(MAT - ply) if echiquier.trait == "w" else MAT - ply
        return 0

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


# --------------------------------------------------------------------- negamax

def negamax(echiquier, profondeur, ply, compteur):
    """Score du point de vue du CAMP AU TRAIT.

    Une seule branche au lieu de deux. Le `-` devant l'appel récursif fait tout
    le travail : le score de l'adversaire, vu de chez lui, devient notre score
    en changeant de signe.
    """
    compteur[0] += 1

    coups = echiquier.coups_legaux()
    if not coups:
        # Le camp au trait n'a aucun coup : maté s'il est en échec, pat sinon.
        return -(MAT - ply) if echiquier.en_echec(echiquier.trait == "w") else 0

    if profondeur == 0:
        return evaluer(echiquier)

    meilleur = -INFINI
    for coup in coups:
        echiquier.jouer(coup)
        meilleur = max(meilleur, -negamax(echiquier, profondeur - 1, ply + 1, compteur))
        echiquier.annuler()
    return meilleur


# ------------------------------------------------------------------ alpha-bêta

def alpha_beta(echiquier, profondeur, alpha, beta, ply, compteur):
    """Négamax avec élagage. Résultat identique, arbre plus petit.

    `alpha` : le meilleur score que le camp au trait s'est déjà garanti ailleurs.
    `beta`  : le meilleur score que l'ADVERSAIRE s'est déjà garanti plus haut.

    Dès qu'un coup donne un score >= beta, la branche est abandonnée : le coup
    est trop bon pour nous, donc l'adversaire ne nous laissera jamais arriver
    ici. Savoir à quel point il est bon ne servirait à rien.
    """
    compteur[0] += 1

    coups = echiquier.coups_legaux()
    if not coups:
        return -(MAT - ply) if echiquier.en_echec(echiquier.trait == "w") else 0

    if profondeur == 0:
        return evaluer(echiquier)

    for coup in coups:
        echiquier.jouer(coup)
        score = -alpha_beta(echiquier, profondeur - 1, -beta, -alpha, ply + 1, compteur)
        echiquier.annuler()

        if score >= beta:
            return beta  # coupure : l'adversaire évitera cette ligne
        alpha = max(alpha, score)
    return alpha


# ---------------------------------------------------------------------- racine

def chercher(echiquier, profondeur, methode="alpha_beta", alea=None):
    """Choisir un coup à la racine. Renvoie (coup, score côté trait, nœuds)."""
    compteur = [0]
    blanc = echiquier.trait == "w"
    meilleurs = []
    meilleur_score = -INFINI

    for coup in echiquier.coups_legaux():
        echiquier.jouer(coup)
        if methode == "minimax":
            score = minimax(echiquier, profondeur - 1, 1, compteur)
            score = score if blanc else -score
        elif methode == "negamax":
            score = -negamax(echiquier, profondeur - 1, 1, compteur)
        else:
            # La fenêtre part de (meilleur score déjà trouvé, +infini) : c'est
            # déjà de l'élagage à la racine, et il ne coûte rien.
            score = -alpha_beta(echiquier, profondeur - 1, -INFINI, -meilleur_score,
                                1, compteur)
        echiquier.annuler()

        if score > meilleur_score:
            meilleur_score, meilleurs = score, [coup]
        elif score == meilleur_score:
            meilleurs.append(coup)

    coup = alea.choice(meilleurs) if alea else meilleurs[0]
    return coup, meilleur_score, compteur[0]


def texte_du_score(score):
    if abs(score) >= MAT - 1000:
        coups = (MAT - abs(score) + 1) // 2
        return f"mat en {coups}" if score > 0 else f"maté en {coups}"
    return f"{score / 100:+.2f}"


if __name__ == "__main__":
    profondeur = int(sys.argv[1]) if len(sys.argv) > 1 else 4
    fen = sys.argv[2] if len(sys.argv) > 2 else DEPART

    print(Echiquier(fen))
    print()
    print(f"{'méthode':12} {'coup':6} {'score':>10} {'nœuds':>12} {'durée':>9}")
    for methode in ("minimax", "negamax", "alpha_beta"):
        debut = time.perf_counter()
        coup, score, noeuds = chercher(Echiquier(fen), profondeur, methode)
        duree = time.perf_counter() - debut
        print(f"{methode:12} {str(coup):6} {texte_du_score(score):>10} "
              f"{noeuds:>12} {duree:>8.2f}s")
