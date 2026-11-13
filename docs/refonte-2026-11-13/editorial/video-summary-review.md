# Relecture des cinq résumés vidéo avant publication

Date : 13 novembre 2026.

**Conclusion éditoriale : les textes des 30 scènes restent exacts et pertinents après l'enrichissement des cinq dossiers. Aucune correction du texte dessiné dans les scènes n'est nécessaire.** Un titre de storyboard doit toutefois être aligné : celui de la concentration reprend encore l'ancien titre avec la métaphore du muscle.

Cette conclusion porte sur la cohérence sémantique des storyboards avec les articles finaux. Elle ne constitue pas une nouvelle validation visuelle ou sonore des MP4 : aucun film ni poster n'a été visionné ou réencodé durant cette relecture.

## Périmètre et méthode

- Lecture des cinq entrées de `/tmp/blog-refonte-publication/scripts/article-videos/storyboards.json`, avec leurs six scènes, titres, rôles, intertitres sources et intentions visuelles.
- Comparaison avec les cinq articles finaux dans `/tmp/blog-refonte-publication/src/content/blog/` et le dépôt de travail. Les empreintes des deux copies des articles concordent au moment de cette revue.
- Vérification de la présence des intertitres `sourceHeading`. `Introduction` désigne le texte placé avant le premier intertitre ; les autres références existent toujours.
- Lecture seule de `common.mjs` et `studio.html` pour déterminer où intervient le titre de storyboard. Aucun changement de pipeline, d'asset, de manifeste, d'empreinte enregistrée ou de Git réalisé.
- Les exemples et développements ajoutés approfondissent les idées déjà résumées. Un résumé de six scènes n'a pas à reproduire tous les exercices pour rester fidèle au dossier.

## Décision par dossier

| Dossier | Scènes | Titre | Décision éditoriale |
| --- | --- | --- | --- |
| Mémoire | Six scènes exactes ; reconnaissance, mise à jour, conditions du motif et transfert sont maintenus | Identique à l'article | Réconciliation des références dérivées possible sans changement des scènes |
| Concentration | Six scènes exactes ; les nouveaux exercices illustrent précisément les distinctions résumées | Ancien titre à remplacer | Conserver les scènes ; aligner le titre de storyboard et ses dérivés accessibles/éditoriaux |
| Analyse des parties | Six scènes exactes ; les deux défenses du motif de Legal renforcent la comparaison déjà conseillée | Identique à l'article | Réconciliation des références dérivées possible sans changement des scènes |
| Habitudes d'apprentissage | Six scènes exactes ; le nouveau cycle applique la distinction entre rendez-vous et apprentissage | Identique à l'article | Réconciliation des références dérivées possible sans changement des scènes |
| AlphaZero / Stockfish | Six scènes exactes ; aucune ne reprend les formulations factuellement corrigées dans l'article | Identique à l'article | Réconciliation des références dérivées possible sans changement des scènes |

## Revue scène par scène

### Mémoire

| Scène | Vérification face à l'article final |
| --- | --- |
| 1. Reconnaître avant de calculer | L'introduction décrit bien une reconnaissance qui peut orienter un plan sans en fournir immédiatement une explication complète. La formulation reste conditionnelle. |
| 2. Une expertise spécialisée | Les chunks sont rapportés à la structure et aux connaissances du joueur, sans chiffre universel ni mémoire photographique. |
| 3. Faire travailler les connaissances | Le dossier distingue maintien/mise à jour de l'état et connaissances à long terme. La scène ne promet pas une capacité générale chiffrée. |
| 4. Vérifier ce qui a changé | Correspond au contrôle des conditions d'un motif. Les trois nouvelles positions de mat du couloir en donnent maintenant une démonstration supplémentaire. |
| 5. Ne pas généraliser trop vite | Fidèle à la limite sur le transfert scolaire ou cognitif général. Aucun bénéfice de santé n'est ajouté. |
| 6. Retrouver puis expliquer | Correspond au rappel sans modèle et à l'apprentissage du plan lorsque l'adversaire dévie. Les séances et corrigés enrichissent ce conseil sans le contredire. |

Aucun changement visible requis. L'absence, dans la vidéo, des trois positions précises n'altère pas la thèse du résumé.

### Concentration

| Scène | Vérification face à l'article final |
| --- | --- |
| 1. Être concentré sur la bonne question | La distinction entre effort, sélection de l'information et changement de piste reste au centre de l'article. |
| 2. Retrouver le dernier changement | La routine « ce qui a changé » est conservée. Le déplacement de la Dame et la disparition du pion g2 dans le nouvel exercice l'illustrent. |
| 3. Distinguer les difficultés | Oubli de position, compensation mal évaluée et menace négligée appellent effectivement des corrections différentes. Le clouage du Fou e2 précise encore ce diagnostic. |
| 4. Associer continuité et souplesse | Correspond à la section qui distingue le suivi d'une branche et la recherche d'un autre candidat. |
| 5. La pause n'est pas un miracle | Le résumé reste compatible avec les effets sur fatigue/vigueur et l'absence d'effet global significatif sur la performance dans la synthèse citée. Il ne prescrit aucune durée universelle. |
| 6. Rendre le travail observable | La tâche, l'ajustement unique et la vérification des candidats/défenses correspondent aux critères conservés dans le dossier. |

**Correction requise du titre de storyboard :**

- Ancien : `Concentration aux échecs : entraîner l'attention comme un muscle`
- Nouveau : `Concentration aux échecs : garder et retrouver le fil du calcul`

Ce changement évite de réintroduire, dans les éléments éditoriaux ou accessibles, la promesse que le nouveau titre a précisément abandonnée. Aucune des six scènes ne reprend la métaphore du muscle.

Le code courant de `studio.html` place `__TITLE__` dans le titre du document et l'`aria-label` du canvas. Les fonctions de dessin utilisent `s.heading` et `s.text`, pas `card.title`. Le titre apparaît aussi dans les entrées du manifeste et les liens de la galerie générée par `prepare.mjs`. La graine de composition et la graine audio dérivent du slug, qui ne change pas. **La lecture du code ne révèle donc aucun changement d'image imposé par l'alignement de ce titre.** Ce constat permet d'envisager la conservation du MP4 ; il ne prétend pas constater l'identité visuelle d'un MP4 que cette revue n'a pas ouvert. Le parent reste responsable de la réconciliation cohérente des dérivés et de leurs validations.

### Analyse des parties

| Scène | Vérification face à l'article final |
| --- | --- |
| 1. Que pensais-tu faire ? | Le résultat ne suffit toujours pas à établir la qualité du raisonnement ; les décisions de parties gagnées ou perdues restent utilisables. |
| 2. Reconstituer avant de corriger | Les hypothèses initiales, l'objectif et l'alternative écartée restent les informations à conserver ; l'aide précoce au débutant demeure admise. |
| 3. Comparer les ressources | Les candidats et la première défense décisive sont exactement le principe renforcé par les branches prise de Dame/prise du Cavalier. |
| 4. Construire un exercice | Déclencheur, action, raison et modification d'une condition restent la méthode proposée. Aucune efficacité chiffrée n'est promise. |
| 5. Le graphe ne pense pas pour toi | L'évaluation dépend de la recherche et ne permet pas, à elle seule, d'attribuer une cause à l'erreur humaine. La possibilité de retrouver une ressource après coup ne prouve pas qu'elle aurait été trouvée en partie. |
| 6. Revenir sur ce qui reste | Correspond à la trace courte, à la restitution différée et à la possibilité de conserver des questions ouvertes. |

Aucun changement visible requis. Le résumé ne prétend pas que la combinaison ajoutée force le mat contre toutes les défenses.

### Habitudes d'apprentissage

| Scène | Vérification face à l'article final |
| --- | --- |
| 1. Rendre le début facile, garder la pensée active | La distinction entre automaticité du démarrage et compétence de calcul reste la thèse du dossier. |
| 2. Associer un contexte à une action | Correspond à la préparation d'une position, à un contexte identifiable et à un objectif choisi. |
| 3. Distinguer entrée et méthode | La possibilité d'une routine régulière mais d'un travail passif est conservée ; défense et justification constituent la correction proposée. |
| 4. Suivre aussi ce que tu comprends | Les deux colonnes sont un outil de suivi, sans prétention de test psychologique. Le nouveau cycle développe précisément leur utilisation. |
| 5. Aucune durée universelle | La scène restitue les limites de l'étude de Lally et du modèle sans transformer les délais estimés en prescription échiquéenne. |
| 6. Prévoir l'interruption et la fin | L'adaptation du contexte, l'absence de dette punitive et le droit de finir restent explicites. Les critères de fin sont désormais plus concrets. |

Aucun changement visible requis. Le cycle ajouté est une proposition pédagogique ; la vidéo ne l'attribue pas à l'étude de Lally.

### AlphaZero / Stockfish

| Scène | Vérification face à l'article final |
| --- | --- |
| 1. Une autre manière d'apprendre | La scène demande d'examiner recherche et apprentissage sans psychologie humaine ; elle ne reprend pas les formulations anthropomorphiques retirées. |
| 2. Politique et valeur apprises | La présentation auto-jeu/réseau/recherche est correcte. Le nouvel exemple sépare les probabilités initiales, la valeur et les visites sans contredire cette synthèse. |
| 3. Lire le match avec ses conditions | La cadence fixe par coup est bien une condition du match de 2017, auquel se rapporte l'intertitre source « Le match : 28-0-72 ». La scène ne donne aucun score ni ne prétend que cette cadence vaut aussi pour le protocole de 2018. |
| 4. Une opposition devenue insuffisante | L'association NNUE/recherche alpha-bêta reste exacte. La scène ne dit pas que Stockfish 12 avait supprimé toute évaluation classique. |
| 5. Éviter les récits de style | Correspond à la prudence sur l'intuition, les sacrifices et les conditions d'évaluation. Aucun effet sur les modes d'ouverture n'est affirmé. |
| 6. Transformer l'émerveillement en analyse | La vérification de l'activité et des défenses correspond à l'analyse ajoutée de la colonne g ; aucune autorisation générale de sacrifice n'est donnée. |

Aucun changement visible indispensable. Une précision facultative, lors d'une future révision du film, serait d'écrire « Dans le match de 2017, la cadence fixe par coup… » dans la scène 3. Cela rendrait sa référence temporelle plus explicite, mais la formulation actuelle n'énonce pas une cadence fausse et ne justifie pas à elle seule un réencodage dans ce chantier.

## Traçabilité des articles examinés

Les empreintes ci-dessous documentent l'état revu. Elles ne sont pas injectées par cette tâche dans les storyboards ou les manifestes.

| Dossier | SHA enregistré dans le storyboard | SHA de l’article final relu |
| --- | --- | --- |
| `echecs-et-memoire` | `fa7485a440871bc43e7cff596d79ce7a9674ef0c41dff554a6eaed3e4ce258b2` | `8ed83198e0c9bcd7414e3e507ca6dad08e45862bd20b79898e6ecb0c3ea51930` |
| `echecs-et-concentration` | `39a504b17a71094f9ab590ad4b65a8a915c2a2337a2fced700c5a3d708145c8d` | `f0e2679987b9fc7f2b7096097cc772e1b83c959ddd2b18d98292ae06a645fc1a` |
| `analyser-ses-parties` | `ddfe8a6dda5bf8592538dfb372a525a7f543b0e77c6b18ccc1c37009b261233f` | `8608a259a14e6b755e9d73258a77b90784e4706bcb0a268c11f94816e5fd1b75` |
| `formation-des-habitudes-aux-echecs` | `066caf776d0254c68ae831d3a904c4f8f00d0a36f7acd526d9de13cd8706df32` | `efca6c47644cc07399260d6f01e0914ed67908c27689a8c208a9f5dd66297f4e` |
| `echecs-alphazero-stockfish` | `e31e6046c91f1e63ca7e9e3fdae01775301ec2291c6f9009a963991b548ccdaa` | `9ef46a2891f72f88391c4454bd7cf1e8de629d8810a74435cdf09171f7bf2ee5` |

Contrôle structurel : 30 scènes, cinq copies de publication identiques aux copies locales, toutes les références d’intertitre retrouvées. Les cinq SHA de source ont changé ; la décision ci-dessus résulte de la relecture du contenu, pas du seul constat des empreintes.
