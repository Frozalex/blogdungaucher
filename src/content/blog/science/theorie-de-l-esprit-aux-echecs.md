---
title: "La théorie de l'esprit aux échecs : le piège est une croyance fausse"
excerpt: >-
  Anticiper une erreur suppose une hypothèse sur l’adversaire, pas un accès direct à ses pensées.
  Théorie de l’esprit, pièges et modèles comme Maia : distinguer le calcul, la prédiction et les croyances.
publishDate: "2027-03-23"
category: science
featured: false
featuredRank: 99
readingTime: "7 min"
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
seoDescription: "Théorie de l'esprit, fausse croyance et pièges aux échecs : distinguer l'hypothèse sur un adversaire, le calcul classique et la prédiction de coups humains par Maia."
faq:
  - question: "Qu’est-ce que la théorie de l’esprit ?"
    answer: "Le concept désigne l'attribution d'états mentaux à soi-même et à autrui, par exemple des croyances ou intentions. Premack et Woodruff l'ont formulé en 1978."
  - question: "Poser un piège prouve-t-il qu’on lit l’esprit adverse ?"
    answer: "Non. Tu peux prédire un coup à partir d'habitudes observées sans connaître avec certitude la croyance de l'autre. Le piège peut aussi fonctionner indépendamment de cette prédiction."
  - question: "Les programmes peuvent-ils modéliser les humains ?"
    answer: "Oui. Maia est entraîné sur des parties humaines pour prédire des coups selon le niveau. Cela ne démontre pas qu'il possède une expérience mentale humaine, mais réfute l'idée que toute modélisation d'un adversaire serait impossible pour un programme."
  - question: "Minimax cherche-t-il à exploiter une erreur particulière ?"
    answer: "Le minimax classique choisit selon les meilleures réponses dans l'arbre étudié. Un modèle probabiliste de l'adversaire poursuit une autre fonction de choix ; les deux approches peuvent être comparées."
heroImage:
  src: /images/blog/theorie-de-l-esprit-aux-echecs-hero.webp
  alt: Deux profils séparés par un écran regardent des objets différents.
ogImage: /images/og/theorie-de-l-esprit-aux-echecs-og.webp

---

La théorie de l'esprit concerne l'attribution d'états mentaux à autrui. Aux échecs, elle invite à distinguer les réponses que la position autorise et les idées que l'on suppose présentes dans la réflexion de l'adversaire.

Préparer un piège demande ainsi de raisonner sur une possibilité de jeu et, parfois, sur une erreur attendue. Cette attente reste une hypothèse. L'enjeu est de comprendre sa place dans la décision sans lui donner la même certitude qu'à une variante vérifiée.

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

La propriété d'un algorithme ne devient pas une impossibilité générale des machines : un programme peut aussi être conçu pour prédire ou exploiter des erreurs humaines.

## Maia : prédire des coups humains

McIlroy-Young et ses collègues (2020) présentent Maia, un réseau entraîné sur des parties humaines pour mieux prédire leurs coups, avec une adaptation au niveau des joueurs. Leur travail distingue aussi la prédiction d'erreurs de la recherche du meilleur coup.

C'est un exemple de modélisation du comportement. Cela ne démontre pas une conscience, une intention ressentie ou une théorie de l'esprit au sens psychologique complet. Mais cela suffit à montrer qu'un programme peut estimer ce qu'un humain est susceptible de jouer.

La frontière utile est donc l'objectif du modèle : chercher une valeur sous la meilleure défense, ou prédire le comportement d'une population ou d'un joueur. Tu peux comparer leurs recommandations sans transformer une différence d'objectif en impossibilité informatique.

## Rester prudent avec tes propres modèles

Une habitude observée dans quelques parties n'est pas une règle permanente. Ton adversaire peut apprendre, changer de répertoire ou simplement choisir un autre coup aujourd'hui.

Sépare les observations (« il a joué vite dans ces positions ») des interprétations (« il refuse tout risque »). Évite aussi d'assimiler les neurones miroirs à une explication complète de la compréhension des intentions ; [l'article dédié](/fr/blog/neurones-miroirs-aux-echecs/) distingue ces questions.

Pour ta préparation, un modèle adverse reste une aide à tester. Il doit laisser une place aux meilleures défenses, surtout lorsque ton idée ne marche que sur une erreur.

## Distinguer information publique et analyse privée

Les pièces et les coups sont visibles dans une partie classique. En revanche, tu ne vois pas directement les variantes que l'adversaire a calculées, ses intentions ni ses hésitations. Le jeu peut donc être à information parfaite au sens des règles tout en comportant une incertitude sur le raisonnement de l'autre.

Une nouveauté d'ouverture illustre cette différence : les deux joueurs peuvent lire la même position, mais l'un l'a étudiée et l'autre la découvre. Le coup reste légal pour les deux. Ce qui diffère est la préparation, pas l'accès visuel à une pièce cachée.

Tu peux utiliser cette asymétrie pour choisir une position pratique. Mais tu dois garder deux évaluations distinctes : la qualité du coup contre une bonne défense et ta prédiction de ce que l'adversaire jouera. La seconde ne doit pas faire disparaître la première.

## Un piège comporte toujours une branche où l'autre ne coopère pas

Voici un exemple d'ouverture légal, utilisé comme exercice pédagogique : **1.e4 e5 2.Dh5 Cc6 3.Fc4**. Les Blancs menacent **Dxf7#** si les Noirs ne répondent pas à la menace. Après **3...Cf6??**, **4.Dxf7#** fonctionne ; après **3...g6**, la dame blanche est attaquée et doit réagir.

Ce contraste ne recommande pas la sortie précoce de la dame comme répertoire universel. Il montre que prédire une faute et vérifier une menace sont deux opérations différentes. Si tu ne regardes que Cf6, tu analyses une coopération ; si tu examines aussi g6, tu demandes ce que ton idée vaut lorsque l'adversaire voit le problème.

Même si le piège réussit, plusieurs explications restent possibles : l'adversaire a oublié la menace, mal suivi la diagonale du fou, joué trop vite ou cru disposer d'une défense. Sans autre information, le résultat ne dit pas laquelle est vraie. L'analyse de la position est certaine sur le mat ; l'interprétation de l'état mental reste une hypothèse.

## Ce que Maia prédit, et ce qu'il ne lit pas

Le travail de McIlroy-Young et ses collègues compare des modèles sur leur capacité à prédire des coups humains. La réussite consiste à retrouver le coup effectivement joué dans les données, avec une adaptation au niveau. Ce critère diffère de la qualité du coup sous meilleure défense.

Une prédiction juste n'établit pas que le modèle représente explicitement la croyance particulière de la personne. Une prédiction fausse ne prouve pas davantage que le joueur est irrationnel : le modèle représente des régularités et peut manquer des informations de contexte.

Pour évaluer une telle approche, demande sur quelles parties elle a été entraînée et sur quelles parties elle est testée. Un bon résultat sur une population ne devient pas automatiquement une prédiction fiable d'un adversaire précis lors d'une ronde décisive. Le protocole permet une comparaison utile sans résoudre toute la psychologie humaine.

## Le raisonnement sur l'autre peut aider et tromper

« Il aime attaquer » peut te pousser à examiner une menace pertinente ; cela peut aussi te faire oublier une simplification raisonnable. Un style décrit une tendance observée dans certaines positions, pas une obligation permanente.

À l'entraînement, écris deux réponses : celle que tu attends et celle qui gêne le plus ton coup. Si elles diffèrent, examine les deux. Cette consigne proposée permet de garder une place au calcul objectif tout en utilisant ton expérience de l'adversaire.

Après la partie, pose une question ouverte plutôt qu'une accusation : « Qu'avais-tu envisagé après ce coup ? » Le témoignage peut corriger ton modèle, tout en restant un souvenir imparfait. Il ne fournit pas une mesure directe de toutes les croyances présentes pendant la ronde.

## Une théorie psychologique n'est pas une supériorité morale

Piéger ne signifie pas forcément tromper une personne sur les règles ou se moquer de son niveau. Une ressource tactique fait partie du jeu. Tu peux exploiter une erreur tout en respectant ton adversaire et le règlement.

Inversement, appeler un coup « psychologique » ne le rend pas bon. Lorsque la meilleure défense réfute ton idée, tu dois décider si le risque pratique est acceptable ; aucun mot de cognition ne transforme cette réfutation en avantage. La qualité de ton modèle adverse se juge sur des prédictions et des corrections, sans prétendre accéder directement à l'esprit de l'autre.

## Sources

- Premack, D. et Woodruff, G. (1978), *Does the chimpanzee have a theory of mind?*, Behavioral and Brain Sciences, 1(4), 515–526, [résumé original de la revue](https://www.cambridge.org/core/journals/behavioral-and-brain-sciences/article/doesthe-chimpanzee-havea-theory-of-mind/1E96B02CD9850016B7C93BC6D2FEF1D0).
- McIlroy-Young, R., Sen, S., Kleinberg, J. et Anderson, A. (2020), *Aligning Superhuman AI with Human Behavior: Chess as a Model System*, KDD, [article des auteurs](https://www.cs.toronto.edu/~ashton/pubs/maia-kdd2020.pdf).
