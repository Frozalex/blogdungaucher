"""Faire s'affronter deux moteurs et chiffrer l'écart.

Outil de mesure réutilisé jusqu'à la fin de la série. Chaque paire de parties
est jouée deux fois, une fois avec chaque camp, pour annuler l'avantage des
Blancs. Le score est donné en points (1 pour une victoire, 0,5 pour une nulle)
et converti en écart Elo estimé.

La formule est celle du modèle logistique standard : un écart de score p se
traduit par un écart Elo de -400 log10(1/p - 1). Elle n'a de sens que si le
nombre de parties est suffisant, d'où l'intervalle de confiance affiché.

Usage :
    python3 tournoi.py 100
"""

import math
import sys
from collections import Counter

from evaluation import materiel
from partie import jouer_une_partie


def elo_depuis_score(score, parties):
    """Écart Elo estimé, et sa marge d'erreur à 95 %."""
    p = score / parties
    if p <= 0:
        return float("-inf"), 0.0
    if p >= 1:
        return float("inf"), 0.0
    elo = -400 * math.log10(1 / p - 1)

    # Erreur standard sur la proportion, propagée à l'échelle Elo par la
    # dérivée de la formule ci-dessus.
    erreur = math.sqrt(p * (1 - p) / parties)
    derivee = 400 / (math.log(10) * p * (1 - p))
    return elo, 1.96 * erreur * derivee


def affronter(fabrique_a, fabrique_b, paires, bavard=True):
    """`paires` doubles rencontres, soit 2 x `paires` parties.

    Les fabriques reçoivent une graine et renvoient un moteur : chaque partie
    part ainsi d'un état neuf et reproductible.
    """
    points_a = 0.0
    resultats = {"victoires": 0, "nulles": 0, "défaites": 0}
    motifs = Counter()
    materiels_en_nulle = []

    for numero in range(paires):
        for a_avec_les_blancs in (True, False):
            graine = 2 * numero + (0 if a_avec_les_blancs else 1)
            moteur_a = fabrique_a(graine)
            moteur_b = fabrique_b(graine + 1000)
            blancs, noirs = (moteur_a, moteur_b) if a_avec_les_blancs else (moteur_b, moteur_a)
            resultat, motif, _, _, final = jouer_une_partie(
                blancs, noirs, avec_notation=False, rendre_position=True,
            )
            motifs[motif] += 1

            if resultat == "1/2-1/2":
                # Combien de matériel A avait-il d'avance au moment de la nulle ?
                # C'est la mesure du gâchis : gagner du matériel sans savoir le
                # convertir ne rapporte rien.
                avance = materiel(final)
                materiels_en_nulle.append(avance if a_avec_les_blancs else -avance)
                points_a += 0.5
                resultats["nulles"] += 1
            elif (resultat == "1-0") == a_avec_les_blancs:
                points_a += 1
                resultats["victoires"] += 1
            else:
                resultats["défaites"] += 1

        if bavard and (numero + 1) % 10 == 0:
            print(f"  {2 * (numero + 1)} parties, {points_a} points", file=sys.stderr)

    resultats["motifs"] = motifs
    resultats["materiels_en_nulle"] = materiels_en_nulle
    return points_a, resultats


def rapport(nom_a, nom_b, points, resultats, parties):
    elo, marge = elo_depuis_score(points, parties)
    print(f"{nom_a} contre {nom_b} : {points} / {parties} "
          f"({100 * points / parties:.1f} %)")
    print(f"  {resultats['victoires']} victoires, {resultats['nulles']} nulles, "
          f"{resultats['défaites']} défaites")
    if math.isinf(elo):
        print("  écart Elo : hors mesure (score parfait, il faut un adversaire plus fort)")
    else:
        print(f"  écart Elo estimé : {elo:+.0f} ± {marge:.0f}")

    if resultats.get("motifs"):
        print("\n  Motifs de fin")
        for motif, compte in resultats["motifs"].most_common():
            print(f"    {motif:28} {compte:5}  ({100 * compte / parties:5.1f} %)")

    avances = sorted(resultats.get("materiels_en_nulle") or [])
    if avances:
        moyenne = sum(avances) / len(avances)
        print(f"\n  Avance matérielle de {nom_a} au moment des nulles :")
        print(f"    moyenne {moyenne / 100:+.2f} pion, médiane "
              f"{avances[len(avances) // 2] / 100:+.2f}, maximum "
              f"{avances[-1] / 100:+.2f}")


if __name__ == "__main__":
    from moteur_glouton import MoteurGlouton
    from partie import MoteurAuHasard

    paires = int(sys.argv[1]) if len(sys.argv) > 1 else 50
    points, resultats = affronter(MoteurGlouton, MoteurAuHasard, paires)
    rapport("Glouton", "Hasard", points, resultats, 2 * paires)
