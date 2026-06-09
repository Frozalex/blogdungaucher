# 09 — Le référencement (SEO)

Le **SEO** (« Search Engine Optimization », optimisation pour les moteurs de recherche) regroupe **tout ce qui aide Google — et les assistants IA — à trouver, comprendre et bien classer le site**. C'est un travail largement invisible pour le visiteur, mais énorme en coulisses. Ce site y consacre une attention exceptionnelle.

## Pourquoi c'est vital pour un blog

Un blog vit de son **trafic de recherche** : la plupart des visiteurs arrivent en tapant une question dans Google. Si Google ne comprend pas bien une page, ou la juge mal faite, elle n'apparaît pas dans les résultats, et personne ne la lit. Le SEO, c'est donc littéralement **la survie d'un blog**.

## Les balises `<head>` : la carte d'identité de chaque page

Chaque page a une partie invisible, le `<head>`, rempli par `BaseLayout.astro`. On y trouve :

### Le titre et la description
- **`<title>`** — le titre affiché dans l'onglet du navigateur et **en bleu dans les résultats Google**. Pour les articles, c'est le `seoTitle` (optimisé pour la recherche) plutôt que le titre visible.
- **`<meta name="description">`** — le petit texte gris sous le lien dans Google. C'est le `seoDescription`.

### Les balises de partage social (Open Graph & Twitter)
Quand on partage un lien sur Facebook, WhatsApp, LinkedIn ou X (Twitter), ces réseaux lisent des balises spéciales pour fabriquer la jolie « carte » d'aperçu (image + titre + description) :
- `og:title`, `og:description`, `og:image`, `og:url`, `og:type`, `og:locale`…
- `twitter:card`, `twitter:title`, `twitter:image`…

L'image de partage (`og:image`) fait 1200×630 pixels, le format idéal. Par défaut c'est `/images/og-default.png` ; un article peut fournir la sienne via `ogImage`.

### Les liens canoniques et alternatifs
- **`<link rel="canonical">`** — désigne l'**adresse officielle** de la page. Crucial : si une même page est accessible par plusieurs chemins, le canonical dit à Google « la vraie, c'est celle-ci », ce qui évite le **contenu dupliqué** (deux pages qui se font concurrence, voir plus bas).
- **`hreflang`** — les versions dans les autres langues (voir [chapitre 08](08-i18n.md)).
- **`rel="prev"` / `rel="next"`** — sur les pages de liste paginées, indiquent la page précédente/suivante.

### Les icônes et le RSS
Favicon (l'icône de l'onglet), icônes Apple, lien vers le flux RSS.

## Les données structurées (JSON-LD) : parler à Google dans sa langue

C'est l'arme la plus puissante du SEO moderne. En plus du texte lisible par les humains, chaque page embarque un bloc de **données structurées** au format **JSON-LD** : une description **lisible par les machines** de ce qu'est la page. Google s'en sert pour fabriquer les **résultats enrichis** (la note en étoiles, les questions dépliables, l'auteur, la date…).

Le fichier `src/utils/blog.ts` contient des fonctions qui fabriquent ces données :

- **`buildArticleJsonLd()`** — décrit un article : c'est un `Article`/`BlogPosting`, avec son titre, sa description, son **nombre de mots**, son **temps de lecture**, ses dates de publication et de modification, sa langue, son image, sa rubrique, ses mots-clés, son **auteur** (une `Person` reliée à la page À propos), son **éditeur** (l'`Organization` « Blog d'un Gaucher » avec son logo), et le fait que l'article est **gratuit**.
- **`buildBreadcrumbJsonLd()`** — décrit le fil d'Ariane (`BreadcrumbList`) : Accueil › Rubrique › Article.
- **`buildFaqJsonLd()`** — transforme la FAQ de l'article en `FAQPage` : c'est ce qui permet aux questions d'apparaître **directement dépliables dans Google**.
- **`buildWebsiteJsonLd()`** — décrit le site entier comme un `Blog`.

Ces blocs sont insérés dans le `<head>` par `BaseLayout.astro`. Détail soigné : une fonction `safeJsonLd()` **échappe les caractères dangereux** pour qu'un titre contenant `</script>` ou des caractères spéciaux ne casse pas la page.

> **Filet de sécurité.** Si une page « article » oublie de fournir ses données structurées, BaseLayout en génère automatiquement une version minimale, pour ne jamais « perdre » cette information précieuse.

## Le plan du site : `sitemap.xml`

Le fichier `/sitemap.xml` (généré par `src/pages/sitemap.xml.ts`) est la **liste de toutes les adresses du site**, fournie à Google pour qu'il sache quoi explorer. C'est la « carte au trésor » du crawler. Les pages volontairement exclues (pages légales, version allemande) n'y figurent pas.

## Le flux RSS : `rss.xml`

Le fichier `/rss.xml` (généré par `src/pages/rss.xml.ts`) est un format standard qui permet à quiconque de **s'abonner aux nouveaux articles** avec un lecteur RSS, sans passer par Google.

## `robots.txt` : les consignes aux robots

Le fichier `public/robots.txt` donne des instructions aux **robots** qui explorent le web :

- **« Autorisé partout, sauf `/de/` »** : tout est explorable, sauf la version allemande (non finalisée).
- Il liste explicitement **Googlebot** (Google) et ses variantes (images, pub…).
- Il liste aussi **les robots des assistants IA** : `GPTBot` (ChatGPT), `ClaudeBot` (Claude), `PerplexityBot`, `Applebot`, `Google-Extended`, etc. Le site **autorise** ces IA à lire son contenu (un choix : être cité par les IA plutôt que bloqué).
- Il indique enfin **où trouver le sitemap**.

## `llms.txt` : un mode d'emploi pour les IA

`public/llms.txt` est un fichier plus récent, spécifiquement destiné aux **assistants IA** (LLM = « Large Language Model »). Il décrit, en clair, **l'identité du site**, sa **ligne éditoriale**, ses **règles** (« ce blog ne donne pas de conseils médicaux ni d'investissement », « les articles citent leurs sources », « les URL se terminent par un slash, ne pas le retirer »…). C'est une façon de **cadrer comment les IA citent et comprennent** le site. C'est un signe que le projet anticipe le futur de la recherche, où les IA comptent autant que Google.

## L'indexation : qui apparaît dans Google, qui non

`BaseLayout.astro` décide page par page si elle doit être indexée :
- Les pages FR et EN normales : **`index, follow`** (« indexe et suis les liens »), avec des options pour autoriser les grands aperçus d'image.
- Les pages allemandes et les pages légales : **`noindex, nofollow`** (« n'indexe pas »). C'est pour ça que la version allemande, bien que techniquement présente, n'apparaît pas dans Google.

## Le piège de la cannibalisation (très important ici)

La **cannibalisation** est un problème SEO majeur : c'est quand **deux pages du même site se disputent la même recherche**. Google ne sait pas laquelle proposer, les classe toutes les deux moyennement, et le site perd des clics. C'est exactement ce qui arrive si on écrit deux articles trop proches.

Ce site a connu (et résolu) plusieurs cas. La stratégie appliquée :
- **Fusionner** les doublons : on garde le meilleur article (le « maître canonique ») et on **redirige** l'autre vers lui en 301.
- **Différencier** les sujets proches par une intention de recherche distincte (un article général + un article sur une niche précise).
- **Vérifier sur données réelles** via Google Search Console (l'outil de Google qui montre pour quelles recherches chaque page apparaît).

Concrètement, avant d'écrire un nouvel article, on vérifie qu'il **ne marche pas sur les plates-bandes** d'un article existant. Plusieurs « maîtres canoniques » sont à ne pas dupliquer (échecs et cerveau, Alzheimer, syndrome de l'imposteur…).

## Outils SEO du projet

Le dossier `scripts/` contient des outils dédiés (détaillés au [chapitre 11](11-scripts.md)) :
- **`generate-og-png.mjs`** — fabrique l'image de partage par défaut.
- **`indexnow-submit.mjs`** — prévient instantanément les moteurs (Bing, Yandex) qu'une nouvelle page existe, via le protocole **IndexNow**.
- **`serpmantics*.mjs`** — des outils d'audit de positionnement.
- **`verify-dist-urls.mjs`** — vérifie après le build que les adresses produites sont correctes.

---

⬅️ Précédent : [08 — Le multilingue](08-i18n.md) | ➡️ Suivant : [10 — Le calendrier de publication](10-publication-planning.md)
