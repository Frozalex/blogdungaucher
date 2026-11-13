# Rendu Canvas natif des animations Pinterest

`render-canvas.mjs` est un outil explicite de préparation locale. Il exécute le code Canvas2D de l’animation existante avec `@napi-rs/canvas`, puis transmet chaque image à FFmpeg. Il ne lance aucun navigateur, ne remplace pas le pipeline existant et ne publie aucun fichier. Le prototype approuvé distinct n’est pas pris en charge : l’outil le refuse.

Installer le moteur dans un dossier temporaire, hors des dépendances du site :

```sh
npm install --prefix /tmp/pinterest-canvas-runtime \
  --registry=https://registry.npmjs.org --ignore-scripts --no-audit --no-fund \
  @napi-rs/canvas@1.1.1
```

La bibliothèque documente son moteur Skia et son API Canvas dans son [dépôt officiel](https://github.com/Brooooooklyn/canvas). Version utilisée ici : 1.1.1. Aucun pixel à pixel identique à Chrome n’est promis : les polices et le code de composition sont conservés, puis le résultat est contrôlé.

Avant tout encodage, faire valider les cartes sélectionnées et calculer le SHA256 de `JSON.stringify(cards)`, dans l’ordre explicite des identifiants. Cet ordre et l’empreinte sont obligatoires. Un changement de texte, de durée ou de métadonnée exige donc une nouvelle sélection approuvée.

```sh
/usr/bin/node scripts/pinterest/media/render-canvas.mjs \
  --ids=echecs-alphazero-stockfish--angle-02,echecs-alphazero-stockfish--angle-05 \
  --canvas-module=/tmp/pinterest-canvas-runtime/node_modules/@napi-rs/canvas \
  --out=work/pinterest-canvas-review \
  --approved-storyboards-sha256=EMPREINTE_REELLE \
  --frames-only
```

Omettre `--frames-only` pour générer les MP4 dans un **nouveau dossier**. L’outil refuse un dossier de carte existant et une sortie placée dans `public/`. Il ne modifie ni les storyboards, ni les manifestes, ni les vidéos publiées. Chaque candidat comprend HTML, captures à plusieurs instants, couverture, vidéo, son AAC et rapport JSON. Le WAV temporaire est supprimé après encodage réussi.

Les images proviennent seulement des SVG embarqués et de l’illustration locale sélectionnée. Les deux polices Studio sont chargées depuis leurs fichiers existants. Les éléments de formulaire/lecteur sont des objets minimaux ; aucun moteur HTML/CSS, audio réseau ou navigateur n’intervient. Ce contexte exécute du code de dépôt de confiance : il ne doit pas servir à exécuter des pages ou scripts arbitraires.

Le rendu conserve les durées, l’animation des éléments, les entrées/sorties de scène et les paramètres du compositeur sonore d’origine. Il contrôle le débordement textuel à chaque image, le format H.264 1080 × 1920 à 24 images/s, l’AAC stéréo 48 kHz, la synchronisation, le niveau sonore et les silences prolongés. La provenance contient la version du backend, l’empreinte de son code, les polices, les images, l’HTML et le storyboard. `legacyCompatibilitySourceHash` reprend seulement la formule d’empreinte d’entrée attendue par le contrôleur historique ; ce champ ne prétend pas que Chrome a exécuté le rendu.

Les captures doivent être relues, y compris l’ouverture et les transitions. Pour publier, assembler les fichiers vérifiés et leurs entrées de manifeste/stamps en préservant cette provenance. Une simple réussite technique ne remplace pas la validation éditoriale et visuelle. Le helper ne transforme pas les mesures audio en affirmation d’écoute humaine.

Le rapport de candidat contient les mesures audio avec ses données vidéo. Lors de l’assemblage du manifeste existant, conserver seulement `codec`, `channels` et `sampleRate` dans `video.audio`, et placer les trois mesures de qualité dans `canvasRender.audioQuality` pour respecter le contrat strict historique.

Tests ciblés :

```sh
PINTEREST_CANVAS_MODULE=/tmp/pinterest-canvas-runtime/node_modules/@napi-rs/canvas \
  /usr/bin/node scripts/pinterest/media/canvas-runtime.test.mjs
```

Sans ce module temporaire explicite, les trois tests natifs sont signalés comme non exécutés ; le test de refus d’une dépendance implicite reste actif. Le module n’est pas ajouté à `package.json`.
