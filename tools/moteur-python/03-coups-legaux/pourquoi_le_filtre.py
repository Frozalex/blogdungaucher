"""Chiffrer ce que coûte, et ce que rapporte, le filtre de légalité.

Le générateur produit d'abord des coups « pseudo-légaux » : conformes au
déplacement des pièces, mais sans garantie que le roi ne reste pas en échec.
Beaucoup de tutoriels s'arrêtent là, en supposant que le cas est rare. Ce
script mesure à quel point il ne l'est pas, sur les 1 498 positions réelles du
jeu d'essai.

Usage :
    python3 pourquoi_le_filtre.py
"""

import os
import time

from echiquier import Echiquier

DOSSIER = os.path.dirname(os.path.abspath(__file__))


def charger():
    fens = []
    for nom in ("positions.txt", "cas_particuliers.txt"):
        with open(os.path.join(DOSSIER, nom)) as fichier:
            for ligne in fichier:
                fen = ligne.strip().partition("|")[0]
                if fen:
                    fens.append(fen)
    return fens


if __name__ == "__main__":
    fens = charger()

    pseudo_total = legaux_total = 0
    positions_touchees = 0
    pire = None

    for fen in fens:
        echiquier = Echiquier(fen)
        pseudo = len(echiquier.coups_pseudo_legaux())
        legaux = len(echiquier.coups_legaux())
        pseudo_total += pseudo
        legaux_total += legaux
        if pseudo != legaux:
            positions_touchees += 1
            if pire is None or pseudo - legaux > pire[1]:
                pire = (fen, pseudo - legaux, pseudo, legaux)

    print(f"{len(fens)} positions")
    print(f"  coups pseudo-légaux : {pseudo_total}")
    print(f"  coups légaux        : {legaux_total}")
    print(f"  illégaux            : {pseudo_total - legaux_total} "
          f"({100 * (pseudo_total - legaux_total) / pseudo_total:.2f} %)")
    print(f"  positions concernées : {positions_touchees} "
          f"({100 * positions_touchees / len(fens):.1f} %)")
    print()
    print("Pire position du jeu d'essai :")
    print(f"  {pire[0]}")
    print(f"  {pire[2]} pseudo-légaux, {pire[3]} légaux, soit {pire[1]} coups illégaux")

    # Ce que coûte le filtre : un jouer/annuler et une détection d'échec par
    # coup candidat. C'est le poste que l'article 9 s'emploiera à réduire.
    debut = time.perf_counter()
    for fen in fens:
        Echiquier(fen).coups_pseudo_legaux()
    sans = time.perf_counter() - debut

    debut = time.perf_counter()
    for fen in fens:
        Echiquier(fen).coups_legaux()
    avec = time.perf_counter() - debut

    print()
    print(f"Génération pseudo-légale seule : {sans:.2f} s")
    print(f"Génération légale complète     : {avec:.2f} s  (x{avec / sans:.1f})")
