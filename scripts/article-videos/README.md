# Vidéos de résumé des articles

Le storyboard canonique est `scripts/article-videos/storyboards.json`. Chaque
entrée décrit le sujet entier d'un article français : introduction, idées,
limite et conclusion. Le corps de l'article n'est pas modifié. Les textes sont
écrits et relus avant le rendu ; ce moteur n'invente pas de résumé.

## Production locale

```sh
node scripts/article-videos/prepare.mjs --include-future
node scripts/article-videos/review.mjs
node scripts/article-videos/render.mjs --include-future
```

Le stockage canonique est `media/article-videos/`, hors de `public/`. Les options
`--include-future` permettent de préparer aussi les articles programmés, mais
sont refusées si la sortie est située dans `public/`. Sans cette option, seuls
les articles dont la date est passée sont traités. `noindex` est conservé comme
information SEO et ne masque pas une page publiée ; les brouillons sont exclus.

`--input=fichier.json` permet de préparer un lot éditorial séparé ; plusieurs
chemins peuvent être séparés par des virgules. `--out=dossier`, `--id=slug` et
`--limit=1` servent aux aperçus. `review.mjs --frames` conserve les images de
contrôle en plus des planches. Le plan du corpus, y compris les articles futurs,
est écrit dans `work/article-videos/plan.json`.

Le rendu nécessite Chrome, ffmpeg/ffprobe, `flock` (util-linux) et Python avec NumPy. Les variables
`ARTICLE_VIDEO_CHROME` et `ARTICLE_VIDEO_PYTHON` sélectionnent les exécutables.
Un seul encodeur travaille à la fois par sortie. Un verrou système empêche les
doublons et se libère après un arrêt brutal ; son fichier `.render.lock` reste
en place et ne doit jamais être supprimé ou renommé. Sa présence seule ne
signale pas un rendu actif. Les sorties partielles restent dans `work/`. Une déconnexion du
navigateur entraîne une seule nouvelle tentative avec un navigateur neuf.
La fermeture du navigateur est bornée pour ne pas bloquer la chaîne.

Les fichiers déjà valides sont réutilisés seulement si leurs empreintes, les
sources HTML, les articles, les polices et le code de production correspondent.
Une empreinte distincte du générateur HTML impose une nouvelle préparation après
un changement de `studio.html`, `prepare.mjs` ou `common.mjs` : un ancien HTML ne
peut pas être encodé puis validé comme s'il venait du générateur actuel.
Le rendu contrôle les débordements à chaque image, puis H.264, 1920 × 1080,
24 images/s, AAC stéréo 48 kHz, synchronisation, niveau sonore et silence anormal.
Les musiques et effets sont synthétisés localement, sans voix ni échantillon
externe. L'animation HTML utilise le son du MP4 quand il existe ; avant export,
son lecteur peut afficher un aperçu muet.

Douze dispositions servent des fonctions différentes : comparaison, étapes,
carte de concepts, question, contexte, conclusion, etc. Leur combinaison et
leur variante spatiale sont déterministes et uniques dans un lot. Le logo SVG
original remplace tout glyphe de pièce. Les ponctuations françaises restent
liées aux mots voisins. Les illustrations existantes sont conservées entières ;
les crédits et licences des photographies figurent sous leur image et leur
source reste liée dans le texte de l'animation.

## Publication à la date de l'article

```sh
node scripts/article-videos/materialize.mjs
node scripts/article-videos/verify.mjs
```

Le build valide le manifeste canonique puis copie uniquement les MP4, posters
et HTML des articles publiés vers `public/article-videos/`. Le manifeste public
contient ce même sous-ensemble. Les fichiers futurs ne sont pas copiés, même si
leurs rendus sont terminés. Aucun navigateur ni encodeur n'est requis sur le VPS.

La date provient de `--at`, de `SITE_BUILD_DATE`, puis de l'horloge du processus.
Un retour à une date antérieure retire seulement les dérivés listés dans le
manifeste public précédent. Les fichiers inconnus, les polices et les anciennes
galeries restent intacts. Une présence inattendue de média futur dans `public/`
fait échouer la validation au lieu de supprimer un fichier inconnu.

`validateArticleVideos(root, options)` et `validatePublicArticleVideos(root,
options)` sont exportées par `verify.mjs`. Le manifeste vide est valide pendant
la préparation. Une entrée déclarée mais manquante, modifiée, obsolète ou issue
d'un résumé différent fait échouer la construction.

```sh
node --test scripts/article-videos/materialize.test.mjs scripts/article-videos/invalidation.test.mjs scripts/article-videos/lock.test.mjs
```

Ces tests vérifient le passage exact à la date de publication, les pages
`noindex`, le retrait des seuls dérivés connus et le refus de fichiers altérés.
Ils utilisent des octets sentinelles pour tester la publication ; les vrais
codecs et la qualité sonore sont contrôlés par le rendu MP4. Le test des polices
vérifie qu'une nouvelle préparation change la signature du rendu et qu'une
police modifiée sans préparation interdit la reprise d'un ancien MP4.
Les tests vérifient aussi la concordance exacte de la transcription publiée,
l'invalidation du générateur et l'exclusion mutuelle de douze reprises simultanées
sur un verrou périmé, sans remplacer son fichier.
