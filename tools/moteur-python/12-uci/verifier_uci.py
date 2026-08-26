"""Vérifier notre implémentation d'UCI en la pilotant comme le ferait une interface.

Le test lance `uci.py` dans un sous-processus et joue le rôle de l'interface
graphique. Il vérifie les points sur lesquels une interface abandonne :

  - `uci` se termine par `uciok`, avec un nom et un auteur ;
  - `isready` répond `readyok`, y compris juste après `ucinewgame` ;
  - `position startpos moves ...` est bien interprété : le coup renvoyé est
    légal dans la position résultante, ce qu'on fait confirmer par Stockfish ;
  - `position fen ...` fonctionne aussi, y compris avec des coups à la suite ;
  - `go movetime` respecte grossièrement le temps demandé ;
  - `go depth 1` répond, et vite ;
  - une position sans coup légal donne quand même un `bestmove`, faute de quoi
    l'interface reste bloquée pour toujours ;
  - aucune ligne parasite n'est écrite sur la sortie standard.

Usage :
    STOCKFISH=/chemin/vers/stockfish python3 verifier_uci.py
"""

import os
import subprocess
import sys
import time

DOSSIER = os.path.dirname(os.path.abspath(__file__))

PREFIXES_AUTORISES = ("id ", "uciok", "readyok", "info ", "bestmove", "option ")


class Pilote:
    """Joue le rôle de l'interface graphique face à un moteur UCI."""

    def __init__(self, commande):
        self.processus = subprocess.Popen(
            commande, stdin=subprocess.PIPE, stdout=subprocess.PIPE,
            text=True, bufsize=1, cwd=DOSSIER,
        )
        self.parasites = []

    def envoyer(self, commande):
        self.processus.stdin.write(commande + "\n")
        self.processus.stdin.flush()

    def lire_jusqu_a(self, prefixe, delai=30):
        lignes = []
        echeance = time.perf_counter() + delai
        for ligne in self.processus.stdout:
            ligne = ligne.rstrip("\n")
            lignes.append(ligne)
            if ligne and not ligne.startswith(PREFIXES_AUTORISES):
                self.parasites.append(ligne)
            if ligne.startswith(prefixe):
                return lignes
            if time.perf_counter() > echeance:
                raise RuntimeError(f"pas de {prefixe!r} en {delai} s")
        raise RuntimeError(f"le moteur s'est arrêté sans envoyer {prefixe!r}")

    def bestmove(self, commande_go, delai=30):
        self.envoyer(commande_go)
        lignes = self.lire_jusqu_a("bestmove", delai)
        return lignes[-1].split()[1], lignes

    def fermer(self):
        self.envoyer("quit")
        self.processus.wait(timeout=5)


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

    def coups_legaux(self, position):
        self.envoyer(position)
        self.envoyer("go perft 1")
        legaux = set()
        for ligne in self.lire_jusqu_a("Nodes searched"):
            coup, _, nombre = ligne.partition(":")
            if len(coup) in (4, 5) and nombre.strip().isdigit():
                legaux.add(coup)
        return legaux

    def fermer(self):
        self.envoyer("quit")
        self.processus.wait(timeout=5)


def main():
    chemin = os.environ.get("STOCKFISH")
    if not chemin:
        sys.exit("Variable STOCKFISH absente")

    arbitre = Stockfish(chemin)
    moteur = Pilote([sys.executable, "uci.py"])
    erreurs = 0

    def verifier(nom, condition, detail=""):
        nonlocal erreurs
        if condition:
            print(f"  OK   {nom}")
        else:
            erreurs += 1
            print(f"  RATÉ {nom} {detail}")

    # 1. Poignée de main
    moteur.envoyer("uci")
    presentation = moteur.lire_jusqu_a("uciok")
    verifier("uci -> uciok", presentation[-1] == "uciok")
    verifier("id name annoncé", any(l.startswith("id name ") for l in presentation))
    verifier("id author annoncé", any(l.startswith("id author ") for l in presentation))

    moteur.envoyer("isready")
    verifier("isready -> readyok", moteur.lire_jusqu_a("readyok")[-1] == "readyok")

    moteur.envoyer("ucinewgame")
    moteur.envoyer("isready")
    verifier("readyok après ucinewgame",
             moteur.lire_jusqu_a("readyok")[-1] == "readyok")

    # 2. position startpos + moves
    positions = [
        "position startpos",
        "position startpos moves e2e4 e7e5 g1f3",
        "position fen r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5Q2/PPPP1PPP/RNB1K1NR w KQkq - 4 4",
        # Attention en choisissant ce coup : dans cette position, le pion b5 est
        # cloué par la tour h5 sur le roi a5. b5b6 serait illégal, et notre
        # moteur, qui fait confiance à l'interface, l'appliquerait quand même.
        "position fen 8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - - 0 1 moves b4c4",
    ]
    for position in positions:
        moteur.envoyer(position)
        coup, lignes = moteur.bestmove("go movetime 300")
        legaux = arbitre.coups_legaux(position)
        verifier(f"coup légal après « {position[:46]} »", coup in legaux,
                 f"(rendu {coup}, légaux {len(legaux)})")
        verifier(f"  lignes info émises", any(l.startswith("info depth") for l in lignes))

    # 3. Respect du temps
    for demande in (200, 1000):
        moteur.envoyer("position startpos")
        debut = time.perf_counter()
        moteur.bestmove(f"go movetime {demande}")
        ecoule = (time.perf_counter() - debut) * 1000
        verifier(f"go movetime {demande} respecté",
                 demande * 0.5 <= ecoule <= demande * 1.6 + 400,
                 f"({ecoule:.0f} ms)")

    # 4. go depth
    moteur.envoyer("position startpos")
    debut = time.perf_counter()
    coup, _ = moteur.bestmove("go depth 1")
    verifier("go depth 1 répond vite",
             coup in arbitre.coups_legaux("position startpos")
             and time.perf_counter() - debut < 5)

    # 5. Position sans coup légal : le piège où l'interface se bloque.
    mat = "position fen 7k/5KQ1/8/8/8/8/8/8 b - - 0 1"
    moteur.envoyer(mat)
    coup, _ = moteur.bestmove("go movetime 200", delai=10)
    verifier("bestmove même sans coup légal", coup == "(none)", f"(rendu {coup})")

    # 6. Propreté de la sortie
    verifier("aucune ligne parasite", not moteur.parasites,
             f"({moteur.parasites[:2]})")

    moteur.fermer()
    arbitre.fermer()

    print()
    print("Protocole conforme." if erreurs == 0 else f"{erreurs} problème(s).")
    sys.exit(1 if erreurs else 0)


if __name__ == "__main__":
    main()
