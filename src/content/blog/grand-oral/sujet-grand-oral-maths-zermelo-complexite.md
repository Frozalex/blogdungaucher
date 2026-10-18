---
title: "Sujet Grand Oral Maths : pourquoi la recherche exhaustive aux échecs est-elle hors de portée pratique ?"
excerpt:
  "Valeur sous jeu parfait, explosion combinatoire et limites des preuves d'impossibilité : trois notions à distinguer."
publishDate: "2026-05-05"
category: grand-oral
featured: false
featuredRank: 99
readingTime: 7 min
pillar: Grand Oral
tags:
  - grand-oral
  - mathématiques
  - terminale
  - baccalauréat
  - sujet
  - Zermelo
  - complexité
  - théorie des jeux
  - force brute
seoTitle: "Sujet Grand Oral Maths Zermelo complexité échecs : texte complet à réciter"
seoDescription: >-
  Sujet Grand Oral Maths sur le théorème de Zermelo et la complexité, entièrement rédigé pour 10 minutes d'exposé.
  Force brute, jeu parfait, limites physiques : copie d'examen prête à utiliser.
ogImage: /images/og/sujet-grand-oral-maths-zermelo-complexite-og.webp
heroImage:
  src: /images/blog/sujet-grand-oral-maths-zermelo-complexite-hero.webp
  alt: >-
    Des rangées de pupitres vides dans un amphithéâtre de cours.
  credit: "Paul The Writer, CC0, via Wikimedia Commons"
  sourceUrl: https://commons.wikimedia.org/wiki/File:Rows_of_Desks_in_Lecture_Theatre.jpg
  license: CC0
---

Les échecs ont-ils une valeur théorique que nous pourrions calculer ? La question relie une démonstration d'existence à une difficulté de calcul. Elle ne permet pas d'affirmer que les mathématiques auraient prouvé l'impossibilité de toute résolution future.

## Un résultat sous jeu parfait

Dans un jeu fini à deux joueurs, à information parfaite et sans hasard, on peut attribuer une valeur aux issues puis la faire remonter dans l'arbre. À chaque nœud, le joueur choisit la continuation qui lui est la plus favorable. Cette induction rétrograde donne la formulation moderne d'une stratégie optimale.

Le travail de Zermelo paraît en 1913 dans les actes du congrès de Cambridge de 1912. La traduction et l'étude de Schwalbe et Walker permettent de distinguer son argument original de cette présentation pédagogique moderne.

Pour les échecs avec les règles d'arrêt automatique modernes, les parties sont finies. Les cinq répétitions et les 75 coups de chaque joueur sans mouvement de pion ni capture jouent ici un rôle différent des réclamations de nulle pour triple répétition ou 50 coups. Le mat au dernier coup a priorité dans le cas prévu par la règle des 75 coups.

L'existence d'une valeur ne dit pas laquelle vaut la position initiale : victoire des Blancs, victoire des Noirs ou nulle. Elle ne fournit pas immédiatement une méthode praticable pour la déterminer.

## Un ordre de grandeur de l'arbre

Shannon (1950) estime un ordre de grandeur d'environ $10^{120}$ pour les suites de jeu dans son raisonnement. Ce n'est pas un dénombrement exact de toutes les parties légales, ni le nombre de positions distinctes.

Si tu prends à titre de modèle 35 choix à chacun de 80 demi-coups, tu obtiens :

$$35^{80}\approx 3,39\times 10^{123}.$$

Les hypothèses diffèrent : il ne faut pas écrire que ce calcul est exactement égal au nombre de Shannon. Un demi-coup est le déplacement d'un seul joueur ; un coup complet comprend un coup blanc et un coup noir.

Le modèle régulier donne un nombre de feuilles $b^d$ à profondeur d. Les branchements réels varient, certaines parties se terminent plus tôt et des suites différentes peuvent atteindre une même position.

## Recherche, réutilisation et complexité

L'élagage évite des branches inutiles pour le résultat recherché. Les tables de transposition réutilisent des informations sur des états déjà rencontrés. Ces méthodes montrent pourquoi compter toutes les suites n'équivaut pas à démontrer le coût minimal de toute méthode possible.

Fraenkel et Lichtenstein (1981) établissent un résultat EXPTIME-complet pour une généralisation appropriée des échecs sur des échiquiers de taille variable. Ce résultat asymptotique ne s'applique pas comme une preuve d'impossibilité à l'unique échiquier fixé de 8 × 8 cases.

Les classes de complexité comparent des familles de problèmes. Elles ne classent pas le nombre fixe de positions d'une seule instance comme s'il s'agissait d'une variable tendant vers l'infini.

## Ce que les limites pratiques permettent de conclure

L'ordre de grandeur de Shannon suffit à montrer pourquoi une exploration naïve de suites jusqu'au bout est hors de portée pratique. Il ne prouve pas qu'aucun raisonnement, aucune réduction ou aucune organisation différente du calcul ne pourrait un jour établir la valeur initiale.

Les comparaisons avec des limites physiques exigent des hypothèses sur les opérations, le matériel et les ressources. Un grand nombre seul n'est pas un théorème d'impossibilité universelle. Il n'est pas nécessaire d'invoquer une borne de Bremermann mal chiffrée pour expliquer la difficulté.

## Conclusion pour ta présentation

Tu peux répondre : une valeur théorique existe dans le modèle fini, tandis que la recherche exhaustive naïve présente une explosion combinatoire. L'existence, le coût d'un algorithme donné et l'impossibilité de toute solution sont trois affirmations distinctes.

Développe cet enchaînement sur tes dix minutes de présentation, avec un petit arbre calculé à la main et le modèle $35^{80}$. Pour approfondir les exemples, consulte le [guide Maths](/fr/blog/grand-oral-maths-spe-echecs/).

## Sources

- Zermelo, E. (1913), *Über eine Anwendung der Mengenlehre auf die Theorie des Schachspiels*, actes du congrès de 1912, traduction et étude dans Schwalbe, U. et Walker, P. (2001), *Zermelo and the Early History of Game Theory*, Games and Economic Behavior, 34, 123–137. [Texte et traduction](https://studylib.net/doc/28166551/zermelo-work).
- Shannon, C. E. (1950), *Programming a Computer for Playing Chess*, Philosophical Magazine, 41, 256–275. [Article](https://d1yx3ys82bpsa0.cloudfront.net/chess/programming-a-computer-for-playing-chess.shannon.062303002.pdf).
- Fraenkel, A. S. et Lichtenstein, D. (1981), *Computing a perfect strategy for n×n chess requires time exponential in n*, Journal of Combinatorial Theory A, 31, 199–214. [Article](https://kubokovac.eu/zlozitost/mat/chessExptime.pdf).
- FIDE (2023), *FIDE Laws of Chess*, article 9.6. [Règles officielles](https://handbook.fide.com/chapter/e012023).
- Ministère de l'Éducation nationale (2026), *Baccalauréat : comment se passe le Grand oral ?* [Format](https://www.education.gouv.fr/reussir-au-lycee/baccalaureat-comment-se-passe-le-grand-oral-100028).
