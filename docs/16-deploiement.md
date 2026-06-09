# 16 — Le déploiement : comment le site arrive sur Internet

Jusqu'ici, ce guide a parlé de ce que fait le site. Ce chapitre explique **comment il quitte l'ordinateur du développeur pour devenir accessible à n'importe qui sur la planète**, à tout moment. C'est le **déploiement** : l'ensemble des étapes qui transforment des fichiers locaux en un site en ligne.

---

## L'image d'ensemble

Le voyage d'un changement suit ce chemin :

```
Ordinateur local
      │
      │ git push
      ▼
GitHub (dépôt de code)
      │
      │ détecte le push → déclenche des workflows
      ▼
GitHub Actions (robots automatiques)
      │
      │ notifications envoyées
      │
      ▼
VPS (serveur loué, adresse 177.7.37.62)
      │   ↑
      │   └── scrute GitHub toutes les 2 min (cron)
      │       si nouveau commit → déploie
      │
      ├── /usr/local/bin/deploy-site.sh
      │     ├── git pull
      │     ├── npm ci
      │     ├── npm run build
      │     └── copie dist/ dans le webroot nginx
      ▼
nginx (serveur web)
      │
      ▼
Visiteur dans son navigateur
```

Trois acteurs principaux : **GitHub** (le coffre-fort du code), **GitHub Actions** (les robots automatiques), et le **VPS** (la machine qui héberge le site en permanence).

---

## GitHub : le coffre-fort du code

**GitHub** est une plateforme qui héberge le code source du projet (comme un Google Drive, mais pour du code, avec un historique complet de chaque modification). Chaque changement est enregistré dans un **commit** (une « photo » du code à un instant donné), et ces commits s'accumulent dans une **branche principale** appelée `main`.

La règle est simple : **tout passe par GitHub**. On ne modifie jamais rien directement sur le serveur. On travaille en local, on pousse vers GitHub, et le serveur vient chercher les changements tout seul.

### Les secrets GitHub

Certaines informations sont confidentielles : l'adresse IP du serveur, les clés d'accès SSH, les clés API des services externes. Ces informations ne doivent **jamais** apparaître dans le code (sinon elles seraient visibles publiquement). GitHub offre un mécanisme appelé **Secrets** (dans « Settings → Secrets and variables → Actions ») : des variables chiffrées, accessibles uniquement pendant l'exécution des workflows automatiques.

Les secrets utilisés par ce projet :

| Nom du secret | À quoi il sert |
|---|---|
| `DEPLOY_HOST` | L'adresse IP du VPS (pour la connexion SSH) |
| `DEPLOY_USER` | Le nom d'utilisateur sur le VPS (ex. `root`) |
| `DEPLOY_SSH_KEY` | La clé privée SSH qui autorise GitHub à se connecter au VPS |
| `NTFY_URL` | L'adresse du service de notifications push |
| `NTFY_TOPIC` | Le « canal » ntfy pour ce blog |
| `NTFY_TOKEN` | La clé secrète qui autorise l'envoi de notifications ntfy |
| `BREVO_API_KEY` | La clé API du service d'envoi d'e-mails Brevo (newsletter) |
| `BREVO_LIST_ID` | L'identifiant de la liste d'abonnés dans Brevo |
| `BREVO_SENDER_EMAIL` | L'adresse e-mail expéditrice |
| `BREVO_SENDER_NAME` | Le nom affiché comme expéditeur |

> **Image mentale.** Les secrets, c'est comme le trousseau de clés du site. Ils sont dans un coffre (GitHub), jamais imprimés sur le code, et les robots automatiques peuvent les emprunter le temps d'une tâche.

---

## GitHub Actions : les robots automatiques

**GitHub Actions** est un système d'automatisation intégré à GitHub. À chaque fois qu'un événement se produit (un push, une heure précise, une demande manuelle), GitHub peut exécuter automatiquement une série de tâches, définies dans des **fichiers de workflow** au format YAML, stockés dans `.github/workflows/`.

Ce projet en a **quatre** :

---

### 1. `deploy.yml` — Notifications post-publication

Ce workflow se déclenche à chaque **push sur `main`**.

> **Important :** contrairement à ce que son nom laisse entendre, ce workflow **ne déploie plus le site directement**. Il s'occupait autrefois du déploiement par SSH (GitHub → VPS), mais cette approche a échoué de façon répétée : la connexion SSH depuis les serveurs GitHub (hébergés chez Microsoft Azure) vers le VPS timeoutait en boucle, probablement à cause d'une route réseau instable. La solution a été d'**inverser le sens** : plutôt que GitHub « pousse » vers le VPS, c'est le VPS qui vient « tirer » depuis GitHub (voir la section sur le cron VPS ci-dessous). Le workflow `deploy.yml` gère désormais uniquement les **notifications** :

**Ce qu'il fait, étape par étape :**

1. **Détecte si un nouvel article a été publié** : il compare les fichiers modifiés entre le commit actuel et le précédent. Si un fichier dans `src/content/blog/` a changé, il extrait le slug et le titre de l'article depuis le frontmatter.

2. **Envoie une notification push (ntfy)** si un nouvel article est détecté. La notification arrive sur le téléphone de l'auteur (et des abonnés aux push) : titre de l'article, lien direct, icônes (♟️ + ✊).

3. **Programme un e-mail newsletter (Brevo) avec une heure de délai** : il appelle `scripts/send-new-article-email.mjs` pour prévenir les abonnés par e-mail. Le délai d'une heure laisse au VPS le temps de déployer l'article avant que les abonnés reçoivent le mail.

> **Léger décalage intentionnel :** la notification push part au moment du push (donc ~2 min avant que l'article soit en ligne). L'e-mail est envoyé H+1, donc sans problème. C'est un compromis acceptable.

---

### 2. `scheduled-publish.yml` — Reconstruction quotidienne

Ce workflow se déclenche **chaque matin à 06h00 UTC (08h00, heure de Paris)**, sept jours sur sept. Il peut aussi être lancé manuellement depuis l'onglet « Actions » de GitHub.

**Pourquoi une reconstruction quotidienne ?**

Les articles ont un champ `publishDate` dans leur frontmatter. Un article dont la date est demain est déjà dans le dépôt Git, mais il n'est pas encore « visible » : la page est générée seulement quand la date est passée. Sans reconstruction, un article dont la date est aujourd'hui ne s'afficherait jamais (le site a été construit hier). La reconstruction quotidienne à 06h00 UTC garantit que les **articles du jour apparaissent chaque matin**. C'est une publication différée automatique.

**Ce qu'il fait :**

1. Se connecte au VPS par SSH.
2. Exécute `/usr/local/bin/deploy-site.sh` sur le VPS (rebuild complet).
3. Si un nouvel article est apparu (détecté dans le diff git), envoie une notification ntfy.

---

### 3. `check-publish-schedule.yml` — Gardien du calendrier

Ce workflow se déclenche sur **pull request ou push** dès que des fichiers d'articles ou de scripts de calendrier sont modifiés.

**Ce qu'il fait :** il lance simplement `node scripts/check-publish-weekly.mjs`, le script qui vérifie que tous les articles futurs respectent la grille lundi/jeudi (voir [chapitre 10](10-publication-planning.md)). Si la grille est cassée, le workflow **échoue** et bloque le merge. C'est un filet de sécurité : on ne peut pas accidentellement créer un trou ou un doublon dans le calendrier.

---

### 4. `secrets-scan.yml` — Détecteur de fuites de secrets

Ce workflow se déclenche à **chaque push et pull request**. Il utilise l'outil **TruffleHog** pour scanner l'intégralité de l'historique git à la recherche de secrets accidentellement commités (clés API, mots de passe, certificats…).

> **Pourquoi c'est important.** Il suffit d'un commit maladroit (ex. : commiter un fichier `.env` contenant une clé API) pour que le secret soit exposé publiquement sur GitHub. TruffleHog détecte ces fuites automatiquement et le développeur peut agir immédiatement (révoquer le secret, purger l'historique).

---

## Le VPS : la machine qui sert le site

Un **VPS** (*Virtual Private Server*, serveur privé virtuel) est un ordinateur loué chez un hébergeur, qui tourne 24h/24, 7j/7, accessible via Internet. C'est là que le site est « en vie ». L'adresse IP de ce VPS est `177.7.37.62`, que le nom de domaine `blogdungaucher.com` pointe.

### Le déploiement « pull-based » : `auto-deploy-poll.sh`

Le fichier `deploy/auto-deploy-poll.sh` est installé sur le VPS et exécuté **toutes les 2 minutes** par le gestionnaire de tâches planifiées du serveur (le **cron**, l'équivalent Linux du Planificateur de tâches Windows).

**Ce qu'il fait à chaque exécution (toutes les 2 min) :**

1. Va dans le dossier du dépôt local (`/var/www/site/repo`).
2. Interroge GitHub (`git fetch`) pour voir si de nouveaux commits sont arrivés sur `main`.
3. Compare le commit local et le commit distant.
   - **Si identiques → rien à faire.** Il sort immédiatement, sans bruit (cas le plus fréquent, ~99 % des exécutions).
   - **Si différents → déploie.** Il appelle `/usr/local/bin/deploy-site.sh` et note l'opération dans un fichier journal (`/var/www/site/deploy.log`).

Un **verrou** (`flock`) empêche deux déploiements simultanés si un build prend plus de 2 minutes.

> **Image mentale.** Le VPS est un veilleur qui regarde GitHub toutes les 2 minutes depuis son poste. Quand il voit un nouveau colis arriver, il va le chercher et le livre. S'il n'y a rien, il attend tranquillement.

### Le script de déploiement : `deploy-site.sh`

Ce script, installé directement sur le VPS dans `/usr/local/bin/`, est **le cœur du déploiement**. Il enchaîne :

1. `git pull origin main` — télécharge le nouveau code depuis GitHub.
2. `npm ci` — installe les dépendances Node.js (version verrouillée par `package-lock.json`).
3. `npm run build` — fabrique le site complet (voir ci-dessous).
4. Copie le dossier `dist/` (le site construit) dans le dossier servi par nginx.

### Le build sur le VPS

La commande `npm run build` déclenche la chaîne complète (détaillée au [chapitre 11](11-scripts.md)) :

```
generate-og-png
       ↓
check-publish-weekly        ← vérifie la grille de publication
       ↓
astro build                 ← génère tous les fichiers HTML/CSS/JS
       ↓
pagefind --site dist        ← construit l'index de recherche
       ↓
verify-dist-urls            ← vérifie les URL produites
```

Si **n'importe quelle étape échoue**, le build s'arrête et l'ancienne version du site reste en ligne. Un site cassé n'est jamais mis en production.

---

## nginx : le portier du site

**nginx** (prononcé « engine-x ») est le **serveur web** installé sur le VPS. C'est lui qui répond aux navigateurs des visiteurs : quand quelqu'un tape `blogdungaucher.com`, c'est nginx qui reçoit la demande et renvoie le bon fichier HTML.

### Ce que fait nginx

- Sert les fichiers statiques depuis le webroot (là où `dist/` a été copié).
- Gère le **HTTPS** (le cadenas vert), grâce à un certificat SSL fourni par Let's Encrypt (renouvellement automatique).
- Redirige `http://` vers `https://`, et `www.blogdungaucher.com` vers `blogdungaucher.com`.
- Applique les **redirections 301** (voir ci-dessous).
- Gère les **en-têtes de sécurité** (Content-Security-Policy, X-Frame-Options…) et les **en-têtes de cache** (combien de temps le navigateur garde une ressource).

### Les redirections nginx : `nginx-redirects.conf`

Le fichier `deploy/nginx-redirects.conf` est un **snippet** (un morceau de configuration) nginx. Il contient **toutes les redirections 301** du site :

- Les **redirections d'articles fusionnés** (quand deux articles ont été fusionnés en un seul, l'ancienne URL redirige vers la nouvelle).
- Les **redirections de slugs anglais** (les anciennes URL anglaises `FR-slug` → les nouvelles `EN-slug`), soit ~62 lignes générées automatiquement par `scripts/gen-nginx-redirects.mjs`.
- Les **redirections d'orphelins** (pages EN dont la traduction a été supprimée mais dont la page HTML était encore accessible).

**Comment l'activer :** le script `deploy/activate-nginx-redirects.sh` s'en charge automatiquement. Lancé en root sur le VPS, il :
1. Copie le snippet vers `/etc/nginx/snippets/blog-redirects.conf`.
2. Vérifie que l'`include` est bien déclaré dans la configuration principale nginx.
3. Teste la configuration (`nginx -t`).
4. Recharge nginx sans interruption (`systemctl reload nginx`).

> **Différence nginx vs Astro pour les redirections :** le fichier `astro.config.mjs` déclare aussi des redirections (via la clé `redirects`), mais il génère des pages HTML avec une balise meta-refresh (redirection côté navigateur, lente). Les redirections nginx sont des **vraies 301 HTTP** (gérées par le serveur, instantanées, mieux comprises par Google). Les deux coexistent : les redirections Astro servent de filet de sécurité côté dist, les redirections nginx sont les « vraies ».

---

## La chaîne complète lors d'une publication d'article

Pour concluire, voici la chronologie complète d'une publication :

**Jour J, par exemple un jeudi :**

| Heure | Événement |
|---|---|
| J-∞ | L'article est écrit, son `publishDate` est dans le futur. Il est dans le dépôt Git mais sa page n'est pas générée. |
| J 00:00 | La `publishDate` est maintenant « passée ». Rien ne se passe encore (pas de rebuild). |
| **J 06:00 UTC** | `scheduled-publish.yml` se déclenche. Il se connecte au VPS et lance `deploy-site.sh`. |
| J 06:00+ | Sur le VPS : `git pull` → `npm ci` → `npm run build`. L'article dont la date est passée est maintenant inclus dans le build. |
| J ~06:05 | Le site est reconstruit. La nouvelle page HTML est en ligne. Les visiteurs voient l'article. |
| J 06:05 | Notification push ntfy envoyée. |
| J 07:00 | E-mail newsletter envoyé (H+1 après le push qui a déclenché la notification). |

**Lors d'un push de développeur (correctif, nouvel article, mise à jour) :**

| Étape | Délai | Ce qui se passe |
|---|---|---|
| `git push` | 0 s | Le code arrive sur GitHub. |
| GitHub Actions | ~30 s | `deploy.yml` et `secrets-scan.yml` démarrent. |
| VPS poll (cron) | 0–2 min | `auto-deploy-poll.sh` détecte le nouveau commit et lance `deploy-site.sh`. |
| Build sur VPS | ~2–4 min | Le site est reconstruit et mis en ligne. |
| **Total** | **~3–6 min** | Le changement est visible par tous les visiteurs. |

---

## Les variables d'environnement locales : `.env`

Pendant le **développement local** (sur l'ordinateur du développeur), certaines variables sont définies dans un fichier `.env` à la racine du projet. Ce fichier n'est **jamais** commité dans Git (il est listé dans `.gitignore`). Il peut contenir des clés API pour les tests locaux, l'URL du site en développement, etc.

En production, les secrets sont fournis via les **Secrets GitHub** (pour les workflows Actions) et via des variables d'environnement configurées directement sur le VPS.

---

## En résumé

| Besoin | Solution |
|---|---|
| Stocker et versionner le code | GitHub |
| Garder les clés secrètes | GitHub Secrets |
| Automatiser les notifications | GitHub Actions (`deploy.yml`) |
| Publier les articles à date différée | GitHub Actions (`scheduled-publish.yml`, cron 06:00 UTC) |
| Vérifier le calendrier automatiquement | GitHub Actions (`check-publish-schedule.yml`) |
| Détecter les fuites de secrets | GitHub Actions (`secrets-scan.yml` + TruffleHog) |
| Déployer le code sur le serveur | VPS cron toutes les 2 min (`auto-deploy-poll.sh`) |
| Construire le site | `deploy-site.sh` + `npm run build` |
| Servir les pages aux visiteurs | nginx |
| Gérer les redirections 301 | `deploy/nginx-redirects.conf` + nginx |

L'ensemble est **robuste** : aucun composant n'est un point de défaillance unique. Si GitHub Actions est lent, le cron VPS déploie quand même. Si nginx rechargé a une erreur, `nginx -t` l'arrête avant d'appliquer la mauvaise configuration. Si le build échoue, l'ancienne version reste en ligne.

---

⬅️ Précédent : [15 — Les PDF et les vidéos](15-pdf-et-videos.md) | ➡️ Suivant : [17 — Glossaire](17-glossaire.md)
