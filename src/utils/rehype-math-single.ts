import katex from "katex";
import { visit } from "unist-util-visit";
import type { Root, Element, Parent, RootContent } from "hast";

/**
 * Rehype : rend les maths de `remark-math` en UN SEUL rendu.
 *
 * Pourquoi ne pas utiliser `rehype-katex` tel quel : par défaut KaTeX émet
 * simultanément le HTML visuel, le MathML pour les lecteurs d'écran, ET
 * l'annotation `<annotation encoding="application/x-tex">` qui contient la
 * source LaTeX. Tout extracteur de texte naïf (Googlebot, Pagefind, les
 * scrapers d'audit, les lecteurs d'articles) concatène les trois et lit
 * « 10^{120}10120 » là où l'humain voit « 10¹²⁰ ».
 *
 * On n'émet donc que la branche HTML (`output: "html"`). Comme KaTeX pose
 * `aria-hidden="true"` sur cette branche - elle n'existe que pour l'œil - la
 * formule deviendrait muette pour les technologies d'assistance : on rétablit
 * donc une alternative accessible sur le conteneur via `role="math"` +
 * `aria-label` portant la source LaTeX.
 *
 * Le HTML de KaTeX est injecté en nœud `raw` : Astro branche `rehype-raw`
 * APRÈS les plugins rehype de l'utilisateur (cf. @astrojs/markdown-remark), et
 * le chemin FAQ (`markdown-strip-faq.ts`) sérialise avec
 * `allowDangerousHtml`. Les deux rendus convergent donc.
 */

function toClassList(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String);
  if (typeof value === "string") return value.split(/\s+/).filter(Boolean);
  return [];
}

/** Texte brut d'un sous-arbre hast (la source LaTeX, telle que remark-math la laisse). */
function textOf(node: RootContent | Element): string {
  if (node.type === "text") return node.value;
  const children = "children" in node ? node.children : [];
  return children.map((child) => textOf(child as RootContent)).join("");
}

function escapeAttribute(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export function rehypeMathSingle() {
  return (tree: Root) => {
    visit(tree, "element", (node: Element, index: number | undefined, parent: Parent | undefined) => {
      if (parent === undefined || index === undefined) return;

      const classes = toClassList(node.properties?.className);
      const isInline = classes.includes("math-inline");
      const isDisplay = classes.includes("math-display");
      if (!isInline && !isDisplay) return;

      const tex = textOf(node).trim();
      if (tex === "") return;

      let rendered: string;
      try {
        rendered = katex.renderToString(tex, {
          displayMode: isDisplay,
          output: "html",
          throwOnError: false,
          strict: false,
        });
      } catch {
        // KaTeX a déjà `throwOnError: false` ; ce filet ne sert qu'aux erreurs
        // de parsing irrécupérables. On laisse alors la source visible plutôt
        // que de perdre le contenu.
        return;
      }

      const tag = isDisplay ? "div" : "span";
      const wrapperClass = isDisplay ? "math-render math-render--display" : "math-render";
      const html =
        `<${tag} class="${wrapperClass}" role="math" aria-label="${escapeAttribute(tex)}">` +
        `${rendered}</${tag}>`;

      parent.children[index] = { type: "raw", value: html } as unknown as RootContent;
    });
  };
}
