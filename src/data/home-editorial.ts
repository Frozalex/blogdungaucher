import { getPostSlug, type BlogEntry } from "../utils/blog";
import { mostReadSlugs } from "./most-read";

export const homeTitles = {
  fr: "Un blog sur les échecs vus sous un autre angle",
  en: "A blog about chess from a different perspective",
  "pt-br": "Um blog sobre xadrez sob outro ângulo",
  nl: "Een blog over schaken vanuit een andere invalshoek",
} as const;

/** Choix éditorial de l’accueil FR. Un article absent ou non publié n’est jamais affiché. */
export const homeEditorial = {
  reviewedAt: "2026-11-13",
  reviewAfter: "2026-12-13",
  leadSlug: "echecs-et-la-triche",
  leadKicker: "Échecs & société",
  leadTitle: "La triche aux échecs : ce que l’affaire Niemann a vraiment révélé",
  leadSummary: "Au-delà du scandale, une question de confiance. Ce que l’affaire Niemann raconte des moteurs, du soupçon et de l’avenir de la compétition.",
  selectionSlugs: ["reseau-mode-defaut-aux-echecs", "manipulation-emotionnelle-aux-echecs", "echecs-et-diplomatie"],
} as const;

export function getGaucherSelection(posts: BlogEntry[], displayed: BlogEntry[]) {
  const used = new Set(displayed.map(post => post.id));
  const bySlug = new Map(posts.filter(post => !post.data.noindex).map(post => [getPostSlug(post), post]));
  const selection: BlogEntry[] = [];
  for (const slug of [...homeEditorial.selectionSlugs, ...mostReadSlugs]) {
    const post = bySlug.get(slug);
    if (!post || used.has(post.id)) continue;
    selection.push(post);
    used.add(post.id);
    if (selection.length === 3) break;
  }
  return selection;
}

/** Une seule sélection partagée par la une et le reste de l’accueil, sans doublons. */
export function getHomeEditorialPosts(posts: BlogEntry[]) {
  const eligible = posts.filter(post => !post.data.noindex);
  const lead = eligible.find(post => getPostSlug(post) === homeEditorial.leadSlug) ?? eligible[0];
  const feed = lead ? [lead, ...eligible.filter(post => post.id !== lead.id).slice(0, 6)] : [];
  return { lead, feed, latest: eligible[0], selection: getGaucherSelection(eligible, feed) };
}
