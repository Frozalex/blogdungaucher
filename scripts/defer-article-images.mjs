import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { load } from "cheerio";

/** Diffère seulement les illustrations de lecture dont la place est réservée. */
export function deferArticleImages(html) {
  if (!html.includes("article-body")) return { html, deferred: 0 };
  const $ = load(html, { sourceCodeLocationInfo: true });
  const edits = [];
  let deferred = 0;
  for (const image of $(".article-body img").toArray()) {
    const attrs = image.attribs;
    const location = image.sourceCodeLocation?.startTag;
    if (!location || !(Number(attrs.width) > 0 && Number(attrs.height) > 0)) continue;
    const additions = [];
    if (attrs.loading === undefined && attrs.fetchpriority?.toLowerCase() !== "high") {
      additions.push(' loading="lazy"');
      deferred++;
    }
    if (attrs.decoding === undefined) additions.push(' decoding="async"');
    if (!additions.length) continue;
    const tag = html.slice(location.startOffset, location.endOffset);
    edits.push({
      start: location.startOffset,
      end: location.endOffset,
      tag: tag.replace(/(\s*\/?>)$/, `${additions.join("")}$1`),
    });
  }
  for (const edit of edits.sort((a, b) => b.start - a.start)) {
    html = html.slice(0, edit.start) + edit.tag + html.slice(edit.end);
  }
  return { html, deferred };
}

async function* htmlFiles(dir) {
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* htmlFiles(file);
    else if (entry.name.endsWith(".html")) yield file;
  }
}

async function main() {
  const dist = fileURLToPath(new URL("../dist/", import.meta.url));
  let deferred = 0, pages = 0;
  for await (const file of htmlFiles(dist)) {
    const original = await fs.readFile(file, "utf8");
    const result = deferArticleImages(original);
    if (result.html === original) continue;
    await fs.writeFile(file, result.html);
    deferred += result.deferred;
    pages++;
  }
  console.log(`[article-images] ${deferred} illustrations différées dans ${pages} pages, dimensions et couvertures conservées.`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await main();
