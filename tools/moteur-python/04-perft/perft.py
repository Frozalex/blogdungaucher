"""perft : le contrôle technique du générateur de coups.

`perft(n)` compte les positions atteignables en n demi-coups. C'est un nombre,
il ne dépend d'aucun choix d'implémentation, et il est publié depuis des
décennies pour un jeu de positions de référence. Si ton compte diffère d'une
seule unité, ton générateur est faux.

L'intérêt n'est pas le comptage lui-même, c'est `divide` : quand le total est
faux, on compare coup par coup avec la référence pour trouver quelle branche
diverge, puis on descend dedans. Quelques minutes pour isoler un bug qui, sans
cet outil, se cherche pendant des jours.

Usage :
    python3 perft.py                       # position de départ, profondeur 4
    python3 perft.py 5                     # position de départ, profondeur 5
    python3 perft.py 3 "<fen>"             # une position précise
"""

import sys
import time

from echiquier import DEPART, Echiquier


def perft(echiquier, profondeur):
    """Nombre de positions atteignables en `profondeur` demi-coups.

    À la profondeur 1, on renvoie directement le nombre de coups légaux au lieu
    de les jouer un par un pour compter 1 à chaque fois. Cette astuce, dite
    « comptage en gros », évite le dernier étage de jouer/annuler, qui est de
    loin le plus peuplé de l'arbre.
    """
    if profondeur == 0:
        return 1
    coups = echiquier.coups_legaux()
    if profondeur == 1:
        return len(coups)

    total = 0
    for coup in coups:
        echiquier.jouer(coup)
        total += perft(echiquier, profondeur - 1)
        echiquier.annuler()
    return total


def divide(echiquier, profondeur):
    """perft, détaillé coup par coup depuis la position courante.

    C'est la sortie que produit aussi Stockfish avec `go perft n`, ce qui
    permet une comparaison ligne à ligne.
    """
    resultats = {}
    for coup in echiquier.coups_legaux():
        echiquier.jouer(coup)
        resultats[str(coup)] = perft(echiquier, profondeur - 1)
        echiquier.annuler()
    return resultats


if __name__ == "__main__":
    profondeur = int(sys.argv[1]) if len(sys.argv) > 1 else 4
    fen = sys.argv[2] if len(sys.argv) > 2 else DEPART

    echiquier = Echiquier(fen)
    print(echiquier)
    print()

    for n in range(1, profondeur + 1):
        debut = time.perf_counter()
        total = perft(Echiquier(fen), n)
        duree = time.perf_counter() - debut
        vitesse = f"{total / duree / 1000:.0f} k/s" if duree > 0.001 else ""
        print(f"perft({n}) = {total:>12}   {duree:7.2f} s   {vitesse}")
