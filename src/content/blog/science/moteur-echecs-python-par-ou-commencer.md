---
title: "Programmer un moteur d'échecs en Python : par où commencer"
excerpt: >-
  Un moteur d'échecs n'est pas le site sur lequel tu joues, ni la barre d'évaluation que tu regardes.
  C'est un programme en ligne de commande de quelques centaines de lignes. Premier article d'une série
  qui en construit un de zéro, avec une vérification objective à chaque étape.
publishDate: "2027-06-01"
category: science
featured: false
featuredRank: 99
readingTime: 16 min
pillar: Intelligence artificielle
tags:
  - Python
  - moteur d'échecs
  - programmation
  - UCI
  - Stockfish
  - FEN
  - tutoriel
  - informatique
seoTitle: "Programmer un moteur d'échecs en Python : par où commencer"
seoDescription: >-
  Comment fonctionne un moteur d'échecs, et comment en écrire un en Python sans aucune bibliothèque.
  Installation, protocole UCI, lecture de FEN : le premier article d'une série de 12.
keyTakeaways:
  - "Un moteur d'échecs est un programme sans interface : il lit des ordres texte sur son entrée standard et répond sur sa sortie standard."
  - "Il tient en quatre organes : représentation de la position, génération des coups légaux, évaluation, recherche."
  - Le protocole UCI est ce qui relie ces quatre organes à n'importe quelle interface graphique. C'est une trentaine de lignes à écrire.
  - Python est un mauvais choix de performance (environ mille fois plus lent que Stockfish) et un excellent choix pédagogique.
  - "Aucune bibliothèque dans cette série : ni python-chess, ni rien. Stockfish sert uniquement d'étalon de mesure."
faq:
  - question: "Faut-il être bon aux échecs pour programmer un moteur ?"
    answer: >-
      Non, et c'est même contre-intuitif : les compétences requises sont surtout algorithmiques. Il faut
      connaître les <strong>règles complètes</strong> du jeu, y compris les cas rares (prise en passant,
      roque interdit à travers une case attaquée, promotion sous-optimale, nulle par répétition), parce que
      ce sont exactement ceux que ton code oubliera. En revanche, savoir jouer une Sicilienne ne sert à rien.
      Beaucoup d'auteurs de moteurs sont des programmeurs classés autour de 1 500 Elo.
  - question: "Pourquoi ne pas utiliser la bibliothèque python-chess ?"
    answer: >-
      Parce qu'elle fait déjà tout ce que la série apprend à faire. <code>python-chess</code> gère la
      représentation de l'échiquier, la génération des coups légaux, la lecture de FEN et de PGN, et le
      dialogue UCI. L'utiliser transformerait la série en tutoriel d'API : on apprendrait des noms de
      méthodes, pas le fonctionnement d'un moteur. Elle reste un excellent outil pour un projet réel,
      simplement pas pour celui-ci.
  - question: "Un moteur écrit en Python peut-il être fort ?"
    answer: >-
      Fort pour un humain, oui. Fort face à Stockfish, non. Python est environ mille fois plus lent qu'un
      moteur en C++ pour la tâche critique (générer et jouer des coups), ce qui coûte à peu près
      <strong>quatre à cinq niveaux de profondeur</strong> de recherche à temps égal. Un moteur Python
      soigné atteint le niveau d'un bon joueur de club. C'est très largement suffisant pour battre son
      auteur, ce qui est le vrai objectif.
  - question: "Combien de lignes de code fait un moteur d'échecs minimal ?"
    answer: >-
      Un moteur qui joue légalement, évalue une position et cherche à quelques coups tient en
      <strong>400 à 600 lignes de Python</strong>. La génération des coups en occupe à elle seule près de
      la moitié, et c'est là que se logent la quasi-totalité des bugs. À titre de comparaison, Stockfish
      dépasse les 60 000 lignes de C++, mais l'essentiel de ce volume sert à gagner les derniers points
      Elo, pas à jouer correctement.
  - question: "Qu'est-ce que le protocole UCI exactement ?"
    answer: >-
      <em>Universal Chess Interface</em>, publié par Stefan Meyer-Kahlen en 2000. C'est une convention de
      dialogue en texte brut entre un moteur et une interface graphique : l'interface envoie
      <code>position</code> puis <code>go</code>, le moteur répond par des lignes <code>info</code> puis
      une ligne <code>bestmove</code>. Comme c'est du texte sur l'entrée et la sortie standard, n'importe
      quel langage capable d'écrire sur la console peut parler UCI, Python compris.
---

Tu as sans doute déjà ouvert le dépôt de Stockfish, un jour, par curiosité. Soixante mille lignes de C++, des fichiers qui s'appellent `bitboard.cpp` et `nnue_architecture.h`, des tableaux de constantes magiques sur lesquelles aucun commentaire ne t'explique d'où elles sortent. Et tu as refermé l'onglet.

C'est dommage, parce que le malentendu est là dès le départ : ce que tu as ouvert n'est pas un moteur d'échecs. C'est un moteur d'échecs après vingt ans d'optimisation par plusieurs centaines de contributeurs. Le moteur lui-même, l'objet conceptuel, tient en quatre idées et quelques centaines de lignes.

Cette série les construit une par une. Douze articles, du fichier vide jusqu'à un programme que tu pourras charger dans une vraie interface d'échecs et affronter. Avec une règle qui la distingue de la plupart des tutoriels : **à la fin de chaque article, tu disposes d'un moyen objectif de savoir si ton code est juste**. Pas « ça a l'air de marcher ». Un chiffre, comparé à une valeur de référence publiée.

Ce premier article ne code presque rien. Il sert à comprendre ce qu'on va construire, à installer l'atelier, et à vérifier que tout tourne.

## Un moteur d'échecs, ce n'est pas ce que tu crois

Quand tu analyses une partie sur Lichess ou Chess.com, tu vois un échiquier, une barre d'évaluation qui penche, une liste de coups candidats. Rien de tout cela n'est le moteur. Ce sont des pixels dessinés par ton navigateur.

Le moteur, lui, est un programme sans aucune interface. Il ne sait pas ce qu'est un écran. Il lit des lignes de texte sur son entrée standard, et il écrit des lignes de texte sur sa sortie standard. C'est tout. Tu peux le vérifier en trente secondes : télécharge Stockfish, lance-le dans un terminal, et tape directement.

```text
$ ./stockfish
Stockfish 18 by the Stockfish developers (see AUTHORS file)
uci
id name Stockfish 18
id author the Stockfish developers (see AUTHORS file)

option name Debug Log File type string default <empty>
...
uciok
position startpos
go movetime 1000
info depth 20 seldepth 32 multipv 1 score cp 36 nodes 701669 nps 701669 time 1000 pv e2e4 e7e5
bestmove e2e4 ponder e7e5
```

Voilà un moteur d'échecs dans son état naturel. Tu lui as dit « voici la position de départ, réfléchis une seconde », il a répondu « je joue e4, et je m'attends à e5 ». La barre d'évaluation que tu connais, c'est juste le `score cp 36` de cette ligne, dessiné joliment : 36 centièmes de pion d'avance pour les Blancs.

Cette séparation stricte est ce qui rend le projet réalisable. Tu n'as **aucune interface graphique à écrire**. Tu écris un programme qui parle ce dialecte, et toutes les interfaces existantes savent déjà l'utiliser.

## Les quatre organes

Un moteur d'échecs, quel qu'il soit, fait quatre choses. Rien de plus.

**1. Représenter la position.** Où sont les pièces, à qui le trait, quels roques restent possibles, une prise en passant est-elle disponible, combien de demi-coups depuis la dernière prise. C'est le squelette : tout le reste s'y appuie, et un choix médiocre ici plombe définitivement la vitesse du moteur.

**2. Générer les coups légaux.** À partir d'une position, produire la liste exhaustive des coups autorisés. Exhaustive et exacte : ni un de trop, ni un de moins. C'est de très loin la partie la plus pénible, la moins spectaculaire, et celle qui contient 90 % des bugs d'un moteur débutant. Les règles bizarres des échecs sont toutes là : le roque qui ne peut pas traverser une case attaquée, la prise en passant qui n'est disponible qu'un seul coup, la promotion en cavalier, le clouage absolu qui interdit de bouger une pièce.

**3. Évaluer une position.** Répondre à la question « qui est mieux, et de combien ? » sans jouer un seul coup de plus. C'est une heuristique, jamais une vérité : le moteur compte le matériel, regarde où sont les pièces, et rend un nombre.

**4. Chercher.** Explorer l'arbre des coups possibles, en supposant que l'adversaire joue bien, pour choisir le coup qui mène à la meilleure position atteignable. C'est l'algorithme [minimax](/fr/blog/minimax-aux-echecs/), et tout ce qui a été inventé depuis consiste à en explorer une fraction minuscule sans perdre le bon coup en route.

À ces quatre organes s'ajoute une plomberie : le protocole UCI, qui les relie au monde extérieur. Une trentaine de lignes, en dernier.

Le découpage de la série suit exactement cet ordre.

| Phase | Articles | Ce qu'on construit |
|---|---|---|
| 1 | 1 à 4 | La représentation et la génération des coups, prouvée juste |
| 2 | 5 à 8 | L'évaluation et la recherche : le moteur joue vraiment |
| 3 | 9 à 11 | La vitesse : chercher plus profond dans le même temps |
| 4 | 12 | UCI, et la mesure honnête de la force obtenue |

Le plan complet, article par article, est sur la [page de la série](/fr/series/moteur-python/).

## Pourquoi Python est le pire choix, et pourquoi on le prend quand même

Autant le dire tout de suite, avec des chiffres plutôt qu'avec des impressions.

La tâche la plus fréquente d'un moteur est de générer les coups légaux d'une position et de les jouer. On mesure cette vitesse avec `perft`, un compteur qui énumère toutes les parties possibles jusqu'à une profondeur donnée. Depuis la position de départ, à six demi-coups, il y a exactement 119 060 324 positions. Stockfish les parcourt sur ma machine (un ordinateur portable, AMD Ryzen 7 5700U) en 1,60 seconde. Environ **74 millions de coups générés par seconde**.

Un moteur Python soigné se situe autour de cent mille. Trois ordres de grandeur en dessous.

Ce facteur mille se paie en profondeur de recherche. Le facteur de branchement moyen aux échecs est d'une trentaine de coups, ramené à environ 5 ou 6 après un bon élagage : chaque niveau de profondeur supplémentaire coûte donc grossièrement un facteur 5. Perdre un facteur 1 000, c'est perdre à peu près **quatre niveaux et demi**. Là où un moteur C++ voit à quinze coups, le tien verra à dix.

Alors pourquoi Python ?

Parce que l'objectif n'est pas de battre Stockfish. Personne ne bat Stockfish, y compris les gens qui écrivent des moteurs en C++ depuis quinze ans. L'objectif est de comprendre, et Python a une propriété que le C++ n'a pas : **le code ressemble à l'idée**. Une fonction de recherche alpha-bêta en Python tient en douze lignes qu'on peut lire à voix haute. La même en C++ optimisé est illisible pour qui n'a pas déjà compris l'algorithme.

Et le seuil réel est plus bas que tu ne le crois. Un moteur qui voit à dix demi-coups avec une évaluation correcte joue déjà mieux que la quasi-totalité des joueurs de club. Il battra son auteur, ce qui est une expérience étrangement désagréable et le vrai but de l'exercice.

## L'atelier : trois choses à installer, dont deux que tu as déjà

### Python 3.10 ou plus récent

Rien d'autre. **Aucune bibliothèque externe ne sera installée dans toute la série.** Pas de `pip install`, pas d'environnement virtuel, pas de `requirements.txt`. Tout le moteur tient en bibliothèque standard.

Ce n'est pas du purisme. Il existe une excellente bibliothèque d'échecs en Python, `python-chess`, qui fait très bien son travail. Le problème est qu'elle fait exactement ce que la série cherche à t'apprendre : elle représente l'échiquier, génère les coups légaux, lit les FEN, parle UCI. L'utiliser reviendrait à écrire un tutoriel sur la façon d'appeler `board.legal_moves`. Tu saurais utiliser une API, pas comment fonctionne un moteur.

Elle reste le bon choix pour un projet réel. Simplement pas pour celui-ci.

### Stockfish, comme étalon et rien d'autre

Stockfish ne fera jamais partie de ton moteur. Il sert d'**appareil de mesure**, à trois titres :

- il calcule les valeurs de référence de `perft`, avec lesquelles tu prouveras que ta génération de coups est juste (article 4) ;
- il donne une évaluation de référence, à laquelle comparer la tienne (article 6) ;
- il sert d'adversaire calibré, qu'on peut brider par paliers, pour estimer l'Elo de ton moteur (article 12).

Il se télécharge sur [stockfishchess.org](https://stockfishchess.org/download/). Les chiffres publiés dans cette série viennent de **Stockfish 18**, sorti en janvier 2026. Une fois décompressé, note le chemin du binaire et mets-le dans une variable d'environnement, on s'en servira tout au long :

```sh
export STOCKFISH=/chemin/vers/stockfish
```

### Un éditeur et un terminal

Ceux que tu as déjà. Il n'y a pas d'interface graphique à installer avant l'article 12.

## Premier programme : afficher une position

Commençons par le plus modeste des programmes utiles : lire une position au format FEN et la dessiner.

La FEN (*Forsyth-Edwards Notation*) est la façon standard d'écrire une position sur une seule ligne. La position de départ s'écrit :

```text
rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1
```

Six champs séparés par des espaces. Le premier décrit les pièces, rangée par rangée en partant de la 8e : les lettres sont les pièces (majuscules pour les Blancs), les chiffres comptent les cases vides consécutives, les barres obliques séparent les rangées. Les cinq autres champs donnent le trait (`w`), les roques encore possibles (`KQkq`), la case de prise en passant (`-` s'il n'y en a pas), le compteur de la règle des cinquante coups (`0`) et le numéro du coup (`1`).

Le décodage tient en une trentaine de lignes :

```python
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
```

Note la quantité de vérifications pour trente lignes de travail utile. Ce n'est pas de la paranoïa décorative : à l'article 3, tu passeras beaucoup de temps à écrire des FEN à la main pour tester des cas particuliers, et une FEN mal formée qui passe silencieusement te fera chercher un bug de génération de coups là où il n'y en a pas.

L'affichage est encore plus simple. Les cases sont rangées dans l'ordre de lecture de la FEN, donc a8 en premier : on parcourt les huit rangées et on numérote à l'envers.

```python
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
```

Le fichier complet, avec sa ligne de commande, est [`afficher_position.py`](https://github.com/Frozalex/blogdungaucher/blob/main/tools/moteur-python/01-par-ou-commencer/afficher_position.py) dans le dépôt du site. Lancé sans argument, il affiche la position de départ ; avec une FEN en argument, il affiche celle-là :

```text
$ python3 afficher_position.py "r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5Q2/PPPP1PPP/RNB1K1NR b KQkq - 4 4"
8 | ♜ · ♝ ♛ ♚ ♝ ♞ ♜
7 | ♟ ♟ ♟ ♟ · ♟ ♟ ♟
6 | · · ♞ · · · · ·
5 | · · · · ♟ · · ·
4 | · · ♗ · ♙ · · ·
3 | · · · · · ♕ · ·
2 | ♙ ♙ ♙ ♙ · ♙ ♙ ♙
1 | ♖ ♘ ♗ · ♔ · ♘ ♖
  +-----------------
    a b c d e f g h

Trait aux Noirs
Roques possibles : KQkq   Prise en passant : -
Règle des 50 coups : 4 demi-coups   Coup n° 4
```

C'est le mat du berger sur le point de tomber. Ton programme sait lire une position. C'est peu, et c'est indispensable : sans affichage, tous les bugs des dix prochains articles seraient invisibles.

## Deuxième programme : parler à Stockfish

Le second exercice sert à deux choses : vérifier que ton installation de Stockfish répond, et te faire manipuler le protocole UCI dès maintenant, puisque c'est celui que ton propre moteur devra parler à la fin.

Un moteur UCI est un sous-processus dont on tient les deux bouts du tuyau.

```python
import subprocess


class Moteur:
    """Un moteur UCI vu comme un tuyau : on écrit des lignes, on lit des lignes."""

    def __init__(self, chemin):
        self.processus = subprocess.Popen(
            [chemin],
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            text=True,
            bufsize=1,  # ligne par ligne : sans ça, on attend un tampon plein
        )

    def envoyer(self, commande):
        print(f">>> {commande}")
        self.processus.stdin.write(commande + "\n")
        self.processus.stdin.flush()

    def lire_jusqu_a(self, prefixe):
        """Lire la sortie jusqu'à la ligne attendue, et renvoyer tout le bloc."""
        lignes = []
        for ligne in self.processus.stdout:
            ligne = ligne.rstrip("\n")
            lignes.append(ligne)
            if ligne.startswith(prefixe):
                return lignes
        raise RuntimeError(f"le moteur s'est arrêté sans envoyer {prefixe!r}")
```

Deux détails valent qu'on s'y arrête, parce qu'ils causent l'essentiel des « mon script reste bloqué » qu'on lit sur les forums.

Le premier est `flush()`. Sans lui, ta commande reste dans le tampon de Python et n'atteint jamais le moteur, qui attend donc indéfiniment quelque chose que tu crois avoir envoyé.

Le second est `lire_jusqu_a`. Le protocole UCI est **asynchrone**, et chaque ordre bloquant a une ligne de fin convenue : `uci` se termine par `uciok`, `isready` par `readyok`, `go` par `bestmove`. Si tu envoies la commande suivante sans avoir attendu cette ligne, tu parles dans le vide. Le cas le plus vicieux est celui du `quit` envoyé trop tôt : le moteur interrompt sa recherche et renvoie un coup au hasard, sans erreur, sans avertissement. Tu obtiens un résultat parfaitement faux et parfaitement silencieux.

Le dialogue complet ressemble à ceci :

```python
moteur = Moteur(os.environ["STOCKFISH"])

# 1. Poignée de main : le moteur annonce son nom et ses options réglables.
moteur.envoyer("uci")
presentation = moteur.lire_jusqu_a("uciok")

# 2. Synchronisation : « tu as fini de t'initialiser ? »
moteur.envoyer("isready")
moteur.lire_jusqu_a("readyok")

# 3. On pose une position, puis on demande à réfléchir 1 seconde.
moteur.envoyer("ucinewgame")
moteur.envoyer(f"position fen {POSITION_DE_DEPART}")
moteur.envoyer("go movetime 1000")
analyse = moteur.lire_jusqu_a("bestmove")
```

Le fichier complet est [`parler_a_stockfish.py`](https://github.com/Frozalex/blogdungaucher/blob/main/tools/moteur-python/01-par-ou-commencer/parler_a_stockfish.py). Voici sa sortie réelle :

```text
$ python3 parler_a_stockfish.py
>>> uci
    id name Stockfish 18
    id author the Stockfish developers (see AUTHORS file)
    (25 lignes reçues, dont les options réglables)
>>> isready
    readyok
>>> ucinewgame
>>> position fen rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1
>>> go movetime 1000
    profondeur 19, évaluation +0.44 pion
    bestmove e2e4 ponder c7c6
>>> quit
```

Vingt-cinq lignes en réponse à `uci` : deux d'identité, une de `uciok`, et vingt-deux options réglables. C'est là que se trouve `UCI_LimitStrength`, l'option qui permettra de brider Stockfish pour en faire un sparring-partner à 1 400 Elo au lieu de 3 600.

Si ce script affiche `bestmove e2e4`, ton atelier est prêt.

## Le contrat de la série : tu sauras toujours si ton code est juste

C'est le point sur lequel cette série diffère le plus des tutoriels existants, alors autant l'expliciter.

Le problème d'un moteur d'échecs est qu'il **a l'air de fonctionner** très longtemps après avoir cessé d'être correct. Un générateur de coups qui oublie la prise en passant joue des parties entières sans que rien ne semble anormal. Une fonction d'évaluation avec une erreur de signe donne un moteur qui joue mal, sans que tu saches si c'est un bug ou un manque de profondeur. Une recherche alpha-bêta mal bornée renvoie le mauvais coup une fois sur cinquante.

Il existe une réponse à cela, et elle est plus vieille que la plupart des moteurs : `perft`. L'idée est brutalement simple. À partir d'une position, on compte toutes les positions atteignables en `n` demi-coups. Si ton générateur de coups est exact, tu obtiens exactement le même nombre que tout le monde. S'il diffère d'une seule unité, tu as un bug, et la variante `perft divide` te dit sous quel coup il se cache.

Depuis la position de départ :

| Profondeur | Positions |
|---|---|
| 1 | 20 |
| 2 | 400 |
| 3 | 8 902 |
| 4 | 197 281 |
| 5 | 4 865 609 |
| 6 | 119 060 324 |

Ces valeurs ne sont pas discutables. Elles sont publiées depuis des décennies, et tu peux les recalculer toi-même à tout moment avec Stockfish (`go perft 5`) sans même connaître la réponse à l'avance. Six positions de référence, choisies pour piéger chacune un cas particulier différent, serviront de contrôle technique à l'article 4.

Le même principe s'applique à la force du moteur, avec un autre étalon : un match contre Stockfish bridé à un niveau donné. Le résultat du match donne une estimation d'Elo, avec sa marge d'erreur. Aucun article de la série ne se termine par « voilà, ça marche ». Chacun se termine par un nombre.

## Ce que tu auras dans douze articles

Un moteur d'échecs complet : représentation mailbox, génération de coups vérifiée par `perft`, évaluation matérielle et positionnelle, recherche négamax avec élagage alpha-bêta, ordonnancement des coups, approfondissement itératif avec gestion du temps, recherche de quiescence, et une boucle UCI qui te permettra de le charger dans l'interface de ton choix et de jouer contre lui.

Le tout en Python pur, en quelques centaines de lignes que tu auras écrites et comprises une par une.

Et une chose à laquelle on pense rarement avant d'y être : la première fois que ton propre programme trouve un mat en trois que tu n'avais pas vu, tu comprends d'un coup pourquoi les gens font ça.

**Prochain article :** représenter un échiquier en Python, et pourquoi le tableau de 64 cases qui te semble évident est précisément celui qu'il ne faut pas utiliser.
