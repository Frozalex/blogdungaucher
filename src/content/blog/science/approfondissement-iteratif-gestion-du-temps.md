---
title: "Approfondissement itératif : refaire tout le travail, et pourquoi ça vaut le coup"
excerpt: >-
  Un moteur ne choisit pas sa profondeur, il reçoit du temps. La solution consiste à chercher à
  profondeur 1, puis 2, puis 3, en refaisant tout à chaque fois. On lit partout que c'est gratuit.
  Mesuré sur notre moteur, ça coûte 25 % à profondeur 4 et 5 % à profondeur 5. Et ça vaut quand même.
publishDate: "2027-08-03"
category: science
featured: false
featuredRank: 99
readingTime: 9 min
pillar: Intelligence artificielle
tags:
  - Python
  - moteur d'échecs
  - recherche
  - gestion du temps
  - programmation
  - algorithmique
  - tutoriel
  - informatique
seoTitle: "Approfondissement itératif et gestion du temps d'un moteur d'échecs"
seoDescription: >-
  Pourquoi un moteur d'échecs cherche à profondeur 1, puis 2, puis 3, au lieu d'aller directement à la
  profondeur finale. Implémentation en Python, gestion du budget de temps et mesures.
keyTakeaways:
  - "Une recherche interrompue en cours de route ne renvoie rien d'exploitable : les coups non examinés pourraient être meilleurs."
  - L'approfondissement itératif rend la recherche interruptible à tout instant, puisqu'une profondeur terminée est toujours disponible.
  - "Le travail répété n'est pas gratuit : mesuré à faible profondeur, l'itératif coûte 25 % de plus que la recherche directe."
  - "Ce surcoût s'achète pour une raison qui n'a rien à voir avec la vitesse : sans lui, le moteur ne sait pas s'arrêter à l'heure."
  - Une itération interrompue doit être jetée en entier, y compris son meilleur coup partiel.
faq:
  - question: "Qu'est-ce que l'approfondissement itératif ?"
    answer: >-
      Chercher d'abord à profondeur 1, puis recommencer à profondeur 2, puis à 3, et ainsi de suite
      jusqu'à épuisement du temps disponible. On conserve le résultat de la dernière profondeur
      entièrement terminée. C'est la façon standard dont tous les moteurs d'échecs gèrent leur temps de
      réflexion.
  - question: "N'est-ce pas du gaspillage de tout recommencer ?"
    answer: >-
      C'est un coût réel, contrairement à ce qu'on lit souvent. Mesuré sur notre moteur à profondeur 4,
      l'approfondissement itératif visite <strong>25 % de positions en plus</strong> que la recherche
      directe. Le renseignement fourni par l'itération précédente réduit ce surcoût sans l'annuler à
      cette profondeur. On l'accepte parce qu'il achète autre chose : la capacité de s'arrêter à
      l'heure avec un coup exploitable.
  - question: "Pourquoi ne pas simplement arrêter une recherche profonde à l'échéance ?"
    answer: >-
      Parce que le résultat serait inexploitable. Si le moteur a examiné douze coups sur trente-cinq
      quand le temps tombe, le meilleur de ces douze n'est pas nécessairement bon : les vingt-trois
      autres n'ont pas été vus, et il pourrait s'agir d'un coup qui perd une pièce. Une recherche
      partielle n'a aucune garantie.
  - question: "Combien de temps un moteur doit-il consacrer à un coup ?"
    answer: >-
      La règle prudente la plus répandue est <strong>le temps restant divisé par trente</strong>, plus
      une bonne part de l'incrément. Elle suppose qu'il reste une trentaine de coups à jouer, ce qui est
      pessimiste en fin de partie et donc sans danger. Perdre au temps coûte la partie entière ; réfléchir
      un peu moins ne coûte que quelques points Elo.
  - question: "Comment interrompre proprement une recherche récursive en Python ?"
    answer: >-
      Avec une exception. Un drapeau booléen obligerait chaque niveau de la récursion à le tester et à
      propager un retour anticipé ; une exception levée au fond remonte d'un coup jusqu'à la racine, où
      elle est attrapée. Il faut seulement veiller à ne consulter l'horloge qu'une fois tous les quelques
      centaines de nœuds, sinon la mesure du temps coûte plus cher que la recherche.
---

Notre moteur a un défaut qu'aucune interface d'échecs ne tolérerait. On lui donne une profondeur, il rend un coup quand il a fini, et il peut avoir fini en une seconde comme en dix minutes.

Or aucune cadence de jeu ne fonctionne ainsi. Une interface annonce « il te reste 4 minutes 12 et 3 secondes d'incrément », et attend un coup. C'est au moteur de décider de sa profondeur, et cette décision doit être prise **avant** de savoir combien de temps cette profondeur va prendre.

## Pourquoi on ne peut pas simplement s'arrêter

La solution évidente serait de lancer une recherche profonde et de l'interrompre à l'échéance, en renvoyant le meilleur coup trouvé jusque là.

Elle ne marche pas, et il vaut la peine de comprendre pourquoi, parce que c'est ce qui justifie tout le reste de l'article.

Une recherche examine les coups les uns après les autres. Si le temps tombe alors qu'elle en a examiné douze sur trente-cinq, elle connaît le meilleur de ces douze. Ce coup n'est pas le meilleur des trente-cinq. Il n'est même pas garanti correct : les vingt-trois coups non examinés pourraient tous être meilleurs, et le douzième pourrait être celui qui perd une pièce, simplement moins mauvais que les onze premiers.

**Une recherche partielle n'a aucune garantie.** Ce n'est pas une approximation, c'est un résultat sans valeur.

## La solution qui a l'air absurde

L'approfondissement itératif consiste à chercher à profondeur 1. Puis à recommencer depuis le début à profondeur 2. Puis à 3. Et ainsi de suite jusqu'à ce que le temps soit épuisé.

On refait donc intégralement le travail à chaque tour.

```python
for profondeur in range(1, profondeur_max + 1):
    try:
        coup, score = chercher_a_profondeur(echiquier, profondeur, contexte)
    except TempsEcoule:
        break

    meilleur_coup, meilleur_score, atteinte = coup, score, profondeur
    contexte.coup_principal = coup
```

Le bénéfice est immédiat : **à tout instant, on dispose d'un coup complet**, issu de la dernière profondeur entièrement terminée. Le temps peut tomber n'importe quand, on a toujours quelque chose de bon à jouer.

Reste à savoir ce que coûte le travail répété. L'argument habituel est qu'il est négligeable : comme le nombre de positions est multiplié par le facteur de branchement à chaque profondeur, la somme de toutes les itérations précédentes est dominée par la dernière. Avec un facteur de branchement effectif de 5 après élagage, les profondeurs 1 à 5 réunies coûtent environ un quart de la profondeur 6.

Un quart, ce n'est pas rien. Et il existe un mécanisme censé le rembourser.

## Le renseignement qui rembourse tout

Souviens-toi de l'article précédent : l'efficacité d'alpha-bêta dépend entièrement de l'ordre des coups, et notre meilleur outil pour deviner cet ordre reste grossier.

L'approfondissement itératif fournit gratuitement le renseignement le plus fiable qui soit. Le meilleur coup à profondeur 5 est, dans l'écrasante majorité des cas, un excellent candidat à profondeur 6. On l'essaie donc **en premier**.

```python
def score(coup):
    # Le meilleur coup de l'itération précédente passe avant tout le reste,
    # y compris avant la meilleure des prises.
    if ply == 0 and coup == contexte.coup_principal:
        return 10_000_000
    ...
```

Ce coup, essayé en premier, fait immédiatement monter `alpha` à sa valeur finale ou presque, ce qui permet à toutes les branches suivantes d'être coupées beaucoup plus tôt.

C'est l'argument classique en faveur de l'approfondissement itératif, et on le lit partout sous une forme catégorique : « l'itératif est plus rapide que la recherche directe ». La deuxième épreuve du banc de cet article le met à l'épreuve, et le résultat n'est pas celui qu'on annonce d'habitude.

## Interrompre une récursion proprement

Reste la mécanique. Comment arrêter une fonction récursive descendue à douze niveaux de profondeur ?

Un drapeau booléen obligerait chaque niveau à le tester et à propager un retour anticipé, en distinguant « j'ai fini » de « j'ai été interrompu ». C'est laid et facile à rater. Une **exception** remonte d'un coup jusqu'à la racine :

```python
class TempsEcoule(Exception):
    """Levée au fond de la récursion pour remonter d'un coup jusqu'à la racine."""
```

Reste à ne pas se ruiner en consultations d'horloge. Appeler `time.perf_counter()` à chaque nœud coûterait une fraction non négligeable du temps de recherche.

```python
NOEUDS_ENTRE_CONTROLES = 256

def controler_le_temps(self):
    if self.limite is None:
        return
    if self.noeuds % NOEUDS_ENTRE_CONTROLES == 0 and time.perf_counter() > self.limite:
        raise TempsEcoule
```

Le choix de 256 n'est pas arbitraire : à environ 3 000 nœuds par seconde, il représente moins d'un dixième de seconde de retard possible sur l'échéance. C'est un réglage à revoir si le moteur devient beaucoup plus rapide, et le seul endroit du code où il faut y penser.

## Le piège : jeter l'itération incomplète

Voici l'erreur qui rend le moteur subtilement moins fort, et qui ne se voit jamais.

Quand l'exception tombe au milieu de l'itération de profondeur 7, on est tenté de garder son meilleur coup partiel : après tout, il vient d'une recherche plus profonde que celle de l'itération 6.

Il faut résister. C'est exactement le problème du début de l'article, à un étage près : le meilleur coup partiel de l'itération 7 n'a pas été comparé à tous ses concurrents. Il peut parfaitement être pire que le coup complet de l'itération 6.

```python
try:
    coup, score = chercher_a_profondeur(echiquier, profondeur, contexte)
except TempsEcoule:
    break                    # l'itération entière est perdue, et c'est normal

meilleur_coup, meilleur_score, atteinte = coup, score, profondeur
```

L'affectation vient **après** le `try`. Une itération interrompue ne laisse aucune trace.

Un cas particulier mérite d'être traité à part : lorsqu'un mat est trouvé, on s'arrête. Chercher plus profond ne peut rien apporter, et l'itératif tournerait jusqu'à épuisement du temps pour redécouvrir le même mat.

## Le budget

Combien de temps accorder à un coup ? La règle prudente la plus répandue :

```python
DIVISEUR_DE_TEMPS = 30

restant = int(arguments[arguments.index(cle) + 1]) / 1000
return max(0.05, restant / DIVISEUR_DE_TEMPS + increment * 0.8)
```

Diviser par trente revient à supposer qu'il reste une trentaine de coups à jouer. C'est pessimiste en fin de partie, ce qui est exactement le bon sens de l'erreur : **perdre au temps coûte la partie entière**, alors que réfléchir un peu moins ne coûte que quelques points Elo. L'incrément, lui, est consommé à 80 % : il est renouvelé à chaque coup, il serait absurde de le thésauriser.

## Les mesures

### Le moteur tient-il sa parole ?

```text
$ python3 banc_temps.py 1 20 4
1. Budget de 1.00 s sur 20 positions
   durée médiane 1.029 s, maximum 1.142 s
   dépassements de plus de 5 % : 7/20
   profondeur atteinte : de 2 à 5, moyenne 3.35
```

Sept dépassements sur vingt. Pas de beaucoup (le pire fait 1,142 s au lieu de 1,000), mais sept quand même.

L'explication est dans la granularité du contrôle. On ne consulte l'horloge qu'une fois tous les 256 nœuds, ce qui représente environ 85 millisecondes à notre vitesse. Sur un budget d'une seconde, 85 millisecondes font déjà 8,5 % : le seuil de tolérance de 5 % que le test s'impose est mécaniquement impossible à tenir.

C'est une hypothèse, donc elle se teste. Si elle est juste, le même moteur avec un budget trois fois plus grand devrait rentrer dans les clous sans qu'on touche à une ligne de code :

```text
$ python3 banc_temps.py 3 20 5
1. Budget de 3.00 s sur 20 positions
   durée médiane 3.042 s, maximum 3.078 s
   dépassements de plus de 5 % : 0/20
   profondeur atteinte : de 3 à 6, moyenne 3.85
```

Zéro dépassement, et un maximum à 3,078 s. Le retard absolu est resté le même, autour de 40 à 80 millisecondes ; c'est sa part relative qui a fondu.

La conclusion pratique n'est pas « notre moteur est précis », c'est **« la précision du contrôle de temps est absolue, pas relative »**. Un moteur qui vérifie l'horloge tous les 256 nœuds ne peut pas jouer proprement en dessous d'un budget de quelques dixièmes de seconde, et c'est exactement pour cela qu'on divise le temps restant par trente plutôt que de viser au plus juste.

### Ce que coûte vraiment le travail répété

```text
2. Atteindre la profondeur 4, en direct ou par étapes
   directement à 4   :      84925 nœuds     39.5 s
   par 1, 2, ... 4   :     105816 nœuds     48.8 s
   l'itératif est 1.25x plus cher

2. Atteindre la profondeur 5, en direct ou par étapes
   directement à 5   :     893863 nœuds    423.4 s
   par 1, 2, ... 5   :     936074 nœuds    450.6 s
   l'itératif est 1.05x plus cher
```

Voilà qui mérite d'être dit clairement, parce que ce n'est pas ce qu'on lit d'habitude : **chez nous, l'approfondissement itératif est plus cher que la recherche directe.** De 25 % à profondeur 4, de 5 % à profondeur 5.

Le renseignement du meilleur coup précédent n'annule donc pas le travail répété, il le réduit. Mais la tendance est sans ambiguïté : le surcoût est divisé par cinq quand on gagne une seule profondeur. Il est raisonnable de penser qu'il s'annule un ou deux demi-coups plus loin, et qu'il devient négatif ensuite, aux profondeurs où travaillent les vrais moteurs. Nous n'avons pas pu le vérifier : la profondeur 6 sur vingt positions dépasse l'heure en Python, et une affirmation non mesurée n'a pas sa place ici.

Ce qu'on peut affirmer, c'est que la question du coût est **secondaire**. On ne prend pas l'approfondissement itératif pour aller plus vite. On le prend parce que sans lui, le moteur ne sait pas s'arrêter, et qu'un moteur qui ne sait pas s'arrêter perd toutes ses parties à la pendule quel que soit son niveau de jeu. Cinq pour cent de nœuds en plus est un prix dérisoire pour cela.

## Ce qu'il reste de faux

Notre moteur sait maintenant tenir une pendule. Il lui reste un défaut qui fausse ses évaluations bien plus gravement que tout ce qu'on a corrigé jusqu'ici, et il est inhérent au principe même d'une recherche à profondeur fixe.

À profondeur 4, le moteur examine « je prends sa dame avec mon cavalier », arrive au bout de sa vision, compte +900 et se réjouit. Le cinquième demi-coup, celui qu'il ne cherche pas, est « il reprend mon cavalier ». Le score est faux, et il est faux dans le sens le plus dangereux : il rend le coup attirant.

C'est l'effet d'horizon, et il ne se corrige ni en cherchant plus profond, ni en évaluant mieux. Il se corrige en refusant d'évaluer les positions où ça tape encore.

**Prochain article :** la recherche de quiescence, et les tables de cases. Le moteur cesse de croire aux cadeaux.
