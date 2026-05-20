---
title: "Théorie des jeux aux échecs : pourquoi chaque coup est une décision stratégique"
excerpt: "Les échecs sont le terrain d'origine de la théorie des jeux. Minimax, équilibre de Nash, information parfaite : décryptage mathématique de ce qui se passe vraiment quand tu joues."
publishDate: "2026-05-05"
category: "science"
featured: false
featuredRank: 99
readingTime: "14 min"
pillar: "Mathématiques"
tags: ["théorie des jeux", "échecs", "mathématiques", "Nash", "minimax", "stratégie", "science"]
seoTitle: "Théorie des jeux aux échecs : Nash, minimax et stratégie optimale"
seoDescription: "Minimax, équilibre de Nash, jeux à somme nulle : comment la théorie des jeux explique la stratégie aux échecs et ce qu'elle révèle sur la prise de décision."
---

Round 9. Coup 14. Tu as joué les treize précédents sans réfléchir : tu les connais par cœur. Ton adversaire aussi. Vous regardez tous les deux la pendule, pas l'échiquier. À cet instant, vous êtes deux acteurs parfaitement rationnels enfermés dans le même équilibre.

Vous le savez. Lui aussi.

C'est ça, le sujet de la théorie des jeux. Ce n'est pas une métaphore : les échecs sont **le cas d'école** sur lequel von Neumann et Nash ont construit leurs modèles.

## Pourquoi les échecs sont un objet mathématique presque parfait

Quatre propriétés font des échecs un objet rare en théorie des jeux. Elles paraissent banales. Elles ne le sont pas.

**Deux joueurs, point final.** Pas d'alliance, pas de coalition, pas de tiers. Blanc contre Noir, ce que l'un gagne l'autre le perd exactement.

**Somme nulle.** Aucune issue où vous gagnez tous les deux. Aucune où vous perdez tous les deux. La nullité est un partage strict, pas un compromis. Cette propriété rend les échecs analysables : c'est ce qu'on appelle un *jeu à somme nulle à deux joueurs*, la classe la plus simple en théorie des jeux.

**Information parfaite.** Au poker, tu ne vois pas les cartes adverses. Au backgammon, tu lances des dés. Aux échecs, *tout* est sur l'échiquier. À tout instant, les deux joueurs ont accès à exactement la même information. Aucun élément caché, aucun hasard.

**Fini.** Le nombre de parties légales est l'estimation de Shannon : $10^{120}$. Astronomique : plus grand que le nombre d'atomes dans l'univers observable. Mais **fini**. Et c'est cette finitude qui rend possible le théorème suivant.

## Le théorème vieux de 110 ans qui dit qu'une partie d'échecs a déjà un résultat

En 1913, le mathématicien Ernst Zermelo prouve un résultat qui devrait te donner le vertige.

Dans tout jeu à deux joueurs, à information parfaite, sans hasard, et fini, l'une de ces trois affirmations est *forcément vraie* :
1. Le premier joueur a une stratégie gagnante.
2. Le second joueur a une stratégie gagnante.
3. Les deux peuvent forcer le nul.

Appliqué aux échecs : il existe **dès maintenant** une vérité de la position initiale. Soit les Blancs gagnent en jouant parfaitement. Soit les Noirs gagnent. Soit la partie est nulle sous jeu parfait.

Personne ne sait laquelle. Personne ne le saura probablement jamais : il faudrait explorer $10^{120}$ parties. Mais **la réponse existe**. Elle est gravée dans la structure du jeu lui-même, indépendamment de qui joue.

L'hypothèse majoritaire des experts est que c'est la nulle. Mais c'est une croyance, pas un théorème.

## Minimax : ce que ton cerveau exécute déjà, sans le savoir

Quand tu réfléchis à un coup, tu fais quelque chose comme : *"Si je joue le cavalier ici, il va prendre. Si je reprends, il a Df3, ça menace... non, j'ai Te1 entre."*

Ce que tu viens de faire a un nom : l'algorithme **minimax**. Et tu l'as appris sans qu'on te l'enseigne, parce que c'est la seule manière logique de raisonner contre un adversaire intelligent.

L'idée tient en deux phrases. Tu cherches le coup qui te donne le **meilleur résultat possible**, en partant du principe que ton adversaire choisira systématiquement la réponse qui te donne le **pire résultat possible**.

Avant la formule, l'analogie : imagine deux joueurs qui se passent une lampe. Celui qui tient la lampe choisit, dans une pièce, l'ampoule qu'il allume : il prend la plus brillante pour son équipe et la moins brillante pour l'équipe adverse. Maximiser pour soi, minimiser pour l'autre, à chaque tour. C'est tout.

Si tu notes $v(p)$ la valeur d'une position $p$ pour les Blancs :

$$v(p) = \max_{c \in C(p)} v(\text{résultat}(p, c)) \quad \text{si c'est le tour des Blancs}$$
$$v(p) = \min_{c \in C(p)} v(\text{résultat}(p, c)) \quad \text{si c'est le tour des Noirs}$$

$C(p)$ est l'ensemble des coups légaux en position $p$.

Ce que cette formule te fait éviter de recalculer : à chaque profondeur, elle suppose que l'adversaire jouera *son* meilleur coup, ce qui te dispense d'imaginer ses erreurs probables (qui te coûteraient du calcul sans gagner en sécurité).

C'est exactement ce que Stockfish, Leela et tous les moteurs modernes exécutent. La différence avec toi : ils le font sur des millions de nœuds par seconde, là où ton cerveau en traite peut-être trois ou quatre.

### Pourquoi un moteur n'explore pas $35^{10}$ positions

Un problème : la croissance combinatoire est exponentielle. À chaque coup, environ 35 coups légaux. À profondeur 10, ça fait $35^{10}$ ≈ 2 700 000 milliards de positions. Inaccessible même au meilleur supercalculateur.

L'astuce qui sauve tout : l'**élagage alpha-bêta**. Le principe est limpide.

Suppose que tu as déjà trouvé une variante qui te garantit un avantage. Si en explorant une autre branche, tu découvres que l'adversaire peut te ramener à pire que cet acquis, **inutile d'explorer le reste de la branche**. Tu sais déjà qu'elle est mauvaise. Tu coupes.

L'élagage transforme du $35^d$ en $35^{d/2}$: autrement dit, il **double la profondeur** atteignable avec le même budget calcul. C'est la raison technique pour laquelle un moteur de 1997 (Deep Blue) pouvait déjà battre Kasparov.

## Nash, ou pourquoi 1.e4 e5 2.Cf3 Cc6 3.Fb5 a survécu 200 ans

John Nash a généralisé minimax aux jeux où plusieurs équilibres coexistent. L'**équilibre de Nash** est un état où aucun joueur n'a intérêt à modifier sa stratégie **unilatéralement**, à condition que l'autre garde la sienne.

> **Définition rapide : équilibre de Nash.** Imagine deux entreprises qui fixent leurs prix. Si l'une baisse, elle gagne des clients mais perd en marge. L'autre la suit. Les deux se retrouvent à un prix où aucune n'a intérêt à bouger en premier. C'est un équilibre de Nash : pas l'optimum collectif, juste un point où personne ne gagne à dévier seul.

Aux échecs, ça se traduit dans les ouvertures.

Quand on dit qu'une variante est *"théoriquement égale"*, ça veut dire précisément ça : les deux camps disposent de ressources qui maintiennent l'équilibre, et le premier qui dévie unilatéralement risque de se faire punir. C'est pour ça que l'Espagnole (1.e4 e5 2.Cf3 Cc6 3.Fb5) traverse les siècles : c'est un équilibre stable que personne n'a réussi à briser.

Sous jeu parfait des deux côtés, *toute la partie* serait un seul gigantesque équilibre de Nash. Et si la vérité des échecs est la nulle, alors cet équilibre est la nulle.

## L'information parfaite n'existe pas vraiment (et c'est ce qui rend le jeu jouable)

Les manuels disent que les échecs sont à *information parfaite*. C'est techniquement vrai. Pratiquement faux.

L'information manquante n'est pas sur l'échiquier. Elle est dans le crâne de ton adversaire.

Tu ne sais pas jusqu'où il a calculé. Tu ne sais pas s'il connaît la variante que tu as préparée hier soir. Tu ne sais pas si son calme apparent cache une position qu'il pense perdue ou une combinaison dévastatrice qu'il attend de lâcher au coup 27.

Cette asymétrie subjective transforme les échecs, en pratique, en jeu à information imparfaite. C'est là que la psychologie débarque. C'est là que la théorie des jeux pure cesse de prédire correctement le comportement humain.

## Le paradoxe Bobby Fischer : pourquoi le joueur le plus prévisible du XXe siècle a gagné

La théorie des jeux dit : diversifie tes ouvertures, sinon tu deviens prévisible et tu te fais préparer. C'est ce qu'on appelle une **stratégie mixte**: jouer plusieurs lignes avec des probabilités variées plutôt que la même à chaque fois.

Bobby Fischer a joué **1.e4** dans presque toutes ses parties.

Stratégie pure, prévisibilité totale, violation apparente du principe de stratégie mixte. Et pourtant, il dominait. Pourquoi ?

Parce que sa préparation dans les lignes de 1.e4 était d'une profondeur telle qu'il *préférait jouer des positions familières*, même attendues, plutôt que de surprendre dans des positions qu'il maîtrisait moins bien. Sa stratégie pure dominait toute stratégie mixte d'un adversaire moins préparé. C'est un résultat de théorie des jeux à part entière : quand le différentiel de préparation est suffisant, la prévisibilité devient un avantage.

Toi, à 1500 Elo, tu n'es pas Fischer. Diversifie tes ouvertures.

## Pourquoi Magnus Carlsen ne joue presque jamais une partie isolée

Les échecs de tournoi sont un *jeu répété* : tu vas affronter les mêmes adversaires sur plusieurs années, des dizaines de fois. Et la théorie des jeux répétés dit que dans ce cadre, la **réputation** devient un actif stratégique à part entière.

Connu pour ton agressivité ? Tes adversaires arrivent armés de systèmes défensifs solides, et tu peux les piéger en jouant calme un jour donné. Connu pour la technique en finale ? Ils éviteront les simplifications, donc le milieu de jeu deviendra ton terrain.

C'est la raison technique pour laquelle Magnus Carlsen et son équipe passent des centaines d'heures par match à *préparer l'adversaire spécifique*. Ils ne cherchent pas le meilleur coup absolu. Ils cherchent la déviation subtile qui sort des sentiers connus de **cet** adversaire **précis**, tout en gardant un avantage théorique.

C'est aussi pour ça que les matchs de championnat du monde produisent souvent des ouvertures bizarres : ce ne sont pas des coups objectivement meilleurs, ce sont des coups stratégiquement meilleurs *contre cette personne, à ce moment, avec ce qu'elle a préparé*.

## Ce que la théorie des jeux abandonne (et ne récupérera probablement jamais)

Malgré sa puissance, la théorie des jeux bute sur la complexité combinatoire. "Résoudre" les échecs (savoir si Blanc gagne, Noir gagne, ou nul sous jeu parfait) exige d'explorer un arbre de $10^{120}$ feuilles. Aucun ordinateur n'y arrivera. Aucun futur ordinateur classique non plus, sans révolution physique.

Pour comparer :
- **Le morpion** : résolu trivialement. Nul sous jeu parfait.
- **Le puissance 4** : résolu en 1988. Le premier joueur gagne.
- **Les dames** : résolues en 2007 par Jonathan Schaeffer et son équipe (publié dans *Science*). Nul sous jeu parfait, après 18 ans de calcul.
- **Le Nim** : résolu analytiquement (théorème de Sprague-Grundy).
- **Les échecs** : restent ouverts. Pour très longtemps.

Ce n'est pas une limite de la discipline. La théorie affirme que la réponse existe. C'est juste que les ressources de calcul nécessaires sont hors d'atteinte physique.

## La leçon qui tient en une ligne

Sur 64 cases comme dans une décision de vie, il n'existe pas de bon coup *absolu*. Il existe des bons coups **par rapport à un modèle de l'adversaire**.

Améliorer ce modèle (comprendre comment l'autre pense, ce qu'il a préparé, ce qu'il craint) est ce qui sépare le bon joueur de l'excellent.

Von Neumann n'a pas inventé la théorie des jeux pour les échecs. Il l'a inventée pour modéliser la guerre froide. Mais les deux objets ont la même ossature : deux acteurs rationnels, des décisions interdépendantes, un résultat qui dépend de ce que chacun *croit* que l'autre va faire.

**Après lecture :** avant ta prochaine partie longue, écris une ligne sur **l'hypothèse d'intentions** que tu fais sur l'adversaire (agressif, évite les complications, joue rapidement en blitz, etc.) ; confronte-la à la partie réelle après coup.

---

## À retenir

- Les échecs sont un jeu fini, à somme nulle, à deux joueurs, à information parfaite, donc analysable par Zermelo (1913).
- Une "vérité" du jeu existe déjà (Blanc gagne, Noir gagne, ou nul sous jeu parfait), mais $10^{120}$ parties la rendent inaccessible.
- Minimax = maximiser pour soi en supposant que l'autre minimise pour soi. C'est ce que ton cerveau fait sans le savoir.
- L'élagage alpha-bêta double la profondeur atteignable : la raison pour laquelle Deep Blue battait Kasparov en 1997.
- L'équilibre de Nash explique pourquoi certaines ouvertures (Espagnole) traversent les siècles : personne n'a intérêt à dévier seul.
- En pratique, l'information n'est jamais parfaite : l'incertitude est dans la tête de l'adversaire, pas sur l'échiquier. C'est là que la psychologie remplace les maths.

### Sources et références

- **von Neumann, J., & Morgenstern, O.** *Theory of Games and Economic Behavior.* Princeton University Press, 1944. (Le texte fondateur de la théorie des jeux moderne.)
- **Nash, J.** [*Non-Cooperative Games.*](https://www.jstor.org/stable/1969529) Annals of Mathematics, 54(2), 286-295, 1951. (L'introduction formelle de l'équilibre de Nash.)
- **Zermelo, E.** *Über eine Anwendung der Mengenlehre auf die Theorie des Schachspiels.* Proceedings of the Fifth International Congress of Mathematicians, 1913. (Le théorème fondateur sur la résolution des jeux finis.)
- **Schaeffer, J., et al.** [*Checkers Is Solved.*](https://www.science.org/doi/10.1126/science.1144079) Science, 317(5844), 1518-1522, 2007. (La résolution complète du jeu de dames par ordinateur.)
- **Shannon, C. E.** *Programming a Computer for Playing Chess.* Philosophical Magazine, Series 7, 41(314), 1950. (L'estimation du nombre de parties possibles aux échecs.)
