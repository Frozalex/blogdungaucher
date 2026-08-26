"""Constituer un jeu d'essai de mats forcés.

On balaie les positions de partie déjà collectées et on demande à Stockfish s'il
voit un mat forcé pour le camp au trait. Deux passes : une reconnaissance à
faible profondeur qui écarte l'immense majorité des positions pour presque
rien, puis une confirmation profonde sur les rescapées, parce qu'une distance
au mat lue trop tôt peut être trop longue.

On n'enregistre QUE la position et la distance, pas la liste des coups qui
matent. Première version de ce script, cette liste était demandée à Stockfish
en MultiPV : elle s'est révélée incomplète (19 coups matants listés sur 20 à
profondeur 8), ce qui faisait échouer le test sur un moteur pourtant correct.
La vérification se fait donc autrement, coup par coup : voir verifier_mats.py.

Sortie : mats.txt, une ligne « FEN|distance ».

Usage :
    STOCKFISH=/chemin/vers/stockfish python3 generer_mats.py
"""

import os
import subprocess
import sys

DOSSIER = os.path.dirname(os.path.abspath(__file__))
DISTANCE_MAX = 3


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

    def distance_au_mat(self, fen, profondeur):
        """Distance au mat pour le camp au trait, ou None s'il n'y en a pas.

        Positive : le camp au trait mate. Négative : il se fait mater.
        """
        self.envoyer(f"position fen {fen}")
        self.envoyer(f"go depth {profondeur}")
        distance = None
        for ligne in self.lire_jusqu_a("bestmove"):
            if " score mate " in ligne:
                champs = ligne.split()
                distance = int(champs[champs.index("mate") + 1])
            elif " score cp " in ligne:
                distance = None  # l'itération suivante a démenti le mat
        return distance

    def fermer(self):
        self.envoyer("quit")
        self.processus.wait(timeout=5)


def main():
    chemin = os.environ.get("STOCKFISH")
    if not chemin:
        sys.exit("Variable STOCKFISH absente")

    fens = []
    for nom in ("positions.txt", "cas_particuliers.txt"):
        with open(os.path.join(DOSSIER, nom)) as fichier:
            for ligne in fichier:
                fen = ligne.strip().partition("|")[0]
                if fen:
                    fens.append(fen)

    moteur = Stockfish(chemin)
    trouves = []
    for index, fen in enumerate(fens):
        rapide = moteur.distance_au_mat(fen, 6)
        if rapide is None or not 0 < rapide <= DISTANCE_MAX:
            continue
        # Confirmation : à profondeur 6, un mat en 3 peut masquer un mat en 2.
        exacte = moteur.distance_au_mat(fen, 16)
        if exacte is not None and 0 < exacte <= DISTANCE_MAX:
            trouves.append(f"{fen}|{exacte}")
        if (index + 1) % 300 == 0:
            print(f"  {index + 1}/{len(fens)} positions, {len(trouves)} mats",
                  file=sys.stderr)

    moteur.fermer()

    with open(os.path.join(DOSSIER, "mats.txt"), "w") as fichier:
        fichier.write("\n".join(trouves) + "\n")

    par_distance = {}
    for ligne in trouves:
        distance = ligne.split("|")[1]
        par_distance[distance] = par_distance.get(distance, 0) + 1
    print(f"{len(trouves)} mats forcés écrits dans mats.txt", file=sys.stderr)
    for distance in sorted(par_distance):
        print(f"  mat en {distance} : {par_distance[distance]}", file=sys.stderr)


if __name__ == "__main__":
    main()
