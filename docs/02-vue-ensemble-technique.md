# 02 — Vue d'ensemble technique : la « pile » d'outils

Maintenant qu'on a les concepts de base, voici **les outils précis** assemblés pour faire tourner ce site. L'ensemble des outils choisis s'appelle une **pile technique** (en anglais *stack*). On les présente du plus important au plus accessoire.

## Astro : le cœur du système

**Astro** est le **framework** principal — c'est-à-dire la grande boîte à outils qui orchestre tout. C'est Astro qui :

- lit les articles et les gabarits,
- fabrique les pages HTML lors du build,
- gère les adresses (URL) des pages,
- gère les redirections,
- et produit le dossier `dist` final.

**Pourquoi Astro ?** Parce qu'il est spécialisé dans les **sites statiques orientés contenu** (blogs, documentations, vitrines). Sa philosophie : produire par défaut du **HTML pur, sans JavaScript inutile**. Une page d'article ne charge du JavaScript que pour les rares morceaux qui en ont vraiment besoin (le menu, la recherche…). Résultat : des pages **légères et rapides**.

Dans ce projet, Astro est configuré en mode **`output: "static"`** (tout est figé à l'avance) avec **`trailingSlash: "always"`** (toutes les adresses se terminent par un `/`, ex. `/fr/blog/`). Sa configuration vit dans le fichier `astro.config.mjs` (voir [chapitre 05](05-pages-routes.md) et [chapitre 16](16-deploiement.md)).

### Les fichiers `.astro`

Astro a son propre format de fichier : l'extension **`.astro`**. Un fichier `.astro` ressemble à du HTML, mais avec deux super-pouvoirs :

1. En haut, entre deux lignes `---`, on peut écrire de la **logique** (en JavaScript/TypeScript) : « va chercher tous les articles », « calcule la date », etc. Cette partie s'exécute **pendant le build**, jamais chez le visiteur.
2. En bas, on écrit le **HTML** de la page, dans lequel on peut injecter les valeurs calculées en haut.

C'est avec des fichiers `.astro` que sont écrits **le gabarit** (`BaseLayout.astro`), **les pages** (`src/pages/…`) et **les composants** (`src/components/…`).

## Markdown : le format des articles

Les articles **ne sont pas écrits en HTML** (trop verbeux), mais en **Markdown** — un format texte ultra-simple. Au lieu d'écrire `<strong>important</strong>`, on écrit `**important**`. Au lieu de baliser un titre en HTML, on met juste `## Mon titre`.

- `# Titre`, `## Sous-titre` → titres
- `**gras**`, `*italique*` → mises en valeur
- `- élément` → listes à puces
- `[texte](adresse)` → liens
- `> citation` → citations

Les fichiers Markdown portent l'extension **`.md`**. Lors du build, Astro **convertit** automatiquement ce Markdown en HTML.

Chaque fichier d'article commence aussi par un petit bloc d'informations encadré de `---`, appelé **frontmatter** (titre, date, catégorie, mots-clés…). C'est détaillé au [chapitre 04](04-contenu-articles.md).

## React : pour les rares morceaux très interactifs

**React** est une autre boîte à outils, très populaire, spécialisée dans les interfaces interactives. Ici, il n'est utilisé **qu'exceptionnellement**, pour des morceaux qui en ont vraiment besoin (par exemple le lecteur vidéo). Astro permet de mélanger : 99 % du site est du HTML statique, et seuls quelques « îlots » utilisent React. C'est ce qu'on appelle l'**architecture en îlots** (*islands*) : le JavaScript lourd ne charge que là où c'est indispensable, pas sur toute la page.

## Les autres briques, par fonction

Voici les principaux paquets installés (listés dans `package.json`) et **à quoi chacun sert**, en français clair :

### Pour le contenu et le texte
- **`marked`, `unified`, `remark-*`, `rehype-*`, `mdast-*`, `hast-*`** — la « tuyauterie » qui transforme le Markdown en HTML. Plusieurs petits outils s'enchaînent pour analyser le texte, le transformer, et produire le HTML final. (Astro s'en sert, et le site les réutilise pour la version anglaise.)
- **`remark-gfm`** — ajoute des fonctions Markdown pratiques (tableaux, listes de tâches…).
- **`github-slugger`** — fabrique des identifiants propres à partir des titres (ex. « Le syndrome de l'imposteur » → `le-syndrome-de-l-imposteur`), utilisés pour les ancres et les sommaires.

### Pour les mathématiques
- **`katex`, `remark-math`, `rehype-katex`** — permettent d'écrire des **formules mathématiques** dans les articles et de les afficher proprement (équations, symboles). KaTeX est l'outil qui « dessine » les maths. Utilisé surtout dans la science et le Grand oral.

### Pour les échecs
- **`chess.js`** — la « règle du jeu » sous forme de programme : il sait quels coups sont légaux, détecter l'échec et mat, lire les notations d'échecs.
- **`chessboard-element`** — affiche un **échiquier interactif** sur lequel on peut bouger les pièces.
- **`stockfish`** — le **moteur d'échecs** : l'intelligence artificielle qui analyse une position et propose le meilleur coup. (Sert à la page « Analyses », pour l'instant désactivée.)

### Pour les PDF
- **`html2pdf.js`** — transforme une page HTML en fichier **PDF téléchargeable** (utilisé pour les sujets de Grand oral).

### Pour les vidéos
- **`remotion`, `@remotion/player`** — une technologie pour fabriquer des **vidéos à partir de code**. *Note : le projet a basculé vers un autre outil appelé **Motion Canvas** (dossier `motion-canvas/`) pour les vidéos récap ; Remotion reste présent dans la liste mais n'est plus le moteur principal.* Voir [chapitre 15](15-pdf-et-videos.md).

### Pour la recherche, les images, les tests
- **`pagefind`** — un moteur de **recherche** qui fonctionne entièrement côté visiteur, sans serveur (idéal pour un site statique). Il indexe tous les articles après le build.
- **`sharp`** — un outil de **traitement d'images** (redimensionner, convertir en PNG…), utilisé par les scripts qui génèrent les images de partage.
- **`cheerio`** — permet de lire et manipuler du HTML « comme du texte » dans les scripts (utilisé pour extraire des morceaux, vérifier des pages…).
- **`puppeteer`** — pilote un navigateur invisible pour **mesurer la vitesse** du site (voir [chapitre 12](12-performance.md)).

### Les polices d'écriture
- **`@fontsource-variable/space-grotesk`** — police des **titres** (Space Grotesk).
- **`@fontsource-variable/fraunces`** — police **sérif élégante** pour certains titres et accents (Fraunces).
- **`@fontsource-variable/outfit`** — police du **corps de texte** (Outfit).

## Les langages utilisés

- **HTML / CSS / JavaScript** : les trois langages de base du web (voir [chapitre 01](01-concepts-de-base.md)).
- **TypeScript** : c'est du JavaScript « avec des garde-fous ». Il ajoute la notion de **types** (« cette donnée est un texte », « celle-là est une date ») pour attraper les erreurs avant même de lancer le site. Beaucoup de fichiers du projet sont en `.ts` (TypeScript) plutôt qu'en `.js`.
- **Markdown** : pour les articles (voir plus haut).

## Comment tout s'emboîte (résumé)

```
   Articles (.md)  +  Données (.ts)  +  Gabarits & Composants (.astro)  +  Styles (.css)
                              │
                              ▼
                      ┌──────────────┐
                      │    ASTRO     │   ← lit tout, convertit le Markdown,
                      │   (le build) │     applique les gabarits, calcule les URL
                      └──────────────┘
                              │
                              ▼
                  dossier dist/  (HTML + CSS + JS figés)
                              │
                  + Pagefind indexe la recherche
                              │
                              ▼
                   Déployé sur le serveur (nginx)
```

Avec cette vue d'ensemble, on peut maintenant ouvrir le capot dossier par dossier.

---

⬅️ Précédent : [01 — Concepts de base](01-concepts-de-base.md) | ➡️ Suivant : [03 — Arborescence des fichiers](03-arborescence.md)
