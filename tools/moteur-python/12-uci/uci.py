"""Le moteur, enfin branchable dans une vraie interface.

Article 12 de la série. UCI (Universal Chess Interface) est une convention de
dialogue en texte brut : l'interface écrit des ordres sur l'entrée standard du
moteur, le moteur répond sur sa sortie standard. C'est tout ce qui sépare notre
programme d'un moteur utilisable dans Arena, Cute Chess, Banksia ou n'importe
quelle interface de bureau.

Trois règles à ne pas enfreindre, chacune correspondant à un bug classique :

  - toujours vider le tampon après avoir écrit (`flush`), sinon l'interface
    attend une réponse déjà écrite mais jamais envoyée ;
  - ne jamais écrire autre chose que du protocole sur la sortie standard : un
    `print` de débogage égaré fait planter l'interface. Les messages de
    diagnostic passent par `info string` ;
  - répondre `bestmove` à CHAQUE `go`, quoi qu'il arrive, même sur une
    position sans coup légal. Une interface qui n'obtient pas son `bestmove`
    reste bloquée indéfiniment.

Usage :
    python3 uci.py            # puis taper « uci », « position startpos », « go movetime 1000 »
"""

import sys

from echiquier import Coup, DEPART, Echiquier
from recherche import MAT, chercher

NOM = "Gaucher 1.0"
AUTEUR = "Blog d'un Gaucher"

# Part du temps restant consacrée à un coup. Une partie dure rarement plus de
# soixante coups par camp après le début du jeu, et il vaut mieux garder de la
# réserve : diviser par trente est le réglage prudent classique.
DIVISEUR_DE_TEMPS = 30


def ecrire(ligne):
    sys.stdout.write(ligne + "\n")
    sys.stdout.flush()


def score_uci(score):
    """« cp 42 » ou « mate 3 », dans la convention du protocole.

    Attention au signe et à l'unité : `mate n` compte des COUPS (pas des
    demi-coups) et il est négatif quand c'est le moteur qui se fait mater.
    """
    if abs(score) >= MAT - 1000:
        coups = (MAT - abs(score) + 1) // 2
        return f"mate {coups if score > 0 else -coups}"
    return f"cp {score}"


def budget_pour(arguments, trait_blanc):
    """Combien de secondes accorder à ce coup, d'après les arguments de `go`."""
    if "movetime" in arguments:
        return int(arguments[arguments.index("movetime") + 1]) / 1000

    cle = "wtime" if trait_blanc else "btime"
    if cle in arguments:
        restant = int(arguments[arguments.index(cle) + 1]) / 1000
        increment = 0.0
        cle_inc = "winc" if trait_blanc else "binc"
        if cle_inc in arguments:
            increment = int(arguments[arguments.index(cle_inc) + 1]) / 1000
        # On garde une marge : dépasser le temps perd la partie sur-le-champ,
        # alors que réfléchir un peu moins ne coûte que quelques points Elo.
        return max(0.05, restant / DIVISEUR_DE_TEMPS + increment * 0.8)

    return None  # « go depth n » ou « go infinite » : pas de contrainte de temps


def poser_la_position(arguments):
    if arguments[0] == "startpos":
        echiquier = Echiquier(DEPART)
        reste = arguments[1:]
    else:  # « fen <6 champs> [moves ...] »
        echiquier = Echiquier(" ".join(arguments[1:7]))
        reste = arguments[7:]

    if reste and reste[0] == "moves":
        for texte in reste[1:]:
            echiquier.jouer(Coup.depuis_uci(texte))
    return echiquier


def boucle():
    echiquier = Echiquier(DEPART)

    for ligne in sys.stdin:
        mots = ligne.split()
        if not mots:
            continue
        commande, arguments = mots[0], mots[1:]

        if commande == "uci":
            ecrire(f"id name {NOM}")
            ecrire(f"id author {AUTEUR}")
            ecrire("uciok")

        elif commande == "isready":
            ecrire("readyok")

        elif commande == "ucinewgame":
            echiquier = Echiquier(DEPART)

        elif commande == "position":
            echiquier = poser_la_position(arguments)

        elif commande == "go":
            budget = budget_pour(arguments, echiquier.trait == "w")
            profondeur_max = (int(arguments[arguments.index("depth") + 1])
                              if "depth" in arguments else 64)

            def rapporter(profondeur, score, noeuds, ecoule, coup):
                vitesse = int(noeuds / ecoule) if ecoule > 0 else 0
                ecrire(f"info depth {profondeur} score {score_uci(score)} "
                       f"nodes {noeuds} nps {vitesse} "
                       f"time {int(ecoule * 1000)} pv {coup}")

            coup, _, _, _, _ = chercher(echiquier, budget, profondeur_max,
                                        rapporter=rapporter)
            # Même sans coup légal, l'interface DOIT recevoir une réponse.
            ecrire(f"bestmove {coup if coup else '(none)'}")

        elif commande == "quit":
            return

        # « stop » et « ponderhit » sont acceptés sans effet : notre recherche
        # n'est pas asynchrone, elle rend la main d'elle-même à l'échéance.


if __name__ == "__main__":
    boucle()
