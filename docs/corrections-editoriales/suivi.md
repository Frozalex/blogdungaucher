# Corrections éditoriales FR — suivi du 18 octobre 2026

Périmètre : Science, Esprit, Grand Oral et dissertation. Aucun déploiement. Les modifications locales de Motion Canvas sont préexistantes et exclues des commits de cette passe. Frontmatter SEO, dates et slugs conservés. Les corrections antérieures sont réexaminées, leur existence ne vaut pas validation.

## Lot technique complémentaire

- `78a69ee` : durée calculée automatiquement à 220 mots/min depuis la prose, hors balises et blocs de code ; logo de signature explicitement décoratif. Aucun frontmatter réécrit.
- Contrôle HTML sur minimax, graphes-de-nash, paradoxe-de-zermelo, theorie-des-jeux et reseaux-bayesiens : aucun MathML doublonné, aucune entité numérique doublement échappée, aucune meta parasite, aucun bloc Commentaires sans configuration. Formules présentes avec alternative accessible.
- Un seul bouton Notifications dans Footer. Les autres occurrences appartiennent à la fenêtre de préférences.
- Build intermédiaire Astro : 305 pages, succès. Avertissements préexistants sur des traductions absentes ; contrôle final des liens encore à effectuer.

## Décisions validées

Luc a validé la différenciation des deux articles imposteur et la consolidation avec noindex des quatre fiches Grand Oral détaillées ci-dessous.

## Articles

Les entrées ci-dessous décrivent seulement les corrections effectivement effectuées et les sources ouvertes pendant cette passe.

### echecs-et-complexite-algorithmique

Corrigé : EXPTIME définie par une borne supérieure ; estimation de Tromp distinguée d’un dénombrement ; suites de coups distinguées des positions ; 197 281 après quatre demi-coups ; entraînement AlphaZero et vitesse Stockfish alignés sur le préprint 2017. Retiré faute de source ouverte suffisante : profondeur Deep Blue 6–12/40, 95 % des coups éliminés par intuition, assimilation de l’IA au cerveau et anecdote finale Shannon. Sources ouvertes : [Shannon](https://www.computerhistory.org/chess/doc-431614f453dde/), [Tromp](https://tromp.github.io/chess/chess.html), [Fraenkel–Lichtenstein](https://kubokovac.eu/zlozitost/mat/chessExptime.pdf), [IBM](https://www.ibm.com/history/deep-blue), [Silver 2017](https://arxiv.org/html/1712.01815v1), [Stockfish](https://github.com/official-stockfish/Stockfish/blob/master/tests/perft.sh). Aucun marqueur ajouté.

### guide-grand-oral-echecs-nsi

Corrigé : support de préparation autorisé ; faux calcul « un point coefficient par minute » retiré ; code complété par une classe Position et une fonction evaluer pour une démonstration autonome ; ordres de grandeur distingués des nombres exacts de feuilles ; bornes alpha/bêta ; Go non résolu ; profondeur finie et absence de preuve d’impossibilité future. Sources ouvertes : [Ministère](https://www.education.gouv.fr/reussir-au-lycee/baccalaureat-comment-se-passe-le-grand-oral-100028), [Russell–Norvig](https://aima.cs.berkeley.edu/4th-ed/pdfs/newchap06.pdf), [Allis](https://tromp.github.io/c4/connect4_thesis.pdf). Schéma de comparaison harmonisé avec la nuance asymptotique ; noms d’assets conservés. Code exécuté : minimax et alpha-bêta renvoient 3 sur le même arbre et restaurent la position. Aucun marqueur ajouté.

### grand-oral-maths-spe-echecs

Corrections antérieures 40 ordres de grandeur, environ 10^84 âges de l’univers et EXPTIME conservées après contrôle. Corrigé pendant cette passe : espérance Elo distinguée de la probabilité de victoire ; K=40/20/10 ; exemple binomial explicitement fictif et indépendant, 40 % de nulles présenté comme hypothèse. Retirée : attribution de la sigmoïde aux couches internes d’AlphaZero et intervalle de fluctuation présenté comme garanti. Sources ouvertes ajoutées : [FIDE](https://handbook.fide.com/chapter/B022024), [Ministère](https://www.education.gouv.fr/reussir-au-lycee/baccalaureat-comment-se-passe-le-grand-oral-100028), [Fraenkel–Lichtenstein](https://kubokovac.eu/zlozitost/mat/chessExptime.pdf). Aucun marqueur ajouté.

### sujet-grand-oral-ses-marche-superstars

Révision de fond : retrait des revenus personnels, des « 300 professionnels », des effectifs FIDE et des parts de revenu sans données comparables ; retrait du Gini supposé élevé, des statistiques d’audience et des généralisations historiques non sourcées. Les modèles sont présentés comme hypothèses et analogies ; Becker est effectivement mobilisé dans le corps. Deux SVG remplacés pour retirer les mêmes chiffres des images et des alt. Sources ouvertes : [Rosen](https://milescorak.com/wp-content/uploads/2018/09/rosen-1981-aer-economics-superstars.pdf), [Ricardo](https://www.gutenberg.org/ebooks/33310), [Becker, éditeur](https://press.uchicago.edu/ucp/books/book/chicago/H/bo3684031.html), [Lichess](https://database.lichess.org/). Aucun marqueur ajouté. Fusion/noindex non appliqués.

### echecs-et-vision-spatiale

Corrigé : 0,05 ne concerne pas les échecs mais l’entraînement de la mémoire de travail ; la synthèse 2017 signale une seule étude échiquéenne avec contrôle actif (0,10). Retirés : transfert géométrique affirmé comme acquis, méta-analyse Friedman non identifiée, anecdote Anand non confirmée, détails historiques Morphy/Pillsbury non contrôlés, opposition experts/novices attribuée à tort à Atherton. Schémas présentés comme illustrations. Sources ouvertes : [Sala–Gobet 2017](https://journals.sagepub.com/doi/10.1177/0963721417712760), [Charness](https://pubmed.ncbi.nlm.nih.gov/11913751/), [Atherton](https://experts.umn.edu/en/publications/a-functional-mri-study-of-high-level-cognition-i-the-game-of-ches/), [Guinness](https://www.guinnessworldrecords.de/world-records/72345-most-simultaneous-blindfolded-chess-wins). Aucun marqueur ajouté.

### paradoxe-de-zermelo

Corrigé : preuve originale distinguée de l’induction rétrograde moderne ; 50 coups/triple répétition distingués des règles d’arrêt automatiques ; DTM et DTZ distingués ; score d’un moteur non interprété comme distance mesurée au jeu parfait ; exceptions de couverture des tablebases. Retirés faute de source primaire accessible : records 517/549 et affirmations sur l’incapacité de tout humain/moteur ; raccourci quantique 10^120 → 10^60. SVG DTM/DTZ remplacé. Sources ouvertes : [Zermelo traduit et Schwalbe–Walker](https://studylib.net/doc/28166551/zermelo-work), [Syzygy](https://github.com/syzygy1/probetool), [FIDE](https://arbiters.fide.com/wp-content/uploads/Publications/Manual/ARBManual2022_1st_October.pdf), [Shannon](https://www.computerhistory.org/chess/doc-431614f453dde/), [Allis](https://tromp.github.io/c4/connect4_thesis.pdf). Aucun marqueur ajouté.

### echecs-et-resilience

Corrigé : distinction résilience/récupération de Bonanno ; étude Kross 2014 et portée limitée au stress social ; exemple Camille cohérent ; onze champions de Polgár vérifiés sur son dossier officiel. Retirés : profil neurochimique présenté comme mesuré après une défaite, délai optimal 24–48 h, citations non retrouvées de Kasparov et Korchnoi, stratégie personnelle attribuée sans référence à Carlsen. Routine explicitement proposée comme conseil à adapter. Sources ouvertes : [Seligman](https://ppc.sas.upenn.edu/research/attributional-style-adults), [Bonanno](https://gwern.net/doc/psychology/2004-bonanno.pdf), [Kross](https://blognutritionsante.com/wp-content/uploads/2017/12/krossj_pers_soc_psychol2014self-talk_as_a_regulatory_mechanism_how_you_do_it_matters.pdf), [Polgár](https://juditpolgar.com/wp-content/uploads/2026/01/Judit-Polgar-PressKit4.pdf). Aucun marqueur ajouté.

### guide-grand-oral-echecs-toutes-specialites

Corrigé : choix de la question par le jury, support autorisé, durée préparation/exposé/échange ; retrait du superlatif « épreuve la mieux notée ». Les réponses à trous sont remplacées par vingt pistes concrètes, principalement NSI, sans récit personnel inventé. Maass et collègues nuancés ; Verghese distingué d’une preuve de prévention ; victoires de Polgár et record Gareyev sourcés. Sources ouvertes ajoutées : [Ministère](https://www.education.gouv.fr/reussir-au-lycee/baccalaureat-comment-se-passe-le-grand-oral-100028), [Russell–Norvig](https://aima.cs.berkeley.edu/4th-ed/pdfs/newchap06.pdf), [Sala–Gobet](https://journals.sagepub.com/doi/10.1177/0963721417712760), [Maass](https://mdmcalister.pbworks.com/f/Checkmate%2B-%2BThe%2Brole%2Bof%2Bgender%2Bstereotypes%2Bin%2Bthe%2Bultimate%2Bintellectual%2Bsport.pdf), [Verghese](https://www.activeminds.com/docs/NEJM%20030619.pdf), [Polgár](https://juditpolgar.com/wp-content/uploads/2026/01/Judit-Polgar-PressKit4.pdf), [Guinness](https://www.guinnessworldrecords.de/world-records/72345-most-simultaneous-blindfolded-chess-wins). Bibliographie des autres angles du guide à contrôler dans la suite de la passe. Aucun marqueur ajouté.

### grand-oral-mathematiques-echecs

Corrigé : environ 10^8 suites à six demi-coups ; score attendu Elo ; coefficients K ; ReLU/softmax/tanh et distinction historique Stockfish 8/NNUE actuel. Plan de 22 minutes remplacé par un plan de 10 minutes ; les conseils généraux renvoient aux guides existants sans fusion. Sources ouvertes ajoutées : [Ministère](https://www.education.gouv.fr/reussir-au-lycee/baccalaureat-comment-se-passe-le-grand-oral-100028), [Shannon](https://www.computerhistory.org/chess/doc-431614f453dde/), [FIDE](https://handbook.fide.com/chapter/B022024), [Russell–Norvig](https://aima.cs.berkeley.edu/4th-ed/pdfs/newchap06.pdf), [Silver](https://arxiv.org/html/1712.01815v1), [Stockfish](https://github.com/official-stockfish/Stockfish), [Perft](https://www.chessprogramming.org/Perft_Results). Aucun marqueur ajouté.

### echecs-memoire-de-travail

Corrigé : tutoiement, phrase d’ouverture, attribution Baddeley et Hitch, ajout du tampon en 2000, capacité dépendante des tâches, transfert proche/lointain aligné dans la FAQ et le corps. Retirés faute de preuve : gains 15–20 %, pertes 15–25/20–40 %, erreurs exponentielles, transfert en 20 séances, effacement des gains en 4–6 semaines, anecdote Baddeley. Sources ouvertes : [Baddeley 2012](https://jontalle.web.engr.illinois.edu/MISC/ReadingGroup.11/Papers/Baddeley-WorkingMemory.12.pdf), [Cowan](https://www.cambridge.org/core/services/aop-cambridge-core/content/view/44023F1147D4A1D44BDC0AD226838496/S0140525X01003922a.pdf/div-class-title-the-magical-number-4-in-short-term-memory-a-reconsideration-of-mental-storage-capacity-div.pdf), [Sala–Gobet](https://journals.sagepub.com/doi/10.1177/0963721417712760). Aucun marqueur ajouté.

### reseaux-bayesiens-predire-blunder

Corrigé : S dans la formule et les hypothèses du graphe ; événement B distingué de sa probabilité ; modèle pédagogique non présenté comme validé ; inférence non garantie tractable ; accents. Retirés : seuil Regan 2–3 minutes non retrouvé, loi de fatigue par rondes, équivalence automatique entre niveaux et attributions historiques non nécessaires. Source empirique réelle : [Anderson et al. 2016](https://arxiv.org/pdf/1606.04956). Cadre : [Friedman–Koller](https://ai.stanford.edu/~nir/Papers/FK1Full.pdf). Aucun marqueur ajouté.

### neurones-miroirs-aux-echecs

Réécriture autorisée : l’explication neuronale de l’anticipation échiquéenne n’est pas étayée. Retirés : étude attribuée à Susan Polgár, anecdote de la cacahuète, technique attribuée sans référence à Botvinnik, promesses d’entraînement des circuits miroirs et preuves d’imagerie non identifiées. Les exercices restent présentés comme pistes pratiques. Trois schémas remplacés pour retirer les mêmes affirmations. Sources ouvertes : [Di Pellegrino 1992](https://pubmed.ncbi.nlm.nih.gov/1301372/), [Casile 2011](https://pubmed.ncbi.nlm.nih.gov/21467305/). La seoDescription d’origine reste inchangée conformément à la contrainte SEO ; elle affirme encore un rôle des neurones miroirs plus fermement que le corps corrigé. Ce point nécessite une future décision sur le SEO, sans marqueur inséré dans l’article.

### logique-modale-aux-echecs

Corrigé : possibilité d’une ligne ≠ stratégie gagnante ; alternance ∃/∀ explicite ; « raisonnable » distingué de « légal » ; zugzwang pouvant perdre un gain ou une nulle ; mutuel/réciproque non synonyme de distant ; cœur/croît. Retirés : profondeur imposée par niveau et attributions Botvinnik/Nimzovitch non étayées ici. Schéma zugzwang remplacé. Sources ouvertes : [Garson](https://plato.stanford.edu/entries/logic-modal/), [Russell–Norvig](https://aima.cs.berkeley.edu/4th-ed/pdfs/newchap06.pdf), [Beasley](https://www.arves.org/arves/images/PDF/JohnBeasley/zug3456readme.pdf). Aucun marqueur ajouté.

### effet-placebo-aux-echecs

Révision de fond : aucune démonstration d’imperméabilité des échecs au placebo ; 3,1 % limité à la condition forte dose annoncée, avec intervalle incluant zéro ; effets cognitifs discutés avec le protocole de Foroughi. Retirés : verbatims non retrouvés, asymétrie universelle placebo/nocebo, mécanisme unique par la douleur, généralisation de Kaptchuk aux rituels de tournoi. Bibliographie resserrée sur les quatre travaux réellement discutés ; lien futur transformé en lien existant ; H1 aligné sur le SEO conservé. Deux SVG ajoutés. Sources ouvertes : [Cochrane 2010](https://www.dcscience.net/Hrobjartsson-Gotzsche-Cochrane-placebo.pdf), [Beedie](https://paulogentil.com/pdf/Placebo%20Effects%20of%20Caffeine%20on%20Cycling%20Performance.pdf), [Foroughi](https://www.pnas.org/doi/10.1073/pnas.1601243113), [Kaptchuk](https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0015591). Aucun marqueur ajouté.

## Consolidation validée par Luc et appliquée

- `sujet-grand-oral-maths-combinatoire` : fiche courte, calcul 80 log10(35) ≈ 123,53 et distinction positions/suites. Contenu développé dans le guide Maths ; `noindex, follow`. Sources : [Shannon](https://www.computerhistory.org/chess/doc-431614f453dde/), [Tromp](https://tromp.github.io/chess/chess.html).
- `sujet-grand-oral-maths-modeles-limites` : hypothèses binomiales, score Elo, loi des grands nombres et coût matériel d’AlphaZero clarifiés ; contenu intégré au guide Maths ; `noindex, follow`. Sources : [FIDE](https://handbook.fide.com/chapter/B022024), [Silver](https://arxiv.org/html/1712.01815v1), [Shannon](https://www.computerhistory.org/chess/doc-431614f453dde/).
- `sujet-grand-oral-nsi-minimax` : exemple autonome remplaçant le code au `bonus_position` non défini ; contenu intégré au guide NSI ; `noindex, follow`. Sources : [Russell–Norvig](https://aima.cs.berkeley.edu/4th-ed/pdfs/newchap06.pdf), [Silver](https://arxiv.org/html/1712.01815v1).
- `sujet-grand-oral-nsi-alpha-beta` : bornes précisées, 42 875 présenté comme rapport de puissances dans le meilleur cas, AlphaZero conserve MCTS ; contenu intégré au guide NSI ; `noindex, follow`. Mêmes sources ouvertes que la fiche minimax.

Les quatre URL et leurs métadonnées SEO préexistantes sont conservées. Seul le champ `noindex` autorisé est ajouté ; les fiches sont retirées du sitemap. Les huit autres sujets ne reçoivent pas de noindex. Aucun marqueur ajouté dans ces quatre fiches.

Les deux articles imposteur sont conservés et différenciés, conformément au choix de Luc.

## Différenciation imposteur validée et appliquée

- `syndrome-imposteur-aux-echecs` : angle général, peur d’être démasqué et interprétation des réussites ; comportements présentés comme pistes d’observation, pas diagnostic ; témoignages anonymes et prévalence échiquéenne non étayés retirés ; conseils non présentés comme traitements validés. [Clance–Imes](https://mpowir.org/wp-content/uploads/2010/02/Download-IP-in-High-Achieving-Women.pdf), [Bravata](https://link.springer.com/article/10.1007/s11606-019-05364-1) réellement ouverts.
- `syndrome-imposteur-2000-elo` : angle palier et lecture des fluctuations ; 2000 n’est pas un seuil clinique ni le titre FIDE « expert » ; retrait des 60–70 %, des catégories Elo psychologiques, de l’attribution Dweck sans référence et du « signal positif » présenté comme preuve de compétence. Mêmes sources psychologiques, plus [règlement Elo](https://handbook.fide.com/chapter/B022024) et [titres FIDE](https://handbook.fide.com/chapter/B012024), ouverts. Liens croisés ajoutés. Aucun marqueur, fusion ou redirection.

### dissertation — echecs-et-investissement

Corrigé : parenté présentée comme analogie plutôt que transfert prouvé ; biais réellement documentés par Kahneman–Tversky et Odean ; distinction étude financière/étude de transfert ; phrase d’avertissement ajoutée ; deux SVG originaux. Le H1 et le titre SEO emploient déjà « à l’investissement », aucun changement SEO nécessaire. Sources ouvertes : [Kahneman–Tversky](https://web.mit.edu/curhan/www/docs/Articles/15341_Readings/Behavioral_Decision_Theory/Kahneman_Tversky_1979_Prospect_theory.pdf), [Odean](https://faculty.haas.berkeley.edu/odean/papers%20current%20versions/areinvestorsreluctant.pdf), [Sala–Gobet](https://journals.sagepub.com/doi/10.1177/0963721417712760). Aucun marqueur ajouté.

### echecs-et-flow

Corrigé : Bakker 2008 distingué des études sur les échecs ; aucun délai de reprise universel ; fenêtre 45–90 minutes et seuil Elo retirés ; verbatims non sourcés retirés ; entretiens initiaux distingués des bippers ; bibliographie limitée aux travaux utilisés. Sources réellement ouvertes : [Nakamura–Csikszentmihalyi 2002](https://nuovoeutile.it/wp-content/uploads/2015/12/2002-Flow.pdf), [Bakker 2008](https://www.isonderhouden.nl/doc/pdf/arnoldbakker/articles/articles_arnold_bakker_165.pdf), [Mark 2008](https://www.ics.uci.edu/~gmark/chi08-mark.pdf). Aucun marqueur ajouté.

### regle-40-40-20-echecs

Corrigé : formule clairement présentée comme heuristique sans validation scientifique ; seuils Elo contradictoires et délais de progression non établis retirés ; citations Nunn/Fine/Dvoretsky/Rowson sans source ouverte retirées ; faux facteur dix supprimé ; lien « illusion de compétence » vers Dunning–Kruger supprimé. Illustrations quantitatives non étayées retirées du contenu ; seul l’exemple arithmétique demeure. Sources ouvertes : [Chase–Simon](https://gwern.net/doc/psychology/chess/1973-chase.pdf), [Ericsson et al.](https://gwern.net/doc/psychology/writing/1993-ericsson.pdf). Frontmatter SEO préservé : sa mention de « ce que la recherche recommande » demeure plus affirmative que le texte corrigé et est signalée ici. Aucun marqueur ajouté.

### echecs-et-meditation

Corrigé : protocole MBSR avec exercices guidés de 45 minutes ; régions Hölzel alignées entre corps et essentiel ; résultats d’imagerie distingués des performances ; Norris ajouté et cité ; comparaison aux médicaments nuancée. Retirés : 22 % non établi, calcul de 1 h 53 de distraction en tournoi, promesse de gain Elo, témoignages Carlsen/Caruana, dose optimale et horaire idéal, absence d’effets secondaires. Sources ouvertes : [Hölzel](https://greatergood.berkeley.edu/images/uploads/Holzel-Mindfulness_and_Brain_Gray_Matter_Density.pdf), [Norris](https://www.frontiersin.org/journals/human-neuroscience/articles/10.3389/fnhum.2018.00315/full) et corrigendum, [Goyal](https://library.scottbarrykaufman.com/uploads/2019/08/goyal2014.pdf). Aucun marqueur ajouté.

### echecs-stress-tournoi

Corrigé : tutoiement intégral ; sources réelles ajoutées ; stress distingué du cortisol ; aucune promesse physiologique à 3 minutes ; expérience de tournoi sans comparaison hormonale inventée ; deux SVG. Retirés faute de source vérifiée : étude 2019/287 joueurs, méta-analyse 2017/38 études, 8–12 battements, témoignages Carlsen/Kasparov/Anand, citation militaire. Sources ouvertes : [Shields 2016](https://www.grantsshields.com/wp-content/uploads/2016/08/Stress_and_EF_meta-analysis.pdf), [Zaccaro 2018](https://www.frontiersin.org/journals/human-neuroscience/articles/10.3389/fnhum.2018.00353/full), [Jamieson 2010](https://static1.squarespace.com/static/59a5d96b8dd041d469d4304e/t/59b2d37ac027d84ada0a67d5/1504891771275/Jamieson2010GRE.pdf). Aucun marqueur ajouté.
