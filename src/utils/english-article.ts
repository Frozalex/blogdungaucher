import GithubSlugger from "github-slugger";
import { Marked, type Tokens } from "marked";

import { renderInlineMath, stripInlineMath } from "./inline-math";

export type EnHeading = { depth: number; slug: string; text: string };

/**
 * Rendu HTML + sommaire (h2-h3) pour le corps anglais, avec slugs stables (github-slugger).
 * Utilisé par /en/blog/[slug].astro après avoir récupéré le body via getEntry('enTranslations', slug).
 */
export function renderEnglishMarkdown(markdown: string): {
  html: string;
  headings: EnHeading[];
} {
  const headings: EnHeading[] = [];
  const slugger = new GithubSlugger();

  const md = new Marked();
  md.use({
    renderer: {
      heading(this: { parser: { parseInline: (t: Tokens.Heading["tokens"]) => string } }, { tokens, depth }: Tokens.Heading) {
        const htmlText = this.parser.parseInline(tokens);
        const plain = htmlText.replace(/<[^>]*>/g, "").trim();
        // Le slug reste calculé sur le texte brut : il sert d'ancre publique et
        // ne doit pas bouger. Seul le libellé affiché dans le sommaire est
        // nettoyé de son LaTeX (`$35^{10}$` → `35^10`).
        const id = slugger.slug(plain);
        if (depth >= 2 && depth <= 3) {
          headings.push({ depth, slug: id, text: stripInlineMath(plain) });
        }
        return `<h${depth} id="${id}">${htmlText}</h${depth}>\n`;
      },
    },
  });

  // `marked` ignore `remark-math` : sans cette passe, les traductions publiaient
  // `$10^{120}$` en clair là où la version FR affiche la formule composée.
  const html = renderInlineMath(md.parse(markdown) as string);
  return { html, headings };
}
