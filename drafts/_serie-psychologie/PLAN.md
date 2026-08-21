# Série « Psychologie » — plan de conception

Statut : plan validé le 2026-08-17. 41 articles retenus sur 43 sujets proposés.
Objectif éditorial : épuiser le champ « psychologie appliquée aux échecs » de façon
si complète et si structurée que toute reprise ultérieure ressemble à du plagiat.

## Décisions cadres (2026-08-17)

- **Format** : 5 piliers en version longue (3000+ mots), les 36 autres au format blog
  standard (1500-2500 mots). Piliers = A0 (hub), A1 (Dunning-Kruger), A4 (défenses),
  D1 (foules), F0 (persuasion).
- **Tiers Chess.com** : non. Blog seul pour cette série. Pas de `drafts/<sujet>/chesscom-*.md`.
- **Ordre de publication** : par potentiel de trafic (cf. §6), pas par grappe.
- **Traductions** : FR d'abord sur les 41. EN / PT-BR / NL dans un second temps,
  sur la sélection qui performe.
- **Maillage des piliers** : un pilier publié avant ses spokes les annonce en clair comme
  « à venir », sans lien actif. Les liens sont ajoutés à la publication de chaque spoke.
  Zéro lien mort à aucun moment.
- **Cadence** : la série est **fusionnée dans la grille lundi/jeudi** du blog (révisé le
  2026-08-19 ; les créneaux mardi dédiés sont abandonnés). Le blog reste à 2 articles/semaine,
  la série s'intercale avec la file historique. Du **2026-08-18** au **2027-05-20**.
  Calendrier complet en §7bis.
- **Visuels non bloquants** : ni la vignette Midjourney ni le schéma SVG ne retiennent la
  publication. Rattrapage en lot ensuite.
- **Sourcing** : vérification web systématique de chaque étude citée (auteurs, année,
  taille d'échantillon, chiffres, état des réplications) avant rédaction. Non négociable :
  c'est la rigueur méthodologique qui rend la série non-copiable.
- **Frontmatter** : `faq` remplie sur les 41 (levier SEO/GEO principal).
  Pas de `keyTakeaways`, pas de `heroImage`, pas d'`affiliate` sur cette série.
- **Listicle existant** : [`esprit/5-biais-cognitifs-blunder.md`](../../src/content/blog/esprit/5-biais-cognitifs-blunder.md)
  est **converti en hub « biais cognitifs »**. Les sections « biais de confirmation » et
  « biais d'ancrage » sont raccourcies en résumés pointant vers les articles dédiés.
  Les sections Einstellung / excès de confiance / disponibilité restent intactes.
  À faire au moment de la publication de l'article n°10 (biais de confirmation).
- **Page-index de série** `/fr/series/psychologie/` : créée **à la fin**, en même temps que
  l'article-hub A0. Nouvelle route Astro, à traduire ensuite avec le reste.

---

## 1. Doublons écartés (déjà traités en article dédié)

| Sujet proposé | Article existant | Décision |
|---|---|---|
| Syndrome de l'imposteur | `esprit/syndrome-imposteur-aux-echecs.md` **et** `esprit/syndrome-imposteur-2000-elo.md` | ❌ écarté (déjà 2 articles) |
| Perfectionnisme | `esprit/echecs-et-perfectionnisme-toxique.md` | ❌ écarté |

## 2. Recouvrements partiels — retenus mais sous contrainte

| Sujet | Recouvrement | Contrainte |
|---|---|---|
| Biais de confirmation | Section n°2 de `esprit/5-biais-cognitifs-blunder.md` | Article dédié OK. Interdiction de reprendre l'exemple du listicle. Ajouter un lien sortant depuis le listicle vers le nouvel article. |
| Biais d'ancrage | Section n°3 du même listicle | Idem. Angle imposé : l'évaluation numérique (+0.4 / l'Elo adverse), pas la « première idée ». |
| Prophétie auto-réalisatrice | Mentionnée dans 3 articles (`echecs-peur-de-perdre`, `syndrome-imposteur-2000-elo`, `psychologie-du-joueur-d-echecs`) | Article dédié OK, mais l'exemple « peur de perdre » est déjà pris. |
| Effet Dunning-Kruger | 1 mention dans `regle-40-40-20-echecs` | Aucun problème. |
| Comparaison sociale / autodétermination / théorie de l'esprit | Mentions en passant (3 à 6 fichiers) | Aucun problème, ce sont des mentions non développées. |

## 3. Recouvrements INTERNES à la liste — arbitrages

- **Persuasion** devient l'article-pilier ; **réciprocité / preuve sociale / rareté** en sont les
  trois déclinaisons. Le pilier ne développe aucun des trois, il les indexe.
- **Mécanismes de défense** est un pilier ; **rationalisation** et **projection** en sont deux
  spokes. Frontière : le pilier fait l'inventaire, les spokes font la démonstration.
- **Manipulation émotionnelle** = pression exercée *pendant* la partie (tilt, proposition de nulle,
  trash talk). **Gaslighting** = réécriture du réel *après coup* (analyse, coaching, accusation de triche).
  Frontière temporelle stricte.
- **Mémoire reconstructive** = mécanisme (comment le souvenir se refabrique).
  **Faux souvenirs** = pathologie du mécanisme (Loftus, souvenirs implantés). Ne pas fusionner.
- **Théorie de l'auto-détermination** = les 3 besoins (autonomie, compétence, affiliation).
  **Motivation intrinsèque** = l'effet de surjustification (Elo/récompense qui tue le plaisir). Distincts.
- **« Pourquoi ton cerveau préfère avoir raison au lieu d'apprendre »** n'est pas un 44e sujet :
  c'est le **hub de toute la série**, à écrire en dernier, qui relie Dunning-Kruger,
  dissonance, biais de confirmation, rationalisation et défenses.

---

## 4. Les 41 articles, par grappe

### A. Le noyau — pourquoi le cerveau protège son image (7)

| # | Slug | Catégorie | Angle unique | Ancrage scientifique | Ancrage échecs |
|---|---|---|---|---|---|
| A0 | `pourquoi-ton-cerveau-prefere-avoir-raison` | esprit | **HUB de la série.** Écrit en dernier, relie A1–A6. | Festinger, Kruger & Dunning, Nickerson | La partie perdue qu'on n'analyse jamais |
| A1 | `effet-dunning-kruger-aux-echecs` | esprit | **Pilier.** La courbe virale est un faux + l'étude 2025 sur 3 388 joueurs | Kruger & Dunning 1999 ; Heck, Benjamin, Simons & Chabris 2025 ; critiques Nuhfer / Gignac & Zajenkowski | +89 Elo revendiqués ; 11,3 % les atteignent à un an |
| A2 | `dissonance-cognitive-aux-echecs` | esprit | Ce qui se passe *au moment* de la défaite | Festinger 1957, Festinger & Carlsmith 1959 | « J'étais gagnant » / la ligne d'ouverture qu'on refuse d'abandonner |
| A3 | `biais-de-confirmation-aux-echecs` | esprit | Le calcul qui ne cherche que les preuves de son plan | Wason 2-4-6, Nickerson 1998 | Calculer sa propre combinaison, jamais la réfutation adverse |
| A4 | `mecanismes-de-defense-aux-echecs` | esprit | **Pilier.** Inventaire : déni, déplacement, sublimation, intellectualisation | A. Freud 1936, Vaillant (hiérarchie des défenses) | La typologie du joueur après la partie |
| A5 | `rationalisation-aux-echecs` | esprit | L'excuse fabriquée *après* le coup, pas avant | Nisbett & Wilson 1977 (confabulation) | Les 12 excuses classiques et ce qu'elles cachent |
| A6 | `projection-aux-echecs` | esprit | Prêter à l'adversaire son propre plan | Freud, + recherche moderne sur la projection sociale | « Il a vu la même chose que moi » → le blunder de symétrie |

### B. Les biais de jugement (5)

| # | Slug | Catégorie | Angle unique | Ancrage | Ancrage échecs |
|---|---|---|---|---|---|
| B1 | `effet-de-halo-aux-echecs` | esprit | Le titre/l'Elo contamine l'évaluation du coup | Thorndike 1920, Nisbett & Wilson 1977 | Jouer contre un MI : ses coups paraissent meilleurs |
| B2 | `biais-du-survivant-aux-echecs` | esprit | Ce que les parties publiées ne montrent pas | Wald 1943 (bombardiers) | Les gambits « qui marchent », les prodiges, les conseils de GM |
| B3 | `aversion-a-la-perte-aux-echecs` | science | Pourquoi rendre une pièce coûte plus que d'en gagner une | Kahneman & Tversky 1979, ratio ~2:1 | Refuser le sacrifice positionnel / s'accrocher à un pion mort |
| B4 | `biais-d-ancrage-aux-echecs` | esprit | L'ancre chiffrée : évaluation moteur, Elo adverse | Tversky & Kahneman 1974 | Le +0.4 de l'engine qui pollue toute l'analyse |
| B5 | `effet-barnum-aux-echecs` | esprit | Les « profils de joueur » qui marchent sur tout le monde | Forer 1949 | Tests « quel joueur es-tu ? », rapports de style automatisés |

### C. Les boucles auto-entretenues (3)

| # | Slug | Catégorie | Angle unique | Ancrage | Ancrage échecs |
|---|---|---|---|---|---|
| C1 | `prophetie-auto-realisatrice-aux-echecs` | esprit | La croyance qui produit son propre résultat. **Ne pas réutiliser l'angle « peur de perdre ».** | Merton 1948, Rosenthal & Jacobson 1968 | « Je suis nul en finales » → on ne les travaille pas → on est nul en finales |
| C2 | `impuissance-apprise-aux-echecs` | esprit | Arrêter d'essayer alors qu'on peut encore gagner | Seligman & Maier 1967, + révision 2016 (Maier & Seligman) | Le plateau Elo, l'abandon prématuré, le tilt résigné |
| C3 | `comparaison-sociale-aux-echecs` | esprit | Ascendante vs descendante, et le classement comme machine à comparer | Festinger 1954 | Le leaderboard, les amis Elo, la courbe de progression |

### D. Le groupe (4)

| # | Slug | Catégorie | Angle unique | Ancrage | Ancrage échecs |
|---|---|---|---|---|---|
| D1 | `psychologie-des-foules-aux-echecs` | societe | Le public, le chat Twitch, la salle de tournoi | Le Bon 1895 (et sa réfutation moderne), Reicher | Effet du public sur la performance / le chat qui « voit » le mat |
| D2 | `conformisme-aux-echecs` | societe | Suivre la mode théorique contre son jugement | Asch 1951 | Les ouvertures à la mode, le « coup de club », la vérité de l'engine |
| D3 | `obeissance-a-l-autorite-aux-echecs` | societe | Le coach, le GM, l'engine comme figure d'autorité | Milgram 1963 + critiques (Perry, Gibson) | Jouer un coup qu'on ne comprend pas parce qu'un 2700 le joue |
| D4 | `effet-spectateur-aux-echecs` | societe | Diffusion de responsabilité dans la communauté | Darley & Latané 1968 + méta-analyse Fischer 2011 | Triche non signalée, harcèlement en ligne, arbitrage |

### E. Motivation et discipline (4)

| # | Slug | Catégorie | Angle unique | Ancrage | Ancrage échecs |
|---|---|---|---|---|---|
| E1 | `theorie-auto-determination-aux-echecs` | esprit | Les 3 besoins : autonomie, compétence, affiliation | Deci & Ryan 1985/2000 | Pourquoi on arrête les échecs / pourquoi on y revient |
| E2 | `motivation-intrinseque-aux-echecs` | esprit | L'effet de surjustification : la récompense qui tue le plaisir | Lepper, Greene & Nisbett 1973 | L'Elo comme récompense externe ; jouer pour le chiffre |
| E3 | `gratification-differee-aux-echecs` | esprit | Différer le plaisir sur un coup **et** sur une carrière | Mischel 1972 + réplications ratées (Watts 2018) | Le coup lent contre le coup flashy ; travailler les finales |
| E4 | `formation-des-habitudes-aux-echecs` | esprit | Boucle signal-routine-récompense appliquée à l'entraînement | Lally 2010 (66 jours), Wood & Neal | Routine d'ouverture de partie, rituel d'avant-coup, blundercheck |

### F. Influence et manipulation (6)

| # | Slug | Catégorie | Angle unique | Ancrage | Ancrage échecs |
|---|---|---|---|---|---|
| F0 | `psychologie-de-la-persuasion-aux-echecs` | societe | **Pilier Cialdini.** Indexe F1–F3, ne les développe pas. | Cialdini 1984 (6/7 principes) | Le marché du coaching, des cours, des « méthodes » |
| F1 | `reciprocite-aux-echecs` | societe | La dette créée par le cadeau | Regan 1971, Cialdini | Cours gratuit → abonnement ; la nulle « rendue » |
| F2 | `preuve-sociale-aux-echecs` | societe | « 3 millions de joueurs utilisent… » | Cialdini, Goldstein 2008 | Popularité des ouvertures, classements de cours, avis |
| F3 | `rarete-aux-echecs` | societe | Places limitées, offres qui expirent | Worchel 1975 (cookie jar) | Vente de formations, tournois « places limitées » |
| F4 | `manipulation-emotionnelle-aux-echecs` | esprit | **Pendant** la partie. | Recherche sur l'intimidation en sport, Tal et sa légende | Trash talk, proposition de nulle piégeuse, jeu du temps |
| F5 | `gaslighting-aux-echecs` | societe | **Après** la partie : réécriture du réel | Sweet 2019 (sociologie du gaslighting) | Coach abusif, accusation de triche sans preuve, révisionnisme d'analyse |

### G. Lire l'autre (2)

| # | Slug | Catégorie | Angle unique | Ancrage | Ancrage échecs |
|---|---|---|---|---|---|
| G1 | `theorie-de-l-esprit-aux-echecs` | science | Modéliser ce que l'autre sait — **sans redite avec `neurones-miroirs-aux-echecs`** (à vérifier avant rédaction) | Premack & Woodruff 1978, fausse croyance | « Il ne l'a pas vu » : jouer le piège plutôt que le meilleur coup |
| G2 | `intelligence-emotionnelle-aux-echecs` | esprit | Le construit et ses critiques | Salovey & Mayer 1990, Goleman + critiques psychométriques | Reconnaître son tilt avant qu'il ne coûte 3 parties |

### H. Mémoire (2)

| # | Slug | Catégorie | Angle unique | Ancrage | Ancrage échecs |
|---|---|---|---|---|---|
| H1 | `memoire-reconstructive-aux-echecs` | science | Le souvenir se refabrique à chaque rappel | Bartlett 1932, reconsolidation (Nader 2000) | Se souvenir de sa partie autrement qu'elle ne s'est jouée |
| H2 | `faux-souvenirs-aux-echecs` | science | Souvenirs implantés et effet de désinformation | Loftus & Palmer 1974, Loftus 1995 | « J'avais vu ce coup » ; l'analyse post-partie qui réécrit le souvenir |

### I. Apprentissage et corps (5)

| # | Slug | Catégorie | Angle unique | Ancrage | Ancrage échecs |
|---|---|---|---|---|---|
| I1 | `conditionnement-classique-aux-echecs` | science | Associations involontaires | Pavlov, Watson | L'angoisse déclenchée par une position/un adversaire/un son de pendule |
| I2 | `conditionnement-operant-aux-echecs` | science | Renforcement à ratio variable — **vérifier la frontière avec `echecs-et-dopamine`** | Skinner, Ferster & Skinner 1957 | Le bouton « nouvelle partie » comme machine à sous |
| I3 | `neuroplasticite-aux-echecs` | science | Ce qui change vraiment dans le cerveau, et ce qui ne change pas | Maguire (taxis), Draganski, + limites du transfert | Le mythe du « les échecs recâblent le cerveau » |
| I4 | `effet-placebo-aux-echecs` | science | Croire que ça marche suffit-il ? | Beecher, Benedetti, placebo ouvert (Kaptchuk 2010) | Le porte-bonheur, l'ouverture « qui me réussit », les compléments |
| I5 | `stress-chronique-aux-echecs` | science | Chronique ≠ aigu — **frontière avec `echecs-stress-tournoi` et `burnout-chess`** | McEwen (charge allostatique), cortisol | Saison de tournois, coaching sous pression, Elo qui stagne |

### J. Statut, choix, lien (3)

| # | Slug | Catégorie | Angle unique | Ancrage | Ancrage échecs |
|---|---|---|---|---|---|
| J1 | `psychologie-du-statut-aux-echecs` | societe | La hiérarchie chiffrée, cas unique dans le social | Sapolsky, Marmot (Whitehall), hiérarchies de dominance | Le titre, le classement, le déclassement |
| J2 | `paradoxe-du-choix-aux-echecs` | esprit | Trop d'options = paralysie | Iyengar & Lepper 2000 + réplications contestées | Le répertoire d'ouvertures, l'offre pléthorique de cours |
| J3 | `theorie-de-l-attachement-aux-echecs` | esprit | Le lien élève-entraîneur, parent-enfant joueur | Bowlby, Ainsworth, + attachement adulte (Hazan & Shaver) | Le parent d'échecs, la relation au coach, l'abandon du jeu |

---

## 5bis. Ordre de publication (par potentiel de trafic)

Critère : volume de recherche du concept en français × curiosité grand public × capacité
de partage. Les piliers longs sont marqués **[P]**.

### Vague 1 — les locomotives (10)

1. `effet-dunning-kruger-aux-echecs` **[P]**
2. `gaslighting-aux-echecs`
3. `dissonance-cognitive-aux-echecs`
4. `biais-du-survivant-aux-echecs`
5. `mecanismes-de-defense-aux-echecs` **[P]**
6. `neuroplasticite-aux-echecs`
7. `theorie-de-l-attachement-aux-echecs`
8. `effet-placebo-aux-echecs`
9. `manipulation-emotionnelle-aux-echecs`
10. `biais-de-confirmation-aux-echecs`

### Vague 2 — fort volume, concurrence moyenne (10)

11. `formation-des-habitudes-aux-echecs`
12. `intelligence-emotionnelle-aux-echecs`
13. `psychologie-de-la-persuasion-aux-echecs` **[P]**
14. `obeissance-a-l-autorite-aux-echecs`
15. `effet-de-halo-aux-echecs`
16. `faux-souvenirs-aux-echecs`
17. `effet-spectateur-aux-echecs`
18. `impuissance-apprise-aux-echecs`
19. `effet-barnum-aux-echecs`
20. `aversion-a-la-perte-aux-echecs`

### Vague 3 — consolidation (11)

21. `biais-d-ancrage-aux-echecs`
22. `paradoxe-du-choix-aux-echecs`
23. `conformisme-aux-echecs`
24. `prophetie-auto-realisatrice-aux-echecs`
25. `comparaison-sociale-aux-echecs`
26. `gratification-differee-aux-echecs`
27. `motivation-intrinseque-aux-echecs`
28. `conditionnement-operant-aux-echecs`
29. `conditionnement-classique-aux-echecs`
30. `psychologie-des-foules-aux-echecs` **[P]**
31. `stress-chronique-aux-echecs`

### Vague 4 — fermeture du graphe (10)

32. `theorie-de-l-esprit-aux-echecs`
33. `memoire-reconstructive-aux-echecs`
34. `projection-aux-echecs`
35. `rationalisation-aux-echecs`
36. `theorie-auto-determination-aux-echecs`
37. `psychologie-du-statut-aux-echecs`
38. `reciprocite-aux-echecs`
39. `preuve-sociale-aux-echecs`
40. `rarete-aux-echecs`
41. `pourquoi-ton-cerveau-prefere-avoir-raison` **[P]** — obligatoirement en dernier

---

## 5. Règles de série (anti-copie)

1. **Chaque article ouvre sur une position ou une scène de partie**, pas sur une définition.
   C'est la barrière d'entrée : reproduire la série impose de reproduire le corpus d'exemples.
2. **Chaque article cite l'étude princeps + une critique ou une réplication ratée.** La nuance
   méthodologique est ce qui ne se copie pas sans travail.
3. **Un schéma SVG par article** (cf. `schemas-svg-systeme` en mémoire, watermark auto).
4. **Maillage interne obligatoire** : chaque article pointe vers son pilier de grappe + 2 articles
   existants du blog. Les 41 forment un graphe fermé.
5. **Une page-index de série** (`/fr/series/psychologie/`) qui rend le tout citable en bloc.
6. Pas de tiret cadratin dans le corps du texte (règle projet).

---

## 7. Contrainte de calendrier (révisée le 2026-08-19)

Constat initial (2026-08-17) : le blog publiait déjà 2/semaine sur **lundi + jeudi**, avec
39 articles en file jusqu'au 2027-02-11. La série avait donc reçu ses propres créneaux
**mardi + vendredi**, portant le blog à 4 articles/semaine.

**Décision du 2026-08-19 — cette option est abandonnée.** La série (et toute série
ultérieure) réintègre la grille **lundi + jeudi** unique, à 2 articles/semaine. Deux
conséquences :

- la **pause de fin d'année est levée** : la grille est continue, sinon la file
  s'étirerait jusqu'en juillet 2027 ;
- les deux articles d'une même semaine doivent être de **rubriques différentes** — un
  bloc de 41 articles quasi mono-rubrique produirait sinon des semaines « esprit + esprit ».

Les 78 articles à venir ont été fusionnés par ordre chronologique puis appariés par
`scripts/pair-week-themes.mjs`, qui ne permute que ce qui est nécessaire. La règle est
désormais vérifiée au build par `check-publish-weekly.mjs`. Calendrier figé en §7bis.

---

## 7bis. Calendrier de publication (figé)

Grille **lundi + jeudi**, 2 articles/semaine, série fusionnée avec la file historique :
les articles ci-dessous sont donc entrecoupés d'articles hors série. Pas de pause de fin
d'année. Le n°1 garde sa date mardi d'origine : il était déjà publié au moment du
réajustement.

| # | publishDate | Jour | Catégorie | Slug | Statut |
|---|---|---|---|---|---|
| 1 | 2026-08-18 | mar. | esprit | `effet-dunning-kruger-aux-echecs` | **[P]** **✅ écrit** |
| 2 | 2026-08-27 | jeu. | societe | `gaslighting-aux-echecs` | **✅ écrit** |
| 3 | 2026-09-07 | lun. | esprit | `dissonance-cognitive-aux-echecs` | **✅ écrit** |
| 4 | 2026-09-21 | lun. | esprit | `biais-du-survivant-aux-echecs` | **✅ écrit** |
| 5 | 2026-10-01 | jeu. | science | `neuroplasticite-aux-echecs` | **✅ écrit** |
| 6 | 2026-10-05 | lun. | esprit | `mecanismes-de-defense-aux-echecs` | **[P]** **✅ écrit** |
| 7 | 2026-10-19 | lun. | esprit | `theorie-de-l-attachement-aux-echecs` | **✅ écrit** |
| 8 | 2026-10-29 | jeu. | science | `effet-placebo-aux-echecs` | **✅ écrit** |
| 9 | 2026-11-09 | lun. | esprit | `manipulation-emotionnelle-aux-echecs` | **✅ écrit** |
| 10 | 2026-11-23 | lun. | esprit | `biais-de-confirmation-aux-echecs` | **✅ écrit** |
| 11 | 2026-12-07 | lun. | esprit | `formation-des-habitudes-aux-echecs` | **✅ écrit** |
| 12 | 2026-12-10 | jeu. | societe | `psychologie-de-la-persuasion-aux-echecs` | **[P]** **✅ écrit** |
| 13 | 2026-12-21 | lun. | esprit | `intelligence-emotionnelle-aux-echecs` | **✅ écrit** |
| 14 | 2026-12-24 | jeu. | societe | `obeissance-a-l-autorite-aux-echecs` | **✅ écrit** |
| 15 | 2027-01-11 | lun. | esprit | `effet-de-halo-aux-echecs` | **✅ écrit** |
| 16 | 2027-01-21 | jeu. | science | `faux-souvenirs-aux-echecs` | **✅ écrit** |
| 17 | 2027-02-01 | lun. | societe | `effet-spectateur-aux-echecs` | **✅ écrit** |
| 18 | 2027-02-11 | jeu. | esprit | `impuissance-apprise-aux-echecs` | **✅ écrit** |
| 19 | 2027-02-25 | jeu. | esprit | `effet-barnum-aux-echecs` | **✅ écrit** |
| 20 | 2027-03-01 | lun. | science | `aversion-a-la-perte-aux-echecs` | **✅ écrit** |
| 21 | 2027-03-11 | jeu. | esprit | `biais-d-ancrage-aux-echecs` | **✅ écrit** |
| 22 | 2027-03-15 | lun. | societe | `conformisme-aux-echecs` | **✅ écrit** |
| 23 | 2027-03-18 | jeu. | esprit | `paradoxe-du-choix-aux-echecs` | **✅ écrit** |
| 24 | 2027-03-22 | lun. | science | `conditionnement-operant-aux-echecs` | **✅ écrit** |
| 25 | 2027-03-25 | jeu. | esprit | `prophetie-auto-realisatrice-aux-echecs` | **✅ écrit** |
| 26 | 2027-03-29 | lun. | science | `conditionnement-classique-aux-echecs` | **✅ écrit** |
| 27 | 2027-04-01 | jeu. | esprit | `comparaison-sociale-aux-echecs` | **✅ écrit** |
| 28 | 2027-04-05 | lun. | societe | `psychologie-des-foules-aux-echecs` | **[P]** **✅ écrit** |
| 29 | 2027-04-08 | jeu. | esprit | `gratification-differee-aux-echecs` | **✅ écrit** |
| 30 | 2027-04-12 | lun. | science | `stress-chronique-aux-echecs` | **✅ écrit** |
| 31 | 2027-04-15 | jeu. | esprit | `motivation-intrinseque-aux-echecs` | **✅ écrit** |
| 32 | 2027-04-19 | lun. | science | `theorie-de-l-esprit-aux-echecs` | **✅ écrit** |
| 33 | 2027-04-22 | jeu. | esprit | `projection-aux-echecs` | **✅ écrit** |
| 34 | 2027-04-26 | lun. | science | `memoire-reconstructive-aux-echecs` | **✅ écrit** |
| 35 | 2027-04-29 | jeu. | societe | `psychologie-du-statut-aux-echecs` | **✅ écrit** |
| 36 | 2027-05-03 | lun. | esprit | `rationalisation-aux-echecs` | **✅ écrit** |
| 37 | 2027-05-06 | jeu. | societe | `reciprocite-aux-echecs` | **✅ écrit** |
| 38 | 2027-05-10 | lun. | esprit | `theorie-auto-determination-aux-echecs` | **✅ écrit** |
| 39 | 2027-05-13 | jeu. | societe | `preuve-sociale-aux-echecs` | **✅ écrit** |
| 40 | 2027-05-17 | lun. | societe | `rarete-aux-echecs` | **✅ écrit** |
| 41 | 2027-05-20 | jeu. | esprit | `pourquoi-ton-cerveau-prefere-avoir-raison` | **[P]** **✅ écrit** |

Premier : **2026-08-18**. Dernier : **2027-05-20**.

### Vague 1 : terminée (2026-08-17)

Les 10 articles sont écrits, sourcés et validés (`astro check` 0 erreur).
Écarts au plan initial, décidés en cours de rédaction :

- **n°1 Dunning-Kruger** : angle corrigé après vérification. La courbe virale « Mount Stupid »
  n'existe dans aucune publication de Kruger et Dunning ; le plan initial la reprenait à tort.
  Ajout de l'étude Heck, Benjamin, Simons & Chabris (2025) sur 3 388 joueurs de tournoi.
- **n°6 neuroplasticité** : ré-angle en débunkage (« Non, les échecs ne recâblent pas ton cerveau »)
  pour éviter le recouvrement avec `les-echecs-et-le-cerveau` et `les-echecs-rendent-ils-plus-intelligent`.
- **Listicle converti** : `5-biais-cognitifs-blunder.md` reçoit un encadré « article dédié » vers
  le n°10, un encadré « à venir » pour l'ancrage (n°21), et `updatedDate: 2026-11-23`
  (aligné sur la date de publication du n°10 après le réajustement du 2026-08-19).
  La phrase affirmant que le biais de confirmation touche experts et novices à égalité a été
  retirée : Cowley & Byrne (2004) montrent le contraire dans le domaine d'expertise.
- **Pas de balises image** : les visuels étant non bloquants, aucun `![](...)` n'a été posé.
  Il faudra repasser insérer les schémas SVG.

### Vague 2 : terminée (2026-08-17)

Articles 11 à 20 écrits, sourcés et validés. ~19 000 mots. Écarts et décisions :

- **n°13 persuasion (pilier)** : d'abord rédigé à 2 656 mots, sous la cible de 3 000 fixée pour les
  piliers. Étendu à 3 108 mots par l'ajout d'une section de démontage ligne par ligne d'une annonce
  commerciale type, qui manquait au caractère « pilier » de l'article.
- **n°18 impuissance apprise** : angle dominé par le renversement de Maier & Seligman (2016,
  *Psychological Review*), où les auteurs concluent que leur théorie de 1967 avait le mécanisme à
  l'envers. La passivité est le défaut, c'est le contrôle qui s'apprend. Change l'intervention
  recommandée : fournir des signaux à boucle courte plutôt que remotiver.
- **n°17 effet spectateur** : le mythe des 38 témoins de Kitty Genovese est démonté (Manning, Levine
  & Collins 2007) et complété par Philpot 2020 (intervention dans 91 % de 219 conflits filmés).
  L'article propose donc une explication alternative au silence de la communauté échiquéenne :
  l'asymétrie des coûts créée par la sanction des accusations infondées (lien direct avec le n°2).
- **n°12 intelligence émotionnelle** : la critique est structurante (Salovey a qualifié en 2008 les
  affirmations de Goleman de scandaleuses). L'article conserve une seule branche du modèle et la
  remplace par une mesure objective (temps par coup, intervalle entre parties).
- **Tous les piliers restants** doivent viser 3 000 mots : D1 (foules) et A0 (hub).

### Vague 3 : terminée (2026-08-17)

Articles 21 à 31 écrits, sourcés et validés. ~18 900 mots. Points notables :

- **n°30 foules (pilier)** : rédigé à 2 373 mots, sous la cible. Étendu à ~3 000 par deux ajouts
  qui manquaient réellement : le cas Kasparov contre le Monde (1999, 50 000 joueurs, 75 pays,
  62 coups), seul cas où une foule a joué aux échecs et réfutation directe de la thèse de Le Bon ;
  et une section distinguant les trois mécanismes de la grappe (conformisme / autorité / spectateur),
  qui sont trois questions différentes appelant trois remèdes différents.
- **n°22 paradoxe du choix** : l'effet n'est pas confirmé (Scheibehenne 2010 : 63 conditions,
  5 036 participants, effet moyen quasi nul). L'article rebâtit le problème sur les modérateurs et
  déplace le coût réel de la paralysie initiale vers l'instabilité du répertoire.
- **n°27 motivation intrinsèque** : la condition de sélection de Lepper 1973 (les 51 enfants aimaient
  DÉJÀ dessiner) est absente de tous les résumés populaires et décide de l'applicabilité au Elo.
- **n°21 ancrage** : rare effet de la série à avoir survécu aux réplications (Many Labs). Signalé
  comme tel pour ne pas donner l'impression que tout est démonté.
- **n°28/29 conditionnements** : frontière posée avec `echecs-et-dopamine` (neurochimie) ;
  ces deux articles restent sur le versant comportemental.
- **n°31 stress chronique** : frontière explicite avec `echecs-stress-tournoi` (aigu, améliore la
  cognition) et `burnout-chess` (syndrome). Le stress chronique dégrade hippocampe et préfrontal.


---

## 8. Série terminée (2026-08-17)

**41 articles sur 41 écrits**, ~99 000 mots, `astro check` à 0 erreur.

### Vague 4

Articles 32 à 41. Points notables :

- **n°41 hub** : rédigé à 2 704 mots, sous la cible de 3 000. Étendu à 3 083 par l'ajout d'une
  section « Quand avoir raison est la bonne stratégie », qui manquait : la série présente la
  critique partout ailleurs, elle ne pouvait pas s'en dispenser en conclusion.
- **Le hub a produit une conclusion non anticipée.** En relisant les 40 articles précédents, la même
  parade pratique était apparue indépendamment dans presque chacun : écrire avant. La raison est
  structurelle (tous ces mécanismes opèrent après coup et réécrivent ce qu'on pensait avant), et
  elle est devenue l'axe du hub.
- **n°33 mémoire reconstructive** : angle recentré sur Bartlett et la reconsolidation, De Groot et
  les chunks étant déjà traités par `memoriser-parties-aux-echecs`.
- **n°32 théorie de l'esprit** : frontière posée avec `neurones-miroirs-aux-echecs` (simulation
  motrice vs attribution de croyances fausses). Angle propre : le piège est une opération de fausse
  croyance, et c'est la seule chose qu'un moteur ne sait pas faire.
- **n°34 projection** : la version freudienne défensive étant mal étayée, l'article s'appuie sur la
  projection sociale et le faux consensus (Ross 1977), bien mieux documentés.

### Page-index de série

- `src/data/serie-psychologie.ts` : les 41 articles répartis en 10 grappes, avec marquage des piliers.
- `src/pages/fr/series/psychologie.astro` : page autonome (BaseLayout), JSON-LD CollectionPage +
  ItemList + BreadcrumbList. Les articles publiés s'affichent en lien avec date et excerpt, les
  autres restent listés en « à venir ». La série est donc lisible en bloc dès le premier article.
- Vérifiée en preview : 0 erreur console, rendu correct clair et sombre.

### Placement sur le site (2026-08-17, version finale)

**Rubrique « Séries » dans la navbar**, pointant vers une page `/fr/series/` générique.

- `data/series.ts` : registre des séries. Une série = un objet (titre, chapeau, slugs, cadence).
  La page `/fr/series/` n'est **pas** centrée sur la psychologie : elle liste ce registre.
  Ajouter une série = un objet + une page + une ligne dans `staticRoutes`.
- `pages/fr/series/index.astro` : liste les séries avec barre de progression (articles publiés
  sur total, calculé à la volée).
- `pages/fr/series/psychologie.astro` : l'index de cette série, inchangé quant au fond.
- Fil d'Ariane rétabli à trois échelons : Accueil → Séries → Psychologie.
- `staticRoutes` : `/fr/series/` et `/fr/series/psychologie/` ajoutées (le sitemap se construit
  depuis cette liste, pas automatiquement).

**Bandeau abandonné**, composant supprimé, slot `after-hero` retiré de `CategoryPage.astro`.

**Pied de page allégé** : « Tous les articles » et « Série Psychologie » retirés, tous deux
redondants avec la navbar. La variable `blogHref` devenue inutilisée a été supprimée.

**Jargon éditorial retiré du texte visible.** Les mots « pilier » et « grappe » relevaient du plan
de production, pas de la lecture. 20 passages réécrits dans 9 articles, plus le badge « Pilier »
de la page-index et ses styles. Vérifié : zéro occurrence visible du mot pour le lecteur.
Les deux usages français légitimes ont été conservés (« un pilier de la psychologie du
développement », « un pilier de la formation des enseignants »).

La classe CSS `item--pilier` subsiste comme simple accroche visuelle (filet vert à gauche) pour
hiérarchiser une liste de 41 entrées. Elle ne nomme rien pour le lecteur.

### Reste à faire

1. **Visuels** : aucun `![](...)` posé sur les 41 articles. Insérer les schémas SVG (production
   possible via le système existant) et les vignettes Midjourney.
2. **Traductions** : EN / PT-BR / NL, décidées « second temps » sur la sélection qui performe.
3. **Route série dans la navigation** : la page existe mais n'est liée depuis nulle part.
4. **Rien n'est commité.**
