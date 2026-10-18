import type { APIRoute } from "astro";
import { getCollection } from "astro:content";

import { siteConfig, staticRoutes, enStaticRoutes, ptBrStaticRoutes, nlStaticRoutes, PT_BR_LAUNCH_DATE, NL_LAUNCH_DATE, isIndexedLang } from "../data/site";
import { serieMoteurSlugs } from "../data/serie-moteur-python";
import { getAllPosts, getEnSlugMap, getPtBrSlugMap, getNlSlugMap, getPostSlug, getPostUrl, isFrenchOnlyPost } from "../utils/blog";
import { swapLangPrefix, withTrailingSlash, type SiteLang } from "../utils/lang-paths";

/** Pages exclues du sitemap : thin content et pages légales.
 *  Doit rester synchrone avec les `noindex={true}` des pages correspondantes :
 *  une URL en noindex dans le sitemap ne génère que du bruit en Search Console. */
const EXCLUDED_PATHS = new Set([
  "/fr/mentions-legales/",
  "/fr/politique-confidentialite/",
  "/fr/accessibilite/",
  "/en/legal-notice/",
  "/en/privacy-policy/",
  "/en/accessibility/",
  "/fr/analyses/",
  // Page « coming soon » : aucune dissertation traduite, donc noindex côté page.
  "/en/dissertations/",
]);

export const GET: APIRoute = async () => {
  const posts = await getAllPosts();
  const enSlugMap = await getEnSlugMap();
  const ptBrLive = new Date() >= PT_BR_LAUNCH_DATE;
  const nlLive = new Date() >= NL_LAUNCH_DATE;
  const ptBrSlugMap = ptBrLive ? await getPtBrSlugMap() : new Map<string, string>();
  const nlSlugMap = nlLive ? await getNlSlugMap() : new Map<string, string>();

  // La série moteur-python se dévoile au fil des semaines (cf. moteur-python.astro) :
  // sa page d'index reste hors sitemap tant qu'aucun des 12 articles n'est publié.
  const publishedSlugs = new Set(posts.map((p) => getPostSlug(p)));
  const moteurPythonHasPublishedArticle = serieMoteurSlugs.some((s) => publishedSlugs.has(s));
  if (!moteurPythonHasPublishedArticle) {
    EXCLUDED_PATHS.add("/fr/series/moteur-python/");
  }

  // Slugs FR disposant d'une traduction réellement publiée (fichier présent et
  // `draft: false`). Sans elle, /en/blog/<slug>/ et /pt-br/blog/<slug>/ servent le
  // texte français avec un bandeau : ces pages passent en noindex côté template
  // (cf. `hasEnTranslation` / `hasPtBrTranslation`) et n'entrent donc pas ici.
  const lastSegment = (id: string) => id.replace(/\.mdx?$/i, "").split("/").filter(Boolean).pop()!;

  const enTranslated = new Set(
    (await getCollection("enTranslations")).filter((e) => !e.data.draft).map((e) => lastSegment(e.id)),
  );
  const ptBrTranslated = new Set(
    (await getCollection("ptBrTranslations"))
      .filter((e) => !e.data.draft)
      .map((e) => e.data.frSlug ?? lastSegment(e.id)),
  );
  const nlTranslated = new Set(
    (await getCollection("nlTranslations"))
      .filter((e) => !e.data.draft)
      .map((e) => e.data.frSlug ?? lastSegment(e.id)),
  );

  function absolute(path: string) {
    return new URL(withTrailingSlash(path), siteConfig.siteUrl).toString();
  }

  const buildTime = new Date();

  // Dissertations : collection distincte des articles, pages FR-only servies par
  // /fr/dissertations/[slug].astro. `lastmodFor` les retrouve via `extraDates`,
  // sans quoi elles hériteraient de l'heure de build.
  const dissertations = (await getCollection("dissertations")).filter(
    (d) => d.data.publishDate <= buildTime,
  );
  const extraDates = new Map<string, Date>(
    dissertations.map((d) => [
      `/fr/dissertations/${lastSegment(d.id)}/`,
      d.data.updatedDate ?? d.data.publishDate,
    ]),
  );

  function lastmodFor(frPath: string): string {
    const post = posts.find((p) => getPostUrl(p) === frPath);
    const date = post ? (post.data.updatedDate ?? post.data.publishDate) : (extraDates.get(frPath) ?? buildTime);
    if (date > buildTime) {
      throw new Error(
        `sitemap: lastmod futur (${date.toISOString()}) pour ${frPath} — vérifier updatedDate/publishDate.`,
      );
    }
    return date.toISOString();
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

  // Pour les routes statiques, détermine si une version traduite existe
  const enStaticSet = new Set(enStaticRoutes.map((r) => withTrailingSlash(r)));
  const ptBrStaticSet = new Set(ptBrStaticRoutes.map((r) => withTrailingSlash(r)));
  const nlStaticSet = new Set(nlStaticRoutes.map((r) => withTrailingSlash(r)));

  /** La route statique équivalente existe dans `lang` et n'est pas exclue du
   *  sitemap. Déclarer en hreflang une page qu'on tient en noindex (page légale,
   *  « coming soon »…) ne ferait que remonter en Search Console. */
  function hasIndexableStatic(set: Set<string>, frPath: string, lang: SiteLang): boolean {
    const path = swapLangPrefix(frPath, lang);
    return set.has(path) && !EXCLUDED_PATHS.has(path);
  }

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

  const frPostPaths = posts.filter((post) => !post.data.noindex).map((post) => getPostUrl(post));
  const frDissertationPaths = [...extraDates.keys()];
  const allFrPaths = [...frStaticPaths, ...frPostPaths, ...frDissertationPaths];

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
      // Une alternative n'est déclarée que si la version existe ET est indexable.
      // Pour un article, « existe » veut dire traduction publiée : sans elle, la
      // page sert le texte FR sous bandeau et porte un noindex.
      const matchedPost = posts.find((p) => getPostUrl(p) === frPath);
      const slug = matchedPost ? getPostSlug(matchedPost) : null;
      const hasEn = slug ? enTranslated.has(slug) : hasIndexableStatic(enStaticSet, frPath, "en");
      const hasPtBr = slug ? ptBrTranslated.has(slug) : hasIndexableStatic(ptBrStaticSet, frPath, "pt-br");
      const hasNl = slug ? nlTranslated.has(slug) : hasIndexableStatic(nlStaticSet, frPath, "nl");

      const parts = [`<xhtml:link rel="alternate" hreflang="fr" href="${loc}"/>`];
      if (hasEn && isIndexedLang("en")) {
        parts.push(`<xhtml:link rel="alternate" hreflang="en" href="${absolute(enPathFor(frPath))}"/>`);
      }
      if (ptBrLive && hasPtBr && isIndexedLang("pt-br")) {
        parts.push(`<xhtml:link rel="alternate" hreflang="pt-BR" href="${absolute(ptBrPathFor(frPath))}"/>`);
      }
      if (nlLive && hasNl && isIndexedLang("nl")) {
        parts.push(`<xhtml:link rel="alternate" hreflang="nl" href="${absolute(nlPathFor(frPath))}"/>`);
      }
      parts.push(`<xhtml:link rel="alternate" hreflang="x-default" href="${loc}"/>`);
      alternates = parts.join("\n          ");
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
    .filter((post) => enTranslated.has(getPostSlug(post)))
    .map((post) => {
      const frSlug = getPostSlug(post);
      const enSlug = enSlugMap.get(frSlug) ?? frSlug;
      return `/en/blog/${enSlug}/`;
    });

  const allEnPaths = [
    ...enStaticRoutes.map((r) => withTrailingSlash(r)).filter((r) => !EXCLUDED_PATHS.has(r)),
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
    const enHasPtBr = matchedFrPost
      ? ptBrTranslated.has(getPostSlug(matchedFrPost))
      : hasIndexableStatic(ptBrStaticSet, frPath, "pt-br");
    const enHasNl = matchedFrPost
      ? nlTranslated.has(getPostSlug(matchedFrPost))
      : hasIndexableStatic(nlStaticSet, frPath, "nl");
    const ptBrPart = ptBrLive && isIndexedLang("pt-br") && !isFrOnlyPath(frPath) && enHasPtBr
      ? `\n        <xhtml:link rel="alternate" hreflang="pt-BR" href="${absolute(ptBrPathFor(frPath))}"/>`
      : "";
    const nlEnPart = nlLive && isIndexedLang("nl") && !isFrOnlyPath(frPath) && enHasNl
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
      .filter((post) => nlTranslated.has(getPostSlug(post)) && nlSlugMap.has(getPostSlug(post)))
      .map((post) => {
        const frSlug = getPostSlug(post);
        const nlSlug = nlSlugMap.get(frSlug)!;
        return { nlPath: `/nl/blog/${nlSlug}/`, frPath: getPostUrl(post) };
      });

    const allNlPaths = [
      ...nlStaticRoutes
        .map((r) => withTrailingSlash(r))
        .filter((r) => !EXCLUDED_PATHS.has(r))
        .map((r) => ({ nlPath: r, frPath: swapLangPrefix(r, "fr") })),
      ...nlPostPaths,
    ];

    for (const { nlPath, frPath } of allNlPaths) {
      const lastmod = lastmodFor(frPath);
      const frHref = absolute(frPath);
      const nlHref = absolute(nlPath);
      const matchedFrPost = posts.find((p) => getPostUrl(p) === frPath);
      const hasEn = matchedFrPost
        ? enTranslated.has(getPostSlug(matchedFrPost))
        : hasIndexableStatic(enStaticSet, frPath, "en");
      const enPart = hasEn && isIndexedLang("en")
        ? `\n        <xhtml:link rel="alternate" hreflang="en" href="${absolute(enPathFor(frPath))}"/>`
        : "";

      nlEntries.push(`
      <url>
        <loc>${nlHref}</loc>
        <lastmod>${lastmod}</lastmod>
        <xhtml:link rel="alternate" hreflang="fr" href="${frHref}"/>${enPart}
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
      .filter((post) => ptBrTranslated.has(getPostSlug(post)) && ptBrSlugMap.has(getPostSlug(post)))
      .map((post) => {
        const frSlug = getPostSlug(post);
        const ptBrSlug = ptBrSlugMap.get(frSlug)!;
        return { ptBrPath: `/pt-br/blog/${ptBrSlug}/`, frPath: getPostUrl(post) };
      });

    const allPtBrPaths = [
      ...ptBrStaticRoutes
        .map((r) => withTrailingSlash(r))
        .filter((r) => !EXCLUDED_PATHS.has(r))
        .map((r) => ({ ptBrPath: r, frPath: swapLangPrefix(r, "fr") })),
      ...ptBrPostPaths,
    ];

    for (const { ptBrPath, frPath } of allPtBrPaths) {
      const lastmod = lastmodFor(frPath);
      const frHref = absolute(frPath);
      const ptBrHref = absolute(ptBrPath);
      const matchedFrPost = posts.find((p) => getPostUrl(p) === frPath);
      const hasEn = matchedFrPost
        ? enTranslated.has(getPostSlug(matchedFrPost))
        : hasIndexableStatic(enStaticSet, frPath, "en");
      const enPart = hasEn && isIndexedLang("en")
        ? `\n        <xhtml:link rel="alternate" hreflang="en" href="${absolute(enPathFor(frPath))}"/>`
        : "";

      ptBrEntries.push(`
      <url>
        <loc>${ptBrHref}</loc>
        <lastmod>${lastmod}</lastmod>
        <xhtml:link rel="alternate" hreflang="fr" href="${frHref}"/>${enPart}
        <xhtml:link rel="alternate" hreflang="pt-BR" href="${ptBrHref}"/>
        <xhtml:link rel="alternate" hreflang="x-default" href="${frHref}"/>
      </url>`);
    }
  }

  const body = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
          xmlns:xhtml="http://www.w3.org/1999/xhtml">
    ${[
      ...(isIndexedLang("fr") ? frEntries : []),
      ...(isIndexedLang("en") ? enEntries : []),
      ...(isIndexedLang("nl") ? nlEntries : []),
      ...(isIndexedLang("pt-br") ? ptBrEntries : []),
    ].join("")}
  </urlset>`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
};
