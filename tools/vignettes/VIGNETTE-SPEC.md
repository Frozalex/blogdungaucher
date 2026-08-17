# Spec — vignettes d'articles « Blog d'un Gaucher » (Midjourney)

Objectif : doter chaque article d'une **vignette de couverture** unique, générée avec
Midjourney puis post-traitée. La vignette est l'image affichée dans la carte du portail
(`ArticleCard`), en tête d'article, et dérivée en image de partage (OG / Pinterest).

Complément de `tools/schema/SCHEMA-SPEC.md`, qui couvre les **schémas explicatifs
insérés dans le corps** de l'article. Les deux systèmes partagent la même famille
chromatique mais n'ont pas le même rôle : le schéma **explique**, la vignette **attire**.

## Règle d'or

- 1 vignette = **1 métaphore visuelle** tirée du propos de l'article, pas une illustration
  générique d'échiquier. « Échecs et sommeil » ≠ un échiquier de plus.
- **Aucun texte dans l'image.** Le titre est déjà rendu en HTML sous la vignette dans la
  carte. C'est non négociable : le site sert FR / EN / PT-BR (+ NL au 01/09/2026) avec la
  **même** image ; tout texte incrusté rendrait les versions traduites incohérentes.
  Midjourney rend par ailleurs très mal le texte, a fortiori accentué.
- **L'échiquier n'est pas obligatoire.** Sur une grille de 12 cartes, douze damiers
  tuent la lisibilité. Viser au plus une vignette sur deux avec un élément échiquéen,
  et le traiter comme élément secondaire (fragment, ombre portée, motif de fond).
- Registre : vulgarisation scientifique sérieuse. Pas de dramatisation, pas de
  « guerrier stratège », pas de cliché IA-corporate (cerveau bleu néon, circuits, hologrammes).

## Format technique

| Propriété | Valeur |
|---|---|
| Ratio de génération | **3:2** (`--ar 3:2`) |
| Master livré | `1200 × 800`, WebP qualité 82 |
| Poids cible | ≤ 130 Ko (plafond dur : 200 Ko) |
| Emplacement | `public/images/blog/<slug>-hero.webp` |
| Dérivé partage | `public/images/og/<slug>-og.webp`, `1200 × 630` (recadrage centré) |

Le 3:2 est imposé par `.card-thumb-wrap { aspect-ratio: 3 / 2 }`
(`src/components/ArticleCard.astro`) : générer dans ce ratio évite tout recadrage sur la
carte. Le dérivé OG en 1,91:1 se coupe ensuite proprement en rognant haut et bas.

> Historique : les 9 vignettes existantes sont en `1024 × 576` (16:9) et portent
> l'extension `.png` alors que ce sont des **JPEG**. Elles sont donc recadrées sur la
> carte. À reprendre au fil de l'eau, pas en urgence.

### Zone de sécurité

Le sujet principal doit tenir dans le **rectangle central 3:2 amputé de 12 % en haut et
en bas** — c'est ce qui survit au recadrage OG 1,91:1. Les coins ne doivent porter aucune
information critique.

Le **coin bas-gauche accueille le filigrane** : y garder une zone calme, sans détail fin.
Le script échantillonne la luminance de ce coin et bascule automatiquement entre cavalier
encre et cavalier blanc ; il ne peut rien contre un coin encombré.

## Direction artistique

**Éditorial illustré.** Référence de registre : illustration de presse scientifique
(*Nautilus*, *Quanta*, cahier Science du *Monde*), pas *The Verge* ni banque d'images.

- Formes vectorielles aplaties, contours nets, **pas de dégradés** ni de lueurs.
- Texture papier / grain de sérigraphie légère, pour éviter le rendu « clipart ».
- **Grands aplats et espace négatif généreux** : la vignette est lue à 400 px de large
  dans une grille, une composition chargée devient une bouillie.
- Perspective simple, souvent frontale ou vue de dessus. Éviter les cadrages complexes.
- **Figures humaines : silhouettes ou visages très stylisés uniquement.** Midjourney
  produit des visages réalistes inégaux et lisses (« regard IA ») qui trahissent
  immédiatement la génération et vieillissent mal.

## Palette

Socle commun, hérité de la palette des schémas :

| Rôle | Hex | Formulation prompt |
|---|---|---|
| Fond | `#faf8ef` | `warm cream paper` |
| Encre / traits | `#1c1a16` | `deep charcoal ink` |
| Neutre chaud | `#e9e4d8` | `warm light grey` |
| Neutre moyen | `#9b9384` | `muted warm grey` |

**Une seule couleur d'accent par vignette, dictée par la rubrique** de l'article
(`category` dans le frontmatter, valeurs dans `src/data/site.ts`) :

| Rubrique | Hex | Formulation prompt |
|---|---|---|
| `science` | `#5b9fd4` | `dusty cornflower blue` |
| `esprit` | `#f0a050` | `warm amber orange` |
| `societe` | `#5cc4b0` | `muted teal green` |
| `grand-oral` | `#8b5cf6` | `soft muted violet` |

L'accent doit **dominer** la composition (30–50 % de la surface colorée), pas la
ponctuer discrètement : c'est ce qui permet de lire la rubrique au coup d'œil dans la
grille du portail. Une seconde couleur d'accent est tolérée uniquement si l'article
oppose deux termes (avant/après, humain/machine) — dans ce cas, le second accent est un
neutre chaud, jamais l'accent d'une autre rubrique.

## Structure du prompt

```
<MÉTAPHORE, 8–15 mots>, editorial conceptual illustration for a science magazine,
<COMPOSITION : cadrage, point de vue>,
flat vector shapes, clean contours, no gradients, subtle silkscreen grain,
limited palette: warm cream paper background, deep charcoal ink, <ACCENT RUBRIQUE> dominant,
generous negative space, calm and precise
--ar 3:2 --style raw --no text, letters, words, numbers, typography, watermark, signature, logo, frame, border, ui, chart
```

Notes :

- `--style raw` réduit l'embellissement automatique de Midjourney, qui pousse sinon vers
  le rendu « joli mais générique ». À conserver systématiquement.
- Le `--no` est long à dessein : `text`/`letters`/`words` bloquent l'incrustation
  parasite, `frame`/`border` évitent les fausses marges qui gâchent le recadrage OG,
  `chart` évite que MJ ne dérive vers du faux graphique illisible (le vrai graphique,
  c'est le rôle des schémas SVG).
- Les codes hex ne sont pas fiablement interprétés par Midjourney : donner le **nom
  anglais** de la couleur, le hex ne sert qu'à nous en interne.
- Pas de flag de version dans le template : ajouter celui de la version courante de
  Midjourney au moment de la génération, en gardant le **même pour toute la série** —
  changer de version en cours de route casse la cohérence visuelle.
- Le paramètre `--sref` (style reference) sur une vignette validée est le meilleur levier
  de cohérence série. Dès qu'une première vignette fait consensus, réutiliser son `--sref`
  pour toutes les suivantes.

## Clichés à bannir explicitement

Ces motifs sont ce que produisent par défaut les modèles quand on leur dit « échecs ».
Ils sont beaux et parfaitement vides.

- **La main en costume au-dessus de l'échiquier** — l'imagerie « stratégie d'entreprise ».
  Ajouter `bare wrist, no sleeve` au prompt et `suit, business attire, cuff` au `--no`.
- Le roi seul debout au milieu des pièces couchées (« le survivant »).
- Le cerveau lumineux à circuits, les hologrammes, les réseaux de neurones bleu néon.
- Les deux mains d'adversaires se serrant au-dessus du plateau.

## Contrôle après génération

Midjourney dérive facilement vers le bleu-vert quel que soit le prompt. Une vignette
Esprit qui ressort bleue et une vignette Science qui ressort bleue se retrouvent côte à
côte dans la grille, et le codage par rubrique ne veut plus rien dire. Ce contrôle est
donc le plus important de la série — mais il est **plus piégeux qu'il n'y paraît**.

### Ce qui ne marche pas

Chercher « la couleur dominante » par histogramme donne des faux négatifs systématiques :

- Le **fond crème a une teinte d'environ 40°**, c'est-à-dire en plein dans la fenêtre de
  l'ambre. Sur une image à accent bleu, le fond occupe la plus grande surface et se fait
  compter comme accent Esprit conforme. Erreur commise le 17/08/2026 sur un lot de 19,
  avec un « 19/19 conformes » entièrement faux.
- Chercher la couleur la plus saturée échoue aussi : un aplat orange minoritaire l'emporte
  sur un large fond bleu désaturé.

Mesurer des surfaces plutôt qu'une couleur dominante ne suffit pas non plus. Quatre
variantes du contrôle ont été écrites le 17/08/2026, elles ont donné quatre réponses
différentes, dont **deux faux « tout va bien »** sur des lots réellement dérivés.

Deux causes, dont une définitive :

1. `magick -colorspace HSL … txt:` sort les canaux dans l'ordre **(H, S, L)**, et non
   (H, L, S). L'inversion fait filtrer sur la saturation en croyant filtrer sur la
   luminosité. Piège vérifiable en une commande :
   `magick -size 1x1 xc:red -colorspace HSL -depth 8 txt:-` → `(0,255,128)`.
2. **Le papier crème n'est pas un neutre.** Mesuré sur les rendus réels : teinte 42°,
   saturation 49 %, luminosité 87 %. C'est un ambre franc, qui occupe la région même de
   l'accent Esprit. Aucun seuil hue/sat/lum ne sépare le fond de l'accent sur cette
   rubrique. Ce n'est pas un réglage à trouver, c'est structurel.

### Ce qui fait foi : la planche-contact

**Regarder les vignettes ensemble, à la taille réelle de la carte.** C'est le seul
contrôle qui ne s'est jamais trompé, et c'est lui qui a rattrapé chacune des erreurs
des scripts.

```bash
node scripts/import-vignettes.mjs <rubrique> --sheet   # → /tmp/planche-<rubrique>.png
```

Le script affiche aussi un pourcentage de surface dans la bande de la rubrique. C'est un
**indicateur, jamais un verdict** : utile pour repérer un cas franc (10 % contre 90 %),
inutilisable pour trancher un cas mixte. Ne jamais valider un lot sur ce seul chiffre.

## Post-traitement

```bash
node scripts/prepare-vignette.mjs ~/Téléchargements/mj-export.png echecs-et-dopamine
```

Le script redimensionne en 1200 × 800, encode en WebP, incruste le filigrane du cavalier
en bas à gauche, écrit `public/images/blog/<slug>-hero.webp`, et produit le dérivé OG
1200 × 630 dans `public/images/og/`.

Le filigrane va sur le **master**, donc il voyage avec l'image sur Pinterest et les
réseaux — c'est l'intérêt. Position bas-gauche : ce coin survit aux deux recadrages.

Le script choisit le cavalier encre ou blanc selon la luminosité du coin. Piège rencontré
le 17/08/2026 : **`sharp().stats()` analyse l'image telle que chargée et n'applique pas
les opérations du pipeline** — un `.extract()` chaîné avant `.stats()` est purement
ignoré. La mesure portait donc sur l'image entière, et le filigrane sortait invisible sur
toute image à fond clair avec un coin sombre. Il faut matérialiser le recadrage dans un
buffer avant de mesurer.

Vérification d'un lot : régénérer chaque vignette avec `--no-watermark` et comparer la
boîte du filigrane à l'originale (`magick compare -metric RMSE`). En dessous de ~1 %
d'écart, le filigrane est absent ou trop faible.

**Réglage : cavalier de 96 px de haut, opacité 0,34, marge 34 px.** Renforcé le
17/08/2026 — à 76 px et 0,18 il était présent mais quasi invisible, donc sans valeur
d'attribution. Réglages dans les constantes en tête de `scripts/prepare-vignette.mjs`.

## Pourquoi on ne bloque pas la copie des images

Question tranchée le 17/08/2026. Deux raisons de s'en tenir au filigrane :

1. **C'est techniquement impossible.** Une image affichée par un navigateur est déjà sur
   le disque du visiteur. Bloquer le clic droit se contourne par le panneau Réseau des
   outils de développement, `Ctrl+U`, une capture, ou `curl` sur l'URL du fichier.
2. **Ça contredirait la stratégie Pinterest**, canal jugé prioritaire dans le plan de
   monétisation. Pinterest ne fonctionne que si les visiteurs enregistrent les images ;
   bloquer le menu contextuel casse le bouton de l'extension et le survol Pinterest.

La seule protection qui survit à la copie est le filigrane — d'où son renforcement plutôt
qu'un blocage. Reste disponible si le besoin revient : la **protection anti-hotlink
nginx** (empêche les autres sites d'afficher vos images depuis votre serveur, avec
Pinterest / Google Images / réseaux sociaux en liste blanche). Efficace, invisible pour
les visiteurs, sans effet SEO — mais elle protège la bande passante, pas l'image.

Le grain de sérigraphie est coûteux à encoder : WebP compresse mal le bruit. Une vignette
très texturée dépasse les 200 Ko à la qualité par défaut — passer `--quality=72`, la
différence est invisible sur une image granuleuse (constaté sur `echecs-et-flow` :
211 Ko → 164 Ko sans perte perceptible).

## Nommage et insertion

Fichier : `public/images/blog/<slug>-hero.webp` — `<slug>` = nom du fichier Markdown,
en ASCII kebab-case, sans accent.

Frontmatter de l'article :

```yaml
heroImage:
  src: /images/blog/echecs-et-dopamine-hero.webp
  alt: "Description factuelle de ce que montre l'image, en français, 8-15 mots."
```

- `alt` décrit **l'image**, pas l'article : il est lu par les lecteurs d'écran et doit
  avoir du sens hors contexte. Ne pas y recopier le titre.
- `sourceUrl` / `credit` / `license` restent **vides** : ces champs servent aux images
  Wikimedia Commons. Une vignette maison n'a pas de crédit externe.
- `getPostHeroSrc()` (`src/utils/blog.ts:9`) vérifie l'existence du fichier avant
  d'émettre le `<img>` : un chemin cassé ne produit pas de 404, il retombe
  silencieusement sur le damier de secours. Toujours vérifier que le fichier est bien
  présent, l'absence ne lève aucune erreur de build.

## Dette existante à résorber

État au 17 août 2026, sur 99 articles publiés :

| État | Nombre |
|---|---|
| Vignette réelle affichée | 16 |
| `heroImage` déclaré, fichier **absent** | 50 |
| Aucun `heroImage` | 33 |

Soit **83 cartes sur 99** affichant le damier de secours. Les 50 chemins cassés sont à
traiter en priorité : la déclaration existe déjà, il ne manque que le fichier.

Cinq articles pointent par ailleurs leur `heroImage` vers `/images/og-default.png`, qui
est l'image de partage par défaut du site et non une vignette d'article — à remplacer.
