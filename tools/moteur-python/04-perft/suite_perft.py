"""Le contrôle technique : six positions de référence, comparées à Stockfish.

Les six positions sont celles qu'utilise tout le petit monde des moteurs
d'échecs. Elles ne sont pas là pour être jolies : chacune piège une famille de
bugs différente, et la position de départ est de loin la plus indulgente des
six. Un générateur qui les passe toutes est correct, au sens fort.

Les valeurs de référence ne sont pas recopiées dans ce fichier : elles sont
demandées à Stockfish au moment du test. Une valeur recopiée est une valeur
qu'on peut mal recopier.

Quand un comptage est faux, `localiser` descend automatiquement dans l'arbre en
comparant les `divide` coup par coup, et affiche la position exacte où le
générateur diverge, avec la suite de coups qui y mène.

Usage :
    STOCKFISH=/chemin/vers/stockfish python3 suite_perft.py
    STOCKFISH=... python3 suite_perft.py --rapide     # une profondeur de moins
"""

import os
import subprocess
import sys
import time

from echiquier import Coup, Echiquier
from perft import divide, perft

# (nom, FEN, profondeur, ce que la position piège)
POSITIONS = [
    ("Position de départ",
     "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", 5,
     "le cas facile : aucune pièce ne peut encore rien faire de tordu"),
    ("Kiwipete",
     "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1", 4,
     "roques des deux côtés, clouages, prise en passant"),
    ("Position 3",
     "8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - - 0 1", 6,
     "finale dépouillée : échecs à répétition et prises en passant qui découvrent"),
    ("Position 4",
     "r3k2r/Pppp1ppp/1b3nbN/nP6/BBP1P3/q4N2/Pp1P2PP/R2Q1RK1 w kq - 0 1", 5,
     "promotions dans tous les sens, dont des sous-promotions avec prise"),
    ("Position 5",
     "rnbq1k1r/pp1Pbppp/2p5/8/2B5/8/PPP1NnPP/RNBQK2R w KQ - 1 8", 4,
     "droits de roque asymétriques et promotion imminente"),
    ("Position 6",
     "r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10", 4,
     "position d'ouverture chargée : beaucoup de coups, aucun cas rare"),
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

    def divide(self, fen, profondeur):
        """{coup: nombre de positions} , exactement la sortie de notre `divide`."""
        self.envoyer(f"position fen {fen}")
        self.envoyer(f"go perft {profondeur}")
        resultats = {}
        for ligne in self.lire_jusqu_a("Nodes searched"):
            if ":" in ligne and not ligne.startswith(("info", "Nodes")):
                coup, _, nombre = ligne.partition(":")
                if len(coup) in (4, 5) and nombre.strip().isdigit():
                    resultats[coup] = int(nombre)
        return resultats

    def perft(self, fen, profondeur):
        return sum(self.divide(fen, profondeur).values())

    def fermer(self):
        self.envoyer("quit")
        self.processus.wait(timeout=5)


def localiser(fen, profondeur, moteur, chemin=()):
    """Descendre dans l'arbre jusqu'à la position exacte qui diverge.

    À chaque étage on compare les deux `divide`. Trois cas : un coup que nous
    produisons en trop, un coup qui nous manque, ou un coup présent des deux
    côtés mais avec un sous-total différent. Dans les deux premiers cas, on a
    trouvé. Dans le troisième, on descend dans ce coup.
    """
    echiquier = Echiquier(fen)
    nous = divide(echiquier, profondeur)
    eux = moteur.divide(fen, profondeur)

    en_trop = sorted(set(nous) - set(eux))
    manquants = sorted(set(eux) - set(nous))
    if en_trop or manquants:
        print(f"    position   {fen}")
        print(f"    atteinte par  {' '.join(chemin) if chemin else '(position de départ du test)'}")
        if en_trop:
            print(f"    coups en trop   : {' '.join(en_trop)}")
        if manquants:
            print(f"    coups manquants : {' '.join(manquants)}")
        return

    for coup in sorted(nous):
        if nous[coup] != eux[coup]:
            echiquier.jouer(Coup.depuis_uci(coup))
            suivante = echiquier.fen()
            print(f"    {' ' * len(chemin)}{coup} : {nous[coup]} chez nous, {eux[coup]} chez Stockfish")
            localiser(suivante, profondeur - 1, moteur, chemin + (coup,))
            return

    print("    aucune divergence trouvée en descendant : le total devait être bon")


def main():
    chemin = os.environ.get("STOCKFISH")
    if not chemin:
        sys.exit("Variable STOCKFISH absente")
    rabais = 1 if "--rapide" in sys.argv else 0

    moteur = Stockfish(chemin)
    echecs = 0
    debut_total = time.perf_counter()

    print(f"{'Position':22} {'prof.':>5} {'attendu':>12} {'obtenu':>12} {'durée':>9} {'vitesse':>10}")
    print("-" * 76)

    for nom, fen, profondeur, _ in POSITIONS:
        profondeur = max(1, profondeur - rabais)
        attendu = moteur.perft(fen, profondeur)

        debut = time.perf_counter()
        obtenu = perft(Echiquier(fen), profondeur)
        duree = time.perf_counter() - debut

        etat = "" if obtenu == attendu else "  <-- FAUX"
        print(f"{nom:22} {profondeur:>5} {attendu:>12} {obtenu:>12} "
              f"{duree:>8.1f}s {obtenu / duree / 1000:>9.0f}k/s{etat}")

        if obtenu != attendu:
            echecs += 1
            localiser(fen, profondeur, moteur)

    print("-" * 76)
    total = time.perf_counter() - debut_total
    print(f"{len(POSITIONS) - echecs}/{len(POSITIONS)} positions exactes, {total:.0f} s au total")
    moteur.fermer()
    sys.exit(1 if echecs else 0)


if __name__ == "__main__":
    main()
