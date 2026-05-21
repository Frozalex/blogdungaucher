---
title: "Guide Grand Oral NSI – Échecs : script, code Python commenté et questions jury"
excerpt: "Le guide complet pour ton Grand Oral spécialité NSI avec les échecs : script minuté 10 min, code Python expliqué ligne par ligne, 20 questions de jury avec réponses. Minimax, alpha-bêta, AlphaZero — tout y est."
publishDate: "2026-05-08"
category: "grand-oral"
featured: false
featuredRank: 99
readingTime: "25 min"
pillar: "Grand Oral"
tags: ["grand-oral", "NSI", "numérique", "Python", "algorithme", "minimax", "alpha-bêta", "AlphaZero", "terminale", "baccalauréat", "guide"]
keyTakeaways:
  - "Script minuté 10 minutes avec transitions rédigées et blocs de code Python commentés pour présentation orale."
  - "Minimax, alpha-bêta et AlphaZero expliqués avec complexité algorithmique et pseudo-code."
  - "20 questions de jury classées du plus simple au plus technique, avec réponses complètes en langage oral."
  - "3 problématiques au choix selon ton niveau : arbre de décision, optimisation alpha-bêta, IA par apprentissage."
  - "Fiche mémo complexités (O notation) et vocabulaire NSI à imprimer."
seoTitle: "Guide Grand Oral NSI Échecs 2026 : script 10 min + Python minimax + jury"
seoDescription: "Script 10 min, code Python minimax et alpha-bêta commenté ligne par ligne, 20 questions de jury rédigées. Le guide imprimable pour ton Grand Oral NSI avec les échecs."
ogImage: "/images/blog/guide-grand-oral-echecs-nsi-hero.png"
heroImage:
  src: "/images/blog/guide-grand-oral-echecs-nsi-hero.png"
  alt: "Illustration pixel art : lycéen face à un jury, échiquier et code Python en arrière-plan — « Guide Grand Oral NSI Échecs »"
  credit: "Blog d'un Gaucher"
  license: "Création originale"
titleEn: "NSI Grand Oral Chess Guide 2026: 10-min Script + Python Minimax + Jury Q&A"
excerptEn: "Everything you need for your Grand Oral NSI specialty with chess: 10-min script, Python minimax/alpha-beta code commented line by line, 20 jury questions with written answers."
seoTitleEn: "NSI Grand Oral Chess Guide 2026: 10-min Script + Python Minimax + Jury Q&A"
seoDescriptionEn: "10-min script, Python minimax and alpha-beta code commented line by line, 20 jury questions written. The printable guide for your NSI Grand Oral with chess."
faq:
  - question: "Quelle problématique choisir pour un Grand Oral NSI avec les échecs ?"
    answer: "Trois angles solides : (1) 'Comment un algorithme peut-il jouer aux échecs ?' — idéal pour explorer l'arbre minimax, la récursivité et la fonction d'évaluation. (2) 'En quoi l'élagage alpha-bêta illustre-t-il l'optimisation algorithmique ?' — plus technique, montre une réduction de O(b^d) à O(b^(d/2)). (3) 'Pourquoi AlphaZero représente-t-il une rupture dans l'histoire de l'intelligence artificielle appliquée aux jeux ?' — angle épistémologique, idéal avec une spécialité complémentaire Maths ou Philosophie."
  - question: "Peut-on montrer du code Python au jury du Grand Oral ?"
    answer: "Oui — c'est même recommandé en NSI. Tu peux avoir des feuilles imprimées avec ton code. Le jury peut te demander d'expliquer une ligne précise, de tracer l'exécution, ou d'identifier un bug hypothétique. Le code doit être commenté (une ligne de commentaire pour chaque bloc logique) et tu dois être capable d'en expliquer chaque partie sans le lire mot à mot."
  - question: "Comment expliquer la complexité algorithmique au jury sans perdre le fil ?"
    answer: "Utilise toujours un exemple numérique avant la notation O. 'Le minimax explore 35 coups possibles à chaque niveau. Sur 4 niveaux de profondeur, ça fait 35^4 = 1,5 million de positions. C'est une croissance exponentielle — O(b^d) avec b=35 et d=4.' Ensuite seulement tu montres comment alpha-bêta réduit ça. Le jury apprécie le raisonnement, pas la récitation."
  - question: "AlphaZero est-il au programme de Terminale NSI ?"
    answer: "Pas directement, mais l'apprentissage par renforcement et les réseaux de neurones sont des thèmes cohérents avec le programme. AlphaZero est un exemple spectaculaire d'apprentissage automatique — il illustre concrètement la différence entre une IA par règles explicites (minimax) et une IA par apprentissage (deep reinforcement learning). Le jury de Grand Oral valorise les exemples concrets et bien maîtrisés, même s'ils dépassent légèrement le programme."
  - question: "Quelle est la durée idéale de chaque partie de l'exposé NSI ?"
    answer: "Pour 10 minutes : introduction 1 minute (problématique + plan), partie 1 de 3 minutes (algo minimax + code), partie 2 de 3 minutes (alpha-bêta + optimisation), partie 3 de 2 minutes (AlphaZero + limites), conclusion 1 minute. Le jury interroge ensuite pendant 10 minutes. Chronomètre-toi impérativement — le jury coupe à 10 minutes."
---

> **📥 Comment utiliser ce guide ?** Imprime ce guide (Ctrl+P, A4, sans marges). Surligne en jaune le code Python et en vert les transitions. Entraîne-toi à expliquer le code à voix haute ligne par ligne — c'est l'exercice clé pour NSI.

---

## Choisir ta problématique

La problématique est ta colonne vertébrale. En NSI, elle doit montrer que tu maîtrises un concept algorithmique ancré dans le programme — récursivité, complexité, arbres, ou intelligence artificielle.

### Les 3 problématiques recommandées

**Problématique A — Arbre de décision** *(niveau accessible)*
> *"Comment un programme informatique peut-il prendre des décisions pour jouer aux échecs ?"*

**Problématique B — Optimisation algorithmique** *(niveau intermédiaire)*
> *"En quoi l'élagage alpha-bêta illustre-t-il l'optimisation d'un algorithme de recherche arborescente ?"*

**Problématique C — Intelligence artificielle** *(niveau avancé)*
> *"Pourquoi AlphaZero représente-t-il une rupture épistémologique dans l'approche par l'intelligence artificielle des jeux de stratégie ?"*

→ **Recommandation :** si tu as Maths en spécialité complémentaire, C est très différenciante. Sinon, B est le meilleur compromis entre accessibilité et profondeur.

---

## Script minuté — Problématique B (optimisation alpha-bêta)

*Les transitions rédigées sont en italique. Le code Python est dans des blocs à expliquer oralement — tu n'as pas à le lire mot à mot, mais à l'expliquer.*

---

### ⏱ 0:00–1:00 — Introduction et problématique

*"Bonjour. Je vais vous parler de la façon dont un ordinateur joue aux échecs — et plus précisément, comment il choisit son coup en un temps raisonnable.*

*Les échecs ont environ 10^120 parties possibles. Un ordinateur qui explore tout est impossible. Ma problématique : en quoi l'élagage alpha-bêta illustre-t-il l'optimisation d'un algorithme de recherche arborescente ?*

*Je développerai en trois étapes : l'algorithme minimax de base, l'élagage alpha-bêta qui le rend efficace, puis les limites de cette approche et ce qu'AlphaZero a changé.*"

---

### ⏱ 1:00–4:00 — Partie 1 : l'algorithme minimax

*"L'idée de base : modéliser le jeu comme un arbre. Chaque nœud est une position, chaque branche un coup possible. Le joueur blanc cherche à maximiser son avantage, le noir à le minimiser — d'où le nom minimax.*

Voici l'algorithme en Python :*

```python
def minimax(position, profondeur, maximise):
    # Cas de base : profondeur atteinte ou partie terminée
    if profondeur == 0 or position.est_terminee():
        return evaluer(position)   # retourne un score numérique
    
    if maximise:  # tour des Blancs : on cherche le maximum
        meilleur = -infini
        for coup in position.coups_possibles():
            position.joue(coup)
            score = minimax(position, profondeur-1, False)
            position.annule(coup)
            meilleur = max(meilleur, score)
        return meilleur
    
    else:  # tour des Noirs : on cherche le minimum
        meilleur = +infini
        for coup in position.coups_possibles():
            position.joue(coup)
            score = minimax(position, profondeur-1, True)
            position.annule(coup)
            meilleur = min(meilleur, score)
        return meilleur
```

*Trois points clés : la récursivité (la fonction s'appelle elle-même), l'alternance maximise/minimise (les deux joueurs alternent), et la fonction `evaluer()` qui attribue un score à chaque position.*

**Complexité :** avec b ≈ 35 coups possibles par position et d = 4 niveaux de profondeur, le minimax explore 35^4 ≈ 1,5 million de positions. Sur 6 niveaux : 35^6 ≈ 1,8 milliard. La croissance est exponentielle — O(b^d)."

---

### ⏱ 4:00–7:00 — Partie 2 : l'élagage alpha-bêta

*"Le problème du minimax : il explore des branches inutiles. L'élagage alpha-bêta coupe ces branches sans changer le résultat.*

L'idée : si je sais déjà qu'une branche ne peut pas améliorer ma meilleure option connue, je l'ignore.*

```python
def alpha_beta(position, profondeur, alpha, beta, maximise):
    if profondeur == 0 or position.est_terminee():
        return evaluer(position)
    
    if maximise:
        meilleur = -infini
        for coup in position.coups_possibles():
            position.joue(coup)
            score = alpha_beta(position, profondeur-1, alpha, beta, False)
            position.annule(coup)
            meilleur = max(meilleur, score)
            alpha = max(alpha, meilleur)
            if beta <= alpha:     # ← coupure bêta
                break             # cette branche ne sera jamais choisie
        return meilleur
    
    else:
        meilleur = +infini
        for coup in position.coups_possibles():
            position.joue(coup)
            score = alpha_beta(position, profondeur-1, alpha, beta, True)
            position.annule(coup)
            meilleur = min(meilleur, score)
            beta = min(beta, meilleur)
            if beta <= alpha:     # ← coupure alpha
                break             # cette branche ne sera jamais choisie
        return meilleur
```

*`alpha` = meilleur score garanti pour les Blancs. `beta` = meilleur score garanti pour les Noirs. Quand `beta ≤ alpha`, il est inutile d'explorer davantage : les deux joueurs ne choisiraient jamais cette branche.*

**Gain de complexité :** dans le meilleur cas (coups triés par ordre de qualité), alpha-bêta réduit la complexité à **O(b^(d/2))** — soit 35^2 = 1225 positions pour d=4 au lieu de 1,5 million. On passe de l'impossible au réalisable en quelques millisecondes."

---

### ⏱ 7:00–9:00 — Partie 3 : limites et rupture AlphaZero

*"L'élagage alpha-bêta est élégant, mais avec des limites structurelles.*

**Limite 1 — la fonction d'évaluation :** evaluer() est écrite par des humains. Elle encode les intuitions d'experts (valeur des pièces, contrôle du centre, sécurité du roi). Ces règles peuvent être incorrectes ou incomplètes.

**Limite 2 — la profondeur :** même avec alpha-bêta, la profondeur reste limitée à 20-30 coups sur les machines les plus puissantes. Au-delà, c'est impossible.

**La rupture d'AlphaZero (2017) :** AlphaZero n'a pas de fonction d'évaluation écrite par des humains. Il apprend à jouer en jouant contre lui-même — apprentissage par renforcement — et développe sa propre évaluation à travers un réseau de neurones. En 4 heures d'entraînement autonome, AlphaZero a battu Stockfish, le meilleur programme minimax au monde.*

*Ce n'est plus une optimisation de minimax : c'est un paradigme différent. Au lieu de chercher dans un arbre, il apprend à reconnaître des positions."

---

### ⏱ 9:00–10:00 — Conclusion

*"L'élagage alpha-bêta illustre un principe fondamental de l'algorithmique : l'optimisation ne cherche pas toutes les solutions, elle élimine intelligemment les mauvaises.*

*La complexité passe de O(b^d) à O(b^(d/2)) — une différence qui transforme l'impossible en instantané. Mais AlphaZero montre que même cette optimisation a ses limites quand la connaissance est encodée par des humains.*

*Pour aller plus loin : si les réseaux de neurones apprennent à jouer sans règles explicites, que signifie 'comprendre' un jeu ? C'est peut-être la vraie frontière entre intelligence artificielle et intelligence humaine.*"

---

## 20 Questions de jury — avec réponses rédigées

*Le jury NSI pose souvent des questions sur le code, les complexités, et les distinctions algorithmiques. Prépare-toi à tracer une exécution à la main.*

---

**Q1. Pourquoi avoir choisi les échecs pour votre Grand Oral NSI ?**
> *"Les échecs concentrent plusieurs notions clés du programme : la récursivité avec minimax, les arbres de décision, la complexité algorithmique, et plus récemment l'apprentissage automatique avec AlphaZero. C'est un cas d'étude historiquement documenté — de Deep Blue en 1997 à AlphaZero en 2017 — qui permet de voir l'évolution des paradigmes en intelligence artificielle."*

**Q2. Expliquez la récursivité dans minimax en une phrase.**
> *"Minimax est récursif parce qu'il définit la valeur d'une position à partir des valeurs de ses positions enfants — et chaque position enfant est évaluée par le même minimax, jusqu'à atteindre une profondeur limite ou une position terminale."*

**Q3. Qu'est-ce qu'un arbre de jeu ?**
> *"Un arbre de jeu est une structure de données où la racine représente la position actuelle, chaque nœud représente une position du jeu, et chaque arête représente un coup possible. Les feuilles sont soit des positions terminales (fin de partie), soit des nœuds où on atteint la profondeur limite et où la fonction d'évaluation s'applique."*

**Q4. Quelle est la différence entre un nœud MAX et un nœud MIN dans minimax ?**
> *"Un nœud MAX correspond au tour du joueur qui veut maximiser son score — typiquement les Blancs. L'algorithme y choisit le coup qui donne le score le plus élevé parmi les enfants. Un nœud MIN correspond au tour du joueur qui veut minimiser le score — les Noirs. L'alternance des nœuds MAX et MIN simule les deux joueurs qui prennent des décisions optimales à tour de rôle."*

**Q5. Calculez la complexité de minimax pour b=30 coups et d=3 niveaux.**
> *"O(b^d) = 30^3 = 27 000 positions à explorer. Avec alpha-bêta dans le meilleur cas : O(b^(d/2)) = 30^1,5 = 30 × √30 ≈ 30 × 5,5 ≈ 165 positions. Le gain est d'un facteur 163 — on passe de 27 000 à 165 évaluations."*

**Q6. Expliquez la condition `if beta <= alpha: break` dans le code alpha-bêta.**
> *"Cette condition est la coupure alpha-bêta. `alpha` est le meilleur score que les Blancs peuvent garantir sur la branche actuelle. `beta` est le meilleur score que les Noirs peuvent garantir. Si `beta ≤ alpha`, les Noirs n'accepteront jamais ce résultat — ils ont déjà une meilleure option ailleurs. Il est donc inutile d'explorer les coups restants sur cette branche : elle sera ignorée par le joueur noir quoi qu'il arrive."*

**Q7. Quelle est la différence entre la complexité dans le meilleur cas et dans le pire cas pour alpha-bêta ?**
> *"Dans le meilleur cas (coups triés du meilleur au pire), alpha-bêta atteint O(b^(d/2)) — il coupe environ la moitié des branches. Dans le pire cas (coups triés dans le mauvais ordre), il n'effectue aucune coupure et se réduit à minimax : O(b^d). En pratique, avec un tri heuristique des coups (par valeur de capture, position connue), on est entre les deux — environ O(b^(3d/4))."*

**Q8. Qu'est-ce que la fonction d'évaluation et pourquoi est-elle cruciale ?**
> *"La fonction d'évaluation attribue un score numérique à chaque position non terminale atteinte à la profondeur limite. Elle encode la connaissance humaine du jeu : valeur des pièces (dame = 9 points, tour = 5...), contrôle du centre, sécurité du roi, structure de pions. C'est le 'jugement' du programme sur la qualité d'une position. Une mauvaise fonction d'évaluation produit un joueur faible même avec un algorithme parfait — c'est la limite principale de l'approche."*

**Q9. Pourquoi dit-on que l'algorithme minimax suppose un adversaire optimal ?**
> *"Minimax suppose que l'adversaire joue toujours le meilleur coup possible — il minimise toujours. Si l'adversaire fait une erreur (joue un coup sous-optimal), minimax est toujours correct — la position résultante est encore meilleure pour nous. En revanche, minimax ne cherche pas à exploiter les erreurs de l'adversaire de façon proactive : il suppose simplement qu'elles n'arrivent pas. Cette hypothèse de jeu optimal est pessimiste mais sûre."*

**Q10. Comment Deep Blue (1997) différait-il de l'algorithme minimax pur ?**
> *"Deep Blue utilisait alpha-bêta avec des optimisations massives : une bibliothèque de débuts (ouvertures connues) pour ne pas chercher dans les 20 premiers coups, une bibliothèque de finales (positions résolues), et une extension de recherche sélective (explorer plus profondément les positions tactiquement complexes). Il évaluait 200 millions de positions par seconde sur hardware dédié. Ce n'était pas du minimax pur, mais alpha-bêta hautement optimisé avec expertise humaine encodée."*

**Q11. Qu'est-ce que l'apprentissage par renforcement qu'AlphaZero utilise ?**
> *"L'apprentissage par renforcement est un paradigme où l'agent apprend en interagissant avec son environnement et en recevant des récompenses. AlphaZero joue contre lui-même (self-play) : il reçoit +1 s'il gagne, -1 s'il perd, 0 pour une nulle. Le réseau de neurones ajuste ses paramètres pour maximiser la récompense cumulée. Après des millions de parties contre lui-même, le réseau apprend des stratégies que personne ne lui a enseignées."*

**Q12. Quelle est la structure du réseau de neurones dans AlphaZero ?**
> *"AlphaZero utilise un réseau résiduel profond (ResNet) avec deux têtes de sortie. La tête de valeur retourne un nombre entre -1 et 1 : l'estimation de qui va gagner depuis cette position. La tête de politique retourne une distribution de probabilité sur les coups possibles : lesquels méritent d'être explorés. Ces deux sorties guident une recherche Monte Carlo Tree Search (MCTS) qui remplace le minimax classique."*

**Q13. Pourquoi AlphaZero est-il plus difficile à analyser qu'un programme minimax ?**
> *"Un programme minimax est explicable : pour chaque coup choisi, on peut retracer l'arbre et voir les variations considérées. AlphaZero est une boîte noire : le réseau de neurones a des centaines de millions de paramètres, et on ne peut pas expliquer 'pourquoi' il joue un coup en termes de règles. C'est le problème général de l'explicabilité des réseaux de neurones profonds — leur performance est remarquable mais leur raisonnement est opaque."*

**Q14. Peut-on appliquer l'algorithme minimax à d'autres jeux que les échecs ?**
> *"Oui — à tout jeu à deux joueurs, information parfaite, sans hasard et à nombre fini de coups. Le morpion, les dames, le Go, le puissance 4, l'Othello. Le puissance 4 a été résolu par minimax en 1988 : les Blancs gagnent toujours avec un jeu parfait. Le morpion est trivial. Le Go a longtemps résisté (trop grand) jusqu'à AlphaGo. Les jeux avec hasard ou information cachée (poker) nécessitent des extensions du minimax."*

**Q15. Comment le tri des coups améliore-t-il alpha-bêta en pratique ?**
> *"En explorant d'abord les coups les plus prometteurs (captures, coups qui donnent un bel avantage), on maximise les chances de trouver rapidement un bon `alpha`. Plus `alpha` est élevé tôt, plus on peut couper de branches. Un bon tri transforme un alpha-bêta au pire cas en un alpha-bêta proche du meilleur cas. En pratique, les programmes modernes utilisent des heuristiques comme 'coups de tueur' (killer heuristic) et la table de transposition pour trier efficacement."*

**Q16. Qu'est-ce qu'une table de transposition en algorithmique des jeux ?**
> *"Une table de transposition est une table de hachage qui mémorise les positions déjà évaluées avec leur score. Aux échecs, la même position peut être atteinte par des séquences de coups différentes — sans table de transposition, on l'évalue plusieurs fois. La table évite ce recalcul : si la position est en mémoire, on retourne directement son score. C'est une application du principe de mémoïsation (ou programmation dynamique) à la recherche arborescente."*

**Q17. Pourquoi les bitboards accélèrent-ils les programmes d'échecs ?**
> *"Un bitboard représente l'échiquier comme un entier de 64 bits, où chaque bit correspond à une case. Les opérations sur les bits (AND, OR, XOR, décalage) sont extrêmement rapides sur les processeurs modernes — une seule instruction CPU peut tester 64 cases simultanément. La génération des coups légaux, qui doit être faite des millions de fois par seconde, bénéficie massivement de cette représentation. C'est un exemple d'optimisation bas-niveau qui change l'ordre de grandeur des performances."*

**Q18. Stockfish est-il toujours de type alpha-bêta ou a-t-il adopté des réseaux de neurones ?**
> *"Depuis Stockfish 12 (2020), Stockfish intègre NNUE — Efficiently Updatable Neural Network. C'est un réseau de neurones utilisé comme fonction d'évaluation, mais l'algorithme de recherche reste alpha-bêta. C'est une approche hybride : la structure de recherche classique avec une évaluation apprise par réseau de neurones. Résultat : Stockfish a gagné 100 à 150 points Elo d'un coup — une amélioration spectaculaire. Aujourd'hui, les deux approches (minimax+NNUE et pure NN comme Lc0) se disputent la première place."*

**Q19. Comment AlphaZero utilise-t-il Monte Carlo Tree Search ?**
> *"AlphaZero combine le réseau de neurones avec MCTS. Le réseau guide quels nœuds explorer en priorité (la tête de politique donne des probabilités sur les coups). MCTS explore ces nœuds de façon stochastique, accumule des statistiques de victoire/défaite, et retourne le coup le plus visité. Le réseau est entraîné sur les résultats de ces recherches. C'est une boucle : le réseau guide MCTS, et MCTS produit des données pour améliorer le réseau."*

**Q20. Un algorithme parfait aux échecs est-il possible en principe ?**
> *"En principe oui : le théorème de Zermelo (1913) garantit que les échecs ont un résultat optimal sous jeu parfait. Cet algorithme parfait serait un minimax à profondeur infinie — explorer tout l'arbre. En pratique, avec 10^120 feuilles, c'est physiquement impossible même pour toute la puissance de calcul de l'univers pendant toute son histoire. Les échecs ne seront jamais 'résolus' comme les dames (2007) ou le morpion — leur complexité les place hors de portée de la force brute, et peut-être pour toujours."*

---

## Fiche mémo — complexités et vocabulaire NSI à imprimer

```
╔══════════════════════════════════════════════════════════════╗
║          COMPLEXITÉS ALGORITHMIQUES — GRAND ORAL NSI         ║
╠══════════════════════════════════════════════════════════════╣
║ MINIMAX (sans optimisation)                                  ║
║   Complexité temporelle : O(b^d)                             ║
║   b = facteur de branchement (≈35 aux échecs)                ║
║   d = profondeur de recherche                                ║
║   Exemple : b=35, d=4 → 35^4 ≈ 1 500 000 positions          ║
╠══════════════════════════════════════════════════════════════╣
║ ALPHA-BÊTA (meilleur cas — coups bien triés)                 ║
║   Complexité temporelle : O(b^(d/2))                         ║
║   Exemple : b=35, d=4 → 35^2 = 1 225 positions              ║
║   Gain facteur : b^(d/2) — environ 1000x sur d=6            ║
╠══════════════════════════════════════════════════════════════╣
║ PARAMÈTRES ALPHA-BÊTA                                        ║
║   alpha : meilleur score garanti pour le maximiseur          ║
║   beta  : meilleur score garanti pour le minimiseur          ║
║   Coupure : si beta ≤ alpha → branche ignorée                ║
╠══════════════════════════════════════════════════════════════╣
║ VOCABULAIRE CLÉ                                              ║
║   Récursivité   : fonction qui s'appelle elle-même           ║
║   Élagage       : suppression de branches inutiles           ║
║   Heuristique   : règle approximative pour guider la recherche║
║   Mémoïsation   : stocker les résultats pour éviter recalcul ║
║   Transposition : même position atteinte par chemins diff.   ║
╠══════════════════════════════════════════════════════════════╣
║ COMPARAISON APPROCHES                                        ║
║   Minimax/Alpha-bêta : règles explicites, explicable         ║
║   AlphaZero/MCTS+NN  : apprentissage, boîte noire            ║
║   Stockfish NNUE     : hybride (alpha-bêta + réseau neurones) ║
╚══════════════════════════════════════════════════════════════╝
```

---

## Check-list de préparation

**J-30**
- [ ] Choisir la problématique parmi les 3 proposées
- [ ] Implémenter minimax simple en Python (même pour morpion, c'est suffisant)
- [ ] Tracer l'arbre minimax à la main pour une position à 2 niveaux (exercice essentiel)

**J-7**
- [ ] Entraînement chrono : 10 minutes exposé complet, seul (chronomètre visible)
- [ ] Entraînement avec 5 questions simulées (un proche joue le jury)
- [ ] Être capable d'expliquer chaque ligne du code sans le lire
- [ ] Revoir la fiche mémo complexités

**Veille**
- [ ] Relire la fiche mémo une fois
- [ ] Préparer les feuilles de code imprimées (à avoir sur la table)
- [ ] Dormir 8 heures — le Grand Oral est une performance cognitive

---

*Ce guide est librement utilisable et imprimable. Si d'autres lycéens préparent le même sujet, [partage-leur le lien](/fr/grand-oral/). Et bonne chance — tu as fait le travail.*
