import type { APIRoute } from "astro";
import { getCollection } from "astro:content";

import { siteConfig } from "../../data/site";
import {
  getAllPosts,
  getPostSlug,
  getPostUrlEn,
  isFrenchOnlyPost,
} from "../../utils/blog";

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

  // Traductions EN indexées par slug FR source (convention EN : NOM DE FICHIER = slug FR).
  // On dérive le slug FR de `e.id` (comme getEnSlugMap) plutôt que via getPostSlug (typé BlogEntry).
  // On ignore les entrées draft:true (traductions préparées mais non publiées).
  const enEntries = await getCollection("enTranslations");
  const enBySlug = new Map<string, (typeof enEntries)[number]>(
    enEntries
      .filter((e) => !e.data.draft)
      .map((e) => [e.id.replace(/\.mdx?$/i, "").split("/").filter(Boolean).pop()!, e] as const),
  );

  // On ne garde que les articles ayant une VRAIE traduction EN (pas de contenu FR-only,
  // pas de fallback) : parité stricte avec les pages /en/blog réellement servies.
  const items = (
    await Promise.all(
      posts
        .filter((post) => !isFrenchOnlyPost(post))
        .map(async (post) => {
          const translation = enBySlug.get(getPostSlug(post));
          if (!translation) return null;

          const url = new URL(await getPostUrlEn(post), siteConfig.siteUrl).toString();
          const title = escapeXml(translation.data.title);
          const description = escapeXml(
            translation.data.seoDescription ?? translation.data.excerpt,
          );

          return `
        <item>
          <title>${title}</title>
          <link>${url}</link>
          <guid>${url}</guid>
          <pubDate>${post.data.publishDate.toUTCString()}</pubDate>
          <description>${description}</description>
        </item>
      `;
        }),
    )
  )
    .filter((item): item is string => item !== null)
    .join("");

  const channelTitle = escapeXml(`${siteConfig.name} (English)`);
  const channelDescription = escapeXml(
    "A personal chess blog on the science of the game, the competitive mindset and the social impact of chess.",
  );

  const xml = `<?xml version="1.0" encoding="UTF-8" ?>
    <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
      <channel>
        <title>${channelTitle}</title>
        <link>${siteConfig.siteUrl}/en/</link>
        <atom:link href="${siteConfig.siteUrl}/en/rss.xml" rel="self" type="application/rss+xml" />
        <description>${channelDescription}</description>
        <language>en-us</language>
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
