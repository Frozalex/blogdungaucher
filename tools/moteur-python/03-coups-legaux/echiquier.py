"""L'échiquier, augmenté de la génération des coups légaux.

Article 3 de la série. Reprend la mailbox 10x12 de l'article 2 et lui ajoute :
`coups_pseudo_legaux`, `case_attaquee`, `en_echec` et `coups_legaux`. La dette
de l'article 2 sur la case de prise en passant est remboursée ici : `fen()`
n'annonce plus la case que si la prise est réellement jouable, ce qui suppose
justement de savoir générer les coups.

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

# Déplacements en indices mailbox. Une rangée fait 10 cases : monter d'une
# rangée vaut -10, avancer d'une colonne vaut +1. Le cavalier saute donc de
# 2x10+1 = 21, ou de 1x10+2 = 12, avec les signes correspondants.
SAUTS = {
    "N": (-21, -19, -12, -8, 8, 12, 19, 21),
    "B": (-11, -9, 9, 11),
    "R": (-10, -1, 1, 10),
    "Q": (-11, -10, -9, -1, 1, 9, 10, 11),
    "K": (-11, -10, -9, -1, 1, 9, 10, 11),
}

# Les pièces qui glissent jusqu'à rencontrer un obstacle, par opposition au
# cavalier et au roi qui font un seul pas.
GLISSENT = {"B", "R", "Q"}

# Rangées de départ des pions, pour la poussée de deux cases.
RANGEE_2 = range(81, 89)   # a2..h2
RANGEE_7 = range(31, 39)   # a7..h7

# Rangées de promotion.
RANGEE_8 = range(21, 29)
RANGEE_1 = range(91, 99)

PROMOTIONS = ("q", "r", "b", "n")

# Roque : lettre du droit -> (case du roi, arrivée du roi, cases qui doivent
# être vides, cases qui ne doivent pas être attaquées).
ROQUES = {
    "K": (95, 97, (96, 97), (95, 96, 97)),
    "Q": (95, 93, (94, 93, 92), (95, 94, 93)),
    "k": (25, 27, (26, 27), (25, 26, 27)),
    "q": (25, 23, (24, 23, 22), (25, 24, 23)),
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

        # Convention des moteurs modernes, celle des positions de référence de
        # perft : la case n'est annoncée que si la prise est réellement
        # jouable. C'est la dette contractée à l'article 2, remboursée ici :
        # il fallait savoir générer les coups pour trancher.
        en_passant = nom_de_case(self.en_passant) if self.prise_en_passant_possible() else "-"

        return " ".join([
            "/".join(rangees),
            self.trait,
            self.roques or "-",
            en_passant,
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

    # ------------------------------------------------------ coups pseudo-légaux

    def coups_pseudo_legaux(self, camp=None):
        """Tous les coups conformes au déplacement des pièces.

        « Pseudo-légaux » : on ne vérifie pas encore que le coup ne laisse pas
        son propre roi en échec. C'est volontaire, et c'est le choix classique.
        Vérifier les clouages ici demanderait de rejouer tout le raisonnement
        pour chaque pièce ; il est bien plus simple de jouer le coup et de
        regarder si le roi est pris, ce que fait `coups_legaux`.
        """
        blanc = (camp or self.trait) == "w"
        nos_pieces = BLANCS if blanc else NOIRS
        coups = []

        for depart in CASES:
            piece = self.cases[depart]
            if piece is VIDE or piece not in nos_pieces:
                continue

            type_piece = piece.upper()
            if type_piece == "P":
                self._coups_de_pion(depart, blanc, coups)
                continue

            glisse = type_piece in GLISSENT
            for saut in SAUTS[type_piece]:
                arrivee = depart + saut
                while True:
                    cible = self.cases[arrivee]
                    if cible is BORD:
                        break
                    if cible is VIDE:
                        coups.append(Coup(depart, arrivee))
                    else:
                        if cible not in nos_pieces:
                            coups.append(Coup(depart, arrivee))
                        break
                    if not glisse:
                        break
                    arrivee += saut

        self._coups_de_roque(blanc, coups)
        return coups

    def _coups_de_pion(self, depart, blanc, coups):
        """Le pion : quatre règles, dont trois qui n'existent pour aucune autre pièce."""
        avant = -10 if blanc else 10
        adverses = NOIRS if blanc else BLANCS
        rangee_initiale = RANGEE_2 if blanc else RANGEE_7
        rangee_promotion = RANGEE_8 if blanc else RANGEE_1

        # 1. Poussée simple. Un pion ne capture jamais devant lui.
        arrivee = depart + avant
        if self.cases[arrivee] is VIDE:
            self._ajouter_poussee(depart, arrivee, rangee_promotion, coups)
            # 2. Poussée double, uniquement depuis la rangée de départ et si
            # les DEUX cases sont libres.
            if depart in rangee_initiale and self.cases[arrivee + avant] is VIDE:
                coups.append(Coup(depart, arrivee + avant))

        # 3. Captures en diagonale, et 4. prise en passant, qui est la seule
        # capture vers une case vide.
        for cote in (-1, 1):
            arrivee = depart + avant + cote
            cible = self.cases[arrivee]
            if cible is BORD:
                continue
            if cible is not VIDE and cible in adverses:
                self._ajouter_poussee(depart, arrivee, rangee_promotion, coups)
            elif cible is VIDE and arrivee == self.en_passant:
                coups.append(Coup(depart, arrivee))

    @staticmethod
    def _ajouter_poussee(depart, arrivee, rangee_promotion, coups):
        """Un pion qui atteint la dernière rangée produit QUATRE coups, pas un."""
        if arrivee in rangee_promotion:
            for promotion in PROMOTIONS:
                coups.append(Coup(depart, arrivee, promotion))
        else:
            coups.append(Coup(depart, arrivee))

    def _coups_de_roque(self, blanc, coups):
        for lettre in ("K", "Q") if blanc else ("k", "q"):
            if lettre not in self.roques:
                continue
            depart, arrivee, doivent_etre_vides, ne_doivent_pas_etre_attaquees = ROQUES[lettre]
            if any(self.cases[case] is not VIDE for case in doivent_etre_vides):
                continue
            # On ne roque ni en échec, ni à travers une case attaquée, ni pour
            # se mettre en échec. Les trois cas sont la même règle, et c'est
            # pourquoi ils sont dans la même table.
            if any(self.case_attaquee(case, not blanc) for case in ne_doivent_pas_etre_attaquees):
                continue
            coups.append(Coup(depart, arrivee))

    # --------------------------------------------------------------- attaques

    def case_attaquee(self, case, par_les_blancs):
        """La case est-elle attaquée par le camp indiqué ?

        On raisonne à l'envers : au lieu d'énumérer les coups adverses, on part
        de la case et on remonte chaque direction pour voir qui s'y trouve.
        C'est le même travail, mais borné par les huit directions au lieu du
        nombre de pièces adverses.
        """
        cases = self.cases

        # Pions. Un pion blanc en case+9 ou case+11 attaque `case` : il capture
        # vers l'avant, donc depuis une rangée plus basse.
        pion = "P" if par_les_blancs else "p"
        sens = 1 if par_les_blancs else -1
        if cases[case + 9 * sens] == pion or cases[case + 11 * sens] == pion:
            return True

        # Cavaliers et roi : un seul pas.
        cavalier = "N" if par_les_blancs else "n"
        roi = "K" if par_les_blancs else "k"
        for saut in SAUTS["N"]:
            if cases[case + saut] == cavalier:
                return True
        for saut in SAUTS["K"]:
            if cases[case + saut] == roi:
                return True

        # Pièces qui glissent. On avance dans chaque direction jusqu'au premier
        # obstacle : s'il s'agit d'une pièce adverse du bon type, la case est
        # attaquée.
        diagonales = ("B", "Q") if par_les_blancs else ("b", "q")
        lignes = ("R", "Q") if par_les_blancs else ("r", "q")
        for sauts, attaquants in ((SAUTS["B"], diagonales), (SAUTS["R"], lignes)):
            for saut in sauts:
                arrivee = case + saut
                while cases[arrivee] is VIDE:
                    arrivee += saut
                if cases[arrivee] in attaquants:
                    return True

        return False

    def case_du_roi(self, blanc):
        roi = "K" if blanc else "k"
        for case in CASES:
            if self.cases[case] == roi:
                return case
        raise ValueError(f"pas de roi {'blanc' if blanc else 'noir'} sur l'échiquier")

    def en_echec(self, blanc):
        return self.case_attaquee(self.case_du_roi(blanc), not blanc)

    # ----------------------------------------------------------- coups légaux

    def coups_legaux(self):
        """Les coups pseudo-légaux, moins ceux qui laissent son propre roi en échec.

        Le filtre est brutal : on joue, on regarde, on annule. C'est le procédé
        dit « légalité paresseuse ». Il coûte un `jouer`/`annuler` par coup
        candidat, ce qui est cher, mais il est juste par construction : aucun
        clouage, aucune découverte, aucun cas tordu ne peut lui échapper.
        """
        blanc = self.trait == "w"
        legaux = []
        for coup in self.coups_pseudo_legaux():
            self.jouer(coup)
            if not self.en_echec(blanc):
                legaux.append(coup)
            self.annuler()
        return legaux

    def prise_en_passant_possible(self):
        """Un coup de prise en passant est-il réellement jouable ?

        Sert uniquement à écrire la FEN dans la convention des moteurs
        modernes. On ne peut pas se contenter de regarder s'il y a un pion à
        côté : ce pion peut être cloué, auquel cas la prise est illégale et la
        case ne doit pas être annoncée.
        """
        if self.en_passant is None:
            return False
        blanc = self.trait == "w"
        pion = "P" if blanc else "p"
        avant = -10 if blanc else 10
        for cote in (-1, 1):
            depart = self.en_passant - avant + cote
            if self.cases[depart] != pion:
                continue
            coup = Coup(depart, self.en_passant)
            self.jouer(coup)
            legal = not self.en_echec(blanc)
            self.annuler()
            if legal:
                return True
        return False

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
    coups = echiquier.coups_legaux()
    print(echiquier)
    print(f"\n{len(coups)} coups légaux : {' '.join(sorted(str(c) for c in coups))}")

    # Position de Kiwipete (Peter McKenzie), la plus utilisée pour débusquer
    # les bugs de génération : roques des deux côtés, prise en passant, pièces
    # clouées, tout y est.
    kiwipete = "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1"
    echiquier = Echiquier(kiwipete)
    coups = echiquier.coups_legaux()
    print(f"\nKiwipete : {len(coups)} coups légaux (48 attendus)")
