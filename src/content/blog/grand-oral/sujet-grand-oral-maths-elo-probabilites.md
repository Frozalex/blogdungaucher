---
title: "Sujet Grand Oral Maths : Dans quelle mesure les probabilités permettent-elles de modéliser la performance aux échecs ?"
excerpt: >-
  Sujet entièrement rédigé pour le Grand Oral spécialité Maths : loi binomiale, formule Elo, suites récurrentes,
  convergence et loi des grands nombres. Texte de 10 minutes prêt à réciter.
publishDate: "2026-05-05"
category: grand-oral
featured: false
featuredRank: 99
readingTime: 12 min
pillar: Grand Oral
tags:
  - grand-oral
  - mathématiques
  - terminale
  - baccalauréat
  - sujet
  - probabilités
  - loi binomiale
  - Elo
  - suite récurrente
  - convergence
seoTitle: "Sujet Grand Oral Maths probabilités Elo échecs : texte complet à réciter"
seoDescription: >-
  Sujet Grand Oral Maths sur les probabilités et le classement Elo aux échecs, entièrement rédigé pour 10 minutes.
  Loi binomiale, suites récurrentes, convergence : copie d'examen prête à utiliser.
ogImage: /images/blog/guide-grand-oral-echecs-maths-hero.png
heroImage:
  src: /images/blog/guide-grand-oral-echecs-maths-hero.png
  alt: "Sujet Grand Oral Maths sur les probabilités et le classement Elo : texte rédigé pour 10 minutes d'exposé"
  credit: Blog d'un Gaucher
  license: Création originale
---

> **📥 Télécharger ce sujet en PDF** pour le réviser hors-ligne. Texte rédigé pour **dix minutes** d'exposé continu, prêt à utiliser tel quel.

---

Bonjour. Je vais vous parler d'un cas où les **mathématiques** abstraites du **programme** de **terminale** rencontrent un objet concret : le classement des joueurs d'échecs.

Le **sujet** est précis : dans quelle mesure les probabilités permettent-elles de modéliser la performance aux échecs ? Cette **question** me semble parfaite pour le Grand Oral parce qu'elle mobilise plusieurs chapitres du **programme** : la **loi binomiale**, les **suites récurrentes**, les **fonctions** logistiques, et la **loi des grands nombres**.

L'enjeu est concret. Quand un grand maître joue contre un débutant, on s'attend à ce qu'il gagne. Mais quelle est exactement la probabilité de victoire ? Comment la calculer ? Comment la mettre à jour après chaque partie ? Le classement Elo, créé par le physicien Arpad Elo dans les années mille neuf cent soixante, répond à ces **questions** avec un modèle élégant. Je vais l'analyser ici sous l'angle mathématique.

Je procéderai en trois étapes. D'abord, j'appliquerai la **loi binomiale** à un match entre joueurs supposés de même niveau. Ensuite, je présenterai la formule Elo et je montrerai qu'elle correspond à une **suite récurrente** convergente. Enfin, je discuterai les **limites** du modèle et ses approches alternatives.

## La loi binomiale appliquée à un match

Commençons par la modélisation la plus directe. Imaginons deux joueurs de niveau identique qui jouent dix parties consécutives. Aux échecs, il y a trois résultats possibles : victoire, nulle, défaite. Pour simplifier, on compte une nulle comme une demi-victoire. Sur dix parties, le nombre de victoires (ou demi-victoires comptées) suit, sous hypothèses, une **loi binomiale**.

Plus précisément, si on note X la variable aléatoire qui compte le nombre de victoires du joueur A sur n parties, et si chaque partie est une expérience de Bernoulli de paramètre p (probabilité de victoire de A à chaque partie), alors X suit la loi B(n, p). La probabilité d'obtenir exactement k victoires est donnée par la formule au **programme** de **terminale** : P(X = k) égale combinaison de n parmi k, multiplié par p puissance k, multiplié par (1 - p) puissance (n - k).

Calculons un **exemple** numérique. Pour n égal à dix et p égal à zéro virgule cinq (joueurs supposés de même niveau), la probabilité de gagner exactement six parties sur dix vaut combinaison de dix parmi six, soit deux cent dix, multiplié par zéro virgule cinq puissance dix, soit un sur mille vingt-quatre. Le calcul donne environ zéro virgule deux zéro cinq, soit vingt virgule cinq pour cent.

Plus intéressant encore : la probabilité de remporter le match, c'est-à-dire de gagner au moins six parties sur dix, s'obtient en sommant P(X = 6) + P(X = 7) + ... + P(X = 10). Le calcul donne environ zéro virgule trois sept sept, soit trente-sept virgule sept pour cent.

C'est un résultat contre-intuitif. Même entre joueurs parfaitement égaux, le résultat parfaitement équitable de cinq-cinq n'a que vingt-cinq pour cent de probabilité. Autrement dit, un score « inégal » est plus probable qu'un score « égal ». La **loi binomiale** explique pourquoi tant de matchs paraissent déséquilibrés alors que les joueurs sont au même niveau : c'est le hasard de la distribution, pas une différence de force.

![Distribution binomiale B(10 ; 0,5) : P(X = 5) ≈ 24,6 % seulement, et la probabilité de gagner au moins 6 parties sur 10 est ≈ 37,7 %, plus élevée qu'un score parfaitement égal.](/images/sujet-elo-02-loi-binomiale.svg)

La principale **limite** de cette modélisation est l'hypothèse p égal à zéro virgule cinq. En pratique, deux joueurs ne sont jamais exactement au même niveau. Il faut donc une méthode pour estimer p à partir des cotes des deux joueurs. C'est ce que fait la formule Elo.

## La formule Elo et la suite récurrente de mise à jour

Le système Elo est composé de deux **fonctions** mathématiques essentielles. La première estime la probabilité de victoire à partir des cotes. La seconde met à jour les cotes après chaque partie.

La **formule de probabilité** s'écrit : P(A bat B) égale un divisé par (un plus dix puissance (R_B moins R_A divisé par quatre cents)), où R_A et R_B sont les cotes des deux joueurs. Cette fonction est une **sigmoïde** : elle vaut toujours entre zéro et un, elle est croissante en (R_A moins R_B), et elle prend la valeur zéro virgule cinq quand les cotes sont égales.

Calculons un **exemple**. Si R_A vaut mille six cents et R_B vaut mille huit cents, l'écart est de deux cents points en faveur de B. On calcule P égale un divisé par (un plus dix puissance zéro virgule cinq), soit un divisé par environ quatre virgule un six, soit environ zéro virgule deux quatre. Donc le joueur A, plus faible, a environ vingt-quatre pour cent de chances de battre B. Ce chiffre, vingt-quatre pour cent, est précieux : il quantifie une intuition qualitative (« A est plus faible mais peut gagner »).

![Courbe sigmoïde de la formule Elo : P(A bat B) vaut 0,5 quand les cotes sont égales, monte à 0,76 pour un écart de +200 points et descend à 0,24 pour −200 points, toujours comprise entre 0 et 1.](/images/sujet-elo-01-sigmoide-probabilite.svg)

La **mise à jour de cote**, après une partie, suit la formule R'_A égale R_A plus K multiplié par (résultat moins P), où le résultat vaut un en cas de victoire, zéro virgule cinq en cas de nulle, zéro en cas de défaite, et où K est un coefficient typiquement entre seize et trente-deux.

Si A bat B contre toute attente, alors R'_A vaut mille six cents plus seize multiplié par (un moins zéro virgule deux quatre), soit mille six cents plus seize multiplié par zéro virgule sept six, soit mille six cents plus douze, soit mille six cent douze. A gagne douze points. Symétriquement, B perd douze points : c'est un système à somme nulle.

Si en revanche A perd, ce qui était attendu, alors R'_A vaut mille six cents plus seize multiplié par (zéro moins zéro virgule deux quatre), soit mille six cents moins quatre, soit mille cinq cent quatre-vingt-seize. A perd seulement quatre points : sa cote bouge peu parce que la défaite est conforme au pronostic.

Du point de vue du **programme** de **terminale**, ce mécanisme est une **suite récurrente**. Si on note u_n la cote du joueur A après la n-ième partie, on a la relation u_{n+1} égale u_n plus K multiplié par (r_n moins p_n), où r_n est le résultat de la n-ième partie et p_n la probabilité prédite par la formule Elo. Cette suite est-elle convergente ?

Sous l'hypothèse que le joueur A a un **vrai niveau** E constant, on peut montrer que u_n converge vers E. L'idée intuitive : à chaque partie, l'espérance de (r_n moins p_n) est nulle si la probabilité prédite est exacte. Donc en moyenne, la cote ne dérive pas de E. C'est une application directe de la **loi des grands nombres** : la moyenne empirique des résultats converge vers l'espérance théorique, et la cote s'ajuste autour de E.

## Limites du modèle et approches alternatives

Le système Elo est un modèle élégant, mais il repose sur trois hypothèses qu'il faut discuter honnêtement.

Première hypothèse : la **stationnarité**. La cote suppose que le niveau du joueur reste constant entre les parties. C'est faux en pratique : un joueur progresse, un autre fatigue, un troisième vieillit. Le coefficient K, plus élevé pour les débutants et plus bas pour les joueurs établis, est un palliatif partiel. C'est le compromis biais-variance classique en statistique : plus K est grand, plus la cote suit les changements de niveau, mais plus elle fluctue à cause du bruit.

Deuxième hypothèse : l'**indépendance** des parties. La **loi binomiale** suppose que chaque partie est indépendante des précédentes. Or une victoire renforce psychologiquement, une défaite peut entraîner une cascade d'erreurs. Les corrélations sont réelles mais difficiles à modéliser.

Troisième hypothèse : la **validité de la sigmoïde**. La formule Elo a été calibrée sur des populations de joueurs occidentaux dans les années mille neuf cent soixante. Aux extrêmes (écarts de plus de quatre cents points), la formule extrapole hors de son domaine de calibration. Pour quantifier : la probabilité qu'un joueur de mille deux cents Elo batte Magnus Carlsen, à deux mille huit cent cinquante, vaut un divisé par (un plus dix puissance quatre virgule un deux cinq), soit environ zéro virgule zéro zéro zéro zéro sept cinq, c'est-à-dire à peu près une chance sur treize mille. Cette précision est suspecte : en réalité, le débutant n'a jamais battu Carlsen, et la formule ne peut pas être validée empiriquement à ces écarts.

Une approche alternative, plus moderne, est celle d'AlphaZero. Ce **programme** n'utilise pas de modèle probabiliste explicite. Son réseau de neurones estime directement une valeur de position et une distribution de probabilité sur les coups, mais ces probabilités sont implicites, issues d'un apprentissage. AlphaZero remet en cause l'idée que les probabilités doivent être modélisées par des formules : elles peuvent être apprises par expérience. C'est un changement de **paradigme**, qui montre les **limites** de l'approche paramétrique.

## Conclusion

Pour répondre à ma **question** initiale, les probabilités permettent de modéliser la performance aux échecs avec une précision remarquable mais bornée. La **loi binomiale** explique pourquoi des matchs déséquilibrés peuvent émerger de joueurs égaux. La formule Elo, à travers une **suite récurrente** convergente, permet d'estimer la probabilité de victoire entre deux joueurs quelconques et de mettre à jour leurs cotes au fil des parties. La **loi des grands nombres** assure que cette estimation converge vers la vraie force des joueurs, sous des hypothèses de stationnarité.

Les **limites** sont précises : stationnarité, indépendance, calibration aux extrêmes. Les modèles modernes par apprentissage automatique offrent une alternative non paramétrique mais opaque. À mon sens, cette discussion entre modélisation explicite et apprentissage statistique est l'un des grands **enjeux** des **mathématiques** appliquées contemporaines, et les échecs en sont l'un des **exemples** les plus pédagogiques.

Je vous remercie pour votre attention et je suis prêt à répondre à vos **questions**.

---

> **Pour aller plus loin :** [Sujet Grand Oral Maths sur la combinatoire](/fr/blog/sujet-grand-oral-maths-combinatoire/) · [Sujet Grand Oral Maths sur Zermelo et complexité](/fr/blog/sujet-grand-oral-maths-zermelo-complexite/) · [Hub méthodologie Grand Oral Maths](/fr/blog/grand-oral-maths-spe-echecs/)
