"""Le premier moteur de la série : il joue au hasard, et il joue jusqu'au bout.

Ridicule, et pourtant indispensable. Ce fichier met en place la boucle de partie
et les conditions de fin (mat, pat, cinquante coups, matériel insuffisant,
triple répétition), c'est à dire tout ce qui entoure le choix du coup. À partir
de l'article suivant, on ne changera plus qu'une seule ligne : celle qui choisit.

Usage :
    python3 partie.py                  # une partie, affichée en PGN
    python3 partie.py 500              # 500 parties, statistiques seulement
"""

import random
import sys
from collections import Counter

from echiquier import Echiquier
from notation import pgn, san


class MoteurAuHasard:
    """Le moteur le plus mauvais qu'on puisse écrire tout en restant légal."""

    nom = "Hasard"

    def __init__(self, graine=None):
        self.alea = random.Random(graine)

    def choisir(self, echiquier, coups):
        return self.alea.choice(coups)


def jouer_une_partie(blancs, noirs, avec_notation=True, rendre_position=False):
    """Dérouler une partie entière et renvoyer (résultat, motif, coups).

    Aucune limite de coups n'est nécessaire : la règle des cinquante coups
    garantit la terminaison. Le compteur ne se remet à zéro que sur une prise
    ou un coup de pion, or il n'y a qu'un nombre fini de pièces à prendre et
    les pions ne reculent jamais.
    """
    echiquier = Echiquier()
    cles_vues = Counter()
    coups_san = []
    coups_uci = []

    while True:
        cles_vues[echiquier.cle_position()] += 1
        verdict = echiquier.resultat(cles_vues)
        if verdict:
            resultat, motif = verdict
            if rendre_position:
                # La position finale sert aux mesures : de combien de matériel
                # le vainqueur menait-il, à quoi ressemblait la nulle.
                return resultat, motif, coups_san, coups_uci, echiquier
            return resultat, motif, coups_san, coups_uci

        coups = echiquier.coups_legaux()
        moteur = blancs if echiquier.trait == "w" else noirs
        coup = moteur.choisir(echiquier, coups)

        if avec_notation:
            coups_san.append(san(echiquier, coup))
        coups_uci.append(str(coup))
        echiquier.jouer(coup)


def une_partie(graine):
    blancs = MoteurAuHasard(graine)
    noirs = MoteurAuHasard(graine + 1)
    resultat, motif, coups_san, _ = jouer_une_partie(blancs, noirs)
    entetes = {
        "Event": "Partie au hasard",
        "Site": "blogdungaucher.com",
        "White": blancs.nom,
        "Black": noirs.nom,
        "Result": resultat,
        "Termination": motif,
    }
    print(pgn(entetes, coups_san, resultat))
    print()
    print(f"{len(coups_san)} demi-coups, {motif}")


def statistiques(nombre):
    resultats = Counter()
    motifs = Counter()
    longueurs = []

    for graine in range(nombre):
        blancs = MoteurAuHasard(2 * graine)
        noirs = MoteurAuHasard(2 * graine + 1)
        resultat, motif, _, coups_uci = jouer_une_partie(blancs, noirs, avec_notation=False)
        resultats[resultat] += 1
        motifs[motif] += 1
        longueurs.append(len(coups_uci))
        if (graine + 1) % 50 == 0:
            print(f"  {graine + 1}/{nombre} parties", file=sys.stderr)

    print(f"{nombre} parties au hasard\n")
    print("Résultats")
    for resultat, compte in sorted(resultats.items()):
        print(f"  {resultat:8} {compte:5}  ({100 * compte / nombre:5.1f} %)")
    print("\nMotifs de fin")
    for motif, compte in motifs.most_common():
        print(f"  {motif:28} {compte:5}  ({100 * compte / nombre:5.1f} %)")
    print(f"\nLongueur : {min(longueurs)} à {max(longueurs)} demi-coups, "
          f"médiane {sorted(longueurs)[len(longueurs) // 2]}")


if __name__ == "__main__":
    if len(sys.argv) > 1:
        statistiques(int(sys.argv[1]))
    else:
        une_partie(20260821)
