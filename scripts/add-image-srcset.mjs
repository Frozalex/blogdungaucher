/**
 * Ajoute `srcset`/`sizes` aux photos insérées en HTML brut dans les articles.
 *
 * Pourquoi une passe sur le dist plutôt qu'un plugin rehype : ces photos sont
 * écrites en `<figure><img ...></figure>` directement dans le markdown. Les deux
 * pipelines de rendu du site (celui d'Astro et
 * `renderMarkdownToArticleHtml` pour les articles à FAQ) les laissent en nœuds
 * `raw` — un visiteur d'éléments hast ne les voit jamais. Le HTML final, si.
 *
 * Périmètre volontairement étroit : on ne touche qu'un `<img>` qui
 *   1. n'a pas déjà de `srcset` (les templates savent mieux que nous),
 *   2. porte des attributs `width` et `height` explicites (signature de l'auteur
 *      qui insère une photo ; les vignettes de composant n'en ont pas),
 *   3. a des variantes réellement présentes sur le disque.
 *
 * Idempotent : relancé sur un dist déjà traité, la règle 1 le fait passer.
 */
import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(root, "dist");

/** Doit rester synchronisé avec WIDTHS dans src/utils/image-variants.ts. */
const WIDTHS = [480, 640, 960];

/**
 * Largeur de la colonne de lecture : `.article-layout` fait 68rem, moins la
 * gouttière de partage (3rem) et le gap (2,5rem). Au-delà, l'image s'arrête à sa
 * taille naturelle ; en dessous, `img { max-width: 100% }` la ramène à 92vw.
 */
const COLUMN_PX = 940;

const SOURCE_RE = /\.(?:webp|jpe?g|png)$/i;

function htmlFiles(dir) {
  const out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...htmlFiles(p));
    else if (entry.name.endsWith(".html")) out.push(p);
  }
  return out;
}

/** `srcset` d'une source publique, ou null si aucune variante n'existe. */
function srcsetFor(src, intrinsic) {
  if (!src.startsWith("/") || !SOURCE_RE.test(src)) return null;
  const base = src.replace(SOURCE_RE, "");
  const entries = [];
  for (const w of WIDTHS) {
    if (w >= intrinsic) continue;
    const candidate = `${base}-${w}w.webp`;
    if (existsSync(path.join(DIST, candidate.slice(1)))) entries.push(`${candidate} ${w}w`);
  }
  if (entries.length === 0) return null;
  entries.push(`${src} ${intrinsic}w`);
  return entries.join(", ");
}

const IMG_RE = /<img\s[^>]*>/gi;
const attr = (tag, name) => tag.match(new RegExp(`\\s${name}="([^"]*)"`, "i"))?.[1];

let touched = 0;
let files = 0;

if (!existsSync(DIST)) {
  console.log("[add-image-srcset] pas de dist/, rien à faire.");
  process.exit(0);
}

for (const file of htmlFiles(DIST)) {
  const html = readFileSync(file, "utf-8");
  let localCount = 0;

  const next = html.replace(IMG_RE, (tag) => {
    if (/\ssrcset=/i.test(tag)) return tag;

    const src = attr(tag, "src");
    const width = Number(attr(tag, "width"));
    const height = Number(attr(tag, "height"));
    if (!src || !Number.isFinite(width) || width <= 0 || !Number.isFinite(height)) return tag;

    const srcset = srcsetFor(src, width);
    if (!srcset) return tag;

    const displayed = Math.min(width, COLUMN_PX);
    localCount++;
    return tag.replace(
      /\/?>$/,
      ` srcset="${srcset}" sizes="(min-width: 68rem) ${displayed}px, 92vw"$&`,
    );
  });

  if (localCount > 0) {
    writeFileSync(file, next);
    touched += localCount;
    files++;
  }
}

console.log(`[add-image-srcset] ${touched} image(s) déclinée(s) dans ${files} fichier(s).`);
