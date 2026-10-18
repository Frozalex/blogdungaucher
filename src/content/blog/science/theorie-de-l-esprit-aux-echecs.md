---
title: "La théorie de l'esprit aux échecs : le piège est une croyance fausse"
excerpt: >-
  Poser un piège suppose de se représenter ce que l'adversaire croit, et de savoir que cette croyance
  est fausse. C'est exactement la compétence que les psychologues testent chez l'enfant de quatre ans.
  C'est aussi la seule chose que les moteurs ne savent pas faire.
publishDate: "2027-03-23"
category: science
featured: false
featuredRank: 99
readingTime: 9 min
pillar: Cognition
tags:
  - théorie de l'esprit
  - fausse croyance
  - pièges
  - Premack
  - moteurs d'échecs
  - cognition sociale
  - échecs
seoTitle: "Théorie de l'esprit aux échecs : modéliser ce que l'adversaire croit"
seoDescription: >-
  Ce qu'est la théorie de l'esprit, ce que la tâche de fausse croyance mesure, et pourquoi poser un
  piège aux échecs est un acte cognitif qu'aucun moteur ne peut accomplir.
faq:
  - question: "Qu’est-ce que la théorie de l’esprit ?"
    answer: "Le concept désigne l'attribution d'états mentaux à soi-même et à autrui, par exemple des croyances ou intentions. Premack et Woodruff l'ont formulé en 1978."
  - question: "Poser un piège prouve-t-il qu’on lit l’esprit adverse ?"
    answer: "Non. Tu peux prédire un coup à partir d'habitudes observées sans connaître avec certitude la croyance de l'autre. Le piège peut aussi fonctionner indépendamment de cette prédiction."
  - question: "Les programmes peuvent-ils modéliser les humains ?"
    answer: "Oui. Maia est entraîné sur des parties humaines pour prédire des coups selon le niveau. Cela ne démontre pas qu'il possède une expérience mentale humaine, mais réfute l'idée que toute modélisation d'un adversaire serait impossible pour un programme."
  - question: "Minimax cherche-t-il à exploiter une erreur particulière ?"
    answer: "Le minimax classique choisit selon les meilleures réponses dans l'arbre étudié. Un modèle probabiliste de l'adversaire poursuit une autre fonction de choix ; les deux approches peuvent être comparées."
---

Tu vois une prise tentante que ton adversaire pourrait jouer. Si elle perd, tu peux espérer qu'il tombe dans le piège. Mais tu ne sais pas directement ce qu'il a vu : tu fais une hypothèse à partir de la position et de ce que tu connais de lui.

## Attribuer une croyance

Premack et Woodruff (1978) définissent la théorie de l'esprit par l'attribution d'états mentaux à soi-même et aux autres. Ces états ne sont pas observés directement ; ils servent à expliquer ou prédire une conduite.

Un exemple simple : une personne a rangé un objet dans une boîte, puis quelqu'un l'a déplacé sans qu'elle le voie. Prédire où elle cherchera demande de distinguer ce que tu sais de ce qu'elle peut croire. Cet exemple illustre une question de fausse croyance ; il ne fixe pas un âge universel de réussite ni un diagnostic à partir d'une seule réponse.

Aux échecs, tu peux également distinguer ton information de celle que tu attribues à l'autre. Encore faut-il ne pas confondre ton hypothèse et une certitude sur son esprit.

## Un piège ne démontre pas un mécanisme unique

Tu peux tendre un piège parce que tu connais une erreur fréquente dans une ouverture, parce que tu as observé une habitude précise, ou parce que la menace est difficile à voir. Il n'est pas nécessaire d'avoir une représentation complète des croyances adverses pour chaque décision.

Un coup solide peut aussi contenir un piège. Inversement, un coup inférieur peut simplement dégrader tes chances si l'adversaire le réfute. Aucun résultat cité ne prouve qu'à niveau égal le meilleur coup selon une analyse précise serait en général un choix pratique inférieur.

Pour travailler ce point, écris la réponse que tu attends et la ressource adverse que tu crains. Après la partie, compare avec ce qui a été joué. Tu évalues ainsi une prédiction, sans prétendre avoir lu une pensée.

## Ce que le moteur classique optimise

La recherche minimax évalue les meilleures réponses dans l'arbre exploré, selon sa profondeur et ses valeurs. Elle ne fournit pas automatiquement un modèle personnel de l'adversaire. Cela n'implique pas que tous les programmes possibles soient incapables d'en utiliser un.

L'ancienne version passait de cette propriété d'un algorithme à une impossibilité générale des machines : « aucun moteur ne peut poser de piège ». Cette conclusion ne tient pas.

## Maia : prédire des coups humains

McIlroy-Young et ses collègues (2020) présentent Maia, un réseau entraîné sur des parties humaines pour mieux prédire leurs coups, avec une adaptation au niveau des joueurs. Leur travail distingue aussi la prédiction d'erreurs de la recherche du meilleur coup.

C'est un exemple de modélisation du comportement. Cela ne démontre pas une conscience, une intention ressentie ou une théorie de l'esprit au sens psychologique complet. Mais cela suffit à montrer qu'un programme peut estimer ce qu'un humain est susceptible de jouer.

La frontière utile est donc l'objectif du modèle : chercher une valeur sous la meilleure défense, ou prédire le comportement d'une population ou d'un joueur. Tu peux comparer leurs recommandations sans transformer une différence d'objectif en impossibilité informatique.

## Rester prudent avec tes propres modèles

Une habitude observée dans quelques parties n'est pas une règle permanente. Ton adversaire peut apprendre, changer de répertoire ou simplement choisir un autre coup aujourd'hui.

Sépare les observations (« il a joué vite dans ces positions ») des interprétations (« il refuse tout risque »). Évite aussi d'assimiler les neurones miroirs à une explication complète de la compréhension des intentions ; [l'article dédié](/fr/blog/neurones-miroirs-aux-echecs/) distingue ces questions.

Pour ta préparation, un modèle adverse reste une aide à tester. Il doit laisser une place aux meilleures défenses, surtout lorsque ton idée ne marche que sur une erreur.

## Sources

- Premack, D. et Woodruff, G. (1978), *Does the chimpanzee have a theory of mind?*, Behavioral and Brain Sciences, 1(4), 515–526, [résumé original de la revue](https://www.cambridge.org/core/journals/behavioral-and-brain-sciences/article/doesthe-chimpanzee-havea-theory-of-mind/1E96B02CD9850016B7C93BC6D2FEF1D0).
- McIlroy-Young, R., Sen, S., Kleinberg, J. et Anderson, A. (2020), *Aligning Superhuman AI with Human Behavior: Chess as a Model System*, KDD, [article des auteurs](https://www.cs.toronto.edu/~ashton/pubs/maia-kdd2020.pdf).
