"""Vérifier l'échiquier de l'article 2 sur des positions réelles.

Trois épreuves, de la moins exigeante à la plus exigeante :

1. Aller-retour FEN : charger une FEN puis la réécrire doit redonner exactement
   la même chaîne. Épreuve interne, elle ne prouve que la cohérence du code
   avec lui-même.
2. jouer puis annuler : la FEN après annulation doit être identique à la FEN de
   départ, caractère pour caractère. C'est l'épreuve qui attrape les oublis de
   restauration (droits de roque, compteur des cinquante coups, pion pris en
   passant).
3. Confrontation à Stockfish : la position obtenue après avoir joué le coup doit
   être celle que Stockfish obtient. Épreuve externe, la seule qui prouve que
   notre définition d'un coup est la bonne.

Usage :
    python3 verifier_echiquier.py                 # épreuves 1 et 2
    STOCKFISH=... python3 verifier_echiquier.py --stockfish   # les trois
"""

import os
import subprocess
import sys

from echiquier import Coup, Echiquier

DOSSIER = os.path.dirname(os.path.abspath(__file__))
JEUX = ["positions.txt", "cas_particuliers.txt"]


def charger_jeu_d_essai():
    cas = []
    for nom in JEUX:
        chemin = os.path.join(DOSSIER, nom)
        if not os.path.exists(chemin):
            sys.exit(f"{nom} manquant : lance d'abord generer_positions.py")
        with open(chemin) as fichier:
            for ligne in fichier:
                fen, _, uci = ligne.strip().partition("|")
                if fen:
                    cas.append((fen, uci))
    return cas


def epreuve_aller_retour(cas):
    erreurs = 0
    for fen, _ in cas:
        obtenue = Echiquier(fen).fen()
        if obtenue != fen:
            erreurs += 1
            if erreurs <= 3:
                print(f"  attendu {fen}\n  obtenu  {obtenue}")
    print(f"1. Aller-retour FEN        : {len(cas) - erreurs}/{len(cas)}")
    return erreurs


def epreuve_jouer_annuler(cas):
    erreurs = 0
    for fen, uci in cas:
        echiquier = Echiquier(fen)
        echiquier.jouer(Coup.depuis_uci(uci))
        echiquier.annuler()
        if echiquier.fen() != fen:
            erreurs += 1
            if erreurs <= 3:
                print(f"  après {uci}\n  attendu {fen}\n  obtenu  {echiquier.fen()}")
    print(f"2. jouer puis annuler      : {len(cas) - erreurs}/{len(cas)}")
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

    def apres(self, fen, uci):
        self.envoyer(f"position fen {fen} moves {uci}")
        self.envoyer("d")
        for ligne in self.lire_jusqu_a("Checkers"):
            if ligne.startswith("Fen: "):
                return ligne[5:]
        raise RuntimeError("pas de FEN dans la sortie de « d »")

    def fermer(self):
        self.envoyer("quit")
        self.processus.wait(timeout=5)


def epreuve_stockfish(cas):
    chemin = os.environ.get("STOCKFISH")
    if not chemin:
        sys.exit("Variable STOCKFISH absente")
    moteur = Stockfish(chemin)

    erreurs = 0
    ecarts_en_passant = 0
    for fen, uci in cas:
        echiquier = Echiquier(fen)
        echiquier.jouer(Coup.depuis_uci(uci))
        nous = echiquier.fen().split()
        eux = moteur.apres(fen, uci).split()

        # Stockfish n'annonce la case de prise en passant que si la prise est
        # réellement jouable. Nous l'annonçons après toute poussée de deux
        # cases, faute de savoir générer les coups : ce n'est pas encore une
        # erreur, c'est une dette de l'article 3.
        if nous[:3] == eux[:3] and nous[4:] == eux[4:] and nous[3] != eux[3]:
            ecarts_en_passant += 1
            continue
        if nous != eux:
            erreurs += 1
            if erreurs <= 3:
                print(f"  depuis {fen}\n  coup {uci}\n  nous {' '.join(nous)}\n  eux  {' '.join(eux)}")

    moteur.fermer()
    print(f"3. Position après le coup  : {len(cas) - erreurs - ecarts_en_passant}/{len(cas)} "
          f"identiques à Stockfish, {ecarts_en_passant} écarts sur la seule case en passant")
    return erreurs


if __name__ == "__main__":
    jeu = charger_jeu_d_essai()
    print(f"{len(jeu)} positions dans le jeu d'essai\n")
    total = epreuve_aller_retour(jeu) + epreuve_jouer_annuler(jeu)
    if "--stockfish" in sys.argv:
        total += epreuve_stockfish(jeu)
    print()
    print("Tout est vert." if total == 0 else f"{total} échec(s).")
    sys.exit(1 if total else 0)
