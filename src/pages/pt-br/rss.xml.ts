import type { APIRoute } from "astro";
import { getCollection } from "astro:content";

import { siteConfig, PT_BR_LAUNCH_DATE } from "../../data/site";
import {
  getAllPosts,
  getPostSlug,
  getPostUrlPtBr,
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
  // Avant le lancement pt-BR, aucune page /pt-br/blog n'existe : on ne sert pas le flux
  // (cohérent avec le gating `getStaticPaths` des routes pt-BR).
  if (new Date() < PT_BR_LAUNCH_DATE) {
    return new Response("Not found", { status: 404 });
  }

  const posts = await getAllPosts();

  // Traductions pt-BR indexées par slug FR source. Convention pt-BR : le NOM DE FICHIER est
  // le slug localisé, et `frSlug` porte le slug FR (fallback sur le slug du fichier si absent).
  // On dérive le slug de `e.id` (comme getPtBrSlugMap) plutôt que via getPostSlug (typé BlogEntry).
  // On ignore les entrées draft:true (traductions préparées mais non publiées).
  const ptBrEntries = await getCollection("ptBrTranslations");
  const ptBrBySlug = new Map<string, (typeof ptBrEntries)[number]>(
    ptBrEntries
      .filter((e) => !e.data.draft)
      .map((e) => [
        e.data.frSlug ?? e.id.replace(/\.mdx?$/i, "").split("/").filter(Boolean).pop()!,
        e,
      ] as const),
  );

  // On ne garde que les articles ayant une VRAIE traduction pt-BR (pas de contenu FR-only,
  // pas de fallback) : parité stricte avec les pages /pt-br/blog réellement servies.
  const items = (
    await Promise.all(
      posts
        .filter((post) => !isFrenchOnlyPost(post))
        .map(async (post) => {
          const translation = ptBrBySlug.get(getPostSlug(post));
          if (!translation) return null;

          const url = new URL(await getPostUrlPtBr(post), siteConfig.siteUrl).toString();
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

  const channelTitle = escapeXml(`${siteConfig.name} (Português)`);
  const channelDescription = escapeXml(
    "Um blog de xadrez pessoal sobre a ciência do jogo, o espírito competitivo e o impacto social do xadrez.",
  );

  const xml = `<?xml version="1.0" encoding="UTF-8" ?>
    <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
      <channel>
        <title>${channelTitle}</title>
        <link>${siteConfig.siteUrl}/pt-br/</link>
        <atom:link href="${siteConfig.siteUrl}/pt-br/rss.xml" rel="self" type="application/rss+xml" />
        <description>${channelDescription}</description>
        <language>pt-br</language>
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
