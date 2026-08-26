"""Mesurer l'effet d'horizon, et ce que la quiescence en retire.

Deux épreuves, l'une autonome et l'autre confrontée à Stockfish.

1. L'ÉCART INTERNE. Pour chaque position, on compare l'évaluation statique
   (celle que la recherche utiliserait telle quelle à ses feuilles) à
   l'évaluation calme (celle obtenue après avoir épuisé les prises). Quand les
   deux diffèrent de plus d'un pion, la position n'aurait jamais dû être
   évaluée en l'état : c'est exactement l'effet d'horizon, mesuré sans avoir
   besoin d'un arbitre extérieur.

2. L'ACCORD AVEC STOCKFISH. On compare les deux évaluations à ce que Stockfish
   annonce après une vraie recherche. Si la quiescence sert à quelque chose,
   elle doit réduire l'écart médian.

Usage :
    python3 verifier_quiescence.py                    # épreuve 1 seule
    STOCKFISH=... python3 verifier_quiescence.py --stockfish 200
"""

import os
import subprocess
import sys

from echiquier import Echiquier
from evaluation import evaluer
from recherche import evaluation_calme

DOSSIER = os.path.dirname(os.path.abspath(__file__))


def charger(nombre=None):
    fens = []
    for nom in ("positions.txt", "cas_particuliers.txt"):
        with open(os.path.join(DOSSIER, nom)) as fichier:
            for ligne in fichier:
                fen = ligne.strip().partition("|")[0]
                if fen:
                    fens.append(fen)
    if nombre:
        pas = max(1, len(fens) // nombre)
        return fens[::pas][:nombre]
    return fens


class Stockfish:
    def __init__(self, chemin):
        self.processus = subprocess.Popen(
            [chemin], stdin=subprocess.PIPE, stdout=subprocess.PIPE,
            text=True, bufsize=1,
        )
        self.envoyer("uci")
        self.lire_jusqu_a("uciok")

    def envoyer(self, commande):
        self.processus.stdin.write(commande + "\n")
        self.processus.stdin.flush()

    def lire_jusqu_a(self, prefixe):
        lignes = []
        for ligne in self.processus.stdout:
            lignes.append(ligne.rstrip("\n"))
            if lignes[-1].startswith(prefixe):
                return lignes
        raise RuntimeError(f"moteur arrêté sans {prefixe!r}")

    def score(self, fen, profondeur=8):
        """Score de recherche, en centièmes de pion, du point de vue du trait."""
        self.envoyer(f"position fen {fen}")
        self.envoyer(f"go depth {profondeur}")
        valeur = None
        for ligne in self.lire_jusqu_a("bestmove"):
            champs = ligne.split()
            if " score cp " in ligne:
                valeur = int(champs[champs.index("cp") + 1])
            elif " score mate " in ligne:
                valeur = 10_000 if int(champs[champs.index("mate") + 1]) > 0 else -10_000
        return valeur

    def fermer(self):
        self.envoyer("quit")
        self.processus.wait(timeout=5)


def mediane(valeurs):
    valeurs = sorted(valeurs)
    return valeurs[len(valeurs) // 2]


def main():
    avec_stockfish = "--stockfish" in sys.argv
    nombre = next((int(a) for a in sys.argv[1:] if a.isdigit()), None)
    fens = charger(nombre)
    print(f"{len(fens)} positions\n")

    ecarts = []
    trompeuses = 0
    for fen in fens:
        echiquier = Echiquier(fen)
        statique = evaluer(echiquier)
        calme = evaluation_calme(Echiquier(fen))
        ecart = abs(statique - calme)
        ecarts.append(ecart)
        if ecart >= 100:
            trompeuses += 1

    print("1. Écart entre évaluation statique et évaluation calme")
    print(f"   positions où l'écart atteint 1 pion : {trompeuses}/{len(fens)} "
          f"({100 * trompeuses / len(fens):.1f} %)")
    print(f"   écart médian : {mediane(ecarts)} centièmes de pion, "
          f"maximum {max(ecarts)}")

    if not avec_stockfish:
        return

    chemin = os.environ.get("STOCKFISH")
    if not chemin:
        sys.exit("Variable STOCKFISH absente")
    moteur = Stockfish(chemin)

    ecarts_statique = []
    ecarts_calme = []
    signes_statique = signes_calme = 0
    for fen in fens:
        reference = moteur.score(fen)
        if reference is None or abs(reference) >= 10_000:
            continue
        statique = evaluer(Echiquier(fen))
        calme = evaluation_calme(Echiquier(fen))
        ecarts_statique.append(abs(statique - reference))
        ecarts_calme.append(abs(calme - reference))
        if (statique > 0) == (reference > 0):
            signes_statique += 1
        if (calme > 0) == (reference > 0):
            signes_calme += 1
    moteur.fermer()

    total = len(ecarts_statique)
    print(f"\n2. Écart à la recherche de Stockfish (profondeur 8), {total} positions")
    print(f"   évaluation statique : médiane {mediane(ecarts_statique):>4} cp, "
          f"même camp désigné {100 * signes_statique / total:.1f} %")
    print(f"   évaluation calme    : médiane {mediane(ecarts_calme):>4} cp, "
          f"même camp désigné {100 * signes_calme / total:.1f} %")


if __name__ == "__main__":
    main()
