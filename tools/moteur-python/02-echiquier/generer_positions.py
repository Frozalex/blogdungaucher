"""Produire un jeu d'essai de positions réelles, avec le coup joué depuis chacune.

On ne sait pas encore générer les coups légaux (c'est l'article 3) : c'est donc
Stockfish qui joue les parties. Pour éviter cent fois la même ouverture, chaque
coup est tiré au sort parmi les quatre meilleurs (MultiPV 4) à faible
profondeur. Les parties partent volontairement dans des finales de pions, ce qui
fait apparaître promotions et prises en passant, précisément les cas que le
jeu d'essai doit couvrir.

Sortie : positions.txt, une ligne « FEN|coup_uci ».

Usage :
    STOCKFISH=/chemin/vers/stockfish python3 generer_positions.py 12
"""

import os
import random
import subprocess
import sys


class Stockfish:
    def __init__(self, chemin):
        self.processus = subprocess.Popen(
            [chemin], stdin=subprocess.PIPE, stdout=subprocess.PIPE,
            text=True, bufsize=1,
        )
        self.envoyer("uci")
        self.lire_jusqu_a("uciok")
        self.envoyer("setoption name MultiPV value 4")
        self.envoyer("isready")
        self.lire_jusqu_a("readyok")

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

    def poser(self, coups):
        if coups:
            self.envoyer("position startpos moves " + " ".join(coups))
        else:
            self.envoyer("position startpos")

    def fen(self, coups):
        self.poser(coups)
        self.envoyer("d")
        for ligne in self.lire_jusqu_a("Checkers"):
            if ligne.startswith("Fen: "):
                return ligne[5:]
        raise RuntimeError("pas de FEN dans la sortie de « d »")

    def coups_candidats(self, coups, profondeur=4):
        self.poser(coups)
        self.envoyer(f"go depth {profondeur}")
        lignes = self.lire_jusqu_a("bestmove")
        if lignes[-1].startswith("bestmove (none)"):
            return []
        # Une ligne par variante : on ne garde que le premier coup de chacune.
        candidats = {}
        for ligne in lignes:
            if " multipv " in ligne and " pv " in ligne:
                champs = ligne.split()
                candidats[champs[champs.index("multipv") + 1]] = champs[champs.index("pv") + 1]
        return list(dict.fromkeys(candidats.values()))

    def fermer(self):
        self.envoyer("quit")
        self.processus.wait(timeout=5)


def main():
    chemin = os.environ.get("STOCKFISH")
    if not chemin:
        sys.exit("Variable STOCKFISH absente")
    nombre_de_parties = int(sys.argv[1]) if len(sys.argv) > 1 else 12

    random.seed(20260821)  # jeu d'essai reproductible
    moteur = Stockfish(chemin)
    lignes = []

    for partie in range(nombre_de_parties):
        coups = []
        for _ in range(220):
            candidats = moteur.coups_candidats(coups)
            if not candidats:
                break
            fen = moteur.fen(coups)
            if fen.split()[4] == "0" or random.random() < 0.5:
                choix = random.choice(candidats)
            else:
                choix = candidats[0]
            lignes.append(f"{fen}|{choix}")
            coups.append(choix)
        print(f"partie {partie + 1} : {len(coups)} demi-coups", file=sys.stderr)

    moteur.fermer()

    with open(os.path.join(os.path.dirname(__file__), "positions.txt"), "w") as fichier:
        fichier.write("\n".join(lignes) + "\n")
    print(f"{len(lignes)} positions écrites dans positions.txt", file=sys.stderr)


if __name__ == "__main__":
    main()
