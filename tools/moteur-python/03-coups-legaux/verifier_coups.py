"""Confronter le générateur de coups à Stockfish, position par position.

Le principe est celui de `perft` à la profondeur 1 : `go perft 1` fait lister à
Stockfish tous les coups légaux de la position courante. On compare ensemble à
ensemble. Un coup en trop ou un coup manquant est signalé avec la position, ce
qui suffit à le reproduire.

Trois épreuves :

1. Coups légaux : notre liste doit être exactement celle de Stockfish.
2. Aller-retour FEN : la case de prise en passant suit désormais la convention
   des moteurs modernes, donc les 78 écarts de l'article 2 doivent avoir
   disparu.
3. Position après le coup : la FEN obtenue doit être identique à celle de
   Stockfish, champ de prise en passant compris cette fois.

Usage :
    STOCKFISH=/chemin/vers/stockfish python3 verifier_coups.py
    STOCKFISH=... python3 verifier_coups.py --arret-au-premier
"""

import os
import subprocess
import sys

from echiquier import Coup, Echiquier

DOSSIER = os.path.dirname(os.path.abspath(__file__))
JEUX = ["positions.txt", "cas_particuliers.txt"]


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

    def coups_legaux(self, fen):
        self.envoyer(f"position fen {fen}")
        self.envoyer("go perft 1")
        coups = set()
        for ligne in self.lire_jusqu_a("Nodes searched"):
            if ":" in ligne and ligne.split(":")[0][:4].isalnum() and len(ligne.split(":")[0]) in (4, 5):
                coups.add(ligne.split(":")[0])
        return coups

    def fen_apres(self, fen, uci):
        self.envoyer(f"position fen {fen} moves {uci}")
        self.envoyer("d")
        for ligne in self.lire_jusqu_a("Checkers"):
            if ligne.startswith("Fen: "):
                return ligne[5:]
        raise RuntimeError("pas de FEN dans la sortie de « d »")

    def fermer(self):
        self.envoyer("quit")
        self.processus.wait(timeout=5)


def charger_jeu_d_essai():
    cas = []
    for nom in JEUX:
        chemin = os.path.join(DOSSIER, nom)
        if not os.path.exists(chemin):
            sys.exit(f"{nom} manquant : copie-le depuis le dossier de l'article 2")
        with open(chemin) as fichier:
            for ligne in fichier:
                fen, _, uci = ligne.strip().partition("|")
                if fen:
                    cas.append((fen, uci))
    return cas


def main():
    chemin = os.environ.get("STOCKFISH")
    if not chemin:
        sys.exit("Variable STOCKFISH absente")
    arret = "--arret-au-premier" in sys.argv

    cas = charger_jeu_d_essai()
    moteur = Stockfish(chemin)
    print(f"{len(cas)} positions dans le jeu d'essai\n")

    erreurs_coups = erreurs_fen = erreurs_apres = 0
    total_coups = 0

    for fen, uci in cas:
        echiquier = Echiquier(fen)

        nous = {str(coup) for coup in echiquier.coups_legaux()}
        eux = moteur.coups_legaux(fen)
        total_coups += len(eux)
        if nous != eux:
            erreurs_coups += 1
            if erreurs_coups <= 3 or arret:
                print(f"  position {fen}")
                if nous - eux:
                    print(f"    coups en trop    : {' '.join(sorted(nous - eux))}")
                if eux - nous:
                    print(f"    coups manquants  : {' '.join(sorted(eux - nous))}")
                if arret:
                    sys.exit(1)

        if echiquier.fen() != fen:
            erreurs_fen += 1
            if erreurs_fen <= 3:
                print(f"  aller-retour\n    attendu {fen}\n    obtenu  {echiquier.fen()}")

        echiquier.jouer(Coup.depuis_uci(uci))
        attendue = moteur.fen_apres(fen, uci)
        if echiquier.fen() != attendue:
            erreurs_apres += 1
            if erreurs_apres <= 3:
                print(f"  après {uci} depuis {fen}\n    attendu {attendue}\n    obtenu  {echiquier.fen()}")

    moteur.fermer()

    n = len(cas)
    print(f"1. Coups légaux            : {n - erreurs_coups}/{n} positions "
          f"({total_coups} coups comparés)")
    print(f"2. Aller-retour FEN        : {n - erreurs_fen}/{n}")
    print(f"3. Position après le coup  : {n - erreurs_apres}/{n}")
    total = erreurs_coups + erreurs_fen + erreurs_apres
    print()
    print("Tout est vert." if total == 0 else f"{total} échec(s).")
    sys.exit(1 if total else 0)


if __name__ == "__main__":
    main()
