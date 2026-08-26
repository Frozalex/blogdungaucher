"""Évaluation matérielle, augmentée de tables de cases.

Article 11 de la série. Le matériel seul ne distingue pas un cavalier au centre
d'un cavalier dans un coin. Les tables de cases (piece-square tables) ajoutent
un bonus ou un malus selon la case occupée : c'est la façon la moins chère
d'introduire une notion de position dans l'évaluation, puisque tout est
pré-calculé et qu'il ne reste qu'une addition par pièce.

Les tables ci-dessous ne sont recopiées de nulle part : elles sont ENGENDRÉES
par des règles explicites, énoncées dans le code. C'est volontaire. Une table
recopiée est une table qu'on ne comprend pas et qu'on ne saura pas ajuster ;
une table engendrée se discute règle par règle.
"""

from echiquier import BLANCS, CASES, VIDE

VALEURS = {"P": 100, "N": 320, "B": 330, "R": 500, "Q": 900, "K": 0}


def _colonne(case):
    return (case % 10) - 1


def _rangee_depuis_le_bas(case):
    """0 pour la rangée 1, 7 pour la rangée 8, du point de vue des Blancs."""
    return 7 - ((case // 10) - 2)


def _centralite(case):
    """0 sur le bord, 3 au centre. Sert à plusieurs pièces."""
    colonne = _colonne(case)
    rangee = _rangee_depuis_le_bas(case)
    return min(colonne, 7 - colonne, rangee, 7 - rangee)


def _table_pion(case):
    rangee = _rangee_depuis_le_bas(case)
    colonne = _colonne(case)
    if rangee in (0, 7):
        return 0  # un pion ne s'y trouve jamais
    # Avancer vaut de plus en plus cher à mesure qu'on approche de la promotion.
    avance = (rangee - 1) ** 2 * 2
    # Occuper le centre avec ses pions, oui.
    centre = 12 if colonne in (3, 4) and rangee in (2, 3) else 0
    # Le pion f abrite le roi après le petit roque : on décourage de le pousser.
    penalite = -8 if colonne == 5 and rangee == 3 else 0
    return avance + centre + penalite


def _table_cavalier(case):
    # Le cavalier est la pièce qui souffre le plus du bord : depuis un coin il
    # n'a que deux coups, depuis le centre il en a huit.
    return -30 + 14 * _centralite(case)


def _table_fou(case):
    # Même logique, beaucoup plus douce : un fou au bord garde ses diagonales.
    return -12 + 6 * _centralite(case)


def _table_tour(case):
    rangee = _rangee_depuis_le_bas(case)
    colonne = _colonne(case)
    bonus = 0
    if rangee == 6:
        bonus += 20  # la septième rangée, là où les tours mangent les pions
    if colonne in (3, 4):
        bonus += 6   # colonnes centrales, souvent ouvertes
    if colonne in (0, 7) and rangee == 0:
        bonus -= 6   # tour encore dans son coin, pas encore connectée
    return bonus


def _table_dame(case):
    # Faible, volontairement : sortir la dame trop tôt est mauvais, mais une
    # table de cases ne sait pas dire « trop tôt ».
    return -8 + 3 * _centralite(case)


def _table_roi(case):
    rangee = _rangee_depuis_le_bas(case)
    colonne = _colonne(case)
    # En milieu de partie, le roi doit rester derrière ses pions et sur un
    # côté. Cette table est FAUSSE en finale, où le roi doit au contraire
    # monter au centre : c'est la limite assumée d'une table unique.
    if rangee == 0:
        if colonne in (1, 2, 6):
            return 24
        return 6 if colonne in (0, 7) else -10
    return -20 * rangee


_GENERATEURS = {
    "P": _table_pion,
    "N": _table_cavalier,
    "B": _table_fou,
    "R": _table_tour,
    "Q": _table_dame,
    "K": _table_roi,
}


def _case_miroir(case):
    """a1 <-> a8 : même colonne, rangée retournée."""
    rangee = (case // 10) - 2
    return case + (7 - 2 * rangee) * 10


# Deux tables par type de pièce, une par couleur. Celle des Noirs est le miroir
# vertical de celle des Blancs : la septième rangée des Blancs est la deuxième
# des Noirs.
TABLES = {}
for _lettre, _generateur in _GENERATEURS.items():
    TABLES[_lettre] = {case: _generateur(case) for case in CASES}
    TABLES[_lettre.lower()] = {case: _generateur(_case_miroir(case)) for case in CASES}


def materiel(echiquier):
    """Différence de matériel seule, du point de vue des Blancs."""
    score = 0
    for case in CASES:
        piece = echiquier.cases[case]
        if piece is VIDE:
            continue
        valeur = VALEURS[piece.upper()]
        score += valeur if piece in BLANCS else -valeur
    return score


def materiel_et_position(echiquier):
    """Matériel plus tables de cases, du point de vue des Blancs."""
    score = 0
    for case in CASES:
        piece = echiquier.cases[case]
        if piece is VIDE:
            continue
        valeur = VALEURS[piece.upper()] + TABLES[piece][case]
        score += valeur if piece in BLANCS else -valeur
    return score


def evaluer(echiquier):
    """Évaluation du point de vue du camp au trait."""
    score = materiel_et_position(echiquier)
    return score if echiquier.trait == "w" else -score


def miroir(echiquier):
    """La même position, camps échangés et échiquier retourné."""
    from echiquier import Echiquier

    champs = echiquier.fen().split()
    rangees = champs[0].split("/")
    inversees = [rangee.swapcase() for rangee in reversed(rangees)]
    trait = "b" if champs[1] == "w" else "w"
    roques = "".join(sorted(champs[2].swapcase())) if champs[2] != "-" else "-"
    en_passant = "-" if champs[3] == "-" else champs[3][0] + str(9 - int(champs[3][1]))
    return Echiquier(" ".join(["/".join(inversees), trait, roques, en_passant,
                               champs[4], champs[5]]))
