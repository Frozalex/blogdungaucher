# Blog d'un Gaucher

Blog bilingue FR/EN sur les échecs : psychologie, science, société, grand oral bac.  
→ [blogdungaucher.com](https://blogdungaucher.com)

## Stack

| Couche | Outil |
|---|---|
| Framework | Astro 6 (SSG, sortie statique) |
| Langues | FR (principale) + EN (traductions) |
| Styles | CSS pur, variables custom, dark mode |
| Recherche | Pagefind (index généré au build) |
| Commentaires | Remark42 (auto-hébergé) |
| Notifications | ntfy (auto-hébergé) + Brevo (newsletter) |
| Déploiement | VPS Ubuntu / nginx, pull-based (cron) |
| CI | GitHub Actions (notifications + calendrier) |

## Démarrage rapide

```bash
npm install
npm run dev          # localhost:4321
npm run build        # génère dist/ + index Pagefind
npm run preview      # prévisualise dist/ en local
```

## Structure du projet

```
blog-gaucher/
├── .github/workflows/
│   ├── deploy.yml                  ← notifications ntfy + Brevo au push
│   ├── check-publish-schedule.yml  ← vérifie le rythme 2 articles/semaine
│   ├── scheduled-publish.yml       ← rebuild quotidien (articles à date future)
│   ├── remotion-render.yml         ← génération vidéos Remotion
│   └── secrets-scan.yml            ← TruffleHog
├── deploy/
│   ├── nginx-redirects.conf        ← vrais 301 nginx (⚠️ à scp sur le VPS)
│   ├── activate-nginx-redirects.sh ← script d'activation (à lancer sur le VPS)
│   └── auto-deploy-poll.sh         ← poll cron toutes les 2 min (installé sur VPS)
├── public/
│   ├── pdfs/                       ← PDFs grand oral (générés par Puppeteer)
│   ├── images/                     ← assets statiques
│   └── .htaccess                   ← ⚠️ INACTIF (nginx ignore Apache .htaccess)
├── scripts/
│   ├── en-redirects.mjs            ← table frSlug→enSlug (source unique)
│   ├── gen-nginx-redirects.mjs     ← régénère deploy/nginx-redirects.conf
│   ├── generate-pdfs.mjs           ← PDFs grand oral via Puppeteer
│   ├── generate-og-png.mjs         ← image OG par défaut
│   ├── strip-em-dash.mjs           ← retire les tirets cadratin (—)
│   ├── check-publish-weekly.mjs    ← valide rythme 2 billets/sem (lancé au build)
│   ├── apply-future-publish-schedule.mjs
│   ├── send-new-article-email.mjs  ← newsletter Brevo
│   └── indexnow-submit.mjs         ← IndexNow (Bing)
├── src/
│   ├── content/
│   │   ├── blog/                   ← articles FR (rangés par rubrique)
│   │   │   ├── esprit/
│   │   │   ├── science/
│   │   │   ├── societe/
│   │   │   └── grand-oral/
│   │   ├── blog-translations/en/   ← traductions EN (frontmatter enSlug requis)
│   │   └── dissertations/          ← textes longs argumentés
│   ├── pages/
│   │   ├── fr/                     ← toutes les pages FR
│   │   └── en/                     ← toutes les pages EN
│   ├── components/
│   ├── layouts/
│   ├── data/site.ts                ← navigation, routes statiques, categoryMap
│   ├── i18n/translations.ts        ← clés de traduction UI
│   └── utils/blog.ts               ← getPostSlug, getPostUrl, enSlugMap…
├── astro.config.mjs                ← redirects SEO (meta-refresh fallback)
└── .gitattributes                  ← force LF sur *.sh et deploy/
```

## Écrire un article

### Article FR

Crée `src/content/blog/<rubrique>/<slug>.md` :

```markdown
---
title: "Titre de l'article"
excerpt: "Description courte (carte + meta fallback)"
publishDate: "2026-07-24"   # lundi ou jeudi UTC
category: "science"          # science | esprit | societe | grand-oral
featured: false
featuredRank: 99
readingTime: "12 min"
pillar: "Cognition"
tags: ["tag1", "tag2"]
seoTitle: "Titre SEO optimisé (intention de recherche)"
seoDescription: "Meta description ~155 car, sur l'intention réelle"
faq:
  - question: "Question fréquente ?"
    answer: "Réponse."
---

Contenu de l'article en Markdown…
```

### Traduction EN

Crée `src/content/blog-translations/en/<slug-fr>.md` (même nom de fichier que l'article FR). Le champ `enSlug` est requis si le slug EN diffère du FR — indispensable pour éviter les doublons d'indexation :

```markdown
---
title: "English Title"
excerpt: "English excerpt"
enSlug: "chess-and-cognition"   # ← slug de l'URL EN générée
seoTitle: "SEO title EN"
seoDescription: "Meta EN ~155 chars"
faq:
  - question: "English FAQ?"
    answer: "Answer."
---
```

Après ajout d'une traduction EN, régénérer la conf nginx des redirects :

```bash
node scripts/gen-nginx-redirects.mjs
# puis mettre à jour le VPS (voir section Déploiement)
```

### Calendrier de publication

Le build vérifie que les `publishDate` forment une grille **lundi/jeudi, 2 billets/semaine**. L'ancrage est dans `scripts/publish-schedule-constants.mjs`.

```bash
npm run check:publish-weekly      # vérification seule
npm run apply:publish-schedule    # replanifie automatiquement les dates futures
```

### PDFs grand oral

Les articles `category: "grand-oral"` affichent un bouton de téléchargement PDF. Les PDFs sont versionnés dans `public/pdfs/`. Pour les régénérer après modification :

```bash
npm run build     # dist/ doit exister avant
npm run pdfs      # Puppeteer → public/pdfs/<slug>.pdf
git add public/pdfs/
git commit -m "chore: regénère PDFs grand oral"
```

## Déploiement

### Architecture

Le VPS tourne nginx (listen 8080, derrière un reverse proxy TLS). Le déploiement est **pull-based** : le VPS interroge GitHub toutes les 2 min et lance le build si `main` a avancé.

```
git push → GitHub → (≤ 2 min) → cron VPS → git pull + npm ci + npm run build + rsync
```

Le script cron est `deploy/auto-deploy-poll.sh` (installé sur le VPS). Logs : `tail -f /var/www/site/deploy.log`.

### Déploiement manuel (si cron inactif)

```bash
sudo /usr/local/bin/deploy-site.sh
```

### Redirections 301 nginx

Les redirections SEO (cannibalisation, URLs legacy, slugs EN localisés) vivent à deux niveaux :

1. **`astro.config.mjs`** → pages meta-refresh générées au build (filet de sécurité)
2. **`deploy/nginx-redirects.conf`** → vrais 301 côté nginx (optimal SEO)

Le fichier nginx est **généré automatiquement** depuis le frontmatter des traductions :

```bash
node scripts/gen-nginx-redirects.mjs
```

Pour activer/mettre à jour sur le VPS :

```bash
sudo bash /var/www/site/repo/deploy/activate-nginx-redirects.sh
```

> **Note** : `public/.htaccess` est conservé pour cohérence mais **ignoré par nginx**. Ne jamais y ajouter de règles — utiliser `astro.config.mjs` + `nginx-redirects.conf`.

## Scripts utiles

```bash
npm run strip:em-dash:dry          # vérifie les tirets cadratin sans écrire
npm run strip:em-dash              # retire les tirets cadratin (—)
npm run indexnow                   # soumet les URLs à Bing IndexNow
node scripts/gen-nginx-redirects.mjs   # régénère la conf nginx des redirects
```

## Variables d'environnement

Voir `.env.example` pour la liste complète. Les variables `PUBLIC_*` sont embarquées dans le build client.

| Variable | Usage |
|---|---|
| `PUBLIC_REMARK42_URL` | URL de l'instance Remark42 (commentaires) |
| `PUBLIC_REMARK42_SITE` | Site ID Remark42 |
| `PUBLIC_NTFY_URL` | URL ntfy (notifications push) |
| `PUBLIC_NTFY_TOPIC` | Topic ntfy |
| `PUBLIC_NTFY_VAPID_KEY` | Clé VAPID publique (web push) |
