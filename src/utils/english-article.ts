import GithubSlugger from "github-slugger";
import { Marked, type Tokens } from "marked";

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
        const id = slugger.slug(plain);
        if (depth >= 2 && depth <= 3) {
          headings.push({ depth, slug: id, text: plain });
        }
        return `<h${depth} id="${id}">${htmlText}</h${depth}>\n`;
      },
    },
  });

  const html = md.parse(markdown) as string;
  return { html, headings };
}
