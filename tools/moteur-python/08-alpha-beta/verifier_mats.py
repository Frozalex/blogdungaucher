"""Vérifier que la recherche trouve les mats forcés du jeu d'essai.

Un mat forcé est la seule chose qu'une recherche puisse prouver : contrairement
à une évaluation, il n'y a pas d'opinion. Si le moteur cherche assez profond et
qu'il est correct, il DOIT le trouver. Un mat en n coups demande une recherche
à 2n-1 demi-coups.

Méthode de vérification. On ne compare PAS le coup trouvé à une liste de
solutions : établir cette liste demande de faire confiance à un MultiPV dont
l'exhaustivité n'est pas garantie, et une liste incomplète fait échouer un
moteur correct. On vérifie donc le coup produit, quel qu'il soit :

  - notre moteur doit annoncer un score de mat à la bonne distance ;
  - après avoir joué son coup, Stockfish doit confirmer que le camp au trait
    est maté en n-1 coups (ou déjà maté, si n valait 1).

N'importe quel coup matant passe, y compris un que Stockfish ne jouerait pas.

Usage :
    STOCKFISH=/chemin/vers/stockfish python3 verifier_mats.py
    STOCKFISH=... python3 verifier_mats.py 3     # jusqu'aux mats en 3, très lent
"""

import os
import subprocess
import sys
import time

from echiquier import Echiquier
from recherche import MAT, chercher, texte_du_score

DOSSIER = os.path.dirname(os.path.abspath(__file__))


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

    def verdict(self, fen, coup, profondeur=16):
        """Après `coup`, quelle est la situation du camp au trait ?

        Renvoie ("mat", 0) s'il est déjà maté, ("mate", n) s'il sera maté en n,
        ("rien", 0) sinon.
        """
        self.envoyer(f"position fen {fen} moves {coup}")
        self.envoyer("go perft 1")
        nombre = 0
        for ligne in self.lire_jusqu_a("Nodes searched"):
            if ligne.startswith("Nodes searched"):
                nombre = int(ligne.split(":")[1])
        if nombre == 0:
            self.envoyer(f"position fen {fen} moves {coup}")
            self.envoyer("d")
            for ligne in self.lire_jusqu_a("Checkers"):
                if ligne.startswith("Checkers:"):
                    return ("mat" if ligne[9:].strip() else "pat", 0)

        self.envoyer(f"position fen {fen} moves {coup}")
        self.envoyer(f"go depth {profondeur}")
        distance = None
        for ligne in self.lire_jusqu_a("bestmove"):
            if " score mate " in ligne:
                champs = ligne.split()
                distance = int(champs[champs.index("mate") + 1])
            elif " score cp " in ligne:
                distance = None
        if distance is not None and distance < 0:
            return ("mate", -distance)
        return ("rien", 0)

    def fermer(self):
        self.envoyer("quit")
        self.processus.wait(timeout=5)


def charger():
    cas = []
    with open(os.path.join(DOSSIER, "mats.txt")) as fichier:
        for ligne in fichier:
            fen, distance = ligne.strip().split("|")
            cas.append((fen, int(distance)))
    return cas


def main():
    chemin = os.environ.get("STOCKFISH")
    if not chemin:
        sys.exit("Variable STOCKFISH absente")
    distance_max = int(sys.argv[1]) if len(sys.argv) > 1 else 2

    cas = charger()
    moteur = Stockfish(chemin)
    print(f"{len(cas)} mats forcés dans le jeu d'essai\n")
    total_erreurs = 0

    for distance in range(1, distance_max + 1):
        lot = [c for c in cas if c[1] == distance]
        if not lot:
            continue
        profondeur = 2 * distance - 1
        erreurs = 0
        noeuds_total = 0
        debut = time.perf_counter()

        for fen, _ in lot:
            coup, score, noeuds = chercher(Echiquier(fen), profondeur)
            noeuds_total += noeuds

            annonce = score >= MAT - 1000
            nature, restant = moteur.verdict(fen, str(coup))
            confirme = (nature == "mat" and distance == 1) or (
                nature == "mate" and restant == distance - 1
            )
            if not (annonce and confirme):
                erreurs += 1
                if erreurs <= 3:
                    print(f"  {fen}")
                    print(f"    notre coup {coup} annoncé {texte_du_score(score)}, "
                          f"Stockfish dit {nature} {restant}")

        duree = time.perf_counter() - debut
        print(f"Mats en {distance} (profondeur {profondeur}) : "
              f"{len(lot) - erreurs}/{len(lot)}  "
              f"{noeuds_total:>10} nœuds  {duree:>7.1f} s")
        total_erreurs += erreurs

    moteur.fermer()
    print()
    print("Tous les mats trouvés." if total_erreurs == 0
          else f"{total_erreurs} échec(s).")
    sys.exit(1 if total_erreurs else 0)


if __name__ == "__main__":
    main()
