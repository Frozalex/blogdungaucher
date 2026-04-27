import type { APIRoute } from "astro";

import { siteConfig, staticRoutes, enStaticRoutes } from "../data/site";
import { getAllPosts, getPostUrl, getPostUrlEn } from "../utils/blog";

export const GET: APIRoute = async () => {
  const posts = await getAllPosts();

  const frUrls = [
    ...staticRoutes.map((route) => ({
      loc: new URL(route, siteConfig.siteUrl).toString(),
      lastmod: new Date().toISOString(),
      enLoc: new URL(`/en${route === "/" ? "/" : route}/`, siteConfig.siteUrl).toString(),
    })),
    ...posts.map((post) => ({
      loc: new URL(getPostUrl(post), siteConfig.siteUrl).toString(),
      lastmod: (post.data.updatedDate ?? post.data.publishDate).toISOString(),
      enLoc: new URL(getPostUrlEn(post), siteConfig.siteUrl).toString(),
    })),
  ];

  const enUrls = [
    ...enStaticRoutes.map((route) => ({
      loc: new URL(route, siteConfig.siteUrl).toString(),
      lastmod: new Date().toISOString(),
      frLoc: new URL(route.replace(/^\/en/, "") || "/", siteConfig.siteUrl).toString(),
    })),
    ...posts.map((post) => ({
      loc: new URL(getPostUrlEn(post), siteConfig.siteUrl).toString(),
      lastmod: (post.data.updatedDate ?? post.data.publishDate).toISOString(),
      frLoc: new URL(getPostUrl(post), siteConfig.siteUrl).toString(),
    })),
  ];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
          xmlns:xhtml="http://www.w3.org/1999/xhtml">
    ${frUrls
      .map(
        (url) => `
        <url>
          <loc>${url.loc}</loc>
          <lastmod>${url.lastmod}</lastmod>
          <xhtml:link rel="alternate" hreflang="fr" href="${url.loc}"/>
          <xhtml:link rel="alternate" hreflang="en" href="${url.enLoc}"/>
          <xhtml:link rel="alternate" hreflang="x-default" href="${url.loc}"/>
        </url>`,
      )
      .join("")}
    ${enUrls
      .map(
        (url) => `
        <url>
          <loc>${url.loc}</loc>
          <lastmod>${url.lastmod}</lastmod>
          <xhtml:link rel="alternate" hreflang="fr" href="${url.frLoc}"/>
          <xhtml:link rel="alternate" hreflang="en" href="${url.loc}"/>
          <xhtml:link rel="alternate" hreflang="x-default" href="${url.frLoc}"/>
        </url>`,
      )
      .join("")}
  </urlset>`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
};
