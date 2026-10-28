---
title: "Sujet Grand Oral NSI : Pourquoi AlphaZero représente-t-il une rupture dans l'intelligence artificielle ?"
excerpt:
  "Réseau, recherche MCTS et auto-jeu : comprendre AlphaZero, son protocole de 2017 et ses différences avec MuZero et AlphaFold."
publishDate: "2026-05-08"
category: grand-oral
featured: false
featuredRank: 99
readingTime: "7 min"
pillar: Grand Oral
tags:
  - grand-oral
  - NSI
  - terminale
  - baccalauréat
  - sujet
  - AlphaZero
  - intelligence artificielle
  - apprentissage par renforcement
  - réseaux de neurones
  - MCTS
seoTitle: "Grand Oral NSI : comprendre AlphaZero et ses limites"
seoDescription: "Réseau de neurones, recherche MCTS et auto-jeu : comprends AlphaZero, son protocole de 2017 et ses différences avec MuZero et AlphaFold pour ton Grand Oral NSI."
ogImage: /images/og/sujet-grand-oral-nsi-alphazero-watermarked-og.webp
heroImage:
  src: /images/blog/sujet-grand-oral-nsi-alphazero-watermarked-hero.webp
  alt: Un espace de travail contemporain dans une bibliothèque, sous un plafond
    lumineux.
  credit: Szalax, CC0, via Wikimedia Commons
  sourceUrl: https://commons.wikimedia.org/wiki/File:University_of_Miskolc_Library_Reading_Room_2025_01.jpg
  license: CC0

---

Pourquoi AlphaZero représente-t-il une étape importante dans l'intelligence artificielle appliquée aux jeux ? Tu peux répondre en expliquant comment une recherche dans un arbre est associée à un apprentissage. L'enjeu n'est pas d'opposer une machine programmée à une machine qui n'aurait reçu aucune intervention humaine.

## Partir de la recherche classique

Un minimax attribue des valeurs aux feuilles puis fait remonter les choix des deux joueurs. Avec une profondeur limitée, une fonction d'évaluation estime les positions qui ne sont pas des fins de partie.

L'élagage alpha-bêta peut éviter certaines branches sans changer le résultat de cette recherche sous les mêmes hypothèses. Les moteurs réels ajoutent des choix de recherche et des optimisations ; ils ne parcourent pas uniformément toutes les positions.

Il faut aussi dater la comparaison. Le Stockfish 8 affronté en 2017 diffère du Stockfish actuel. L'annonce officielle de Stockfish 12 en 2020 documente l'adoption d'une évaluation par réseau NNUE. « Stockfish sans apprentissage contre AlphaZero avec apprentissage » n'est donc pas une opposition intemporelle.

## Un réseau qui guide la recherche

Dans le préprint AlphaZero de 2017, un réseau produit une politique sur les actions et une estimation de valeur. Il guide une recherche MCTS, qui équilibre l'exploration et l'utilisation des informations accumulées.

Le réseau évite d'avoir à jouer chaque simulation jusqu'à la fin avec des coups aléatoires : son estimation contribue à l'évaluation des feuilles. MCTS n'est donc pas ici un abandon de l'arbre, mais une autre manière d'en organiser l'exploration.

AlphaZero apprend par auto-jeu. Les résultats des parties et les distributions issues de la recherche fournissent des cibles d'entraînement. Cette boucle dépend de choix humains : règles, représentation, architecture, objectif et procédure d'apprentissage.

## Lire correctement le résultat de 2017

Le préprint rapporte 28 victoires, 72 nulles et aucune défaite sur 100 parties contre Stockfish 8. Cela représente 64 points sur 100, donc 64 % des points possibles, mais 28 % de victoires.

La comparaison utilise une minute par coup. La courbe d'apprentissage dépasse le niveau de Stockfish après environ quatre heures dans les conditions décrites ; ce repère n'est pas la durée totale de tous les entraînements ni une durée reproductible sur un ordinateur personnel.

Le résultat appartient à un protocole avec des versions et du matériel précis. Il ne suffit pas à classer toutes les versions ultérieures des deux approches.

## Généralité et limites

La même méthode est étudiée sur les échecs, le shogi et le go, avec des entraînements propres à chaque jeu. Un réseau entraîné aux échecs ne sait pas spontanément jouer aux autres.

MuZero est présenté dans un préprint de novembre 2019, environ deux ans après celui d'AlphaZero. Schrittwieser et ses collègues y associent la planification à un modèle appris des quantités utiles à la décision. Il ne s'agit pas d'une évolution publiée quelques mois après 2017.

Il faut enfin distinguer AlphaFold. Le document scientifique du comité Nobel présente la prédiction de structures protéiques comme une tâche distincte, avec ses méthodes et ses données. Ce n'est pas AlphaZero transféré directement aux protéines, ni une simulation générale de toute leur dynamique de repliement.

Le Nobel de chimie 2024 récompense David Baker pour la conception computationnelle de protéines, et Demis Hassabis et John Jumper pour la prédiction de structures. Omettre Baker fausse le partage du prix.

## Décomposer la boucle d'apprentissage

Pour expliquer AlphaZero, sépare **jouer une partie**, **explorer avant de choisir** et **modifier les paramètres du réseau**. Ces opérations se répondent mais ne sont pas identiques. La recherche choisit un coup avec le modèle disponible ; l'apprentissage utilise les expériences produites pour modifier ce modèle.

Le [préprint de Silver et collègues (2017)](https://arxiv.org/html/1712.01815v1) décrit un réseau qui fournit une distribution sur les coups et une estimation de la valeur d'une position. La recherche arborescente emploie ces informations pour orienter les explorations. Les parties d'auto-jeu fournissent ensuite les cibles d'entraînement : les décisions de recherche et l'issue de la partie. Les règles légales et la définition du résultat sont données au système.

C'est pourquoi « il apprend seul » demande une précision. Le programme n'invente ni le déplacement des pièces ni son architecture matérielle. Les chercheurs définissent la représentation, la recherche et l'optimisation ; l'apprentissage ajuste les paramètres à partir des parties produites. L'absence de parties humaines dans cet entraînement ne signifie pas l'absence de conception humaine.

## Un exemple numérique pour distinguer politique et résultat de recherche

**Exemple fictif, sans sortie réelle d'AlphaZero.** Dans une position, le réseau attribue aux coups A, B et C les probabilités 0,60, 0,30 et 0,10. Ce sont des priorités initiales, pas des probabilités de victoire ni la preuve que A est le meilleur.

Après cent visites illustratives, la recherche a exploré A trente fois, B soixante fois et C dix fois. La distribution des visites devient 0,30, 0,60 et 0,10. L'exemple montre comment la recherche peut s'écarter du premier avis du réseau. Ces chiffres inventés ne décrivent pas un résultat publié ni une règle universelle de choix du coup.

Tu peux l'expliquer au jury en deux phrases : le réseau apporte une estimation fondée sur l'apprentissage ; la recherche la confronte à des continuations de la position actuelle. La boucle d'entraînement peut ensuite exploiter cette recherche améliorée. L'intérêt réside dans l'interaction, pas dans une opposition simpliste entre intuition sans calcul et calcul sans connaissances.

## Pourquoi le point de vue de la valeur doit être explicite

Imaginons qu'une feuille de recherche soit favorable au joueur qui a le trait. En remontant d'un demi-coup, le joueur considéré change. Si tu utilises une valeur définie du point de vue du joueur au trait, le signe doit être traité en conséquence. Si tu conserves toujours le point de vue des Blancs, c'est la règle de comparaison qui doit tenir compte du camp qui choisit.

C'est une difficulté classique dans les programmes de jeu, et un bon point de discussion NSI : une erreur de convention peut faire préférer à un programme des positions favorables à son adversaire. Le problème n'est pas résolu par la présence d'un réseau de neurones ; il faut une représentation et des calculs cohérents.

Pour une démonstration personnelle, un petit arbre à deux niveaux suffit. Inscris des valeurs fictives aux feuilles, annonce le point de vue et fais remonter les préférences. Tu peux contrôler chaque opération à la main. Un tel modèle ne reproduit pas AlphaZero, mais prouve que tu comprends une contrainte fondamentale d'un jeu à deux camps.

## Comparer équitablement deux programmes

Un score de match dépend de la version des programmes, du matériel, du temps par coup, des réglages et des conditions de départ. Dire seulement « l'un calcule moins de positions » ne compare pas le coût d'une position évaluée par les deux architectures.

Distingue également un résultat annoncé dans le préprint de 2017 de la situation actuelle des moteurs. L'annonce officielle de [Stockfish 12 en 2020](https://stockfishchess.org/blog/2020/stockfish-12/) documente l'intégration d'une évaluation NNUE. Opposer pour toujours un Stockfish « sans apprentissage » à un AlphaZero « neuronal » empêcherait de comprendre les approches hybrides.

Dans ton dossier, date donc chaque comparaison et annonce sa portée. Tu peux expliquer une rupture historique dans une méthode sans déclarer quel logiciel est aujourd'hui le plus fort ni lui attribuer un score que tu n'as pas vérifié.

## Questions de jury et réponses délimitées

**« Pourquoi ne pas utiliser seulement le réseau ? »** Parce qu'une estimation apprise peut être complétée par une recherche propre à la position. Le réseau et la recherche n'ont pas la même fonction.

**« AlphaZero résout-il les échecs ? »** Non : une performance contre un adversaire donné ne prouve pas la valeur exacte de la position initiale contre toutes les réponses légales.

**« Peut-on appliquer directement ce système à toute décision ? »** Il faut pouvoir définir des états, des actions, un retour d'apprentissage et un moyen de produire des expériences. Dans la vie réelle, les règles, les conséquences et les informations ne sont pas toujours aussi accessibles qu'aux échecs.

**« Que peux-tu programmer toi-même ? »** Tu peux présenter un petit moteur de recherche et un arbre contrôlable, en expliquant les limites de cette maquette. Mieux vaut une démonstration dont tu maîtrises chaque étape qu'un réseau complexe que tu ne saurais ni entraîner ni expliquer.

## Construire tes dix minutes

Présente une petite recherche à la main, explique les deux sorties du réseau puis la boucle d'auto-jeu. Termine par une limite : matériel, dépendance au domaine ou interprétation d'un protocole. Les prolongements vers MuZero et AlphaFold servent à comparer des tâches, pas à raconter une filiation technique unique.

Pour le détail de minimax et alpha-bêta, utilise le [guide NSI](/fr/blog/guide-grand-oral-echecs-nsi/).


## Sources

- Silver, D. et al. (2017), *Mastering Chess and Shogi by Self-Play with a General Reinforcement Learning Algorithm*, préprint arXiv. [Article](https://arxiv.org/html/1712.01815v1).
- Équipe Stockfish (2020), *Stockfish 12*, annonce officielle. [NNUE](https://stockfishchess.org/blog/2020/stockfish-12/).
- Schrittwieser, J. et al. (2019), *Mastering Atari, Go, Chess and Shogi by Planning with a Learned Model*, préprint arXiv. [Résumé original](https://arxiv.org/abs/1911.08265).
- Académie royale des sciences de Suède (2024), *Scientific Background on the Nobel Prize in Chemistry 2024*. [Document officiel](https://www.kva.se/app/uploads/2024/10/sciback_ke_en_24_vi3ng84ao4.pdf).
- Ministère de l'Éducation nationale (2026), *Baccalauréat : comment se passe le Grand oral ?* [Format](https://www.education.gouv.fr/reussir-au-lycee/baccalaureat-comment-se-passe-le-grand-oral-100028).
