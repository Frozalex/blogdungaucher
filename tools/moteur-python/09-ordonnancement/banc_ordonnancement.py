"""Chiffrer ce que rapporte l'ordonnancement des coups.

Deux mesures, qui ne disent pas la même chose.

1. À PROFONDEUR FIXE, combien de positions visite-t-on avec et sans tri ? C'est
   la mesure propre : l'arbre exploré est le seul objet qui change, et le score
   renvoyé doit rester identique, ce que le banc vérifie au passage.

2. À TEMPS FIXE, quelle profondeur atteint-on ? C'est la mesure utile, celle
   qui compte pour un joueur. Elle intègre le coût du tri lui-même, qui n'est
   pas nul : trier trente coups à chaque nœud se paie.

Usage :
    python3 banc_ordonnancement.py                 # profondeur 4, budget 5 s
    python3 banc_ordonnancement.py 4 5 12
"""

import os
import sys
import time

from echiquier import Echiquier
from recherche import chercher, texte_du_score

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


def profondeur_en(budget, fen, ordonne):
    """Plus grande profondeur dont la recherche COMPLÈTE tient dans le budget.

    On ne coupe pas une recherche en cours : une recherche interrompue ne
    renvoie rien d'exploitable, et c'est précisément le problème que l'article
    suivant résoudra. On essaie donc des profondeurs croissantes jusqu'à ce que
    l'une dépasse le budget, et on garde la dernière qui tenait.
    """
    atteinte = 0
    cumul = 0.0
    for profondeur in range(1, 12):
        debut = time.perf_counter()
        chercher(Echiquier(fen), profondeur, ordonne)
        duree = time.perf_counter() - debut
        cumul += duree
        if cumul > budget:
            break
        atteinte = profondeur
    return atteinte


def main():
    profondeur = int(sys.argv[1]) if len(sys.argv) > 1 else 4
    budget = float(sys.argv[2]) if len(sys.argv) > 2 else 5.0
    nombre = int(sys.argv[3]) if len(sys.argv) > 3 else 12
    fens = charger(nombre)

    print(f"{len(fens)} positions\n")

    # --- 1. profondeur fixe -------------------------------------------------
    print(f"À profondeur {profondeur} fixe")
    totaux = {False: 0, True: 0}
    durees = {False: 0.0, True: 0.0}
    desaccords = 0

    for fen in fens:
        scores = {}
        for ordonne in (False, True):
            debut = time.perf_counter()
            _, score, noeuds = chercher(Echiquier(fen), profondeur, ordonne)
            durees[ordonne] += time.perf_counter() - debut
            totaux[ordonne] += noeuds
            scores[ordonne] = score
        if scores[False] != scores[True]:
            desaccords += 1
            print(f"  DÉSACCORD sur {fen} : "
                  f"{texte_du_score(scores[False])} vs {texte_du_score(scores[True])}")

    for ordonne in (False, True):
        etiquette = "avec tri" if ordonne else "sans tri"
        print(f"  {etiquette:10} {totaux[ordonne]:>12} nœuds  "
              f"{durees[ordonne]:>8.1f} s")
    print(f"  gain : {totaux[False] / totaux[True]:.1f}x sur les nœuds, "
          f"{durees[False] / durees[True]:.1f}x sur le temps")
    print(f"  scores identiques : {len(fens) - desaccords}/{len(fens)}")

    # --- 2. temps fixe ------------------------------------------------------
    print(f"\nAvec un budget de {budget:.0f} s par position")
    atteintes = {False: [], True: []}
    for fen in fens:
        for ordonne in (False, True):
            atteintes[ordonne].append(profondeur_en(budget, fen, ordonne))

    for ordonne in (False, True):
        etiquette = "avec tri" if ordonne else "sans tri"
        valeurs = atteintes[ordonne]
        moyenne = sum(valeurs) / len(valeurs)
        print(f"  {etiquette:10} profondeur moyenne {moyenne:.2f}  "
              f"(min {min(valeurs)}, max {max(valeurs)})")

    gagnees = sum(a - b for a, b in zip(atteintes[True], atteintes[False]))
    print(f"  {gagnees} demi-coups de profondeur gagnés au total sur "
          f"{len(fens)} positions")

    sys.exit(1 if desaccords else 0)


if __name__ == "__main__":
    main()
