---
title: "Perft : prouver que ton générateur de coups est juste"
excerpt: >-
  Un générateur de coups peut être exact sur mille positions et faux sur la millionième. Perft est la
  réponse à ce problème : un comptage récursif dont les valeurs sont publiées depuis des décennies. Si
  ton nombre diffère d'une unité, tu as un bug, et une technique le localise en quelques minutes.
publishDate: "2027-06-22"
category: science
featured: false
featuredRank: 99
readingTime: 10 min
pillar: Intelligence artificielle
tags:
  - Python
  - moteur d'échecs
  - perft
  - programmation
  - test logiciel
  - débogage
  - tutoriel
  - informatique
seoTitle: "Perft aux échecs : vérifier son générateur de coups en Python"
seoDescription: >-
  Perft, le test de référence des moteurs d'échecs : principe, code Python, six positions de référence,
  et la technique du divide pour localiser un bug de génération de coups en quelques minutes.
keyTakeaways:
  - Perft compte les positions atteignables en n demi-coups. Le nombre ne dépend d'aucun choix d'implémentation, ce qui en fait une empreinte comparable entre tous les moteurs.
  - "La position de départ est le pire test possible : un générateur qui oublie les sous-promotions la passe sans broncher jusqu'à la profondeur 5."
  - Six positions de référence suffisent à couvrir les familles de bugs connues. Chacune piège autre chose.
  - Divide compare les sous-totaux coup par coup, ce qui transforme la recherche d'un bug en descente dirigée dans l'arbre.
  - Perft ne teste que la génération des coups. La règle des cinquante coups et la nulle par répétition lui sont invisibles.
faq:
  - question: "Que signifie perft exactement ?"
    answer: >-
      <em>Performance test</em>. La fonction <code>perft(n)</code> compte le nombre de positions
      atteignables en exactement n demi-coups depuis une position donnée, en n'empruntant que des coups
      légaux. Le nom est trompeur : on s'en sert bien plus souvent pour vérifier la
      <strong>correction</strong> d'un générateur de coups que pour mesurer sa vitesse.
  - question: "Combien de positions y a-t-il après n coups aux échecs ?"
    answer: >-
      Depuis la position de départ : 20 après un demi-coup, 400 après deux, 8 902 après trois,
      197 281 après quatre, 4 865 609 après cinq et 119 060 324 après six. Ces valeurs sont publiées et
      recoupées depuis des décennies ; elles servent de contrôle technique à tout nouveau moteur.
  - question: "Mon perft est juste à la profondeur 3 mais faux à la profondeur 4, pourquoi ?"
    answer: >-
      Parce qu'un bug de génération n'apparaît que dans les positions qui le déclenchent, et que
      celles-ci sont rares à faible profondeur. Un oubli de prise en passant, par exemple, exige qu'un
      pion adverse ait avancé de deux cases juste à côté d'un de tes pions : il faut au moins trois ou
      quatre demi-coups pour construire ce cas de figure.
  - question: "Comment trouver un bug quand perft est faux ?"
    answer: >-
      Avec <code>divide</code>, qui donne le sous-total de chaque coup au lieu du seul total. On compare
      ces sous-totaux à ceux d'un moteur de référence : un seul diffère en général. On joue ce coup, on
      recommence à la profondeur inférieure, et on descend ainsi jusqu'à la position où un coup est
      produit en trop ou manque. Quelques secondes par étage.
  - question: "Un perft juste garantit-il que mon moteur jouera correctement ?"
    answer: >-
      Non, il garantit seulement que la <strong>génération des coups</strong> est correcte, ce qui est
      déjà l'essentiel. Perft ne regarde ni la règle des cinquante coups, ni la nulle par répétition, ni
      la détection du mat et du pat, ni bien sûr la qualité du jeu. Ces points demandent leurs propres
      tests.
---

Ton générateur de coups produit exactement les bons coups sur 1 498 positions réelles. C'est ce que [l'article précédent](/fr/blog/generer-les-coups-legaux-en-python/) a établi, sur 41 648 coups comparés un par un à Stockfish.

Ça ne prouve presque rien.

Un générateur peut être exact sur toutes les positions qu'on lui soumet et faux sur celles qu'on ne lui soumet pas. Pire : il peut être exact à la profondeur 1 et faux à la profondeur 2, s'il produit une **position** légèrement fausse dont les coups, eux, sont correctement générés. Un droit de roque oublié, un compteur mal remis, et l'erreur ne se manifeste qu'un étage plus bas.

Il existe une réponse à ce problème, et elle est plus vieille que la plupart des moteurs.

## Compter, plutôt que raisonner

L'idée est d'une simplicité désarmante. À partir d'une position, on compte toutes les positions atteignables en `n` demi-coups en n'empruntant que des coups légaux. On appelle ça `perft`, pour *performance test*, un nom trompeur puisqu'on s'en sert surtout pour vérifier la correction.

Ce nombre a une propriété rare en informatique : **il ne dépend d'aucun choix d'implémentation**. Mailbox ou bitboards, Python ou C++, génération légale ou pseudo-légale filtrée, tout le monde doit trouver le même nombre. C'est une empreinte de la définition des règles du jeu, pas de ton programme.

Depuis la position de départ :

| Profondeur | Positions |
|---|---|
| 1 | 20 |
| 2 | 400 |
| 3 | 8 902 |
| 4 | 197 281 |
| 5 | 4 865 609 |
| 6 | 119 060 324 |

Le code tient en dix lignes.

```python
def perft(echiquier, profondeur):
    if profondeur == 0:
        return 1
    coups = echiquier.coups_legaux()
    if profondeur == 1:
        return len(coups)

    total = 0
    for coup in coups:
        echiquier.jouer(coup)
        total += perft(echiquier, profondeur - 1)
        echiquier.annuler()
    return total
```

Une seule finesse, le cas `profondeur == 1`. On pourrait jouer chaque coup pour compter 1 à chaque fois, mais le dernier étage de l'arbre est de très loin le plus peuplé : à `perft(5)` depuis la position de départ, il contient 4,8 millions de positions sur 5 millions au total. Renvoyer directement `len(coups)` économise donc l'essentiel des `jouer` / `annuler`. Cette astuce s'appelle le comptage en gros, *bulk counting*, et elle divise le temps par deux environ.

## La position de départ est le pire des tests

Voici le point que la plupart des tutoriels manquent, et il est central.

Prenons un bug très banal : oublier les sous-promotions. Notre générateur produit quatre coups quand un pion atteint la dernière rangée (dame, tour, fou, cavalier) ; supposons qu'il n'en produise qu'un, la dame. C'est l'erreur que fait à peu près tout le monde au premier essai.

Introduisons-la pour de bon, et lançons les six positions de référence :

```text
Position               prof.      attendu       obtenu     durée    vitesse
----------------------------------------------------------------------------
Position de départ         4       197281       197281      2.2s        90k/s
Kiwipete                   3        97862        97862      1.6s        63k/s
Position 3                 5       674624       674624     10.5s        64k/s
Position 4                 4       422333       320802      3.8s        85k/s  <-- FAUX
Position 5                 3        62379        54007      0.9s        58k/s  <-- FAUX
Position 6                 3        89890        89890      1.4s        66k/s
```

La position de départ passe. Kiwipete passe. Les positions 3 et 6 passent. Un moteur qui ne teste que la position de départ se croit correct, et il ne l'est pas.

C'est logique quand on y réfléchit : pour qu'une promotion apparaisse dans l'arbre depuis la position de départ, il faut qu'un pion traverse cinq rangées. À la profondeur 5, aucun pion n'a eu le temps. Le bug existe, il est simplement hors de portée du test.

D'où la règle : **on ne teste jamais un générateur sur la seule position de départ**. Les six positions ci-dessous forment le jeu de référence utilisé par à peu près tous les auteurs de moteurs, et chacune piège autre chose.

| Position | Ce qu'elle piège |
|---|---|
| Position de départ | Le cas facile : aucune pièce ne peut encore rien faire de tordu |
| Kiwipete | Roques des deux côtés, clouages, prise en passant |
| Position 3 | Finale dépouillée : échecs à répétition, prises en passant qui découvrent |
| Position 4 | Promotions dans tous les sens, dont des sous-promotions avec prise |
| Position 5 | Droits de roque asymétriques et promotion imminente |
| Position 6 | Position d'ouverture chargée : beaucoup de coups, aucun cas rare |

La deuxième, due à Peter McKenzie, est connue sous le nom de **Kiwipete**. Elle a été construite exprès pour être méchante, et elle reste le test le plus cité du domaine.

## Divide : trouver le coup fautif

Savoir que `perft(4)` vaut 320 802 au lieu de 422 333 ne dit pas où est le bug. Cent mille positions manquent, réparties on ne sait où dans l'arbre.

La solution s'appelle `divide`, et c'est une dichotomie déguisée. Au lieu du seul total, on donne le sous-total de **chaque coup** de la position :

```python
def divide(echiquier, profondeur):
    resultats = {}
    for coup in echiquier.coups_legaux():
        echiquier.jouer(coup)
        resultats[str(coup)] = perft(echiquier, profondeur - 1)
        echiquier.annuler()
    return resultats
```

Stockfish produit exactement la même sortie avec `go perft n`, ce qui permet une comparaison ligne à ligne. Trois cas peuvent se présenter :

1. Un coup apparaît chez nous et pas chez lui : **on a trouvé**, c'est un coup illégal produit à tort.
2. Un coup apparaît chez lui et pas chez nous : **on a trouvé**, c'est un coup légal oublié.
3. Un coup est présent des deux côtés avec des sous-totaux différents : le bug est plus bas. On joue ce coup et on recommence à la profondeur inférieure.

Le troisième cas est celui qui fait tout l'intérêt de la technique. À chaque étage, on élimine tout l'arbre sauf une branche. Une trentaine de comparaisons par étage, cinq étages : le bug est cerné en quelques secondes, dans une recherche qui autrement se compterait en jours.

C'est automatisable, et le script de la suite le fait tout seul. Voici ce qu'il affiche sur le bug de sous-promotion introduit plus haut :

```text
Position 4                 4       422333       320802      3.8s        85k/s  <-- FAUX
    b4c5 : 43376 chez nous, 58167 chez Stockfish
    position   r3k2r/Pppp1ppp/1b3nbN/nPB5/B1P1P3/q4N2/Pp1P2PP/R2Q1RK1 b kq - 1 1
    atteinte par  b4c5
    coups manquants : b2a1b b2a1n b2a1r b2b1b b2b1n b2b1r

Position 5                 3        62379        54007      0.9s        58k/s  <-- FAUX
    position   rnbq1k1r/pp1Pbppp/2p5/8/2B5/8/PPP1NnPP/RNBQK2R w KQ - 1 8
    atteinte par  (position de départ du test)
    coups manquants : d7c8b d7c8n d7c8r
```

Le diagnostic est écrit en toutes lettres. Il manque `b2a1b`, `b2a1n`, `b2a1r` : le pion noir en b2 peut prendre la tour a1 en se promouvant en fou, en cavalier ou en tour, et notre générateur ne propose que la dame. Six coups manquants dans cette position, et l'écart de cent mille positions vient de leur multiplication dans l'arbre.

Note au passage la valeur du deuxième cas : la position 5 diverge **dès la racine**, sans avoir besoin de descendre. Le message le dit, et la position affichée est directement celle du test.

## Le contrôle technique complet

Voici le résultat sur le générateur réel de la série, sans bug injecté cette fois.

```text
$ STOCKFISH=... python3 suite_perft.py
Position               prof.      attendu       obtenu     durée    vitesse
----------------------------------------------------------------------------
Position de départ         5      4865609      4865609     78.8s        62k/s
Kiwipete                   4      4085603      4085603     44.4s        92k/s
Position 3                 6     11030083     11030083    193.4s        57k/s
Position 4                 5     15833292     15833292    275.1s        58k/s
Position 5                 4      2103487      2103487     22.7s        92k/s
Position 6                 4      3894594      3894594     38.0s       103k/s
----------------------------------------------------------------------------
6/6 positions exactes, 654 s au total
```

Quarante et un millions huit cent douze mille six cent soixante-huit positions énumérées, une par une, sans un écart d'une unité.

Chaque nombre de la colonne « attendu » a été demandé à Stockfish au moment du test, pas recopié dans le script. Une valeur de référence recopiée à la main est une valeur qu'on peut recopier de travers, et un test qui valide une erreur est pire que pas de test du tout.

Les profondeurs ne sont pas les mêmes partout, et c'est un aveu de faiblesse assumé. À 60 000 positions par seconde, `perft(5)` sur Kiwipete demanderait 193 millions de positions, soit près d'une heure ; `perft(6)` depuis la position de départ, une demi-heure. On choisit donc pour chaque position la profondeur la plus grande qui garde le total sous les onze minutes. Le jeu de positions couvre les familles de bugs, ce qui compte davantage que la profondeur brute : c'est ce que la démonstration du bug de sous-promotion vient de montrer, puisqu'il passait inaperçu à toutes les profondeurs de la position de départ.

L'option `--rapide` retire une profondeur à chaque position et ramène l'ensemble à une vingtaine de secondes. C'est celle qu'on lance après chaque modification ; la version complète, une fois de temps en temps.

## Ce que perft ne prouve pas

Un test qui prétend tout prouver ne prouve rien. Voici précisément ce que celui-ci laisse de côté.

**La règle des cinquante coups et la nulle par répétition.** Perft compte des positions, il ne s'arrête jamais sur une nulle. Notre compteur de demi-coups pourrait être complètement faux sans qu'aucun `perft` ne bronche. C'est pour cela que la deuxième épreuve de l'article 2, l'aller-retour `jouer` / `annuler` sur la FEN complète, reste nécessaire : elle, elle regarde ce compteur.

**La détection du mat et du pat.** Perft s'en accommode naturellement, puisqu'une position sans coup légal contribue simplement zéro. Savoir si c'est un mat ou un pat est un autre problème, et c'est celui du prochain article.

**Tout ce qui touche à la qualité du jeu.** Évaluation, recherche, gestion du temps : perft n'en sait rien et n'en saura jamais rien.

Ce que perft prouve, en revanche, il le prouve complètement : à ces profondeurs, sur ces six positions, ton générateur produit exactement l'ensemble des coups légaux, ni un de plus, ni un de moins. C'est la seule brique du moteur dont on peut affirmer cela.

## La vitesse, maintenant qu'on peut la mesurer

Un mot sur le chiffre annoncé au premier article, qu'on peut enfin vérifier.

Notre moteur tourne entre 60 000 et 90 000 positions par seconde. Stockfish, sur la même machine, fait `perft(6)` depuis la position de départ, soit 119 060 324 positions, en 1,60 seconde : environ 74 millions par seconde.

Un facteur mille, comme annoncé. Il se répartit à peu près en trois tiers : Python contre C++, la mailbox contre les bitboards, et notre filtre de légalité paresseux qui joue puis annule chaque coup candidat pour vérifier qu'il est légal. Ce dernier tiers est le seul sur lequel on peut agir sans changer de langage, et l'article 9 s'y attaquera.

Pour l'instant, la vitesse n'a aucune importance. Un générateur rapide et faux est un générateur faux.

## Ce que tu as maintenant

Une phase 1 terminée, et un socle dont la correction n'est pas une opinion. Représentation, FEN, `jouer` / `annuler`, génération des coups légaux, le tout prouvé sur six positions de référence et 1 498 positions de partie.

C'est le bon moment pour un aveu : rien de ce que tu as écrit jusqu'ici ne joue aux échecs. Ton programme sait ce qui est permis, pas ce qui est bon. La suite de la série ne fera plus que répondre à cette seconde question, et elle commence par la façon la plus bête d'y répondre.

**Prochain article :** un moteur qui joue au hasard. Ridicule, indispensable, et déjà capable de perdre une partie complète sans jamais jouer un coup illégal.
