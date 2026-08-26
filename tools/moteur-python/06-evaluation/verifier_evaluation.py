"""Vérifier l'évaluation : symétrie d'abord, confrontation à Stockfish ensuite.

Une fonction d'évaluation n'a pas de « bonne réponse » : on ne peut pas la
déclarer juste comme on déclare un perft juste. Deux choses se vérifient
malgré tout.

1. La SYMÉTRIE. Sur la position miroir (échiquier retourné, camps échangés),
   l'évaluation doit renvoyer l'opposé exact. C'est un test interne, mais il
   attrape à peu près toutes les erreurs de signe et de casse, qui sont les
   plus fréquentes et les plus silencieuses.

2. L'ACCORD avec Stockfish. Pas l'égalité : Stockfish évalue avec un réseau de
   neurones, nous comptons des pions. On mesure donc de combien les deux
   divergent, et surtout à quelle fréquence ils sont d'accord sur le SIGNE,
   c'est à dire sur qui est mieux. C'est la seule chose dont un moteur ait
   vraiment besoin.

Usage :
    python3 verifier_evaluation.py                    # symétrie seule
    STOCKFISH=... python3 verifier_evaluation.py --stockfish
"""

import os
import subprocess
import sys

from echiquier import Echiquier
from evaluation import materiel, miroir

DOSSIER = os.path.dirname(os.path.abspath(__file__))


def charger():
    fens = []
    for nom in ("positions.txt", "cas_particuliers.txt"):
        with open(os.path.join(DOSSIER, nom)) as fichier:
            for ligne in fichier:
                fen = ligne.strip().partition("|")[0]
                if fen:
                    fens.append(fen)
    return fens


def epreuve_symetrie(fens):
    erreurs = 0
    for fen in fens:
        echiquier = Echiquier(fen)
        reflet = miroir(echiquier)
        if materiel(echiquier) != -materiel(reflet):
            erreurs += 1
            if erreurs <= 3:
                print(f"  {fen}\n    nous {materiel(echiquier)}, miroir {materiel(reflet)}")
        # Le miroir du miroir doit redonner la position de départ, sans quoi
        # c'est le miroir qui est faux, pas l'évaluation.
        if miroir(reflet).fen() != echiquier.fen():
            erreurs += 1
            if erreurs <= 3:
                print(f"  double miroir non involutif : {fen}\n    -> {miroir(reflet).fen()}")
    print(f"1. Symétrie de l'évaluation : {len(fens) - erreurs}/{len(fens)}")
    return erreurs


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

    def evaluation(self, fen):
        """Évaluation statique de Stockfish, en centièmes de pion, côté Blancs.

        Renvoie None quand la position est en échec : Stockfish refuse alors
        d'évaluer, au motif qu'une évaluation statique n'a pas de sens tant
        qu'une capture forcée est en l'air.
        """
        self.envoyer(f"position fen {fen}")
        self.envoyer("eval")
        for ligne in self.lire_jusqu_a("Final evaluation"):
            if not ligne.startswith("Final evaluation"):
                continue
            # Deux formats selon le cas :
            #   "Final evaluation       -0.06 (white side) [...]"
            #   "Final evaluation: none (in check)"
            texte = ligne.removeprefix("Final evaluation").lstrip(": ").split()[0]
            if texte == "none":
                return None
            return round(float(texte) * 100)
        return None

    def fermer(self):
        self.envoyer("quit")
        self.processus.wait(timeout=5)


def epreuve_accord(fens):
    chemin = os.environ.get("STOCKFISH")
    if not chemin:
        sys.exit("Variable STOCKFISH absente")
    moteur = Stockfish(chemin)

    ecarts = []
    memes_signes = 0
    comparees = 0
    desaccords_nets = 0

    for fen in fens:
        eux = moteur.evaluation(fen)
        if eux is None:
            continue
        nous = materiel(Echiquier(fen))
        comparees += 1
        ecarts.append(abs(nous - eux))
        if (nous > 0) == (eux > 0) or (nous == 0 and abs(eux) < 50):
            memes_signes += 1
        # Désaccord net : l'un annonce au moins un pion d'avance, l'autre au
        # moins un pion d'avance dans l'autre camp.
        if (nous >= 100 and eux <= -100) or (nous <= -100 and eux >= 100):
            desaccords_nets += 1

    moteur.fermer()
    ecarts.sort()
    print(f"2. Accord avec Stockfish    : {comparees} positions comparées "
          f"({len(fens) - comparees} en échec, non évaluables)")
    print(f"   même camp désigné meilleur      : {memes_signes} "
          f"({100 * memes_signes / comparees:.1f} %)")
    print(f"   désaccords nets (≥ 1 pion des deux côtés) : {desaccords_nets} "
          f"({100 * desaccords_nets / comparees:.1f} %)")
    print(f"   écart médian : {ecarts[len(ecarts) // 2]} centièmes de pion, "
          f"9e décile : {ecarts[int(0.9 * len(ecarts))]}")
    return 0


if __name__ == "__main__":
    fens = charger()
    print(f"{len(fens)} positions\n")
    total = epreuve_symetrie(fens)
    if "--stockfish" in sys.argv:
        total += epreuve_accord(fens)
    print()
    print("Tout est vert." if total == 0 else f"{total} échec(s).")
    sys.exit(1 if total else 0)
