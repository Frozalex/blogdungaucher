# 17 — Glossaire

Ce glossaire rassemble et explique simplement **tous les termes techniques** utilisés dans cette documentation. L'objectif : qu'un lecteur sans formation informatique puisse comprendre n'importe quel mot rencontré dans les chapitres précédents, sans avoir à chercher ailleurs.

Les termes sont classés **par ordre alphabétique**.

---

## A

### Ancre (lien)
Un lien qui pointe non pas vers une page, mais vers une **section précise** d'une page. Dans l'URL, l'ancre est identifiée par un `#` suivi d'un identifiant (`/fr/blog/mon-article/#introduction`). Quand on clique dessus, la page défile directement jusqu'à la section concernée.

### API (Application Programming Interface)
Une **interface** permettant à deux programmes de se parler. Concrètement : une API est un ensemble de « portes » qu'un service expose pour que d'autres programmes puissent lui envoyer des données ou en récupérer. Par exemple, l'API de Brevo permet au site d'envoyer un e-mail newsletter en lui transmettant les bonnes informations (contenu, destinataires, clé d'accès).

### Astro
Le **générateur de site statique** utilisé pour construire ce projet. Astro prend les fichiers de contenu (Markdown) et les gabarits (`.astro`) et les assemble en pages HTML prêtes à être servies. Sa particularité : il envoie très peu de JavaScript au navigateur, ce qui rend les pages très rapides. (Voir [chapitre 01](01-concepts-de-base.md) et [chapitre 03](03-gabarits.md).)

### Attribut `alt` (image)
Texte alternatif décrivant une image, présent dans le code HTML. Il sert à deux choses : (1) s'afficher si l'image ne charge pas ; (2) être lu par les lecteurs d'écran pour les personnes malvoyantes. Il est aussi utilisé par Google pour comprendre le contenu d'une image.

---

## B

### Balise HTML
Les **briques de base** d'une page web. Une balise est un mot-clé entre chevrons qui indique la nature d'un contenu : `<h1>` pour un titre principal, `<p>` pour un paragraphe, `<img>` pour une image, `<a>` pour un lien, etc. Les balises vont souvent par paires (ouvrante `<p>` et fermante `</p>`).

### Balise `<head>`
Section invisible d'une page HTML (les visiteurs ne la voient pas) qui contient des **métadonnées** : titre de l'onglet, description pour Google, liens vers les CSS, scripts, instructions pour les moteurs de recherche (canonical, hreflang…). Tout ce qui configure la page sans être affiché directement.

### Branch / Branche (Git)
Une **ligne de travail indépendante** dans l'historique Git. La branche principale s'appelle `main`. On peut créer des branches pour travailler sur une nouvelle fonctionnalité sans toucher au code stable, puis les fusionner (merge) dans `main` une fois terminé.

### Brevo
Service d'envoi d'**e-mails en masse** (newsletters) utilisé par ce projet. Il gère la liste d'abonnés, la mise en forme des e-mails et l'envoi. Le site interagit avec Brevo via son API.

### Build (construction)
L'étape qui **transforme le code source en site prêt à être mis en ligne**. Pendant le build, Astro lit tous les fichiers Markdown et les gabarits, génère les pages HTML, copie les images, construit l'index de recherche, etc. Le résultat est le dossier `dist/`. (Voir [chapitre 02](02-structure-projet.md) et [chapitre 11](11-scripts.md).)

---

## C

### Cache
Un **espace de stockage temporaire** où l'on garde des copies de fichiers déjà téléchargés, pour les resservir instantanément sans avoir à les retélécharger. Il existe plusieurs niveaux de cache : le cache du navigateur (local au visiteur), le cache du service worker (PWA), les en-têtes HTTP qui instruisent les navigateurs sur la durée de vie d'un fichier.

### Cache-first (stratégie)
Stratégie du service worker : « serve d'abord depuis le cache, ignore le réseau ». Utilisée pour les fichiers qui ne changent jamais (polices, CSS avec empreinte). Avantage : instantané. (Voir [chapitre 13](13-pwa-hors-ligne.md).)

### Canonical (URL canonique)
Balise HTML (`<link rel="canonical" href="…">`) qui dit aux moteurs de recherche : « parmi toutes les variantes de cette URL, c'est celle-ci qui est la version officielle à indexer ». Évite que Google pénalise un site pour contenu dupliqué quand la même page est accessible par plusieurs URLs. (Voir [chapitre 09](09-seo.md).)

### Cannibalisation SEO
Situation où **deux pages du même site se disputent le même mot-clé** dans Google. Google ne sait pas laquelle mettre en avant, les deux se font concurrence, et résultat : ni l'une ni l'autre ne se classe bien. La solution est de fusionner les deux pages en une seule et d'établir une redirection 301. (Voir [chapitre 09](09-seo.md).)

### Certificat SSL / HTTPS
Un **certificat SSL** est un petit fichier cryptographique qui prouve l'identité d'un site web. Quand un site a un certificat valide, le navigateur affiche `https://` et un cadenas vert. Cela signifie que la communication entre le visiteur et le serveur est **chiffrée** (personne ne peut l'intercepter). Le site utilise Let's Encrypt, une autorité gratuite qui renouvelle automatiquement les certificats.

### Champ / Field (frontmatter)
Un **élément de métadonnée** dans le frontmatter YAML d'un article. Par exemple, `title:`, `publishDate:`, `category:` sont des champs. Chaque champ a un nom (la clé) et une valeur. (Voir [chapitre 04](04-articles.md).)

### `chess.js`
Bibliothèque JavaScript gérant les **règles du jeu d'échecs** (coups légaux, détection de l'échec et mat, etc.) dans le navigateur. Utilisée par la page d'analyse. (Voir [chapitre 14](14-fonctionnalites-interactives.md).)

### CI/CD (Intégration et Déploiement Continus)
Ensemble de pratiques visant à **automatiser** les étapes de vérification et de mise en ligne du code. Dans ce projet : chaque `git push` déclenche automatiquement des vérifications (calendrier, scan de secrets) et le déploiement. L'objectif est d'éviter les erreurs humaines et de raccourcir le délai entre l'écriture du code et sa mise en ligne.

### Clic (CTA — Call To Action)
Un **bouton ou lien qui invite le visiteur à agir** : « Lire l'article », « S'abonner », « Télécharger le PDF ». Le CTA est un concept marketing intégré dans la structure des pages.

### Collection (Astro)
Un **groupe d'articles du même type** géré par Astro. Ce projet a quatre collections : `blog` (les articles FR), `enTranslations` (les traductions EN), `ptBrTranslations` (les traductions PT-BR), `dissertations` (les sujets de Grand oral). Chaque collection a son schéma Zod. (Voir [chapitre 04](04-articles.md).)

### Commit
Un **enregistrement d'un changement dans Git**. Chaque commit est une « photo » de l'état du projet à un instant donné, avec un message décrivant ce qui a changé. L'ensemble des commits forme l'historique complet du projet.

### Composant (Astro)
Un **morceau de page réutilisable**, défini dans un fichier `.astro`. Un composant peut être aussi simple qu'un bouton ou aussi complexe qu'une barre de navigation entière. On l'inclut dans d'autres pages ou composants au lieu de copier-coller le même code partout. (Voir [chapitre 03](03-gabarits.md).)

### Content Security Policy (CSP)
Un **en-tête HTTP de sécurité** qui dit au navigateur quelles sources sont autorisées à charger des ressources (scripts, images, polices…). Il empêche les attaques de type XSS (injection de code malveillant depuis un site tiers).

### Core Web Vitals
Les **métriques officielles de Google** pour mesurer la qualité de l'expérience utilisateur d'une page web. Les trois principales : **LCP** (vitesse d'affichage du contenu principal), **FID/INP** (réactivité aux interactions), **CLS** (stabilité visuelle de la mise en page). Google en tient compte dans son classement. (Voir [chapitre 12](12-performance.md).)

### Cron (tâche planifiée)
Un **planificateur de tâches** sur les serveurs Linux. On lui donne une commande et un horaire (`*/2 * * * *` = toutes les 2 minutes), et il exécute la commande automatiquement. Le déploiement pull-based et la reconstruction quotidienne utilisent tous deux le cron. (Voir [chapitre 16](16-deploiement.md).)

### CSS (Cascading Style Sheets)
Le langage qui définit l'**apparence** des pages web : couleurs, tailles de police, marges, animations, disposition des éléments. Sans CSS, une page HTML ressemblerait à un simple document texte. « Cascading » signifie que les règles s'appliquent en cascade (les règles plus spécifiques écrasent les règles générales). (Voir [chapitre 07](07-design.md).)

### CSS scoped (Astro)
Mécanisme d'Astro qui **isole les styles CSS** d'un composant : les règles CSS définies dans un composant `.astro` ne s'appliquent qu'à ce composant, jamais aux autres. Cela évite les conflits accidentels de style. Quand on veut qu'un style s'applique au-delà du composant (ex. : sur du HTML injecté dynamiquement), on utilise `:global(…)`. (Voir [chapitre 07](07-design.md).)

---

## D

### Dark mode (mode sombre)
Affichage d'une interface avec un fond sombre et du texte clair, moins fatigant pour les yeux dans l'obscurité. Le site supporte le mode sombre, avec mémorisation du choix du visiteur. Une technique spéciale (script inline dans `<head>`) empêche le flash blanc au chargement si le mode sombre est actif. (Voir [chapitre 07](07-design.md).)

### Deploy / Déploiement
L'action de **mettre le site à jour sur le serveur de production**, pour que les visiteurs voient la nouvelle version. (Voir [chapitre 16](16-deploiement.md).)

### `dist/`
Le dossier produit par le build. Il contient **le site entier, prêt à être servi** : tous les fichiers HTML, CSS, JavaScript, images, et l'index de recherche Pagefind. C'est ce dossier qui est copié dans le webroot de nginx. (Voir [chapitre 02](02-structure-projet.md).)

### DNS (Domain Name System)
Le **système qui traduit un nom de domaine en adresse IP**. Quand un visiteur tape `blogdungaucher.com`, le DNS indique à son navigateur que ce nom correspond à l'IP `177.7.37.62`. C'est l'annuaire d'Internet.

### DOM (Document Object Model)
La **représentation en mémoire** d'une page HTML dans le navigateur. JavaScript peut manipuler le DOM pour ajouter, modifier ou supprimer des éléments de la page en temps réel, sans recharger.

### Drop-cap (lettrine)
La **première lettre d'un article, affichée en grand**. Tradition typographique des livres anciens. Implémentée en CSS avec la propriété `initial-letter`. (Voir [chapitre 07](07-design.md).)

---

## E

### En-têtes HTTP (headers)
Des **métadonnées invisibles** transmises par le serveur avec chaque réponse HTTP. Elles donnent des instructions au navigateur : combien de temps garder le fichier en cache, quelles sources sont autorisées (CSP), si la page peut être intégrée dans une iframe, etc.

### `enSlug`
Champ du frontmatter des articles traduits en anglais. Contient le **slug anglais** (l'identifiant URL en anglais). Exemple : `enSlug: "chess-and-alzheimer-prevention"`. Utilisé pour générer les redirections de l'ancienne URL (`/en/blog/echecs-et-seniors/`) vers la nouvelle (`/en/blog/chess-and-alzheimer-prevention/`). (Voir [chapitre 08](08-i18n.md).)

### Extension `.mjs`
Extension des fichiers **JavaScript modernes avec modules**. Le `.m` signifie « module » : le fichier peut utiliser `import` et `export` (la syntaxe ES Modules moderne, plus claire que l'ancien `require`). Les scripts de ce projet sont en `.mjs`.

---

## F

### FEN (Forsyth-Edwards Notation)
Un format texte compact pour décrire une **position d'échecs**. Exemple : `rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1` représente la position de départ. Utilisé par la page d'analyse.

### flock (verrou fichier)
Mécanisme Linux de **verrouillage** qui empêche deux processus d'exécuter simultanément le même code. Dans `auto-deploy-poll.sh`, il garantit qu'un seul build se déroule à la fois, même si le cron se déclenche pendant un build en cours.

### Fonte / Police de caractères
Un **ensemble de glyphes** (lettres, chiffres, symboles) partageant un style visuel cohérent. Ce site utilise trois polices : **Space Grotesk** pour les titres, **Fraunces** pour les accents décoratifs, et **Outfit** pour le corps du texte. (Voir [chapitre 07](07-design.md).)

### Frontmatter
Bloc de métadonnées **au début d'un fichier Markdown**, délimité par des triples tirets `---`. Il contient les informations structurées sur l'article (titre, date, description, catégorie, etc.) au format YAML. Ce n'est pas du contenu visible mais des données que le programme lit. (Voir [chapitre 04](04-articles.md).)

---

## G

### Gabarit (layout)
Un fichier `.astro` qui définit **l'enveloppe commune** de plusieurs pages : le `<head>`, la barre de navigation, le pied de page. Chaque page « s'insère » dans un gabarit. Évite de répéter le même code sur chaque page. (Voir [chapitre 03](03-gabarits.md).)

### `getStaticPaths()`
Fonction spéciale d'Astro qui indique **quelles pages générer** pour une route dynamique. Par exemple, pour la route `/fr/blog/[slug]/`, cette fonction retourne la liste de tous les articles, et Astro génère une page HTML pour chacun. (Voir [chapitre 03](03-gabarits.md).)

### Git
Un **système de gestion de versions**. Il permet de suivre l'historique complet de tous les fichiers d'un projet, de revenir en arrière en cas d'erreur, et de travailler à plusieurs sans écraser le travail des autres. Chaque changement est enregistré dans un commit. (Voir [chapitre 16](16-deploiement.md).)

### GitHub
Plateforme web qui **héberge des dépôts Git** et offre des fonctionnalités collaboratives (issues, pull requests, Actions). C'est le « coffre-fort » central du code source de ce projet. (Voir [chapitre 16](16-deploiement.md).)

### GitHub Actions
Système d'**automatisation intégré à GitHub**. Des workflows (définis en YAML dans `.github/workflows/`) s'exécutent automatiquement en réponse à des événements (push, cron, etc.). (Voir [chapitre 16](16-deploiement.md).)

### GitHub Secrets
Variables **chiffrées et sécurisées** stockées dans GitHub, accessibles aux workflows Actions sans apparaître dans le code source. Utilisées pour les clés API, mots de passe et adresses de serveurs. (Voir [chapitre 16](16-deploiement.md).)

### giscus
Système de **commentaires** basé sur les Discussions GitHub. Aucune base de données requise : les commentaires sont des fils de discussion GitHub. Les visiteurs se connectent avec leur compte GitHub pour commenter. (Voir [chapitre 14](14-fonctionnalites-interactives.md).)

### Google Analytics
Service de **mesure d'audience** proposé par Google. Il enregistre les pages visitées, la durée des visites, l'origine des visiteurs, etc. Il ne se charge qu'après le consentement du visiteur (RGPD). (Voir [chapitre 14](14-fonctionnalites-interactives.md).)

### Google Search Console (GSC)
Outil gratuit de Google qui donne des **informations sur la présence du site dans les résultats de recherche** : quelles requêtes amènent des visiteurs, combien de clics et d'impressions, les erreurs d'indexation, etc. Indispensable pour le suivi SEO.

---

## H

### HTML (HyperText Markup Language)
Le **langage de base du web**. Un fichier HTML décrit la structure et le contenu d'une page (titres, paragraphes, images, liens). Le navigateur lit le HTML et l'affiche. CSS le met en forme, JavaScript le rend interactif.

### hreflang
Attribut dans les balises `<link>` du `<head>` d'une page, qui indique aux moteurs de recherche qu'il existe des **versions de cette page dans d'autres langues**. Exemple : `<link rel="alternate" hreflang="en" href="https://…/en/blog/…/">`. Cela évite que Google affiche la version française à un anglophone. (Voir [chapitre 08](08-i18n.md) et [chapitre 09](09-seo.md).)

### HTTPS
Version sécurisée du protocole HTTP, où les communications sont **chiffrées** par SSL. Les URLs commencent par `https://`. Google favorise les sites HTTPS dans son classement.

---

## I

### i18n (internationalisation)
Abréviation de « internationalisation » (18 lettres entre le « i » et le « n »). Désigne l'ensemble des mécanismes permettant d'**adapter un site à plusieurs langues et cultures**. Sur ce site : traductions des articles (EN, PT-BR), traduction de l'interface (boutons, libellés), URLs localisées, balises hreflang. (Voir [chapitre 08](08-i18n.md).)

### IndexNow
Protocole permettant de **notifier instantanément les moteurs de recherche** (Bing, Yandex…) qu'une page a été mise à jour, sans attendre qu'ils la redécouvrent d'eux-mêmes. Accélère l'indexation des nouveaux articles. (Voir [chapitre 09](09-seo.md) et [chapitre 11](11-scripts.md).)

### Inline (CSS/JS/Base64)
Intégrer un morceau de code **directement dans un fichier** au lieu de le référencer depuis un fichier externe. Exemples : un style CSS inline dans une balise `style="…"`, un script inline dans `<script>`, une image encodée en Base64 dans le HTML. Avantage : une requête HTTP de moins. Inconvénient : le fichier est plus lourd et le contenu n'est pas mis en cache séparément.

---

## J

### JavaScript (JS)
Le **langage de programmation du web côté navigateur**. Il rend les pages interactives : réagit aux clics, modifie le DOM, communique avec des APIs. C'est aussi le langage des scripts Node.js côté serveur. (Voir [chapitre 05](05-javascript.md).)

### JSON (JavaScript Object Notation)
Format texte léger pour représenter des **données structurées**. Exemple : `{"titre": "Mon article", "date": "2026-06-07"}`. Très utilisé pour échanger des données entre programmes (APIs, fichiers de configuration).

### JSON-LD
Format pour les **données structurées SEO**, injecté dans une balise `<script type="application/ld+json">` dans le `<head>`. Il décrit le contenu de la page en termes compréhensibles par les moteurs de recherche (type de page, auteur, date, FAQ…). Active des **rich snippets** (extraits enrichis) dans les résultats Google. (Voir [chapitre 09](09-seo.md).)

---

## K

### KaTeX
Bibliothèque JavaScript pour **afficher des formules mathématiques** dans une page web à partir d'une notation LaTeX (`$E = mc^2$`). Sur ce site, le rendu est fait au moment du build (pas dans le navigateur du visiteur), donc les formules s'affichent instantanément, sans JavaScript. (Voir [chapitres 12](12-performance.md) et [14](14-fonctionnalites-interactives.md).)

---

## L

### LaTeX
Système de composition de documents scientifiques, connu pour la qualité de ses formules mathématiques. La notation `$…$` pour les équations est héritée de LaTeX et reprise par KaTeX et d'autres outils.

### LCP (Largest Contentful Paint)
Indicateur Core Web Vitals : le **temps que met le plus gros élément visible à apparaître** (souvent le titre ou l'image principale). Objectif : moins de 2,5 secondes. Sur ce site, l'animation d'apparition du titre a été supprimée pour passer de ~5 s à ~2,9 s. (Voir [chapitre 12](12-performance.md).)

### Let's Encrypt
**Autorité de certification gratuite** qui fournit des certificats SSL/TLS pour HTTPS. Les certificats sont valables 90 jours et se renouvellent automatiquement via l'outil `certbot`.

### Locale
Un **identifiant de langue et région** utilisé pour l'internationalisation. Exemples : `fr` (français), `en` (anglais), `pt-BR` (portugais du Brésil). Utilisé dans les URLs (`/fr/`, `/en/`), les balises hreflang, et les fichiers de traduction.

---

## M

### Markdown
Un **format de texte simplifié** pour écrire du contenu avec une mise en forme légère. `# Titre` génère un titre, `**gras**` génère du gras, `- élément` génère une liste. Les articles du blog sont écrits en Markdown (`.md`). Astro les transforme en HTML pendant le build. (Voir [chapitre 04](04-articles.md).)

### Méta-description
Texte court (~155 caractères) dans le `<head>` d'une page, décrivant son contenu. Il n'influence pas directement le classement, mais il apparaît souvent dans les résultats Google comme **résumé de la page**. Un bon résumé augmente le taux de clic.

### Métadonnées
**Données qui décrivent des données**. Dans le contexte web : les informations sur une page (titre, auteur, date, description) plutôt que le contenu lui-même. Dans un article Markdown, c'est le frontmatter. Dans une page HTML, c'est le `<head>`.

### Minification
Processus de **réduction de la taille** d'un fichier CSS ou JavaScript en supprimant les espaces, les commentaires, et en raccourcissant les noms de variables. Résultat : un fichier plus petit, plus rapide à transférer. Astro minifie automatiquement lors du build.

### `.mjs`
Voir **Extension `.mjs`**.

### Motion Canvas
Outil permettant de **créer des vidéos d'animation à partir de code**. Utilisé pour les vidéos récap d'articles. Le projet vidéo est dans le dossier `motion-canvas/`. (Voir [chapitre 15](15-pdf-et-videos.md).)

---

## N

### Network-first (stratégie)
Stratégie du service worker : « va chercher sur le réseau d'abord, utilise le cache seulement si le réseau échoue ». Utilisée pour les pages HTML pour toujours servir la version la plus récente. (Voir [chapitre 13](13-pwa-hors-ligne.md).)

### nginx
**Serveur web** installé sur le VPS. Il reçoit les requêtes HTTP des navigateurs et renvoie les bons fichiers. Il gère aussi le HTTPS, les redirections 301, les en-têtes de sécurité et le cache. (Voir [chapitre 16](16-deploiement.md).)

### Node.js
Environnement qui permet de **faire tourner du JavaScript en dehors d'un navigateur** (sur un serveur ou en ligne de commande). Tous les scripts du dossier `scripts/` sont exécutés par Node.js. (Voir [chapitre 11](11-scripts.md).)

### npm (Node Package Manager)
Le **gestionnaire de paquets** de Node.js. Permet d'installer des bibliothèques (`npm install`) et de lancer des commandes raccourcies (`npm run build`). Le fichier `package.json` liste les dépendances et les raccourcis.

### ntfy
Service de **notifications push** simple et open source. Utilisé pour envoyer une alerte sur le téléphone (ou du navigateur) quand un nouvel article paraît. (Voir [chapitres 13](13-pwa-hors-ligne.md) et [16](16-deploiement.md).)

---

## O

### OG (Open Graph)
Protocole de métadonnées qui contrôle **l'aperçu d'un lien partagé** sur les réseaux sociaux (Facebook, Twitter, LinkedIn, Slack…). Les balises OG dans le `<head>` définissent le titre, la description et l'image qui s'affichent quand on partage un lien. (Voir [chapitre 09](09-seo.md).)

### Open Source
Logiciel dont le **code source est accessible et librement modifiable**. La majorité des outils utilisés dans ce projet (Astro, Node.js, Pagefind, giscus…) sont open source.

---

## P

### `package.json`
Fichier de configuration du projet Node.js. Il liste les **dépendances** (bibliothèques utilisées), les **scripts raccourcis** (`npm run build`, etc.) et les métadonnées du projet (nom, version). (Voir [chapitres 02](02-structure-projet.md) et [11](11-scripts.md).)

### Pagefind
Outil de **recherche statique** : il génère un index après le build, et cet index est utilisé par le navigateur pour faire des recherches sans serveur. (Voir [chapitre 14](14-fonctionnalites-interactives.md).)

### PGN (Portable Game Notation)
Format standard pour enregistrer une **partie d'échecs** complète, coup par coup. Exemple : `1. e4 e5 2. Nf3 …`. Utilisé par la page d'analyse.

### Pilier (pillar page)
Un article « maître » qui traite d'un sujet en profondeur et sert de **hub de liens** vers des articles plus spécifiques. Concept de stratégie de contenu SEO (architecture en piliers et grappes). (Voir [chapitre 10](10-publication-planning.md).)

### Polices non-bloquantes
Technique de chargement des polices qui évite de **bloquer l'affichage** de la page pendant le téléchargement. La propriété CSS `font-display: swap` affiche d'abord le texte avec une police de secours, puis remplace par la police désirée une fois chargée. (Voir [chapitre 07](07-design.md).)

### Précache
Dans le contexte du service worker : **mise en cache préventive** de ressources clés au moment de l'installation, avant même que le visiteur les demande. Permet d'accéder à ces pages hors ligne dès la première installation. (Voir [chapitre 13](13-pwa-hors-ligne.md).)

### `preload` (attribut)
Instruction dans le `<head>` demandant au navigateur de **télécharger une ressource en priorité** avant d'en avoir besoin. Utilisé pour la police Space Grotesk (la police des titres) pour améliorer le LCP. (Voir [chapitre 12](12-performance.md).)

### `publishDate`
Champ du frontmatter définissant la **date de publication** d'un article. Les articles dont la date est dans le futur ne sont pas inclus dans le build. La reconstruction quotidienne révèle les articles du jour. (Voir [chapitre 04](04-articles.md) et [chapitre 10](10-publication-planning.md).)

### Pull-based (déploiement)
Stratégie de déploiement où c'est **le serveur qui va chercher les mises à jour** sur GitHub (plutôt que GitHub qui « pousse » vers le serveur). Plus robuste face aux instabilités réseau. (Voir [chapitre 16](16-deploiement.md).)

### PWA (Progressive Web App)
Un site web qui se comporte comme une **application installable**. Il peut être ajouté à l'écran d'accueil du téléphone, fonctionner hors ligne (partiellement), et recevoir des notifications. Repose sur deux technologies : le manifeste JSON et le service worker. (Voir [chapitre 13](13-pwa-hors-ligne.md).)

---

## R

### Récursivité (`walk()`)
Technique de programmation où une **fonction s'appelle elle-même** pour traiter des structures imbriquées. Dans ce projet, la fonction `walk()` parcourt récursivement les sous-dossiers du dossier `blog/` pour trouver tous les fichiers `.md`, quelle que soit la profondeur d'imbrication. (Voir [chapitres 04](04-articles.md) et [10](10-publication-planning.md).)

### Redirection 301
Instruction donnée par le serveur qui dit au navigateur et aux moteurs de recherche : « cette URL a définitivement déménagé ici ». Les 301 transmettent le **PageRank** (l'autorité SEO) de l'ancienne URL vers la nouvelle. Utilisées lors de fusions d'articles ou de renommages. (Voir [chapitre 09](09-seo.md) et [chapitre 16](16-deploiement.md).)

### Remotion
Outil de création de vidéos par le code (remplacé par Motion Canvas). Encore mentionné dans `package.json` pour trace historique. (Voir [chapitre 15](15-pdf-et-videos.md).)

### RGPD (GDPR)
**Règlement Général sur la Protection des Données**. Loi européenne qui oblige les sites à informer les visiteurs sur la collecte de leurs données et à obtenir leur consentement avant d'activer des traceurs (analytics, publicité). Mis en œuvre par le composant `CookieConsent`. (Voir [chapitre 14](14-fonctionnalites-interactives.md).)

### Rich snippet (extrait enrichi)
Résultat de recherche Google **enrichi visuellement** : étoiles de notation, FAQ déroulante, étapes d'une recette… Activé par les données structurées JSON-LD. (Voir [chapitre 09](09-seo.md).)

### Route dynamique
Dans Astro, une route dont une partie de l'URL est **variable** (entre crochets). Exemple : `/fr/blog/[slug]/` génère une page différente pour chaque article selon son slug. Astro utilise `getStaticPaths()` pour savoir quelles pages générer. (Voir [chapitre 03](03-gabarits.md).)

---

## S

### Schéma Zod
Une définition rigoureuse de la **structure attendue** pour les données d'un article. Zod vérifie que chaque article a bien un `title` (texte), un `publishDate` (date valide), une `category` (parmi une liste autorisée), etc. Si un article a un champ manquant ou incorrect, le build échoue avec un message d'erreur clair. (Voir [chapitre 04](04-articles.md).)

### SEO (Search Engine Optimization)
Ensemble de techniques visant à **améliorer le positionnement d'un site dans les résultats des moteurs de recherche**. Sur ce site : titres optimisés, métadescriptions, données structurées JSON-LD, hreflang, canonical, plan du site (sitemap), vitesse, redirections 301. (Voir [chapitre 09](09-seo.md).)

### Service Worker
Petit programme JavaScript qui **tourne en arrière-plan dans le navigateur**, indépendamment de la page. Il peut intercepter les requêtes réseau, gérer le cache, et recevoir des notifications push. Pièce maîtresse de la PWA. (Voir [chapitre 13](13-pwa-hors-ligne.md).)

### Sitemap
Fichier `sitemap.xml` listant **toutes les URLs du site**, avec leur date de dernière modification. Il aide les moteurs de recherche à découvrir et indexer toutes les pages. Astro le génère automatiquement au build. (Voir [chapitre 09](09-seo.md).)

### Slug
**L'identifiant URL d'un article** : la partie lisible à la fin de l'adresse. Exemple : dans `/fr/blog/echecs-et-alzheimer/`, le slug est `echecs-et-alzheimer`. Un bon slug est court, descriptif, tout en minuscules, avec des tirets. (Voir [chapitre 04](04-articles.md).)

### SSH (Secure Shell)
Protocole permettant de **se connecter et d'exécuter des commandes à distance** sur un serveur, de façon sécurisée et chiffrée. `scheduled-publish.yml` utilise SSH pour déclencher le build sur le VPS. (Voir [chapitre 16](16-deploiement.md).)

### Stale-while-revalidate (stratégie)
Stratégie du service worker : « sers le fichier en cache immédiatement, et mets-le à jour en arrière-plan pour la prochaine visite ». Utilisée pour les images. (Voir [chapitre 13](13-pwa-hors-ligne.md).)

### Statique (site statique)
Un site dont **toutes les pages sont pré-générées** sous forme de fichiers HTML, avant toute visite. Opposé à un site dynamique (qui génère la page à la volée à chaque requête). Avantages : rapide, sûr, pas besoin de base de données. (Voir [chapitre 01](01-concepts-de-base.md).)

### Stockfish
**Moteur d'analyse d'échecs** open source, considéré comme l'un des plus forts au monde. Sa version WebAssembly tourne directement dans le navigateur, sans serveur. Utilisé par la page d'analyse (désactivée pour l'instant). (Voir [chapitre 14](14-fonctionnalites-interactives.md).)

### SVGO
Outil d'**optimisation de fichiers SVG**. Il supprime les données inutiles (métadonnées d'éditeur, précision excessive des coordonnées…) sans changer l'apparence visuelle. Le logo a été réduit de 29 ko à 10 ko avec cet outil. (Voir [chapitres 11](11-scripts.md) et [12](12-performance.md).)

### SVG (Scalable Vector Graphics)
Format d'image **vectorielle** : l'image est décrite par des formes mathématiques (cercles, lignes, courbes) plutôt que par des pixels. Avantage : elle est nette à toutes les tailles (logo sur un écran 4K ou sur une montre). Inconvénient : pour les photos, le format est très lourd.

---

## T

### Token (jeton d'authentification)
Un **code secret** (une longue chaîne de caractères) qui prouve l'identité d'un programme auprès d'un service. Comme un mot de passe, mais prévu pour être utilisé par des machines. Les `NTFY_TOKEN`, `BREVO_API_KEY` etc. sont des tokens.

### TruffleHog
Outil de **scan de secrets dans Git**. Il parcourt l'historique des commits à la recherche de clés API, mots de passe ou certificats accidentellement commités. Utilisé dans le workflow `secrets-scan.yml`. (Voir [chapitre 16](16-deploiement.md).)

### TypeScript
Une **version enrichie de JavaScript** qui ajoute des types (on précise qu'une variable est un texte, un nombre, un objet d'une certaine forme…). L'éditeur de code détecte les erreurs à l'avance. Les fichiers `.ts` et `.astro` du projet utilisent TypeScript. (Voir [chapitre 05](05-javascript.md).)

---

## U

### URL (Uniform Resource Locator)
L'**adresse d'une ressource sur Internet** : `https://blogdungaucher.com/fr/blog/echecs-et-alzheimer/`. Composants : protocole (`https://`), domaine (`blogdungaucher.com`), chemin (`/fr/blog/echecs-et-alzheimer/`).

---

## V

### Validation de schéma
Processus de **vérification automatique** que des données respectent une structure définie. Zod est utilisé pour valider les frontmatters des articles au moment du build. Si un champ obligatoire manque ou a un mauvais type, le build échoue immédiatement avec un message clair. (Voir [chapitre 04](04-articles.md).)

### Versionnement (Git)
La pratique de **garder un historique complet de toutes les modifications** d'un projet. À tout moment, on peut revenir à une version antérieure, voir qui a changé quoi et pourquoi. Git est le système de versionnement utilisé. (Voir [chapitre 16](16-deploiement.md).)

### VPS (Virtual Private Server)
Un **serveur dédié virtuel** : un ordinateur loué chez un hébergeur, tournant 24/7. Contrairement à un hébergement mutualisé, on a un accès complet au système (installation de logiciels, configuration nginx…). Le VPS de ce projet est à l'adresse IP `177.7.37.62`. (Voir [chapitre 16](16-deploiement.md).)

---

## W

### WebAssembly (WASM)
Format binaire permettant d'**exécuter du code haute performance** dans le navigateur. Stockfish est compilé en WebAssembly pour tourner rapidement dans le navigateur sans plugin. (Voir [chapitre 14](14-fonctionnalites-interactives.md).)

### Webroot
Le **dossier racine servi par nginx**. Quand nginx reçoit une requête pour `/fr/blog/mon-article/`, il cherche le fichier `index.html` dans le sous-dossier correspondant du webroot. C'est là que le dossier `dist/` est copié après chaque build. (Voir [chapitre 16](16-deploiement.md).)

### `.woff2`
Format de fichier de **police de caractères** optimisé pour le web. Très compressé (plus léger que les anciens `.ttf` ou `.otf`). Les trois polices du site (Space Grotesk, Fraunces, Outfit) sont servies en `.woff2`.

### Workflow (GitHub Actions)
Un **fichier YAML** dans `.github/workflows/` qui définit une séquence de tâches automatiques déclenchées par des événements. Ce projet en a six : `scheduled-publish.yml`, `ntfy-notify.yml`, `newsletter.yml`, `check-publish-schedule.yml`, `secrets-scan.yml`, `remotion-render.yml`. (Voir [chapitre 16](16-deploiement.md).)

---

## X

### XSS (Cross-Site Scripting)
Attaque consistant à **injecter du code JavaScript malveillant** dans une page web. Pour s'en protéger, le site utilise une Content Security Policy (CSP) restrictive. Les sites statiques sont intrinsèquement moins vulnérables car il n'y a pas de base de données à exploiter.

---

## Y

### YAML (Yet Another Markup Language)
Format de texte pour représenter des **données structurées de façon lisible**. Utilisé pour le frontmatter des articles Markdown et les fichiers de workflow GitHub Actions. La syntaxe repose sur l'indentation (les espaces ont de l'importance) et les clés-valeurs (`titre: Mon article`). (Voir [chapitre 04](04-articles.md).)

---

## Z

### Zod
Bibliothèque TypeScript de **validation de schémas**. Permet de définir la forme exacte attendue pour des données, et de vérifier qu'elles la respectent. Utilisé pour valider les frontmatters des articles et s'assurer que tous les champs obligatoires sont présents avec le bon type. (Voir [chapitre 04](04-articles.md).)

---

⬅️ Précédent : [16 — Le déploiement](16-deploiement.md) | ⬆️ Retour au [sommaire](README.md)
