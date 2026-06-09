# 03 — Arborescence des fichiers

Ce chapitre est le **plan du bâtiment** : à quoi sert chaque dossier et chaque fichier important. Garde-le sous la main, il sert de carte pour tous les autres chapitres.

## Vue générale

```
blog-gaucher/
├── astro.config.mjs        ← Réglages d'Astro (URL, redirections, options)
├── package.json            ← Liste des outils + commandes (npm run …)
├── tsconfig.json           ← Réglages du TypeScript
│
├── src/                    ← LE CŒUR : tout ce qu'on écrit à la main
│   ├── content/            ← Le contenu : articles, traductions, dissertations
│   ├── pages/              ← Les pages du site (définit les URL)
│   ├── components/         ← Les briques réutilisables de l'interface
│   ├── layouts/            ← Le(s) gabarit(s) commun(s) à toutes les pages
│   ├── data/               ← Configuration du site (rubriques, navigation…)
│   ├── i18n/               ← Traductions de l'interface (boutons, menus…)
│   ├── utils/              ← Petites fonctions utilitaires réutilisables
│   ├── styles/             ← Le CSS global (couleurs, polices, design)
│   └── scripts/            ← Code TypeScript embarqué dans certaines pages
│
├── public/                ← Fichiers servis tels quels (images, PWA, robots…)
│   ├── images/            ← Logos, icônes, images d'articles
│   ├── pdfs/              ← Les PDF générés du Grand oral
│   ├── stockfish/         ← Le moteur d'échecs (fichiers du programme)
│   ├── videos/            ← Les vidéos récap
│   ├── manifest.json      ← Carte d'identité de l'« application » (PWA)
│   ├── sw.js              ← Le « service worker » (cache + hors-ligne)
│   ├── offline.html       ← Page affichée quand on est hors ligne
│   ├── robots.txt         ← Instructions pour les moteurs de recherche
│   ├── llms.txt           ← Instructions pour les assistants IA
│   ├── i18n-dict.js       ← Dictionnaire de traduction chargé par le navigateur
│   └── favicon.svg        ← La petite icône de l'onglet
│
├── scripts/               ← Programmes d'automatisation (Node.js)
│   ├── check-publish-weekly.mjs
│   ├── apply-future-publish-schedule.mjs
│   ├── generate-pdfs.mjs
│   ├── gen-nginx-redirects.mjs
│   └── … (une trentaine, voir chapitre 11)
│
├── deploy/                ← Fichiers de configuration du serveur
│   └── nginx-redirects.conf  ← Les vraies redirections 301 pour nginx
│
├── motion-canvas/         ← Projet séparé pour fabriquer les vidéos récap
│
├── docs/                  ← CETTE DOCUMENTATION
│
└── dist/                  ← LE SITE FINI (généré par le build, non sauvegardé dans Git)
```

## Les deux dossiers à ne pas confondre : `src/` et `public/`

C'est une distinction importante.

- **`src/`** (« source ») contient tout ce qui est **transformé** par le build. Les articles Markdown deviennent du HTML, les fichiers `.astro` deviennent des pages, le CSS est optimisé… Rien dans `src/` n'arrive tel quel chez le visiteur ; tout passe à la moulinette d'Astro.

- **`public/`** contient tout ce qui est servi **tel quel, sans transformation**. Une image dans `public/images/logo.svg` sera accessible à l'adresse `https://blogdungaucher.com/images/logo.svg`, exactement comme elle est. On y met les fichiers qui doivent garder un nom et un emplacement fixes : images, icônes, `robots.txt`, le service worker, etc.

> **Règle simple.** Ça doit être transformé/calculé ? → `src/`. Ça doit rester identique avec une adresse fixe ? → `public/`.

## Détail des sous-dossiers de `src/`

### `src/content/` — le contenu
Le texte des articles, rangé par type :
- `blog/` — les articles, eux-mêmes rangés en sous-dossiers par rubrique : `science/`, `esprit/`, `societe/`, `grand-oral/`.
- `blog-translations/en/` — les traductions **anglaises** des articles.
- `blog-translations/pt-br/` — les traductions **portugais brésilien** (préparées, pas encore publiées).
- `dissertations/` — les dissertations (textes longs).
- `content.config.ts` — le **schéma** : la liste des informations qu'un article *doit* contenir (voir [chapitre 04](04-contenu-articles.md)).

### `src/pages/` — les pages et les URL
Dans Astro, **chaque fichier de ce dossier correspond à une adresse du site**. C'est le « routeur » : la structure des dossiers ici détermine la structure des adresses. Détaillé au [chapitre 05](05-pages-routes.md).

### `src/components/` — les briques d'interface
Des morceaux d'interface réutilisables : la barre de navigation (`Navbar.astro`), le pied de page (`Footer.astro`), une carte d'article (`ArticleCard.astro`), la foire aux questions (`FAQ.astro`), etc. Chaque composant est décrit au [chapitre 06](06-composants.md).

### `src/layouts/` — le gabarit commun
Contient `BaseLayout.astro`, le **moule** dans lequel toutes les pages sont coulées : il fournit le `<head>` (les informations invisibles pour Google et le navigateur), la barre de navigation, le pied de page. Voir [chapitre 07](07-design.md).

### `src/data/` — la configuration éditoriale
- `site.ts` — **le fichier de réglages central** : le nom du site, l'adresse, les quatre rubriques (avec leurs couleurs, descriptions, textes SEO), les menus de navigation pour chaque langue, la config des pubs, des commentaires… Si tu changes une rubrique ou un texte de menu, c'est ici.
- `category-landing-rich.ts` — des contenus enrichis pour les pages d'accueil de chaque rubrique.

### `src/i18n/` — les traductions de l'interface
`translations.ts` contient les traductions des **éléments d'interface** (pas des articles) : le texte des boutons, des menus, des messages. « Internationalisation » s'abrège **i18n** (un « i », puis 18 lettres, puis un « n »). Voir [chapitre 08](08-i18n.md).

### `src/utils/` — la boîte à outils
Des petites fonctions réutilisables un peu partout :
- `blog.ts` — le plus important : charge les articles, calcule les URL, les temps de lecture, fabrique les données SEO (voir [chapitre 09](09-seo.md)).
- `lang-paths.ts` — bascule une adresse d'une langue à l'autre (`/fr/blog/x/` ↔ `/en/blog/x/`).
- `english-article.ts`, `markdown-strip-faq.ts` — transforment le Markdown des traductions/FAQ.
- `public-asset.ts` — vérifie qu'un fichier (ex. une image) existe bien avant de l'afficher.

### `src/styles/` — l'apparence globale
`global.css` — **toute l'identité visuelle** : les couleurs, les polices, les ombres, les arrondis, les animations, le mode sombre. Plus de 1 100 lignes. Voir [chapitre 07](07-design.md).

### `src/scripts/` — code embarqué
`analysis.ts` — le code TypeScript de la page d'analyse Stockfish (échiquier interactif).

## Les fichiers à la racine

- **`astro.config.mjs`** — la configuration d'Astro : l'adresse du site, les **redirections** (anciennes URL → nouvelles), les options de Markdown, l'intégration React. C'est un fichier central, détaillé aux chapitres [05](05-pages-routes.md) et [16](16-deploiement.md).
- **`package.json`** — la liste des outils et les commandes raccourcies.
- **`tsconfig.json`** — réglages techniques du TypeScript (court, rarement touché).
- **`package-lock.json`** — la liste *exacte* (avec versions précises) de tous les paquets ; généré automatiquement, on ne le modifie jamais à la main.

## Le dossier `dist/` (le résultat)

Après un `npm run build`, le dossier **`dist/`** apparaît : c'est **le site fini**. Il n'est **pas sauvegardé dans Git** (inutile : on peut toujours le régénérer) et c'est son contenu qui est envoyé sur le serveur.

---

⬅️ Précédent : [02 — Vue d'ensemble technique](02-vue-ensemble-technique.md) | ➡️ Suivant : [04 — Le contenu : articles et rubriques](04-contenu-articles.md)
