---
title: "Le biais du survivant aux échecs : le cimetière que tu ne vois pas"
excerpt:
  "Les parties mémorables et les méthodes des champions peuvent instruire sans représenter tous les essais. Comment repérer le filtre avant de conclure."
publishDate: "2026-09-08"
category: esprit
featured: false
featuredRank: 99
readingTime: 9 min
pillar: Psychologie
tags:
  - biais du survivant
  - biais cognitifs
  - Abraham Wald
  - ouvertures
  - progression
  - statistiques
  - échecs
seoTitle: "Biais du survivant aux échecs : ouvertures, conseils de GM et prodiges"
seoDescription: "Biais du survivant aux échecs : examiner la sélection des parties, les témoignages de grands maîtres et les cas manquants avant de conclure sur une méthode."
faq:
  - question: "Le biais rend-il tout conseil de grand maître inutile ?"
    answer: "Non. Un témoignage peut être instructif ; il ne suffit pas à estimer les chances de réussite de toute personne qui le suivrait."
  - question: "Comment examiner les statistiques d’une ouverture ?"
    answer: "Regarde l’effectif, la période, la cadence, les classements et la sélection des parties. Le score pratique ne démontre pas une valeur théorique."
  - question: "Les succès des sœurs Polgár prouvent-ils que l’entraînement suffit ?"
    answer: "Une trajectoire familiale ne permet pas, à elle seule, de séparer toutes les influences sur le niveau. Cela ne diminue pas leurs réussites."
heroImage:
  src: /images/blog/biais-du-survivant-aux-echecs-hero.webp
  alt: Un bateau en papier flotte au-dessus de nombreux bateaux coulés.
ogImage: /images/og/biais-du-survivant-aux-echecs-og.webp

---

Le biais du survivant apparaît lorsque le filtre qui rend certains cas visibles disparaît du raisonnement. Une sélection de parties réussies peut montrer les ressources d'un gambit, sans indiquer ce qu'il rapporte sur l'ensemble des parties jouées.

La question centrale est celle du dénominateur : quels échecs, abandons ou résultats ordinaires manquent dans la comparaison ? Une réussite reste instructive, mais sa valeur d'exemple doit être distinguée de sa représentativité.

## Les avions revenus de mission

En 1943, Abraham Wald travaille au Statistical Research Group de Columbia sur l’estimation de la vulnérabilité des avions à partir des dégâts des survivants. Ses mémorandums sont réédités en 1980 par le Center for Naval Analyses.

Son problème comporte des données manquantes : les avions abattus ne reviennent pas fournir leur relevé de dégâts. Les impacts observés sur les appareils revenus ne décrivent donc pas directement la vulnérabilité de toute la flotte. Les calculs nécessitent des hypothèses sur les atteintes et la survie.

La leçon dépasse la formule « renforcer là où il n’y a pas de trous ». Une zone peu touchée parmi les survivants ne prouve pas, à elle seule, que chaque impact dans cette zone serait fatal. Il faut examiner le mécanisme de sélection et les hypothèses du modèle.

La réédition permet de vérifier le document derrière l'anecdote : elle rassemble des mémorandums et des calculs de probabilités conditionnelles. Le sujet n'est pas une intuition magique qui remplacerait les données ; c'est un problème d'inférence lorsque l'observation dépend de la survie. [Wald, mémorandums réédités par le CNA](https://pic.blog.plover.com/misc/survivorship-bias/A_Reprint_Plane_Vulnerability.pdf).

## Le filtre change la question à laquelle tu réponds

Imaginons **cent essais d'une méthode fictive**, dont dix réussissent selon un critère fixé à l'avance. Les cent essais sont connus dans cet exemple construit. Si une sélection conserve les dix réussites et seulement dix échecs, l'échantillon visible contient vingt cas : son taux de réussite est de 50 %, contre 10 % dans l'ensemble initial.

| Ensemble | Réussites | Échecs | Total | Part de réussites |
| --- | ---: | ---: | ---: | ---: |
| Tous les essais fictifs | 10 | 90 | 100 | 10 % |
| Cas retenus pour publication | 10 | 10 | 20 | 50 % |
| Cas absents de la sélection | 0 | 80 | 80 | 0 % |

Aucun des vingt récits publiés n'a besoin d'être faux pour que la conclusion globale soit erronée. Le problème apparaît si tu utilises la proportion des cas visibles pour estimer celle de tous les essais, en oubliant la règle de publication.

On peut l'écrire avec une probabilité conditionnelle : $P(\text{réussite}\mid\text{visible})$ n'est pas nécessairement égal à $P(\text{réussite})$. La barre signifie « parmi les cas visibles ». Dans notre tableau, tu connais les deux ensembles ; dans une situation réelle, une partie du dénominateur peut justement te manquer.

L'absence de ces cas ne permet pas d'inventer leur nombre. Si tu n'as accès qu'à une collection de témoignages, tu peux expliquer pourquoi elle ne donne pas un taux global fiable. Tu ne peux pas remplacer ce taux par une estimation pessimiste sans données supplémentaires.

![Un ensemble initial passe par un filtre de sélection avant de devenir l’échantillon visible.](/images/survivant-filtre.svg)

## Le conseil d’un joueur qui a réussi

Quand un grand maître raconte sa progression, son expérience peut t’apprendre beaucoup. Elle ne montre pas combien de joueurs ont suivi une méthode comparable sans obtenir le même résultat.

Demande ce qui est proposé : un témoignage, une explication technique ou une estimation de l’efficacité d’un programme. Un témoignage n’a pas besoin d’être faux pour devenir trompeur lorsqu’on le transforme en garantie.

La réussite des sœurs Polgár ne constitue pas, à elle seule, une expérience contrôlée permettant de séparer toutes les influences sur le niveau. Il faudrait comparer des situations suffisamment proches. Imaginer des milliers de familles disparues des statistiques ne remplace pas non plus ces données.

### Trois usages très différents d'un témoignage

Un champion peut expliquer une finale : tu peux vérifier les variantes et essayer la méthode. Il peut raconter son organisation : tu peux y trouver une idée à adapter. Il peut enfin affirmer que cette organisation conduit généralement au même succès : cette dernière proposition demande des données sur les personnes qui l'ont suivie, y compris celles qui n'ont pas obtenu le résultat.

La qualité de la première leçon ne dépend pas du fait que tu connaisses tous les anciens élèves du champion. En revanche, une promesse sur les chances de devenir professionnel ne se vérifie pas avec quelques trajectoires choisies. Distinguer ces usages évite de rejeter tout savoir transmis par les meilleurs.

Avant d'adopter un programme, demande-toi ce qui correspond à ton cas : temps disponible, difficultés, âge d'apprentissage, objectifs et accès à un accompagnement. Ce sont des critères de comparaison proposés, pas des facteurs dont cet article aurait mesuré les effets séparément.

Tu peux tester une adaptation sur un objectif limité, comme mieux convertir une finale identifiée. Un progrès sur cet objectif reste utile même s'il ne dit rien sur la probabilité de devenir grand maître. Le témoignage devient alors une source d'exercices à examiner plutôt qu'une garantie de carrière.

## Les parties conservées ne représentent pas tout le jeu

Une base dépend de ses règles de collecte : compétitions couvertes, cadence, niveau, publication et période. Avant de lire un pourcentage d’ouverture, regarde ces critères et le nombre de parties.

Un score élevé ne prouve pas qu’une variante donne un avantage théorique. Les joueurs qui la choisissent, leurs adversaires et les circonstances peuvent différer. Inversement, l’absence d’une ligne dans un livre ne démontre ni sa réfutation ni son excellence cachée.

La théorie des ouvertures peut aussi intégrer des analyses de positions jamais jouées. La réduire aux seules parties spectaculaires publiées serait une autre généralisation.

### Une miniature peut enseigner sans représenter

Un recueil de victoires rapides choisit délibérément des parties qui illustrent des motifs. Ce filtre peut être parfaitement adapté à l'apprentissage d'un piège : tu observes les conditions qui rendent la combinaison possible. Il devient trompeur si tu en déduis que le piège fonctionne contre la plupart des réponses.

Pour vérifier cette nouvelle affirmation, il faudrait examiner les lignes où l'adversaire refuse le piège, simplifie ou défend correctement. La réfutation d'une combinaison peut se montrer par une variante, même si la base contient surtout des victoires de celui qui l'a tentée.

À l'inverse, des statistiques favorables ne fournissent pas une preuve de gain forcé. Une variante peut obtenir de bons résultats pratiques parce qu'elle est difficile à défendre dans certaines conditions. « Quelle réponse résiste ? » et « Quel score a-t-on observé ? » demandent deux analyses différentes.

### Une grande base n'est pas toute la population

La [base ouverte de Lichess](https://database.lichess.org/) décrit notamment la publication de parties classées de sa plateforme. Son périmètre n'est pas celui de toutes les parties de club, des compétitions FIDE ou de toutes les parties informelles. Une source peut être riche et transparente tout en répondant à une question de population précise.

Si tu observes une ouverture dans une base, commence par annoncer le champ : quelles parties ont pu y entrer ? Demande ensuite si un filtre dépend du résultat. Conserver uniquement les parties gagnées est une sélection manifeste. Un filtre de cadence ou de classement ne constitue pas automatiquement un biais du survivant ; il définit d'abord un sous-ensemble, qu'il faut éviter de généraliser au-delà de sa portée.

Les facteurs de confusion sont encore un autre problème. Si les adeptes d'une ouverture sont plus forts que leurs adversaires, le score peut refléter ce déséquilibre. Ajouter les parties manquantes ne résoudrait pas nécessairement cette comparaison. Sélection, effectif et composition des groupes méritent donc des questions distinctes.

![Comparer des résultats exige de regarder l’effectif, les conditions de jeu et les cas manquants.](/images/survivant-comparer.svg)

## Ton propre gambit

Reprends tes parties gagnées, nulles et perdues avec cette ouverture. Note les résultats, mais aussi le classement adverse, la couleur et la cadence. Si l’échantillon est petit, garde cette incertitude dans ta conclusion.

Un écart entre ton souvenir et le score enregistré peut venir de plusieurs choses : sélection des souvenirs, parties oubliées, série récente ou simple imprécision. Il n’est pas une mesure isolée et exacte du biais du survivant.

Pour aller plus loin, choisis quelques défaites ordinaires à analyser (article à venir). Elles peuvent révéler une difficulté qui n’apparaît jamais dans tes trois meilleures attaques.

### Construire un relevé qui conserve les cas décevants

Définis ton périmètre avant de regarder le résultat : par exemple toutes tes parties classées dans une cadence donnée pendant une période choisie. Ce périmètre est une décision de méthode. Il n'existe pas ici un nombre universel de trente parties qui rendrait toute conclusion fiable.

Garde un total pour les victoires, les nulles et les défaites. Si tu retires une partie pour un motif précis, conserve aussi la trace de cette exclusion. Sinon, tu risques de modifier la collection jusqu'à retrouver l'histoire que tu voulais raconter.

Pour les ouvertures, note aussi à quel moment la partie a quitté tes connaissances. Une victoire après une ouverture difficile peut masquer un problème réel. Une défaite après une position favorable peut au contraire indiquer que le travail à faire se situe plus tard. Le seul résultat final ne localise pas la difficulté.

Tu peux ensuite choisir un échantillon de positions à analyser : des réussites, des échecs et des situations ordinaires. Si tu ne regardes que les plus beaux sacrifices, tu apprendras surtout les configurations qui les ont rendus possibles. Si tu ne regardes que tes catastrophes, tu n'auras pas non plus une description équilibrée de ton jeu.

## Évaluer une promesse de progression

Une présentation de cours peut montrer des élèves qui ont beaucoup progressé. Avant d'en tirer une estimation, cherche le nombre de participants au départ, la période, le critère retenu et le suivi des abandons. Un cas présenté comme exemplaire ne se transforme pas en moyenne simplement parce qu'il est accompagné d'un graphique.

La progression peut aussi s'observer après plusieurs changements simultanés : plus de parties lentes, nouvel entraîneur, analyse régulière. Une comparaison avant/après ne suffit pas à attribuer tout le gain à un seul élément. Tu peux reconnaître un résultat individuel et laisser son explication ouverte.

Si les données nécessaires ne sont pas disponibles, la conclusion utile est délimitée : « Cette méthode a été pratiquée par ces personnes qui ont réussi ; je ne connais pas sa fréquence de réussite chez l'ensemble des participants. » Ce n'est ni une accusation de fraude ni une validation de la promesse.

Le réflexe à conserver est une question de dénominateur : **parmi qui ce résultat a-t-il été observé ?** Elle t'aide à lire les biographies, les recueils de parties et tes propres statistiques, tout en gardant ce que chaque source peut effectivement t'apprendre.

## Sources

- Wald, A. (1943 ; réédition 1980), *A Method of Estimating Plane Vulnerability Based on Damage of Survivors*, Statistical Research Group, Columbia University ; Center for Naval Analyses, CRC 432. [Mémorandums originaux réédités](https://pic.blog.plover.com/misc/survivorship-bias/A_Reprint_Plane_Vulnerability.pdf).
- Lichess, *Open database*. [Description du périmètre et fichiers](https://database.lichess.org/). Source sur la collecte des parties, pas une étude de l'efficacité des ouvertures.
