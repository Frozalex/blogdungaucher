---
title: "Échecs vs Go : quel jeu demande le plus d'intelligence ?"
excerpt: "Les fans de Go disent que leur jeu est infiniment plus complexe. Les fans d'échecs répondent que c'est différent, pas inférieur. Que disent vraiment les chiffres, la cognition et les IA ?"
publishDate: "2027-01-21"
category: "science"
featured: false
featuredRank: 99
readingTime: "10 min"
pillar: "Théorie des jeux"
tags: ["Go", "AlphaGo", "complexité combinatoire", "IA", "comparaison", "cognition"]
seoTitle: "Échecs vs Go : comparaison complète (complexité, cognition, IA)"
seoDescription: "Quel jeu entre échecs et Go demande le plus d'intelligence ? Complexité combinatoire, cognition humaine, IA : tout le comparatif en une analyse rigoureuse."
keyTakeaways:
  - "Le Go a une complexité combinatoire (≈ 10^170 positions) bien supérieure aux échecs (≈ 10^46), mais ce n'est pas la même grandeur que la complexité de jeu réelle."
  - "Les échecs sont plus tactiques par coup, le Go plus stratégique par phase : les types d'intelligence sollicités diffèrent."
  - "AlphaGo (2016) a marqué la fin de la supériorité humaine au Go avec 20 ans de retard sur Deep Blue (1997) aux échecs."
  - "La culture du Go favorise une approche intuitive et esthétique ; celle des échecs, une approche analytique et calculatoire."
  - "« Quel jeu est le plus intelligent » est une mauvaise question : ils sollicitent des modes cognitifs différents."
faq:
  - question: "Le Go est-il vraiment plus complexe que les échecs ?"
    answer: "Mathématiquement oui : 10^170 positions possibles au Go contre 10^46 aux échecs. Mais la complexité de jeu (celle qui compte humainement) dépend du nombre de coups envisageables à chaque tour, des plans stratégiques et de la profondeur de calcul nécessaire — et là, les deux jeux sont à des niveaux extrêmes."
  - question: "Pourquoi a-t-il fallu 20 ans de plus à l'IA pour battre les humains au Go ?"
    answer: "Parce que les algorithmes minimax (qui ont gagné aux échecs) sont inefficaces au Go : trop de coups à explorer à chaque tour. Il a fallu attendre l'apprentissage profond (deep learning) avec AlphaGo en 2016 pour franchir la barrière."
  - question: "Quel jeu est le plus dur à apprendre ?"
    answer: "Les règles du Go sont plus simples (poser une pierre, capturer par encerclement). Mais la stratégie est plus floue : pas de pièces avec des rôles définis, pas de roi à protéger directement. La courbe d'apprentissage est plus longue au Go."
  - question: "Lequel développe le plus le cerveau ?"
    answer: "Aucune étude solide n'a démontré qu'un des deux jeux développe plus le cerveau que l'autre. Ils sollicitent des modes différents : calcul concret aux échecs, intuition spatiale au Go."
---

C'est l'une des comparaisons les plus emblématiques dans le monde des jeux de stratégie. Les amateurs de Go disent souvent : « les échecs, c'est mignon, mais le Go est *infiniment* plus profond ». Les joueurs d'échecs répondent : « c'est différent, ce n'est pas inférieur ». Et la conversation tourne en rond.

L'objectif de cet article n'est pas de trancher qui a raison — c'est de poser les vrais critères de comparaison et de regarder ce que disent les chiffres, la cognition et l'histoire de l'intelligence artificielle.

## La complexité combinatoire : avantage net au Go

Commençons par le critère le plus quantifiable.

**Aux échecs**, le nombre de positions légales possibles est estimé à environ **10^46**. C'est ce qu'on appelle la borne de Shannon (Claude Shannon, 1950).

**Au Go (sur 19×19)**, ce nombre monte à environ **10^170**. C'est plus que le nombre d'atomes dans l'univers observable (≈ 10^80).

L'écart est vertigineux : le Go a environ **10^124 fois plus de positions possibles** que les échecs. C'est un facteur si grand qu'il n'a pas de nom courant.

Pourquoi cette différence ? Deux raisons mécaniques :

1. **La taille du plateau** : 64 cases aux échecs, 361 cases au Go.
2. **Le facteur de branchement** : à chaque coup, un joueur d'échecs a en moyenne 35 coups légaux. Un joueur de Go en a souvent 200-250.

Cette différence se voit dans les arbres de recherche. Une recherche à 4 coups d'avance, c'est 35^8 ≈ 1,5 milliard de positions aux échecs. Au Go, c'est 200^8 ≈ 2,5 × 10^18 — plus d'un milliard de fois plus.

Sur le pur critère combinatoire, le Go gagne sans discussion.

## Mais la complexité combinatoire n'est pas tout

Plus grand ne veut pas dire plus difficile *humainement*. Voici pourquoi.

Aux échecs, chaque pièce a une fonction définie (tour, fou, dame…) et le roi crée un objectif immédiat — le mat. Cette structure rend le calcul concret : on cherche des séquences forcées, des menaces, des défenses.

Au Go, il n'y a qu'un type de pierre. Pas de roi. Pas d'objectif unique. L'évaluation d'une position repose presque entièrement sur l'estimation des territoires futurs — qui est *floue*, non séquentielle, intuitive.

Cette différence se traduit cognitivement : les échecs récompensent un cerveau qui calcule des séquences. Le Go récompense un cerveau qui évalue des configurations spatiales.

Ce sont deux types d'intelligence — pas deux niveaux d'une même intelligence.

## Ce que l'histoire de l'IA nous apprend

C'est probablement l'angle le plus révélateur.

**Aux échecs**, l'IA bat les humains depuis 1997 avec [Deep Blue contre Kasparov](https://fr.wikipedia.org/wiki/Deep_Blue). La méthode : recherche minimax + fonctions d'évaluation heuristiques + base de fins de partie. Pas de réseau de neurones. Juste du calcul brute force optimisé.

**Au Go**, il a fallu attendre 2016 et [AlphaGo](https://fr.wikipedia.org/wiki/AlphaGo) pour battre un joueur de top niveau ([Lee Sedol](https://fr.wikipedia.org/wiki/Lee_Sedol)). Pourquoi 20 ans d'écart ? Précisément parce que le minimax brute force ne marche pas au Go : trop de branches à explorer.

Il a fallu inventer une approche radicalement différente : combiner Monte-Carlo Tree Search (exploration probabiliste de l'arbre) + réseaux de neurones convolutifs (évaluation intuitive des positions).

Cette histoire dit quelque chose de profond. Aux échecs, l'intelligence humaine pouvait être imitée par du calcul. Au Go, il a fallu *apprendre à apprendre*, à reproduire une intuition. C'est une preuve indirecte que le Go sollicite des compétences cognitives plus subtiles que les échecs.

Mais attention à l'inversion : *imitable par calcul* ne veut pas dire *simple humainement*. Les meilleurs joueurs d'échecs humains sont aux limites de la cognition humaine. Le fait que les machines les dépassent ne réduit pas la difficulté du jeu pour les humains.

## La cognition du joueur expérimenté

[Fernand Gobet](https://en.wikipedia.org/wiki/Fernand_Gobet) (cité ici aussi) et plusieurs équipes ont comparé les modes cognitifs des experts aux deux jeux. Les résultats sont nets :

- **Experts en échecs** : forte mémoire de motifs (chunks) de positions logiques, calcul rapide de séquences, fonctions exécutives très entraînées.
- **Experts en Go** : excellente reconnaissance de formes spatiales, intuition rapide de la « valeur » des zones, faible recours au calcul brut.

L'imagerie cérébrale montre des activations différentes : les échecs activent davantage les régions préfrontales latérales (calcul, planification), le Go davantage les régions pariétales (cognition spatiale, traitement intuitif).

Ce sont des cerveaux entraînés différemment, pas un cerveau plus ou moins « fort ».

## La culture et le récit

Une dimension souvent oubliée : les deux jeux véhiculent des cultures qui colorent la perception.

Les échecs, jeu européen, sont culturellement associés à la rationalité, au calcul, à l'analyse logique. Le récit autour du jeu valorise le « bon coup », l'innovation théorique, la précision technique.

Le Go, jeu asiatique, est associé à des notions plus floues mais aussi plus prestigieuses dans certains discours : harmonie, équilibre, beauté du jeu. Le récit dominant est esthétique avant d'être performatif.

Cette différence de récit influence fortement le débat « lequel est plus intelligent ». Le Go bénéficie d'une aura mystique qui le fait paraître plus profond. Les échecs souffrent (ou bénéficient) d'une lisibilité plus brutale.

Les chiffres et les études ne valident ni n'invalident ces récits. Mais ils contextualisent : juger un jeu par son aura culturelle n'est pas la même chose que le juger par sa difficulté objective.

## Quel jeu est plus dur à apprendre ?

Voici une réponse précise :

**Pour le débutant** : le Go est plus accessible (règles plus simples, pas de coups illégaux subtils comme la prise en passant ou la promotion).

**Pour l'intermédiaire** : les échecs progressent plus vite vers un sentiment de maîtrise. Les structures sont plus tangibles, le « pourquoi de chaque coup » plus facile à expliquer.

**Pour atteindre un niveau de classement raisonnable** (équivalent à 1 800 Elo / 1 dan amateur) : les deux jeux demandent à peu près le même investissement temps (estimé à 1 000-2 000 heures).

**Pour atteindre le niveau professionnel** : le Go demande une discipline d'apprentissage plus exigeante, parce que la rétroaction est plus floue. On peut faire des erreurs subtiles pendant 50 coups sans s'en rendre compte. Aux échecs, une erreur tactique est généralement visible dans les 5 coups suivants.

## La réponse honnête

Si tu cherches absolument à hiérarchiser :

- Sur la pure complexité mathématique : le Go gagne, et de loin.
- Sur la difficulté humaine : les deux sont aux limites de la cognition.
- Sur le calcul brut : les échecs demandent plus de calcul concret.
- Sur l'intuition spatiale : le Go en demande plus.
- Sur l'élégance esthétique : c'est subjectif, mais le Go en bénéficie davantage culturellement.

La meilleure réponse à « quel jeu est le plus intelligent ? » est probablement : ce n'est pas la bonne question. Les deux jeux sollicitent des intelligences différentes, à un niveau de difficulté comparable. Préférer l'un ou l'autre relève du tempérament cognitif (calculateur vs intuitif) plus que d'une supériorité objective.

## En résumé

Le Go a une complexité combinatoire incomparablement supérieure aux échecs (10^124 fois plus de positions). Cette difficulté a forcé l'IA à inventer des approches nouvelles. Mais traduit en termes de difficulté humaine, les deux jeux sont à des niveaux extrêmes — ils sollicitent des modes cognitifs différents (calcul aux échecs, intuition spatiale au Go).

Le débat « lequel est plus intelligent » est mal posé. Les deux jeux récompensent des cerveaux entraînés à des tâches différentes, et la culture qui entoure chaque jeu pèse plus dans la perception que les critères objectifs. Le choix entre les deux est une question de goût cognitif, pas de hiérarchie.
