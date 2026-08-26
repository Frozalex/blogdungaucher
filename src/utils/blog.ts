import { getCollection, getEntry, type CollectionEntry } from "astro:content";

import { categoryMap, siteConfig, type CategorySlug } from "../data/site";
import { isPublicAssetAvailable } from "./public-asset";

export type BlogEntry = CollectionEntry<"blog">;

/** Hero affichable : `src` non vide et fichier présent dans `public/`. */
export function getPostHeroSrc(post: BlogEntry): string | null {
  const src = post.data.heroImage?.src?.trim();
  if (!src) return null;
  return isPublicAssetAvailable(src) ? src : null;
}

export function calculateReadingTime(body: string): string {
  const words = body.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min`;
}

export function formatDate(date: Date) {
  const texte = new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
  // `Intl` rend « 1 juin 2027 » ; le français écrit « 1er juin ». La règle ne
  // vaut que pour le premier du mois, les autres quantièmes restent cardinaux.
  return date.getUTCDate() === 1 ? texte.replace(/^1\b/, "1er") : texte;
}

export function formatDateEn(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

export function absoluteUrl(pathname: string) {
  return new URL(pathname, siteConfig.siteUrl).toString();
}

export function getCategoryMeta(category: CategorySlug) {
  return categoryMap[category];
}

export async function getAllPosts() {
  const posts = await getCollection("blog");
  const now = new Date();

  return posts
    .filter((post) => post.data.publishDate <= now)
    .sort(
      (left, right) =>
        right.data.publishDate.getTime() - left.data.publishDate.getTime(),
    );
}

export async function getFeaturedPosts(limit?: number) {
  const posts = await getAllPosts();
  const featuredPosts = posts
    .filter((post) => post.data.featured)
    .sort((left, right) => left.data.featuredRank - right.data.featuredRank);

  return typeof limit === "number" ? featuredPosts.slice(0, limit) : featuredPosts;
}

export async function getPostsByCategory(category: CategorySlug) {
  const posts = await getAllPosts();
  return posts.filter((post) => post.data.category === category);
}

/** Rubrique « Grand oral » : contenu uniquement en français (pas de pages EN/PT-BR). */
export function isFrenchOnlyPost(post: BlogEntry): boolean {
  return post.data.category === "grand-oral";
}

export function filterPostsForLang(
  posts: BlogEntry[],
  lang: "fr" | "en" | "pt-br" | "nl",
): BlogEntry[] {
  if (lang === "fr") return posts;
  return posts.filter((p) => !isFrenchOnlyPost(p));
}

export type SiteLang = "fr" | "en" | "pt-br" | "nl";

/**
 * Titre/extrait d'un article dans la langue demandée.
 *
 * Les traductions vivent dans des collections séparées (`enTranslations`,
 * `ptBrTranslations`, `nlTranslations`) reliées au slug FR ; une entrée en
 * `draft` est ignorée et on retombe sur le texte français. Partagé entre
 * ArticleCard (rendu serveur) et l'index JSON du filtre client, pour que les
 * deux affichent exactement le même texte.
 */
export async function getLocalizedPostText(post: BlogEntry, lang: SiteLang) {
  const fallback = { title: post.data.title, excerpt: post.data.excerpt };
  if (lang === "fr") return fallback;

  const frSlug = getPostSlug(post);

  if (lang === "en") {
    const entry = await getEntry("enTranslations", frSlug);
    if (entry && !entry.data.draft) {
      return { title: entry.data.title, excerpt: entry.data.excerpt };
    }
    return fallback;
  }

  const collection = lang === "pt-br" ? "ptBrTranslations" : "nlTranslations";
  const entries = await getCollection(collection);
  const entry = entries.find((e) => (e.data.frSlug ?? e.id) === frSlug);
  if (entry && !entry.data.draft) {
    return { title: entry.data.title, excerpt: entry.data.excerpt };
  }
  return fallback;
}

/** Date d'un article formatée selon la locale du site. */
export function formatDateForLang(date: Date, lang: SiteLang) {
  if (lang === "en") return formatDateEn(date);
  if (lang === "pt-br") return formatDatePtBr(date);
  if (lang === "nl") return formatDateNl(date);
  return formatDate(date);
}

export function formatDatePtBr(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

export function formatDateNl(date: Date) {
  return new Intl.DateTimeFormat("nl-NL", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

/** Ordre d’affichage accueil : alterner science / esprit / société pour éviter un bloc d’une seule rubrique. */
const PILLAR_DISPLAY_ORDER = ["science", "esprit", "societe"] as const;

function interleaveLatestByPillar(posts: BlogEntry[], limit: number): BlogEntry[] {
  const queues: Record<
    (typeof PILLAR_DISPLAY_ORDER)[number],
    BlogEntry[]
  > = {
    science: [],
    esprit: [],
    societe: [],
  };
  const other: BlogEntry[] = [];
  for (const post of posts) {
    const c = post.data.category;
    if (c === "science" || c === "esprit" || c === "societe") {
      queues[c].push(post);
    } else {
      other.push(post);
    }
  }

  let turn = 0;
  const out: BlogEntry[] = [];
  while (out.length < limit) {
    let added = false;
    for (let j = 0; j < 3; j++) {
      const cat = PILLAR_DISPLAY_ORDER[(turn + j) % 3];
      const q = queues[cat];
      if (q.length > 0) {
        out.push(q.shift()!);
        turn = (PILLAR_DISPLAY_ORDER.indexOf(cat) + 1) % 3;
        added = true;
        break;
      }
    }
    if (!added) {
      if (other.length > 0) {
        out.push(other.shift()!);
      } else {
        const rest = [...queues.science, ...queues.esprit, ...queues.societe];
        rest.sort(
          (a, b) =>
            b.data.publishDate.getTime() - a.data.publishDate.getTime(),
        );
        for (const p of rest) {
          if (out.length >= limit) break;
          out.push(p);
        }
        break;
      }
    }
  }
  return out;
}

export async function getLatestPosts(
  limit: number,
  lang: "fr" | "en" | "pt-br" | "nl" = "fr",
) {
  const posts = await getAllPosts();
  const list = filterPostsForLang(posts, lang);
  return interleaveLatestByPillar(list, limit);
}

export function getPostSlug(post: BlogEntry) {
  // Astro v6 loaders may not provide `slug`, but `id` is always available.
  const slug = "slug" in post && typeof post.slug === "string" ? post.slug : "";
  if (slug) return slug;

  return post.id
    .replace(/\.mdx?$/i, "")
    .split("/")
    .filter(Boolean)
    .pop()!;
}

export function getPostUrl(post: BlogEntry) {
  return `/fr/blog/${getPostSlug(post)}/`;
}

/** Cache des slugs NL localisés (frSlug → nlFileSlug).
 *  Construit une seule fois à partir de la collection `nlTranslations`. */
let _nlSlugMapPromise: Promise<Map<string, string>> | null = null;

export async function getNlSlugMap(): Promise<Map<string, string>> {
  if (!_nlSlugMapPromise) {
    _nlSlugMapPromise = (async () => {
      const entries = await getCollection("nlTranslations");
      const map = new Map<string, string>();
      for (const e of entries) {
        const nlSlug = e.id.replace(/\.mdx?$/i, "").split("/").filter(Boolean).pop()!;
        const frSlug = (e.data as { frSlug?: string }).frSlug;
        if (frSlug) map.set(frSlug, nlSlug);
      }
      return map;
    })();
  }
  return _nlSlugMapPromise;
}

export async function getPostUrlNl(post: BlogEntry): Promise<string> {
  const map = await getNlSlugMap();
  const slug = map.get(getPostSlug(post)) ?? getPostSlug(post);
  return `/nl/blog/${slug}/`;
}

export function getPostUrlNlSync(post: BlogEntry, nlSlug?: string) {
  return `/nl/blog/${nlSlug ?? getPostSlug(post)}/`;
}

/** Cache des slugs PT-BR localisés (frSlug → ptBrFileSlug).
 *  Construit une seule fois à partir de la collection `ptBrTranslations`. */
let _ptBrSlugMapPromise: Promise<Map<string, string>> | null = null;

export async function getPtBrSlugMap(): Promise<Map<string, string>> {
  if (!_ptBrSlugMapPromise) {
    _ptBrSlugMapPromise = (async () => {
      const entries = await getCollection("ptBrTranslations");
      const map = new Map<string, string>();
      for (const e of entries) {
        const ptBrSlug = e.id.replace(/\.mdx?$/i, "").split("/").filter(Boolean).pop()!;
        const frSlug = (e.data as { frSlug?: string }).frSlug;
        if (frSlug) map.set(frSlug, ptBrSlug);
      }
      return map;
    })();
  }
  return _ptBrSlugMapPromise;
}

export async function getPostUrlPtBr(post: BlogEntry): Promise<string> {
  const map = await getPtBrSlugMap();
  const slug = map.get(getPostSlug(post)) ?? getPostSlug(post);
  return `/pt-br/blog/${slug}/`;
}

export function getPostUrlPtBrSync(post: BlogEntry, ptBrSlug?: string) {
  return `/pt-br/blog/${ptBrSlug ?? getPostSlug(post)}/`;
}

/** Cache des slugs EN localisés (frSlug → enSlug).
 *  Construit une seule fois à partir de la collection `enTranslations`. */
let _enSlugMapPromise: Promise<Map<string, string>> | null = null;

export async function getEnSlugMap(): Promise<Map<string, string>> {
  if (!_enSlugMapPromise) {
    _enSlugMapPromise = (async () => {
      const entries = await getCollection("enTranslations");
      const map = new Map<string, string>();
      for (const e of entries) {
        const frSlug = e.id.replace(/\.mdx?$/i, "").split("/").filter(Boolean).pop()!;
        const enSlug = (e.data as { enSlug?: string }).enSlug;
        if (enSlug) map.set(frSlug, enSlug);
      }
      return map;
    })();
  }
  return _enSlugMapPromise;
}

/** Construit l'URL EN d'un article. Si la traduction définit `enSlug`,
 *  l'URL utilise ce slug localisé, sinon elle reprend le slug FR. */
export async function getPostUrlEn(post: BlogEntry): Promise<string> {
  const map = await getEnSlugMap();
  const slug = map.get(getPostSlug(post)) ?? getPostSlug(post);
  return `/en/blog/${slug}/`;
}

/** Variante synchrone : utilise un slug explicite (déjà résolu) ou retombe sur le slug FR. */
export function getPostUrlEnSync(post: BlogEntry, enSlug?: string) {
  return `/en/blog/${enSlug ?? getPostSlug(post)}/`;
}

export async function getPostUrlLang(post: BlogEntry, lang: "fr" | "en" | "pt-br" | "nl"): Promise<string> {
  if (lang === "en") return getPostUrlEn(post);
  if (lang === "pt-br") return getPostUrlPtBr(post);
  if (lang === "nl") return getPostUrlNl(post);
  return getPostUrl(post);
}

/** Page liste blog : chemins relatifs (évite les URL absolues Astro.pagination avec mauvais hôte/port). */
export function getBlogIndexPagePath(lang: "fr" | "en" | "pt-br" | "nl", pageNum: number) {
  const base = lang === "en" ? "/en/blog" : lang === "pt-br" ? "/pt-br/blog" : lang === "nl" ? "/nl/blog" : "/fr/blog";
  if (pageNum <= 1) return `${base}/`;
  return `${base}/${pageNum}/`;
}

export function buildBreadcrumbJsonLd(
  items: Array<{ name: string; path: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export async function buildArticleJsonLd(
  post: BlogEntry,
  options?: { lang?: "fr" | "en"; headline?: string; description?: string; pageUrl?: string },
) {
  const lang = options?.lang ?? "fr";
  const imagePath = post.data.ogImage ?? siteConfig.defaultOgImage;
  const modifiedDate = post.data.updatedDate ?? post.data.publishDate;
  const category = getCategoryMeta(post.data.category);
  const pageUrl =
    options?.pageUrl ??
    (lang === "en" ? await getPostUrlEn(post) : getPostUrl(post));
  const articleUrl = absoluteUrl(pageUrl);
  const inLanguage = lang === "en" ? "en-US" : "fr-FR";
  const headline =
    options?.headline ?? (post.data.seoTitle ?? post.data.title);
  const description =
    options?.description ?? (post.data.seoDescription ?? post.data.excerpt);
  const articleSectionEn: Record<CategorySlug, string> = {
    science: "Science",
    esprit: "Mind",
    societe: "Society",
    "grand-oral": category.label,
  };

  // Métriques de lecture
  const words = (post.body ?? "").trim().split(/\s+/).filter(Boolean).length;
  const readingMinutes = Math.max(1, Math.ceil(words / 200));

  // Images : OG (1200×630) + hero Wikimedia si distinct.
  // Google ET les validateurs stricts (squirrel) acceptent une URL / un tableau
  // d'URL pour Article.image — on évite l'ImageObject imbriqué que certains
  // validateurs refusent, tout en gardant les images en tête de graphe.
  const imageUrls: string[] = [absoluteUrl(imagePath)];
  const heroSrc = getPostHeroSrc(post);
  if (heroSrc) {
    const heroAbsolute = absoluteUrl(heroSrc);
    if (heroAbsolute !== absoluteUrl(imagePath)) {
      imageUrls.push(heroAbsolute);
    }
  }

  // URL de l'auteur : page About dans la bonne langue
  const authorPageUrl =
    lang === "en"
      ? `${siteConfig.siteUrl}/en/about/`
      : `${siteConfig.siteUrl}/fr/about/`;

  return {
    "@context": "https://schema.org",
    "@type": ["Article", "BlogPosting"],
    "@id": `${articleUrl}#article`,
    headline,
    name: headline,
    description,
    wordCount: words,
    timeRequired: `PT${readingMinutes}M`,
    isAccessibleForFree: true,
    datePublished: post.data.publishDate.toISOString(),
    dateModified: modifiedDate.toISOString(),
    inLanguage,
    url: articleUrl,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": articleUrl,
    },
    image: imageUrls,
    articleSection:
      lang === "en" ? articleSectionEn[post.data.category] : category.label,
    keywords: post.data.tags?.join(", "),
    isPartOf: {
      "@type": "Blog",
      "@id": `${siteConfig.siteUrl}/#blog`,
      name: siteConfig.name,
      url: siteConfig.siteUrl,
    },
    publisher: {
      "@type": "Organization",
      "@id": `${siteConfig.siteUrl}/#publisher`,
      name: siteConfig.name,
      url: siteConfig.siteUrl,
      logo: {
        "@type": "ImageObject",
        url: `${siteConfig.siteUrl}/images/logo.svg`,
        width: 56,
        height: 80,
      },
    },
    author: {
      "@type": "Person",
      "@id": `${siteConfig.siteUrl}/fr/about/#person`,
      name: post.data.author ?? "Le Gaucher",
      url: authorPageUrl,
      sameAs: ["https://www.chess.com/member/le_gaucher"],
    },
  };
}

export function buildPersonJsonLd(lang: "fr" | "en" | "pt-br" | "nl" = "fr") {
  const aboutUrl =
    lang === "en"
      ? `${siteConfig.siteUrl}/en/about/`
      : lang === "pt-br"
        ? `${siteConfig.siteUrl}/pt-br/about/`
        : lang === "nl"
          ? `${siteConfig.siteUrl}/nl/about/`
          : `${siteConfig.siteUrl}/fr/about/`;
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${siteConfig.siteUrl}/fr/about/#person`,
    name: "Le Gaucher",
    url: aboutUrl,
    description:
      lang === "en"
        ? "Computer science student, chess player at 1,600 Elo, author of A Left-Hander's Blog."
        : lang === "pt-br"
          ? "Estudante de ciência da computação, enxadrista com 1.600 Elo, autor do Blog de um Canhoto."
          : lang === "nl"
            ? "Informaticastudent, schaker op 1.600 Elo, auteur van Blog van een Linkshandige."
            : "Étudiant en informatique, joueur d'échecs à 1 600 Elo, auteur du Blog d'un Gaucher.",
    knowsAbout:
      lang === "en"
        ? ["Chess", "Neuroscience", "Cognitive psychology", "Game theory", "Computer science"]
        : lang === "pt-br"
          ? ["Xadrez", "Neurociência", "Psicologia cognitiva", "Teoria dos jogos", "Ciência da computação"]
          : lang === "nl"
            ? ["Schaken", "Neurowetenschappen", "Cognitieve psychologie", "Speltheorie", "Informatica"]
            : ["Échecs", "Neurosciences", "Psychologie cognitive", "Théorie des jeux", "Informatique"],
    sameAs: ["https://www.chess.com/member/le_gaucher"],
  };
}

export function buildFaqJsonLd(
  faqs: Array<{ question: string; answer: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function buildWebsiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: siteConfig.name,
    description: siteConfig.defaultDescription,
    url: siteConfig.siteUrl,
    inLanguage: "fr-FR",
  };
}
