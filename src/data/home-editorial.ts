import { getPostSlug, type BlogEntry } from "../utils/blog";

/** Choix éditorial de l’accueil FR. Un article absent ou non publié n’est jamais affiché. */
export const homeEditorial = {
  leadSlug: "echecs-et-la-triche",
  leadKicker: "Échecs & société",
  leadTitle: "La triche aux échecs : ce que l’affaire Niemann a vraiment révélé",
  leadSummary: "Au-delà du scandale, une question de confiance. Ce que l’affaire Niemann raconte des moteurs, du soupçon et de l’avenir de la compétition.",
  secondarySlugs: ["reseau-mode-defaut-aux-echecs", "manipulation-emotionnelle-aux-echecs"],
} as const;

/** Une seule sélection partagée par la une et le reste de l’accueil, sans doublons. */
export function getHomeEditorialPosts(posts: BlogEntry[]) {
  const eligible = posts.filter(post => !post.data.noindex);
  const bySlug = new Map(eligible.map(post => [getPostSlug(post), post]));
  const lead = bySlug.get(homeEditorial.leadSlug) ?? eligible[0];
  const used = new Set(lead ? [lead.id] : []);
  const secondary: BlogEntry[] = [];
  for (const slug of homeEditorial.secondarySlugs) {
    const post = bySlug.get(slug);
    if (post && !used.has(post.id)) { secondary.push(post); used.add(post.id); }
  }
  for (const post of eligible) {
    if (secondary.length >= 2) break;
    if (!used.has(post.id)) { secondary.push(post); used.add(post.id); }
  }
  const latest = eligible.filter(post => !used.has(post.id)).slice(0, 4);
  return { lead, secondary, latest };
}
