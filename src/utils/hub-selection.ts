import type { BlogEntry } from "./blog";
import type { HubEditorial } from "../data/hub-editorial";

/** Répartit chaque article une seule fois et ne remplace jamais les données d’image. */
export function selectHubPosts(
  posts: BlogEntry[],
  editorial: HubEditorial,
  slugOf: (post: BlogEntry) => string,
) {
  const now = Date.now();
  const eligible = posts
    .filter(post => !post.data.noindex && post.data.publishDate.getTime() <= now)
    .sort((a, b) => b.data.publishDate.getTime() - a.data.publishDate.getTime());
  const bySlug = new Map(eligible.map(post => [slugOf(post), post]));
  const used = new Set<string>();
  const take = (candidates: BlogEntry[], limit: number) => {
    const selected: BlogEntry[] = [];
    for (const post of candidates) {
      if (selected.length >= limit) break;
      if (!used.has(post.id)) { selected.push(post); used.add(post.id); }
    }
    return selected;
  };
  const resolve = (slugs: string[]) => slugs.flatMap(slug => {
    const post = bySlug.get(slug);
    return post ? [post] : [];
  });
  const lead = take(resolve([editorial.lead]).length ? resolve([editorial.lead]) : eligible, 1)[0];
  const essentials = take([...resolve(editorial.essentials), ...eligible], 2);
  // Les nouveautés gardent la priorité chronologique avant le choix des thèmes.
  const latest = take(eligible, 4);
  const themes = editorial.themes.map(theme => ({ ...theme, posts: take(resolve(theme.slugs), 2) }));
  const archive = eligible.filter(post => !used.has(post.id));
  const themeOf = (post: BlogEntry) => editorial.themes.find(theme => theme.slugs.includes(slugOf(post)))?.id ?? "other";
  return { eligible, lead, essentials, latest, themes, archive, themeOf };
}
