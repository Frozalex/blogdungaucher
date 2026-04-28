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

export async function getLatestPosts(limit: number) {
  const posts = await getAllPosts();
  return posts.slice(0, limit);
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
  return `/blog/${getPostSlug(post)}/`;
}

export function getPostUrlEn(post: BlogEntry) {
  return `/en/blog/${getPostSlug(post)}/`;
}

export function getPostUrlLang(post: BlogEntry, lang: "fr" | "en") {
  return lang === "en" ? getPostUrlEn(post) : getPostUrl(post);
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

export function buildArticleJsonLd(post: BlogEntry) {
  const imagePath = post.data.ogImage ?? siteConfig.defaultOgImage;
  const modifiedDate = post.data.updatedDate ?? post.data.publishDate;
  const category = getCategoryMeta(post.data.category);
  return {
    "@context": "https://schema.org",
    "@type": ["Article", "BlogPosting"],
    headline: post.data.seoTitle ?? post.data.title,
    name: post.data.seoTitle ?? post.data.title,
    description: post.data.seoDescription ?? post.data.excerpt,
    datePublished: post.data.publishDate.toISOString(),
    dateModified: modifiedDate.toISOString(),
    inLanguage: "fr-FR",
    url: absoluteUrl(getPostUrl(post)),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": absoluteUrl(getPostUrl(post)),
    },
    image: {
      "@type": "ImageObject",
      url: absoluteUrl(imagePath),
      width: 1200,
      height: 630,
    },
    articleSection: category.label,
    keywords: post.data.tags?.join(", "),
    isPartOf: {
      "@type": "Blog",
      "@id": `${siteConfig.siteUrl}/#blog`,
      name: siteConfig.name,
      url: siteConfig.siteUrl,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.siteUrl,
      logo: {
        "@type": "ImageObject",
        url: `${siteConfig.siteUrl}/images/logo.svg`,
      },
    },
    author: {
      "@type": "Person",
      name: post.data.author ?? "Le Gaucher",
      url: siteConfig.siteUrl,
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
