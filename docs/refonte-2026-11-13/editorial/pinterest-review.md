# Revue Pinterest des cinq dossiers de référence

Date : 13 novembre 2026. Candidat : `/tmp/blog-refonte-publication`.

## Résultat

- **38 variantes** relues : trois descriptions AlphaZero corrigées ; les 35 autres descriptions et tous les pointeurs, titres, pinId, dispositions et dates sont conservés. Le contrôle `readAngleSources` confirme les 38 correspondances au début du paragraphe ou à la réponse FAQ de l'article final.
- **27 médias liés** : 14 PDF et 13 vidéos. Aucune entrée ne concerne `analyser-ses-parties` dans ces trois fichiers ; aucun contenu n'est créé pour combler cette absence.
- **7 PDF et 7 couvertures réellement régénérés**, copiés dans le candidat après contrôle des 24 pages et des paragraphes. Les sept autres PDF restent pertinents et leurs octets sont conservés.
- **2 vidéos demandent une correction visible** : AlphaZero angles 02 et 05. Leurs storyboards sont corrigés ; rendu délégué à `grand_oral`. Les 11 autres vidéos gardent leurs scènes.
- `media-manifest.json` n'est pas modifié par ce sous-chantier. Un **patch ciblé de 25 entrées** est fourni au parent : les sept PDF corrigés et les 18 médias conservés après revue. Les deux vidéos rendues par `grand_oral` sont volontairement exclues de ce patch : leur bundle distinct doit être assemblé par le parent.

Aucun envoi vers Pinterest, aucune modification de calendrier, aucun build global et aucune désactivation des contrôles.

## Trois descriptions corrigées

Fichier modifié dans le candidat : `scripts/pinterest/variants.json`. Seul le champ `description` de ces trois entrées change. Les valeurs avant/après sont conservées dans `pinterest-variants-diff.json`.

| pinId | Correction |
| --- | --- |
| `echecs-alphazero-stockfish--angle-02` | Le paragraphe désigne Stockfish 8 comme la version choisie pour l'expérience, sans prétendre établir qu'elle était la meilleure version disponible. Score et répartition des couleurs conservés. |
| `echecs-alphazero-stockfish--angle-04` | La formulation non étayée sur l'influence « la plus durable » en théorie des ouvertures est remplacée par la question réellement étudiée : l'évolution des séquences pendant l'auto-jeu. |
| `echecs-alphazero-stockfish--angle-05` | NNUE est présenté comme l'évaluation utilisée par défaut dans Stockfish 12, avec son origine dans le shogi. |

La variante angle-04 est une image dans la campagne, sans entrée PDF/vidéo dans le manifeste examiné. Sa description corrigée sera reprise par la matérialisation normale de cette variante ; aucun asset de campagne supplémentaire n'a été régénéré ici.

Répartition des variantes contrôlées : mémoire 9, concentration 10, habitudes 10, AlphaZero 9, analyse des parties 0.

## Liste exacte des 27 médias

L'identifiant détermine le chemin inchangé : `public/pinterest-media/pdf/<id>.pdf` ou `public/pinterest-media/video/<id>.mp4`, accompagné de `public/pinterest-media/covers/<id>.jpg`.

| Identifiant | Format | Décision et justification |
| --- | --- | --- |
| `formation-des-habitudes-aux-echecs` | PDF | **Régénéré.** L'ancienne introduction attribuait un épisode fictif de blitz au lecteur. Elle est remplacée par l'introduction explicative de l'article final ; les résultats de Lally et les distinctions utiles sont conservés. |
| `echecs-alphazero-stockfish` | PDF | **Régénéré.** Corrige la recherche prétendument exhaustive, l'absence de conception humaine, le statut de Stockfish 8, les déductions sur la cadence et la comparaison des protocoles. La nouvelle explication politique/valeur/visites accompagne l'extrait d'architecture. |
| `echecs-et-memoire--angle-01` | vidéo | **Conservée.** Chunks, structure des positions et limites du protocole restent exacts. |
| `echecs-et-concentration--angle-01` | vidéo | **Conservée.** Signes de décrochage et absence de seuil universel de fatigue ; aucune promesse de diagnostic. |
| `echecs-et-memoire--angle-02` | PDF | **Conservé.** Mémoire de travail/templates, motif et vérification demeurent cohérents. La mention d'un ancien résumé est historiquement formulée ; elle réfute précisément le calcul universel que le dossier exclut. |
| `formation-des-habitudes-aux-echecs--angle-02` | vidéo | **Conservée.** Contexte, première action et volume de travail distincts. |
| `echecs-alphazero-stockfish--angle-02` | vidéo | **Correction visible requise.** Storyboard corrigé ; rendu par `grand_oral`. Détails ci-dessous. |
| `echecs-et-concentration--angle-02` | PDF | **Régénéré.** Le titre d'article imprimé page 2 est aligné sur « garder et retrouver le fil du calcul ». La question et les conseils restent les mêmes. |
| `formation-des-habitudes-aux-echecs--angle-03` | PDF | **Conservé.** Régularité/progression, interruption et intention de mise en œuvre restent exacts. Les mentions « article à venir » sont encore vraies à la date de revue, à réexaminer à la diffusion future. |
| `echecs-alphazero-stockfish--angle-03` | PDF | **Régénéré.** L'ancien complément affirmait une influence sur les ouvertures non démontrée. La fiche reprend désormais le passage courant et la séquence publiée illustrant la colonne g. |
| `echecs-et-memoire--angle-04` | vidéo | **Conservée.** Rappel, plan d'ouverture et limites de l'étude sur les textes sont toujours fidèles. |
| `echecs-et-concentration--angle-04` | vidéo | **Conservée.** Tâche définie, durée adaptable et critère observable ; pas de progression chronométrée validée inventée. |
| `echecs-et-memoire--angle-05` | PDF | **Conservé.** Limite du transfert lointain, absence de dépistage et objectifs locaux restent exacts. |
| `formation-des-habitudes-aux-echecs--angle-05` | vidéo | **Conservée.** Intention de mise en œuvre clairement distinguée d'un essai de gain Elo. |
| `echecs-alphazero-stockfish--angle-05` | vidéo | **Correction visible requise.** Storyboard corrigé ; rendu par `grand_oral`. Coexistence de l'évaluation classique et neuronale explicitée. |
| `echecs-et-concentration--angle-05` | PDF | **Régénéré.** Titre d'article imprimé actualisé ; les distinctions et la suite pédagogique restent valides. |
| `formation-des-habitudes-aux-echecs--angle-06` | PDF | **Conservé.** Démarrage/méthode, deux exemples et tableau d'observation correspondent au dossier final. |
| `echecs-alphazero-stockfish--angle-06` | PDF | **Conservé.** Examiner les défenses avant de copier un sacrifice reste la conclusion de l'article. |
| `echecs-et-memoire--angle-07` | vidéo | **Conservée.** Définition du chunk, reconnaissance familière et limites de Chase/Simon restent exactes, malgré une introduction reformulée dans l'article. |
| `echecs-et-concentration--angle-07` | vidéo | **Conservée.** La séquence jusqu'à 4…Dg5 est inchangée et légale ; le nouvel exercice prolonge son explication. |
| `echecs-et-memoire--angle-08` | PDF | **Conservé.** Positions aléatoires, protocole et refus des valeurs universelles restent cohérents. |
| `formation-des-habitudes-aux-echecs--angle-08` | vidéo | **Conservée.** Solution de repli, absence de dette et adaptation du contexte restent proposées sans promesse chiffrée. |
| `echecs-alphazero-stockfish--angle-08` | vidéo | **Conservée.** Choix d'ouvertures observés, fonctionnement réseau/recherche et preuve de variante restent distingués correctement. |
| `echecs-et-concentration--angle-08` | PDF | **Régénéré.** Titre d'article imprimé actualisé, sections sur continuité/souplesse et pauses conservées. |
| `formation-des-habitudes-aux-echecs--angle-09` | PDF | **Conservé.** Arrêt volontaire et place du plaisir correspondent au dossier final. |
| `echecs-alphazero-stockfish--angle-09` | PDF | **Régénéré.** La réponse sur Lc0 reste identique, mais le complément d'architecture contenait l'ancienne opposition erronée entre MCTS et recherche exhaustive. |
| `echecs-et-concentration--angle-10` | vidéo | **Conservée.** Bilan sur trois parties présenté comme une proposition sans garantie de classement. |

## Deux storyboards vidéo corrigés

Fichier modifié : `scripts/pinterest/video-storyboards.json`, uniquement les cartes `echecs-alphazero-stockfish--angle-02` et `echecs-alphazero-stockfish--angle-05`.

Les quatre textes de lecture reprennent désormais des phrases retrouvées littéralement dans l'article final, après suppression du balisage Markdown. Les champs `description` et `section` de ces deux cartes sont alignés sur les passages actuels. Couverture, fin, labels, rôles, identités et dates restent inchangés. Lors de la livraison textuelle à l’agent de rendu, les références SHA de source ont été conservées ; leur actualisation appartient au bundle des vrais médias validés.

- **Angle-02** : la version est « choisie pour cette comparaison » ; résultats 28/72/0 et détail des couleurs inchangés ; cadence d'une minute par coup ; impossibilité de répartir une réserve globale. L'affirmation non établie sur la réflexion pendant le temps adverse est retirée.
- **Angle-05** : NNUE par défaut en septembre 2020 ; évaluation neuronale et classique disponibles dans Stockfish 12 ; réseau entraîné sur les évaluations de positions ; mise à jour partielle sur CPU ; association à la recherche alpha-bêta.

Durées totales conservées : **62,833333 secondes** et **52,458333 secondes**. Le temps des quatre scènes de lecture est redistribué selon leur volume, avec un minimum de 7,5 secondes et la base de 2,8 mots/seconde du moteur existant. Les textes sont plus courts ; aucun nouveau contenu n'est ajouté pour remplir la durée.

Sources primaires déjà vérifiées dans le dossier éditorial : [prépublication AlphaZero de 2017](https://arxiv.org/html/1712.01815v1), [annonce NNUE officielle](https://stockfishchess.org/blog/2020/introducing-nnue-evaluation/) et [annonce Stockfish 12](https://stockfishchess.org/blog/2020/stockfish-12/).

Les quatre vidéos de concentration gardent un ancien `articleTitle` dans leurs données préparées. Ce champ n'est pas dessiné par `studio-template.html` : le titre visible et les scènes décrivent l'angle, et restent corrects. Si le parent souhaite aligner aussi cette métadonnée, il faut réconcilier le HTML embarqué et son empreinte ; ce n'est pas une correction du texte visible imposant un nouveau MP4. Aucune carte autre que les deux AlphaZero n'est modifiée ici.

## Production et vérification des sept PDF

Les 14 PDF originaux ont été lus par extraction complète. Leur empreinte binaire correspondait au manifeste avant intervention. La lecture a porté sur tout le contenu, y compris les paragraphes ajoutés automatiquement après l'angle, qui expliquent les défauts des fiches AlphaZero 03 et 09.

La régénération utilise **sans modification** les moteurs existants :

- `scripts/pinterest/media/render-pdf.py` : ReportLab, polices Studio et présentation existante ;
- `scripts/pinterest/media/render-pdf-previews.mjs` : pages rasterisées avec Poppler, couvertures JPEG en 1000 × 1500.

Un lot isolé de sept cartes a été préparé dans `/tmp/pinterest-dossiers-pdf-20261113`, puis ces deux moteurs ont été exécutés avec ce répertoire de travail. Aucun lot de 243 PDF n'a été lancé. Les passages suivent les règles de sélection du pipeline courant ; les titres orphelins terminaux sans paragraphe sont retirés du lot. Les espaces précédant la ponctuation française sont rendus insécables, après constat d'un point d'interrogation isolé en couverture.

Contrôles réalisés avant copie dans le candidat :

- 24 pages produites, toutes observées dans les planches de contrôle : aucun chevauchement, débordement ou glyphe manquant détecté ;
- présence de chaque paragraphe sélectionné, vérifiée par extraction après exclusion des en-têtes/pieds de page ;
- disparition des anciennes formulations problématiques et présence du titre actuel de concentration ;
- couvertures de 1000 × 1500, mêmes titres et mêmes identifiants ;
- nouveaux SHA calculés seulement après ces contrôles et après copie des fichiers réellement produits.

Le PDF principal AlphaZero compte six pages ; les six autres PDF refaits en comptent trois chacun. Les corps des articles ne sont pas modifiés par cette reprise Pinterest.

Les images de revue et les résultats détaillés restent dans `/tmp/pinterest-dossiers-pdf-20261113/work/pinterest-media/pdf-qa/` et `semantic-qa.json`. Ce contrôle ne prétend pas constituer une nouvelle validation visuelle des sept anciens PDF conservés ni des onze anciens MP4 : pour ceux-ci, la décision porte sur les textes relus et les octets canoniques identifiés.

## Assemblage du manifeste par le parent

`pinterest-media-manifest-patch.json` contient **25 opérations par identifiant**. `expectedBefore` vise les valeurs de l'entrée actuelle du manifeste, non les octets du PDF corrigé déjà copié.

- Sept entrées comportent les nouveaux `bytes`, `sha256`, `coverHash` et `sourceHash` des PDF réellement corrigés.
- Dix-huit entrées ne changent que `sourceHash` après revue sémantique. Pour ces fichiers conservés, les hashes du média et de la couverture ont été recontrôlés. Pour les onze vidéos, le HTML correspond également au storyboard et au moteur courant.
- Les deux vidéos AlphaZero corrigées sont exclues : le parent doit utiliser les résultats et empreintes fournis par `grand_oral` après son rendu et la QA finale.

`pinterest-media-review.json` liste les 27 décisions et empreintes constatées. La réconciliation ne doit ni supprimer les entrées, ni neutraliser le contrôle de cohérence, ni remplacer aveuglément les SHA de médias dont le texte visible devait changer.

Les dates de diffusion préparées vont bien au-delà de la date de revue. Les mentions temporelles, notamment « article à venir » dans habitudes angle-03, restent à réexaminer lors d'une future actualisation de campagne ; elles n'ont pas été transformées ici en fausse confirmation de publication ou de programmation Pinterest.

## Clôture de la coordination vidéo

Après la revue textuelle, `grand_oral` a livré les deux vidéos corrigées dans `work/pinterest-canvas-corrected/integration.json` du candidat. Son bundle comprend les cartes avec le SHA actuel, les entrées de manifeste, les estampilles de rendu et les fichiers contrôlés. Il rapporte H.264 1080 × 1920 à 24 images/seconde, AAC 48 kHz stéréo, −17,8 LUFS et aucun débordement sur 2 767 images. Ces vérifications de rendu sont celles de l’agent chargé des vidéos ; la présente tâche a validé les textes et les PDF. Le parent assemble ce bundle avec les 25 opérations séparées, puis effectue les contrôles globaux.
