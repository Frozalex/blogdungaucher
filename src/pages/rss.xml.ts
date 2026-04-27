import type { APIRoute } from "astro";

import { siteConfig } from "../data/site";
import { getAllPosts, getPostUrl } from "../utils/blog";

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export const GET: APIRoute = async () => {
  const posts = await getAllPosts();

  const items = posts
    .map((post) => {
      const url = new URL(getPostUrl(post), siteConfig.siteUrl).toString();
      const description = escapeXml(post.data.seoDescription ?? post.data.excerpt);

      return `
        <item>
          <title>${escapeXml(post.data.title)}</title>
          <link>${url}</link>
          <guid>${url}</guid>
          <pubDate>${post.data.publishDate.toUTCString()}</pubDate>
          <description>${description}</description>
        </item>
      `;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8" ?>
    <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
      <channel>
        <title>${escapeXml(siteConfig.name)}</title>
        <link>${siteConfig.siteUrl}</link>
        <atom:link href="${siteConfig.siteUrl}/rss.xml" rel="self" type="application/rss+xml" />
        <description>${escapeXml(siteConfig.defaultDescription)}</description>
        <language>fr-fr</language>
        <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
        ${items}
      </channel>
    </rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
};
