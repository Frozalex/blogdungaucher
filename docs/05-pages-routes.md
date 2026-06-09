# 05 — Les pages et les adresses (URL)

Ce chapitre explique **comment naissent les adresses du site** et quelles pages existent.

## Le principe : « le dossier = l'adresse »

Dans Astro, le dossier `src/pages/` est spécial : **la structure des fichiers détermine directement les adresses (URL)**. C'est ce qu'on appelle le **routage par fichiers**.

| Fichier dans `src/pages/` | Adresse produite |
|---|---|
| `src/pages/fr/index.astro` | `/fr/` (l'accueil français) |
| `src/pages/fr/about/index.astro` | `/fr/about/` |
| `src/pages/fr/glossaire/index.astro` | `/fr/glossaire/` |
| `src/pages/fr/blog/[slug].astro` | `/fr/blog/<n'importe-quel-article>/` |
| `src/pages/fr/blog/[...page].astro` | `/fr/blog/`, `/fr/blog/2/`, `/fr/blog/3/`… (pages de liste) |
| `src/pages/index.astro` | `/` (redirige vers `/fr/`) |
| `src/pages/sitemap.xml.ts` | `/sitemap.xml` |
| `src/pages/rss.xml.ts` | `/rss.xml` |

Un fichier nommé `index.astro` correspond à la « racine » de son dossier (l'adresse se termine par le nom du dossier + `/`).

### Le détail magique : les crochets `[ ]`

Tu remarques des noms bizarres comme `[slug].astro` ou `[...page].astro`. Les **crochets** signalent une adresse **variable** :

- **`[slug].astro`** = « une page **par article** ». Le mot `slug` est un trou à remplir. Astro génère une page pour *chaque* article : `/fr/blog/echecs-et-flow/`, `/fr/blog/echecs-et-le-corps/`, etc. Pour savoir quelles pages créer, le fichier contient une fonction **`getStaticPaths()`** (« quels chemins fabriquer ? ») qui dit : « fabrique une page pour chaque article de la collection ».

- **`[...page].astro`** (avec trois points) = la **pagination** : la liste des articles découpée en pages de N articles (`/fr/blog/`, `/fr/blog/2/`…).

> **Important :** comme le site est statique, ces pages variables sont **toutes générées au build**. Il n'y a pas de « page créée à la volée ». Au moment du build, Astro connaît tous les articles et fabrique une page HTML figée pour chacun.

## L'inventaire des pages

Le site possède des pages **en français** (`/fr/…`), **en anglais** (`/en/…`) et **en allemand** (`/de/…`, cachées du public). Voici la liste française (les autres langues sont des miroirs) :

### Pages d'accueil et de listing
- **`/fr/`** — la page d'accueil (gérée par le composant `HomeLanding`, voir [chapitre 06](06-composants.md)).
- **`/fr/blog/`** + `/fr/blog/2/`, `/fr/blog/3/`… — la liste de **tous les articles**, paginée.

### Pages de rubrique
- **`/fr/science/`**, **`/fr/esprit/`**, **`/fr/societe/`**, **`/fr/grand-oral/`** — la page d'accueil de chaque rubrique, listant ses articles. Toutes utilisent le même composant `CategoryPage`.

### Pages d'articles
- **`/fr/blog/<slug>/`** — un article (généré par `[slug].astro`).
- **`/fr/dissertations/`** et **`/fr/dissertations/<slug>/`** — les dissertations.

### Pages utilitaires et légales
- **`/fr/about/`** — à propos.
- **`/fr/glossaire/`** — le glossaire des termes d'échecs.
- **`/fr/recherche/`** — la page de **recherche** (propulsée par Pagefind).
- **`/fr/analyses/`** — l'analyse Stockfish (désactivée pour l'instant).
- **`/fr/infographie/`** — une page d'infographie.
- **`/fr/mentions-legales/`** et **`/fr/politique-confidentialite/`** — pages légales (volontairement non indexées par Google).
- **`/404.astro`** — la page affichée quand une adresse n'existe pas (erreur « 404 »).

### Fichiers spéciaux (pas des pages visibles)
- **`/sitemap.xml`** — la carte du site pour Google (voir [chapitre 09](09-seo.md)).
- **`/rss.xml`** — le flux RSS (permet de s'abonner aux nouveaux articles avec un lecteur RSS).

## Les réglages d'adresses dans `astro.config.mjs`

Deux réglages importants gouvernent **la forme** des adresses :

- **`trailingSlash: "always"`** — toutes les adresses se terminent par un `/` (ex. `/fr/blog/`, jamais `/fr/blog`). C'est une règle stricte et cohérente : Google n'aime pas qu'une même page existe avec et sans slash.
- **`site: "https://blogdungaucher.com"`** — l'adresse officielle du site, fixée « en dur ». C'est important : ça garantit que toutes les adresses calculées (liens, sitemap, balises SEO) pointent vers le bon domaine, **même si** le serveur utilise techniquement une autre adresse en interne.

## Les redirections : faire pointer une ancienne adresse vers une nouvelle

Quand une page change d'adresse (article fusionné, slug renommé, ancienne structure d'URL), on ne veut **surtout pas** que les anciens liens mènent à une page d'erreur. On met une **redirection 301** (« cette page a déménagé définitivement, va plutôt ici »).

Le bloc `redirects` d'`astro.config.mjs` liste ces redirections. Exemples réels :

```js
redirects: {
  "/fr/essais/": "/fr/dissertations/",                    // rubrique renommée
  "/fr/blog/echecs-et-seniors/":                          // article fusionné…
    "/fr/blog/echecs-alzheimer-prevention-declin-cognitif/", // …vers son équivalent
  "/en/blog/echecs-et-seniors/":                          // version anglaise orpheline…
    "/en/blog/chess-and-alzheimer-prevention/",
  // … + des redirections générées automatiquement (voir ci-dessous)
}
```

Ces redirections existent à **deux endroits**, et c'est subtil :

1. **Dans `astro.config.mjs`** : Astro génère, pour chaque ancienne adresse, une petite page HTML qui renvoie automatiquement vers la nouvelle. C'est un **filet de sécurité**.
2. **Dans la configuration de nginx** (le serveur) : ce sont les **« vraies » redirections 301**, plus propres et mieux comprises par Google. Elles sont générées par un script (`gen-nginx-redirects.mjs`) et déployées à la main. Voir [chapitre 16](16-deploiement.md).

Certaines redirections sont même **générées automatiquement** à partir du contenu : la fonction `enSlugRedirects()` (dans `scripts/en-redirects.mjs`) lit chaque traduction anglaise, regarde si elle a un « slug localisé » (ex. l'article français `echecs-et-femmes` devient `chess-and-women` en anglais), et crée automatiquement la redirection de l'ancienne adresse vers la nouvelle. 62 paires sont ainsi entretenues sans intervention manuelle.

---

⬅️ Précédent : [04 — Le contenu](04-contenu-articles.md) | ➡️ Suivant : [06 — Les composants](06-composants.md)
