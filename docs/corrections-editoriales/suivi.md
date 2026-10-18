# Corrections éditoriales FR — suivi du 18 octobre 2026

Périmètre : Science, Esprit, Grand Oral et dissertation. Aucun déploiement. Les modifications locales de Motion Canvas sont préexistantes et exclues des commits de cette passe. Frontmatter SEO, dates et slugs conservés. Les corrections antérieures sont réexaminées, leur existence ne vaut pas validation.

## Lot technique complémentaire

- `78a69ee` : durée calculée automatiquement à 220 mots/min depuis la prose, hors balises et blocs de code ; logo de signature explicitement décoratif. Aucun frontmatter réécrit.
- Contrôle HTML sur minimax, graphes-de-nash, paradoxe-de-zermelo, theorie-des-jeux et reseaux-bayesiens : aucun MathML doublonné, aucune entité numérique doublement échappée, aucune meta parasite, aucun bloc Commentaires sans configuration. Formules présentes avec alternative accessible.
- Un seul bouton Notifications dans Footer. Les autres occurrences appartiennent à la fenêtre de préférences.
- Build intermédiaire Astro : 305 pages, succès. Avertissements préexistants sur des traductions absentes ; contrôle final des liens encore à effectuer.

## Validation en attente

Les propositions de fusion/noindex seront présentées avant application. Aucune fusion, redirection ou nouvelle directive noindex autorisée pour le moment.

## Articles

Les entrées ci-dessous décrivent seulement les corrections effectivement effectuées et les sources ouvertes pendant cette passe.

### echecs-et-complexite-algorithmique

Corrigé : EXPTIME définie par une borne supérieure ; estimation de Tromp distinguée d’un dénombrement ; suites de coups distinguées des positions ; 197 281 après quatre demi-coups ; entraînement AlphaZero et vitesse Stockfish alignés sur le préprint 2017. Retiré faute de source ouverte suffisante : profondeur Deep Blue 6–12/40, 95 % des coups éliminés par intuition, assimilation de l’IA au cerveau et anecdote finale Shannon. Sources ouvertes : [Shannon](https://www.computerhistory.org/chess/doc-431614f453dde/), [Tromp](https://tromp.github.io/chess/chess.html), [Fraenkel–Lichtenstein](https://kubokovac.eu/zlozitost/mat/chessExptime.pdf), [IBM](https://www.ibm.com/history/deep-blue), [Silver 2017](https://arxiv.org/html/1712.01815v1), [Stockfish](https://github.com/official-stockfish/Stockfish/blob/master/tests/perft.sh). Aucun marqueur ajouté.

### guide-grand-oral-echecs-nsi

Corrigé : support de préparation autorisé ; faux calcul « un point coefficient par minute » retiré ; code complété par une classe Position et une fonction evaluer pour une démonstration autonome ; ordres de grandeur distingués des nombres exacts de feuilles ; bornes alpha/bêta ; Go non résolu ; profondeur finie et absence de preuve d’impossibilité future. Sources ouvertes : [Ministère](https://www.education.gouv.fr/reussir-au-lycee/baccalaureat-comment-se-passe-le-grand-oral-100028), [Russell–Norvig](https://aima.cs.berkeley.edu/4th-ed/pdfs/newchap06.pdf), [Allis](https://tromp.github.io/c4/connect4_thesis.pdf). Schéma de comparaison harmonisé avec la nuance asymptotique ; noms d’assets conservés. Code exécuté : minimax et alpha-bêta renvoient 3 sur le même arbre et restaurent la position. Aucun marqueur ajouté.

### grand-oral-maths-spe-echecs

Corrections antérieures 40 ordres de grandeur, environ 10^84 âges de l’univers et EXPTIME conservées après contrôle. Corrigé pendant cette passe : espérance Elo distinguée de la probabilité de victoire ; K=40/20/10 ; exemple binomial explicitement fictif et indépendant, 40 % de nulles présenté comme hypothèse. Retirée : attribution de la sigmoïde aux couches internes d’AlphaZero et intervalle de fluctuation présenté comme garanti. Sources ouvertes ajoutées : [FIDE](https://handbook.fide.com/chapter/B022024), [Ministère](https://www.education.gouv.fr/reussir-au-lycee/baccalaureat-comment-se-passe-le-grand-oral-100028), [Fraenkel–Lichtenstein](https://kubokovac.eu/zlozitost/mat/chessExptime.pdf). Aucun marqueur ajouté.
