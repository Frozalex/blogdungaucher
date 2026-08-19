import { categoryMap, categorySlugs } from "../data/site";
import { t, type Lang } from "../i18n/translations";
import type { SiteLang } from "./blog";
import {
  filterPostsForLang,
  formatDateForLang,
  getAllPosts,
  getLocalizedPostText,
  getPostHeroSrc,
  getPostUrlLang,
} from "./blog";

/**
 * Index complet des articles d'une langue, consommé par le filtre par rubrique
 * des pages /blog/ (voir src/scripts/blog-filter.ts).
 *
 * Les listings sont paginés à 9 articles ; sans cet index, un filtre côté client
 * ne pourrait travailler que sur les 9 cartes présentes dans le DOM. Le fichier
 * n'est téléchargé qu'au survol ou au premier clic sur un chip, donc il ne coûte
 * rien aux visiteurs qui ne filtrent pas.
 */
export async function buildBlogIndexResponse(lang: SiteLang) {
  const posts = filterPostsForLang(await getAllPosts(), lang);

  const entries = await Promise.all(
    posts.map(async (post) => {
      const { title, excerpt } = await getLocalizedPostText(post, lang);
      const hero = getPostHeroSrc(post);
      return {
        href: await getPostUrlLang(post, lang),
        title,
        excerpt,
        category: post.data.category,
        readingTime: post.data.readingTime,
        date: formatDateForLang(post.data.publishDate, lang),
        iso: post.data.publishDate.toISOString(),
        hero,
        heroAlt: hero ? (post.data.heroImage?.alt || title) : "",
      };
    }),
  );

  // Libellés de rubrique : le badge et le kicker des cartes générées côté client
  // doivent correspondre au rendu serveur.
  const categories = Object.fromEntries(
    categorySlugs.map((slug) => [
      slug,
      {
        label: t(lang as Lang, `categories.${slug}.label`),
        shortLabel: t(lang as Lang, `categories.${slug}.shortLabel`),
        accent: categoryMap[slug].accent,
      },
    ]),
  );

  return new Response(JSON.stringify({ categories, posts: entries }), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
