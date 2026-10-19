---
title: "Sujet Grand Oral Maths : pourquoi la recherche exhaustive aux échecs est-elle hors de portée pratique ?"
excerpt:
  "Valeur sous jeu parfait, explosion combinatoire et limites des preuves d'impossibilité : trois notions à distinguer."
publishDate: "2026-05-05"
category: grand-oral
featured: false
featuredRank: 99
readingTime: "7 min"
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
seoTitle: "Grand Oral Maths : Zermelo et la complexité des échecs"
seoDescription: "Valeur sous jeu parfait, nombre de Shannon et recherche exhaustive : distingue existence d’une solution et difficulté de calcul pour ton Grand Oral Maths."
ogImage: /images/og/sujet-grand-oral-maths-zermelo-complexite-watermarked-og.webp
heroImage:
  src: /images/blog/sujet-grand-oral-maths-zermelo-complexite-watermarked-hero.webp
  alt: Des rangées de pupitres vides dans un amphithéâtre de cours.
  credit: Paul The Writer, CC0, via Wikimedia Commons
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

$$35^{80}\approx 3,35\times 10^{123}.$$

Les hypothèses diffèrent : il ne faut pas écrire que ce calcul est exactement égal au nombre de Shannon. Un demi-coup est le déplacement d'un seul joueur ; un coup complet comprend un coup blanc et un coup noir.

Le modèle régulier donne un nombre de feuilles $b^d$ à profondeur d. Les branchements réels varient, certaines parties se terminent plus tôt et des suites différentes peuvent atteindre une même position.

## Recherche, réutilisation et complexité

L'élagage évite des branches inutiles pour le résultat recherché. Les tables de transposition réutilisent des informations sur des états déjà rencontrés. Ces méthodes montrent pourquoi compter toutes les suites n'équivaut pas à démontrer le coût minimal de toute méthode possible.

Fraenkel et Lichtenstein (1981) établissent un résultat EXPTIME-complet pour une généralisation appropriée des échecs sur des échiquiers de taille variable. Ce résultat asymptotique ne s'applique pas comme une preuve d'impossibilité à l'unique échiquier fixé de 8 × 8 cases.

Les classes de complexité comparent des familles de problèmes. Elles ne classent pas le nombre fixe de positions d'une seule instance comme s'il s'agissait d'une variable tendant vers l'infini.

## Ce que les limites pratiques permettent de conclure

L'ordre de grandeur de Shannon suffit à montrer pourquoi une exploration naïve de suites jusqu'au bout est hors de portée pratique. Il ne prouve pas qu'aucun raisonnement, aucune réduction ou aucune organisation différente du calcul ne pourrait un jour établir la valeur initiale.

Les comparaisons avec des limites physiques exigent des hypothèses sur les opérations, le matériel et les ressources. Un grand nombre seul n'est pas un théorème d'impossibilité universelle. Il n'est pas nécessaire d'invoquer une borne de Bremermann mal chiffrée pour expliquer la difficulté.

## Une démonstration miniature à expliquer pas à pas

Tu peux expliquer l'induction rétrograde sur un arbre fictif à deux choix. Les Blancs choisissent A ou B. Après A, les Noirs disposent de deux réponses menant respectivement à une victoire blanche et à une nulle. Après B, leurs réponses conduisent respectivement à une nulle et à une défaite blanche.

Attribue les valeurs **+1** au gain blanc, **0** à la nulle et **−1** à la défaite blanche. Au nœud noir suivant A, le minimum de +1 et 0 vaut 0. Au nœud noir suivant B, le minimum de 0 et −1 vaut −1. Les Blancs choisissent ensuite le maximum de 0 et −1 : **0**. Dans ce modèle, leur meilleur choix garantit la nulle, même si une coopération adverse permettrait de gagner.

Cet exemple construit ne décrit pas une partie réelle. Il permet de démontrer la différence entre « une branche gagne » et « une stratégie garantit un gain ». Il explique aussi pourquoi regarder seulement la réponse favorable ne résout pas le jeu.

## Pourquoi les parties finissent dans le modèle moderne

Les mouvements de pions sont en nombre limité et les captures réduisent le nombre de pièces. Entre deux événements de ce type, la règle d'arrêt automatique des 75 coups de chaque joueur limite la durée d'une séquence sans progrès matériel. Ces éléments permettent d'expliquer la finitude sans inventer un nombre maximal exact de coups.

Pour définir un état correctement, la disposition des pièces ne suffit pas. Il faut connaître le trait, les droits de roque, la possibilité de prise en passant et les informations nécessaires aux règles de nulle. Deux diagrammes visuellement identiques peuvent donc ne pas représenter exactement le même état de jeu.

Cette précision compte pour les transpositions : réutiliser un résultat exige de savoir quelles informations influencent encore les coups légaux et l'issue. « Même image » et « même problème » ne sont pas toujours équivalents.

## Dériver l'explosion avec les puissances et les logarithmes

Dans un arbre régulier fictif à b choix par nœud et de profondeur d, il y a b choix au premier niveau, $b^2$ au deuxième et $b^d$ au dernier. Le total des nœuds jusqu'à d, pour b différent de 1, est :

$$1+b+b^2+\cdots+b^d=\frac{b^{d+1}-1}{b-1}.$$

Pour retrouver l'ordre de grandeur de $35^{80}$, utilise $\log_{10}(35^{80})=80\log_{10}(35)\approx123,5254$. La partie entière donne l'exposant 123 ; la partie décimale donne environ $10^{0,5254}\approx3,35$. Tu obtiens bien environ $3,35\times10^{123}$, avec les hypothèses du modèle.

Tu peux faire varier un seul paramètre : passer de 80 à 82 demi-coups multiplie le nombre de feuilles par $35^2=1225$. Ce calcul montre pourquoi ajouter un seul coup complet peut coûter énormément dans ce modèle. Il ne signifie pas que chaque position réelle possède exactement 35 réponses.

## Algorithme rapide, connaissance et preuve : trois ambitions

Un moteur peut trouver un excellent coup sans avoir exploré l'arbre jusqu'à toutes ses fins. Une fonction d'évaluation, un ordre de recherche et des coupures orientent le calcul. Cela répond à une question de jeu pratique : quel coup choisir avec les ressources disponibles ? Résoudre la position initiale demanderait d'établir sa valeur sous jeu parfait.

L'existence de tables de finales illustre une autre démarche : partir de positions avec peu de pièces et calculer leurs issues selon des conventions précises. Leur succès sur un sous-ensemble n'établit pas que l'ensemble du jeu est déjà résolu. Il montre que certaines régions du problème peuvent être traitées exactement.

Dans une preuve, les défenses adverses ne doivent pas disparaître parce qu'elles sont peu naturelles. En jeu pratique, l'algorithme peut privilégier ce qui paraît prometteur. Cette différence entre performance et garantie répond à une objection fréquente du jury : « Si les moteurs nous battent, pourquoi les échecs ne sont-ils pas résolus ? »

## Préparer les questions difficiles

**« Le nombre de Shannon est-il exact ? »** Non : explique les hypothèses d'un ordre de grandeur et distingue suites et états. **« EXPTIME signifie-t-il impossible ? »** Non : il s'agit d'une classe de complexité pour une famille variable, pas d'une interdiction de calculer toute instance finie. **« Une nulle probable est-elle une nulle prouvée ? »** Non : une conviction issue de l'expérience ne remplace pas une stratégie garantie.

Tu peux organiser l'exposé autour de l'arbre miniature, du calcul par logarithmes et de ces distinctions. Les notions historiques ou informatiques servent d'ouverture ; les calculs que tu sais expliquer constituent le cœur mathématique. Chronomètre ta propre version et conserve le détail technique pour les questions, sans présenter le texte entier comme une durée de lecture garantie.

## Conclusion pour ta présentation

Tu peux répondre : une valeur théorique existe dans le modèle fini, tandis que la recherche exhaustive naïve présente une explosion combinatoire. L'existence, le coût d'un algorithme donné et l'impossibilité de toute solution sont trois affirmations distinctes.

Développe cet enchaînement sur tes dix minutes de présentation, avec un petit arbre calculé à la main et le modèle $35^{80}$. Pour approfondir les exemples, consulte le [guide Maths](/fr/blog/grand-oral-maths-spe-echecs/).

## Sources

- Zermelo, E. (1913), *Über eine Anwendung der Mengenlehre auf die Theorie des Schachspiels*, actes du congrès de 1912, traduction et étude dans Schwalbe, U. et Walker, P. (2001), *Zermelo and the Early History of Game Theory*, Games and Economic Behavior, 34, 123–137. [Texte et traduction](https://people.math.harvard.edu/~elkies/FS23j.03/zermelo.pdf).
- Shannon, C. E. (1950), *Programming a Computer for Playing Chess*, Philosophical Magazine, 41, 256–275. [Article](https://d1yx3ys82bpsa0.cloudfront.net/chess/programming-a-computer-for-playing-chess.shannon.062303002.pdf).
- Fraenkel, A. S. et Lichtenstein, D. (1981), *Computing a perfect strategy for n×n chess requires time exponential in n*, Journal of Combinatorial Theory A, 31, 199–214. [Article](https://kubokovac.eu/zlozitost/mat/chessExptime.pdf).
- FIDE (2023), *FIDE Laws of Chess*, article 9.6. [Règles officielles](https://handbook.fide.com/chapter/e012023).
- Ministère de l'Éducation nationale (2026), *Baccalauréat : comment se passe le Grand oral ?* [Format](https://www.education.gouv.fr/reussir-au-lycee/baccalaureat-comment-se-passe-le-grand-oral-100028).
