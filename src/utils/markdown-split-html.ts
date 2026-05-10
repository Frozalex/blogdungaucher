import GithubSlugger from "github-slugger";
import { toHtml } from "hast-util-to-html";
import { toString } from "mdast-util-to-string";
import type { Root as MdastRoot, RootContent } from "mdast";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";

/**
 * Coupe un Markdown après un titre H2 dont le slug GitHub correspond à `headingSlug`,
 * puis rend chaque partie en HTML avec la même chaîne que le blog (GFM, maths, KaTeX).
 * Les slugs doivent correspondre à ceux du sommaire (copier l’ancre # du H2 cible).
 */
export async function splitMarkdownAtH2Slug(
  markdown: string,
  headingSlug: string,
): Promise<{ beforeHtml: string; afterHtml: string } | null> {
  const tree = unified().use(remarkParse).use(remarkGfm).use(remarkMath).parse(markdown) as MdastRoot;

  const slugger = new GithubSlugger();
  let hitIndex = -1;

  for (let i = 0; i < tree.children.length; i++) {
    const node = tree.children[i];
    if (node.type === "heading" && node.depth === 2) {
      const slug = slugger.slug(toString(node));
      if (slug === headingSlug) {
        hitIndex = i;
        break;
      }
    }
  }

  if (hitIndex === -1) return null;

  const before: MdastRoot = {
    type: "root",
    children: tree.children.slice(0, hitIndex + 1) as RootContent[],
  };

  const after: MdastRoot = {
    type: "root",
    children: tree.children.slice(hitIndex + 1) as RootContent[],
  };

  /** `unified().process()` attend du texte (parseur requis) ; ici on part d’un mdast → `run()` puis HTML. */
  const mdastToHtml = async (root: MdastRoot) => {
    const hast = await unified()
      .use(remarkRehype, { allowDangerousHtml: true })
      .use(rehypeKatex)
      .run(root);
    return toHtml(hast);
  };

  const [beforeHtml, afterHtml] = await Promise.all([mdastToHtml(before), mdastToHtml(after)]);

  return { beforeHtml, afterHtml };
}
