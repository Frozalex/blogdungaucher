# Réconcilier des métadonnées après une revue éditoriale

Cette opération s’applique uniquement lorsqu’une revue explicite conclut que les scènes existantes restent exactes après une modification d’article. Elle ne produit pas une nouvelle validation visuelle ou sonore et ne prétend pas réencoder les vidéos.

```sh
/usr/bin/node scripts/article-videos/reconcile-metadata.mjs \
  --reviewed-slugs=echecs-et-memoire,echecs-et-concentration,analyser-ses-parties,formation-des-habitudes-aux-echecs,echecs-alphazero-stockfish \
  --review-report=docs/refonte-2026-11-13/editorial/video-summary-review.md
```

Par défaut, la commande lit les entrées et affiche le plan, sans écrire. Ajouter `--apply` applique ce même contrôle puis les modifications sous le verrou système existant du moteur vidéo. Les fichiers publics sont laissés au processus habituel de matérialisation. Aucun MP4 ou JPG n’est lu ou réécrit par le helper ; leur présence, leur taille et leur stabilité pendant l’opération sont contrôlées. Lancer ensuite les validations existantes, qui vérifient les empreintes des fichiers binaires :

```sh
/usr/bin/node scripts/article-videos/verify.mjs --out=media/article-videos
/usr/bin/node scripts/article-videos/materialize.mjs
/usr/bin/node scripts/article-videos/verify.mjs
```

Le rapport doit être présent dans le dépôt et contenir un tableau avec une ligne par slug explicitement sélectionné :

```text
| `slug` | `SHA256 ancienne source` | `SHA256 nouvelle source relue` |
```

Ces empreintes doivent contenir les 64 caractères hexadécimaux réels. Le rapport constitue la preuve éditoriale déclarée ; l’outil ne remplace pas la lecture des articles et ne déduit pas leur équivalence sémantique à partir d’un hash.

## Contrôles et périmètre

Le helper compare le résumé canonique ancien, la carte embarquée dans le HTML, la carte préparée, le manifeste et l’HTML reconstruit exactement par le générateur courant. Il vérifie les anciennes empreintes et la signature `sha(pipelineHash + html)`. Il refuse un ancien pipeline, un modèle HTML modifié, une police, un logo ou une illustration différents. Le contrat permettant de traiter le titre comme métadonnée est lié à l’empreinte exacte de `studio.html` : une évolution du studio exige une revue du helper, sans option permettant de passer outre.

Il reconstruit ensuite la carte à partir de l’article actuel et compare tous ses champs en excluant uniquement `sourceSha256`, `title` et `summarySha256`. Les textes de scènes, intertitres sources, dispositions, variantes, durées, dates de publication, couleurs, graines, polices, images et champs inconnus restent protégés. La signature de composition et les variantes déjà choisies pour l’ensemble du corpus sont conservées.

Seules les métadonnées autorisées des résumés/cartes sont actualisées, ainsi que leurs dérivés : HTML du lecteur (titre du document, nom accessible du canvas, carte embarquée), titre de la galerie, empreinte HTML et signature du manifeste. La formule du hash de résumé reste `sha(JSON.stringify(summary))`. La formule de signature reste `sha(pipelineHash + html)` et ne hache pas une chaîne de digest à la place du HTML.

Les empreintes vidéo/poster, les mesures audio, les données techniques et `renderedAt` sont préservés. Une entrée `metadataReview` ajoute les anciennes/nouvelles références source/résumé/HTML/signature, l’empreinte du rapport, les empreintes identiques des entrées visuelles et les références média conservées. La nouvelle signature décrit la compatibilité des métadonnées avec le HTML courant ; elle ne signifie pas qu’un nouvel encodage a été effectué. L’ancienne signature reste dans la preuve de revue.

Tous les contrôles précèdent la première écriture. Les entrées sont relues après l’acquisition du verrou et une modification concurrente invalide le plan. Les remplacements sont atomiques par fichier, avec restauration des fichiers déjà écrits si une écriture échoue. Ce n’est pas une transaction de système de fichiers : ne pas lancer simultanément un checkout ou une préparation dans ces répertoires. Les caches de rendu ne sont pas modifiés ; un futur lancement explicite de `render.mjs` peut donc décider de réencoder.

## Validation du 13 novembre 2026

- Sept tests isolés réussis : compatibilité avec une source auparavant signée, formules exactes des hashes, conservation des binaires et date, refus des modifications visuelles et de ressources, rapport/source/canon obsolètes, ancien HTML ou signature incohérents, changements entre plan et application.
- Les fixtures utilisent de petits octets sentinelles, jamais les films du corpus. Le vérificateur existant accepte les fixtures après réconciliation ; cela teste la cohérence des métadonnées, pas un encodage réel.
- Le plan en lecture seule des cinq vrais articles a réussi. Les cinq empreintes visuelles avant/après sont identiques. Seul le titre de concentration change ; les 30 scènes restent inchangées.
- Aucune mutation de `media/`, du canon ou des fichiers publics réels n’a été effectuée par l’auteur du helper. L’application est laissée à l’agent principal.
- Dans le contexte d’exécution restreint, les sous-processus Node du verrou sortaient sans leur échange de confirmation ; les tests ont réussi avec l’exécution autorisant ces sous-processus, sans modification ni contournement du verrou existant.

Commande des tests : `/usr/bin/node scripts/article-videos/reconcile-metadata.test.mjs`.
