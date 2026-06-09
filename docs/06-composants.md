# 06 — Les composants

Un **composant** est une **brique d'interface réutilisable**. Plutôt que de réécrire la barre de navigation sur chaque page, on l'écrit **une fois** dans un composant, et on l'« appelle » partout. Si on veut la modifier, on ne touche qu'à un seul fichier.

> **Image mentale.** Un composant, c'est comme un tampon encreur : tu le fabriques une fois, tu l'apposes où tu veux.

Tous les composants vivent dans `src/components/` et portent l'extension `.astro`. Les voici **tous**, regroupés par fonction.

## Navigation et structure de page

### `Navbar.astro` — la barre de navigation (en haut)
La barre fixée en haut de chaque page. Elle contient le **logo**, les **liens vers les rubriques** (Science, Esprit, Société, Grand oral, Dissertations, Tous les articles, À propos), le **sélecteur de langue** (FR/EN), le **bouton de recherche**, et le **bouton mode clair/sombre**. Sur mobile, les liens se replient dans un menu « hamburger » (les trois petits traits) qui s'ouvre au clic. C'est l'un des plus gros composants car il gère beaucoup d'interactions.

### `Footer.astro` — le pied de page (en bas)
La zone en bas de chaque page : rappel des rubriques, liens utiles (à propos, mentions légales, politique de confidentialité, glossaire, flux RSS), et les informations légales. C'est la « signature » du site, présente partout.

### `Breadcrumb.astro` — le fil d'Ariane
La petite ligne de navigation du type « Accueil › Science › Échecs et le corps » en haut des articles. Elle aide le visiteur à se repérer **et** Google à comprendre la hiérarchie du site (elle produit aussi une donnée structurée `BreadcrumbList`, voir [chapitre 09](09-seo.md)).

### `BackToTop.astro` — le bouton « remonter en haut »
Un petit bouton rond qui apparaît quand on a défilé loin dans une page, pour revenir au sommet d'un clic.

## La page d'accueil et les rubriques

### `HomeLanding.astro` — la page d'accueil
Le plus gros composant (plus de 800 lignes). Il compose toute la page d'accueil : le grand titre d'accroche (le **hero**), la présentation des rubriques, les derniers articles, les sections de mise en avant. Détail important pour la performance : son grand titre est affiché **immédiatement, sans animation d'entrée**, car animer cet élément ralentissait l'affichage perçu (voir [chapitre 12](12-performance.md)).

### `CategoryPage.astro` — la page d'une rubrique
Le gabarit commun aux quatre pages de rubrique (Science, Esprit, Société, Grand oral). Il affiche le titre de la rubrique, sa description, son logo, et **la liste de ses articles**. Refondu récemment pour mettre les articles en avant dès le haut de page.

### `ArticleCard.astro` — la carte d'aperçu d'un article
La « vignette » d'un article telle qu'elle apparaît dans les listes (accueil, rubriques, articles liés) : image, titre, résumé, rubrique, temps de lecture. Cliquer dessus mène à l'article. Réutilisée partout où on liste des articles.

## À l'intérieur d'un article

### `TableOfContents.astro` — le sommaire
Le sommaire cliquable des sections de l'article. Il a deux modes : **« desktop »** (une colonne fixée sur le côté qui suit le défilement) et **« mobile »** (un menu déroulant en haut de l'article). Il se construit automatiquement à partir des titres `##` de l'article.

### `KeyTakeaways.astro` — l'encadré « À retenir »
Affiche, en bas d'article, les points clés listés dans le champ `keyTakeaways` du frontmatter (jusqu'à 5). C'est le « résumé express » de l'article.

### `FAQ.astro` — la foire aux questions
Affiche les questions/réponses du champ `faq` sous forme d'**accordéon** (on clique sur une question pour dérouler la réponse). En coulisses, ces questions/réponses sont aussi transmises à Google sous forme de **donnée structurée FAQ**, ce qui peut faire apparaître les questions directement dans les résultats de recherche.

### `CodeBlockEnhancer.astro` — l'amélioration des blocs de code
Pour les articles qui contiennent du code (Python du Grand oral, par exemple), ce composant ajoute aux blocs de code une **étiquette de langage** (« Python ») et un **bouton « copier »**.

### `ArticleVideo.astro` — le lecteur vidéo
Affiche la **vidéo récap** de l'article quand elle existe (champ `summaryVideo`). C'est l'un des rares endroits qui utilise React (pour le lecteur interactif).

## Diffusion et engagement

### `ShareButtons.astro` — les boutons de partage
Les boutons pour partager l'article sur les réseaux sociaux ou copier son lien.

### `NewsletterCta.astro` et `NewsletterForm.astro` — la newsletter
- `NewsletterForm` est le **formulaire** lui-même (champ e-mail + bouton « s'abonner »), avec la gestion du message de succès.
- `NewsletterCta` est l'**appel à l'action** (le petit encart « Abonnez-vous » qui *contient* le formulaire), inséré dans les articles.

### `Comments.astro` — les commentaires
Affiche la zone de commentaires sous les articles. Le site utilise **giscus**, un système gratuit qui stocke les commentaires… dans les « discussions » du dépôt GitHub du projet. Avantage : pas de base de données à gérer, pas de pub, et c'est cohérent avec l'esprit statique du site. La configuration (quel dépôt, quelle catégorie) est dans `src/data/site.ts`.

## Téléchargements

### `DownloadPdfButton.astro` — le bouton de téléchargement PDF
Le bouton « Télécharger en PDF » présent sur les sujets de Grand oral. Il pointe vers un PDF pré-généré dans `public/pdfs/` (voir [chapitre 15](15-pdf-et-videos.md)).

### `EssaisComingSoon.astro` — « bientôt disponible »
Un encart « à venir » utilisé pour des sections en préparation.

## Confidentialité et monétisation

### `CookieConsent.astro` — le bandeau de consentement aux cookies
Le bandeau qui demande l'autorisation avant d'activer le suivi statistique (Google Analytics) et la publicité (AdSense). C'est une obligation légale en Europe. Tant que le visiteur n'a pas accepté, **rien n'est chargé** côté suivi/pub. Le choix est mémorisé dans le navigateur. C'est l'un des plus gros composants (700 lignes) car il gère finement l'activation/désactivation de chaque service selon le consentement.

### `AdBanner.astro` — les emplacements publicitaires
Réserve les emplacements pour la publicité **Google AdSense**. Détail important : tant que le réglage `live` est à `false` dans `src/data/site.ts`, **ce composant n'affiche rien du tout** (pas même un espace vide). Le site est en phase de demande d'approbation AdSense ; les pubs ne s'afficheront qu'une fois approuvées et le réglage passé à `true`.

## Comment un composant est « appelé »

Dans un fichier `.astro`, utiliser un composant ressemble à poser une balise HTML, en lui passant éventuellement des informations (les **props**, pour « propriétés ») :

```astro
---
import ArticleCard from "../components/ArticleCard.astro";
import { getLatestPosts } from "../utils/blog";
const posts = await getLatestPosts(6);   // récupère les 6 derniers articles
---
{posts.map((post) => <ArticleCard post={post} lang="fr" />)}
```

Ici, on importe le composant `ArticleCard`, on récupère 6 articles, et on affiche une carte par article en lui passant l'article (`post`) et la langue (`lang`). C'est tout l'intérêt des composants : une ligne suffit à réutiliser une brique complexe.

---

⬅️ Précédent : [05 — Les pages et les URL](05-pages-routes.md) | ➡️ Suivant : [07 — Mise en page et design](07-design.md)
