import type { APIRoute } from "astro";

import { siteConfig, staticRoutes } from "../data/site";
import { getAllPosts, getPostUrl } from "../utils/blog";

export const GET: APIRoute = async () => {
  const posts = await getAllPosts();
  const urls = [
    ...staticRoutes.map((route) => ({
      loc: new URL(route, siteConfig.siteUrl).toString(),
      lastmod: new Date().toISOString(),
    })),
    ...posts.map((post) => ({
      loc: new URL(getPostUrl(post), siteConfig.siteUrl).toString(),
      lastmod: (post.data.updatedDate ?? post.data.publishDate).toISOString(),
    })),
  ];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${urls
      .map(
        (url) => `
          <url>
            <loc>${url.loc}</loc>
            <lastmod>${url.lastmod}</lastmod>
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
