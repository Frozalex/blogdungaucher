import { load } from "cheerio";
import { marked } from "marked";
import { renderInlineMath, stripInlineMath } from "./inline-math";

/** Même prose pour les champs affichés, les libellés accessibles et le JSON-LD. */
export function renderFrontmatterText(value: string): string {
  return renderInlineMath(marked.parseInline(value, { async: false }));
}

export function plainFrontmatterText(value: string): string {
  const html = marked.parseInline(stripInlineMath(value), { async: false });
  return load(`<span>${html}</span>`).text().trim();
}
