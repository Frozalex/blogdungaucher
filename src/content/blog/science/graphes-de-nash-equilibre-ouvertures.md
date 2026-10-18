---
title: "Graphes de Nash : équilibre et ouvertures aux échecs"
excerpt: "Pourquoi certaines ouvertures durent des décennies sans être réfutées ? L'équilibre de Nash explique la stabilité des variantes théoriques et la logique profonde des ouvertures d'échecs."
publishDate: "2026-05-11"
updatedDate: "2026-05-21"
category: "science"
featured: false
featuredRank: 99
readingTime: "12 min"
pillar: "Mathématiques"
tags: ["Nash", "équilibre", "ouvertures", "théorie des jeux", "échecs", "défense berlinoise", "Kramnik 2000", "trembling-hand", "mathématiques"]
seoTitle: "Équilibre de Nash et ouvertures : pourquoi l'Espagnole dure 200 ans"
seoDescription: "Sicilienne, défense berlinoise, refinements de Selten : comment l'équilibre de Nash explique la stabilité des ouvertures d'échecs et leurs ruptures célèbres."
faq:
  - question: Une ouverture populaire est-elle un équilibre de Nash démontré ?
    answer: >-
      Non. La popularité, une évaluation de moteur ou une nulle entre champions ne prouvent pas une stratégie optimale contre toutes les réponses.
  - question: Pourquoi représenter les positions par un graphe ?
    answer: >-
      Des ordres de coups peuvent mener à la même position. Le graphe des configurations peut aussi contenir des cycles ;
      il faut préciser les droits de roque, la prise en passant et l’historique nécessaire aux règles de nulle.
  - question: Varier mes ouvertures suffit-il à former un équilibre mixte ?
    answer: >-
      Non. Une distribution de choix est une stratégie mixte dans un modèle défini. Pour démontrer un équilibre,
      il faut aussi établir que personne ne gagne à dévier seul selon les gains du modèle.
  - question: Une évaluation égale prouve-t-elle la nulle ?
    answer: >-
      Une estimation de moteur à profondeur limitée ne suffit pas. Une preuve doit couvrir les réponses légales pertinentes et les règles de fin de partie.
---

Pourquoi certaines ouvertures restent-elles jouées malgré des décennies d’analyse ? L’équilibre de Nash donne un langage pour réfléchir aux stratégies, mais il ne transforme pas une variante populaire en théorème.

Le titre « graphes de Nash » sert ici de rapprochement pédagogique. Il ne désigne pas une théorie standard qui aurait démontré la correction de la Sicilienne ou de la Berlinoise.

## Ce que Nash définit

Dans *Non-Cooperative Games* (1951), John Nash décrit un profil de stratégies où aucun joueur ne peut améliorer son gain en changeant seul de stratégie, les autres gardant la leur. L’article occupe les pages 286 à 295, soit dix pages ; il ne faut pas le confondre avec sa courte note de 1950.

Une stratégie est une manière de choisir dans les situations du jeu, pas seulement le nom du premier coup. Le théorème d’existence pour les jeux finis autorise des stratégies mixtes ; il ne fournit pas automatiquement les coups optimaux d’une partie d’échecs.

## Ce que cela signifie sur l’échiquier

Dans le modèle usuel à somme nulle, chaque camp préfère gagner à faire nulle et faire nulle à perdre. L’analyse minimax présentée par Russell et Norvig recherche une stratégie contre les meilleures réponses adverses.

Une ligne jugée « égale » par un moteur exprime autre chose : une estimation avec une méthode et un budget de recherche. Une partie nulle entre deux champions est encore une autre information. Ni l’une ni l’autre ne prouve, à elle seule, que toutes les déviations possibles ont été couvertes.

Tu peux donc parler d’un équilibre pratique de préparation, à condition de signaler que c’est une image. Si une nouveauté change l’évaluation d’une ligne, c’est notre connaissance qui a changé ; un équilibre mathématiquement prouvé n’est pas réfuté par une simple mode théorique.

## Arbre des parties, graphe des positions

Un arbre conserve séparément les suites de coups. Un graphe peut réunir les suites qui aboutissent à une même position : ce sont les transpositions. Il doit aussi préciser ce qu’il appelle une position.

La disposition des pièces ne suffit pas toujours. Le trait, les droits de roque ou de prise en passant peuvent changer les coups légaux. Pour appliquer toutes les règles de nulle, il faut encore conserver des informations d’historique.

Le graphe des configurations peut avoir des cycles. Des cavaliers peuvent sortir puis revenir à leurs cases de départ. Un arbre qui conserve tout l’historique de la partie ne confond pas ces occurrences. Il serait donc trompeur de qualifier sans précision tout graphe d’ouvertures d’« acyclique ».

![Trois représentations à distinguer : suite de coups, position partagée par transposition et historique nécessaire aux règles.](/images/nash-03-graphe-transpositions.svg)

## Les finales et les valeurs calculées

Les bases de finales peuvent fournir une valeur exacte dans leur domaine et selon leurs conventions. Il faut distinguer gain/nulle/perte, distance au mat et distance à une remise à zéro du compteur des coups. La documentation Syzygy insiste sur les règles de nulle : une distance de table n’est pas toujours un nombre de coups gagnants dans toute situation de tournoi.

Cette précision rend les finales intéressantes pour discuter les modèles : quelle information décrit l’état, quelle règle termine la partie et quelle grandeur est calculée ?

## Varier ton répertoire : une décision pratique

Si tu affrontes souvent la même personne, varier tes ouvertures peut rendre sa préparation moins ciblée. Cela ne prouve pas qu’un mélange de 50 %, 30 % et 20 % soit un équilibre de Nash, ni qu’il existe un seuil universel de cinq heures d’étude par semaine pour choisir un répertoire.

Tu peux regarder ce que chaque changement te coûte : connais-tu les plans qui suivent ? Peux-tu expliquer les positions auxquelles tu arrives ? Gagnes-tu une surprise au prix d’une position que tu ne comprends pas ? Ces questions suffisent pour organiser un choix de pratique.

## Résultat sportif et modèle

Une nulle peut convenir ou non selon le classement du tournoi. Cela peut changer les préférences que tu souhaites représenter dans un modèle. Il faut les définir avant d’annoncer un nouvel équilibre.

Dans le modèle strictement à somme nulle, les deux joueurs ne peuvent pas augmenter simultanément leur gain. Importer sans précaution le dilemme du prisonnier ou une amélioration collective de type Pareto brouille donc l’analyse.

Pour approfondir : [la théorie des jeux](/fr/blog/theorie-des-jeux-aux-echecs/), [minimax](/fr/blog/minimax-aux-echecs/) et [Zermelo](/fr/blog/paradoxe-de-zermelo/).

## Sources

- Nash, J. (1951). *Non-Cooperative Games*. Annals of Mathematics, 54(2), 286–295. [Article](https://irving.vassar.edu/faculty/gj/FTU/io/literature/Nash51.pdf).
- Russell, S., & Norvig, P. (s. d., chapitre en ligne). *Adversarial Search*. Artificial Intelligence: A Modern Approach. [Chapitre](https://aima.cs.berkeley.edu/4th-ed/pdfs/newchap06.pdf).
- Projet Syzygy (s. d.). *probetool — documentation des métriques de finales*. GitHub. [Documentation](https://github.com/syzygy1/probetool).
