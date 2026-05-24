---
title: "Sujet Grand Oral Maths : En quoi le jeu d'échecs constitue-t-il un modèle de la pensée combinatoire ?"
excerpt: >-
  Sujet entièrement rédigé pour le Grand Oral spécialité Maths : principe multiplicatif, nombre de Shannon, arbres
  de dénombrement, croissance exponentielle. Texte de 10 minutes prêt à réciter.
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
  - combinatoire
  - dénombrement
  - principe multiplicatif
  - nombre de Shannon
seoTitle: "Sujet Grand Oral Maths combinatoire échecs : texte complet à réciter"
seoDescription: >-
  Sujet Grand Oral Maths sur la combinatoire et les échecs, entièrement rédigé pour 10 minutes d'exposé. Principe
  multiplicatif, nombre de Shannon, arbres de dénombrement : copie d'examen prête à utiliser.
ogImage: /images/blog/guide-grand-oral-echecs-maths-hero.png
heroImage:
  src: /images/blog/guide-grand-oral-echecs-maths-hero.png
  alt: "Sujet Grand Oral Maths sur la combinatoire et les échecs : texte rédigé pour 10 minutes d'exposé"
  credit: Blog d'un Gaucher
  license: Création originale
---

> **📥 Télécharger ce sujet en PDF** pour le réviser hors-ligne. Texte rédigé pour **dix minutes** d'exposé continu, prêt à utiliser tel quel.

---

Bonjour. Je vais vous parler d'un chiffre qui m'a fasciné quand je l'ai découvert : dix puissance cent vingt. C'est le nombre estimé de parties d'échecs possibles. Pour donner une idée, c'est plus que le nombre d'atomes dans l'univers observable, estimé à environ dix puissance quatre-vingts.

Le **sujet** que je vais traiter est précis : en quoi le jeu d'échecs constitue-t-il un modèle de la pensée combinatoire ? Cette **question** m'intéresse parce qu'elle se trouve au cœur du **programme** de spécialité **mathématiques** en **terminale** : elle mobilise le **principe multiplicatif**, les suites géométriques, le **dénombrement**, et la notion de croissance exponentielle. Le jeu d'échecs est l'un des **exemples** les plus spectaculaires pour illustrer ces notions abstraites avec un objet concret.

Je vais procéder en trois étapes. D'abord, je présenterai le principe multiplicatif appliqué à un coup d'échecs et je calculerai le nombre de Shannon. Ensuite, je montrerai comment ce nombre se modélise comme un **arbre** de dénombrement et comment il illustre la croissance exponentielle. Enfin, je discuterai les **limites** de cette modélisation combinatoire et les approches alternatives.

## Le principe multiplicatif et le nombre de Shannon

Pour calculer le nombre de parties d'échecs possibles, on utilise un outil de **terminale** : le **principe multiplicatif**. Si une expérience consiste à faire n choix successifs, et que le k-ième choix offre m_k possibilités, alors le nombre total de combinaisons est le produit m_1 × m_2 × ... × m_n.

Aux échecs, chaque joueur dispose en moyenne de trente-cinq coups légaux à chaque tour. Ce chiffre est ce qu'on appelle le **facteur de branchement**, généralement noté b. Une partie d'échecs typique dure environ quatre-vingts demi-coups, c'est-à-dire quarante coups par joueur. Notons d cette profondeur.

Le nombre de parties différentes est donc, au premier ordre, b puissance d, soit trente-cinq puissance quatre-vingts. Calculons : trente-cinq puissance quatre-vingts, en passant par le logarithme, donne quatre-vingts fois le logarithme de trente-cinq, soit environ quatre-vingts fois un virgule cinq quatre, soit cent vingt-trois virgule trois. On obtient donc environ dix puissance cent vingt-trois, qu'on arrondit traditionnellement à dix puissance cent vingt. C'est ce qu'on appelle le **nombre de Shannon**, calculé par Claude Shannon en mille neuf cent cinquante.

Pour donner une intuition, ce nombre s'écrit avec cent vingt zéros. Si on associait un grain de sable à chaque partie possible, on remplirait notre galaxie. Si on associait une milliseconde de calcul à chaque partie, l'âge de l'univers ne suffirait pas à les énumérer toutes.

Le calcul est mathématiquement simple, mais sa signification physique est profonde. Le **principe multiplicatif**, qu'on utilise au lycée pour des **exemples** triviaux (combien de tenues avec trois chemises et deux pantalons), produit ici un nombre que l'esprit humain ne peut pas se représenter.

## L'arbre de dénombrement et la croissance exponentielle

On peut visualiser le nombre de Shannon comme un **arbre** de **dénombrement**. La racine est la position initiale, où on a vingt coups possibles pour les Blancs. Chaque nœud représente une position, et a en moyenne trente-cinq fils, qui sont les positions atteignables en un coup. Les feuilles sont les positions finales, ou les positions atteintes à la profondeur d'analyse fixée.

Mathématiquement, le nombre de nœuds à la profondeur k est b puissance k. Pour k égal à un : trente-cinq positions. Pour k égal à deux : trente-cinq au carré, soit mille deux cent vingt-cinq. Pour k égal à quatre : trente-cinq puissance quatre, soit environ un million et demi. C'est exactement une **suite géométrique** de raison b, c'est-à-dire la suite (u_n) définie par u_0 = 1 et u_{n+1} = 35 × u_n.

Cette suite illustre parfaitement la notion de **croissance exponentielle** au **programme** de **terminale**. Le terme général est u_n = b puissance n. Sa croissance n'est pas une intuition pour le cerveau humain, qui pense plutôt en termes linéaires ou polynomiaux. C'est pour cela que les **mathématiques** sont indispensables : elles nous permettent de raisonner sur des objets que nous ne pouvons pas visualiser.

L'**arbre** de dénombrement aux échecs a une propriété remarquable : il ne croît pas linéairement avec la durée de la partie, il explose. Cette explosion est ce qu'on appelle l'**explosion combinatoire**, et c'est l'un des phénomènes les plus importants en **mathématiques** appliquées et en **informatique**. Elle apparaît dans la cryptographie (force brute), dans la biologie (combinaisons d'ADN), dans la chimie (conformations moléculaires), et dans tous les problèmes où il faut chercher dans un espace très grand.

Pour le **jury**, je peux dessiner un petit **arbre** à trois niveaux avec branchement trois (au lieu de trente-cinq, par lisibilité). Cela donne un schéma avec un nœud racine, trois fils, neuf petits-fils, vingt-sept arrière-petits-fils. Même avec ce branchement réduit, à dix niveaux on dépasse cinquante mille nœuds. À vingt niveaux, on dépasse trois milliards. Le message est limpide : la croissance exponentielle bat toutes les intuitions.

## Limites de la modélisation combinatoire et approches alternatives

Le calcul du nombre de Shannon a deux **limites** majeures qu'il faut signaler honnêtement au **jury**.

Premièrement, il s'agit d'une **estimation grossière**. Le facteur de branchement varie selon la phase de partie : il est plus bas en ouverture (environ vingt), plus haut en milieu de jeu (jusqu'à quarante), et redescend en finale. La profondeur moyenne varie aussi : certaines parties durent vingt coups, d'autres cent. Une estimation plus fine, due à Allis en mille neuf cent quatre-vingt-quatorze, donne plutôt dix puissance cent vingt-trois pour le nombre total de positions atteignables, et environ dix puissance cent quarante-cinq pour le nombre de parties distinctes. Ces chiffres dépassent encore largement toute capacité humaine d'imagination.

Deuxièmement, et c'est la **limite** la plus profonde, le **dénombrement** ne nous dit rien sur la **qualité** des coups. Compter les positions, c'est compter du bruit autant que du signal. La plupart des dix puissance cent vingt parties théoriques sont absurdes : enchaînements de mauvais coups qu'aucun joueur, même débutant, ne jouerait. Le nombre de parties effectivement jouées dans toute l'histoire de l'humanité est de l'ordre de dix puissance neuf, soit cent onze ordres de grandeur en dessous. La combinatoire pure mesure un espace potentiel, pas un espace explorable.

C'est pour cela que les **mathématiques** de la performance aux échecs ne se réduisent pas à la combinatoire. Le classement Elo, par **exemple**, repose sur une approche probabiliste : on ne compte pas les parties possibles, on modélise la probabilité de victoire entre deux joueurs en fonction de l'écart de leurs cotes. Cette approche, due à Arpad Elo dans les années mille neuf cent soixante, est complémentaire et non concurrente de la combinatoire. Elle reconnaît qu'on ne peut pas tout calculer, et qu'il faut donc modéliser ce qu'on ne peut pas calculer.

Une autre approche complémentaire est celle de la **théorie des jeux**, notamment le **théorème de Zermelo** publié en mille neuf cent treize. Ce théorème démontre que tout jeu à information complète, sans hasard, à nombre fini de coups (donc les échecs) admet un résultat déterminé sous jeu parfait : l'un des deux joueurs gagne forcément, ou la partie est forcément nulle. Mais Zermelo ne nous dit pas lequel. La combinatoire et la **théorie des jeux** se rejoignent ici : le résultat est théoriquement déterminé, mais l'espace est trop grand pour qu'on puisse le calculer.

## Conclusion

Pour répondre à ma **question** initiale, le jeu d'échecs constitue un modèle de la pensée combinatoire à trois titres. D'abord, parce qu'il offre l'application la plus spectaculaire du **principe multiplicatif** : trente-cinq coups par tour, quatre-vingts demi-coups, donne dix puissance cent vingt parties. Ensuite, parce qu'il incarne la notion de **croissance exponentielle** d'une **suite géométrique**, dont la rapidité dépasse l'intuition humaine. Enfin, parce qu'il révèle les **limites** de la combinatoire pure : compter les possibilités ne suffit pas à les explorer, ni à les évaluer.

Cette **question** dépasse de loin les échecs. Elle se rejoue à chaque fois qu'on travaille sur un espace de grande dimension : génomique, cryptographie, optimisation, recherche scientifique. À chaque fois, le **dénombrement** combinatoire nous dit que l'espace est trop grand pour être énuméré, et nous force à inventer d'autres approches : probabilistes, heuristiques, algorithmiques. Les échecs sont peut-être un jeu, mais ils sont aussi une introduction concrète à l'une des grandes idées des **mathématiques** modernes.

Je vous remercie pour votre attention et je suis prêt à répondre à vos **questions**.

---

> **Pour aller plus loin :** [Sujet Grand Oral Maths sur Elo et probabilités](/fr/blog/sujet-grand-oral-maths-elo-probabilites/) · [Sujet Grand Oral Maths sur Zermelo et complexité](/fr/blog/sujet-grand-oral-maths-zermelo-complexite/) · [Hub méthodologie Grand Oral Maths](/fr/blog/guide-grand-oral-echecs-maths/)
