# Blog d'un Gaucher  -  Astro

Blog personnel trilingue (FR/EN/ES) sur les échecs, la stratégie et la vie.

## Stack
- **Astro**  -  framework statique
- **CSS pur**  -  pas de framework CSS, tout est custom
- **Markdown**  -  pour écrire les articles facilement

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
├── .github/workflows/       ← déploiement SSH + publication planifiée (voir ci-dessous)
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
├── scripts/
│   ├── publish-schedule-constants.mjs   ← seuil calendrier + ancrage CI
│   ├── check-publish-weekly.mjs         ← valide 2 billets / semaine (lun/jeu)
│   └── apply-future-publish-schedule.mjs ← replanification groupée (rare)
├── astro.config.mjs
└── package.json
```

## Écrire un nouvel article

Crée un fichier `.md` dans `src/content/blog/`. Le schéma réel est dans `src/content.config.ts` (champs obligatoires : `title`, `excerpt`, `publishDate`, `category`, `pillar`, etc.).

### Calendrier : 2 billets par semaine

À partir du **lundi** noté dans `scripts/publish-schedule-constants.mjs` (`SCHEDULE_GRID_ANCHOR_MONDAY`), chaque **`publishDate`** doit être un **lundi ou un jeudi** (UTC), avec **exactement 2** billets par semaine ISO. Le **nombre total** de billets sur la grille (≥ ce lundi) doit être **pair** ; sinon ajoute un billet ou repasse-en un sous l’ancrage (entre `RESCHEDULE_FROM` et ce lundi, ou plus tôt).

- Vérif en local : `npm run check:publish-weekly` (aussi exécuté au `npm run build` et dans la CI `check-publish-schedule.yml`).
- Replanification groupée des dates `publishDate >= RESCHEDULE_FROM` : `npm run apply:publish-schedule` (puis ajuster la constante si tu « figes » une nouvelle frontière de passé).

Exemple minimal de front matter (voir un article existant pour tous les champs) :

```markdown
---
title: "Titre de ton article"
excerpt: "Courte description pour la carte"
publishDate: "2026-07-23"
category: "science"
pillar: "Science du jeu"
---
```

## Déploiement (automatisation GitHub)

Le déploiement en production est assuré par **GitHub Actions** (SSH vers le serveur, script `deploy-site.sh` côté VPS) :

- **`deploy.yml`** — à chaque push sur la branche `main` (et déclenchement manuel *workflow_dispatch*).
- **`scheduled-publish.yml`** — une fois par jour (cron 06:00 UTC) pour reconstruire le site : les articles avec une **`publishDate`** future dans le front matter ne s’affichent qu’à partir de cette date, sans intervention manuelle sur le serveur.

Secrets et détails : commentaires en tête de chaque fichier sous `.github/workflows/`.

### Hébergement sans Actions (fallback)

1. `npm run build`
2. hPanel → File Manager → `public_html`
3. Remplacer le contenu par le dossier `/dist`

## Activer AdSense

Dans `src/components/AdBanner.astro` :
- Décommente le bloc `<ins class="adsbygoogle"...>`
- Remplace `ca-pub-XXXXXXXXXXXXXXXX` par ton ID AdSense
- Remplace `XXXXXXXXXX` par ton ID de bloc publicitaire

Dans `src/layouts/BaseLayout.astro` :
- Décommente le script AdSense dans le `<head>`
