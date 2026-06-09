# 04 — Le contenu : articles et rubriques

C'est le chapitre le plus utile au quotidien : **comment un article est fait**, et comment le site sait quoi en faire.

## Où vivent les articles

Tous les articles sont des fichiers **`.md`** (Markdown) rangés dans `src/content/blog/`, dans un sous-dossier par rubrique :

```
src/content/blog/
├── science/      ← articles de la rubrique Science
├── esprit/       ← articles de la rubrique Esprit
├── societe/      ← articles de la rubrique Société
└── grand-oral/   ← fiches Grand oral
```

**Le nom du fichier devient l'adresse de l'article.** Par exemple, le fichier `science/echecs-et-le-corps.md` sera publié à l'adresse `https://blogdungaucher.com/fr/blog/echecs-et-le-corps/`. Ce nom de fichier s'appelle le **slug** (l'identifiant dans l'URL).

> ⚠️ Le slug ne doit **jamais** changer une fois l'article publié et indexé par Google : changer l'adresse ferait perdre le référencement acquis. Si on doit vraiment renommer, on met en place une **redirection** (voir [chapitre 16](16-deploiement.md)).

## L'anatomie d'un fichier d'article

Un article a **deux parties** : le **frontmatter** (les métadonnées, en haut) et le **corps** (le texte, en dessous).

```markdown
---                              ← début du frontmatter
title: "Échecs et le corps : ce qu'un jeu immobile fait à votre organisme"
excerpt: >-
  Un joueur reste assis des heures et termine pourtant vidé…
publishDate: "2026-09-24"
category: science
readingTime: 13 min
pillar: Physiologie
tags:
  - physiologie
  - fréquence cardiaque
keyTakeaways:
  - "Une mesure de 2018 a montré un grand maître brûlant 560 calories en 2h…"
seoTitle: "Échecs et corps : calories, cœur et fatigue physique du joueur"
seoDescription: "Les échecs épuisent-ils physiquement ?…"
ogImage: /images/blog/echecs-et-le-corps-hero.png
heroImage:
  src: /images/blog/echecs-et-le-corps-hero.png
  alt: "Illustration : silhouette d'un joueur traversée de lignes rouges…"
  credit: Blog d'un Gaucher
  license: Création originale
faq:
  - question: Les échecs font-ils vraiment maigrir ?
    answer: "Au plus haut niveau et sur de longues compétitions, oui…"
---                              ← fin du frontmatter

À l'hiver 1984, le championnat du monde oppose…   ← début du CORPS (Markdown)

## Le paradoxe du sport assis

Le corps d'un joueur en partie classique n'est pas au repos…
```

### Le frontmatter, champ par champ

Le frontmatter est écrit en **YAML** (un format de liste « clé : valeur » très lisible). Voici **chaque champ possible** et son rôle :

| Champ | Obligatoire ? | À quoi ça sert |
|-------|:---:|----------------|
| `title` | ✅ | Le titre affiché de l'article (le grand titre en haut). |
| `excerpt` | ✅ | Le résumé court, affiché sous le titre et dans les listes d'articles. |
| `publishDate` | ✅ | La **date de publication** (format `"AAAA-MM-JJ"`). L'article n'apparaît qu'à partir de cette date. |
| `category` | ✅ | La rubrique : `science`, `esprit`, `societe` ou `grand-oral`. |
| `pillar` | ✅ | Un sous-thème libre affiché comme étiquette (ex. « Neurosciences », « Physiologie »). |
| `updatedDate` | ⬜ | Date de dernière mise à jour (affiche « Mis à jour le… »). |
| `author` | ⬜ | L'auteur (par défaut « Le Gaucher »). |
| `featured` | ⬜ | `true` pour mettre l'article en avant sur l'accueil. |
| `featuredRank` | ⬜ | L'ordre de priorité parmi les articles mis en avant (plus petit = plus haut). |
| `readingTime` | ⬜ | Le temps de lecture affiché (ex. `13 min`). S'il est absent, le site le calcule tout seul. |
| `tags` | ⬜ | Les mots-clés (liste). Servent au SEO et au regroupement. |
| `keyTakeaways` | ⬜ | Jusqu'à **5** points « À retenir », affichés en encadré en bas d'article. |
| `seoTitle` | ⬜ | Le titre **pour Google** (peut différer du `title` visible, optimisé pour la recherche). |
| `seoDescription` | ⬜ | La description **pour Google** (le petit texte sous le lien dans les résultats). |
| `ogImage` | ⬜ | L'image affichée quand on partage l'article sur les réseaux sociaux. |
| `heroImage` | ⬜ | L'image d'illustration en haut de l'article (avec `src`, `alt`, `credit`, `license`, `sourceUrl`). |
| `faq` | ⬜ | Une liste de questions/réponses, affichées en bas et **comprises par Google** (voir SEO). |
| `summaryVideo` | ⬜ | Le chemin d'une vidéo récap à afficher sous le titre. |
| `summaryVideoNote` | ⬜ | Une note libre sous la vidéo. |

Cette liste de champs autorisés et lesquels sont obligatoires est **définie et vérifiée** par un fichier appelé le **schéma**.

## Le schéma : `content.config.ts`

Le fichier `src/content.config.ts` définit, pour chaque type de contenu (articles, traductions, dissertations), **la liste exacte des champs autorisés et leur type**. Par exemple : « `title` doit être un texte », « `publishDate` doit être une date », « `keyTakeaways` est une liste d'au plus 5 textes », « `category` doit valoir science, esprit, societe ou grand-oral ».

**À quoi ça sert ?** À **attraper les erreurs au build**. Si tu oublies le `title` d'un article, ou si tu écris une catégorie qui n'existe pas, **le build refuse de se lancer** et te dit exactement quel article pose problème. C'est un filet de sécurité : impossible de publier un article mal formé. L'outil qui réalise cette vérification s'appelle **Zod**.

Le schéma définit quatre **collections** :
- `blog` — les articles (dossier `src/content/blog/`).
- `enTranslations` — les traductions anglaises.
- `ptBrTranslations` — les traductions portugais brésilien.
- `dissertations` — les dissertations.

## Comment le corps de l'article est transformé

Le corps est écrit en Markdown. Pendant le build, Astro le **convertit en HTML** et applique des traitements supplémentaires configurés dans `astro.config.mjs` :

- **`remark-math` + `rehype-katex`** : repèrent les **formules mathématiques** (écrites entre `$…$`) et les transforment en belles équations.
- **Coloration du code** : les blocs de code (du Python, par exemple, dans le Grand oral) sont colorés avec un thème clair et lisible (« github-light »).
- Les **titres `##`** deviennent des sections, et alimentent le **sommaire** (table des matières) cliquable sur le côté.

### La règle des tirets

Détail éditorial : le site bannit le **tiret cadratin** (le long tiret « — »). Un script (`strip-em-dash.mjs`) le remplace partout par une ponctuation normale (virgule, deux-points, parenthèses). Quand on écrit un nouvel article, on évite donc ce tiret. C'est un choix de style maison.

## Le tri et l'affichage des articles

Le fichier `src/utils/blog.ts` contient la logique qui décide **quels articles montrer et dans quel ordre** :

- **`getAllPosts()`** récupère tous les articles **dont la date de publication est passée** (les articles datés dans le futur sont automatiquement masqués) et les trie du plus récent au plus ancien. C'est le mécanisme de la **publication programmée** : on écrit un article avec une date future, et il apparaît tout seul le jour J (après le rebuild quotidien, voir [chapitre 10](10-publication-planning.md)).
- **`getFeaturedPosts()`** récupère les articles « mis en avant » (`featured: true`), triés par `featuredRank`.
- **`getPostsByCategory()`** filtre par rubrique.
- **`getLatestPosts()`** récupère les derniers articles **en alternant les rubriques** (science, esprit, société…) pour éviter d'afficher trois articles de la même rubrique d'affilée sur l'accueil. Cette petite mécanique d'alternance s'appelle l'**interleaving**.
- **`filterPostsForLang()`** retire les articles « français uniquement » (la rubrique Grand oral) des versions anglaise et allemande.

## Les dissertations

Les **dissertations** (dans `src/content/dissertations/`) suivent le même principe mais avec un schéma plus simple (titre, résumé, date, tags, SEO). Ce sont des textes longs et argumentés, présentés dans une rubrique à part (`/fr/dissertations/`).

---

⬅️ Précédent : [03 — Arborescence](03-arborescence.md) | ➡️ Suivant : [05 — Les pages et les URL](05-pages-routes.md)
