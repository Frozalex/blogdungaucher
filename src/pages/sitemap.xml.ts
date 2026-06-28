import type { APIRoute } from "astro";

import { siteConfig, staticRoutes, enStaticRoutes, ptBrStaticRoutes, nlStaticRoutes, PT_BR_LAUNCH_DATE, NL_LAUNCH_DATE } from "../data/site";
import { getAllPosts, getEnSlugMap, getPtBrSlugMap, getNlSlugMap, getPostSlug, getPostUrl, isFrenchOnlyPost } from "../utils/blog";
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
  const ptBrLive = new Date() >= PT_BR_LAUNCH_DATE;
  const nlLive = new Date() >= NL_LAUNCH_DATE;
  const ptBrSlugMap = ptBrLive ? await getPtBrSlugMap() : new Map<string, string>();
  const nlSlugMap = nlLive ? await getNlSlugMap() : new Map<string, string>();

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

  function ptBrPathFor(frPath: string): string {
    const post = posts.find((p) => getPostUrl(p) === frPath);
    if (!post) return swapLangPrefix(frPath, "pt-br");
    const frSlug = getPostSlug(post);
    const ptBrSlug = ptBrSlugMap.get(frSlug) ?? frSlug;
    return `/pt-br/blog/${ptBrSlug}/`;
  }

  function nlPathFor(frPath: string): string {
    const post = posts.find((p) => getPostUrl(p) === frPath);
    if (!post) return swapLangPrefix(frPath, "nl");
    const frSlug = getPostSlug(post);
    const nlSlug = nlSlugMap.get(frSlug) ?? frSlug;
    return `/nl/blog/${nlSlug}/`;
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

    let alternates: string;
    if (frOnly) {
      alternates =
        `<xhtml:link rel="alternate" hreflang="fr" href="${loc}"/>
          <xhtml:link rel="alternate" hreflang="x-default" href="${loc}"/>`;
    } else {
      const base = langs
        .map((lang) => {
          const href = absolute(lang === "en" ? enPathFor(frPath) : frPath);
          return `<xhtml:link rel="alternate" hreflang="${lang}" href="${href}"/>`;
        })
        .join("\n          ");
      const frSlug = posts.find((p) => getPostUrl(p) === frPath);
      const hasPtBr = frSlug ? ptBrSlugMap.has(getPostSlug(frSlug)) : false;
      const hasNl = frSlug ? nlSlugMap.has(getPostSlug(frSlug)) : false;
      const ptBrPart = ptBrLive && hasPtBr
        ? `\n          <xhtml:link rel="alternate" hreflang="pt-BR" href="${absolute(ptBrPathFor(frPath))}"/>`
        : "";
      const nlPart = nlLive && hasNl
        ? `\n          <xhtml:link rel="alternate" hreflang="nl" href="${absolute(nlPathFor(frPath))}"/>`
        : "";
      alternates = base + ptBrPart + nlPart + `\n          <xhtml:link rel="alternate" hreflang="x-default" href="${loc}"/>`;
    }

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
    const matchedFrPost = posts.find((p) => getPostUrl(p) === frPath);
    const enHasPtBr = matchedFrPost ? ptBrSlugMap.has(getPostSlug(matchedFrPost)) : false;
    const enHasNl = matchedFrPost ? nlSlugMap.has(getPostSlug(matchedFrPost)) : false;
    const ptBrPart = ptBrLive && !isFrOnlyPath(frPath) && enHasPtBr
      ? `\n        <xhtml:link rel="alternate" hreflang="pt-BR" href="${absolute(ptBrPathFor(frPath))}"/>`
      : "";
    const nlEnPart = nlLive && !isFrOnlyPath(frPath) && enHasNl
      ? `\n        <xhtml:link rel="alternate" hreflang="nl" href="${absolute(nlPathFor(frPath))}"/>`
      : "";

    return `
      <url>
        <loc>${enHref}</loc>
        <lastmod>${lastmod}</lastmod>
        <xhtml:link rel="alternate" hreflang="fr" href="${frHref}"/>
        <xhtml:link rel="alternate" hreflang="en" href="${enHref}"/>${ptBrPart}${nlEnPart}
        <xhtml:link rel="alternate" hreflang="x-default" href="${frHref}"/>
      </url>`;
  });

  // ── Entrées NL (gated : uniquement si nlLive) ──────────────────────────────
  const nlEntries: string[] = [];
  if (nlLive) {
    const nlPostPaths = posts
      .filter((post) => !isFrenchOnlyPost(post))
      .filter((post) => nlSlugMap.has(getPostSlug(post)))
      .map((post) => {
        const frSlug = getPostSlug(post);
        const nlSlug = nlSlugMap.get(frSlug)!;
        return { nlPath: `/nl/blog/${nlSlug}/`, frPath: getPostUrl(post) };
      });

    const allNlPaths = [
      ...nlStaticRoutes.map((r) => ({ nlPath: withTrailingSlash(r), frPath: swapLangPrefix(r, "fr") })),
      ...nlPostPaths,
    ];

    for (const { nlPath, frPath } of allNlPaths) {
      const lastmod = lastmodFor(frPath);
      const frHref = absolute(frPath);
      const enPath = enPathFor(frPath);
      const enHref = absolute(enPath);
      const nlHref = absolute(nlPath);

      nlEntries.push(`
      <url>
        <loc>${nlHref}</loc>
        <lastmod>${lastmod}</lastmod>
        <xhtml:link rel="alternate" hreflang="fr" href="${frHref}"/>
        <xhtml:link rel="alternate" hreflang="en" href="${enHref}"/>
        <xhtml:link rel="alternate" hreflang="nl" href="${nlHref}"/>
        <xhtml:link rel="alternate" hreflang="x-default" href="${frHref}"/>
      </url>`);
    }
  }

  // ── Entrées PT-BR (gated : uniquement si ptBrLive) ─────────────────────────
  const ptBrEntries: string[] = [];
  if (ptBrLive) {
    const ptBrPostPaths = posts
      .filter((post) => !isFrenchOnlyPost(post))
      .filter((post) => ptBrSlugMap.has(getPostSlug(post)))
      .map((post) => {
        const frSlug = getPostSlug(post);
        const ptBrSlug = ptBrSlugMap.get(frSlug)!;
        return { ptBrPath: `/pt-br/blog/${ptBrSlug}/`, frPath: getPostUrl(post) };
      });

    const allPtBrPaths = [
      ...ptBrStaticRoutes.map((r) => ({ ptBrPath: withTrailingSlash(r), frPath: swapLangPrefix(r, "fr") })),
      ...ptBrPostPaths,
    ];

    for (const { ptBrPath, frPath } of allPtBrPaths) {
      const lastmod = lastmodFor(frPath);
      const frHref = absolute(frPath);
      const enPath = enPathFor(frPath);
      const enHref = absolute(enPath);
      const ptBrHref = absolute(ptBrPath);

      ptBrEntries.push(`
      <url>
        <loc>${ptBrHref}</loc>
        <lastmod>${lastmod}</lastmod>
        <xhtml:link rel="alternate" hreflang="fr" href="${frHref}"/>
        <xhtml:link rel="alternate" hreflang="en" href="${enHref}"/>
        <xhtml:link rel="alternate" hreflang="pt-BR" href="${ptBrHref}"/>
        <xhtml:link rel="alternate" hreflang="x-default" href="${frHref}"/>
      </url>`);
    }
  }

  const body = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
          xmlns:xhtml="http://www.w3.org/1999/xhtml">
    ${[...frEntries, ...enEntries, ...nlEntries, ...ptBrEntries].join("")}
  </urlset>`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
};
