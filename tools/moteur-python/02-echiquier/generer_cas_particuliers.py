"""Compléter le jeu d'essai avec les coups rares que l'autoparty ne produit pas.

Sur douze parties jouées par Stockfish, on obtient des promotions et des roques,
mais zéro prise en passant : elle est trop rare pour apparaître par hasard. Or
c'est le coup qui casse le plus souvent la fonction `annuler`.

Ce script rejoue des séquences choisies à la main et enregistre, pour chacune,
la position juste avant le coup intéressant et ce coup. C'est Stockfish qui
fournit la FEN : on ne recopie aucune position à la main, donc on n'introduit
aucune faute de frappe dans le jeu d'essai lui-même.

Sortie : cas_particuliers.txt, même format que positions.txt.

Usage :
    STOCKFISH=/chemin/vers/stockfish python3 generer_cas_particuliers.py
"""

import os
import subprocess
import sys

# (description, coups menant à la position, coup à enregistrer)
SEQUENCES = [
    ("prise en passant par les Blancs",
     "e2e4 e7e6 e4e5 d7d5", "e5d6"),
    ("prise en passant par les Noirs",
     "e2e4 b7b5 e4e5 b5b4 a2a4", "b4a3"),
    ("petit roque blanc",
     "e2e4 e7e5 g1f3 b8c6 f1c4 g8f6", "e1g1"),
    ("grand roque blanc",
     "d2d4 d7d5 b1c3 b8c6 c1f4 c8f5 d1d2 d8d7", "e1c1"),
    ("petit roque noir",
     "e2e4 e7e5 g1f3 g8f6 f1c4 f8c5 e1g1", "e8g8"),
    ("grand roque noir",
     "d2d4 d7d5 b1c3 b8c6 c1f4 c8f5 d1d2 d8d7 e1c1", "e8c8"),
    ("promotion en dame, avec prise du cavalier b8",
     "a2a4 b7b5 a4b5 a7a6 b5a6 c7c6 a6a7 c6c5", "a7b8q"),
    ("promotion en cavalier, sous-promotion du même coup",
     "a2a4 b7b5 a4b5 a7a6 b5a6 c7c6 a6a7 c6c5", "a7b8n"),
    ("capture de la tour h8 : le petit roque noir tombe sans que le roi bouge",
     "e2e4 e7e5 g1f3 d7d6 f3e5 d6e5 d1h5 g7g6 h5e5 d8e7", "e5h8"),
]


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

    def fen(self, coups):
        self.envoyer(f"position startpos moves {coups}" if coups else "position startpos")
        self.envoyer("d")
        for ligne in self.lire_jusqu_a("Checkers"):
            if ligne.startswith("Fen: "):
                return ligne[5:]
        raise RuntimeError("pas de FEN dans la sortie de « d »")

    def fermer(self):
        self.envoyer("quit")
        self.processus.wait(timeout=5)


def main():
    chemin = os.environ.get("STOCKFISH")
    if not chemin:
        sys.exit("Variable STOCKFISH absente")

    moteur = Stockfish(chemin)
    lignes = []
    for description, prefixe, coup in SEQUENCES:
        avant = moteur.fen(prefixe)
        apres = moteur.fen(f"{prefixe} {coup}")
        if avant == apres:
            sys.exit(f"séquence refusée par Stockfish : {description} ({coup})")
        lignes.append(f"{avant}|{coup}")
        print(f"{description:52} {coup}", file=sys.stderr)
    moteur.fermer()

    chemin_sortie = os.path.join(os.path.dirname(__file__), "cas_particuliers.txt")
    with open(chemin_sortie, "w") as fichier:
        fichier.write("\n".join(lignes) + "\n")
    print(f"{len(lignes)} cas écrits dans cas_particuliers.txt", file=sys.stderr)


if __name__ == "__main__":
    main()
