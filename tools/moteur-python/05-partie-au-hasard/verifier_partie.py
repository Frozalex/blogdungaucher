"""Vérifier des parties entières, coup par coup, contre Stockfish.

L'article 3 comparait le générateur sur un jeu d'essai figé. Ici les positions
sont neuves à chaque exécution : elles naissent du hasard, et une partie au
hasard va là où aucune partie humaine ne va, jusque dans des finales à sept
dames où tout est cloué. C'est un excellent terrain de chasse.

Pour chaque demi-coup de chaque partie, on vérifie que notre ensemble de coups
légaux est exactement celui de Stockfish. À la fin, on vérifie le verdict :
qu'il n'y a bien aucun coup légal quand on annonce mat ou pat, que le camp est
bien en échec dans le premier cas et pas dans le second.

Usage :
    STOCKFISH=/chemin/vers/stockfish python3 verifier_partie.py 20
"""

import os
import subprocess
import sys
from collections import Counter

from echiquier import Echiquier
from partie import MoteurAuHasard


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

    def coups_legaux(self, coups):
        self.envoyer("position startpos" + (f" moves {' '.join(coups)}" if coups else ""))
        self.envoyer("go perft 1")
        legaux = set()
        for ligne in self.lire_jusqu_a("Nodes searched"):
            coup, _, nombre = ligne.partition(":")
            if len(coup) in (4, 5) and nombre.strip().isdigit():
                legaux.add(coup)
        return legaux

    def en_echec(self, coups):
        """La ligne « Checkers: » de la commande `d` est vide hors échec."""
        self.envoyer("position startpos" + (f" moves {' '.join(coups)}" if coups else ""))
        self.envoyer("d")
        for ligne in self.lire_jusqu_a("Checkers"):
            if ligne.startswith("Checkers:"):
                return bool(ligne[9:].strip())
        raise RuntimeError("pas de ligne Checkers")

    def fermer(self):
        self.envoyer("quit")
        self.processus.wait(timeout=5)


def verifier_une_partie(numero, moteur):
    """Rejouer une partie au hasard en confrontant chaque position à Stockfish."""
    blancs = MoteurAuHasard(2 * numero)
    noirs = MoteurAuHasard(2 * numero + 1)
    echiquier = Echiquier()
    cles_vues = Counter()
    joues = []
    erreurs = 0

    while True:
        cles_vues[echiquier.cle_position()] += 1
        verdict = echiquier.resultat(cles_vues)

        nous = {str(coup) for coup in echiquier.coups_legaux()}
        eux = moteur.coups_legaux(joues)
        if nous != eux:
            erreurs += 1
            print(f"  partie {numero}, demi-coup {len(joues)} : {echiquier.fen()}")
            if nous - eux:
                print(f"    coups en trop   : {' '.join(sorted(nous - eux))}")
            if eux - nous:
                print(f"    coups manquants : {' '.join(sorted(eux - nous))}")
            return erreurs, len(joues), ("erreur", "erreur")

        if verdict:
            resultat, motif = verdict
            if motif in ("échec et mat", "pat"):
                if eux:
                    erreurs += 1
                    print(f"  partie {numero} : « {motif} » annoncé alors que "
                          f"{len(eux)} coups sont légaux")
                attendu = motif == "échec et mat"
                if moteur.en_echec(joues) != attendu:
                    erreurs += 1
                    print(f"  partie {numero} : « {motif} » annoncé, "
                          f"échec réel = {moteur.en_echec(joues)}")
            elif motif == "règle des cinquante coups" and echiquier.demi_coups < 100:
                erreurs += 1
                print(f"  partie {numero} : cinquante coups annoncés à "
                      f"{echiquier.demi_coups} demi-coups")
            return erreurs, len(joues), verdict

        joueur = blancs if echiquier.trait == "w" else noirs
        coup = joueur.choisir(echiquier, echiquier.coups_legaux())
        joues.append(str(coup))
        echiquier.jouer(coup)


def main():
    chemin = os.environ.get("STOCKFISH")
    if not chemin:
        sys.exit("Variable STOCKFISH absente")
    nombre = int(sys.argv[1]) if len(sys.argv) > 1 else 20

    moteur = Stockfish(chemin)
    erreurs = 0
    demi_coups = 0
    motifs = Counter()

    for numero in range(nombre):
        erreurs_partie, longueur, verdict = verifier_une_partie(numero, moteur)
        erreurs += erreurs_partie
        demi_coups += longueur
        motifs[verdict[1]] += 1
        print(f"  partie {numero + 1:3} : {longueur:4} demi-coups, "
              f"{verdict[0]:7} ({verdict[1]})", file=sys.stderr)

    moteur.fermer()

    print(f"{nombre} parties, {demi_coups} demi-coups vérifiés position par position")
    for motif, compte in motifs.most_common():
        print(f"  {motif:28} {compte}")
    print()
    print("Aucun coup illégal." if erreurs == 0 else f"{erreurs} erreur(s).")
    sys.exit(1 if erreurs else 0)


if __name__ == "__main__":
    main()
