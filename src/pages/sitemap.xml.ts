import type { APIRoute } from "astro";

import { siteConfig, staticRoutes } from "../data/site";
import { getAllPosts, getEnSlugMap, getPostSlug, getPostUrl, isFrenchOnlyPost } from "../utils/blog";
import { swapLangPrefix, withTrailingSlash, type SiteLang } from "../utils/lang-paths";

/** Langues indexées dans le sitemap.
   `fr` et `en` sont exposés. `de` reste exclu tant que les traductions
   allemandes ne sont pas finalisées (cf. noindex dans BaseLayout). */
const langs: SiteLang[] = ["fr", "en"];

export const GET: APIRoute = async () => {
  const posts = await getAllPosts();
  const enSlugMap = await getEnSlugMap();

  const frPaths = [
    ...staticRoutes.map((route) => withTrailingSlash(route)),
    ...posts.map((post) => getPostUrl(post)),
  ];

  function absolute(path: string) {
    return new URL(withTrailingSlash(path), siteConfig.siteUrl).toString();
  }

  function lastmodFor(frPath: string): string {
    const post = posts.find((p) => getPostUrl(p) === frPath);
    if (post) return (post.data.updatedDate ?? post.data.publishDate).toISOString();
    return new Date().toISOString();
  }

  /** URL localisée d'une page : pour les articles EN, on substitue le slug
   *  par le slug localisé déclaré dans la traduction (frontmatter `enSlug`),
   *  sinon on retombe sur le slug FR via `swapLangPrefix`. */
  function localizedPath(frPath: string, lang: SiteLang): string {
    if (lang !== "en") return swapLangPrefix(frPath, lang);
    const post = posts.find((p) => getPostUrl(p) === frPath);
    if (!post) return swapLangPrefix(frPath, "en");
    const frSlug = getPostSlug(post);
    const enSlug = enSlugMap.get(frSlug) ?? frSlug;
    return `/en/blog/${enSlug}/`;
  }

  const body = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
          xmlns:xhtml="http://www.w3.org/1999/xhtml">
    ${frPaths
      .map((frPath) => {
        const loc = absolute(frPath);
        const lastmod = lastmodFor(frPath);
        const post = posts.find((p) => getPostUrl(p) === frPath);
        const frenchOnly = post ? isFrenchOnlyPost(post) : false;
        const alternates = frenchOnly
          ? `<xhtml:link rel="alternate" hreflang="fr" href="${loc}"/>`
          : langs
              .map((lang) => {
                const href = absolute(localizedPath(frPath, lang));
                const hreflang = lang;
                return `<xhtml:link rel="alternate" hreflang="${hreflang}" href="${href}"/>`;
              })
              .join("\n          ");
        const xDefault = `<xhtml:link rel="alternate" hreflang="x-default" href="${loc}"/>`;
        return `
        <url>
          <loc>${loc}</loc>
          <lastmod>${lastmod}</lastmod>
          ${alternates}
          ${xDefault}
        </url>`;
      })
      .join("")}
  </urlset>`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
};
