---
title: "Échecs vs Go : quel jeu demande le plus d'intelligence ?"
excerpt: "Les fans de Go disent que leur jeu est infiniment plus complexe. Les fans d'échecs répondent que c'est différent, pas inférieur. Que disent vraiment les chiffres, la cognition et les IA ?"
publishDate: "2027-02-08"
category: "science"
featured: false
featuredRank: 99
affiliate: true
readingTime: "12 min"
pillar: "Théorie des jeux"
tags: ["Go", "AlphaGo", "complexité combinatoire", "IA", "comparaison", "cognition"]
seoTitle: "Échecs vs Go : comparaison complète (complexité, cognition, IA)"
seoDescription: "Quel jeu entre échecs et Go demande le plus d'intelligence ? Complexité combinatoire, cognition humaine, IA : tout le comparatif en une analyse rigoureuse."
keyTakeaways:
  - "Le Go a une complexité combinatoire bien supérieure aux échecs, mais ce n'est pas la même grandeur que la complexité de jeu réelle."
  - "Les échecs sont plus tactiques par coup, le Go plus stratégique par phase : les types d'intelligence sollicités diffèrent."
  - "AlphaGo (2016) a marqué la fin de la supériorité humaine au Go avec 20 ans de retard sur Deep Blue (1997) aux échecs."
  - "La culture du Go favorise une approche intuitive et esthétique ; celle des échecs, une approche analytique et calculatoire."
  - "'Quel jeu est le plus intelligent' est une mauvaise question : ils sollicitent des modes cognitifs différents."
faq:
  - question: "Le Go est-il vraiment plus complexe que les échecs ?"
    answer: "Combinatoirement, oui : environ 10^170 positions légales contre 10^46 aux échecs. Mais la complexité d'un jeu pour un humain ne se réduit pas au nombre de positions. La recherche cognitive montre que les deux jeux sollicitent des mécanismes de haut niveau différents, et que ni l'un ni l'autre n'est 'plus dur' dans l'absolu."
  - question: "AlphaGo a-t-il résolu le Go ?"
    answer: "Non. AlphaGo et ses successeurs (AlphaZero, KataGo) jouent bien au-delà du niveau humain, mais le Go reste non résolu au sens mathématique : on ne connaît pas le résultat parfait avec jeu optimal des deux côtés."
  - question: "Peut-on être fort aux deux ?"
    answer: "Oui, mais c'est rare. Les compétences se chevauchent partiellement (pattern recognition, mémoire de situations), mais les heuristiques de chaque jeu interfèrent souvent. La plupart des très bons joueurs se spécialisent sur un seul jeu."
heroImage:
  src: "/images/og-default.png"
  alt: "Échiquier face à un goban : deux philosophies du jeu"
ogImage: "/images/og-default.png"
---

Il y a une question que les joueurs des deux camps ressortent à chaque rencontre : lequel des deux jeux est le plus complexe ? Les amateurs de Go montrent les chiffres astronomiques de leur espace de jeu. Les joueurs d'échecs répondent que leur jeu exige une précision tactique que le Go ne connaît pas. Les deux ont partiellement raison. Et la question elle-même est mal posée.

Ce comparatif ne cherche pas à couronner un vainqueur. Il cherche à comprendre ce que chaque jeu demande vraiment au cerveau humain, et ce que leurs trajectoires respectives face à l'intelligence artificielle nous apprennent sur la nature de ces exigences.

## La complexité combinatoire : les chiffres et ce qu'ils ne disent pas

Le nombre de parties légalement jouables aux échecs est estimé entre 10^120 et 10^123, ce qu'on appelle le nombre de Shannon. L'espace des positions légales atteint environ 10^46. Ce sont des chiffres vertigineux.

Au Go, sur un goban de 19x19, le nombre de positions légales dépasse 10^170. Le nombre de parties possibles est encore plus grand. Pour mettre ces chiffres en perspective : le nombre d'atomes dans l'univers observable est d'environ 10^80. Le Go surpasse les atomes de l'univers, pas les échecs.

Mais qu'est-ce que cela signifie vraiment pour un joueur humain ?

Rien de direct. Un joueur humain ne parcourt pas l'arbre des possibles de manière exhaustive. Il évalue des positions, reconnaît des structures, applique des heuristiques. La complexité combinatoire absolue dit peu de choses sur la complexité cognitive réelle de chaque jeu. Ce qui compte, c'est la granularité des décisions et la profondeur de l'horizon stratégique perçu par un joueur de haut niveau.

Sur ce point, les deux jeux sont différents plutôt qu'inégaux.

## Ce que les échecs demandent spécifiquement

Les études cognitives sur les joueurs d'échecs sont nombreuses depuis les travaux fondateurs d'Adriaan de Groot dans les années 1940. Ses expériences ont montré que les grands maîtres ne calculent pas plus de coups que les joueurs amateurs : ils calculent mieux, en sélectionnant immédiatement les branches pertinentes.

Ce mécanisme repose sur ce qu'on appelle aujourd'hui la reconnaissance de motifs. Un grand maître a mémorisé entre 50 000 et 100 000 structures positionnelles, selon les estimations de Chase et Simon (1973). Face à une position, son cerveau effectue une correspondance rapide avec ces templates, ce qui oriente instantanément sa recherche vers les coups candidats utiles.

Ce qui rend les échecs exigeants, c'est la précision tactique. Une séquence de 7 coups peut transformer une position légèrement meilleure en position gagnante ou perdante. L'évaluation d'une position aux échecs est souvent binaire à haute précision : il y a un meilleur coup ou une ligne principale, que l'on doit trouver. Cette exigence de précision est unique.

Les fonctions cognitives les plus sollicitées aux échecs sont les fonctions exécutives (planification, inhibition, flexibilité), la mémoire de travail visuo-spatiale, et le raisonnement déductif séquentiel.

## Ce que le Go demande différemment

Le Go se joue sur un [goban](https://amzn.to/44EReyb) vierge. Les premiers coups n'ont pas de valeur tactique immédiate visible : ils établissent des influences, des territoires potentiels, des directions de jeu. Un débutant regarde un goban en cours de partie et ne comprend pas comment l'évaluer. Un maître voit des structures globales, des équilibres de territoire et de force.

Ce que les études cognitives montrent au Go, c'est que l'expertise repose davantage sur une évaluation holistique des positions globales, plutôt que sur le calcul de séquences précises. Les top joueurs de Go calculent des séquences tactiques dans les combats locaux (les "ladders", les captures en séquence), mais l'essentiel de leur supériorité réside dans l'évaluation stratégique globale, difficile à formaliser.

Michael Redmond, l'un des rares joueurs occidentaux à avoir atteint le niveau 9 dan professionnel, décrit la décision en Go comme une intuition raisonnée : on sent que telle zone est plus urgente, que tel coup crée une harmonie globale, sans pouvoir toujours le calculer explicitement.

Cette dimension intuitive et globale est précisément ce qui a rendu le Go si difficile pour les algorithmes de type alpha-beta utilisés aux échecs. Ces algorithmes parcourent un arbre de recherche et évaluent des positions. Au Go, l'espace de branchement est beaucoup trop grand, et les positions trop difficiles à évaluer localement.

## La leçon de l'intelligence artificielle

La trajectoire des IA dans les deux jeux est instructive.

Deep Blue bat Kasparov en 1997. L'approche est celle de la force brute guidée par des heuristiques : évaluation de position codée à la main, recherche alpha-beta massivement parallèle. Les échecs se révèlent relativement accessibles à cet algorithme parce que l'espace de branchement est gérable et les positions évaluables avec des critères matériels et positionnels clairs.

AlphaGo bat Lee Sedol en 2016, vingt ans plus tard. Et l'approche est radicalement différente : réseaux de neurones entraînés sur des millions de parties humaines, puis perfectionnés par apprentissage par renforcement contre elle-même. AlphaGo n'évalue pas les positions avec des critères codés à la main : elle a développé une forme d'intuition positionnelle par exposition massive.

Ce décalage de vingt ans n'est pas dû à la paresse des informaticiens. Il est dû à la nature de chaque jeu. Les échecs se prêtaient aux approches analytiques classiques. Le Go nécessitait une IA capable d'intuition holistique, ce qui n'a été possible qu'avec le deep learning.

AlphaZero, publiée par DeepMind en 2017, joue aux deux jeux. En partant de zéro et en s'entraînant uniquement par auto-jeu, elle atteint un niveau surhumain aux échecs en 4 heures et au Go en 8 heures. Ce résultat suggère que les deux jeux demandent des formes d'apprentissage similaires dans leur architecture profonde, même si les stratégies de surface diffèrent.

## Les profils cognitifs comparés

Des études en neurosciences cognitives ont tenté de caractériser les joueurs experts dans les deux jeux. Les résultats sont convergents sur un point : les deux jeux recrutent fortement le cortex préfrontal et les régions liées à la mémoire de motifs (régions occipito-pariétales et temporales).

Les différences émergent dans les détails. Les joueurs d'échecs montrent une activation plus marquée des régions liées au calcul séquentiel et au raisonnement déductif. Les joueurs de Go montrent une activation plus distribuée, avec une participation plus grande des régions liées à l'évaluation holistique et à l'intégration spatiale globale.

Il ne faut pas sur-interpréter ces différences : elles reflètent les exigences de chaque jeu, pas des différences d'intelligence générale. Un grand joueur d'échecs et un grand joueur de Go ont tous deux des cerveaux qui traitent l'information de manière exceptionnelle. Ils l'ont simplement entraîné dans des directions partiellement différentes.

## Pourquoi la question est mal posée

"Quel jeu demande le plus d'intelligence ?" suppose qu'il existe un facteur général d'intelligence que les jeux mesurent et développent. La recherche cognitive invalide cette idée depuis plusieurs décennies.

L'intelligence est multiple, contextualisée, dépendante des domaines. Les joueurs d'échecs sont exceptionnellement bons à évaluer des positions tactiques et à planifier des séquences. Les joueurs de Go sont exceptionnellement bons à évaluer des équilibres territoriaux et à prendre des décisions sous ambiguïté profonde. Ces deux formes d'excellence ne se comparent pas sur une échelle unique.

Ce qui est certain : les deux jeux sont parmi les activités cognitives les plus exigeantes que l'être humain ait inventées. Dire que l'un est "plus difficile" que l'autre revient à demander si l'escalade est plus difficile que la natation. Ça dépend de qui vous êtes, de comment vous apprenez, et de ce que vous entendez par difficile.

## Ce que chaque jeu enseigne à l'autre

Les joueurs qui ont sérieusement pratiqué les deux rapportent des apprentissages croisés partiels mais réels.

Les échecs enseignent au joueur de Go une rigueur tactique dans les combats locaux. Les séquences de capture, les menaces doubles, le calcul précis d'une séquence en ko : ces outils se transfèrent partiellement du joueur d'échecs vers le Go.

Le Go enseigne au joueur d'échecs une lecture stratégique globale et une tolérance à l'ambiguïté. Un joueur d'échecs qui aborde le Go avec son instinct d'évaluation locale se perd rapidement. Apprendre à évaluer une situation globale sans certitude immédiate est une compétence que le Go développe mieux que les échecs.

Les deux jeux partagent enfin quelque chose d'essentiel : ils exigent de leur pratiquant une honnêteté radicale face à ses propres erreurs. Une partie d'échecs ou de Go se conclut par une vérité sans appel. Pas de chance, pas d'excuse. Cette vertu épistémique est commune aux deux traditions, et c'est peut-être la plus précieuse de tout ce que ces jeux transmettent.
