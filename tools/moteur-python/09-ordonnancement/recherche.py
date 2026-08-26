"""Alpha-bêta, plus l'ordonnancement des coups qui le rend enfin efficace.

Article 9 de la série. L'algorithme ne change pas d'une ligne : c'est toujours
le négamax avec fenêtre alpha-bêta de l'article 8. Seul change l'ORDRE dans
lequel les coups sont essayés, et cela suffit à diviser l'arbre.

La raison tient en une phrase : alpha-bêta ne peut couper que s'il a déjà
trouvé quelque chose de bon. Lui présenter les coups prometteurs en premier,
c'est lui donner de quoi couper tout de suite.

Trois heuristiques, dans cet ordre de priorité :

  1. MVV-LVA sur les prises : capturer la pièce la plus chère avec la moins
     chère. Grossier, immédiat à calculer, et remarquablement efficace.
  2. Les « killers » : les deux coups tranquilles qui ont provoqué une coupure
     ailleurs à la même profondeur. Un coup qui réfute une ligne en réfute
     souvent une autre.
  3. L'historique : un compteur global par couple (départ, arrivée), incrémenté
     à chaque coupure. C'est de la mémoire à long terme sur toute la recherche.

Usage :
    python3 recherche.py 4
    python3 recherche.py 4 "<fen>"
"""

import sys
import time

from echiquier import DEPART, Echiquier, VIDE
from evaluation import VALEURS, evaluer

MAT = 100_000
INFINI = 1_000_000
KILLERS_PAR_ETAGE = 2
PROFONDEUR_MAX = 64


class Contexte:
    """Ce que la recherche mémorise d'un appel à l'autre.

    Les killers sont indexés par étage (`ply`) et non par profondeur restante :
    ce qui réfute une ligne à trois demi-coups de la racine en réfute une autre
    au même endroit, pas à un autre endroit de l'arbre.
    """

    def __init__(self):
        self.noeuds = 0
        self.killers = [[None] * KILLERS_PAR_ETAGE for _ in range(PROFONDEUR_MAX)]
        self.historique = {}

    def retenir_killer(self, coup, ply):
        etage = self.killers[ply]
        if coup != etage[0]:
            etage[1] = etage[0]
            etage[0] = coup

    def recompenser(self, coup, profondeur):
        # Le carré de la profondeur : une coupure trouvée haut dans l'arbre
        # vaut bien plus qu'une coupure trouvée dans les feuilles.
        cle = (coup.depart, coup.arrivee)
        self.historique[cle] = self.historique.get(cle, 0) + profondeur * profondeur


def ordonner(echiquier, coups, ply, contexte):
    """Trier les coups du plus prometteur au moins prometteur."""

    def score(coup):
        victime = echiquier.cases[coup.arrivee]
        agresseur = echiquier.cases[coup.depart]

        # Prise en passant : la case d'arrivée est vide, la victime est un pion.
        if victime is VIDE and agresseur in "Pp" and coup.arrivee == echiquier.en_passant:
            return 1_000_000 + 10 * VALEURS["P"] - VALEURS["P"]

        if victime is not VIDE:
            # MVV-LVA : la victime pèse dix fois plus que l'agresseur, ce qui
            # garantit que « dame prise par pion » passe avant « pion pris par
            # dame », quelle que soit la combinaison.
            return 1_000_000 + 10 * VALEURS[victime.upper()] - VALEURS[agresseur.upper()]

        if coup.promotion:
            return 900_000 + VALEURS[coup.promotion.upper()]

        if coup in contexte.killers[ply]:
            return 800_000

        return contexte.historique.get((coup.depart, coup.arrivee), 0)

    return sorted(coups, key=score, reverse=True)


def alpha_beta(echiquier, profondeur, alpha, beta, ply, contexte, ordonne=True):
    contexte.noeuds += 1

    coups = echiquier.coups_legaux()
    if not coups:
        return -(MAT - ply) if echiquier.en_echec(echiquier.trait == "w") else 0

    if profondeur == 0:
        return evaluer(echiquier)

    if ordonne:
        coups = ordonner(echiquier, coups, ply, contexte)

    for coup in coups:
        tranquille = echiquier.cases[coup.arrivee] is VIDE and not coup.promotion

        echiquier.jouer(coup)
        score = -alpha_beta(echiquier, profondeur - 1, -beta, -alpha, ply + 1,
                            contexte, ordonne)
        echiquier.annuler()

        if score >= beta:
            # On ne retient que les coups TRANQUILLES : les prises sont déjà
            # bien classées par MVV-LVA, les mémoriser en plus ne ferait que
            # diluer l'information.
            if tranquille:
                contexte.retenir_killer(coup, ply)
                contexte.recompenser(coup, profondeur)
            return beta
        alpha = max(alpha, score)
    return alpha


def chercher(echiquier, profondeur, ordonne=True, alea=None, contexte=None):
    """Choisir un coup à la racine. Renvoie (coup, score, nœuds)."""
    contexte = contexte or Contexte()
    debut_noeuds = contexte.noeuds
    meilleurs = []
    meilleur_score = -INFINI

    coups = echiquier.coups_legaux()
    if ordonne:
        coups = ordonner(echiquier, coups, 0, contexte)

    for coup in coups:
        echiquier.jouer(coup)
        score = -alpha_beta(echiquier, profondeur - 1, -INFINI, -meilleur_score,
                            1, contexte, ordonne)
        echiquier.annuler()

        if score > meilleur_score:
            meilleur_score, meilleurs = score, [coup]
        elif score == meilleur_score:
            meilleurs.append(coup)

    coup = alea.choice(meilleurs) if alea else meilleurs[0]
    return coup, meilleur_score, contexte.noeuds - debut_noeuds


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
    print(f"{'ordonnancement':16} {'coup':6} {'score':>10} {'nœuds':>12} {'durée':>9}")
    for ordonne in (False, True):
        debut = time.perf_counter()
        coup, score, noeuds = chercher(Echiquier(fen), profondeur, ordonne)
        duree = time.perf_counter() - debut
        etiquette = "avec" if ordonne else "sans"
        print(f"{etiquette:16} {str(coup):6} {texte_du_score(score):>10} "
              f"{noeuds:>12} {duree:>8.2f}s")
