# Code de la série « Programmer son moteur d'échecs en Python »

Un dossier par article, dans l'ordre de la série. Chaque dossier contient du code
autonome : on peut le lancer sans avoir lu les articles précédents, quitte à
répéter quelques lignes d'un dossier à l'autre. C'est volontaire, un lecteur qui
arrive par un moteur de recherche doit pouvoir exécuter le fichier tel quel.

## Prérequis

- Python 3.10 ou plus récent, sans aucune dépendance externe (tout est en
  bibliothèque standard : le moteur est écrit de zéro, `python-chess` n'est pas
  utilisé, ni pour le moteur ni pour les vérifications).
- Stockfish, uniquement comme étalon de mesure : il fournit les valeurs de
  référence de `perft`, des évaluations à comparer, et un adversaire calibré.

Stockfish se télécharge sur <https://stockfishchess.org/download/>. Indiquer
ensuite son chemin dans la variable d'environnement `STOCKFISH` :

```sh
export STOCKFISH=/chemin/vers/stockfish
```

Version utilisée pour produire les chiffres publiés dans les articles :
**Stockfish 18** (binaire officiel `stockfish-ubuntu-x86-64-avx2`, janvier 2026).

## Vérifier que tout tourne

```sh
python3 01-par-ou-commencer/afficher_position.py
python3 01-par-ou-commencer/parler_a_stockfish.py
python3 02-echiquier/verifier_echiquier.py --stockfish
python3 03-coups-legaux/verifier_coups.py
python3 04-perft/suite_perft.py --rapide
python3 05-partie-au-hasard/verifier_partie.py 5
```

(`STOCKFISH` doit être exportée pour les trois dernières.)

## Dossiers

| Dossier | Article | Vérification |
|---|---|---|
| `01-par-ou-commencer/` | Un moteur d'échecs, c'est quoi exactement | `parler_a_stockfish.py` répond `bestmove` |
| `02-echiquier/` | Représenter un échiquier | `verifier_echiquier.py --stockfish` : 3 épreuves sur 1 498 positions |
| `03-coups-legaux/` | Générer les coups légaux | `verifier_coups.py` : 41 648 coups comparés à Stockfish |
| `04-perft/` | Perft | `suite_perft.py` : 6 positions, 41 812 668 positions comptées |
| `05-partie-au-hasard/` | Un moteur qui joue au hasard | `verifier_partie.py` : parties entières vérifiées demi-coup par demi-coup |
| `06-evaluation/` | Évaluer une position | `verifier_evaluation.py --stockfish` : symétrie et accord de signe |
| `07-minimax/` | Minimax | `verifier_mats.py` : 34 mats forcés trouvés |
| `08-alpha-beta/` | Négamax et alpha-bêta | `verifier_elagage.py` : scores identiques aux trois méthodes |
| `09-ordonnancement/` | Ordonner les coups | `banc_ordonnancement.py` : nœuds et profondeur, avec et sans tri |
| `10-temps/` | Approfondissement itératif | `banc_temps.py` : respect du budget, prix de l'itératif |
| `11-quiescence/` | Quiescence et tables de cases | `verifier_quiescence.py --stockfish` : écart statique / calme |
| `12-uci/` | Protocole UCI et mesure d'Elo | `verifier_uci.py` puis `match_stockfish.py` |

Le fichier `echiquier.py` est recopié d'un dossier au suivant et enrichi à chaque
article, de sorte que chaque dossier tourne seul. Celui de `04-perft/` est
identique à celui de `03-coups-legaux/` : perft ne modifie pas le générateur, il
le juge.

Une correction à noter, apportée à partir de `09-ordonnancement/` : `Coup.__eq__`
renvoie désormais `NotImplemented` au lieu de comparer aveuglément les attributs.
Sans cela, comparer un coup à `None` lève une exception, ce qui arrive dès qu'on
consulte une table de killers encore vide.

`suite_perft.py` sans `--rapide` prend une dizaine de minutes ; avec, une
vingtaine de secondes (une profondeur de moins sur chaque position).

## Jeux d'essai

`02-echiquier/positions.txt` et `02-echiquier/cas_particuliers.txt` sont
versionnés pour que la vérification soit rejouable à l'identique. Ils se
régénèrent avec :

```sh
STOCKFISH=... python3 02-echiquier/generer_positions.py 12
STOCKFISH=... python3 02-echiquier/generer_cas_particuliers.py
```

Le premier fait jouer douze parties à Stockfish (graine fixée à 20260821), le
second rejoue neuf séquences écrites à la main pour couvrir les coups que le
hasard ne produit pas : prise en passant, quatre roques, promotions.
