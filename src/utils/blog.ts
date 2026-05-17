import { getCollection, type CollectionEntry } from "astro:content";

import { categoryMap, siteConfig, type CategorySlug } from "../data/site";

export type BlogEntry = CollectionEntry<"blog">;

export function calculateReadingTime(body: string): string {
  const words = body.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min`;
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
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

/** Rubrique « Grand oral » : contenu uniquement en français (pas de pages EN/DE). */
export function isFrenchOnlyPost(post: BlogEntry): boolean {
  return post.data.category === "grand-oral";
}

export function filterPostsForLang(
  posts: BlogEntry[],
  lang: "fr" | "en" | "de",
): BlogEntry[] {
  if (lang === "fr") return posts;
  return posts.filter((p) => !isFrenchOnlyPost(p));
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
  lang: "fr" | "en" | "de" = "fr",
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

export function getPostUrlEn(post: BlogEntry) {
  return `/en/blog/${getPostSlug(post)}/`;
}

export function getPostUrlDe(post: BlogEntry) {
  return `/de/blog/${getPostSlug(post)}/`;
}

export function getPostUrlLang(post: BlogEntry, lang: "fr" | "en" | "de") {
  if (lang === "en") return getPostUrlEn(post);
  if (lang === "de") return getPostUrlDe(post);
  return getPostUrl(post);
}

/** Page liste blog : chemins relatifs (évite les URL absolues Astro.pagination avec mauvais hôte/port). */
export function getBlogIndexPagePath(lang: "fr" | "en" | "de", pageNum: number) {
  const base =
    lang === "en" ? "/en/blog" : lang === "de" ? "/de/blog" : "/fr/blog";
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

export function buildArticleJsonLd(
  post: BlogEntry,
  options?: { lang?: "fr" | "en" | "de" },
) {
  const lang = options?.lang ?? "fr";
  const imagePath = post.data.ogImage ?? siteConfig.defaultOgImage;
  const modifiedDate = post.data.updatedDate ?? post.data.publishDate;
  const category = getCategoryMeta(post.data.category);
  const pageUrl =
    lang === "en"
      ? getPostUrlEn(post)
      : lang === "de"
        ? getPostUrlDe(post)
        : getPostUrl(post);
  const articleUrl = absoluteUrl(pageUrl);
  const inLanguage =
    lang === "en" ? "en-US" : lang === "de" ? "de-DE" : "fr-FR";
  const headline =
    lang === "en"
      ? (post.data.seoTitleEn ?? post.data.titleEn ?? post.data.seoTitle ?? post.data.title)
      : (post.data.seoTitle ?? post.data.title);
  const description =
    lang === "en"
      ? (post.data.seoDescriptionEn ?? post.data.excerptEn ?? post.data.seoDescription ?? post.data.excerpt)
      : (post.data.seoDescription ?? post.data.excerpt);
  const articleSectionEn: Record<CategorySlug, string> = {
    science: "Science",
    esprit: "Mind",
    societe: "Society",
    "grand-oral": category.label,
  };

  // Métriques de lecture
  const words = post.body.trim().split(/\s+/).filter(Boolean).length;
  const readingMinutes = Math.max(1, Math.ceil(words / 200));

  // Images : OG (dimensions fixes 1200×630) + hero Wikimedia si distinct
  const images: Record<string, unknown>[] = [
    {
      "@type": "ImageObject",
      "@id": `${articleUrl}#primaryimage`,
      url: absoluteUrl(imagePath),
      width: 1200,
      height: 630,
    },
  ];
  if (post.data.heroImage?.src) {
    const heroAbsolute = absoluteUrl(post.data.heroImage.src);
    if (heroAbsolute !== absoluteUrl(imagePath)) {
      images.push({
        "@type": "ImageObject",
        url: heroAbsolute,
        ...(post.data.heroImage.alt ? { caption: post.data.heroImage.alt } : {}),
      });
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
    image: images.length === 1 ? images[0] : images,
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
    },
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
