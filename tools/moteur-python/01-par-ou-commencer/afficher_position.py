"""Lire une FEN et afficher l'échiquier correspondant dans le terminal.

Premier programme de la série : il ne joue pas, il ne calcule rien, il montre
seulement qu'on sait transformer la notation standard d'une position en quelque
chose de lisible. C'est le minimum vital avant d'écrire quoi que ce soit d'autre :
sans affichage, tous les bugs suivants seront invisibles.

Usage :
    python3 afficher_position.py
    python3 afficher_position.py "r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5Q2/PPPP1PPP/RNB1K1NR w KQkq - 4 4"
"""

import sys

POSITION_DE_DEPART = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"

# Les pièces sont stockées telles quelles (les lettres de la FEN : majuscule =
# blanc, minuscule = noir). On ne traduit en symboles Unicode qu'à l'affichage.
SYMBOLES = {
    "P": "♙", "N": "♘", "B": "♗", "R": "♖", "Q": "♕", "K": "♔",
    "p": "♟", "n": "♞", "b": "♝", "r": "♜", "q": "♛", "k": "♚",
}


def lire_fen(fen):
    """Découper une FEN en (cases, trait, roques, en_passant, demi_coups, coup).

    `cases` est une liste de 64 éléments, indexée de a8 (0) à h1 (63), c'est à
    dire dans l'ordre de lecture de la FEN elle-même. Une case vide vaut None.
    """
    champs = fen.split()
    if len(champs) != 6:
        raise ValueError(f"FEN invalide : 6 champs attendus, {len(champs)} reçus")

    rangees = champs[0].split("/")
    if len(rangees) != 8:
        raise ValueError(f"FEN invalide : 8 rangées attendues, {len(rangees)} reçues")

    cases = []
    for rangee in rangees:
        debut = len(cases)
        for caractere in rangee:
            if caractere.isdigit():
                cases.extend([None] * int(caractere))
            elif caractere in SYMBOLES:
                cases.append(caractere)
            else:
                raise ValueError(f"FEN invalide : caractère inattendu {caractere!r}")
        if len(cases) - debut != 8:
            raise ValueError(f"FEN invalide : la rangée {rangee!r} ne fait pas 8 cases")

    return cases, champs[1], champs[2], champs[3], int(champs[4]), int(champs[5])


def afficher(cases, trait):
    """Dessiner l'échiquier vu du côté des Blancs."""
    lignes = []
    for rangee in range(8):
        numero = 8 - rangee
        contenu = []
        for colonne in range(8):
            piece = cases[rangee * 8 + colonne]
            contenu.append(SYMBOLES[piece] if piece else "·")
        lignes.append(f"{numero} | " + " ".join(contenu))
    lignes.append("  +" + "-" * 17)
    lignes.append("    a b c d e f g h")
    lignes.append("")
    lignes.append("Trait aux " + ("Blancs" if trait == "w" else "Noirs"))
    return "\n".join(lignes)


if __name__ == "__main__":
    fen = sys.argv[1] if len(sys.argv) > 1 else POSITION_DE_DEPART
    cases, trait, roques, en_passant, demi_coups, coup = lire_fen(fen)
    print(afficher(cases, trait))
    print(f"Roques possibles : {roques}   Prise en passant : {en_passant}")
    print(f"Règle des 50 coups : {demi_coups} demi-coups   Coup n° {coup}")
