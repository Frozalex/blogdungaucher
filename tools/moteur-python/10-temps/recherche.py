"""Approfondissement itératif et gestion du temps.

Article 10 de la série. Jusqu'ici, on demandait au moteur de chercher à une
profondeur donnée, et on subissait le temps que ça prenait. Un vrai moteur
fonctionne à l'envers : on lui donne un budget de temps, il en tire la
profondeur qu'il peut.

La solution est contre-intuitive : au lieu de chercher directement à la
profondeur 6, on cherche à 1, puis à 2, puis à 3, et ainsi de suite jusqu'à
épuisement du budget. On refait donc tout le travail à chaque fois.

Ça paraît absurde, et le travail répété a bien un coût : mesuré sur ce moteur,
25 % de nœuds en plus pour atteindre la profondeur 4, 5 % pour la profondeur 5.
Le meilleur coup de l'itération précédente, essayé EN PREMIER à l'itération
suivante, réduit ce surcoût sans l'annuler à ces profondeurs là.

On le paie quand même, pour une raison qui n'a rien à voir avec la vitesse : la
recherche devient INTERRUPTIBLE. Quand le temps tombe, on a toujours un coup
complet issu de la dernière profondeur terminée, là où une recherche directe
interrompue ne renvoie rien d'exploitable.

Usage :
    python3 recherche.py 5              # budget de 5 secondes, position de départ
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

# Consulter l'horloge à chaque nœud coûterait plus cher que la recherche
# elle-même. On la consulte une fois tous les N nœuds ; à environ 3 000 nœuds
# par seconde, 256 nœuds représentent moins d'un dixième de seconde de retard
# possible sur l'échéance.
NOEUDS_ENTRE_CONTROLES = 256


class TempsEcoule(Exception):
    """Levée au fond de la récursion pour remonter d'un coup jusqu'à la racine."""


class Contexte:
    def __init__(self, limite=None):
        self.noeuds = 0
        self.killers = [[None] * KILLERS_PAR_ETAGE for _ in range(PROFONDEUR_MAX)]
        self.historique = {}
        self.limite = limite
        self.coup_principal = None  # meilleur coup de l'itération précédente

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


def ordonner(echiquier, coups, ply, contexte):
    def score(coup):
        # Le meilleur coup de l'itération précédente passe avant tout le reste,
        # y compris avant la meilleure des prises. C'est le renseignement le
        # plus fiable dont on dispose.
        if ply == 0 and coup == contexte.coup_principal:
            return 10_000_000

        victime = echiquier.cases[coup.arrivee]
        agresseur = echiquier.cases[coup.depart]

        if victime is VIDE and agresseur in "Pp" and coup.arrivee == echiquier.en_passant:
            return 1_000_000 + 10 * VALEURS["P"] - VALEURS["P"]
        if victime is not VIDE:
            return 1_000_000 + 10 * VALEURS[victime.upper()] - VALEURS[agresseur.upper()]
        if coup.promotion:
            return 900_000 + VALEURS[coup.promotion.upper()]
        if coup in contexte.killers[ply]:
            return 800_000
        return contexte.historique.get((coup.depart, coup.arrivee), 0)

    return sorted(coups, key=score, reverse=True)


def alpha_beta(echiquier, profondeur, alpha, beta, ply, contexte):
    contexte.noeuds += 1
    contexte.controler_le_temps()

    coups = echiquier.coups_legaux()
    if not coups:
        return -(MAT - ply) if echiquier.en_echec(echiquier.trait == "w") else 0
    if profondeur == 0:
        return evaluer(echiquier)

    for coup in ordonner(echiquier, coups, ply, contexte):
        tranquille = echiquier.cases[coup.arrivee] is VIDE and not coup.promotion
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


def chercher(echiquier, budget=None, profondeur_max=PROFONDEUR_MAX, bavard=False):
    """Approfondissement itératif sous contrainte de temps.

    Renvoie (coup, score, profondeur atteinte, nœuds, durée). Le coup renvoyé
    provient toujours d'une itération TERMINÉE : une itération interrompue est
    jetée en entier, parce que son meilleur coup partiel peut être pire que
    celui de l'itération précédente (les coups n'ont pas tous été examinés).
    """
    debut = time.perf_counter()
    echeance = debut + budget if budget else None
    contexte = Contexte(echeance)

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
            ecoule = time.perf_counter() - debut
            print(f"  profondeur {profondeur:2}  {coup}  {texte_du_score(score):>10}  "
                  f"{contexte.noeuds:>9} nœuds  {ecoule:6.2f}s")

        # Un mat trouvé ne s'améliore plus : inutile de creuser davantage.
        if abs(meilleur_score) >= MAT - 1000:
            break

    return meilleur_coup, meilleur_score, atteinte, contexte.noeuds, \
        time.perf_counter() - debut


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
    coup, score, atteinte, noeuds, duree = chercher(fen and Echiquier(fen), budget,
                                                    bavard=True)
    print(f"\n-> {coup}  {texte_du_score(score)}  "
          f"profondeur {atteinte}  {noeuds} nœuds  {duree:.2f}s")
