# Blog d'un Gaucher — Astro

Blog personnel trilingue (FR/EN/ES) sur les échecs, la stratégie et la vie.

## Stack
- **Astro** — framework statique
- **CSS pur** — pas de framework CSS, tout est custom
- **Markdown** — pour écrire les articles facilement

## Démarrage rapide

```bash
# 1. Installer les dépendances
npm install

# 2. Lancer en développement (localhost:4321)
npm run dev

# 3. Builder pour la production
npm run build
# → génère le dossier /dist à uploader sur Hostinger
```

## Structure du projet

```
blog-gaucher/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── Navbar.astro       ← barre de navigation
│   │   ├── Footer.astro       ← pied de page
│   │   ├── ArticleCard.astro  ← carte d'article réutilisable
│   │   └── AdBanner.astro     ← emplacement AdSense
│   ├── layouts/
│   │   └── BaseLayout.astro   ← layout principal (HTML, head, nav, footer)
│   ├── pages/
│   │   ├── index.astro        ← page d'accueil
│   │   ├── blog/index.astro   ← liste des articles
│   │   └── about/index.astro  ← page à propos
│   ├── content/
│   │   └── blog/              ← tes articles en Markdown (.md)
│   └── styles/
│       └── global.css         ← styles globaux
├── astro.config.mjs
└── package.json
```

## Écrire un nouvel article

Crée un fichier `.md` dans `src/content/blog/` :

```markdown
---
title: "Titre de ton article"
excerpt: "Courte description pour la carte"
date: "2025-04-01"
category: "Échecs"   ← Échecs | Stratégie | Actualités | Lifestyle
slug: "mon-article"
---

Contenu de l'article en Markdown...
```

## Déploiement sur Hostinger

1. `npm run build`
2. Ouvre hPanel → File Manager → public_html
3. Supprime le contenu existant
4. Upload tout le contenu du dossier `/dist`
5. C'est en ligne ✅

## Activer AdSense

Dans `src/components/AdBanner.astro` :
- Décommente le bloc `<ins class="adsbygoogle"...>`
- Remplace `ca-pub-XXXXXXXXXXXXXXXX` par ton ID AdSense
- Remplace `XXXXXXXXXX` par ton ID de bloc publicitaire

Dans `src/layouts/BaseLayout.astro` :
- Décommente le script AdSense dans le `<head>`
