import GithubSlugger from "github-slugger";
import * as cheerio from "cheerio";
import { toHtml } from "hast-util-to-html";
import { toString } from "mdast-util-to-string";
import type { Root as MdastRoot } from "mdast";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import remarkStringify from "remark-stringify";
import { unified } from "unified";

export type ArticleHeading = { depth: number; slug: string; text: string };

function parseMarkdown(markdown: string): MdastRoot {
  return unified().use(remarkParse).use(remarkGfm).use(remarkMath).parse(markdown) as MdastRoot;
}

/**
 * Détecte un H2 « FAQ » : slug ou titre (FR/EN/DE courants).
 */
function isFaqH2Heading(text: string, slug: string): boolean {
  const s = slug.toLowerCase();
  if (s.includes("faq")) return true;
  const t = text.trim();
  if (/faq/i.test(t)) return true;
  if (/questions?\s+fr[ée]quentes/i.test(t)) return true;
  if (/frequently\s+asked/i.test(t)) return true;
  if (/h[äa]ufige\s+fragen/i.test(t)) return true;
  return false;
}

/**
 * Supprime la première section H2 identifiée comme FAQ jusqu’au prochain H2 (non inclus).
 * Si aucune section FAQ n’est trouvée, renvoie le markdown inchangé.
 */
export function stripFaqH2Section(markdown: string): string {
  const tree = parseMarkdown(markdown);
  const slugger = new GithubSlugger();
  let cutStart = -1;

  for (let i = 0; i < tree.children.length; i++) {
    const node = tree.children[i];
    if (node.type === "heading" && node.depth === 2) {
      const text = toString(node);
      const slug = slugger.slug(text);
      if (isFaqH2Heading(text, slug)) {
        cutStart = i;
        break;
      }
    }
  }

  if (cutStart === -1) return markdown;

  let cutEnd = tree.children.length;
  for (let j = cutStart + 1; j < tree.children.length; j++) {
    const node = tree.children[j];
    if (node.type === "heading" && node.depth === 2) {
      cutEnd = j;
      break;
    }
  }

  const nextChildren = [...tree.children.slice(0, cutStart), ...tree.children.slice(cutEnd)];
  const newRoot: MdastRoot = {
    type: "root",
    children: nextChildren as MdastRoot["children"],
  };

  /* remark-gfm : nécessaire pour sérialiser tableaux, strikethrough, etc. */
  const out = unified().use(remarkStringify).use(remarkGfm).stringify(newRoot);
  return typeof out === "string" ? out : String(out);
}

function extractHeadingsFromMdast(tree: MdastRoot): ArticleHeading[] {
  const slugger = new GithubSlugger();
  const out: ArticleHeading[] = [];
  for (const node of tree.children) {
    if (node.type === "heading" && node.depth >= 2 && node.depth <= 3) {
      const text = toString(node).trim();
      out.push({
        depth: node.depth,
        slug: slugger.slug(text),
        text,
      });
    }
  }
  return out;
}

/**
 * Rendu HTML aligné sur `splitMarkdownAtH2Slug` (GFM, maths, KaTeX) + ids sur h2/h3 pour le sommaire.
 */
export async function renderMarkdownToArticleHtml(markdown: string): Promise<{
  html: string;
  headings: ArticleHeading[];
}> {
  const tree = parseMarkdown(markdown);
  const headings = extractHeadingsFromMdast(tree);

  const hast = await unified()
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeKatex)
    .run(tree);

  let html = toHtml(hast);
  const $ = cheerio.load(`<div class="md-root">${html}</div>`);
  const h23 = $(".md-root h2, .md-root h3").toArray();
  headings.forEach((h, i) => {
    const el = h23[i];
    if (el) $(el).attr("id", h.slug);
  });
  html = $(".md-root").html() ?? html;

  return { html, headings };
}

/** Sommaire (h2–h3) sans rendre tout le HTML — utile si le corps utilise `<Content />`. */
export function extractArticleHeadings(markdown: string): ArticleHeading[] {
  return extractHeadingsFromMdast(parseMarkdown(markdown));
}
