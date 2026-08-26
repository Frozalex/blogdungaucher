"""La notation algébrique abrégée (SAN), pour écrire des PGN lisibles.

Le moteur n'en a aucun besoin : il travaille en notation UCI (`e2e4`), qui est
sans ambiguïté et se lit en deux tranches de deux caractères. La SAN, elle,
existe pour les humains, et son coût est exactement là : `Cf3` ne suffit pas
s'il y a deux cavaliers capables d'aller en f3, il faut alors préciser lequel.

C'est la seule raison pour laquelle cette fonction a besoin de la position, et
pas seulement du coup.
"""

from echiquier import CASES, VIDE, nom_de_case

LETTRES = {"N": "C", "B": "F", "R": "T", "Q": "D", "K": "R"}  # notation française


def san(echiquier, coup):
    """Notation algébrique abrégée d'un coup, dans la position donnée.

    À appeler AVANT de jouer le coup : la désambiguïsation et le suffixe
    d'échec dépendent tous deux de l'état courant.
    """
    piece = echiquier.cases[coup.depart]
    type_piece = piece.upper()

    if type_piece == "K" and abs(coup.arrivee - coup.depart) == 2:
        texte = "O-O" if coup.arrivee > coup.depart else "O-O-O"
    else:
        prise = echiquier.cases[coup.arrivee] is not VIDE or (
            type_piece == "P" and coup.arrivee == echiquier.en_passant
        )
        if type_piece == "P":
            # Un pion ne se nomme pas ; en cas de prise, c'est sa colonne de
            # départ qui l'identifie.
            texte = nom_de_case(coup.depart)[0] + "x" if prise else ""
            texte += nom_de_case(coup.arrivee)
            if coup.promotion:
                texte += "=" + LETTRES[coup.promotion.upper()]
        else:
            texte = LETTRES[type_piece] + _desambiguiser(echiquier, coup, piece)
            texte += "x" if prise else ""
            texte += nom_de_case(coup.arrivee)

    # Le suffixe d'échec se décide après coup : on joue, on regarde, on annule.
    echiquier.jouer(coup)
    adversaire_blanc = echiquier.trait == "w"
    if echiquier.en_echec(adversaire_blanc):
        texte += "#" if not echiquier.coups_legaux() else "+"
    echiquier.annuler()
    return texte


def _desambiguiser(echiquier, coup, piece):
    """Ce qu'il faut ajouter pour que le coup soit identifiable : "", "g", "1" ou "g1"."""
    rivales = [
        autre.depart
        for autre in echiquier.coups_legaux()
        if autre.arrivee == coup.arrivee
        and autre.depart != coup.depart
        and echiquier.cases[autre.depart] == piece
    ]
    if not rivales:
        return ""

    depart = nom_de_case(coup.depart)
    if all(nom_de_case(case)[0] != depart[0] for case in rivales):
        return depart[0]
    if all(nom_de_case(case)[1] != depart[1] for case in rivales):
        return depart[1]
    return depart


def pgn(entetes, coups_san, resultat):
    """Assembler une partie complète au format PGN."""
    lignes = [f'[{cle} "{valeur}"]' for cle, valeur in entetes.items()]
    lignes.append("")

    corps = []
    for index, texte in enumerate(coups_san):
        if index % 2 == 0:
            corps.append(f"{index // 2 + 1}.")
        corps.append(texte)
    corps.append(resultat)

    # Le PGN veut des lignes de moins de 80 colonnes.
    ligne = ""
    for element in corps:
        if len(ligne) + len(element) + 1 > 79:
            lignes.append(ligne)
            ligne = ""
        ligne += (" " if ligne and not ligne.endswith(".") else "") + element
    lignes.append(ligne)
    return "\n".join(lignes)
