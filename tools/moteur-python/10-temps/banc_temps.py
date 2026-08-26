"""Vérifier que le moteur respecte son budget, et que l'itératif ne coûte rien.

Deux épreuves.

1. LE RESPECT DU TEMPS. On demande au moteur de jouer en n secondes, sur
   beaucoup de positions, et on regarde ce qu'il fait vraiment. Un dépassement
   n'est pas une inélégance : à la pendule, c'est la partie perdue.

2. LE PRIX DE L'ITÉRATIF. On compare le nombre de nœuds visités pour atteindre
   la profondeur n de deux façons : directement, et en passant par toutes les
   profondeurs intermédiaires. L'intuition dit que la seconde doit être plus
   chère puisqu'elle refait tout. La mesure dit le contraire, parce que chaque
   itération renseigne la suivante sur le meilleur coup.

Usage :
    python3 banc_temps.py                 # budget 1 s, 20 positions
    python3 banc_temps.py 2 15 4
"""

import os
import sys
import time

from echiquier import Echiquier
from recherche import Contexte, chercher, chercher_a_profondeur

DOSSIER = os.path.dirname(os.path.abspath(__file__))


def charger(nombre):
    fens = []
    for nom in ("positions.txt", "cas_particuliers.txt"):
        with open(os.path.join(DOSSIER, nom)) as fichier:
            for ligne in fichier:
                fen = ligne.strip().partition("|")[0]
                if fen:
                    fens.append(fen)
    pas = max(1, len(fens) // nombre)
    return fens[::pas][:nombre]


def main():
    budget = float(sys.argv[1]) if len(sys.argv) > 1 else 1.0
    nombre = int(sys.argv[2]) if len(sys.argv) > 2 else 20
    profondeur = int(sys.argv[3]) if len(sys.argv) > 3 else 4
    fens = charger(nombre)

    # --- 1. respect du budget ----------------------------------------------
    print(f"1. Budget de {budget:.2f} s sur {len(fens)} positions")
    durees = []
    profondeurs = []
    for fen in fens:
        _, _, atteinte, _, duree = chercher(Echiquier(fen), budget)
        durees.append(duree)
        profondeurs.append(atteinte)

    depassements = [d for d in durees if d > budget * 1.05]
    print(f"   durée médiane {sorted(durees)[len(durees) // 2]:.3f} s, "
          f"maximum {max(durees):.3f} s")
    print(f"   dépassements de plus de 5 % : {len(depassements)}/{len(fens)}")
    print(f"   profondeur atteinte : de {min(profondeurs)} à {max(profondeurs)}, "
          f"moyenne {sum(profondeurs) / len(profondeurs):.2f}")

    # --- 2. prix de l'approfondissement itératif ---------------------------
    print(f"\n2. Atteindre la profondeur {profondeur}, en direct ou par étapes")
    directs = 0
    iteratifs = 0
    debut = time.perf_counter()
    for fen in fens:
        contexte = Contexte()
        chercher_a_profondeur(Echiquier(fen), profondeur, contexte)
        directs += contexte.noeuds
    duree_directe = time.perf_counter() - debut

    debut = time.perf_counter()
    for fen in fens:
        _, _, _, noeuds, _ = chercher(Echiquier(fen), None, profondeur)
        iteratifs += noeuds
    duree_iterative = time.perf_counter() - debut

    print(f"   directement à {profondeur}   : {directs:>10} nœuds  {duree_directe:>7.1f} s")
    print(f"   par 1, 2, ... {profondeur}   : {iteratifs:>10} nœuds  "
          f"{duree_iterative:>7.1f} s")
    rapport = directs / iteratifs
    if rapport >= 1:
        print(f"   l'itératif est {rapport:.2f}x MOINS cher, "
              f"alors qu'il refait tout le travail")
    else:
        print(f"   l'itératif est {1 / rapport:.2f}x plus cher")


if __name__ == "__main__":
    main()
