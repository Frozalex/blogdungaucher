---
title: "Parler UCI et mesurer son Elo : le moteur sort du terminal"
excerpt: >-
  Une centaine de lignes séparent un script Python d'un moteur qu'on charge dans une vraie interface
  d'échecs. Et une fois branché, il reste la seule question qui compte vraiment : combien vaut-il ?
  Avec sa marge d'erreur, sinon le chiffre ne veut rien dire.
publishDate: "2027-08-17"
category: science
featured: false
featuredRank: 99
readingTime: 10 min
pillar: Intelligence artificielle
tags:
  - Python
  - moteur d'échecs
  - UCI
  - Elo
  - Stockfish
  - programmation
  - tutoriel
  - informatique
seoTitle: "Protocole UCI en Python et mesure de l'Elo d'un moteur d'échecs"
seoDescription: >-
  Implémenter le protocole UCI en Python pour brancher son moteur dans une interface d'échecs, puis
  mesurer sa force réelle contre Stockfish bridé, avec intervalle de confiance.
keyTakeaways:
  - UCI est du texte sur l'entrée et la sortie standard. Six commandes suffisent à rendre un moteur utilisable dans n'importe quelle interface.
  - "Trois règles non négociables : vider le tampon, ne rien écrire hors protocole, toujours répondre bestmove."
  - Un moteur UCI fait confiance à l'interface et ne vérifie pas la légalité des coups qu'on lui envoie.
  - Stockfish sait s'affaiblir de façon calibrée entre 1320 et 3190 Elo, ce qui en fait un étalon de mesure accessible.
  - "Un Elo annoncé sans intervalle de confiance ne veut rien dire : sur vingt parties, la marge dépasse facilement deux cents points."
faq:
  - question: "Comment brancher un moteur Python dans une interface d'échecs ?"
    answer: >-
      L'interface lance le moteur comme un programme quelconque et communique avec lui par son entrée et
      sa sortie standard. Sous Linux ou macOS, il suffit de déclarer le script comme moteur UCI en
      s'assurant qu'il est exécutable et qu'il commence par une ligne
      <code>#!/usr/bin/env python3</code> ; sous Windows, on déclare l'interpréteur avec le script en
      argument.
  - question: "Quelles commandes UCI faut-il implémenter au minimum ?"
    answer: >-
      Six : <code>uci</code> (se présenter), <code>isready</code> (se synchroniser),
      <code>ucinewgame</code> (repartir de zéro), <code>position</code> (recevoir la position),
      <code>go</code> (réfléchir et répondre <code>bestmove</code>) et <code>quit</code>. Tout le reste
      (options, <code>ponder</code>, <code>stop</code>) est facultatif pour un premier moteur.
  - question: "Pourquoi mon moteur bloque-t-il l'interface ?"
    answer: >-
      Trois causes, dans l'ordre de fréquence. Un tampon non vidé : la réponse est écrite mais jamais
      envoyée. Un <code>bestmove</code> manquant sur un cas particulier, typiquement une position sans
      coup légal, et l'interface attend indéfiniment. Ou une ligne écrite sur la sortie standard qui
      n'appartient pas au protocole, souvent un <code>print</code> de débogage oublié.
  - question: "Comment mesurer l'Elo de son moteur ?"
    answer: >-
      En le faisant jouer un nombre pair de parties contre un adversaire d'Elo connu, couleurs
      alternées, à cadence identique. Le score se convertit en écart Elo par la formule logistique
      $-400 \log_{10}(1/p - 1)$, où $p$ est le score en proportion. Stockfish avec
      <code>UCI_LimitStrength</code> fournit cet adversaire calibré, de 1320 à 3190 Elo.
  - question: "Combien de parties faut-il pour une mesure d'Elo fiable ?"
    answer: >-
      Beaucoup plus qu'on ne croit. Sur vingt parties, l'intervalle de confiance à 95 % dépasse
      facilement deux cents points Elo, ce qui autorise à peine à distinguer un moteur de club d'un
      débutant. Les tests sérieux de Stockfish se comptent en dizaines de milliers de parties, parce
      qu'ils cherchent à détecter des écarts de deux ou trois points.
---

Le moteur de cette série sait tout faire, sauf parler à quelqu'un. Il vit dans un script, joue contre lui-même, et affiche ses résultats dans un terminal. Ce dernier article le sort de là, puis répond à la seule question qui reste : **combien vaut-il ?**

## UCI, ou pourquoi il n'y a pas d'interface à écrire

*Universal Chess Interface*, publié par Stefan Meyer-Kahlen en 2000. Le protocole a une qualité qui explique son adoption universelle : il est **du texte**. L'interface écrit des lignes sur l'entrée standard du moteur, le moteur répond sur sa sortie standard. Rien d'autre.

Conséquence directe : n'importe quel langage capable d'écrire sur la console peut parler UCI. Et surtout, tu n'as **aucune interface graphique à écrire**. Arena, Cute Chess, Banksia, Nibbler et les autres savent déjà utiliser ton moteur, à condition qu'il respecte la convention.

Six commandes suffisent.

| Commande | Ce qu'elle demande | Réponse attendue |
|---|---|---|
| `uci` | Présente-toi | `id name`, `id author`, puis `uciok` |
| `isready` | Tu es prêt ? | `readyok` |
| `ucinewgame` | Nouvelle partie | rien |
| `position ...` | Voici la position | rien |
| `go ...` | Réfléchis | des lignes `info`, puis `bestmove` |
| `quit` | Arrête-toi | rien |

## Les trois règles qu'on n'enfreint pas

Chacune correspond à un bug qui bloque l'interface, sans message d'erreur, jusqu'à ce que l'utilisateur tue le processus.

**Vider le tampon.** Python bufferise sa sortie standard dès qu'elle n'est pas un terminal, ce qui est exactement le cas quand une interface lance le moteur. Sans `flush()`, la réponse est écrite et jamais envoyée.

```python
def ecrire(ligne):
    sys.stdout.write(ligne + "\n")
    sys.stdout.flush()
```

**Ne rien écrire hors protocole.** Un `print` de débogage égaré, et l'interface reçoit une ligne qu'elle ne comprend pas. Les bonnes s'en remettent, les autres coupent la communication. Le protocole prévoit `info string` pour tout ce qu'on veut dire aux humains.

**Toujours répondre `bestmove`.** À chaque `go`, quoi qu'il arrive. Y compris sur une position sans coup légal, où la réponse conventionnelle est `bestmove (none)`.

```python
coup, _, _, _, _ = chercher(echiquier, budget, profondeur_max, rapporter=rapporter)
# Même sans coup légal, l'interface DOIT recevoir une réponse.
ecrire(f"bestmove {coup if coup else '(none)'}")
```

Ce dernier cas est celui qu'on ne teste jamais, parce qu'une interface normale n'envoie pas `go` sur une position matée. Sauf en analyse, où l'utilisateur peut parfaitement remonter dans une partie jusqu'au mat final.

## Traduire le temps

L'interface n'envoie pas une profondeur, elle envoie une pendule :

```text
go wtime 248000 btime 251000 winc 3000 binc 3000
```

Deux cent quarante-huit secondes pour les Blancs, avec trois secondes d'incrément par coup. Reste à en tirer un budget, ce qui reprend la règle de l'article précédent :

```python
cle = "wtime" if trait_blanc else "btime"
restant = int(arguments[arguments.index(cle) + 1]) / 1000
...
return max(0.05, restant / DIVISEUR_DE_TEMPS + increment * 0.8)
```

Note le `max(0.05, ...)`. En fin de partie éclair, `restant / 30` peut valoir trois millisecondes, et une recherche qui n'a le temps de rien renvoie n'importe quoi. Le plancher garantit au moins une profondeur 1 complète.

## Vérifier le protocole en jouant l'interface

Un moteur UCI se teste en le pilotant comme le ferait une interface : on le lance en sous-processus, on lui envoie des ordres, on vérifie ses réponses. L'arbitre reste Stockfish, à qui l'on demande si le coup renvoyé est légal.

```text
$ STOCKFISH=... python3 verifier_uci.py
  OK   uci -> uciok
  OK   id name annoncé
  OK   id author annoncé
  OK   isready -> readyok
  OK   readyok après ucinewgame
  OK   coup légal après « position startpos »
  OK     lignes info émises
  OK   coup légal après « position startpos moves e2e4 e7e5 g1f3 »
  OK     lignes info émises
  OK   coup légal après « position fen r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5 »
  OK     lignes info émises
  OK   coup légal après « position fen 8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w »
  OK     lignes info émises
  OK   go movetime 200 respecté
  OK   go movetime 1000 respecté
  OK   go depth 1 répond vite
  OK   bestmove même sans coup légal
  OK   aucune ligne parasite

Protocole conforme.
```

### Ce que ce test m'a appris sur mon propre moteur

En écrivant ce test, j'ai choisi comme cas d'essai la position 3 de `perft` suivie d'un coup, et j'ai pris le premier coup qui me semblait naturel : `b5b6`, une poussée de pion.

Le moteur a planté, avec une erreur inattendue : **« pas de roi blanc sur l'échiquier »**.

Explication. Dans cette position, le pion b5 est cloué par la tour noire h5 sur le roi blanc a5. `b5b6` est donc illégal : il expose le roi. Notre implémentation d'UCI, elle, applique les coups reçus sans les vérifier ; la recherche a ensuite exploré une position où le roi blanc pouvait être capturé, l'a été, et la fonction qui cherche le roi a échoué.

Est-ce un bug ? **Non, c'est une convention**, et elle est délibérée. Un moteur UCI fait confiance à l'interface : vérifier la légalité de chaque coup reçu coûterait une génération complète par coup au chargement d'une partie de cent coups, pour se prémunir contre un cas qui n'arrive jamais avec une interface correcte.

Mais c'est une convention qu'il faut connaître, parce qu'elle transforme la moindre faute de frappe dans une commande tapée à la main en plantage incompréhensible. C'est aussi pour cela que le message d'erreur mérite d'être explicite : `case_du_roi` lève une exception nommée plutôt que de renvoyer `None` et de laisser le bug se propager cinq fonctions plus loin.

## Mesurer l'Elo

Reste la question. Stockfish sait s'affaiblir de façon calibrée :

```text
option name UCI_LimitStrength type check default false
option name UCI_Elo type spin default 1320 min 1320 max 3190
```

L'échelle démarre à 1320, soit à peu près le niveau d'un joueur de club débutant. C'est l'adversaire le plus faible qu'on puisse lui demander d'être, et c'est celui qu'il nous faut.

La méthode est celle de tous les tests de moteurs : un nombre pair de parties, couleurs alternées pour annuler l'avantage des Blancs, cadence identique des deux côtés. Le score se convertit en écart Elo par la formule logistique standard :

$$\Delta_{\text{Elo}} = -400 \log_{10}\left(\frac{1}{p} - 1\right)$$

où $p$ est le score en proportion. Un score de 50 % donne un écart nul, 75 % donne environ +191.

### Trouver le bon adversaire

Première tentative, au plancher de l'échelle. Deux parties suffisent à comprendre qu'on s'est trompé de niveau :

```text
$ STOCKFISH=... python3 match_stockfish.py 1320 1 0.5
Gaucher 1.0 contre Stockfish bridé à 1320 Elo
  score : 2.0 / 2 (100.0 %)
  Score extrême : l'écart Elo n'est pas mesurable, il est seulement
  au-dessus de 120 points. Il faut un adversaire mieux calibré.
```

Un score parfait ne donne aucune mesure : la formule logistique diverge, et tout ce qu'on peut dire est « plus fort que ça ». Montons à 1900 :

```text
$ STOCKFISH=... python3 match_stockfish.py 1900 2 0.5
  score : 0.0 / 4 (0.0 %)
  Score extrême : l'écart Elo n'est pas mesurable, il est seulement
  en dessous de 241 points.
```

Trop fort dans l'autre sens, et tout aussi inexploitable. Notre moteur est quelque part entre les deux. On vise le milieu.

### La mesure

```text
$ STOCKFISH=... python3 match_stockfish.py 1600 6 0.5
Gaucher 1.0 contre Stockfish bridé à 1600 Elo
cadence : 0.50 s par coup des deux côtés, 12 parties

  score : 3.0 / 12 (25.0 %)
  2 victoires, 2 nulles, 8 défaites
    échec et mat                 10
    triple répétition            2

  écart Elo : -191 ± 227
  Elo estimé de Gaucher 1.0 : 1409 ± 227
  (intervalle à 95 % : 1182 à 1636)
```

Voilà le chiffre, et voilà surtout sa marge.

**Environ 1400 Elo**, à une demi-seconde par coup, sur une douzaine de parties. C'est le niveau d'un joueur de club qui connaît les règles, ne donne pas ses pièces bêtement, et se fait battre par n'importe qui d'entraîné. C'est aussi, très probablement, plus fort que l'auteur de ces lignes en blitz.

Et deux parties sur douze se terminent par une nulle par **triple répétition** : le moteur, en position gagnée ou perdue, tourne en rond faute de savoir quoi entreprendre. C'est le symptôme classique d'une évaluation sans notion de progrès, et c'est ce qu'améliorerait une table de transposition doublée d'une évaluation de finale.

## Pourquoi la marge d'erreur n'est pas décorative

C'est le point sur lequel il faut être ferme, parce que c'est là que les annonces d'Elo deviennent du folklore.

Un résultat de match est un tirage. Sur vingt parties, l'intervalle de confiance à 95 % dépasse facilement deux cents points Elo. Deux cents points, c'est l'écart entre un joueur de club et un joueur de tournoi confirmé : autant dire que la mesure ne permet presque rien d'affirmer.

Pour donner l'échelle : les tests de non-régression de Stockfish se comptent en **dizaines de milliers de parties**, parce qu'ils cherchent à détecter des écarts de deux ou trois points Elo. Notre mesure à nous dit une chose et une seule, mais elle la dit honnêtement : l'ordre de grandeur, avec ses bornes.

Un moteur dont l'auteur annonce « environ 2000 Elo » sans préciser ni l'adversaire, ni la cadence, ni le nombre de parties, n'a pas mesuré grand chose.

## Ce que tu as construit

Douze articles, quelques centaines de lignes de Python sans une seule dépendance, et un moteur d'échecs complet :

- une représentation mailbox 10×12, dont l'aller-retour FEN est vérifié sur 1 498 positions ;
- un générateur de coups légaux prouvé exact par `perft` sur six positions de référence, soit **41 812 668 positions énumérées sans un écart d'une unité** ;
- une évaluation matérielle et positionnelle, symétrique par construction ;
- une recherche négamax avec élagage alpha-bêta, ordonnancement MVV-LVA, killers et historique ;
- un approfondissement itératif qui respecte un budget de temps ;
- une recherche de quiescence qui supprime l'effet d'horizon ;
- une interface UCI conforme, testée en pilotant le moteur comme le ferait une interface graphique.

Et surtout, à chaque étape, un moyen de savoir si c'était juste. C'est ce qui distingue un moteur d'échecs d'un programme qui a l'air de jouer aux échecs : les deux se ressemblent énormément, jusqu'au jour où l'on compte.

## Et maintenant

Trois directions, par ordre de rapport gain sur effort.

**Les tables de transposition.** Une même position s'atteint par des ordres de coups différents ; les recalculer est un gâchis considérable. Une table de hachage de Zobrist, mémorisant le score déjà calculé pour chaque position, est de très loin le plus gros gain restant.

**L'élagage nul (null move).** Laisser l'adversaire jouer deux fois de suite, et si la position reste bonne malgré ce cadeau, couper la branche. Quelques lignes, plusieurs centaines de points Elo, et un piège en zugzwang.

**Un autre langage.** À un moment, la vraie limite devient Python. Le moteur écrit ici tourne autour de 3 000 positions par seconde ; le même algorithme en C ou en Rust en ferait cent fois plus. Mais tu sauras alors exactement ce que tu réécris, et c'était tout l'objet de cette série.
