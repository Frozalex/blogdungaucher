---
title: "Négamax et élagage alpha-bêta en Python : le même coup, dix fois moins de travail"
excerpt: >-
  Alpha-bêta est la seule optimisation d'un moteur d'échecs qui ne coûte rien. Elle ne change jamais le
  résultat : à profondeur égale, elle renvoie exactement le score de minimax. Elle se contente de ne
  pas explorer ce dont elle peut démontrer que ça ne servira à rien.
publishDate: "2027-07-20"
category: science
featured: false
featuredRank: 99
readingTime: 8 min
pillar: Intelligence artificielle
tags:
  - Python
  - moteur d'échecs
  - alpha-bêta
  - negamax
  - recherche
  - algorithmique
  - tutoriel
  - informatique
seoTitle: "Négamax et élagage alpha-bêta en Python : moteur d'échecs"
seoDescription: >-
  Coder négamax et l'élagage alpha-bêta en Python : la simplification min/max, la fenêtre alpha-bêta,
  la coupure, et la vérification que le score renvoyé est identique à celui de minimax.
keyTakeaways:
  - "Négamax n'est pas un autre algorithme que minimax : c'est minimax écrit en une seule branche, grâce à min(a,b) = -max(-a,-b)."
  - Alpha-bêta ne change jamais le score renvoyé. C'est une propriété démontrable, pas une approximation.
  - Le coup renvoyé, lui, peut changer quand plusieurs coups ont le même score. Seul le score est un invariant.
  - "La coupure survient quand un coup dépasse beta : l'adversaire ne laissera jamais la partie arriver là, savoir de combien il est bon ne sert à rien."
  - Le gain dépend entièrement de l'ordre des coups. C'est ce qui fait de l'ordonnancement le sujet de l'article suivant.
faq:
  - question: "L'élagage alpha-bêta change-t-il le coup joué par le moteur ?"
    answer: >-
      Il ne change jamais le <strong>score</strong> renvoyé, c'est sa propriété fondamentale et elle se
      démontre. Il peut en revanche renvoyer un autre coup lorsque plusieurs coups partagent le meilleur
      score : n'explorant pas tout, il ne découvre pas les mêmes ex aequo. Les deux coups sont également
      bons selon l'évaluation.
  - question: "Que représentent alpha et beta ?"
    answer: >-
      <code>alpha</code> est le meilleur score que le camp au trait s'est déjà garanti ailleurs dans
      l'arbre : il ne jouera jamais une ligne pire. <code>beta</code> est le meilleur score que
      l'adversaire s'est déjà garanti plus haut : il ne nous laissera jamais atteindre mieux. Entre les
      deux se trouve la fenêtre des scores encore intéressants.
  - question: "Pourquoi couper quand le score dépasse beta ?"
    answer: >-
      Parce que le coup est <em>trop bon</em>. S'il nous donne mieux que ce que l'adversaire s'est déjà
      garanti plus haut dans l'arbre, il choisira l'autre ligne et la partie n'arrivera jamais ici.
      Continuer à explorer pour savoir à quel point ce coup est bon serait du travail dont personne ne
      fera rien.
  - question: "Quel gain attendre de l'élagage alpha-bêta ?"
    answer: >-
      Il dépend entièrement de l'ordre dans lequel les coups sont essayés. Dans le pire cas (le meilleur
      coup examiné en dernier), aucun gain. Dans le meilleur cas (le meilleur coup en premier), le
      nombre de positions passe de $b^d$ à environ $b^{d/2}$, ce qui revient à <strong>doubler la
      profondeur atteignable</strong> à temps égal. Sans effort d'ordonnancement, on se situe entre les
      deux.
  - question: "Faut-il garder minimax dans son code une fois alpha-bêta écrit ?"
    answer: >-
      Dans un moteur de production, non. Dans un moteur qu'on apprend à écrire, oui : c'est l'oracle qui
      permet de vérifier qu'alpha-bêta n'a pas changé les scores. Un élagage mal borné renvoie un
      résultat faux une fois sur cinquante, ce qui est indétectable en jouant et immédiat en comparant.
---

À la fin de [l'article précédent](/fr/blog/minimax-en-python-moteur-echecs/), notre moteur trouve tous les mats en deux coups et se heurte à un mur : chaque demi-coup de profondeur supplémentaire multiplie le travail par une vingtaine. Trouver un mat en trois, à profondeur 5, devient une affaire de minutes par position.

Cet article franchit ce mur, avec une technique qui a la particularité rare de **ne rien coûter**. Pas un compromis, pas une approximation : à profondeur égale, elle renvoie exactement le même score que minimax, en explorant une fraction de l'arbre.

Mais commençons par un nettoyage.

## Négamax : la même chose, en deux fois moins de code

Le minimax de l'article 7 a deux branches, l'une qui maximise, l'autre qui minimise. C'est fidèle à la définition et redondant, parce que les deux font la même chose à un signe près.

L'observation qui permet de les fusionner tient sur une ligne :

$$\min(a, b) = -\max(-a, -b)$$

Autrement dit, minimiser un score, c'est maximiser son opposé. Si l'on compte non plus du point de vue des Blancs mais du point de vue du **camp au trait**, les deux joueurs font alors la même chose : ils maximisent. Il ne reste qu'à retourner le score en remontant d'un étage, puisque le point de vue change à chaque demi-coup.

```python
def negamax(echiquier, profondeur, ply, compteur):
    compteur[0] += 1

    coups = echiquier.coups_legaux()
    if not coups:
        return -(MAT - ply) if echiquier.en_echec(echiquier.trait == "w") else 0

    if profondeur == 0:
        return evaluer(echiquier)

    meilleur = -INFINI
    for coup in coups:
        echiquier.jouer(coup)
        meilleur = max(meilleur, -negamax(echiquier, profondeur - 1, ply + 1, compteur))
        echiquier.annuler()
    return meilleur
```

Le `-` devant l'appel récursif fait tout le travail. C'est aussi le seul endroit où l'on peut se tromper, et l'erreur produit un moteur qui joue contre lui-même de façon subtile, un demi-coup sur deux.

Remarque au passage que le traitement du mat s'est simplifié tout seul. Dans minimax il fallait deux cas selon le camp ; ici, une position sans coup légal est forcément mauvaise **pour celui qui doit jouer**, et le score est donc `-(MAT - ply)` sans distinction de couleur.

C'est aussi ici que sert la fonction `evaluer` écrite à l'article 6, celle qui compte du point de vue du camp au trait. Elle n'avait pas d'usage à l'époque. Elle en a un maintenant.

## L'élagage : ne pas chercher ce qui ne sert à rien

Voici l'idée, en une situation concrète.

Tu examines tes coups. Le premier, après analyse, te garantit un score de **+1,00**. Tu passes au deuxième. Tu examines la première réponse de ton adversaire à ce deuxième coup, et tu constates qu'elle te laisse à **-3,00**.

Faut-il examiner les autres réponses de l'adversaire à ce deuxième coup ? Non. L'adversaire choisit sa meilleure réponse : le deuxième coup te donnera donc **au mieux** -3,00, peut-être pire. Il est déjà battu par le premier, qui te garantit +1,00. Que la vraie valeur du deuxième coup soit -3,00 ou -12,00 ne change strictement rien à ta décision.

**Toute la suite de cette branche peut être abandonnée.** Pas approximée : abandonnée, sans le moindre risque de rater quoi que ce soit.

Formaliser cette intuition demande deux nombres, transportés le long de la descente.

`alpha` est le meilleur score que le camp au trait s'est déjà garanti ailleurs. Il ne jouera jamais une ligne moins bonne, donc tout ce qui est en dessous est sans intérêt.

`beta` est le meilleur score que l'**adversaire** s'est déjà garanti plus haut dans l'arbre. Il ne nous laissera jamais obtenir davantage, donc tout ce qui est au dessus est également sans intérêt.

Entre les deux se trouve la fenêtre des scores qui peuvent encore influencer la décision.

```python
def alpha_beta(echiquier, profondeur, alpha, beta, ply, compteur):
    compteur[0] += 1

    coups = echiquier.coups_legaux()
    if not coups:
        return -(MAT - ply) if echiquier.en_echec(echiquier.trait == "w") else 0

    if profondeur == 0:
        return evaluer(echiquier)

    for coup in coups:
        echiquier.jouer(coup)
        score = -alpha_beta(echiquier, profondeur - 1, -beta, -alpha, ply + 1, compteur)
        echiquier.annuler()

        if score >= beta:
            return beta  # coupure : l'adversaire évitera cette ligne
        alpha = max(alpha, score)
    return alpha
```

Quatre lignes de plus que négamax. Le point à ne pas rater est l'appel récursif : la fenêtre est transmise **inversée et échangée**, `(-beta, -alpha)`. C'est la conséquence directe du changement de point de vue : ce qui est mon plancher devient son plafond.

## Une position, trois recherches

Prenons la position du mat du berger, juste avant le coup fatal, et lançons les trois.

```text
$ python3 recherche.py 3 "r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5Q2/PPPP1PPP/RNB1K1NR w KQkq - 4 4"

méthode      coup        score        nœuds     durée
minimax      f3f7     mat en 1        50421    17.04s
negamax      f3f7     mat en 1        50421    17.22s
alpha_beta   f3f7     mat en 1         2248     0.74s
```

Trois informations dans ce tableau.

Les trois trouvent `f3f7`, la dame en f7, et annoncent un mat en un coup. C'était attendu, mais c'est la première fois que notre moteur joue un vrai coup d'échecs plutôt qu'un coup arbitraire.

Minimax et négamax visitent **exactement le même nombre de positions**, 50 421. Ce n'est pas une coïncidence : ce sont deux écritures du même algorithme, et le second n'a jamais prétendu être plus rapide, seulement plus court.

Alpha-bêta en visite 2 248. **Vingt-deux fois moins**, pour le même score, sur la même position, à la même profondeur.

Note aussi la vitesse absolue : environ 3 000 positions par seconde. C'est vingt fois moins que les 60 000 de `perft` mesurés à l'article 4, et pour une raison simple : le test d'absence de coup légal oblige à générer les coups **à chaque feuille**, y compris celles où l'on va se contenter d'évaluer. C'est le prix de la détection correcte des mats, et l'article 11 y reviendra.

## La vérification : le score, et rien que le score

L'affirmation « alpha-bêta ne change jamais le résultat » est démontrable, ce qui n'empêche pas une implémentation de la trahir. Une fenêtre mal inversée, une coupure au mauvais endroit, et le moteur renvoie un score faux une fois sur cinquante. En jouant, c'est indétectable. En comparant, c'est immédiat.

D'où le test de cet article : faire tourner les trois recherches sur les mêmes positions, à la même profondeur, et exiger l'égalité des scores.

Un point mérite d'être explicité, parce qu'il ressemble à un échec sans en être un : **le coup renvoyé, lui, peut différer**. Quand plusieurs coups partagent le meilleur score, alpha-bêta n'a aucune raison de découvrir les mêmes ex aequo, puisqu'il n'explore pas tout. Les deux coups sont également bons selon l'évaluation. Seul le score est un invariant, et c'est donc lui, et lui seul, que le test compare.

```text
$ python3 verifier_elagage.py 3 20
20 positions, profondeur 3

méthode               nœuds      durée   facteur
minimax              653956     296.0s     1.00x
negamax              653956     296.7s     1.00x
alpha_beta            71109      30.6s     9.20x

Scores identiques aux trois méthodes : 20/20
Coup renvoyé différent (ex aequo)    : 0/20
Gain d'alpha-bêta : de 1.9x (pire cas) à 21.4x (meilleur cas)

Tout est vert.
```

Vingt positions, vingt scores identiques. Cinq minutes de recherche exhaustive ramenées à trente secondes.

L'écart entre le pire cas (1,9x) et le meilleur (21,4x) est la partie la plus instructive de ce tableau, et c'est tout le sujet de la section suivante.

## Ce que l'élagage ne fait pas

Le gain mesuré ci-dessus est réel et il est très en dessous de ce que la théorie autorise. La raison est entière dans une phrase : **alpha-bêta ne coupe que ce qu'il a déjà de quoi couper**.

Reprends la situation du début de section. La coupure n'a été possible que parce qu'un premier coup avait déjà établi une garantie de +1,00. Si les coups sont examinés dans le pire ordre possible, le meilleur en dernier, aucune garantie n'est disponible au moment où elle serait utile, et alpha-bêta explore exactement le même arbre que minimax, en plus lent.

Le calcul de référence est dû à Knuth et Moore. Dans le meilleur cas, celui où le meilleur coup est toujours examiné en premier, le nombre de positions visitées passe de $b^d$ à environ $b^{d/2}$. Pour un facteur de branchement de 30 et une profondeur de 6, cela fait passer de 729 millions à 27 000. Autrement dit : **à temps égal, on double la profondeur**.

Nous sommes loin de ce cas idéal, parce que nos coups sont examinés dans l'ordre où le générateur les produit, c'est à dire par case de départ, de a8 vers h1. Cet ordre n'a aucun rapport avec la qualité des coups.

C'est une excellente nouvelle. Cela signifie qu'il reste, gratuitement, un facteur considérable à récupérer, sans toucher ni à l'évaluation ni à l'algorithme : il suffit d'examiner les coups dans un ordre plus intelligent.

**Prochain article :** l'ordonnancement des coups. Comment deviner, avant de les avoir cherchés, lesquels sont les meilleurs, et pourquoi une heuristique aussi grossière que « les prises d'abord » suffit à changer l'ordre de grandeur.
