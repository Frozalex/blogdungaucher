---
title: Les échecs rendent-ils meilleur en maths ? La vérité scientifique
excerpt: >-
  Jouer aux échecs te rend bon en maths ? La réponse n'est pas celle que tu attends, et elle change radicalement ce que
  tu devrais faire avec un échiquier.
publishDate: "2026-04-02"
updatedDate: "2026-05-21"
category: science
featured: false
featuredRank: 99
readingTime: 15 min
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

![Tour du cavalier : un parcours qui visite les 64 cases de l’échiquier une seule fois chacune, calculé par l’heuristique de Warnsdorff.](/images/echecs-maths-01-tour-cavalier.svg)

Le problème des huit dames demande de placer huit dames sans qu'elles s'attaquent. La suite A000170 de l'OEIS recense 92 solutions pour huit dames. Les symétries les regroupent en 12 classes ; on ne peut pas simplement multiplier toutes ces classes par huit, car certaines solutions ont elles-mêmes des symétries.

![Exemple de placement de huit dames sans attaque mutuelle.](/images/echecs-maths-02-huit-dames.svg)

C'est un terrain pédagogique pour la recherche avec retour arrière : tu places une dame, vérifies les contraintes, puis reviens sur un choix lorsqu'il bloque la suite. Il ne faut pas en déduire qu'on ne sait construire aucune solution pour un échiquier de taille différente.

## Compter des suites n'est pas compter des positions

Les vérifications *perft* du projet Stockfish donnent 119 060 324 suites légales de six demi-coups depuis la position initiale, soit trois coups par camp. Plusieurs suites peuvent aboutir à la même position : ce nombre ne compte pas des positions distinctes.

Shannon (1950) propose l'ordre de grandeur $10^{120}$ pour illustrer la taille d'un arbre de parties. C'est une estimation, pas le nombre exact des positions légales. Pour comprendre l'exploration de cet arbre, tu peux lire [minimax](/fr/blog/minimax-aux-echecs/) et [l'article sur la complexité des échecs](/fr/blog/pourquoi-echecs-probleme-mathematique-impossible-et-ia/).

Un arbre de coups devient un arbre de probabilités seulement si tu lui ajoutes un modèle probabiliste. Les règles d'un jeu sans hasard ne donnent pas spontanément une probabilité à chaque réponse de l'adversaire.

## Le point délicat : le transfert vers les maths

Tu peux devenir meilleur à reconnaître des motifs échiquéens sans que cela améliore toutes tes autres capacités. C'est la question du transfert lointain : le bénéfice d'un entraînement dépasse-t-il les tâches proches de ce que tu as pratiqué ?

La synthèse de Sala et Gobet (2017) souligne les limites des preuves et l'importance des groupes de contrôle actifs. Si un groupe suit des cours d'échecs et un autre ne reçoit rien de comparable, l'attention supplémentaire, la nouveauté ou les attentes peuvent contribuer aux écarts.

Dans leurs deux expériences sur la résolution de problèmes mathématiques, Sala et Gobet (2017) ne trouvent pas de bénéfice permettant de confirmer le transfert attendu avec ce type de contrôle. Il serait contradictoire de présenter ensuite la métacognition comme le « seul transfert scientifiquement prouvé » sans preuve spécifique suffisante.

## Utiliser le jeu comme support de raisonnement

Tu peux néanmoins faire un exercice précis avec une position. Écris ton hypothèse avant de regarder la solution : « Cette tour peut entrer parce que la dernière rangée est faible. » Cherche ensuite la meilleure défense adverse. Si elle réfute ton idée, explique où ton raisonnement a cessé de tenir.

Cette démarche peut aussi être explicitement travaillée en mathématiques. Par exemple : écrire une conjecture, tester un cas qui pourrait la contredire, puis distinguer un exemple favorable d'une démonstration. Le rapprochement devient une activité d'enseignement construite, plutôt qu'un effet supposé du simple fait de jouer.

### Choisir un rythme qui laisse une trace

Une partie lente te laisse davantage de temps pour noter tes candidats et expliquer ton choix. Une partie rapide peut servir à revoir des motifs et à constater ce qui te manque sous pression. Aucun seuil universel de secondes par coup ne permet de déclarer que ton cortex commence enfin à raisonner.

Si ton objectif est scolaire, garde des exercices scolaires et mesure les compétences visées. Si ton objectif est échiquéen, examine tes erreurs de calcul et de compréhension. Dans les deux cas, une progression observable vaut mieux qu'une promesse générale d'intelligence.

## Un problème de dénombrement à fabriquer au club

Demande à un camarade combien de carrés contient un échiquier. Sa première réponse sera souvent le produit de huit par huit. Elle répond bien à la question du nombre de cases. Mais si tu acceptes aussi les carrés dont les côtés suivent les lignes du plateau et qui contiennent plusieurs cases, il faut préciser le contrat. Autrement, deux personnes peuvent défendre des réponses différentes sans s'être trompées dans leur calcul. Écris la règle : chaque carré aligné sur le quadrillage compte une fois, quelle que soit la couleur de ses cases.

Commence sur un plateau plus petit que tu dessines sur une feuille. Dans une grille de trois cases de côté, il y a neuf petits carrés, quatre carrés de deux cases de côté et un seul grand carré. Tu peux nommer un carré par sa case du coin inférieur gauche et la longueur de son côté. Pour un côté donné, tu ne peux jamais placer le coin trop loin vers la droite ni trop haut. Chaque choix autorisé de colonne se combine pourtant avec chaque choix autorisé de rangée. Voilà pourquoi une multiplication apparaît dans le calcul.

Sur l'échiquier complet, un carré de trois cases de côté peut commencer sur une des six premières colonnes et une des six premières rangées. Tu obtiens trente-six positions. Recommence pour chaque longueur puis additionne : les huit contributions valent soixante-quatre, quarante-neuf, trente-six, vingt-cinq, seize, neuf, quatre et une. Leur somme vaut deux cent quatre. Tu peux contrôler ton calcul en inversant le sens du raisonnement : le grand carré a une position possible, son voisin immédiatement plus petit en a quatre, et ainsi de suite. Cette vérification sert aussi à repérer une confusion classique entre le nombre de cases et le nombre de lignes qui les séparent.

Comment transformer cela en vrai problème de recherche ? Change une seule contrainte : le carré doit contenir la case a1. Il en reste exactement un pour chaque longueur. Tous ont leur coin inférieur gauche en a1. Déplace maintenant la contrainte vers d4. Pour les carrés de deux cases de côté, d4 peut en être chacun des quatre coins, car aucune bordure ne gêne. Pour ceux de huit cases de côté, elle ne peut appartenir qu'au grand échiquier entier. Cette fois il serait faux de multiplier le nombre de longueurs par un même coefficient. La proximité du bord compte, même si la couleur de la case paraît plus frappante au premier regard.

## Passer du calcul à la preuve avec deux tours

Sur un plateau vide, combien de façons de placer deux tours blanches pour qu'elles ne partagent ni rangée ni colonne ? Suppose d'abord que l'une porte un ruban rouge. La tour marquée peut aller sur n'importe laquelle des soixante-quatre cases. Une fois posée, elle condamne pour la seconde sa propre rangée et sa propre colonne. Il reste sept rangées possibles et sept colonnes possibles. Le produit vaut quarante-neuf. Tu obtiens ainsi trois mille cent trente-six placements de tours distinguables.

Retire le ruban. Chaque diagramme final a été compté exactement deux fois, parce que celle qui occupe la première case choisie pouvait être la tour rouge ou l'autre. Il reste donc mille cinq cent soixante-huit diagrammes. Compare ce résultat avec la question des huit dames. Ici la division par deux est justifiée pour tous les diagrammes par le même échange des étiquettes. Pour des symétries géométriques d'un placement de dames, il faut au contraire regarder si une transformation laisse certains placements inchangés. La présence d'un groupe de transformations ne suffit pas, à elle seule, à choisir un diviseur.

Tu peux vérifier la réponse sans utiliser de tour marquée. Choisis deux rangées distinctes parmi huit : il y a vingt-huit paires possibles. Choisis deux colonnes de la même façon. Aux quatre intersections, deux placements seulement occupent une fois chaque rangée et une fois chaque colonne. Multiplie vingt-huit par vingt-huit puis par deux. Tu retrouves le même total par un chemin qui décrit directement les diagrammes. Si les deux méthodes avaient donné des résultats différents, chercher quel objet avait été compté deux fois aurait été bien plus instructif que recommencer la multiplication.

Pour prolonger l'activité, dessine trois cases condamnées sur le plateau et conserve les deux tours. L'argument qui donnait quarante-neuf possibilités après le premier choix ne s'applique plus uniformément. Une case déjà interdite peut se trouver sur la rangée que la première tour vient de rendre inutilisable. Essaie un petit damier où tu peux lister les placements à la main, puis cherche quelles premières cases restent équivalentes. Tu as ainsi fabriqué une tâche mathématique à partir des déplacements d'une pièce, avec des hypothèses variées et une correction vérifiable. Gagner davantage de parties n'est pas nécessaire pour constater que tu sais désormais mieux compter ces configurations.

## Sources

- OEIS Foundation (s. d.), *A000170: Number of ways of placing n nonattacking queens on an n×n board*, base mathématique, [suite et références](https://oeis.org/A000170).
- Équipe Stockfish (s. d.), *tests/perft.sh*, code officiel de vérification des suites légales, [dépôt](https://github.com/official-stockfish/Stockfish/blob/master/tests/perft.sh).
- Shannon, C. E. (1950), *Programming a Computer for Playing Chess*, Philosophical Magazine, 41, 256–275, [original](https://d1yx3ys82bpsa0.cloudfront.net/chess/programming-a-computer-for-playing-chess.shannon.062303002.pdf).
- Sala, G. et Gobet, F. (2017), *Does chess instruction improve mathematical problem-solving ability? Two experimental studies with an active control group*, Learning & Behavior, [article](https://link.springer.com/article/10.3758/s13420-017-0280-3).
- Sala, G. et Gobet, F. (2017), *Does Far Transfer Exist? Negative Evidence From Chess, Music, and Working Memory Training*, Current Directions in Psychological Science, [synthèse](https://journals.sagepub.com/doi/full/10.1177/0963721417712760).
