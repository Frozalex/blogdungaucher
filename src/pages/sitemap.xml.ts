import type { APIRoute } from "astro";

import { siteConfig, staticRoutes, enStaticRoutes } from "../data/site";
import { getAllPosts, getEnSlugMap, getPostSlug, getPostUrl, isFrenchOnlyPost } from "../utils/blog";
import { swapLangPrefix, withTrailingSlash, type SiteLang } from "../utils/lang-paths";

/** Langues indexées dans le sitemap. */
const langs: SiteLang[] = ["fr", "en"];

/** Pages exclues du sitemap : thin content et pages légales. */
const EXCLUDED_PATHS = new Set([
  "/fr/mentions-legales/",
  "/fr/politique-confidentialite/",
  "/fr/analyses/",
]);

export const GET: APIRoute = async () => {
  const posts = await getAllPosts();
  const enSlugMap = await getEnSlugMap();

  function absolute(path: string) {
    return new URL(withTrailingSlash(path), siteConfig.siteUrl).toString();
  }

  function lastmodFor(frPath: string): string {
    const post = posts.find((p) => getPostUrl(p) === frPath);
    if (post) return (post.data.updatedDate ?? post.data.publishDate).toISOString();
    return new Date().toISOString();
  }

  function enPathFor(frPath: string): string {
    const post = posts.find((p) => getPostUrl(p) === frPath);
    if (!post) return swapLangPrefix(frPath, "en");
    const frSlug = getPostSlug(post);
    const enSlug = enSlugMap.get(frSlug) ?? frSlug;
    return `/en/blog/${enSlug}/`;
  }

  // Pour les routes statiques, détermine si une version EN existe
  const enStaticSet = new Set(enStaticRoutes.map((r) => withTrailingSlash(r)));

  function isFrOnlyPath(frPath: string): boolean {
    const post = posts.find((p) => getPostUrl(p) === frPath);
    if (post) return isFrenchOnlyPost(post);
    // Route statique : FR-only si son équivalent EN n'est pas dans enStaticRoutes
    return !enStaticSet.has(swapLangPrefix(frPath, "en"));
  }

  // ── Entrées FR ──────────────────────────────────────────────────────────────

  const frStaticPaths = staticRoutes
    .filter((r) => !EXCLUDED_PATHS.has(r))
    .map((r) => withTrailingSlash(r));

  const frPostPaths = posts.map((post) => getPostUrl(post));
  const allFrPaths = [...frStaticPaths, ...frPostPaths];

  const frEntries = allFrPaths.map((frPath) => {
    const frOnly = isFrOnlyPath(frPath);
    const lastmod = lastmodFor(frPath);
    const loc = absolute(frPath);

    const alternates = frOnly
      ? `<xhtml:link rel="alternate" hreflang="fr" href="${loc}"/>
          <xhtml:link rel="alternate" hreflang="x-default" href="${loc}"/>`
      : langs
          .map((lang) => {
            const href = absolute(lang === "en" ? enPathFor(frPath) : frPath);
            return `<xhtml:link rel="alternate" hreflang="${lang}" href="${href}"/>`;
          })
          .join("\n          ") +
        `\n          <xhtml:link rel="alternate" hreflang="x-default" href="${loc}"/>`;

    return `
      <url>
        <loc>${loc}</loc>
        <lastmod>${lastmod}</lastmod>
        ${alternates}
      </url>`;
  });

  // ── Entrées EN (URLs standalone) ─────────────────────────────────────────────

  const enPostPaths = posts
    .filter((post) => !isFrenchOnlyPost(post))
    .map((post) => {
      const frSlug = getPostSlug(post);
      const enSlug = enSlugMap.get(frSlug) ?? frSlug;
      return `/en/blog/${enSlug}/`;
    });

  const allEnPaths = [
    ...enStaticRoutes.map((r) => withTrailingSlash(r)),
    ...enPostPaths,
  ];

  function frPathForEn(enPath: string): string {
    const matchPost = posts.find((post) => {
      if (isFrenchOnlyPost(post)) return false;
      const frSlug = getPostSlug(post);
      const enSlug = enSlugMap.get(frSlug) ?? frSlug;
      return `/en/blog/${enSlug}/` === enPath;
    });
    if (matchPost) return getPostUrl(matchPost);
    return swapLangPrefix(enPath, "fr");
  }

  const enEntries = allEnPaths.map((enPath) => {
    const frPath = frPathForEn(enPath);
    const lastmod = lastmodFor(frPath);
    const frHref = absolute(frPath);
    const enHref = absolute(enPath);

    return `
      <url>
        <loc>${enHref}</loc>
        <lastmod>${lastmod}</lastmod>
        <xhtml:link rel="alternate" hreflang="fr" href="${frHref}"/>
        <xhtml:link rel="alternate" hreflang="en" href="${enHref}"/>
        <xhtml:link rel="alternate" hreflang="x-default" href="${frHref}"/>
      </url>`;
  });

  const body = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
          xmlns:xhtml="http://www.w3.org/1999/xhtml">
    ${[...frEntries, ...enEntries].join("")}
  </urlset>`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
};
