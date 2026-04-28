---
title: "Grand oral spé NSI : les échecs comme cas d'école de l'algorithmique et de l'IA"
excerpt: "Minimax en Python, arbres de décision, format PGN, représentation bitboard, AlphaZero et réseaux de neurones : tout le programme NSI terminale incarné en 64 cases."
publishDate: "2026-04-28"
category: "science"
featured: false
featuredRank: 99
readingTime: "21 min"
pillar: "Informatique"
tags: ["grand oral", "NSI", "terminale", "algorithmique", "minimax", "Python", "AlphaZero", "intelligence artificielle", "structures de données", "baccalauréat"]
seoTitle: "Grand oral NSI : les échecs, de l'algorithmique à l'IA — plan complet"
seoDescription: "Grand oral spécialité NSI avec les échecs : minimax Python, arbres, PGN, bitboard, AlphaZero. Plan détaillé, code, exemples et questions jury pour le baccalauréat."
titleEn: "Grand Oral NSI Specialism: Chess as a Textbook for Algorithmics and AI"
excerptEn: "Minimax in Python, decision trees, PGN format, bitboard representation, AlphaZero and neural networks: the entire French Terminale NSI syllabus embodied in 64 squares."
seoTitleEn: "Grand Oral NSI: Chess from Algorithmics to AI — Full Plan"
seoDescriptionEn: "Grand oral NSI speciality with chess: minimax in Python, trees, PGN format, bitboard, AlphaZero. Detailed outline, code snippets, examples and examiner questions."
faq:
  - question: "Pourquoi les échecs sont-ils un sujet idéal pour un Grand Oral spécialité NSI ?"
    answer: "Les échecs incarnent les quatre piliers du programme NSI : les algorithmes (minimax, alpha-bêta, récursivité), les structures de données (arbres de jeu, graphes), la programmation (représentation de l'échiquier en Python, fonctions récursives), et l'intelligence artificielle (passage de Stockfish à AlphaZero). C'est l'un des rares sujets qui permet de montrer concrètement le lien entre la théorie algorithmique et une application réelle connue du jury."
  - question: "Comment coder un minimax en Python pour un Grand Oral NSI ?"
    answer: "La structure de base du minimax en Python est une fonction récursive : def minimax(pos, depth, is_max): if depth == 0: return evaluer(pos) ; coups = generer_coups(pos) ; if is_max: return max(minimax(appliquer(pos,c), depth-1, False) for c in coups) ; else: return min(minimax(appliquer(pos,c), depth-1, True) for c in coups). Cette structure met en œuvre la récursivité, la gestion de l'arbre et les fonctions d'ordre supérieur vus en terminale NSI."
  - question: "Qu'est-ce que le format PGN et comment l'utiliser en NSI ?"
    answer: "Le PGN (Portable Game Notation) est le format standard de stockage des parties d'échecs. C'est un fichier texte structuré : des métadonnées entre crochets ([Event 'Partie test'][Date '2026.04.28']) suivies de la liste des coups (1. e4 e5 2. Nf3 Nc6...). En NSI, il illustre la notion de format de données structurées, parsable en Python avec des expressions régulières ou une bibliothèque dédiée. Il peut aussi être stocké et interrogé dans une base de données SQL."
  - question: "Qu'est-ce qu'un bitboard aux échecs et pourquoi est-ce important en NSI ?"
    answer: "Un bitboard représente l'état d'un type de pièce sur l'échiquier avec un entier de 64 bits. Chaque bit correspond à une case : le bit i vaut 1 si la pièce occupe la case i, 0 sinon. Par exemple, les pions blancs en position initiale occupent les cases 8 à 15, soit l'entier 0xFF00 en hexadécimal. Les opérations sur les bitboards (ET, OU, décalage de bits) sont des opérations entières très rapides. C'est une application directe du programme NSI sur la représentation binaire et les opérateurs logiques."
  - question: "Quelle différence entre Stockfish et AlphaZero pour un Grand Oral NSI ?"
    answer: "Stockfish utilise un algorithme minimax avec élagage alpha-bêta et une fonction d'évaluation programmée par des experts humains (approche symbolique, 'top-down'). AlphaZero utilise un réseau de neurones profond entraîné uniquement par auto-apprentissage, sans connaissance humaine initiale (approche connexionniste, 'bottom-up'). Pour NSI, la différence clé est celle entre la programmation explicite (règles codées) et l'apprentissage automatique (règles découvertes par l'expérience). AlphaZero a battu Stockfish en moins de 24 heures d'entraînement en 2017."
  - question: "Quelles questions le jury peut-il poser sur les échecs en spécialité NSI ?"
    answer: "Les cinq questions les plus probables sont : (1) Quelle est la complexité temporelle du minimax ? (O(b^d), exponentielle). (2) Comment l'élagage alpha-bêta réduit-il cette complexité ? (O(b^(d/2)) dans le meilleur cas). (3) Qu'est-ce qu'une table de transposition et pourquoi est-elle utile ? (Mémoïsation des positions déjà calculées). (4) Pourquoi utilise-t-on des bitboards plutôt qu'un tableau 2D en Python pour un moteur sérieux ? (Vitesse des opérations bit à bit vs accès tableau). (5) Quelle est la différence entre apprentissage supervisé et apprentissage par renforcement dans le contexte d'AlphaZero ?"
---

Tu as la spécialité NSI en terminale. Et tu cherches un sujet de Grand Oral qui te permette de montrer ce que tu sais vraiment faire : coder, analyser, comprendre comment les machines pensent.

Les échecs sont ce sujet. Pas pour leur aspect culturel ou philosophique — pour leur structure informatique. Les échecs sont l'un des problèmes les plus étudiés de toute l'histoire de l'informatique. Les premiers programmes de jeu d'échecs datent de [Alan Turing](https://fr.wikipedia.org/wiki/Alan_Turing) (1950) et [Claude Shannon](https://fr.wikipedia.org/wiki/Claude_Shannon) (1950). Chaque concept fondamental du programme NSI — récursivité, arbres, structures de données, complexité, intelligence artificielle — y trouve son application la plus directe.

Ce que cet article te donne : du code Python commentable devant le jury, des structures de données concrètes, la progression de Stockfish à AlphaZero comme arc narratif, et un plan minuté pour vingt minutes d'exposé.

> **L'essentiel en 5 points :**
> - Le minimax est le cas concret de récursivité le plus pur qui soit, codable en 10 lignes Python
> - Un échiquier peut être représenté comme un tableau 2D (simple) ou un entier 64 bits (bitboard, avancé)
> - Le format PGN illustre directement la notion de données structurées parsables
> - L'élagage alpha-bêta est une optimisation qui réduit O(b^d) à O(b^(d/2)) — un argument de complexité parfait pour le jury
> - AlphaZero vs Stockfish = apprentissage automatique vs programmation explicite : la distinction centrale de l'IA au programme NSI

## Algorithmes et structures de données

### L'algorithme minimax : récursivité pure

Le programme NSI de terminale inclut la récursivité comme concept fondamental. Le **minimax** est l'illustration la plus propre qui existe : une fonction qui s'appelle elle-même, sur un problème naturellement récursif (explorer un arbre de jeu).

Voici la structure en pseudo-code Python que tu peux expliquer ligne par ligne devant le jury :

```python
def minimax(position, profondeur, est_maximiseur):
    # Cas de base : profondeur atteinte ou partie terminée
    if profondeur == 0 or partie_terminee(position):
        return evaluer(position)
    
    coups = generer_coups_legaux(position)
    
    if est_maximiseur:
        meilleur = float('-inf')
        for coup in coups:
            nouvelle_pos = appliquer_coup(position, coup)
            valeur = minimax(nouvelle_pos, profondeur - 1, False)
            meilleur = max(meilleur, valeur)
        return meilleur
    else:
        meilleur = float('+inf')
        for coup in coups:
            nouvelle_pos = appliquer_coup(position, coup)
            valeur = minimax(nouvelle_pos, profondeur - 1, True)
            meilleur = min(meilleur, valeur)
        return meilleur
```

Ce code met en œuvre exactement les notions du programme NSI :
- **Récursivité** : l'appel `minimax(nouvelle_pos, profondeur - 1, ...)` à l'intérieur de la fonction
- **Cas de base** : la condition `profondeur == 0` qui arrête la récursion
- **Structure d'arbre** : l'exploration des fils d'un nœud avant de retourner la valeur au parent
- **Fonctions d'ordre supérieur** : `max()` et `min()` appliqués à un générateur

La **complexité temporelle** de cet algorithme est **O(b^d)**, où b est le facteur de branchement moyen (~35 aux échecs) et d la profondeur. Pour d = 4 : 35^4 ≈ 1,5 million d'appels récursifs. Pour d = 6 : 35^6 ≈ 1,8 milliard. La croissance exponentielle est le premier sujet de discussion que le jury peut ouvrir, et tu dois être capable de la justifier.

### L'élagage alpha-bêta : optimisation algorithmique

L'élagage **alpha-bêta** est une optimisation du minimax qui évite d'explorer des branches dont on peut prouver qu'elles ne modifieront pas le résultat final. En NSI, c'est un exemple d'**algorithme d'élagage** (*pruning*) — une technique générale d'optimisation.

L'idée : on maintient deux bornes, **alpha** (le meilleur score que le joueur maximisant peut garantir) et **beta** (le meilleur score que le joueur minimisant peut garantir). Si à un nœud on découvre que la valeur sera forcément pire que ce que l'on peut déjà garantir, on abandonne l'exploration de ce sous-arbre.

```python
def alpha_beta(position, profondeur, alpha, beta, est_maximiseur):
    if profondeur == 0 or partie_terminee(position):
        return evaluer(position)
    
    coups = generer_coups_legaux(position)
    
    if est_maximiseur:
        for coup in coups:
            valeur = alpha_beta(appliquer_coup(position, coup),
                                profondeur - 1, alpha, beta, False)
            alpha = max(alpha, valeur)
            if beta <= alpha:
                break  # Coupure beta : inutile d'explorer plus
        return alpha
    else:
        for coup in coups:
            valeur = alpha_beta(appliquer_coup(position, coup),
                                profondeur - 1, alpha, beta, True)
            beta = min(beta, valeur)
            if beta <= alpha:
                break  # Coupure alpha : inutile d'explorer plus
        return beta
```

La ligne `break` — la **coupure** — est le cœur de l'optimisation. Dans le meilleur cas (si les coups sont triés du meilleur au moins bon), l'alpha-bêta réduit la complexité à **O(b^(d/2))** : on explore la racine carrée du nombre de nœuds du minimax naïf. Pour d = 6, on passe de 1,8 milliard à ~42 000 nœuds — un gain de quatre ordres de grandeur.

Pour la présentation devant le jury, tu peux dessiner un petit arbre à 3 niveaux et montrer en direct quelle branche est coupée et pourquoi.

### Les arbres comme structure de données

Le programme NSI de terminale inclut les **arbres binaires** : définition, parcours (préfixe, infixe, suffixe), hauteur. L'arbre des coups aux échecs est un **arbre n-aire** (chaque nœud a jusqu'à 35 fils), mais le même vocabulaire s'applique.

Points importants pour le jury :
- La **racine** est la position initiale
- Les **nœuds internes** sont les positions en cours de partie
- Les **feuilles** sont les positions finales (mat, nulle, abandon) ou les positions à la profondeur maximale d'exploration
- La **hauteur** de l'arbre est le nombre de coups restant à explorer
- Un **parcours en profondeur** (DFS) est ce que le minimax effectue naturellement via la pile d'appels récursifs

La différence avec un arbre binaire de recherche (vu en cours) : dans un arbre des coups, on ne cherche pas une valeur, on **propage des scores** de bas en haut. C'est ce qu'on appelle la **rétropropagation des valeurs**, un concept qui réapparaît dans les réseaux de neurones (backpropagation).

## Programmation Python : représenter l'échiquier

### Tableau 2D : la représentation naïve

La représentation la plus directe d'un échiquier en Python est un tableau bidimensionnel 8×8 :

```python
# Représentation de l'échiquier en début de partie
# P=pion, T=tour, C=cavalier, F=fou, D=dame, R=roi
# Majuscule = blanc, minuscule = noir

echiquier = [
    ['t', 'c', 'f', 'd', 'r', 'f', 'c', 't'],  # rangée 8 (noirs)
    ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],  # rangée 7
    ['.', '.', '.', '.', '.', '.', '.', '.'],   # rangée 6
    ['.', '.', '.', '.', '.', '.', '.', '.'],   # rangée 5
    ['.', '.', '.', '.', '.', '.', '.', '.'],   # rangée 4
    ['.', '.', '.', '.', '.', '.', '.', '.'],   # rangée 3
    ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],  # rangée 2 (blancs)
    ['T', 'C', 'F', 'D', 'R', 'F', 'C', 'T'],  # rangée 1
]

# Accès à la case e4 (colonne 4, rangée 3 dans notre index 0-7)
def get_piece(echiquier, col, rang):
    return echiquier[7 - rang][col]
```

Cette représentation est simple à comprendre et à présenter. Elle permet d'illustrer les notions de **tableau 2D**, d'**indexation** et de **slicing** Python. Son inconvénient : les opérations sur les cases (vérifier si une pièce est attaquée, générer les coups légaux) nécessitent des boucles imbriquées — ce qui est lent pour un vrai moteur.

### Bitboard : la représentation efficace

La représentation **bitboard** est utilisée dans tous les moteurs professionnels (Stockfish, Leela Chess Zero). Elle illustre directement le programme NSI sur la **représentation binaire** et les **opérateurs logiques bit à bit**.

Principe : chaque type de pièce (pions blancs, tours noires, etc.) est représenté par un **entier de 64 bits**. Le bit *i* vaut 1 si la pièce occupe la case *i* (cases numérotées de 0 à 63, de a1 à h8).

```python
# En Python, les entiers ont précision arbitraire
# On peut simuler un bitboard à 64 bits

# Position initiale : pions blancs sur les cases 8 à 15
# Cases 8-15 = bits 8 à 15 activés
pions_blancs = 0b0000000000000000000000000000000000000000000000001111111100000000
# Soit en hexadécimal :
pions_blancs = 0xFF00  # 65280 en décimal

# Vérifier si un pion blanc est sur la case e2 (case 12 dans notre numérotation)
case_e2 = 1 << 12  # 0b0001000000000000
pion_sur_e2 = (pions_blancs & case_e2) != 0
print(pion_sur_e2)  # True

# Déplacer un pion de e2 à e4 (case 12 → case 28)
pions_blancs = (pions_blancs & ~case_e2) | (1 << 28)
```

Ce code mobilise les **opérateurs bit à bit** Python : `&` (ET), `|` (OU), `~` (NON), `<<` (décalage gauche). Ces opérateurs sont au programme NSI et sont ici directement utiles. Un moteur de jeu peut calculer tous les coups légaux d'une pièce avec quelques opérations bit à bit en microsecondes, alors qu'un tableau 2D nécessite des boucles.

## Intelligence artificielle : de Stockfish à AlphaZero

### Stockfish : l'approche classique symbolique

[Stockfish](https://fr.wikipedia.org/wiki/Stockfish_(logiciel)) est un moteur d'échecs open source, l'un des plus forts au monde. Il repose sur l'algorithme alpha-bêta avec des optimisations massives :

- **Table de transposition** : une table de hachage qui stocke les positions déjà évaluées pour éviter de les recalculer (mémoïsation — technique vue en NSI)
- **Iterative deepening** : on explore d'abord jusqu'à profondeur 1, puis 2, puis 3... pour obtenir rapidement une bonne réponse même si le temps vient à manquer
- **Move ordering** : les coups sont triés avant exploration (captures d'abord) pour maximiser les coupures alpha-bêta

La **table de transposition** est un exemple direct de structure de données clé-valeur (dictionnaire en Python) utilisée pour la mémoïsation, un concept du programme NSI :

```python
# Table de transposition simplifiée
transposition_table = {}

def minimax_memo(position, profondeur, est_max):
    # Hasher la position pour en faire une clé
    cle = (hash(str(position)), profondeur, est_max)
    
    if cle in transposition_table:
        return transposition_table[cle]  # Résultat déjà calculé
    
    # ... calcul normal du minimax ...
    resultat = ...
    
    transposition_table[cle] = resultat  # Stocker pour réutilisation
    return resultat
```

Le concept est celui de la **programmation dynamique** : plutôt que de recalculer des sous-problèmes identiques, on stocke leurs solutions. Les échecs ont l'avantage de produire des positions identiques par des séquences de coups différentes (*transpositions*), ce qui rend la mémoïsation particulièrement efficace.

### AlphaZero : l'approche par apprentissage

En 2017, [DeepMind](https://fr.wikipedia.org/wiki/DeepMind) a publié [AlphaZero](https://fr.wikipedia.org/wiki/AlphaZero), un programme radicalement différent de Stockfish. Pour NSI, la distinction fondamentale est la suivante :

| | **Stockfish** | **AlphaZero** |
|---|---|---|
| Approche | Programmation explicite | Apprentissage par renforcement |
| Évaluation | Formule codée par des experts | Réseau de neurones appris |
| Connaissance humaine | Oui (ouvertures, stratégie) | Non (règles uniquement) |
| Entraînement | Aucun | 4 heures de self-play |
| Résultat vs Stockfish | — | 28 victoires, 0 défaites (en 2017, 100 parties) |

AlphaZero utilise deux réseaux de neurones simultanément :
1. **Le réseau de valeur** (*value network*) : donne une évaluation numérique de la position (similaire à la fonction d'évaluation de Stockfish, mais apprise)
2. **Le réseau de politique** (*policy network*) : donne une distribution de probabilité sur les coups légaux (quels coups explorer en priorité)

Ces deux réseaux guident la **Monte Carlo Tree Search (MCTS)** : au lieu d'explorer l'arbre de manière uniforme, MCTS concentre les ressources sur les coups que le réseau de politique juge prometteurs, et corrige cette estimation grâce aux résultats des simulations.

Pour NSI, l'argument clé est celui du **paradigme** : Stockfish dit *explicitement* à la machine ce qui est une bonne position. AlphaZero *apprend* ce qu'est une bonne position. Le premier paradigme est celui de la **programmation impérative**, le second celui de **l'apprentissage automatique** — tous deux au programme NSI.

### Machine learning vs algorithmes classiques : le débat central

Le programme NSI de terminale inclut des **notions d'intelligence artificielle** : apprentissage supervisé, apprentissage non supervisé, réseaux de neurones. Les échecs permettent d'illustrer la distinction entre ces approches.

**Apprentissage supervisé** (Stockfish amélioré par deep learning, ou Leela Chess Zero en mode training) : on fournit des millions de positions annotées (position → meilleur coup), et le réseau apprend à reproduire ces annotations. C'est comme apprendre à résoudre des exercices à partir de corrigés.

**Apprentissage par renforcement** (AlphaZero) : on ne fournit que les règles du jeu et un signal de récompense (gagner = +1, perdre = -1). Le programme joue contre lui-même, améliore sa stratégie en fonction des résultats, sans jamais voir de partie humaine. C'est comme apprendre à jouer sans professeur, uniquement par l'expérience.

Cette distinction est l'une des questions les plus probables du jury sur un sujet IA/NSI.

## Données et bases de données

### Le format PGN : données structurées

Le **PGN** (*Portable Game Notation*) est le format standard de stockage des parties d'échecs. Un fichier PGN contient des **métadonnées structurées** entre crochets, puis la liste des coups :

```
[Event "World Chess Championship 1997"]
[Date "1997.05.03"]
[White "Deep Blue"]
[Black "Kasparov, G"]
[Result "1-0"]
[WhiteElo "?"]
[BlackElo "2795"]

1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 4. Ba4 Nf6 5. O-O Be7 6. Re1 b5 7. Bb3 d6
8. c3 O-O 9. h3 Nb8 10. d4 Nbd7 ... 1-0
```

Pour NSI, ce format illustre plusieurs notions :
- **Format de données structurées** : les métadonnées respectent un schéma prévisible (clé entre crochets)
- **Parsage** : on peut extraire les informations avec des expressions régulières ou un module Python (`chess` library)
- **Encodage** : la notation des coups (e4, Nf3, O-O) est un langage formel avec sa propre grammaire

Un **parseur PGN simple** en Python utilise les regex :

```python
import re

def extraire_metadata(pgn_text):
    """Extrait les métadonnées d'une partie PGN."""
    pattern = r'\[(\w+)\s+"([^"]+)"\]'
    return dict(re.findall(pattern, pgn_text))

pgn = '[Event "Test"][Date "2026.04.28"][White "Alice"][Black "Bob"]'
metadata = extraire_metadata(pgn)
# {'Event': 'Test', 'Date': '2026.04.28', 'White': 'Alice', 'Black': 'Bob'}
```

### SQL sur une base de parties

[Lichess](https://lichess.org) publie une **base de données publique** de plus de 3 milliards de parties au format PGN. Cette base est un exemple parfait de **grandes données** (*big data*) pour NSI. On peut imaginer une base SQL simplifiée :

```sql
-- Schéma simplifié d'une base de parties d'échecs
CREATE TABLE parties (
    id INTEGER PRIMARY KEY,
    date DATE,
    joueur_blanc VARCHAR(50),
    joueur_noir VARCHAR(50),
    elo_blanc INTEGER,
    elo_noir INTEGER,
    ouverture VARCHAR(10),   -- Code ECO (ex: "C50" pour l'Italienne)
    resultat CHAR(3),        -- "1-0", "0-1" ou "1/2"
    nb_coups INTEGER
);

-- Requête : taux de victoire des Blancs par ouverture
SELECT 
    ouverture,
    COUNT(*) AS nb_parties,
    ROUND(100.0 * SUM(CASE WHEN resultat = '1-0' THEN 1 ELSE 0 END) / COUNT(*), 1) AS pct_blanc
FROM parties
GROUP BY ouverture
ORDER BY nb_parties DESC
LIMIT 10;
```

Cette requête SQL illustre les notions NSI de **bases de données relationnelles**, d'**agrégation** (COUNT, SUM), de **filtrage** (WHERE, CASE), et de **tri** (ORDER BY). C'est un exemple concret et calculable.

### Représentation numérique et compression

Pour stocker efficacement une position d'échecs, les moteurs utilisent le **hachage de Zobrist** : on associe à chaque (pièce, case) un entier aléatoire de 64 bits, et la valeur de hachage de la position entière est le XOR de tous ces entiers. Modifier un coup revient à faire deux opérations XOR (retirer la pièce de sa case, la placer sur la nouvelle case).

```python
import random

# Générer les tables de Zobrist
ZOBRIST_TABLE = {}
pieces = ['P', 'p', 'T', 't', 'C', 'c', 'F', 'f', 'D', 'd', 'R', 'r']
for piece in pieces:
    for case in range(64):
        ZOBRIST_TABLE[(piece, case)] = random.getrandbits(64)

def calculer_hash(echiquier_liste):
    """Calcule le hash Zobrist d'une position."""
    h = 0
    for case, piece in enumerate(echiquier_liste):
        if piece != '.':
            h ^= ZOBRIST_TABLE[(piece, case)]
    return h
```

Ce code illustre les notions NSI d'**opérateurs XOR**, de **tables de hachage**, et de **collision de hachage** (deux positions différentes pouvant avoir le même hash).

## Structurer le Grand Oral : minutage précis

**Introduction (3 min)** : accroche sur l'histoire de l'IA et des échecs (Turing 1950 → Deep Blue 1997 → AlphaZero 2017), problématique, plan.

**Partie I — Algorithmes (7 min)** : minimax (code ligne par ligne, 3 min), alpha-bêta (optimisation, coupure, complexité O(b^(d/2)), 2 min), table de transposition comme mémoïsation (2 min).

**Partie II — Structures de données et représentation (5 min)** : tableau 2D vs bitboard (2 min), format PGN comme données structurées (2 min), hachage de Zobrist (1 min).

**Partie III — IA et apprentissage (5 min)** : Stockfish vs AlphaZero (tableau comparatif, 2 min), apprentissage supervisé vs renforcement (2 min), portée : AlphaZero a ensuite résolu le Go et le shogi avec les mêmes principes (1 min).

**Conclusion (2 min)** : les échecs ont permis à l'informatique de passer de l'algorithme explicite à l'apprentissage implicite. Ce glissement définit l'IA moderne. Ouverture : quelle sera la prochaine frontière après le jeu — la médecine ? La physique fondamentale ?

## Anticiper les questions du jury

**1. « Quelle est la complexité du minimax avec élagage ? »**
Dans le meilleur cas (coups triés parfaitement) : O(b^(d/2)). Dans le pire cas (coups dans le mauvais ordre) : O(b^d). En pratique, les moteurs obtiennent quelque chose entre les deux, soit O(b^(3d/4)) environ.

**2. « Qu'est-ce qu'une table de transposition et pourquoi est-ce nécessaire aux échecs ? »**
C'est un dictionnaire (clé = hash de la position, valeur = score et profondeur déjà calculés). Nécessaire car la même position peut être atteinte par plusieurs séquences de coups différentes (*transpositions*). Sans elle, on recalculerait inutilement la même position des dizaines de fois.

**3. « AlphaZero a-t-il besoin de plus ou moins de calcul que Stockfish ? »**
AlphaZero évalue environ 60 000 positions par seconde, contre 200 millions pour Stockfish. AlphaZero est beaucoup plus lent en termes de positions évaluées, mais son réseau de neurones lui permet de sélectionner les branches prometteuses avec une précision telle qu'il n'a pas besoin d'en explorer autant.

**4. « Pourquoi dit-on que les bitboards sont plus efficaces ? »**
Parce que les opérations bit à bit (AND, OR, NOT, shift) sont des opérations matérielles effectuées en un seul cycle CPU, quelle que soit leur taille (sur un processeur 64 bits). Générer tous les coups légaux d'une tour avec des bitboards prend 3 ou 4 opérations logiques ; avec un tableau 2D, il faut 4 boucles imbriquées.

**5. « En quoi AlphaZero est-il un exemple d'apprentissage non supervisé ? »**
Précision importante : AlphaZero est de l'**apprentissage par renforcement**, pas non supervisé. Il reçoit un signal de récompense (victoire/défaite). L'apprentissage non supervisé serait de regrouper des positions sans étiquettes. Cette nuance montre que tu maîtrises la taxonomie de l'IA.

---

### Sources et références

- **Shannon, C. E. (1950).** [*Programming a Computer for Playing Chess.*](https://www.cs.mcgill.ca/~dprecup/courses/AI/Materials/shannon1950.pdf) *Philosophical Magazine*, 41(314). (Fondation de l'algorithme minimax appliqué aux échecs.)
- **Silver, D., et al. (DeepMind, 2018).** [*A general reinforcement learning algorithm that masters chess, shogi, and Go.*](https://www.science.org/doi/10.1126/science.aar6404) *Science*, 362(6419). (AlphaZero : apprentissage par renforcement et MCTS.)
- **Knuth, D. & Moore, R. (1975).** [*An Analysis of Alpha-Beta Pruning.*](https://www.sciencedirect.com/science/article/pii/0004370275900193) *Artificial Intelligence*, 6(4), 293–326. (Analyse formelle de la complexité de l'élagage alpha-bêta.)
- **Zobrist, A. L. (1970).** *A New Hashing Method with Application for Game Playing.* ICCA Journal. (Invention du hachage de Zobrist pour les tables de transposition.)
- **Documentation Stockfish.** [*Stockfish Chess Engine — Source code.*](https://github.com/official-stockfish/Stockfish) GitHub. (Code source du moteur open source, référence pour l'implémentation réelle.)
- **Lichess Open Database.** [*lichess.org/database*](https://database.lichess.org). (Base de données publique de parties d'échecs au format PGN, utilisable pour les exemples SQL.)
