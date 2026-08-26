"""Pourquoi le tableau de 64 cases, si évident, est le mauvais choix.

Un échiquier a 64 cases : une liste de 64 éléments semble donc s'imposer. Le
problème apparaît au premier cavalier posé sur une colonne de bord. Ce script
met le bug sous les yeux, puis montre la même position avec la bordure de
sentinelles.

Usage :
    python3 le_piege_des_64_cases.py
"""

# --- Version naïve : 64 cases, index 0 = a8, index 63 = h1 ------------------

SAUTS_64 = [-17, -15, -10, -6, 6, 10, 15, 17]


def nom_64(index):
    return "abcdefgh"[index % 8] + "87654321"[index // 8]


def cavalier_64(depart):
    arrivees = []
    for saut in SAUTS_64:
        arrivee = depart + saut
        if 0 <= arrivee <= 63:  # la seule vérification possible ici
            arrivees.append(nom_64(arrivee))
    return arrivees


# --- Version mailbox : 120 cases, index 21 = a8, index 98 = h1 --------------

BORD = "x"
SAUTS_120 = [-21, -19, -12, -8, 8, 12, 19, 21]
CASES = [21 + rangee * 10 + colonne for rangee in range(8) for colonne in range(8)]


def nom_120(index):
    return "abcdefgh"[(index % 10) - 1] + "87654321"[(index // 10) - 2]


def cavalier_120(depart, plateau):
    arrivees = []
    for saut in SAUTS_120:
        arrivee = depart + saut
        if plateau[arrivee] is not BORD:  # une simple lecture de case
            arrivees.append(nom_120(arrivee))
    return arrivees


if __name__ == "__main__":
    plateau = [BORD] * 120
    for index in CASES:
        plateau[index] = None

    attendu = {"f3", "f5", "g2", "g6"}

    for case in ["h4", "a4", "h1", "b1"]:
        colonne = "abcdefgh".index(case[0])
        rangee = "87654321".index(case[1])
        index_64 = rangee * 8 + colonne
        index_120 = 21 + rangee * 10 + colonne

        naif = sorted(cavalier_64(index_64))
        mailbox = sorted(cavalier_120(index_120, plateau))
        print(f"Cavalier en {case}")
        print(f"  64 cases  : {' '.join(naif)}   ({len(naif)} coups)")
        print(f"  mailbox   : {' '.join(mailbox)}   ({len(mailbox)} coups)")
        print()

    print("Le cavalier en h4 ne va pas en b4 : il a traversé le bord droit de")
    print("l'échiquier pour réapparaître à gauche, deux rangées plus loin.")
    print(f"Coups réels d'un cavalier en h4 : {' '.join(sorted(attendu))}")
