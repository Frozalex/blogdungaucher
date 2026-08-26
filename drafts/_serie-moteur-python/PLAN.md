# Série « Programmer son moteur d'échecs en Python » — plan de conception

Statut : rédaction commencée le 2026-08-21. 12 articles, 4 phases.
**Les 12 articles sont écrits.** Code vérifié pour chacun, chiffres publiés
issus d'exécutions réelles (machine de référence ci-dessous).

Deux vitesses très différentes, à ne pas confondre dans les articles :
`perft` tourne à environ **60 000 positions/s** (une génération de coups par
nœud interne, comptage en gros aux feuilles), alors que la **recherche** tourne
à environ **3 000 positions/s**, parce que le test d'absence de coup légal
oblige à générer les coups à chaque feuille aussi.
La structure publiée vit dans [`src/data/serie-moteur-python.ts`](../../src/data/serie-moteur-python.ts),
la page d'index dans [`src/pages/fr/series/moteur-python.astro`](../../src/pages/fr/series/moteur-python.astro).

## Décisions cadres (2026-08-21)

- **Promesse** : à la fin, le lecteur a un moteur qui parle UCI, tourne dans une
  vraie interface, et dont il connaît l'Elo mesuré. Pas « un moteur fort » :
  un moteur **dont la force est chiffrée honnêtement**.
- **Vérifiabilité** : c'est l'angle non-copiable de la série. Chaque article se
  termine par une mesure objective que le lecteur reproduit chez lui. Deux
  étalons seulement : `perft` (correction) et Stockfish bridé (force).
- **Zéro dépendance** : le moteur est écrit en bibliothèque standard pure.
  `python-chess` n'est utilisé **nulle part**, pas même pour vérifier, sinon la
  série devient un tutoriel d'API. Stockfish fournit tous les chiffres de
  référence, y compris les `perft` (`go perft N`).
- **Code réel** : chaque bloc de code publié est exécuté avant publication.
  Les fichiers vivent dans [`tools/moteur-python/`](../../tools/moteur-python/),
  un dossier par article. Aucune sortie de terminal n'est inventée : toutes les
  valeurs affichées dans les articles sortent d'une exécution réelle.
- **Version de référence** : Stockfish 18 (binaire officiel
  `stockfish-ubuntu-x86-64-avx2`, janvier 2026).
- **Représentation retenue** : mailbox 10×12 (64 cases utiles, bordure de
  sentinelles). Choisie contre les bitboards, plus rapides mais illisibles en
  Python, et contre le tableau 8×8 nu, qui oblige à tester les débordements à
  chaque coup. Décision expliquée en clair dans l'article 2 : le lecteur doit
  comprendre qu'il s'agit d'un arbitrage, pas d'une vérité.
- **Langage** : Python 3.10+. Assumé lent. La série dit explicitement dès
  l'article 1 qu'un moteur Python plafonne, et pourquoi c'est sans importance
  pour apprendre.
- **Catégorie** : `science` pour les 12.
- **Calendrier** : figé le 2026-08-26. **Un article par mardi**, du **2027-06-01**
  au **2027-08-17**, à la suite de la série Psychologie qui occupe les mardis
  jusqu'au 2027-05-25. Les 12 articles vivent désormais dans
  `src/content/blog/science/` ; seul ce plan reste dans `drafts/`.
  Le créneau du mardi étant réservé aux séries, la règle « deux rubriques
  différentes par semaine » ne s'applique plus à eux : elle ne concerne que la
  file lundi/jeudi. Voir `docs/10-publication-planning.md`.
- **Frontmatter** : `faq` remplie sur les 12 (levier SEO/GEO). `keyTakeaways`
  sur les articles à forte densité technique. Pas d'`affiliate`.
- **Traductions** : FR d'abord sur les 12. EN ensuite (le sujet a un fort
  potentiel en anglais, mais la concurrence y est réelle : chessprogramming
  wiki, tutoriels YouTube). PT-BR / NL non prioritaires.

## Articles existants à relier (maillage interne)

Le site couvre déjà la théorie ; la série couvre la pratique. Le maillage doit
être systématique, chaque article de la série pointant vers l'article théorique
correspondant, et réciproquement.

| Article de la série | Article théorique existant |
|---|---|
| Minimax (n° 7) | [`science/minimax-aux-echecs.md`](../../src/content/blog/science/minimax-aux-echecs.md) |
| Négamax / alpha-bêta (n° 8) | idem, section alpha-bêta + [`grand-oral/sujet-grand-oral-nsi-alpha-beta.md`](../../src/content/blog/grand-oral/sujet-grand-oral-nsi-alpha-beta.md) |
| Par où commencer (n° 1) | [`science/echecs-alphazero-stockfish.md`](../../src/content/blog/science/echecs-alphazero-stockfish.md) |
| Perft (n° 4) | [`science/echecs-et-complexite-algorithmique.md`](../../src/content/blog/science/echecs-et-complexite-algorithmique.md) |
| Évaluation (n° 6) | [`science/paradoxe-de-zermelo.md`](../../src/content/blog/science/paradoxe-de-zermelo.md) (pourquoi une heuristique est nécessaire) |
| UCI / Elo (n° 12) | [`grand-oral/grand-oral-nsi-echecs.md`](../../src/content/blog/grand-oral/grand-oral-nsi-echecs.md) |

## Les 12 articles

### Phase 1 — L'échiquier (4)

| # | Slug | Ce que le lecteur code | Vérification obtenue |
|---|---|---|---|
| 1 | `moteur-echecs-python-par-ou-commencer` | Lecture de FEN, affichage, dialogue UCI brut avec Stockfish | ✅ `bestmove e2e4` obtenu depuis Python |
| 2 | `representer-un-echiquier-en-python` | Mailbox 10×12, FEN dans les deux sens, `jouer` / `annuler` | ✅ 1 498 positions : aller-retour 1498/1498, `jouer`/`annuler` 1498/1498, position après coup 1420/1498 (78 écarts sur la seule case en passant, dette assumée) |
| 3 | `generer-les-coups-legaux-en-python` | Génération pseudo-légale puis filtrage par mise en échec ; roque, en passant, promotions | ✅ 41 648 coups comparés à Stockfish sur 1 498 positions, 0 écart ; dette de l'article 2 remboursée (3 épreuves à 1498/1498) |
| 4 | `perft-verifier-son-generateur-de-coups` | `perft`, `divide`, localisation automatique du coup fautif | ✅ 6/6 positions de référence, 41 812 668 positions comptées en 654 s |

### Phase 2 — Le premier moteur qui joue (4)

| # | Slug | Ce que le lecteur code | Vérification |
|---|---|---|---|
| 5 | `un-moteur-qui-joue-au-hasard` | Boucle de partie, détection mat / pat / nulles, SAN et PGN de sortie | ✅ 20 parties, 6 150 demi-coups vérifiés position par position contre Stockfish, 0 coup illégal |
| 6 | `fonction-evaluation-materiel-python` | Comptage matériel, point de vue, symétrie, moteur glouton | ✅ symétrie 1498/1498 ; même camp désigné que Stockfish 86,5 % ; tournoi glouton/hasard : +92 ± 32 Elo, 66 % de pats, +27,8 pions d'avance en nulle |
| 7 | `minimax-en-python-moteur-echecs` | Minimax de profondeur fixe, scores de mat, distance au mat | ✅ 20/20 mats en 1 et 14/14 mats en 2. Méthode de test refaite : la liste MultiPV de Stockfish était incomplète à profondeur 8 |
| 8 | `negamax-et-elagage-alpha-beta-python` | Négamax, fenêtre alpha-bêta, compteur de nœuds | ✅ 20/20 scores identiques aux 3 méthodes ; 9,2x moins de nœuds (1,9x à 21,4x selon la position) |

### Phase 3 — Le rendre fort (3)

| # | Slug | Ce que le lecteur code | Vérification |
|---|---|---|---|
| 9 | `ordonnancement-des-coups-moteur-echecs` | MVV-LVA, killer moves, historique | ✅ 6,1x moins de nœuds à profondeur 4, scores identiques 12/12, mais seulement **+0,5 profondeur** à budget constant. Bug réel corrigé ici : `Coup.__eq__` explosait face au `None` des killers |
| 10 | `approfondissement-iteratif-gestion-du-temps` | Iterative deepening, budget temps, interruption par exception | ✅ budget 1 s : 7/20 dépassements ; budget 3 s : 0/20 (granularité absolue, pas relative). Itératif **plus cher** : 1,25x à prof. 4, 1,05x à prof. 5 |
| 11 | `quiescence-et-tables-de-cases-python` | Quiescence avec stand pat, tables de cases engendrées | ✅ 28,2 % des positions ont ≥1 pion d'écart entre statique et calme ; accord Stockfish 89,1 % → 91,8 %. Tables ENGENDRÉES par des règles, jamais recopiées |

### Phase 4 — Le sortir de ton terminal (1)

| # | Slug | Ce que le lecteur code | Vérification |
|---|---|---|---|
| 12 | `protocole-uci-python-et-mesurer-son-elo` | Boucle UCI complète, budget depuis wtime/btime, match automatisé | ✅ protocole conforme (17 contrôles). **Elo mesuré : 1409 ± 227** (3/12 contre Stockfish bridé à 1600, 0,5 s/coup). Bat 1320 (2/2), perd contre 1900 (0/4) |

## Règles de rédaction propres à la série

- **Un article = un ajout**. Le code de l'article N reprend celui de N-1 et
  ajoute une seule chose. Jamais deux nouveautés dans le même article.
- **Le bug avant le correctif**. Chaque article montre d'abord ce qui casse
  (sortie de terminal réelle), puis pourquoi, puis le correctif. C'est ce qui
  distingue la série des tutoriels qui donnent le code fini.
- **Bugs réels trouvés en écrivant la série**, tous racontés dans les articles :
  `Coup.__eq__` face à `None` (art. 9) ; l'exception de temps écoulé qui laisse
  l'échiquier au milieu d'une variante (art. 10/12) ; la profondeur 1 qui
  s'interrompt et ne rend aucun coup (art. 12) ; et un faux échec dû à un oracle
  incomplet, pas au moteur (art. 7).
- **Pas de code non exécuté**, jamais, même pour un extrait de trois lignes.
- **Aucun tiret cadratin** (convention du site, cf. `scripts/strip-em-dash.mjs`).
- **Honnêteté sur la performance** : les chiffres de vitesse publiés précisent
  toujours la machine et la façon dont ils ont été mesurés. Machine de
  référence de la série : AMD Ryzen 7 5700U, Python 3.14, Stockfish 18 sur
  1 thread. Étalon mesuré le 2026-08-21 : `perft 6` depuis la position de
  départ (119 060 324 coups) en 1,60 s, soit environ 74 millions de coups
  générés par seconde. Ne jamais comparer des nœuds/seconde de recherche entre
  deux moteurs (les élagages diffèrent) : seul `perft` est comparable.
