import GithubSlugger from "github-slugger";
import { Marked, type Tokens } from "marked";

export type EnHeading = { depth: number; slug: string; text: string };

const enModules = import.meta.glob<string>("../content/blog-translations/en/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
});

/**
 * Contenu markdown anglais (corps seul) pour /en/blog/[slug], si le fichier existe.
 */
export function getEnglishArticleMarkdown(slug: string): string | undefined {
  for (const [path, raw] of Object.entries(enModules)) {
    const base = path.split("/").pop()?.replace(/\.md$/, "");
    if (base === slug) return raw;
  }
  return undefined;
}

/**
 * Rendu HTML + sommaire (h2-h3) pour le corps anglais, avec slugs stables (github-slugger).
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
