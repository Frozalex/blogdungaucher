import { visit } from "unist-util-visit";
import type { Root, Element } from "hast";

/**
 * Domaines considérés comme liens affiliés (à baliser rel="sponsored").
 * Les liens sont tissés en exemples contextuels dans le corps des articles
 * (cf. src/data/affiliate-products.ts) plutôt que regroupés dans un bloc.
 */
const AFFILIATE_HOST_PATTERNS: RegExp[] = [/(^|\.)amzn\.to$/i, /(^|\.)amazon\./i];

function isAffiliateHref(href: string): boolean {
  try {
    const url = new URL(href, "https://x.invalid");
    return AFFILIATE_HOST_PATTERNS.some((re) => re.test(url.hostname));
  } catch {
    return /amzn\.to|amazon\./i.test(href);
  }
}

function toClassList(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String);
  if (typeof value === "string") return value.split(/\s+/).filter(Boolean);
  return [];
}

/**
 * Rehype : marque les liens affiliés (Amazon) tissés dans le corps des articles.
 *
 * - `rel="sponsored nofollow noopener"` : conformité SEO (Google impose
 *   `sponsored`/`nofollow` sur les liens rémunérés) et sécurité (noopener).
 * - `target="_blank"` : ouvre la boutique dans un nouvel onglet sans quitter la
 *   lecture.
 * - classe `affiliate-link` : permet un rendu discret et cohérent côté CSS.
 *
 * Idempotent : ré-applique proprement rel/classe sans doublon.
 */
export function rehypeAffiliateLinks() {
  return (tree: Root) => {
    visit(tree, "element", (node: Element) => {
      if (node.tagName !== "a") return;
      node.properties ??= {};
      const href = node.properties.href;
      if (typeof href !== "string" || !isAffiliateHref(href)) return;

      const rel = new Set(toClassList(node.properties.rel));
      rel.add("sponsored");
      rel.add("nofollow");
      rel.add("noopener");
      node.properties.rel = [...rel];
      node.properties.target = "_blank";

      const classes = new Set(toClassList(node.properties.className));
      classes.add("affiliate-link");
      node.properties.className = [...classes];
    });
  };
}
