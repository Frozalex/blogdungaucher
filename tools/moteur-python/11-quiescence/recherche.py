"""Recherche de quiescence : ne jamais évaluer une position où ça tape encore.

Article 11 de la série. C'est l'ajout qui corrige le défaut le plus visible du
moteur : l'effet d'horizon.

Le problème. À profondeur 4, le moteur examine « je prends sa dame avec mon
cavalier », arrive à la limite de sa vision, évalue +900 et se réjouit. Il ne
voit pas que le cinquième demi-coup, celui qu'il n'a pas cherché, est
« il reprend mon cavalier ». Le score est faux, et il est faux dans le sens le
plus dangereux : il rend le coup attirant.

La solution. À la profondeur zéro, on n'évalue pas tout de suite : on continue
à chercher, mais UNIQUEMENT les prises, jusqu'à ce que la position soit calme.
On évalue alors une position où plus personne n'a de capture intéressante.

Usage :
    python3 recherche.py 5              # budget de 5 s, position de départ
    python3 recherche.py 5 "<fen>"
"""

import sys
import time

from echiquier import DEPART, Echiquier, VIDE
from evaluation import VALEURS, evaluer

MAT = 100_000
INFINI = 1_000_000
KILLERS_PAR_ETAGE = 2
PROFONDEUR_MAX = 64
NOEUDS_ENTRE_CONTROLES = 256

# Garde-fou : une suite de prises finit toujours par s'épuiser, mais on borne
# quand même la descente. Sans cela, une position pathologique (beaucoup de
# pièces qui se reprennent en boucle) peut faire exploser le temps d'un nœud.
QUIESCENCE_MAX = 8


class TempsEcoule(Exception):
    pass


class Contexte:
    def __init__(self, limite=None, quiescence=True):
        self.noeuds = 0
        self.killers = [[None] * KILLERS_PAR_ETAGE for _ in range(PROFONDEUR_MAX)]
        self.historique = {}
        self.limite = limite
        self.coup_principal = None
        self.quiescence = quiescence

    def controler_le_temps(self):
        if self.limite is None:
            return
        if self.noeuds % NOEUDS_ENTRE_CONTROLES == 0 and time.perf_counter() > self.limite:
            raise TempsEcoule

    def retenir_killer(self, coup, ply):
        etage = self.killers[ply]
        if coup != etage[0]:
            etage[1] = etage[0]
            etage[0] = coup

    def recompenser(self, coup, profondeur):
        cle = (coup.depart, coup.arrivee)
        self.historique[cle] = self.historique.get(cle, 0) + profondeur * profondeur


def est_une_prise(echiquier, coup):
    if echiquier.cases[coup.arrivee] is not VIDE:
        return True
    return (echiquier.cases[coup.depart] in "Pp"
            and coup.arrivee == echiquier.en_passant)


def score_mvv_lva(echiquier, coup):
    victime = echiquier.cases[coup.arrivee]
    agresseur = echiquier.cases[coup.depart]
    valeur_victime = VALEURS["P"] if victime is VIDE else VALEURS[victime.upper()]
    return 10 * valeur_victime - VALEURS[agresseur.upper()]


def ordonner(echiquier, coups, ply, contexte):
    def score(coup):
        if ply == 0 and coup == contexte.coup_principal:
            return 10_000_000
        if est_une_prise(echiquier, coup):
            return 1_000_000 + score_mvv_lva(echiquier, coup)
        if coup.promotion:
            return 900_000 + VALEURS[coup.promotion.upper()]
        if coup in contexte.killers[ply]:
            return 800_000
        return contexte.historique.get((coup.depart, coup.arrivee), 0)

    return sorted(coups, key=score, reverse=True)


def quiescence(echiquier, alpha, beta, ply, contexte, restant=QUIESCENCE_MAX):
    """Chercher jusqu'au calme, en ne suivant que les prises."""
    contexte.noeuds += 1
    contexte.controler_le_temps()

    coups = echiquier.coups_legaux()
    en_echec = echiquier.en_echec(echiquier.trait == "w")
    if not coups:
        return -(MAT - ply) if en_echec else 0

    if en_echec:
        # En échec, l'option « ne rien faire » n'existe pas : il faut parer.
        # On examine donc TOUS les coups, sinon on déclarerait calme une
        # position où le roi est attaqué.
        candidats = coups
    else:
        # « Stand pat » : le camp au trait a toujours le droit de ne pas
        # capturer. Son score plancher est donc l'évaluation de la position
        # telle quelle, et il ne jouera une prise que si elle fait mieux.
        score = evaluer(echiquier)
        if score >= beta:
            return beta
        alpha = max(alpha, score)
        if restant == 0:
            return alpha
        candidats = [coup for coup in coups if est_une_prise(echiquier, coup)]
        candidats.sort(key=lambda c: score_mvv_lva(echiquier, c), reverse=True)

    for coup in candidats:
        echiquier.jouer(coup)
        score = -quiescence(echiquier, -beta, -alpha, ply + 1, contexte, restant - 1)
        echiquier.annuler()
        if score >= beta:
            return beta
        alpha = max(alpha, score)
    return alpha


def alpha_beta(echiquier, profondeur, alpha, beta, ply, contexte):
    contexte.noeuds += 1
    contexte.controler_le_temps()

    coups = echiquier.coups_legaux()
    if not coups:
        return -(MAT - ply) if echiquier.en_echec(echiquier.trait == "w") else 0

    if profondeur == 0:
        if contexte.quiescence:
            return quiescence(echiquier, alpha, beta, ply, contexte)
        return evaluer(echiquier)

    for coup in ordonner(echiquier, coups, ply, contexte):
        tranquille = not est_une_prise(echiquier, coup) and not coup.promotion
        echiquier.jouer(coup)
        score = -alpha_beta(echiquier, profondeur - 1, -beta, -alpha, ply + 1, contexte)
        echiquier.annuler()

        if score >= beta:
            if tranquille:
                contexte.retenir_killer(coup, ply)
                contexte.recompenser(coup, profondeur)
            return beta
        alpha = max(alpha, score)
    return alpha


def chercher_a_profondeur(echiquier, profondeur, contexte):
    meilleur_coup = None
    meilleur_score = -INFINI
    for coup in ordonner(echiquier, echiquier.coups_legaux(), 0, contexte):
        echiquier.jouer(coup)
        score = -alpha_beta(echiquier, profondeur - 1, -INFINI, -meilleur_score,
                            1, contexte)
        echiquier.annuler()
        if score > meilleur_score or meilleur_coup is None:
            meilleur_score, meilleur_coup = score, coup
    return meilleur_coup, meilleur_score


def chercher(echiquier, budget=None, profondeur_max=PROFONDEUR_MAX,
             bavard=False, quiescence_active=True):
    debut = time.perf_counter()
    echeance = debut + budget if budget else None
    contexte = Contexte(echeance, quiescence_active)

    meilleur_coup = None
    meilleur_score = 0
    atteinte = 0

    # `TempsEcoule` est levée au fond de la récursion : elle court-circuite
    # tous les `annuler()` en attente et laisse l'échiquier au milieu d'une
    # variante. On mémorise donc la profondeur de l'historique pour pouvoir le
    # dérouler. Sans cela, l'appelant récupère une position corrompue, et le
    # symptôme apparaît beaucoup plus loin, sous la forme d'un coup joué depuis
    # une case vide.
    empilés = len(echiquier.historique)

    for profondeur in range(1, profondeur_max + 1):
        # La profondeur 1 ne s'interrompt JAMAIS. Le protocole UCI exige un
        # coup à chaque `go`, quel que soit le temps accordé : mieux vaut
        # dépasser le budget de quelques dizaines de millisecondes que de ne
        # rien rendre du tout. Aux cadences très rapides, c'est ce qui arrive.
        contexte.limite = None if profondeur == 1 else echeance

        try:
            coup, score = chercher_a_profondeur(echiquier, profondeur, contexte)
        except TempsEcoule:
            while len(echiquier.historique) > empilés:
                echiquier.annuler()
            break
        meilleur_coup, meilleur_score, atteinte = coup, score, profondeur
        contexte.coup_principal = coup
        if bavard:
            print(f"  profondeur {profondeur:2}  {coup}  {texte_du_score(score):>10}  "
                  f"{contexte.noeuds:>9} nœuds  {time.perf_counter() - debut:6.2f}s")
        if abs(meilleur_score) >= MAT - 1000:
            break

    return meilleur_coup, meilleur_score, atteinte, contexte.noeuds, \
        time.perf_counter() - debut


def evaluation_calme(echiquier):
    """L'évaluation d'une position une fois les prises épuisées.

    C'est exactement ce que la recherche voit à ses feuilles. Sert à mesurer
    l'effet d'horizon indépendamment de la recherche principale.
    """
    return quiescence(echiquier, -INFINI, INFINI, 0, Contexte())


def texte_du_score(score):
    if abs(score) >= MAT - 1000:
        coups = (MAT - abs(score) + 1) // 2
        return f"mat en {coups}" if score > 0 else f"maté en {coups}"
    return f"{score / 100:+.2f}"


if __name__ == "__main__":
    budget = float(sys.argv[1]) if len(sys.argv) > 1 else 5.0
    fen = sys.argv[2] if len(sys.argv) > 2 else DEPART

    print(Echiquier(fen))
    print(f"\nBudget : {budget:.1f} s")
    coup, score, atteinte, noeuds, duree = chercher(Echiquier(fen), budget, bavard=True)
    print(f"\n-> {coup}  {texte_du_score(score)}  profondeur {atteinte}  "
          f"{noeuds} nœuds  {duree:.2f}s")
