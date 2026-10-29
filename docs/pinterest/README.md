# Campagne Pinterest : 730 contenus en français

La campagne comprend **244 publications en image, 243 vidéos MP4 et 243 PDF**.
Cette répartition équilibrée traduit la demande « 30/30/30 ». Les 72 articles
français du stock servent de base ; chacun est représenté dans les trois formats.
Les 730 identifiants et dates restent ceux du programme existant. Les accroches des vidéos sont adaptées à leurs séquences. Les trois
épingles d’initialisation du 27 octobre restent des images et gardent leurs liens.

## Calendrier et canaux

- Départ : 27 octobre 2026, avec un article par tableau.
- Reprise : 3 novembre 2026 ; mardi, vendredi et dimanche à 10 h en Guadeloupe.
- Fin des 730 créneaux : **24 juin 2031**. Les nouveaux articles sont en supplément.
- 72 créneaux initiaux dans `archive.json`, puis 658 angles dans `variants.json`.
- Les formats sont figés dans `formats.json`, pas réattribués à chaque construction.

Le site ne peut pas confirmer une publication effective sur Pinterest. Son statut
`/pinterest/status.json` sépare le nombre de contenus préparés, les éléments exposés
aux flux et les vidéos dont l’importation reste à effectuer dans le compte.

### Images et PDF : trois flux RSS déjà connectés

| Flux | Tableau confirmé par l’utilisateur |
| --- | --- |
| `https://blogdungaucher.com/pinterest/science.xml` | Science des échecs |
| `https://blogdungaucher.com/pinterest/esprit.xml` | Psychologie et esprit du joueur d’échecs |
| `https://blogdungaucher.com/pinterest/societe.xml` | Les échecs dans la société |

Ces flux contiennent **487 créneaux de la campagne** : 244 images et 243 couvertures
de PDF. Un PDF est présenté par une image JPEG verticale ; le lien de l’épingle mène
au PDF réellement téléchargeable. Chaque fiche contient un lien vers son article
complet. Le fichier PDF n’est pas présenté comme un format d’épingle natif.

Les entrées apparaissent uniquement à leur date et restent 14 jours dans les flux.
Les identifiants restent stables après une reconstruction. Les cartes déjà libérées
restent disponibles tant que leur article est public. Les nouveaux articles
admissibles continuent à recevoir une épingle image, hors des 730 créneaux.

### Vidéos : importation Pinterest distincte

Les **243 vidéos ne sont pas envoyées dans les flux RSS d’images**. Elles sont
exportées en MP4 H.264, 1080 × 1920, 24 images/s, avec une piste AAC stéréo 48 kHz : musique
instrumentale originale et effets sonores, sans voix off. Le texte reste lisible sans son.
Les séquences durent environ 45 à 74 secondes selon le temps de lecture nécessaire. Les sources sont de véritables pages HTML/CSS/JavaScript
avec une ligne de temps déterministe et des transitions d’opacité et de mouvement.

Deux fichiers d’importation sont fournis, avec les trois noms de tableaux confirmés :

- `/pinterest-media/imports/videos-1.csv` : 200 vidéos ;
- `/pinterest-media/imports/videos-2.csv` : 43 vidéos.

Ils contiennent titre, URL publique du MP4, tableau, couverture au même format,
description, lien vers l’article, date UTC et mots-clés. Dans Pinterest sur ordinateur :
**Paramètres → Importer du contenu → Importer un fichier CSV**. Attendre le résultat
de l’importation et vérifier les dates et tableaux dans le compte. Un fichier CSV
préparé n’est pas une preuve de programmation acceptée par Pinterest. Vérifier les
dates avant un import tardif et ne pas réimporter les vidéos déjà créées.

Références officielles :
- https://help.pinterest.com/en/business/article/auto-publish-pins-from-your-rss-feed
- https://help.pinterest.com/en/business/article/bulk-upload-video-pins
- https://help.pinterest.com/en/article/review-pin-specs

## Style et contenu

Vidéos et PDF partagent le même style néo-minimaliste : fond clair, encre sombre,
typographie commune, grilles aérées et formes géométriques simples. Science conserve
le bleu, Esprit l’ambre et Société le vert d’eau. Les couvertures existantes du blog
restent intactes ; les 244 images réutilisent les compositions éditoriales existantes.

Les vidéos développent une accroche et quatre étapes de lecture, puis un accès au dossier.
Leurs scénarios sont conservés dans `video-storyboards.json` ; les textes proviennent
des passages du programme, complétés par des reformulations éditoriales sourcées.
Les paragraphes sont conservés avec leurs précisions pour ne pas isoler un chiffre de
sa limite. L’exemple sur le biais de confirmation, validé par l’utilisateur, conserve
son échiquier animé et ses coups légaux. Les illustrations existantes restent entières.
Le cavalier décoratif et les cavaliers de l'échiquier utilisent le logo SVG du site.
Les autres pièces sont des dessins vectoriels : aucun émoji ni caractère de police
n'est utilisé pour représenter une pièce. Les SVG sont intégrés aux sources HTML,
et leur modification invalide l'empreinte du rendu vidéo.
Trois anciennes vignettes contenant du texte sont remplacées dans ces vidéos uniquement
par des motifs graphiques ; les couvertures du blog ne sont pas modifiées. Les PDF
reprennent le passage visé avec un contexte de lecture, les tableaux, formules et
positions d’échecs présents dans cet extrait, et un lien vers le dossier complet.
Ce sont des fiches thématiques, pas des copies intégrales de tous les articles.
La musique et les bruitages sont synthétisés localement, sans enregistrement vocal
ni échantillon externe. Le générateur varie la tonalité et le tempo tout en gardant la même ambiance. Les effets suivent les changements de scène.
La piste est normalisée autour de −18 LUFS, puis intégrée dans chaque MP4.
La page HTML lit la piste du MP4 pour conserver la synchronisation. Aucune voix off
n’est ajoutée. Les vidéos ne comportent aucune promesse
scientifique créée pour la campagne.

## Sources et maintenance

`media-manifest.json` enregistre les empreintes des PDF, MP4, couvertures et articles
sources, ainsi que celles des animations HTML. Le build les vérifie.
Les vidéos exigent désormais une piste AAC stéréo, une durée cohérente et le style sonore v2. Une modification d’article exige donc de revoir et
régénérer les médias concernés avant déploiement ; cela évite de distribuer une
ancienne affirmation après une correction éditoriale. Les sources des variantes
sont aussi contrôlées par titre de section ou question de FAQ.

Les fichiers préfabriqués sont versionnés dans `public/pinterest-media/`. Le VPS ne
lance ni navigateur ni encodeur vidéo lors d’un déploiement ordinaire. Les dépendances
d’édition sont nécessaires uniquement pour régénérer les médias sur le poste de travail.

Pour préparer les données puis les sources HTML :

```sh
npm run pinterest:media:data
npm run pinterest:media:storyboards
npm run pinterest:media:html
npm run pinterest:media:review
```

Pour les vidéos et les formules, installer Chrome avec Puppeteer et disposer de
FFmpeg/ffprobe. `PINTEREST_CHROME` permet de sélectionner un autre exécutable Chrome.
`PINTEREST_VIDEO_WORKERS` règle le nombre de rendus concurrents (3 par défaut).
`PINTEREST_PYTHON` sélectionne un Python disposant de NumPy pour la musique.
Le rendu reprend les fichiers déjà validés uniquement si leurs animations, illustrations
et générateurs correspondent encore à l’empreinte enregistrée. Le suivi local est
`work/pinterest-media/render-progress.json`. Un échec ne valide jamais un ancien MP4 silencieux.

```sh
npx puppeteer browsers install chrome
npm run pinterest:media:video
npm run pinterest:media:math
```

Pour les PDF, Python requiert `reportlab` et `pypdf`, et les aperçus requièrent Poppler
(`pdftoppm`). Les polices et leur licence sont conservées dans les ressources communes.

```sh
npm run pinterest:media:pdf
npm run pinterest:media:verify
node scripts/pinterest/media/verify-audio.mjs
npm run pinterest:campaign
```

La dernière commande exporte une galerie, un calendrier, les 730 fichiers finaux,
les sources HTML et les deux CSV dans `work/pinterest-preview-campaign-mixed-v2/`.
Un dossier existant est conservé : fournir `--out=nouveau-dossier` directement au script d’export pour créer une nouvelle version. Ce dossier est séparé des flux de production. Les fichiers temporaires et les
rendus de contrôle restent dans `work/pinterest-media/` et sont ignorés par Git.

## Contrôles

```sh
npm test
npm run check
npm run build
npm run check:pinterest-preview
npm run check:pinterest-variants
```

Les simulations couvrent les premiers PDF et les variantes de 2027. Les tests
empêchent de compter une vidéo comme une publication RSS, vérifient la répartition
244/243/243 et préservent les trois éléments déjà exposés. Le calendrier global
reste plafonné à trois créneaux par semaine. Les erreurs d’importation Pinterest
restent visibles dans le compte et ne sont pas déductibles du seul statut RSS.
