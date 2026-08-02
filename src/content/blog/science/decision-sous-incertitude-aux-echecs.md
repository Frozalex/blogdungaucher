---
title: "Décision sous incertitude aux échecs : choisir sans connaître toutes les variantes"
excerpt: "Aucune partie d'échecs n'est jouée avec une information complète. Tu décides toujours sans calculer jusqu'au bout, sans savoir ce que l'adversaire va répondre, sans certitude sur ton évaluation. La théorie de la décision sous incertitude a un siècle d'outils pour ce moment précis. Voici ceux qui s'appliquent à l'échiquier."
publishDate: "2026-11-09"
category: "science"
featured: false
featuredRank: 99
affiliate: true
readingTime: "23 min"
pillar: "Théorie de la décision"
tags: ["décision sous incertitude", "échecs", "utilité espérée", "Bayes", "Kahneman", "Simon", "rationalité limitée"]
seoTitle: "Décision sous incertitude aux échecs : utilité espérée, Bayes et rationalité limitée"
seoDescription: "Utilité espérée, critère bayésien, aversion à la perte, rationalité limitée : la décision appliquée quand tu choisis un coup dans l'incertitude."
---

Tu as quatre coups candidats. Tu n'as pas le temps de calculer chacun jusqu'au bout. Tu sais que ton évaluation est approximative. Tu sais que l'adversaire ne jouera pas forcément la meilleure réponse théorique. Tu dois choisir quand même.

Ce moment n'a rien d'exceptionnel : c'est la situation par défaut aux échecs. Une partie entière est une série de décisions prises sans information complète. La théorie de la décision sous incertitude étudie exactement ce moment. Elle a un siècle d'outils mathématiques et expérimentaux à proposer pour le joueur qui veut comprendre ce qu'il fait quand il choisit.

## D'abord : ce dont cet article ne parle pas

Aux échecs, le mot "incertitude" est partout. Avant d'avancer, il faut séparer cet article de quelques voisins.

**Ce n'est pas la théorie des jeux.** La [théorie des jeux aux échecs](/blog/theorie-des-jeux-aux-echecs/) étudie l'interaction stratégique entre joueurs : équilibres, anticipations mutuelles, stratégies optimales en information complète. Ici on s'intéresse à un sujet plus précis : la décision *individuelle* face à une incertitude.

**Ce n'est pas la statistique bayésienne pure.** L'article sur les [réseaux bayésiens aux échecs](/blog/reseaux-bayesiens-predire-blunder/) regarde comment construire des modèles statistiques pour prédire des événements (blunders, gains). Ici on s'intéresse à l'usage du raisonnement bayésien comme méthode de décision en temps réel.

**Ce n'est pas la complexité algorithmique.** Le fait que les échecs soient un problème EXPTIME-complet (voir [pourquoi les échecs sont un problème mathématique impossible](/blog/pourquoi-echecs-probleme-mathematique-impossible-et-ia/)) explique pourquoi tu *dois* décider sous incertitude. Mais le comment, c'est ici.

L'enjeu propre de cet article : que faire au moment précis où tu hésites entre plusieurs coups et où tu sais que tu ne sauras pas tout.

## Le cadre classique : l'utilité espérée

Le premier cadre mathématique de la décision sous incertitude a été formalisé par [John von Neumann](https://fr.wikipedia.org/wiki/John_von_Neumann) et [Oskar Morgenstern](https://fr.wikipedia.org/wiki/Oskar_Morgenstern) en 1944 dans *Theory of Games and Economic Behavior*. Le principe est simple : face à une décision, attribue à chaque issue possible une **utilité** (un nombre qui représente sa valeur pour toi) et une **probabilité**, multiplie les deux, somme sur les issues, et choisis l'option avec la plus haute utilité espérée.

Mathématiquement : $E[U(a)] = \sum_s p(s|a) \cdot U(s)$ où $a$ est l'action choisie et $s$ les états du monde possibles.

Aux échecs, applique ce cadre à un choix entre deux coups :

Coup A : 60 % de chances d'arriver à +0,8, 40 % de chances de tomber à 0,0. Espérance = 0,48.
Coup B : 30 % de chances d'arriver à +2,0, 70 % de chances de tomber à -0,3. Espérance = 0,39.

L'utilité espérée recommande le coup A. Mais beaucoup de joueurs choisissent intuitivement le coup B : "si ça passe, je gagne". C'est déjà la première leçon : nos intuitions divergent souvent du critère d'utilité espérée. Et ce n'est pas forcément une faute.

## Pourquoi l'utilité espérée seule ne suffit pas

Le critère d'utilité espérée a un défaut majeur : il suppose que tu connais les probabilités. Aux échecs, tu les *estimes*, et tes estimations sont imprécises. Ce n'est pas une nuance : c'est une différence de nature.

[Frank Knight](https://en.wikipedia.org/wiki/Frank_Knight) a introduit en 1921 la distinction entre **risque** (probabilités connues) et **incertitude** (probabilités inconnues). Le poker (un simple [jeu de cartes et jetons](https://amzn.to/4hlYy9s)) est globalement un jeu de risque : la distribution des cartes est connue, on parie sur des probabilités calculables. Les échecs sont un jeu d'incertitude knightienne : tu n'as pas de table de probabilités pour "l'adversaire va jouer Tc4 après mon Cf5".

Quand on passe du risque à l'incertitude knightienne, l'utilité espérée pure devient un guide imparfait. Plusieurs critères alternatifs ont été proposés, qui prennent en compte la méconnaissance des probabilités elles-mêmes.

## Le critère maximin : la sécurité contre l'optimisation

Le **critère maximin** dit : choisis l'action dont le pire résultat possible est le moins mauvais. C'est le critère du pessimiste rationnel.

Mathématiquement : choisis l'action $a$ qui maximise $\min_s U(s, a)$.

Aux échecs, ce critère correspond au jeu **solide** : tu choisis le coup dont la pire réponse adverse possible te laisse encore dans une position jouable. Les joueurs comme [Tigran Petrossian](https://fr.wikipedia.org/wiki/Tigran_Petrossian) ou [Anatoli Karpov](https://fr.wikipedia.org/wiki/Anatoli_Karpov) ont fondé une grande partie de leur jeu sur des critères proches du maximin.

L'avantage : tu te protèges des erreurs d'estimation. Tu peux te tromper sur les probabilités et conserver un résultat acceptable.

L'inconvénient : tu peux laisser passer des gains importants. Un coup magnifique aux 80 % de chances de réussite peut avoir un pire scénario à -1,5, contre un coup solide aux 30 % de gain mais pire scénario à 0,0. Le maximin choisira le solide même si l'espérance penche pour l'audacieux.

Le maximin a sa place : en zeitnot, en fin de tournoi avec une victoire suffisante pour le classement, contre un adversaire imprévisible. Hors de ces cas, c'est un critère trop prudent.

## Le critère bayésien : décider avec un prior

Le critère **bayésien** combine deux ingrédients : ton *prior* (ce que tu penses avant d'analyser cette position spécifique) et ton *likelihood* (ce que l'analyse de la position te révèle).

La formule de Bayes : $p(\text{hypothèse}|\text{données}) \propto p(\text{données}|\text{hypothèse}) \cdot p(\text{hypothèse})$.

En français pour les échecs : ton estimation finale d'une variante combine ce que tu sais en général de ce type de position (prior) avec ce que cette position précise te dit (likelihood). Les deux comptent. Un joueur qui ne s'appuie que sur son prior (les généralités stratégiques) jouera des coups corrects mais aveugles aux particularités. Un joueur qui ne s'appuie que sur la position devant lui ratera des éléments que la connaissance générale aurait mis en valeur.

La pondération entre prior et likelihood doit dépendre de la qualité de chacun :

- Position connue, structure classique, ouverture maîtrisée : tu peux donner plus de poids à ton prior. Ton expérience compense l'imprécision de ton calcul.
- Position inhabituelle, hors de ton répertoire, structure rare : ton prior est peu fiable, donne plus de poids à l'analyse concrète, même imparfaite.

Cette mise à jour bayésienne se fait naturellement chez les joueurs forts : ils savent quand "écouter" leur intuition (prior solide) et quand la mettre de côté (prior peu fiable sur cette position).

## L'aversion à la perte et la fonction d'utilité non linéaire

[Daniel Kahneman](https://fr.wikipedia.org/wiki/Daniel_Kahneman) et [Amos Tversky](https://fr.wikipedia.org/wiki/Amos_Tversky) ont montré dans leur *Prospect Theory* (1979) que les humains ne traitent pas symétriquement les gains et les pertes. Une perte de X est ressentie environ deux fois plus fort qu'un gain équivalent. C'est l'**aversion à la perte**.

Aux échecs, cette asymétrie produit des biais systématiques :

- Préférence pour les coups solides quand on est à égalité ou en léger avantage : on protège l'acquis.
- Prise de risque excessive quand on est en infériorité : on cherche le coup miracle parce qu'on a "déjà perdu".
- Refus de propositions de nulle dans des positions effectivement égales : accepter la nulle est ressenti comme une perte par rapport à l'attente de gain.

Cette asymétrie n'est pas irrationnelle au sens strict. Elle reflète une fonction d'utilité non linéaire et concave dans les gains, convexe dans les pertes. Mais elle s'écarte de la maximisation de l'utilité espérée mathématique. Et ces écarts coûtent des points.

Reconnaître ses propres biais d'aversion à la perte est la première étape pour les corriger. Quand tu hésites entre un coup solide à +0,3 et un coup ambitieux à +0,8 d'espérance, demande-toi si ton hésitation vient d'une vraie incertitude sur les probabilités, ou simplement de la peur de perdre ce que tu as déjà.

## La rationalité limitée : Simon et le satisficing

[Herbert Simon](https://fr.wikipedia.org/wiki/Herbert_Simon), prix Nobel d'économie 1978, a montré que l'optimisation mathématique pure est inaccessible aux agents réels parce que le calcul a un coût. Il propose le concept de **rationalité limitée** (*bounded rationality*) et la stratégie du **satisficing** : ne pas chercher le meilleur, chercher un suffisamment bon.

Cette intuition est centrale aux échecs. Tu n'as pas le temps de trouver le meilleur coup mathématique dans une position complexe. Tu cherches un coup qui satisfait un seuil de qualité acceptable, et tu joues. Le temps gagné peut servir ailleurs : à un autre moment de la partie où il sera plus rentable.

Simon a même formalisé cette idée pour les échecs dans ses travaux sur l'expertise. Les joueurs forts ne calculent pas exhaustivement : ils utilisent des heuristiques fondées sur la reconnaissance de patterns (théorie des chunks, voir [les échecs et le cerveau](/blog/les-echecs-et-le-cerveau/)) pour réduire l'espace de recherche à quelques coups candidats, puis ils analysent ces candidats avec plus de profondeur.

Le satisficing aux échecs se décline ainsi :

- **Position calme** : joue le premier coup candidat qui passe ton check de sécurité (1-2 minutes). Ne cherche pas plus.
- **Position tactique** : descends en profondeur sur 2-3 candidats, choisis le mieux noté de ces trois (5-10 minutes).
- **Position critique** : analyse les 3-4 candidats jusqu'à un horizon profond, accepte de prendre 15-20 minutes.

Apprendre à doser le temps selon la criticité de la position est probablement le critère le plus discriminant entre joueurs intermédiaires et joueurs forts.

## Décision sous risque vs sous ambiguïté : Ellsberg et le cas Sicilienne

[Daniel Ellsberg](https://fr.wikipedia.org/wiki/Daniel_Ellsberg) (le même qui a rendu publics les Pentagon Papers, oui) a montré dans sa thèse de 1961 que les humains préfèrent généralement les choix où ils *connaissent* les probabilités, même imparfaites, à ceux où ils sont dans l'incertitude knightienne pure. C'est le **paradoxe d'Ellsberg**.

Aux échecs, ce paradoxe explique une asymétrie connue. Imagine que tu choisis entre deux ouvertures :

- Variante A : tu la maîtrises bien, tu estimes que tu gagnes 55 % contre les joueurs de ton niveau.
- Variante B : tu la connais peu, tu *crois* qu'elle est meilleure, peut-être 60 %, mais tu n'es pas sûr.

La maximisation de l'espérance suggère B. Mais l'aversion à l'ambiguïté pousse vers A. Et empiriquement, A est souvent le bon choix : tes estimations sur B sont moins fiables, donc le 60 % a une variance importante autour. La sécurité informationnelle a une valeur.

Cette logique justifie certains choix conservateurs en répertoire d'ouverture, en particulier en tournoi à enjeu. Elle ne justifie pas le repli systématique sur ce qu'on connaît : à l'entraînement et hors enjeu, sortir de la zone d'ambiguïté est exactement ce qui élargit ton domaine de risque maîtrisé.

## La décision en temps limité : le facteur horloge

Toutes les théories ci-dessus supposent implicitement un temps de décision illimité. Aux échecs, l'horloge est elle-même partie intégrante du problème. La question n'est pas seulement "quel coup choisir ?", mais "combien de minutes consacrer à ce choix ?".

Économiquement, c'est un problème de **valeur marginale du temps**. Chaque minute supplémentaire de calcul a une utilité décroissante : passer de 1 à 2 minutes améliore beaucoup ton coup, passer de 30 à 31 minutes presque pas. Et chaque minute consacrée à cette décision est une minute en moins pour les décisions futures.

Une approximation utile : alloue ton temps proportionnellement à la **criticité** estimée de la position, et inversement à la **liquidité** des décisions futures. Plus précisément :

- Si tu vois clairement les 5 prochains coups (position liquide), consacre peu de temps au coup actuel.
- Si la position est critique mais limpide (un seul coup gagne, tu l'as vu), valide rapidement et joue.
- Si la position est critique et ambiguë, c'est le moment d'investir. C'est rare : peut-être 3 ou 4 moments par partie.

Les joueurs forts ont une lecture instinctive de ces zones critiques, qu'ils apprennent par milliers de parties. Pour les autres, une règle pratique : si l'évaluation de tes coups candidats varie de plus de 0,5 entre eux, tu es dans une zone critique.

## Recognition-primed decision : le modèle de Klein

[Gary Klein](https://en.wikipedia.org/wiki/Gary_A._Klein), psychologue cognitiviste, a étudié comment les experts (pompiers, pilotes, médecins urgentistes) prennent des décisions sous pression et incertitude. Son modèle de **recognition-primed decision** (RPD), publié en 1998 dans *Sources of Power*, décrit comment ils procèdent :

1. Reconnaissance d'un pattern dans la situation.
2. Activation d'une action associée à ce pattern dans la mémoire experte.
3. Simulation mentale rapide de cette action.
4. Si la simulation valide, exécution immédiate. Sinon, recherche d'un pattern alternatif.

Ce modèle décrit bien la prise de décision des Grands Maîtres en parties rapides ou blitz. Ils ne procèdent pas à une exploration exhaustive : ils reconnaissent un type de position, activent un type de plan associé en mémoire, simulent rapidement, et jouent.

L'implication pratique pour les joueurs en progression : la qualité de ta base de patterns reconnaissables est ce qui détermine la qualité de tes décisions sous pression. Travailler des positions typiques, mémoriser des structures, étudier des fins types : tout cela construit le répertoire qui te servira en RPD quand tu n'auras pas le temps d'analyser.

## Le principe de moindre engagement

Une heuristique sous-évaluée en théorie de la décision sous incertitude est le **principe de moindre engagement** : quand tu ne sais pas, garde tes options ouvertes le plus longtemps possible.

Aux échecs, ce principe se traduit par :

- Préférer un coup qui maintient plusieurs plans plausibles à un coup qui s'engage définitivement sur un seul plan.
- Choisir un coup qui ne ferme pas la position si l'évaluation est incertaine.
- Repousser les décisions structurelles (échanges, sacrifices, ouvertures de colonnes) tant que l'évaluation reste ambiguë.

Ce principe a un coût : tu peux paraître indécis ou passif. Mais en présence d'incertitude réelle sur la position, c'est une stratégie statistiquement gagnante. Tu obtiens plus d'informations sans payer le prix d'un engagement prématuré.

C'est un principe que [José Raúl Capablanca](https://fr.wikipedia.org/wiki/Jos%C3%A9_Ra%C3%BAl_Capablanca) appliquait systématiquement dans le milieu de jeu. Plutôt que de forcer une décision, il améliorait sa position progressivement, attendant que l'adversaire s'engage le premier ou que la position devienne plus claire.

## Un protocole de décision en 7 étapes

Pour intégrer tout ce qui précède dans une routine concrète, voici un protocole utilisable en partie classique. Il n'est pas à appliquer rigoureusement à chaque coup, mais à mobiliser dans les positions où tu sens qu'il faut "vraiment réfléchir".

1. **Cadre temporel.** Combien de minutes me coûte une décision de cette importance ? Réponse à donner en moins de 30 secondes. Donne-toi un budget.

2. **Identification des candidats.** Trois à cinq coups maximum. Au-delà, ton temps est mal investi en exploration de surface. Si tu n'as pas de candidats clairs, c'est un signe que le prior est faible et qu'il faut s'appuyer plus sur l'analyse concrète.

3. **Évaluation rapide de chaque candidat.** Une à deux phrases mentales par candidat. Objectif : éliminer les coups manifestement inférieurs.

4. **Identification des zones d'incertitude.** Sur les coups restants, quelle est la principale incertitude ? L'évaluation finale ? La réponse adverse précise ? Les conséquences à long terme ?

5. **Critère de choix.** Tu privilégies l'espérance la plus haute ? Le pire scénario le moins mauvais (maximin) ? Le moindre engagement ? Le choix du critère dépend du contexte (score du tournoi, adversaire, position dans la partie).

6. **Vérification anti-blunder.** Avant de jouer, une dernière passe : ton coup laisse-t-il une menace adverse non couverte ? Tu vérifies les échecs, les prises, les fourchettes, les batteries.

7. **Décision.** Tu joues. Tu ne reviens pas en arrière. La rumination post-coup est gérée par d'autres mécanismes (voir [le réseau du mode par défaut aux échecs](/blog/reseau-mode-defaut-aux-echecs/)).

Ce protocole, appliqué aux 5 ou 6 décisions critiques d'une partie, prend peu de temps cumulé. Sur les coups non critiques, l'expérience suffit.

**Après lecture :** identifie sur ta dernière partie *un* coup où tu as choisi entre deux candidats sans procédure claire. Reconstruis a posteriori quel critère implicite tu as utilisé. Tu peux être surpris du résultat.

---
