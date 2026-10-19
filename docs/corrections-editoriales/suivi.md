# Rapport final — corrections éditoriales FR

## Travail effectué

Les 82 articles initialement restants ont été repris dans l’ordre Science, Esprit puis Grand Oral. Les pages de la première passe ont reçu des compléments lorsqu’une FAQ, un résumé, une illustration ou un ancien paragraphe conservait une contradiction. Ce rapport rassemble **122 fiches par article**, avec corrections, retraits faute de source et références consultées.

L’[archive de la première passe](archive-premiere-passe.md) conserve l’historique ; ses mentions de travail restant sont remplacées par les fiches présentes.

- Corrections éditoriales enregistrées séparément par article ; compléments finaux également séparés.
- Tutoiement dans les explications au lecteur. Les citations adressées au jury et les pluriels réels sont conservés.
- Sources primaires privilégiées ; les fiches précisent quand seul un résumé original a été accessible.
- Résultats expérimentaux distingués des conseils pratiques et des analogies. Chiffres, citations ou mécanismes non confirmés retirés.
- **Aucun marqueur [À VÉRIFIER PAR LUC] restant** dans les 122 fichiers au contrôle final ; aucun placeholder interne identifié.
- Pas de modification des versions EN/PT ni du contenu Société dans cette passe. Aucun déploiement exécuté.

## Accueil aléatoire

Le bloc à la une de l’accueil français tire un article au chargement parmi les articles publiés éligibles. Titre, lien, extrait, image et alt, catégorie, date et temps de lecture sont actualisés ensemble. Les articles noindex et ceux déjà présents dans les deux grilles sont exclus. Sans JavaScript, la carte initiale reste disponible.

Le tirage est indépendant : deux rechargements peuvent sélectionner le même article. Firefox a confirmé le changement au rechargement. Le dernier résultat figure dans [validation-technique.json](validation-technique.json).

## Consolidations approuvées et appliquées

### Deux articles imposteur conservés

- [Imposteur aux échecs](articles/syndrome-imposteur-aux-echecs.md) : doute et sentiment d’être démasqué.
- [Imposteur à 2000 Elo](articles/syndrome-imposteur-2000-elo.md) : passage de palier, classement, fluctuations et légitimité ressentie.

Les répétitions sont réduites et des liens croisés ajoutés. Aucun slug supprimé, aucune redirection 301 ajoutée.

### Quatre fiches Grand Oral

Les développements combinatoire et modèles/limites sont intégrés au guide Maths ; minimax et alpha-bêta au guide NSI. Les quatre fiches courtes sont conservées avec **noindex, follow** et exclues du sitemap. Les huit autres sujets conservent leur angle. Aucune nouvelle fusion ni exclusion d’indexation appliquée.

- [Maths — combinatoire](articles/sujet-grand-oral-maths-combinatoire.md)
- [Maths — modèles et limites](articles/sujet-grand-oral-maths-modeles-limites.md)
- [NSI — minimax](articles/sujet-grand-oral-nsi-minimax.md)
- [NSI — alpha-bêta](articles/sujet-grand-oral-nsi-alpha-beta.md)

## Images

Deux schémas par article ont été retenus pour placebo, AlphaZero/Stockfish, stress-tournoi, attachement, mécanismes de défense, survivant, dissonance, Dunning-Kruger, Murphy, burnout et dissertation. Quatre schémas supplémentaires remplacent les photos hors sujet des fiches HGGSP et Bourdieu.

Les **26 nouveaux SVG** ont été rendus pour inspection : textes et disposition lisibles. Les images contenant des affirmations retirées ont été corrigées ou retirées du contenu.

## SEO, dates et slugs

Cette relecture n’a modifié aucun champ SEO, date ou slug. Le contrôle entre commits distingue un **merge SEO parallèle**, a6b8fb8, qui intègre a74b126, intitulé « fix(seo): aligner les titres et descriptions sur les articles révisés ». Il contient 74 changements de champs SEO sur 46 articles. Ces changements d’une autre opération sur la branche partagée n’ont pas été annulés.

Aucun changement de date ou de slug relevé ; aucun autre commit de la reprise ne modifie les champs protégés. L’ajout noindex des quatre fiches est l’exception explicitement approuvée.

### Formulations protégées à relire

Certaines formulations SEO restent plus affirmatives que le corps corrigé. Ce sont des champs protégés, sans marqueur ajouté au texte publié.

| Article | Formulation SEO conservée |
| --- | --- |
| grand-oral-nsi-echecs | « bac 2025 », alors que le corps est actualisé pour 2026 |
| echecs-estime-de-soi-elo ; echecs-et-la-solitude ; psychologie-du-joueur-d-echecs | Vouvoiement dans le titre ou la description SEO |
| echecs-et-colere-ragequit | Circuits neurologiques et rôle de l’amygdale plus affirmatifs que les preuves retenues |
| echecs-peur-de-gagner | Sabotage inconscient présenté comme explication générale |
| bienfaits-des-pauses-aux-echecs | Gain de performance et protocoles plus affirmatifs que la synthèse consultée |
| 5-biais-cognitifs-blunder | « les plus » responsables des erreurs, sans classement causal établi |
| effet-barnum-aux-echecs | « les profils de style ne disent rien », formulation trop générale |
| impuissance-apprise-aux-echecs | Généralisation à un plateau Elo de résultats principalement animaux |
| projection-aux-echecs | Verdict sur la projection freudienne et causalité directe des erreurs |
| pourquoi-ton-cerveau-prefere-avoir-raison | Chaîne de six mécanismes et « seule parade » |
| jouer-en-blitz-est-il-mauvais-pour-progresser | « Tous les coachs » et volumes des champions non établis |
| paradoxe-du-choix-aux-echecs | Un « vrai problème » unique déduit trop largement d’une méta-analyse |
| Plusieurs sujets Grand Oral | Promesse SEO de texte complet prêt à réciter dix minutes ; les corps corrigés sont des trames à développer et chronométrer personnellement |

## Validation finale

Les mesures du dernier build, des liens et fragments, ainsi que de Firefox sont consignées dans [validation-technique.json](validation-technique.json).

- **npm run build**, avec astro build, Pagefind et traitements de navigation : succès. **393 pages, 17 245 liens internes et 2 621 liens vers des sections contrôlés, aucune cible cassée.**
- Firefox : cinq pages en HTTP 200, sans débordement horizontal ; neuf articles distincts sur dix rechargements de l’accueil, parmi 48 candidats éligibles.
- Cinq pages demandées contrôlées : minimax, graphes de Nash, Zermelo, théorie des jeux, réseaux bayésiens. Un H1 par page, pas de MathML en double, pas de meta parasite ni d’apostrophe doublement encodée.
- Contrôle complémentaire des formules sur logique modale, problème mathématique et guides Maths/NSI : pas de TeX brut détecté dans les blocs contrôlés.
- Quatre fiches noindex vérifiées dans le HTML et le sitemap.
- Les liens vers les articles programmés sont neutralisés par le traitement existant de navigation publique ; ils seront rétablis aux builds correspondant à leur publication.
- 74 fichiers Python de la série analysés syntaxiquement sans erreur. Trois blocs autonomes du nouveau guide NSI exécutés ; minimax et alpha-bêta retournent 3. Les deux copies de quiescence ont été vérifiées sur position initiale, échec, mat et pat, avec restauration de l’état.
- Ce contrôle ciblé n’est pas un tournoi complet de moteurs ; le prototype UCI reste explicitement partiel.
- Les avertissements Pagefind sur les pages de redirection sans élément HTML ne bloquent pas la construction.
- **Aucun déploiement.**

## Fiches par article

Chaque lien donne les corrections et retraits documentés, les sources et les compléments. La colonne commit indique le dernier commit de contenu ; Git conserve aussi les corrections précédentes.

| Catégorie | Article et rapport | Dernier commit de contenu |
| --- | --- | --- |
| esprit | [5-biais-cognitifs-blunder](articles/5-biais-cognitifs-blunder.md) | 4f1c5c6 |
| esprit | [analyser-ses-parties](articles/analyser-ses-parties.md) | bfbef07 |
| esprit | [biais-d-ancrage-aux-echecs](articles/biais-d-ancrage-aux-echecs.md) | df9fcbe |
| esprit | [biais-de-confirmation-aux-echecs](articles/biais-de-confirmation-aux-echecs.md) | e437661 |
| esprit | [biais-du-survivant-aux-echecs](articles/biais-du-survivant-aux-echecs.md) | a6b8fb8 |
| esprit | [bienfaits-des-pauses-aux-echecs](articles/bienfaits-des-pauses-aux-echecs.md) | eaa4658 |
| esprit | [burnout-chess](articles/burnout-chess.md) | a6b8fb8 |
| esprit | [comparaison-sociale-aux-echecs](articles/comparaison-sociale-aux-echecs.md) | 3ea13a4 |
| esprit | [dissonance-cognitive-aux-echecs](articles/dissonance-cognitive-aux-echecs.md) | 79636b7 |
| esprit | [echecs-estime-de-soi-elo](articles/echecs-estime-de-soi-elo.md) | 108d013 |
| esprit | [echecs-et-colere-ragequit](articles/echecs-et-colere-ragequit.md) | ac74be7 |
| esprit | [echecs-et-concentration](articles/echecs-et-concentration.md) | a6b8fb8 |
| esprit | [echecs-et-confiance-en-soi](articles/echecs-et-confiance-en-soi.md) | 082406c |
| esprit | [echecs-et-flow](articles/echecs-et-flow.md) | a6b8fb8 |
| esprit | [echecs-et-l-echec](articles/echecs-et-l-echec.md) | c18e3b0 |
| esprit | [echecs-et-la-solitude](articles/echecs-et-la-solitude.md) | f66e261 |
| esprit | [echecs-et-perfectionnisme-toxique](articles/echecs-et-perfectionnisme-toxique.md) | 507d3ae |
| esprit | [echecs-et-procrastination](articles/echecs-et-procrastination.md) | 50d0d21 |
| esprit | [echecs-et-resilience](articles/echecs-et-resilience.md) | 59883bb |
| esprit | [echecs-et-visualisation](articles/echecs-et-visualisation.md) | 1393853 |
| esprit | [echecs-gestion-du-temps](articles/echecs-gestion-du-temps.md) | 261cb34 |
| esprit | [echecs-peur-de-gagner](articles/echecs-peur-de-gagner.md) | ba44a1d |
| esprit | [echecs-peur-de-perdre](articles/echecs-peur-de-perdre.md) | a1226de |
| esprit | [echecs-stress-tournoi](articles/echecs-stress-tournoi.md) | a6b8fb8 |
| esprit | [echecs-vs-poker-strategie](articles/echecs-vs-poker-strategie.md) | 96aca04 |
| esprit | [echecs-vs-scrabble-cognition](articles/echecs-vs-scrabble-cognition.md) | 6ece276 |
| esprit | [effet-barnum-aux-echecs](articles/effet-barnum-aux-echecs.md) | abc9301 |
| esprit | [effet-de-halo-aux-echecs](articles/effet-de-halo-aux-echecs.md) | d25a01e |
| esprit | [effet-dunning-kruger-aux-echecs](articles/effet-dunning-kruger-aux-echecs.md) | c6f088e |
| esprit | [faut-il-vraiment-etudier-les-ouvertures](articles/faut-il-vraiment-etudier-les-ouvertures.md) | 80d10e0 |
| esprit | [formation-des-habitudes-aux-echecs](articles/formation-des-habitudes-aux-echecs.md) | 3f88d90 |
| esprit | [gratification-differee-aux-echecs](articles/gratification-differee-aux-echecs.md) | 0495fff |
| esprit | [impuissance-apprise-aux-echecs](articles/impuissance-apprise-aux-echecs.md) | bac7924 |
| esprit | [intelligence-emotionnelle-aux-echecs](articles/intelligence-emotionnelle-aux-echecs.md) | 57764d5 |
| esprit | [jouer-en-blitz-est-il-mauvais-pour-progresser](articles/jouer-en-blitz-est-il-mauvais-pour-progresser.md) | 3c7a1ad |
| esprit | [loi-de-murphy-aux-echecs](articles/loi-de-murphy-aux-echecs.md) | 157c834 |
| esprit | [manipulation-emotionnelle-aux-echecs](articles/manipulation-emotionnelle-aux-echecs.md) | 9d0efcf |
| esprit | [mecanismes-de-defense-aux-echecs](articles/mecanismes-de-defense-aux-echecs.md) | a6b8fb8 |
| esprit | [motivation-intrinseque-aux-echecs](articles/motivation-intrinseque-aux-echecs.md) | 9aa1425 |
| esprit | [paradoxe-du-choix-aux-echecs](articles/paradoxe-du-choix-aux-echecs.md) | 1691848 |
| esprit | [pourquoi-grands-joueurs-perdent-contre-enfants](articles/pourquoi-grands-joueurs-perdent-contre-enfants.md) | c279f0e |
| esprit | [pourquoi-ton-cerveau-prefere-avoir-raison](articles/pourquoi-ton-cerveau-prefere-avoir-raison.md) | 9bb3a6a |
| esprit | [projection-aux-echecs](articles/projection-aux-echecs.md) | b0dc260 |
| esprit | [prophetie-auto-realisatrice-aux-echecs](articles/prophetie-auto-realisatrice-aux-echecs.md) | 9dcad3f |
| esprit | [psychologie-du-joueur-d-echecs](articles/psychologie-du-joueur-d-echecs.md) | 16558e7 |
| esprit | [rationalisation-aux-echecs](articles/rationalisation-aux-echecs.md) | 7d223c2 |
| esprit | [regle-40-40-20-echecs](articles/regle-40-40-20-echecs.md) | a6b8fb8 |
| esprit | [syndrome-imposteur-2000-elo](articles/syndrome-imposteur-2000-elo.md) | a6b8fb8 |
| esprit | [syndrome-imposteur-aux-echecs](articles/syndrome-imposteur-aux-echecs.md) | a6b8fb8 |
| esprit | [theorie-auto-determination-aux-echecs](articles/theorie-auto-determination-aux-echecs.md) | 2594344 |
| esprit | [theorie-de-l-attachement-aux-echecs](articles/theorie-de-l-attachement-aux-echecs.md) | a6b8fb8 |
| grand-oral | [grand-oral-mathematiques-echecs](articles/grand-oral-mathematiques-echecs.md) | 1106d8e |
| grand-oral | [grand-oral-maths-spe-echecs](articles/grand-oral-maths-spe-echecs.md) | 7b775ca |
| grand-oral | [grand-oral-nsi-echecs](articles/grand-oral-nsi-echecs.md) | f0674ee |
| grand-oral | [guide-grand-oral-echecs-nsi](articles/guide-grand-oral-echecs-nsi.md) | 8ee8032 |
| grand-oral | [guide-grand-oral-echecs-ses-hggsp](articles/guide-grand-oral-echecs-ses-hggsp.md) | aae3c76 |
| grand-oral | [guide-grand-oral-echecs-toutes-specialites](articles/guide-grand-oral-echecs-toutes-specialites.md) | 6e0c2cb |
| grand-oral | [sujet-grand-oral-hggsp-fischer-spassky](articles/sujet-grand-oral-hggsp-fischer-spassky.md) | 06b562e |
| grand-oral | [sujet-grand-oral-hggsp-memoire-patrimoine](articles/sujet-grand-oral-hggsp-memoire-patrimoine.md) | 285254b |
| grand-oral | [sujet-grand-oral-hggsp-mondialisation-plateformes](articles/sujet-grand-oral-hggsp-mondialisation-plateformes.md) | 9ecfceb |
| grand-oral | [sujet-grand-oral-maths-combinatoire](articles/sujet-grand-oral-maths-combinatoire.md) | a6b8fb8 |
| grand-oral | [sujet-grand-oral-maths-elo-probabilites](articles/sujet-grand-oral-maths-elo-probabilites.md) | e54ca99 |
| grand-oral | [sujet-grand-oral-maths-modeles-limites](articles/sujet-grand-oral-maths-modeles-limites.md) | a6b8fb8 |
| grand-oral | [sujet-grand-oral-maths-zermelo-complexite](articles/sujet-grand-oral-maths-zermelo-complexite.md) | f0edb9a |
| grand-oral | [sujet-grand-oral-nsi-alpha-beta](articles/sujet-grand-oral-nsi-alpha-beta.md) | a6b8fb8 |
| grand-oral | [sujet-grand-oral-nsi-alphazero](articles/sujet-grand-oral-nsi-alphazero.md) | ec2a444 |
| grand-oral | [sujet-grand-oral-nsi-minimax](articles/sujet-grand-oral-nsi-minimax.md) | a6b8fb8 |
| grand-oral | [sujet-grand-oral-ses-bourdieu-reproduction](articles/sujet-grand-oral-ses-bourdieu-reproduction.md) | f9ea619 |
| grand-oral | [sujet-grand-oral-ses-marche-superstars](articles/sujet-grand-oral-ses-marche-superstars.md) | a74b126 |
| science | [approfondissement-iteratif-gestion-du-temps](articles/approfondissement-iteratif-gestion-du-temps.md) | 10c00ca |
| science | [aversion-a-la-perte-aux-echecs](articles/aversion-a-la-perte-aux-echecs.md) | d49e98d |
| science | [conditionnement-classique-aux-echecs](articles/conditionnement-classique-aux-echecs.md) | a6b8fb8 |
| science | [conditionnement-operant-aux-echecs](articles/conditionnement-operant-aux-echecs.md) | a6b8fb8 |
| science | [decision-sous-incertitude-aux-echecs](articles/decision-sous-incertitude-aux-echecs.md) | a4b7a21 |
| science | [echecs-alphazero-stockfish](articles/echecs-alphazero-stockfish.md) | c0bbcf3 |
| science | [echecs-alzheimer-prevention-declin-cognitif](articles/echecs-alzheimer-prevention-declin-cognitif.md) | a6b8fb8 |
| science | [echecs-et-complexite-algorithmique](articles/echecs-et-complexite-algorithmique.md) | 32d43fb |
| science | [echecs-et-dopamine](articles/echecs-et-dopamine.md) | a6b8fb8 |
| science | [echecs-et-genetique](articles/echecs-et-genetique.md) | 5528eb0 |
| science | [echecs-et-le-corps](articles/echecs-et-le-corps.md) | a6b8fb8 |
| science | [echecs-et-meditation](articles/echecs-et-meditation.md) | a6b8fb8 |
| science | [echecs-et-memoire](articles/echecs-et-memoire.md) | a6b8fb8 |
| science | [echecs-et-sommeil](articles/echecs-et-sommeil.md) | a6b8fb8 |
| science | [echecs-et-vision-spatiale](articles/echecs-et-vision-spatiale.md) | d797d61 |
| science | [echecs-memoire-de-travail](articles/echecs-memoire-de-travail.md) | a74b126 |
| science | [echecs-vs-go-complexite-intelligence](articles/echecs-vs-go-complexite-intelligence.md) | d91a447 |
| science | [echecs-vs-jeux-video-cerveau](articles/echecs-vs-jeux-video-cerveau.md) | a6b8fb8 |
| science | [echecs-vs-mathematiques-logique](articles/echecs-vs-mathematiques-logique.md) | 20d86c8 |
| science | [echecs-vs-musique-cerveau](articles/echecs-vs-musique-cerveau.md) | a6b8fb8 |
| science | [effet-placebo-aux-echecs](articles/effet-placebo-aux-echecs.md) | a6b8fb8 |
| science | [faux-souvenirs-aux-echecs](articles/faux-souvenirs-aux-echecs.md) | 592f58c |
| science | [fonction-evaluation-materiel-python](articles/fonction-evaluation-materiel-python.md) | 60940f4 |
| science | [generer-les-coups-legaux-en-python](articles/generer-les-coups-legaux-en-python.md) | 093acdb |
| science | [graphes-de-nash-equilibre-ouvertures](articles/graphes-de-nash-equilibre-ouvertures.md) | a6b8fb8 |
| science | [hyperfocus-attention-soutenue-aux-echecs](articles/hyperfocus-attention-soutenue-aux-echecs.md) | a6b8fb8 |
| science | [les-echecs-et-le-cerveau](articles/les-echecs-et-le-cerveau.md) | 1b4845c |
| science | [les-echecs-et-les-mathematiques](articles/les-echecs-et-les-mathematiques.md) | f59f3a7 |
| science | [les-echecs-rendent-ils-plus-intelligent](articles/les-echecs-rendent-ils-plus-intelligent.md) | cb6cc71 |
| science | [logique-modale-aux-echecs](articles/logique-modale-aux-echecs.md) | a094eb1 |
| science | [memoire-reconstructive-aux-echecs](articles/memoire-reconstructive-aux-echecs.md) | a6b8fb8 |
| science | [memoriser-parties-aux-echecs](articles/memoriser-parties-aux-echecs.md) | 4fd990f |
| science | [minimax-aux-echecs](articles/minimax-aux-echecs.md) | a6b8fb8 |
| science | [minimax-en-python-moteur-echecs](articles/minimax-en-python-moteur-echecs.md) | a6b8fb8 |
| science | [moteur-echecs-python-par-ou-commencer](articles/moteur-echecs-python-par-ou-commencer.md) | f24400e |
| science | [negamax-et-elagage-alpha-beta-python](articles/negamax-et-elagage-alpha-beta-python.md) | c1d7550 |
| science | [neurones-miroirs-aux-echecs](articles/neurones-miroirs-aux-echecs.md) | a74b126 |
| science | [neuroplasticite-aux-echecs](articles/neuroplasticite-aux-echecs.md) | 38d3c09 |
| science | [ordonnancement-des-coups-moteur-echecs](articles/ordonnancement-des-coups-moteur-echecs.md) | 3adc0fe |
| science | [paradoxe-de-zermelo](articles/paradoxe-de-zermelo.md) | 763d3d1 |
| science | [perft-verifier-son-generateur-de-coups](articles/perft-verifier-son-generateur-de-coups.md) | bed3ecf |
| science | [pourquoi-echecs-probleme-mathematique-impossible-et-ia](articles/pourquoi-echecs-probleme-mathematique-impossible-et-ia.md) | a6b8fb8 |
| science | [protocole-uci-python-et-mesurer-son-elo](articles/protocole-uci-python-et-mesurer-son-elo.md) | fb112ee |
| science | [quiescence-et-tables-de-cases-python](articles/quiescence-et-tables-de-cases-python.md) | 17ccbd1 |
| science | [representer-un-echiquier-en-python](articles/representer-un-echiquier-en-python.md) | a6b8fb8 |
| science | [reseau-mode-defaut-aux-echecs](articles/reseau-mode-defaut-aux-echecs.md) | a6b8fb8 |
| science | [reseaux-bayesiens-predire-blunder](articles/reseaux-bayesiens-predire-blunder.md) | a74b126 |
| science | [stress-chronique-aux-echecs](articles/stress-chronique-aux-echecs.md) | a6b8fb8 |
| science | [theorie-de-l-esprit-aux-echecs](articles/theorie-de-l-esprit-aux-echecs.md) | a6b8fb8 |
| science | [theorie-des-jeux-aux-echecs](articles/theorie-des-jeux-aux-echecs.md) | e33cb75 |
| science | [theorie-du-chaos-aux-echecs](articles/theorie-du-chaos-aux-echecs.md) | a6b8fb8 |
| science | [un-moteur-qui-joue-au-hasard](articles/un-moteur-qui-joue-au-hasard.md) | 53d7a84 |
| dissertations | [echecs-et-investissement](articles/echecs-et-investissement.md) | 50990b8 |
