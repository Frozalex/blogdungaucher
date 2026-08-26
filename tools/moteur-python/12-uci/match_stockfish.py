"""Mesurer la force du moteur en le faisant jouer contre Stockfish bridé.

Stockfish sait s'affaiblir de façon calibrée : `UCI_LimitStrength` activé et
`UCI_Elo` réglé entre 1320 et 3190. Ce n'est pas parfait (le bridage se fait
par dégradation de la recherche, pas par imitation d'un humain), mais c'est
l'étalon le plus accessible qui existe.

Méthode. On joue un nombre pair de parties contre un adversaire d'Elo connu,
en alternant les couleurs, à cadence fixe des deux côtés. Le score obtenu se
convertit en écart Elo par la formule logistique standard, et l'Elo de notre
moteur est alors « Elo de l'adversaire + écart ».

L'intervalle de confiance affiché n'est PAS décoratif : sur vingt parties, il
dépasse facilement 200 points. Un Elo annoncé sans marge d'erreur ne veut rien
dire.

Usage :
    STOCKFISH=/chemin/vers/stockfish python3 match_stockfish.py 1320 10 0.5
    (Elo adverse, nombre de paires de parties, secondes par coup)
"""

import math
import os
import subprocess
import sys
from collections import Counter

from echiquier import Coup, Echiquier
from notation import pgn, san
from recherche import chercher


class AdversaireStockfish:
    def __init__(self, chemin, elo, budget):
        self.budget = budget
        self.elo = elo
        self.coups = []
        self.processus = subprocess.Popen(
            [chemin], stdin=subprocess.PIPE, stdout=subprocess.PIPE,
            text=True, bufsize=1,
        )
        self.envoyer("uci")
        self.lire_jusqu_a("uciok")
        self.envoyer("setoption name UCI_LimitStrength value true")
        self.envoyer(f"setoption name UCI_Elo value {elo}")
        self.envoyer("setoption name Threads value 1")
        self.envoyer("isready")
        self.lire_jusqu_a("readyok")

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

    def nouvelle_partie(self):
        self.coups = []
        self.envoyer("ucinewgame")
        self.envoyer("isready")
        self.lire_jusqu_a("readyok")

    def choisir(self, echiquier, coups):
        self.envoyer("position startpos moves " + " ".join(self.coups)
                     if self.coups else "position startpos")
        self.envoyer(f"go movetime {int(self.budget * 1000)}")
        texte = self.lire_jusqu_a("bestmove")[-1].split()[1]
        return Coup.depuis_uci(texte)

    def fermer(self):
        self.envoyer("quit")
        self.processus.wait(timeout=5)


class NotreMoteur:
    nom = "Gaucher 1.0"

    def __init__(self, budget):
        self.budget = budget

    def nouvelle_partie(self):
        pass

    def choisir(self, echiquier, coups):
        coup, _, _, _, _ = chercher(echiquier, self.budget)
        return coup


def jouer(blancs, noirs, adversaire, avec_notation=False):
    """Une partie. `adversaire` doit être tenu au courant des coups joués."""
    echiquier = Echiquier()
    cles = Counter()
    coups_san = []

    while True:
        cles[echiquier.cle_position()] += 1
        verdict = echiquier.resultat(cles)
        if verdict:
            return verdict[0], verdict[1], coups_san

        coups = echiquier.coups_legaux()
        joueur = blancs if echiquier.trait == "w" else noirs
        coup = joueur.choisir(echiquier, coups)
        if coup not in coups:
            raise RuntimeError(f"coup illégal proposé : {coup} dans {echiquier.fen()}")

        if avec_notation:
            coups_san.append(san(echiquier, coup))
        echiquier.jouer(coup)
        adversaire.coups.append(str(coup))


def elo_depuis_score(score, parties):
    p = score / parties
    if p <= 0 or p >= 1:
        return None, None
    elo = -400 * math.log10(1 / p - 1)
    erreur = math.sqrt(p * (1 - p) / parties)
    derivee = 400 / (math.log(10) * p * (1 - p))
    return elo, 1.96 * erreur * derivee


def main():
    chemin = os.environ.get("STOCKFISH")
    if not chemin:
        sys.exit("Variable STOCKFISH absente")
    elo_adverse = int(sys.argv[1]) if len(sys.argv) > 1 else 1320
    paires = int(sys.argv[2]) if len(sys.argv) > 2 else 10
    budget = float(sys.argv[3]) if len(sys.argv) > 3 else 0.5

    nous = NotreMoteur(budget)
    eux = AdversaireStockfish(chemin, elo_adverse, budget)

    points = 0.0
    resultats = Counter()
    motifs = Counter()
    derniere_partie = None

    for numero in range(paires):
        for nous_avec_les_blancs in (True, False):
            eux.nouvelle_partie()
            blancs, noirs = (nous, eux) if nous_avec_les_blancs else (eux, nous)
            resultat, motif, coups_san = jouer(blancs, noirs, eux, avec_notation=True)
            motifs[motif] += 1
            derniere_partie = (resultat, motif, coups_san, nous_avec_les_blancs)

            if resultat == "1/2-1/2":
                points += 0.5
                resultats["nulles"] += 1
            elif (resultat == "1-0") == nous_avec_les_blancs:
                points += 1
                resultats["victoires"] += 1
            else:
                resultats["défaites"] += 1

            couleur = "Blancs" if nous_avec_les_blancs else "Noirs"
            print(f"  partie {2 * numero + (1 if nous_avec_les_blancs else 2):3} "
                  f"({couleur}) : {resultat:7} {motif:26} "
                  f"{len(coups_san)} demi-coups", file=sys.stderr)

    eux.fermer()
    parties = 2 * paires

    print(f"{nous.nom} contre Stockfish bridé à {elo_adverse} Elo")
    print(f"cadence : {budget:.2f} s par coup des deux côtés, {parties} parties\n")
    print(f"  score : {points} / {parties} ({100 * points / parties:.1f} %)")
    print(f"  {resultats['victoires']} victoires, {resultats['nulles']} nulles, "
          f"{resultats['défaites']} défaites")
    for motif, compte in motifs.most_common():
        print(f"    {motif:28} {compte}")

    ecart, marge = elo_depuis_score(points, parties)
    print()
    if ecart is None:
        borne = 400 * math.log10(parties)
        sens = "au-dessus" if points > 0 else "en dessous"
        print(f"  Score extrême : l'écart Elo n'est pas mesurable, il est seulement "
              f"{sens} de {borne:.0f} points. Il faut un adversaire mieux calibré.")
    else:
        print(f"  écart Elo : {ecart:+.0f} ± {marge:.0f}")
        print(f"  Elo estimé de {nous.nom} : {elo_adverse + ecart:.0f} "
              f"± {marge:.0f}")
        print(f"  (intervalle à 95 % : {elo_adverse + ecart - marge:.0f} à "
              f"{elo_adverse + ecart + marge:.0f})")

    if derniere_partie:
        resultat, motif, coups_san, nous_blancs = derniere_partie
        entetes = {
            "Event": f"Match contre Stockfish {elo_adverse}",
            "Site": "blogdungaucher.com",
            "White": nous.nom if nous_blancs else f"Stockfish {elo_adverse}",
            "Black": f"Stockfish {elo_adverse}" if nous_blancs else nous.nom,
            "Result": resultat,
            "Termination": motif,
        }
        with open(os.path.join(os.path.dirname(os.path.abspath(__file__)),
                               "derniere_partie.pgn"), "w") as fichier:
            fichier.write(pgn(entetes, coups_san, resultat) + "\n")
        print("\n  dernière partie écrite dans derniere_partie.pgn")


if __name__ == "__main__":
    main()
