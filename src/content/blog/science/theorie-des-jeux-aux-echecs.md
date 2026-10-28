---
title: "Théorie des jeux aux échecs : pourquoi chaque coup est une décision stratégique"
excerpt: "Les échecs sont un terrain d'application de la théorie des jeux. Minimax, équilibre de Nash, information parfaite : décryptage mathématique de ce qui se passe vraiment quand tu joues."
publishDate: "2026-05-05"
updatedDate: "2026-05-21"
category: "science"
featured: false
featuredRank: 99
affiliate: true
readingTime: "8 min"
pillar: "Mathématiques"
tags: ["théorie des jeux", "échecs", "mathématiques", "Nash", "minimax", "Zermelo", "stratégie dominante", "stratégie mixte", "science"]
seoTitle: "Théorie des jeux aux échecs : Nash, minimax, Zermelo expliqués"
seoDescription: "Minimax, équilibre de Nash, stratégies mixtes, théorème de Zermelo : la théorie des jeux appliquée aux échecs, des ouvertures à la préparation adverse."
ogImage: /images/og/theorie-des-jeux-aux-echecs-og.webp
heroImage:
  src: /images/blog/theorie-des-jeux-aux-echecs-hero.webp
  alt: Un sablier dont le sable est fait de minuscules pièces d'échecs qui passent
    d'une ampoule à l'autre.
faq:
  - question: "Les échecs sont-ils à somme nulle ?"
    answer: "Oui, en attribuant +1 au gagnant, −1 au perdant et 0 à chacun pour une nulle. La notation habituelle 1–0 ou ½–½ est à somme constante et se transforme en somme nulle."
  - question: "Connaît-on le résultat des échecs sous jeu parfait ?"
    answer: "Non. L'existence d'une valeur théorique n'indique pas si les Blancs gagnent, si les Noirs gagnent ou si les deux peuvent assurer la nulle depuis la position initiale."
  - question: "Faut-il mélanger ses ouvertures ?"
    answer: "Cela peut rendre ta préparation moins prévisible, mais aucun théorème n'impose une répartition particulière. Dans un jeu fini à information parfaite comme les échecs, des stratégies optimales pures existent."

---

La théorie des jeux permet de formaliser des décisions dont le résultat dépend des choix de plusieurs acteurs. Appliquée aux échecs, elle demande de préciser le modèle : stratégies possibles, résultats et hypothèses sur les réponses adverses.

Cette formalisation doit être distinguée des évaluations d'un moteur et des choix pratiques contre une personne. Une ouverture familière ou populaire ne constitue pas, à elle seule, un équilibre de Nash. La question est de comprendre ce qu'un résultat mathématique garantit et ce qu'il reste à établir pour une position réelle.

## Le modèle : deux joueurs, des règles connues

Les échecs sont un jeu à deux joueurs, sans tirage aléatoire dans les règles, à information parfaite. Cela signifie que les coups joués et l'état du jeu sont connus des deux camps. Cela ne signifie pas que tu connais la préparation ou les intentions de ton adversaire.

Avec la convention victoire = +1, défaite = −1, nulle = 0, les gains des deux joueurs ont une somme nulle. Avec la notation habituelle 1, 0 et ½, leur somme vaut 1 : c'est un jeu à somme constante, équivalent après changement d'échelle. Répéter les parties ne fait pas disparaître automatiquement cette propriété.

Le cadre de recherche adversariale exposé par Russell et Norvig permet de représenter une partie finie par un arbre de décisions. Pour représenter correctement les échecs, l'état doit aussi conserver les droits et l'historique nécessaires aux règles ; les cases occupées ne suffisent pas toujours.

## Une valeur théorique n'est pas une solution calculée

Dans un arbre fini où les issues sont victoire, nulle ou défaite, on peut remonter les valeurs des feuilles : chaque joueur choisit la meilleure continuation pour lui. On obtient alors une valeur pour la racine et des choix qui la garantissent.

L'article sur [Zermelo](/fr/blog/paradoxe-de-zermelo/) revient sur l'histoire de cette question. Ici, l'idée à retenir est simple : l'existence d'un résultat sous jeu parfait ne nous dit pas lequel est celui des échecs depuis la position initiale.

Il serait excessif d'affirmer qu'il faut nécessairement parcourir chaque partie possible pour trouver une preuve, ou qu'aucune découverte future ne pourra résoudre le problème. L'énormité d'un arbre estimé ne démontre pas une impossibilité mathématique.

## Minimax : garantir le meilleur résultat contre la meilleure défense

Pour une position où les Blancs jouent, minimax prend le maximum des valeurs de ses continuations. Pour une position où les Noirs jouent, il prend leur minimum, avec une évaluation exprimée du point de vue des Blancs.

$$v(p)=\max_{c\in C(p)}v(\text{résultat}(p,c))$$

$$v(p)=\min_{c\in C(p)}v(\text{résultat}(p,c))$$

Aux feuilles terminales, la valeur vient du résultat de la partie. Si tu arrêtes plus tôt, elle vient d'une estimation : le calcul ne prouve alors que la valeur de cet arbre tronqué avec cette évaluation.

Russell et Norvig montrent aussi comment alpha-bêta évite d'explorer des branches inutiles au résultat minimax. L'amélioration dépend de l'ordre des coups ; le cas favorable en $O(b^{d/2})$ n'est pas une garantie pour chaque recherche. Ni cette borne ni minimax ne décrivent littéralement ce que ton cerveau calcule.

[Minimax aux échecs](/fr/blog/minimax-aux-echecs/) détaille ces limites. Tous les moteurs n'emploient pas la même méthode de recherche : assimiler Leela à un simple minimax serait trompeur.

## Ce que Nash ajoute

Nash (1951) étudie les équilibres dans les jeux non coopératifs. À un équilibre, aucun joueur ne peut améliorer son gain en changeant seul de stratégie, les stratégies des autres restant fixées.

Une stratégie est ici un plan complet qui indique quoi faire dans les situations pertinentes. Un premier coup isolé ou une ouverture populaire ne constitue pas à lui seul une preuve d'équilibre. Une variante évaluée « égale » par un moteur peut rester mal comprise ou changer d'évaluation avec une analyse plus profonde.

De même, le score observé des Blancs dans une base de parties mesure des résultats humains dépendant de l'échantillon. Il ne démontre pas une valeur théorique ni la dominance d'un premier coup. L'article sur les [graphes et les équilibres](/fr/blog/graphes-de-nash-equilibre-ouvertures/) précise ce point.

## Stratégie pure, mélange et préparation

Dans un jeu fini à information parfaite, la remontée de l'arbre permet de choisir une action optimale à chaque décision : une stratégie pure suffit à assurer la valeur théorique. Le hasard n'est donc pas une obligation pour jouer parfaitement aux échecs.

En pratique, varier ton répertoire peut compliquer la préparation adverse. Tu peux aussi préférer une ligne connue en profondeur à une surprise que tu maîtrises mal. Ce sont des choix d'entraînement et d'adaptation ; aucune répartition universelle entre 1.e4, 1.d4 et 1.Cf3 ne découle du théorème de Nash.

Avant une partie, distingue ainsi deux questions : « Quelle suite semble la plus solide ? » et « Quelle suite suis-je capable de jouer correctement aujourd'hui ? » Après la partie, vérifie tes hypothèses sur l'adversaire avec les coups réellement joués.

## Un arbre que tu peux résoudre toi-même

Voici un **exemple pédagogique fictif**, sans prétendre représenter une position réelle. Les Blancs hésitent entre deux plans A et B. Après A, les Noirs disposent de deux réponses conduisant à des valeurs de +4 et −1 pour les Blancs. Après B, leurs réponses donnent +1 et +2. Toutes les suites s'arrêtent ici par construction.

Si tu regardes seulement la meilleure feuille, A semble attirant : +4 dépasse +2. Mais les Noirs ne sont pas obligés de coopérer. Ils choisissent −1 après A, et +1 après B. Les Blancs comparent donc −1 et +1, puis choisissent B. La valeur de cet arbre est +1. Ce calcul explique ce qui manque à la phrase « j'avais vu une belle combinaison » : il faut aussi examiner ce qui se passe si l'autre refuse la continuation souhaitée.

Change maintenant une hypothèse. Supposons que ces nombres soient des évaluations approximatives à trois demi-coups, et non des résultats terminaux. La remontée reste exacte **pour ces nombres** ; la conclusion sur la position réelle devient une estimation. Une capture intermédiaire située au quatrième demi-coup peut modifier l'évaluation. La rigueur consiste à garder la méthode et sa portée ensemble.

Tu peux refaire l'exercice avec des issues victoire, nulle et défaite. Une branche où toutes les réponses adverses mènent à une nulle garantit la nulle. Une autre contenant neuf victoires et une défaite ne garantit aucune victoire. Le nombre de bonnes feuilles ne remplace pas le choix de l'adversaire. Pour parler de probabilité, il faut ajouter un modèle de sa conduite.

## Piège, meilleure défense et espérance pratique

Un piège peut gagner souvent sans être théoriquement bon. Prenons un **modèle fictif de préparation** : une ligne risquée donne la victoire si l'adversaire tombe dans le piège, mais la défaite s'il trouve la réfutation. Si sa probabilité de tomber dedans est supposée égale à 70 %, le score attendu vaut 0,70, avec la notation de tournoi. Une autre ligne garantit hypothétiquement la nulle, soit 0,50. La première maximise l'espérance dans ce modèle ; la seconde garantit davantage contre une défense exacte.

Mais d'où vient 70 % ? Ce chiffre est inventé pour l'exercice. Une fréquence dans une base peut être trompeuse : adversaires moins expérimentés, parties rapides, anciennes versions de la théorie, piège connu des seuls joueurs qui y entrent. Si ton prochain adversaire a préparé la réfutation, la fréquence historique n'est pas sa probabilité de se tromper. Une stratégie dite « pratique » doit expliciter les connaissances sur lesquelles elle parie.

C'est aussi pourquoi une surprise ne se juge pas uniquement à son score immédiat. Une ligne peut être efficace une fois, puis devenir mauvaise quand les adversaires adaptent leur préparation. La [présentation de la théorie des jeux par la Stanford Encyclopedia of Philosophy](https://plato.stanford.edu/entries/game-theory/) aide à séparer stratégies, utilités et croyances. Elle ne fournit aucune fréquence optimale universelle pour ton répertoire.

## Le résultat de la partie et l'objectif du tournoi

Une nulle peut suffire à remporter un tournoi ; elle peut aussi laisser un joueur éliminé. Les règles et les points de la partie sont les mêmes, mais l'objectif pratique change. Maximiser le score moyen de la partie et maximiser la probabilité de finir premier ne sont pas deux formulations automatiquement équivalentes.

**Situation fictive :** à la dernière ronde, seule une victoire permet de te qualifier. Tu peux préférer une position avec davantage de déséquilibres à une répétition de coups disponible. Cela ne rend pas la répétition moins correcte dans le jeu abstrait. Tu changes la fonction d'utilité pertinente pour ta décision. Il faut encore vérifier que la complication conserve des chances raisonnables, au lieu de confondre obligation de gagner et obligation de sacrifier.

Une analyse utile peut donc garder deux colonnes : valeur échiquéenne estimée et intérêt pour ton objectif réel. Cette séparation permet de discuter une décision sans réécrire après coup les règles mathématiques pour justifier un pari.

## Comment utiliser cette théorie dans ton entraînement

Choisis une partie récente et reconstruis un seul moment décisif. Écris tes deux candidats, la réponse adverse que tu attendais et celle que tu redoutais. Puis cherche une troisième réponse que tu avais négligée. Le but n'est pas de calculer tout l'arbre, mais de vérifier si ton choix reposait sur la coopération de l'adversaire.

Lors de la correction, sépare trois erreurs possibles : une réponse légale oubliée, une position finale mal évaluée, ou une hypothèse fragile sur le comportement adverse. Elles appellent des travaux différents. La première demande de mieux générer les candidats ; la deuxième de comprendre les positions obtenues ; la troisième de mieux distinguer préparation et spéculation.

Ce protocole est une proposition d'entraînement, pas une intervention validée expérimentalement. Il donne néanmoins une traduction concrète à la théorie : tu ne cherches plus seulement une suite brillante, tu précises ce que ton choix garantit et ce qu'il suppose.

## Sources

- Russell, S. et Norvig, P. (s. d.), *Adversarial Search*, chapitre de manuel des auteurs, [texte](https://aima.cs.berkeley.edu/4th-ed/pdfs/newchap06.pdf).
- Nash, J. F. (1951), *Non-Cooperative Games*, Annals of Mathematics, 54(2), 286–295, [article original](https://irving.vassar.edu/faculty/gj/FTU/io/literature/Nash51.pdf).
