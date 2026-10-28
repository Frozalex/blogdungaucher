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
readingTime: 14 min
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
  - Python privilégie ici la lisibilité ; le rapport de vitesse avec Stockfish dépend des programmes et du matériel comparés.
  - "Aucune bibliothèque dans cette série : ni python-chess, ni rien. Stockfish sert uniquement d'étalon de mesure."
faq:
  - question: "Faut-il être bon aux échecs pour programmer un moteur ?"
    answer: "Il faut connaître les règles et savoir décomposer un problème en algorithmes. Aucun classement Elo minimal n'est nécessaire."
  - question: "Pourquoi ne pas utiliser python-chess ?"
    answer: "Cette série implémente elle-même la représentation et les règles pour les expliquer. python-chess reste une autre option pour construire un outil sans réécrire ces fonctions."
  - question: "Un moteur Python peut-il être fort ?"
    answer: "Sa force dépend de la recherche, de l'évaluation, du matériel et de la cadence. Aucun rapport de vitesse universel avec Stockfish ni niveau humain garanti ne découle du choix de langage."
  - question: "Qu’est-ce que le protocole UCI ?"
    answer: "Conçu en 2000 par Rudolf Huber et Stefan Meyer-Kahlen, il définit un dialogue texte entre moteur et interface. Le moteur reçoit des commandes et renvoie notamment bestmove."
heroImage:
  src: /images/blog/moteur-echecs-python-par-ou-commencer-hero.webp
  alt: Quelques engrenages et un pion attendent sur un établi de bois.
ogImage: /images/og/moteur-echecs-python-par-ou-commencer-og.webp

---

Programmer un moteur d'échecs demande d'articuler quatre fonctions : représenter une position, générer les coups légaux, évaluer une position et rechercher un coup. La complexité d'un programme optimisé comme Stockfish ne doit pas masquer cette organisation conceptuelle.

Cette série construit ces fonctions progressivement en Python, jusqu'à un programme utilisable dans une interface d'échecs. Chaque étape s'accompagne d'un moyen de vérifier le comportement obtenu : référence publiée, comparaison de coups ou mesure explicitée dans l'article.

Ce premier article présente les choix de conception, l'installation de l'atelier et les vérifications initiales. Les suivants développent le code en distinguant la correction des règles, la qualité du jeu et le coût du calcul.

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

Voilà un moteur d'échecs dans son état naturel. Tu lui as dit « voici la position de départ, réfléchis une seconde », il a répondu « je joue e4, et je m'attends à e5 ». La barre d'évaluation que tu connais, c'est juste le `score cp 36` de cette ligne, dessiné joliment : un score positif dans la convention du moteur.

Cette séparation stricte est ce qui rend le projet réalisable. Tu n'as **aucune interface graphique à écrire**. Tu écris un programme qui parle ce dialecte, et toutes les interfaces existantes savent déjà l'utiliser.

## Les quatre organes

Un moteur d'échecs, quel qu'il soit, fait quatre choses. Rien de plus.

**1. Représenter la position.** Où sont les pièces, à qui le trait, quels roques restent possibles, une prise en passant est-elle disponible, combien de demi-coups depuis la dernière prise. C'est le squelette : tout le reste s'y appuie, et un choix médiocre ici plombe définitivement la vitesse du moteur.

**2. Générer les coups légaux.** À partir d'une position, produire la liste exhaustive des coups autorisés. Exhaustive et exacte : ni un de trop, ni un de moins. C'est de très loin la partie la plus pénible, la moins spectaculaire, et une source fréquente de bugs. Les règles bizarres des échecs sont toutes là : le roque qui ne peut pas traverser une case attaquée, la prise en passant qui n'est disponible qu'un seul coup, la promotion en cavalier, le clouage absolu qui interdit de bouger une pièce.

**3. Évaluer une position.** Répondre à la question « qui est mieux, et de combien ? » sans jouer un seul coup de plus. C'est une heuristique, jamais une vérité : le moteur compte le matériel, regarde où sont les pièces, et rend un nombre.

**4. Chercher.** Explorer l'arbre des coups possibles, en supposant que l'adversaire joue bien, pour choisir le coup qui mène à la meilleure position atteignable. C'est l'algorithme [minimax](/fr/blog/minimax-aux-echecs/), et tout ce qui a été inventé depuis consiste à en explorer une fraction minuscule sans perdre le bon coup en route.

À ces quatre organes s'ajoute une plomberie : le protocole UCI, qui les relie au monde extérieur. Une trentaine de lignes, en dernier.

Le découpage de la série suit exactement cet ordre.

| Phase | Articles | Ce qu'on construit |
|---|---|---|
| 1 | 1 à 4 | La représentation et la génération des coups, vérifiées sur un jeu de cas |
| 2 | 5 à 8 | L'évaluation et la recherche : le moteur joue vraiment |
| 3 | 9 à 11 | La vitesse : chercher plus profond dans le même temps |
| 4 | 12 | UCI, et la mesure honnête de la force obtenue |

Le plan complet, article par article, est sur la [page de la série](/fr/series/moteur-python/).

## Pourquoi choisir Python ici ?

La série privilégie un code lisible et la bibliothèque standard. Les temps de calcul rapportés sont des mesures de cette implémentation sur une machine donnée ; ils ne mesurent pas un ralentissement universel de Python par rapport au C++.

Un gain de vitesse peut permettre d'approfondir la recherche, mais sa traduction dépend de la position, de l'ordre des coups et de l'évaluation. Une profondeur donnée ne garantit pas un niveau Elo. Le but est de comprendre ce que chaque composant apporte, puis de le mesurer dans des conditions précisées.


## L'atelier : trois choses à installer, dont deux que tu as déjà

### Python 3.10 ou plus récent

Rien d'autre. **Aucune bibliothèque externe ne sera installée dans toute la série.** Pas de `pip install`, pas d'environnement virtuel, pas de `requirements.txt`. Tout le moteur tient en bibliothèque standard.

Ce n'est pas du purisme. Il existe une excellente bibliothèque d'échecs en Python, `python-chess`, qui fait très bien son travail. Le problème est qu'elle fait exactement ce que la série cherche à t'apprendre : elle représente l'échiquier, génère les coups légaux, lit les FEN, parle UCI. L'utiliser reviendrait à écrire un tutoriel sur la façon d'appeler `board.legal_moves`. Tu saurais utiliser une API, pas comment fonctionne un moteur.

Elle reste le bon choix pour un projet réel. Simplement pas pour celui-ci.

### Stockfish, comme étalon et rien d'autre

Stockfish ne fera jamais partie de ton moteur. Il sert d'**appareil de mesure**, à trois titres :

- il calcule les valeurs de référence de `perft`, avec lesquelles tu contrôleras la génération sur les cas examinés (article 4) ;
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

Le second est `lire_jusqu_a`. Le protocole UCI est **asynchrone**, et chaque ordre bloquant a une ligne de fin convenue : `uci` se termine par `uciok`, `isready` par `readyok`, `go` par `bestmove`. Dans ce client séquentiel, on attend ces réponses avant de poursuivre ; un client asynchrone peut les gérer autrement. Un `quit` trop tôt demande au moteur de s'arrêter ; il ne garantit ni une recherche complète ni le renvoi d'un coup aléatoire.

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

Vingt-cinq lignes en réponse à `uci` : deux d'identité, une de `uciok`, et vingt-deux options réglables. C'est là que se trouve `UCI_LimitStrength`, l'option qui permettra de brider Stockfish pour en faire un adversaire à force réduite ; ce réglage ne constitue pas une cote FIDE mesurée.

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

## Sources

La page officielle de Shredder précise les auteurs et la fonction du protocole UCI utilisé ici.

- Huber, R. et Meyer-Kahlen, S. (2000), Universal Chess Interface, Shredder, [texte de référence](https://www.shredderchess.com/de/schach-features/uci-universal-chess-interface.html).
