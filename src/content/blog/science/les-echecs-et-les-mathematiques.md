---
title: Les échecs rendent-ils meilleur en maths ? La vérité scientifique
excerpt: >-
  Ce que les expériences disent du transfert vers les maths, et ce qu'un échiquier permet réellement
  d'enseigner : graphes, contraintes, symétries et démonstrations reproductibles.
publishDate: "2026-04-02"
updatedDate: "2026-05-21"
category: science
featured: false
featuredRank: 99
readingTime: 11 min
pillar: Cognition
tags:
  - échecs
  - mathématiques
  - science
  - métacognition
  - calcul
  - tour du cavalier
  - huit dames
  - résolution de problèmes
  - Sala Gobet
seoTitle: "Échecs et mathématiques : vrai transfert ou mythe ? Méta-analyses"
seoDescription: >-
  Échecs et mathématiques : méta-analyse Sala et Gobet, tour du cavalier, problème des huit dames. Ce que la science dit du lien maths-échecs et comment en profiter.
ogImage: /images/og/les-echecs-et-les-mathematiques-v2-og.webp
heroImage:
  src: /images/blog/les-echecs-et-les-mathematiques-v2-hero.webp
  alt: Un cavalier fait face à des formes géométriques, séparés par un pont
    inachevé.
faq:
  - question: "Faire jouer un enfant aux échecs améliore-t-il sa moyenne en maths ?"
    answer: "Ce n'est pas garanti. Les expériences de Sala et Gobet avec contrôle actif ne confirment pas un transfert vers la résolution de problèmes mathématiques."
  - question: "La métacognition est-elle un transfert démontré ?"
    answer: "Observer ton raisonnement est une piste pédagogique utile. Cela ne suffit pas à établir que cette habitude se transfère automatiquement des échecs aux mathématiques."
  - question: "Faut-il un temps minimum par coup pour raisonner ?"
    answer: "Aucun seuil cérébral de 15 à 30 secondes n'est établi ici. Une cadence plus lente te laisse davantage de temps pour expliciter tes choix, sans garantir un bénéfice scolaire."
  - question: "Combien existe-t-il de solutions au problème des huit dames ?"
    answer: "Il existe 92 placements sur l'échiquier 8×8. Le regroupement par symétries donne 12 classes, dont les tailles ne sont pas toutes identiques."
---

Un grand maître n'est pas nécessairement capable de calculer une intégrale plus vite que toi. Et pourtant, l'idée que « les échecs rendent bon en maths » revient dans les écoles et les clubs. L'échiquier offre bien des problèmes mathématiques ; cela ne suffit pas à prouver qu'y jouer améliore automatiquement les résultats scolaires.

## Pourquoi rapprocher les deux disciplines ?

Aux échecs, les règles déterminent les actions possibles et leurs conséquences. Tu ne lances pas de dés pour savoir si ton fou atteindra sa case. Quand tu calcules une variante, tu examines des possibilités puis tu vérifies ce qui résiste aux réponses adverses.

Tu peux rapprocher cette démarche de la résolution d'un problème : comprendre les données, formuler une hypothèse, chercher un contre-exemple, vérifier la conclusion. C'est une analogie de méthode. Elle ne constitue pas une mesure du transfert entre les deux activités.

### Deux problèmes sur un échiquier

Le tour du cavalier consiste à visiter chaque case exactement une fois par les déplacements légaux du cavalier. Si tu représentes les cases par des sommets et les sauts par des arêtes, tu cherches un chemin hamiltonien dans ce graphe. Cette traduction permet de travailler une notion mathématique à partir d'un objet familier, sans affirmer que le problème a fondé à lui seul toute une branche des mathématiques.

### Cavalier : passer d'une règle à un graphe

Repère une case par deux coordonnées entières $(i,j)$. Un saut de cavalier change ces coordonnées de $(\pm1,\pm2)$ ou de $(\pm2,\pm1)$, à condition de rester sur l'échiquier. Cette règle définit les arêtes : deux cases sont reliées si un saut légal permet de passer de l'une à l'autre.

Dans un coin comme a1, seules b3 et c2 sont accessibles. Le nombre de voisins dépend donc de la case. Chercher un parcours demande d'éviter qu'un choix prive ensuite une case de toute possibilité de visite. Une règle locale peut guider cette recherche ; elle doit être distinguée d'une preuve que chaque essai aboutira.

Un chemin hamiltonien visite les **sommets** une fois. Un chemin eulérien cherche à parcourir les **arêtes** une fois. Le tour du cavalier relève du premier problème. Cette distinction peut être enseignée directement avec l'échiquier : l'objet qu'il ne faut pas revisiter est une case, pas seulement une liaison.

### Une preuve de parité à partir des couleurs

Un saut de cavalier change toujours la couleur de la case. Dans un parcours, les couleurs alternent donc. Si un tour est fermé, le dernier sommet rejoint le premier par un saut supplémentaire : le cycle doit avoir autant de cases de chaque couleur.

Sur un échiquier 5 × 5, il y a 25 cases, réparties en 13 et 12 selon la couleur. Un tour fermé est impossible : une alternance cyclique de longueur impaire ne peut pas revenir à la couleur de départ avec un saut qui change de couleur. Cette démonstration n'interdit pas par elle-même un parcours ouvert.

Sur 8 × 8, les deux couleurs comptent 32 cases. La condition nécessaire est satisfaite ; cela ne démontre pas à elle seule l'existence d'un parcours. Tu viens de distinguer une obstruction, une condition nécessaire et une preuve d'existence, trois objets que l'on confond facilement quand on regarde seulement un dessin réussi.

![Tour du cavalier : un parcours qui visite les 64 cases de l’échiquier une seule fois chacune, calculé par l’heuristique de Warnsdorff.](/images/echecs-maths-01-tour-cavalier.svg)

Le problème des huit dames demande de placer huit dames sans qu'elles s'attaquent. La suite A000170 de l'OEIS recense 92 solutions pour huit dames. Les symétries les regroupent en 12 classes ; on ne peut pas simplement multiplier toutes ces classes par huit, car certaines solutions ont elles-mêmes des symétries.

![Exemple de placement de huit dames sans attaque mutuelle.](/images/echecs-maths-02-huit-dames.svg)

C'est un terrain pédagogique pour la recherche avec retour arrière : tu places une dame, vérifies les contraintes, puis reviens sur un choix lorsqu'il bloque la suite. Il ne faut pas en déduire qu'on ne sait construire aucune solution pour un échiquier de taille différente.

### Huit dames : écrire les contraintes

Avec huit dames qui ne s'attaquent pas, chaque ligne et chaque colonne doit contenir exactement une dame. On peut alors représenter un placement par une liste : la valeur à l'indice r donne la colonne de la dame située sur la ligne r.

Deux dames en $(r,c)$ et $(r',c')$ partagent une diagonale lorsque $|r-r'|=|c-c'|$. Une autre écriture utilise les constantes des diagonales : $r-c$ pour une direction et $r+c$ pour l'autre. Ces égalités donnent un test calculable à chaque placement.

Voici un solveur original pour cet exercice. Il explore toutes les colonnes possibles de chaque ligne et abandonne une branche dès qu'elle viole une contrainte. Il ne simule pas une partie d'échecs : il résout le problème de placement défini ci-dessus.

```python
def solutions_dames(n):
    solutions = []

    def placer(choix, colonnes, diagonales_moins, diagonales_plus):
        ligne = len(choix)
        if ligne == n:
            solutions.append(tuple(choix))
            return
        for colonne in range(n):
            if (colonne in colonnes
                    or ligne - colonne in diagonales_moins
                    or ligne + colonne in diagonales_plus):
                continue
            placer(choix + [colonne],
                   colonnes | {colonne},
                   diagonales_moins | {ligne - colonne},
                   diagonales_plus | {ligne + colonne})

    placer([], set(), set(), set())
    return solutions

print(len(solutions_dames(4)))  # 2
print(len(solutions_dames(8)))  # 92
```

Pourquoi ce calcul est-il exhaustif ? Pour la ligne courante, il examine chaque colonne. Il ne retire que les choix déjà en conflit avec une dame placée : ajouter d'autres dames ne ferait pas disparaître ce conflit. Toute solution complète passe donc par une suite de choix autorisés qui sera explorée. Une fois la dernière ligne atteinte, les contraintes vérifiées garantissent que les dames ne s'attaquent pas.

Cette justification est différente de « le programme affiche le nombre attendu ». Le résultat peut être comparé à l'[OEIS A000170](https://oeis.org/A000170), mais expliquer les choix parcourus et les branches écartées reste nécessaire pour comprendre l'algorithme.

### Comprendre les douze classes de symétrie

Tourner le plateau ou le réfléchir transforme une solution en solution. On regroupe ainsi les placements qui se déduisent les uns des autres par les quatre rotations et les réflexions du carré. Certaines transformations peuvent produire le même placement : une classe n'a donc pas obligatoirement huit éléments distincts.

Pour les huit dames, le regroupement donne onze classes de huit placements et une de quatre : $11\times8+4=92$. Le nombre de classes vaut bien douze, mais $12\times8$ surcompterait les placements. Cette décomposition peut être vérifiée en appliquant les huit transformations aux solutions du programme.

Tu peux en faire un exercice de démonstration : expliquer d'abord pourquoi les transformations conservent l'absence d'attaque, puis rechercher celles qui laissent un placement inchangé. L'échiquier sert ici à enseigner les symétries et la notion de regroupement, sans invoquer un effet cognitif général du jeu.

## Compter des suites n'est pas compter des positions

Les vérifications *perft* du projet Stockfish donnent 119 060 324 suites légales de six demi-coups depuis la position initiale, soit trois coups par camp. Plusieurs suites peuvent aboutir à la même position : ce nombre ne compte pas des positions distinctes.

Shannon (1950) propose l'ordre de grandeur $10^{120}$ pour illustrer la taille d'un arbre de parties. C'est une estimation, pas le nombre exact des positions légales. Pour comprendre l'exploration de cet arbre, tu peux lire [minimax](/fr/blog/minimax-aux-echecs/) et [l'article sur la complexité des échecs](/fr/blog/pourquoi-echecs-probleme-mathematique-impossible-et-ia/).

Un arbre de coups devient un arbre de probabilités seulement si tu lui ajoutes un modèle probabiliste. Les règles d'un jeu sans hasard ne donnent pas spontanément une probabilité à chaque réponse de l'adversaire.

## Le point délicat : le transfert vers les maths

Tu peux devenir meilleur à reconnaître des motifs échiquéens sans que cela améliore toutes tes autres capacités. C'est la question du transfert lointain : le bénéfice d'un entraînement dépasse-t-il les tâches proches de ce que tu as pratiqué ?

La synthèse de Sala et Gobet (2017) souligne les limites des preuves et l'importance des groupes de contrôle actifs. Si un groupe suit des cours d'échecs et un autre ne reçoit rien de comparable, l'attention supplémentaire, la nouveauté ou les attentes peuvent contribuer aux écarts.

Dans leurs deux expériences sur la résolution de problèmes mathématiques, Sala et Gobet (2017) ne trouvent pas de bénéfice permettant de confirmer le transfert attendu avec ce type de contrôle. Il serait contradictoire de présenter ensuite la métacognition comme le « seul transfert scientifiquement prouvé » sans preuve spécifique suffisante.

### Deux expériences, avec des comparaisons différentes

Le premier dispositif porte sur 233 élèves de primaire et compare notamment des cours d'échecs à un contrôle actif pratiquant les dames. Le second porte sur 52 élèves et utilise le go comme contrôle actif ; les activités de jeu y remplacent une partie d'heures normalement consacrées aux mathématiques et aux sciences. Les auteurs ne trouvent pas le soutien attendu au transfert vers la résolution de problèmes mathématiques. [Publication originale de Sala et Gobet](https://link.springer.com/article/10.3758/s13420-017-0280-3).

Ce que l'on compare compte autant que le nom de l'activité. Ajouter un atelier à un groupe et comparer ce groupe à une classe sans atelier ne pose pas exactement la même question que remplacer un enseignement par l'atelier. Dans le second cas, on demande aussi si le choix d'utiliser ce temps autrement est bénéfique.

### Pourquoi une corrélation ne tranche pas

Suppose, pour illustrer le raisonnement, qu'une enquête observe de bonnes notes chez les membres d'un club. Plusieurs explications restent possibles : le jeu pourrait contribuer à certaines compétences ; des élèves déjà à l'aise pourraient être plus nombreux à s'inscrire ; un accompagnement familial pourrait favoriser les deux activités. Cet exemple est hypothétique et ne résume pas une enquête particulière.

Une comparaison avant/après sans groupe témoin pose une autre difficulté : les élèves peuvent progresser pendant l'année indépendamment de l'atelier. Un contrôle actif aide à comparer les échecs à une activité qui apporte elle aussi du temps, un encadrement et de la nouveauté.

Une expérience ne répond toutefois qu'aux questions que son dispositif permet de tester : population, durée, contenu des séances et mesure choisie. Un résultat non concluant sur une compétence ne démontre pas que l'activité serait dépourvue de tout intérêt. Il empêche de présenter le bénéfice examiné comme une conséquence établie dans ces conditions.

## Utiliser le jeu comme support de raisonnement

Tu peux néanmoins faire un exercice précis avec une position. Écris ton hypothèse avant de regarder la solution : « Cette tour peut entrer parce que la dernière rangée est faible. » Cherche ensuite la meilleure défense adverse. Si elle réfute ton idée, explique où ton raisonnement a cessé de tenir.

Cette démarche peut aussi être explicitement travaillée en mathématiques. Par exemple : écrire une conjecture, tester un cas qui pourrait la contredire, puis distinguer un exemple favorable d'une démonstration. Le rapprochement devient une activité d'enseignement construite, plutôt qu'un effet supposé du simple fait de jouer.

### Une activité pédagogique dont on sait ce qu'elle enseigne

Pour une séance sur les huit dames, l'objectif peut être : traduire une consigne en contraintes, justifier un retour arrière et vérifier une solution. Demande d'abord un placement sur un petit plateau, puis l'explication des conflits. Le code peut arriver ensuite pour systématiser une méthode déjà comprise.

Pour une séance sur le cavalier, l'objectif peut être : construire un graphe et utiliser la couleur pour produire une obstruction. Tu peux proposer un plateau impair, demander si un tour fermé est possible, puis examiner les arguments. Une tentative qui échoue n'est pas une preuve d'impossibilité ; la parité en fournit une dans le cas étudié.

Voici une grille de travail proposée, sans prétendre qu'elle a été validée par une expérience sur le transfert :

| Objectif annoncé | Production à demander | Vérification possible |
| --- | --- | --- |
| Écrire des contraintes | Équations d'attaque entre deux dames | Tester lignes, colonnes et diagonales |
| Comprendre une recherche exhaustive | Explication des branches conservées et rejetées | Vérifier qu'aucune solution n'est exclue à tort |
| Utiliser une preuve de parité | Argument sur l'alternance des couleurs | Examiner le cas d'un plateau impair |
| Distinguer exemple et preuve | Explication d'une affirmation générale | Chercher un contre-exemple ou un argument exhaustif |

Si tu veux savoir si l'élève maîtrise la notion mathématique au-delà de l'échiquier, donne aussi un problème différent qui la mobilise. Cette évaluation doit correspondre à l'objectif annoncé. Réussir à placer des dames et réussir un autre problème de contraintes sont deux observations à comparer, pas une seule compétence déclarée par avance.

### Le plaisir de jouer reste une raison suffisante pour jouer

Une activité n'a pas besoin de promettre une hausse générale des résultats scolaires pour avoir sa place dans un club. Le plaisir de chercher, la pratique d'un jeu et l'envie de comprendre une position peuvent être des objectifs explicites.

Si l'objectif est d'apprendre les mathématiques, prépare en revanche une activité mathématique et une manière de l'évaluer. Jouer une partie puis attendre un bénéfice scolaire diffus n'est pas équivalent à enseigner les graphes avec les déplacements du cavalier. Cette différence permet de défendre l'intérêt pédagogique de l'échiquier avec une promesse précise et vérifiable.

### Choisir un rythme qui laisse une trace

Une partie lente te laisse davantage de temps pour noter tes candidats et expliquer ton choix. Une partie rapide peut servir à revoir des motifs et à constater ce qui te manque sous pression. Aucun seuil universel de secondes par coup ne permet de déclarer que ton cortex commence enfin à raisonner.

Si ton objectif est scolaire, garde des exercices scolaires et mesure les compétences visées. Si ton objectif est échiquéen, examine tes erreurs de calcul et de compréhension. Dans les deux cas, une progression observable vaut mieux qu'une promesse générale d'intelligence.

## Sources

- OEIS Foundation (s. d.), *A000170: Number of ways of placing n nonattacking queens on an n×n board*, base mathématique, [suite et références](https://oeis.org/A000170).
- Équipe Stockfish (s. d.), *tests/perft.sh*, code officiel de vérification des suites légales, [dépôt](https://github.com/official-stockfish/Stockfish/blob/master/tests/perft.sh).
- Shannon, C. E. (1950), *Programming a Computer for Playing Chess*, Philosophical Magazine, 41, 256–275, [original](https://d1yx3ys82bpsa0.cloudfront.net/chess/programming-a-computer-for-playing-chess.shannon.062303002.pdf).
- Sala, G. et Gobet, F. (2017), *Does chess instruction improve mathematical problem-solving ability? Two experimental studies with an active control group*, Learning & Behavior, [article](https://link.springer.com/article/10.3758/s13420-017-0280-3).
- Sala, G. et Gobet, F. (2017), *Does Far Transfer Exist? Negative Evidence From Chess, Music, and Working Memory Training*, Current Directions in Psychological Science, [synthèse](https://journals.sagepub.com/doi/full/10.1177/0963721417712760).
