/** Réserve la place des images locales sans changer leurs fichiers ni leurs textes. */
import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { load } from "cheerio";
import sharp from "sharp";

const dist = fileURLToPath(new URL("../dist/", import.meta.url));
const dimensions = new Map();
async function sizeOf(src) {
  if (!src?.startsWith("/") || src.startsWith("//")) return null;
  let file;
  try { file = path.resolve(dist, `.${decodeURIComponent(src.split(/[?#]/)[0])}`); }
  catch { return null; }
  if (!file.startsWith(dist)) return null;
  if (!dimensions.has(file)) dimensions.set(file, (async () => {
    try {
      if (file.endsWith(".svg")) {
        const svg = load(await readFile(file, "utf8"), { xmlMode: true })("svg").first();
        const viewBox = (svg.attr("viewBox") ?? "").trim().split(/[\s,]+/).map(Number);
        const pixels = value => /^\d+(?:\.\d+)?(?:px)?$/.test(value ?? "") ? parseFloat(value) : undefined;
        const width = pixels(svg.attr("width")) || viewBox[2];
        const height = pixels(svg.attr("height")) || viewBox[3];
        return width > 0 && height > 0 ? { width, height } : null;
      }
      const { width, height } = await sharp(file).metadata();
      return width > 0 && height > 0 ? { width, height } : null;
    } catch { return null; }
  })());
  return dimensions.get(file);
}
async function* htmlFiles(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* htmlFiles(file);
    else if (entry.name.endsWith(".html")) yield file;
  }
}

let images = 0, pages = 0;
for await (const file of htmlFiles(dist)) {
  const html = await readFile(file, "utf8");
  // Préserver exactement les programmes, y compris leurs éventuels modèles HTML.
  const protectedParts = [];
  let next = html.replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, part => {
    protectedParts.push(part);
    return `\u0000IMAGE_DIM_SKIP_${protectedParts.length - 1}\u0000`;
  });
  const replacements = [];
  for (const match of next.matchAll(/<img\b[^>]*>/gi)) {
    const img = load(match[0])("img").first();
    if (Number(img.attr("width")) > 0 && Number(img.attr("height")) > 0) continue;
    const intrinsic = await sizeOf(img.attr("src"));
    if (!intrinsic) continue;
    const width = Number(img.attr("width")) || Math.round((Number(img.attr("height")) || intrinsic.height) * intrinsic.width / intrinsic.height);
    const height = Number(img.attr("height")) || Math.round(width * intrinsic.height / intrinsic.width);
    let tag = match[0];
    for (const [name, value] of [["width", width], ["height", height]]) {
      if (img.attr(name) == null) tag = tag.replace(/\s*\/?>$/, ` ${name}="${value}"$&`);
      else if (!(Number(img.attr(name)) > 0)) tag = tag.replace(new RegExp(`\\s${name}\\s*=\\s*(?:"[^"]*"|'[^']*'|[^\\s>]+)`, "i"), ` ${name}="${value}"`);
    }
    if (tag !== match[0]) replacements.push({ start: match.index, end: match.index + match[0].length, tag });
  }
  for (const { start, end, tag } of replacements.reverse()) next = next.slice(0, start) + tag + next.slice(end);
  next = next.replace(/\u0000IMAGE_DIM_SKIP_(\d+)\u0000/g, (_, index) => protectedParts[Number(index)]);
  if (next !== html) {
    await writeFile(file, next);
    images += replacements.length;
    pages++;
  }
}
console.log(`[image-dimensions] ${images} images complétées dans ${pages} pages.`);
