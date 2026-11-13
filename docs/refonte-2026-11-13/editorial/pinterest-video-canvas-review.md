# Correction des deux vidéos Pinterest AlphaZero

Date : 13 novembre 2026. Candidat : `/tmp/blog-refonte-publication`.

Les textes des cartes `echecs-alphazero-stockfish--angle-02` et `echecs-alphazero-stockfish--angle-05` ont été validés par le chantier éditorial avant génération. Le premier décrit Stockfish 8 comme la version choisie pour la comparaison de 2017 et explique la cadence sans déduction non étayée sur le pondering. Le second précise que NNUE est utilisé par défaut dans Stockfish 12, où l’évaluation classique reste disponible. Les phrases de lecture sont reprises de l’article final.

Empreinte des deux cartes approuvées, dans cet ordre : `455e6a711e662590aff1ba547ebc026dda34952b2da814328f54d09a7ae3c4c0`. Les durées totales ont été conservées ; la répartition entre les scènes de lecture a été adaptée par l’agent éditorial.

## Méthode

Le rendu a utilisé le script Canvas2D existant, inchangé, avec le moteur natif `@napi-rs/canvas` 1.1.1 installé seulement dans `/tmp/pinterest-canvas-runtime`. Les fichiers de polices Studio, les couleurs, les mises en page, l’illustration, le filigrane et le logo SVG dans ses emplacements existants sont conservés. Les mouvements, les entrées progressives et les transitions du studio sont exécutés image par image. Aucun navigateur, Puppeteer ou Playwright n’a été utilisé.

Le compositeur instrumental et ses paramètres d’origine ont produit les pistes sonores, normalisées puis encodées en AAC. Ce sont de nouveaux encodages vidéo, pas des fichiers anciens dont seul le hash aurait été changé. Leur backend réel est consigné dans la provenance.

## Vérifications

| Vidéo | Images contrôlées | Durée vidéo/conteneur | Son intégré | Pic réel | Résultat |
| --- | ---: | ---: | ---: | ---: | --- |
| angle-02 | 1 508 | 62,850667 s | −17,8 LUFS | −3,0 dBFS | Aucun débordement, aucun silence prolongé |
| angle-05 | 1 259 | 52,479 s | −17,8 LUFS | −3,3 dBFS | Aucun débordement, aucun silence prolongé |

Les deux fichiers sont H.264, 1080 × 1920, 24 images/s, avec AAC stéréo 48 kHz. L’écart entre les durées audio et vidéo respecte le seuil existant de 0,12 s. La légère différence entre durée du storyboard et durée du conteneur provient de l’encapsulation audio.

Les captures préparatoires des six scènes ont été inspectées. Neuf images **décodées de chaque MP4 final** ont également été inspectées : à 0,12 s, 0,7 s, 5,88 s, 6,12 s, 7,5 s, puis dans chacune des scènes suivantes. Elles montrent l’entrée du titre, l’apparition de l’image, la sortie de couverture, l’entrée de la lecture, les textes corrigés, le motif animé avec le logo et la conclusion. Les cartes ne débordent pas et les transitions ne coupent pas le texte. La validation sonore porte sur les pistes, leur synchronisation et les mesures ; aucune écoute humaine intégrale n’est revendiquée.

Quatre tests ciblés réussis : déterminisme d’une image et activité de l’ouverture, passage des instants de chaque scène sans débordement, refus d’un storyboard/temps divergent, refus des images distantes et des API de document non prévues, absence de dépendance de production implicite ou de navigateur de secours.

## Bundle d’intégration

Le fichier `work/pinterest-canvas-corrected/integration.json` contient, pour chaque identifiant : la carte finale, l’entrée de manifeste, le stamp, les chemins source/destination avec leurs SHA256 et le chemin de la planche d’images décodées. L’agent principal assemble ces deux entrées avec les corrections PDF.

Intégration confirmée par l’agent principal : dans le manifeste final, `video.audio` conserve strictement `codec`, `channels` et `sampleRate`. Les mesures `integratedLufs`, `truePeakDb` et `prolongedSilence` sont regroupées sous `canvasRender.audioQuality`. Cette organisation conserve le contrat existant du manifeste tout en rendant la validation sonore consultable.

Les SHA256 des MP4 sont :

- angle-02 : `43c77f8fcf773b8979daf5dd2362b21bb2b1247b18a176c15fcdc6fe29b15404`.
- angle-05 : `3be8afc2bd8e25b2936cc8b8ca176918930e797853644e643ccdd7ccd0eb0f86`.

Après l’encodage effectif, la référence `sourceHash` de chaque carte a été alignée sur l’article actuel dans **le bundle seulement**. C’est le seul champ modifié après rendu. Le script complet hors déclaration `card` et tous les autres champs de la carte ont été comparés et sont strictement identiques ; leurs empreintes sont jointes à `metadataReview`. L’HTML effectivement utilisé pour le rendu est conservé sous `rendered-animation.html`, l’HTML final sous `final-animation.html`. Les hashes des MP4 et leurs dates de rendu ne changent pas lors de cet alignement de référence.

À la livraison du bundle, aucun manifeste global, fichier public ou carte canonique n’a été modifié par l’agent chargé du rendu. Aucun email, publication sociale ou envoi externe n’a été effectué. Le pipeline navigateur historique et ses contrôles restent inchangés.
