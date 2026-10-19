---
title: "Échecs vs Go : quel jeu demande le plus d'intelligence ?"
excerpt: "Les fans de Go disent que leur jeu est infiniment plus complexe. Les fans d'échecs répondent que c'est différent, pas inférieur. Que disent vraiment les chiffres, la cognition et les IA ?"
publishDate: "2026-12-17"
category: "science"
featured: false
featuredRank: 99
affiliate: true
readingTime: "7 min"
pillar: "Théorie des jeux"
tags: ["Go", "AlphaGo", "complexité combinatoire", "IA", "comparaison", "cognition"]
seoTitle: "Échecs vs Go : comparaison complète (complexité, cognition, IA)"
seoDescription: "Quel jeu entre échecs et Go demande le plus d'intelligence ? Complexité combinatoire, cognition humaine, IA : tout le comparatif en une analyse rigoureuse."
keyTakeaways:
  - "Les configurations d'un plateau et les suites de parties sont deux grandeurs distinctes."
  - "La taille d'un espace de jeu ne mesure pas l'intelligence de ses pratiquants."
  - "Les matchs Deep Blue–Kasparov (1997) et AlphaGo–Lee Sedol (2016) sont séparés de 19 ans."
  - "AlphaZero emploie une architecture commune de recherche et d'apprentissage, avec des entraînements distincts pour chaque jeu."
  - "Tactique, stratégie et reconnaissance de motifs existent dans les deux jeux."
faq:
  - question: "Le Go compte-t-il davantage de positions ?"
    answer: "Le comptage de Tromp donne environ $2,08\\times10^{170}$ configurations légales sur 19×19 selon sa définition. Il faut comparer des positions à des positions, et non cet espace à un arbre de parties d'échecs."
  - question: "AlphaGo a-t-il résolu le Go ?"
    answer: "Gagner un match contre un champion ne constitue pas une preuve de l'issue sous jeu parfait depuis la position initiale."
  - question: "Les résultats des IA classent-ils l’intelligence des joueurs ?"
    answer: "Non. Ils mesurent des performances de programmes dans des protocoles précis. Ils ne comparent pas directement l'intelligence générale des joueurs humains."
heroImage:
  src: /images/blog/echecs-vs-go-complexite-intelligence-hero.webp
  alt: Un cavalier et une pierre de go séparés par un pli ramifié.
ogImage: /images/og/echecs-vs-go-complexite-intelligence-og.webp

---

Les amateurs de Go montrent les chiffres de leur espace de jeu. Les joueurs d'échecs répondent que leur jeu exige une grande précision tactique. Ces arguments parlent de choses différentes : compter des configurations n'est pas mesurer la difficulté ressentie ni l'intelligence d'une personne.

## Comparer les mêmes grandeurs

Pour le Go 19×19, Tromp présente un comptage d'environ $2,08\times10^{170}$ configurations légales, avec une définition explicite fondée sur les groupes et leurs libertés. Ce nombre décrit des configurations du plateau, pas des parties complètes ni tout l'historique nécessaire à certaines règles.

Aux échecs, l'ordre de grandeur de Shannon, $10^{120}$, concerne un arbre de parties estimé. Le comparer directement au nombre de positions du Go mélange deux mesures. Le nombre de positions d'échecs est une autre question, traitée dans [l'article sur la complexité](/fr/blog/echecs-et-complexite-algorithmique/).

Même un décompte exact ne dit pas combien de positions un humain devra comprendre pour jouer à son niveau. Les joueurs ne parcourent pas exhaustivement tout cet espace.

## Des tâches différentes, sans profils cérébraux exclusifs

Les pièces d'échecs ont des déplacements différents ; les pierres du Go participent à des groupes, captures et territoires. Les décisions concrètes ne se ressemblent donc pas toujours.

Il serait pourtant trompeur de réserver la tactique aux échecs et l'intuition globale au Go. Dans les deux jeux, tu peux devoir calculer une suite locale et apprécier une situation plus large. L'article ne dispose pas d'une comparaison expérimentale commune permettant de classer les régions cérébrales ou les « types d'intelligence » des deux populations.

Le fait qu'un motif familier aide un expert ne prouve pas non plus un transfert automatique lorsqu'il commence l'autre jeu. Il devra en apprendre les règles et les structures propres.

## Ce que les matchs contre les humains montrent

IBM rapporte la victoire de Deep Blue sur Kasparov en 1997. DeepMind rapporte celle d'AlphaGo sur Lee Sedol en mars 2016, par quatre parties à une. Il y a 19 ans entre ces événements.

Ils sont des jalons de performance. Ils ne constituent ni une résolution mathématique des jeux ni une expérience contrôlée permettant d'attribuer le délai à une seule différence cognitive entre eux. Algorithmes, puissance de calcul, données et moyens de développement ont aussi changé.

L'histoire d'AlphaGo décrite par ses auteurs combine réseaux de politique et de valeur avec une recherche. L'apprentissage initial sur des parties humaines et l'auto-jeu ne doivent pas être confondus avec la procédure d'AlphaZero.

## AlphaZero : une méthode commune, pas un cerveau humain commun

Silver et ses collègues (2017) présentent un algorithme général appliqué séparément aux échecs, au shogi et au Go. Les entraînements partent des règles et de l'auto-jeu, avec des réseaux distincts pour les jeux.

Le réseau propose des probabilités de coups et une valeur ; la recherche MCTS explore les continuations. Les courbes et temps rapportés dépendent du matériel, des adversaires et des réglages de l'expérience. Ils ne donnent pas le nombre d'heures qu'il faudrait à un humain pour atteindre la même force.

Le succès d'une architecture commune montre une possibilité informatique. Il ne démontre pas que les humains apprennent les trois jeux par les mêmes mécanismes, ni que le Go aurait nécessité une forme d'intuition inaccessible aux autres approches par principe.

## Comment choisir

Si tu hésites, essaie de petites séances et observe ce qui t'intéresse : les règles, les positions, la communauté, le rythme des parties. Tu peux aussi apprécier les deux sans attendre une amélioration générale d'intelligence.

Pour comparer ta propre progression, définis des objectifs dans chaque jeu. La compréhension d'une finale ou d'un problème de vie et mort vaut comme apprentissage du domaine, sans devoir établir une hiérarchie des personnes qui le pratiquent.

## Sources

- Tromp, J. (2016), *Counting Legal Positions in Go*, compte rendu de l'auteur, [texte et méthode](https://tromp.github.io/go/legal.html).
- IBM (s. d.), *Deep Blue*, archives de l'entreprise, [histoire](https://www.ibm.com/history/deep-blue).
- Google DeepMind (s. d.), *AlphaGo*, historique et méthode, [présentation officielle](https://deepmind.google/research/alphago/).
- Silver, D. et al. (2017), *Mastering Chess and Shogi by Self-Play with a General Reinforcement Learning Algorithm*, arXiv, [article original](https://arxiv.org/html/1712.01815v1).
