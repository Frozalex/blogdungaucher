"""Vérifier que l'élagage ne change rien au résultat, et chiffrer ce qu'il rapporte.

C'est la propriété fondamentale d'alpha-bêta, et elle est trop belle pour être
crue sur parole : à profondeur égale, il renvoie EXACTEMENT le score de minimax.
Pas une approximation, pas un compromis. Il se contente de ne pas explorer les
branches dont il peut démontrer qu'elles ne changeront rien.

Le test compare donc les trois recherches sur des positions réelles :
  - les scores doivent être identiques, aux trois méthodes ;
  - on mesure au passage le nombre de nœuds visités par chacune.

Le coup renvoyé peut, lui, différer : quand plusieurs coups partagent le
meilleur score, alpha-bêta n'a aucune raison de trouver les mêmes ex aequo,
puisqu'il n'explore pas tout. Seul le score est un invariant.

Usage :
    python3 verifier_elagage.py            # profondeur 3, 40 positions
    python3 verifier_elagage.py 4 20
"""

import os
import sys
import time

from echiquier import Echiquier
from recherche import chercher, texte_du_score

DOSSIER = os.path.dirname(os.path.abspath(__file__))


def charger(nombre):
    """Un échantillon régulier du jeu de positions, pour couvrir toutes les phases."""
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
    profondeur = int(sys.argv[1]) if len(sys.argv) > 1 else 3
    nombre = int(sys.argv[2]) if len(sys.argv) > 2 else 40
    fens = charger(nombre)

    print(f"{len(fens)} positions, profondeur {profondeur}\n")

    totaux = {"minimax": 0, "negamax": 0, "alpha_beta": 0}
    durees = {"minimax": 0.0, "negamax": 0.0, "alpha_beta": 0.0}
    desaccords = 0
    coups_differents = 0
    pires = []

    for fen in fens:
        resultats = {}
        for methode in totaux:
            debut = time.perf_counter()
            coup, score, noeuds = chercher(Echiquier(fen), profondeur, methode)
            durees[methode] += time.perf_counter() - debut
            totaux[methode] += noeuds
            resultats[methode] = (str(coup), score, noeuds)

        scores = {score for _, score, _ in resultats.values()}
        if len(scores) != 1:
            desaccords += 1
            if desaccords <= 3:
                print(f"  DÉSACCORD sur {fen}")
                for methode, (coup, score, _) in resultats.items():
                    print(f"    {methode:12} {coup} {texte_du_score(score)}")
        if len({coup for coup, _, _ in resultats.values()}) != 1:
            coups_differents += 1

        rapport_local = resultats["negamax"][2] / max(1, resultats["alpha_beta"][2])
        pires.append((rapport_local, fen))

    print(f"{'méthode':12} {'nœuds':>14} {'durée':>10}  {'facteur':>8}")
    for methode in ("minimax", "negamax", "alpha_beta"):
        facteur = totaux["negamax"] / totaux[methode]
        print(f"{methode:12} {totaux[methode]:>14} {durees[methode]:>9.1f}s "
              f"{facteur:>8.2f}x")

    print()
    print(f"Scores identiques aux trois méthodes : {len(fens) - desaccords}/{len(fens)}")
    print(f"Coup renvoyé différent (ex aequo)    : {coups_differents}/{len(fens)}")

    pires.sort()
    print(f"Gain d'alpha-bêta : de {pires[0][0]:.1f}x (pire cas) "
          f"à {pires[-1][0]:.1f}x (meilleur cas)")
    print()
    print("Tout est vert." if desaccords == 0 else f"{desaccords} désaccord(s).")
    sys.exit(1 if desaccords else 0)


if __name__ == "__main__":
    main()
