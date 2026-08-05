---
title: "Sujet Grand Oral Maths : Pourquoi les mathématiques prouvent-elles que les échecs ne seront jamais résolus par la force brute ?"
excerpt: >-
  Sujet entièrement rédigé pour le Grand Oral spécialité Maths : théorème de Zermelo, complexité algorithmique, force
  brute, limites physiques du calcul. Texte de 10 minutes prêt à réciter.
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
  - Zermelo
  - complexité
  - théorie des jeux
  - force brute
seoTitle: "Sujet Grand Oral Maths Zermelo complexité échecs : texte complet à réciter"
seoDescription: >-
  Sujet Grand Oral Maths sur le théorème de Zermelo et la complexité, entièrement rédigé pour 10 minutes d'exposé.
  Force brute, jeu parfait, limites physiques : copie d'examen prête à utiliser.
ogImage: /images/blog/guide-grand-oral-echecs-maths-hero.png
heroImage:
  src: /images/blog/guide-grand-oral-echecs-maths-hero.png
  alt: "Sujet Grand Oral Maths sur Zermelo et la complexité : texte rédigé pour 10 minutes d'exposé"
  credit: Blog d'un Gaucher
  license: Création originale
---

> **📥 Télécharger ce sujet en PDF** pour le réviser hors-ligne. Texte rédigé pour **dix minutes** d'exposé continu, prêt à utiliser tel quel.

---

Bonjour. Je vais vous présenter un paradoxe qui m'a intrigué : on sait que les échecs ont un résultat mathématiquement déterminé, et pourtant on ne le connaîtra probablement jamais. C'est un paradoxe qui relève des **mathématiques** pures et qui touche aux **limites** physiques du calcul.

Le **sujet** est précis : pourquoi les **mathématiques** prouvent-elles que les échecs ne seront jamais résolus par la force brute ? Cette **question** m'intéresse parce qu'elle mobilise plusieurs notions du **programme** de spécialité **mathématiques** de **terminale** : la **complexité** algorithmique, la croissance exponentielle, et plus profondément l'idée qu'un objet mathématique peut être théoriquement défini mais pratiquement inaccessible.

Je procéderai en trois étapes. D'abord, je présenterai le théorème de Zermelo, qui prouve que les échecs ont un résultat déterminé sous jeu parfait. Ensuite, je discuterai la **complexité** combinatoire du jeu et le calcul du nombre de Shannon. Enfin, je confronterai ce nombre aux **limites** physiques du calcul pour conclure que la force brute est non seulement impraticable, mais physiquement impossible.

## Le théorème de Zermelo : un résultat existe

Commençons par un résultat de **mathématiques** pures, démontré par Ernst Zermelo en mille neuf cent treize, à l'occasion du cinquième Congrès international des mathématiciens. Le théorème s'énonce ainsi : tout jeu fini à deux joueurs, à information complète et sans hasard, admet un résultat déterminé sous jeu parfait.

Précisons les hypothèses. **Jeu fini** : la partie se termine en un nombre fini de coups. C'est vrai aux échecs, grâce à la règle des cinquante coups et à la répétition triple. **Deux joueurs** : un Blanc et un Noir, alternant. **Information complète** : chaque joueur voit la position entière ; il n'y a pas de carte cachée comme au poker. **Sans hasard** : pas de dé, pas de tirage aléatoire.

Sous ces hypothèses, Zermelo démontre par récurrence sur la profondeur de l'arbre de jeu que l'un de ces trois cas est inévitable : soit les Blancs ont une stratégie gagnante, soit les Noirs ont une stratégie gagnante, soit les deux ont une stratégie de nulle. Ce résultat est extrêmement fort. Il signifie qu'aux échecs, le résultat est déterministe : avec jeu parfait des deux côtés, la partie se finit toujours de la même manière, quel que soit le scénario suivi.

La beauté du théorème, c'est qu'il s'agit d'un résultat d'existence. Zermelo ne nous dit pas quel est ce résultat. Il prouve seulement qu'il existe. Pour les échecs, on ne sait pas si la position de départ est gagnante pour les Blancs, gagnante pour les Noirs, ou nulle. La conjecture la plus partagée est que c'est nulle, mais ce n'est pas démontré.

Ce résultat est analogue à beaucoup de théorèmes d'existence en **mathématiques** : on prouve qu'un objet existe sans pouvoir le construire. C'est par **exemple** le cas du théorème des valeurs intermédiaires, qui prouve l'existence d'une solution à une équation continue sans donner la solution. Zermelo ne nous donne pas la solution des échecs, il nous dit seulement qu'elle existe.

![Arbre de jeu illustrant le théorème de Zermelo : par récurrence depuis les feuilles, MAX choisit le résultat maximal et MIN le minimal, garantissant qu'un résultat déterminé remonte jusqu'à la racine.](/images/sujet-zermelo-complexite-01-theoreme-zermelo.svg)

## La complexité combinatoire : un calcul qui explose

Si on sait que la solution existe, pourquoi ne la calcule-t-on pas ? La réponse tient en un mot : la **complexité**.

Pour résoudre les échecs par la force brute, il faudrait construire l'arbre complet du jeu et l'analyser par minimax. À chaque tour, chaque joueur dispose en moyenne de trente-cinq coups. Une partie dure environ quatre-vingts demi-coups. Par le **principe multiplicatif**, le nombre de parties possibles est de l'ordre de trente-cinq puissance quatre-vingts. Le calcul donne environ dix puissance cent vingt. C'est le **nombre de Shannon**, calculé par Claude Shannon en mille neuf cent cinquante.

Pour comparer, le nombre d'atomes dans l'univers observable est estimé à dix puissance quatre-vingts. Le nombre de Shannon est donc dix puissance quarante fois plus grand. Si on associait chaque partie d'échecs à un atome, il faudrait dix puissance quarante univers pour les contenir tous.

En notation grand O, la **complexité** de la force brute est O(b puissance d), où b est le facteur de branchement et d la profondeur. C'est une **complexité exponentielle**. Cette classe de **complexité**, au **programme** de **terminale**, est la pire qu'on puisse rencontrer dans l'analyse d'un algorithme : elle bat largement la complexité polynomiale, et elle rend le calcul impraticable dès que la taille du problème dépasse quelques dizaines.

Pour mettre cela en perspective, comparons avec d'autres jeux résolus. Le morpion a un arbre d'environ cinq mille positions, résolu trivialement. Le puissance quatre a sept mille milliards de positions, résolu en mille neuf cent quatre-vingt-huit : les Blancs gagnent toujours avec un jeu parfait. Les dames ont environ dix puissance vingt positions, résolu en deux mille sept par Jonathan Schaeffer après dix-huit ans de calcul : c'est une nulle sous jeu parfait. Les échecs, à dix puissance cent vingt, sont cinquante ordres de grandeur au-dessus des dames. Aucune extrapolation raisonnable ne permet d'imaginer leur résolution.

## Les limites physiques du calcul

Mais peut-être que dans le futur, avec des ordinateurs beaucoup plus puissants, on pourrait calculer ? La réponse mathématique est non, pour des raisons physiques.

Le physicien Hans Bremermann, dans les années mille neuf cent soixante, a calculé une **limite** théorique fondamentale appelée **limite de Bremermann**. Elle s'énonce ainsi : aucun ordinateur classique ne peut effectuer plus que mc² divisé par h opérations par seconde par kilogramme, où m est la masse, c la vitesse de la lumière, et h la constante de Planck. Le calcul donne environ deux puissance soixante-quatre opérations par gramme par seconde.

À partir de cette borne, on peut estimer combien d'opérations pourraient être effectuées par un ordinateur de la taille de la Terre, fonctionnant pendant l'âge de l'univers. Le résultat est de l'ordre de dix puissance quatre-vingt-treize opérations. C'est-à-dire vingt-sept ordres de grandeur en dessous du nombre de Shannon.

Autrement dit, même si on transformait toute la Terre en ordinateur, et qu'on le faisait fonctionner depuis le big bang jusqu'à aujourd'hui, on n'aurait pas effectué assez d'opérations pour explorer l'arbre des échecs par force brute. C'est une **limite** physique, pas une **limite** technologique : aucun progrès n'y changera quoi que ce soit.

![Comparaison logarithmique : atomes dans l'univers (10^80), opérations maximales selon Bremermann (10^93) et nombre de Shannon (10^120) — l'écart de 27 ordres de grandeur rend la force brute physiquement impossible.](/images/sujet-zermelo-complexite-02-limite-bremermann.svg)

Cette **limite** est ce qui rend les **mathématiques** d'AlphaZero si frappantes. Au lieu d'explorer l'arbre exhaustivement, AlphaZero apprend à reconnaître les bonnes positions par un réseau de neurones. Il joue au niveau humain non pas en calculant plus, mais en calculant différemment. C'est une réponse pragmatique au théorème de Zermelo : la solution existe en théorie, mais elle est inaccessible en pratique ; donc on construit des approximations qui marchent suffisamment bien.

Cette idée se retrouve dans toutes les **mathématiques** appliquées. En cryptographie, on protège les **données** en utilisant des problèmes dont la solution existe mais nécessiterait des milliards d'années. En optimisation, on accepte des solutions sous-optimales parce que la solution optimale est inaccessible. En statistique, on travaille avec des estimateurs approximatifs parce que la vraie valeur est inconnue. Les **mathématiques** de la **complexité** ne nous disent pas seulement ce qu'on peut calculer : elles nous disent ce qu'on ne pourra jamais calculer.

## Conclusion

Pour répondre à ma **question** initiale, les **mathématiques** prouvent que les échecs ne seront jamais résolus par la force brute pour trois raisons combinées. D'abord, le théorème de Zermelo nous dit que le résultat existe, mais ne nous le donne pas. Ensuite, le nombre de Shannon, dix puissance cent vingt, dépasse toute capacité de stockage et de calcul concevable. Enfin, la **limite** de Bremermann fixe une borne physique au-delà de laquelle aucun ordinateur classique ne peut aller, et cette borne est largement insuffisante pour les échecs.

L'ouverture la plus profonde, c'est que cette impossibilité n'est pas un échec des **mathématiques** : c'est leur réussite. Les **mathématiques** ne nous protègent pas des problèmes difficiles, elles nous disent précisément ce qu'on peut faire et ce qu'on ne peut pas faire. Connaître la **limite** est en soi une forme de victoire intellectuelle. Et c'est précisément parce qu'on connaît cette **limite** qu'on a inventé les approches alternatives, des moteurs symboliques aux réseaux de neurones. Les échecs, par leur résistance à la résolution, ont été un moteur des **mathématiques** appliquées du vingtième siècle.

Je vous remercie pour votre attention et je suis prêt à répondre à vos **questions**.

---

> **Pour aller plus loin :** [Sujet Grand Oral Maths sur la combinatoire](/fr/blog/sujet-grand-oral-maths-combinatoire/) · [Sujet Grand Oral Maths sur Elo et probabilités](/fr/blog/sujet-grand-oral-maths-elo-probabilites/) · [Hub méthodologie Grand Oral Maths](/fr/blog/grand-oral-maths-spe-echecs/)
