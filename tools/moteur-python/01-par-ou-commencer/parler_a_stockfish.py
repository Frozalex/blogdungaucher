"""Dialoguer avec Stockfish en UCI, à la main, depuis Python.

Aucune bibliothèque : un moteur d'échecs est un programme en ligne de commande
qui lit des ordres sur son entrée standard et répond sur sa sortie standard. Ce
fichier montre le protocole nu, parce que c'est exactement celui que notre propre
moteur devra parler à la fin de la série.

Prérequis : la variable d'environnement STOCKFISH pointe vers le binaire.
    export STOCKFISH=/chemin/vers/stockfish

Usage :
    python3 parler_a_stockfish.py
"""

import os
import subprocess
import sys

POSITION_DE_DEPART = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"


class Moteur:
    """Un moteur UCI vu comme un tuyau : on écrit des lignes, on lit des lignes."""

    def __init__(self, chemin):
        self.processus = subprocess.Popen(
            [chemin],
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            text=True,
            bufsize=1,  # ligne par ligne : sans ça, on attend un tampon plein
        )

    def envoyer(self, commande):
        print(f">>> {commande}")
        self.processus.stdin.write(commande + "\n")
        self.processus.stdin.flush()

    def lire_jusqu_a(self, prefixe):
        """Lire la sortie jusqu'à la ligne attendue, et renvoyer tout le bloc.

        Tout le protocole UCI fonctionne ainsi : chaque ordre bloquant a une
        ligne de fin convenue (`uciok`, `readyok`, `bestmove`). Sans cette
        attente, on enverrait la commande suivante dans le vide.
        """
        lignes = []
        for ligne in self.processus.stdout:
            ligne = ligne.rstrip("\n")
            lignes.append(ligne)
            if ligne.startswith(prefixe):
                return lignes
        raise RuntimeError(f"le moteur s'est arrêté sans envoyer {prefixe!r}")

    def fermer(self):
        self.envoyer("quit")
        self.processus.wait(timeout=5)


def main():
    chemin = os.environ.get("STOCKFISH")
    if not chemin:
        sys.exit("Variable STOCKFISH absente : export STOCKFISH=/chemin/vers/stockfish")

    moteur = Moteur(chemin)

    # 1. Poignée de main : le moteur annonce son nom et ses options réglables.
    moteur.envoyer("uci")
    presentation = moteur.lire_jusqu_a("uciok")
    for ligne in presentation:
        if ligne.startswith("id "):
            print(f"    {ligne}")
    print(f"    ({len(presentation)} lignes reçues, dont les options réglables)")

    # 2. Synchronisation : « tu as fini de t'initialiser ? »
    moteur.envoyer("isready")
    moteur.lire_jusqu_a("readyok")
    print("    readyok")

    # 3. On pose une position, puis on demande à réfléchir 1 seconde.
    moteur.envoyer("ucinewgame")
    moteur.envoyer(f"position fen {POSITION_DE_DEPART}")
    moteur.envoyer("go movetime 1000")
    analyse = moteur.lire_jusqu_a("bestmove")

    # Les lignes `info` sont le raisonnement en direct : profondeur atteinte,
    # évaluation en centièmes de pion, variante principale. La dernière est la
    # plus profonde, donc la plus fiable.
    derniere_info = [l for l in analyse if l.startswith("info depth")][-1]
    champs = derniere_info.split()
    profondeur = champs[champs.index("depth") + 1]
    score = champs[champs.index("cp") + 1] if "cp" in champs else "?"
    print(f"    profondeur {profondeur}, évaluation {int(score) / 100:+.2f} pion")
    print(f"    {analyse[-1]}")

    moteur.fermer()


if __name__ == "__main__":
    main()
