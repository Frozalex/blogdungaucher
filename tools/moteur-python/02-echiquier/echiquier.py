"""L'échiquier : représentation mailbox 10x12, FEN dans les deux sens, jouer/annuler.

Article 2 de la série. Aucune génération de coups ici : uniquement la structure
de données sur laquelle tout le reste s'appuiera, et les deux opérations qui
seront appelées des millions de fois par la recherche : `jouer` et `annuler`.

Le tableau fait 120 cases : 8x8 utiles, entourées d'une bordure de sentinelles
de deux rangées en haut et en bas, d'une colonne à gauche et à droite. Cette
bordure sert à une seule chose, mais elle est décisive : un cavalier qui saute
hors de l'échiquier atterrit sur une sentinelle au lieu de réapparaître de
l'autre côté. Le test de débordement devient une simple lecture de case.

    0   1   2   3   4   5   6   7   8   9
   10  11  12  13  14  15  16  17  18  19
   20 [21  22  23  24  25  26  27  28] 29   <- rangée 8 (a8 = 21, h8 = 28)
   ...
   90 [91  92  93  94  95  96  97  98] 99   <- rangée 1 (a1 = 91, h1 = 98)
  100 101 102 103 104 105 106 107 108 109
  110 111 112 113 114 115 116 117 118 119
"""

DEPART = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"

VIDE = None
BORD = "x"

BLANCS = "PNBRQK"
NOIRS = "pnbrqk"

SYMBOLES = {
    "P": "♙", "N": "♘", "B": "♗", "R": "♖", "Q": "♕", "K": "♔",
    "p": "♟", "n": "♞", "b": "♝", "r": "♜", "q": "♛", "k": "♚",
}

# Les 64 cases utiles, dans l'ordre de lecture d'une FEN : a8 en premier, h1 en
# dernier. Sert au chargement comme à l'écriture, ce qui garantit qu'on ne peut
# pas se tromper dans un sens sans se tromper dans l'autre.
CASES = [21 + rangee * 10 + colonne for rangee in range(8) for colonne in range(8)]

# Droits de roque perdus dès qu'une case clé est quittée OU prise. Un fou qui
# capture la tour h1 doit annuler le petit roque blanc aussi sûrement que si
# cette tour avait bougé : d'où une table indexée par case, appliquée au départ
# comme à l'arrivée du coup.
ROQUES_PERDUS = {
    95: "KQ",  # e1, le roi blanc
    98: "K",   # h1
    91: "Q",   # a1
    25: "kq",  # e8, le roi noir
    28: "k",   # h8
    21: "q",   # a8
}


def nom_de_case(index):
    """21 -> 'a8', 98 -> 'h1'."""
    colonne = (index % 10) - 1
    rangee = (index // 10) - 2
    return "abcdefgh"[colonne] + "87654321"[rangee]


def index_de_case(nom):
    """'a8' -> 21, 'h1' -> 98."""
    colonne = "abcdefgh".index(nom[0])
    rangee = "87654321".index(nom[1])
    return 21 + rangee * 10 + colonne


class Coup:
    """Un coup : case de départ, case d'arrivée, et éventuelle promotion.

    Volontairement pauvre. Ni « c'est un roque », ni « c'est une prise en
    passant » : ces deux informations se déduisent de la position au moment où
    le coup est joué, et les stocker deux fois serait une source d'incohérence.
    """

    __slots__ = ("depart", "arrivee", "promotion")

    def __init__(self, depart, arrivee, promotion=None):
        self.depart = depart
        self.arrivee = arrivee
        self.promotion = promotion

    def __eq__(self, autre):
        return (self.depart, self.arrivee, self.promotion) == (
            autre.depart, autre.arrivee, autre.promotion
        )

    def __hash__(self):
        return hash((self.depart, self.arrivee, self.promotion))

    def __repr__(self):
        return f"Coup({self})"

    def __str__(self):
        """Notation UCI : e2e4, e7e8q. C'est celle que le protocole exige."""
        return nom_de_case(self.depart) + nom_de_case(self.arrivee) + (self.promotion or "")

    @classmethod
    def depuis_uci(cls, texte):
        promotion = texte[4] if len(texte) == 5 else None
        return cls(index_de_case(texte[:2]), index_de_case(texte[2:4]), promotion)


class Echiquier:
    def __init__(self, fen=DEPART):
        self.charger_fen(fen)

    # ------------------------------------------------------------------ FEN

    def charger_fen(self, fen):
        champs = fen.split()
        if len(champs) != 6:
            raise ValueError(f"FEN invalide : 6 champs attendus, {len(champs)} reçus")

        self.cases = [BORD] * 120
        for index in CASES:
            self.cases[index] = VIDE

        index = 0
        for rangee in champs[0].split("/"):
            debut = index
            for caractere in rangee:
                if caractere.isdigit():
                    index += int(caractere)
                elif caractere in SYMBOLES:
                    self.cases[CASES[index]] = caractere
                    index += 1
                else:
                    raise ValueError(f"FEN invalide : caractère inattendu {caractere!r}")
            if index - debut != 8:
                raise ValueError(f"FEN invalide : la rangée {rangee!r} ne fait pas 8 cases")

        self.trait = champs[1]
        self.roques = champs[2]
        self.en_passant = index_de_case(champs[3]) if champs[3] != "-" else None
        self.demi_coups = int(champs[4])
        self.numero = int(champs[5])
        self.historique = []

    def fen(self):
        rangees = []
        for debut in range(0, 64, 8):
            texte = ""
            vides = 0
            for index in CASES[debut:debut + 8]:
                piece = self.cases[index]
                if piece is VIDE:
                    vides += 1
                else:
                    if vides:
                        texte += str(vides)
                        vides = 0
                    texte += piece
            if vides:
                texte += str(vides)
            rangees.append(texte)

        return " ".join([
            "/".join(rangees),
            self.trait,
            self.roques or "-",
            nom_de_case(self.en_passant) if self.en_passant else "-",
            str(self.demi_coups),
            str(self.numero),
        ])

    # ------------------------------------------------------------ jouer/annuler

    def jouer(self, coup):
        piece = self.cases[coup.depart]
        blanc = piece in BLANCS
        pion = piece in "Pp"

        # Prise en passant : la pièce capturée n'est PAS sur la case d'arrivée.
        # C'est le seul coup des échecs où c'est le cas, et c'est la première
        # chose que l'annulation oublie de restaurer si on ne mémorise pas
        # explicitement la case de la capture.
        if pion and coup.arrivee == self.en_passant:
            case_capture = coup.arrivee + (10 if blanc else -10)
        else:
            case_capture = coup.arrivee
        capturee = self.cases[case_capture]

        # Tout ce qui devra être restauré est empilé AVANT modification. C'est
        # la seule façon fiable : recalculer l'état précédent après coup est
        # possible pour les droits de roque, impossible pour le compteur des
        # cinquante coups (on ne sait plus s'il valait 0 ou 37).
        self.historique.append(
            (coup, capturee, case_capture, self.roques, self.en_passant,
             self.demi_coups, self.numero)
        )
        self.cases[case_capture] = VIDE

        # Poussée de deux cases : la case survolée devient prenable en passant.
        nouvel_en_passant = None
        if pion and abs(coup.arrivee - coup.depart) == 20:
            nouvel_en_passant = (coup.depart + coup.arrivee) // 2

        # Roque : le roi fait deux pas, la tour saute par dessus. On déplace la
        # tour ici, le roi étant déplacé par le cas général juste après.
        if piece in "Kk" and abs(coup.arrivee - coup.depart) == 2:
            if coup.arrivee > coup.depart:  # petit roque
                self.cases[coup.arrivee - 1] = self.cases[coup.arrivee + 1]
                self.cases[coup.arrivee + 1] = VIDE
            else:  # grand roque
                self.cases[coup.arrivee + 1] = self.cases[coup.arrivee - 2]
                self.cases[coup.arrivee - 2] = VIDE

        self.cases[coup.depart] = VIDE
        if coup.promotion:
            # La notation UCI écrit toujours la promotion en minuscule (e7e8q),
            # y compris pour les Blancs : c'est à nous de rétablir la casse.
            self.cases[coup.arrivee] = coup.promotion.upper() if blanc else coup.promotion
        else:
            self.cases[coup.arrivee] = piece

        for case in (coup.depart, coup.arrivee):
            for lettre in ROQUES_PERDUS.get(case, ""):
                self.roques = self.roques.replace(lettre, "")

        self.en_passant = nouvel_en_passant
        self.demi_coups = 0 if (pion or capturee is not VIDE) else self.demi_coups + 1
        if not blanc:
            self.numero += 1
        self.trait = "b" if blanc else "w"

    def annuler(self):
        coup, capturee, case_capture, roques, en_passant, demi_coups, numero = \
            self.historique.pop()

        self.roques = roques
        self.en_passant = en_passant
        self.demi_coups = demi_coups
        self.numero = numero
        self.trait = "b" if self.trait == "w" else "w"

        piece = self.cases[coup.arrivee]
        if coup.promotion:
            piece = "P" if piece in BLANCS else "p"

        self.cases[coup.depart] = piece
        self.cases[coup.arrivee] = VIDE
        if capturee is not VIDE:
            self.cases[case_capture] = capturee

        if piece in "Kk" and abs(coup.arrivee - coup.depart) == 2:
            if coup.arrivee > coup.depart:
                self.cases[coup.arrivee + 1] = self.cases[coup.arrivee - 1]
                self.cases[coup.arrivee - 1] = VIDE
            else:
                self.cases[coup.arrivee - 2] = self.cases[coup.arrivee + 1]
                self.cases[coup.arrivee + 1] = VIDE

    # ------------------------------------------------------------- affichage

    def __str__(self):
        lignes = []
        for rangee in range(8):
            contenu = []
            for colonne in range(8):
                piece = self.cases[21 + rangee * 10 + colonne]
                contenu.append(SYMBOLES[piece] if piece is not VIDE else "·")
            lignes.append(f"{8 - rangee} | " + " ".join(contenu))
        lignes.append("  +" + "-" * 17)
        lignes.append("    a b c d e f g h")
        lignes.append(self.fen())
        return "\n".join(lignes)


if __name__ == "__main__":
    echiquier = Echiquier()
    print(echiquier)
    for uci in ["e2e4", "c7c5", "g1f3", "d7d6", "f1b5"]:
        echiquier.jouer(Coup.depuis_uci(uci))
    print()
    print(echiquier)
