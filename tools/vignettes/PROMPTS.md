# Bibliothèque de prompts — vignettes Midjourney

Ce fichier contient la **série de test validée** (3 articles). Les 80 prompts restants sont
répartis par rubrique, un fichier par accent chromatique :

| Fichier | Rubrique | Accent | Articles |
|---|---|---|---|
| `prompts-science.md` | Science | `#5b9fd4` dusty cornflower blue | 21 |
| `prompts-esprit.md` | Esprit | `#f0a050` warm amber orange | 26 |
| `prompts-societe.md` | Société | `#5cc4b0` muted teal green | 15 |
| `prompts-grand-oral.md` | Grand oral | `#8b5cf6` soft muted violet | 18 |

Un bloc par article. Cf. `tools/vignettes/VIGNETTE-SPEC.md` pour la charte.

> Les métaphores ont été contrôlées **entre** rubriques et non seulement à l'intérieur de
> chacune : cinq doublons de motif ont été réécrits le 17/08/2026 (deux balances à plateaux
> en trop, un escalier inégal dupliqué, une chaise vide dupliquée, un motif d'ondulations
> qui entrait en concurrence avec la vignette `echecs-et-dopamine` déjà en ligne). Les blocs
> concernés portent une note. Refaire ce contrôle croisé si de nouveaux prompts sont ajoutés.

Ajouter le flag de version Midjourney courant à la fin de chaque prompt, le même pour
toute la série. Dès qu'une vignette fait consensus, récupérer son `--sref` et l'ajouter
partout : c'est le principal levier de cohérence entre 83 images.

---

## Série de test (3 articles, 3 rubriques)

### 1. `echecs-et-dopamine` — Science, bleu `#5b9fd4`

*Dopamine et échecs : la neurochimie du jeu.* Idée centrale : la dopamine ne code pas le
plaisir mais **l'anticipation** et l'erreur de prédiction (Schultz, 1997). Le pic
neurochimique a lieu **avant** que le coup soit joué. La métaphore est donc l'instant
suspendu, pas la victoire.

```
a silhouetted hand suspended in mid-air just above a single chess piece, faint concentric
pulse rings radiating upward from the piece, the frozen instant before a decision,
editorial conceptual illustration for a science magazine, side view, low camera angle,
flat vector shapes, clean contours, no gradients, subtle silkscreen grain,
limited palette: warm cream paper background, deep charcoal ink, dusty cornflower blue dominant,
generous negative space, calm and precise
--ar 3:2 --style raw --no text, letters, words, numbers, typography, watermark, signature, logo, frame, border, ui, chart
```

`alt` : `Une main en suspension au-dessus d'une pièce d'échecs, entourée d'ondes concentriques.`

---

### 2. `echecs-et-flow` — Esprit, ambre `#f0a050`

*Échecs et état de flux.* Idée centrale : absorption totale, disparition de la conscience
de soi, déformation du temps. Volontairement **sans échiquier** — le sujet est l'état
mental, pas le jeu, et cela évite un troisième damier dans la série de test.

```
a solitary seated figure seen from behind, dissolving at the edges into a flat empty void,
a single warm corridor of light opening straight ahead, total absorption,
editorial conceptual illustration for a science magazine, centered symmetrical composition,
flat vector shapes, clean contours, no gradients, subtle silkscreen grain,
limited palette: warm cream paper background, deep charcoal ink, warm amber orange dominant,
generous negative space, calm and precise
--ar 3:2 --style raw --no text, letters, words, numbers, typography, watermark, signature, logo, frame, border, ui, chart, face
```

`alt` : `Une silhouette assise de dos, absorbée, face à un couloir de lumière.`

> `face` est ajouté au `--no` : la figure est vue de dos, on ne veut aucun visage
> rapporté sur les côtés.

**⚠ Génération du 17/08/2026 à refaire.** L'image obtenue est magnifique mais son accent
mesuré est `#427286`, un bleu-sarcelle : c'est l'accent Science, pas l'ambre Esprit. Elle
est en ligne faute de mieux, mais elle casse le codage par rubrique. Prompt corrigé, qui
force l'ambre en le nommant trois fois et en excluant explicitement le bleu :

```
a solitary seated figure seen from behind, dissolving at the edges into a flat empty void,
a single glowing amber corridor of warm orange light opening straight ahead, total absorption,
editorial conceptual illustration for a science magazine, centered symmetrical composition,
flat vector shapes, clean contours, no gradients, subtle silkscreen grain,
strictly two-colour palette: warm cream paper background and saturated warm amber orange,
deep charcoal ink for the figure only, amber orange dominant across the whole image,
generous negative space, calm and precise
--ar 3:2 --style raw --no text, letters, words, numbers, typography, watermark, signature, logo, frame, border, ui, chart, face, blue, teal, cyan, cold tones
```

---

### 3. `echecs-et-la-triche` — Société, vert d'eau `#5cc4b0`

*La triche aux échecs : ce que l'affaire Niemann a vraiment révélé.* Idée centrale : la
preuve est une **inférence probabiliste**, pas un biomarqueur ; on ne distingue pas à
l'œil le joueur assisté du joueur fort. D'où le décalage entre l'objet et son ombre.

```
a plain wooden pawn casting a long shadow that is rigidly geometric and machine-like,
mismatched between object and shadow, quiet unease,
editorial conceptual illustration for a science magazine, top-down view, raking light,
flat vector shapes, clean contours, no gradients, subtle silkscreen grain,
limited palette: warm cream paper background, deep charcoal ink, muted teal green dominant,
generous negative space, calm and precise
--ar 3:2 --style raw --no text, letters, words, numbers, typography, watermark, signature, logo, frame, border, ui, chart
```

`alt` : `Un pion projetant une ombre longue à la géométrie rigide, dissemblable de l'objet.`
