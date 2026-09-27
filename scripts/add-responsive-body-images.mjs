/**
 * Ajoute `srcset`/`sizes` aux photos insérées dans le corps des articles.
 *
 * Ces images sont écrites à la main en HTML brut dans le markdown
 * (`<figure><img src="/images/blog/....jpg" ...></figure>`). Elles échappent donc
 * à la fois au composant ArticleCard et au pipeline d'assets d'Astro, et étaient
 * servies pleine taille : `religion-libro-juegos.jpg` pèse 400 ko pour un
 * affichage réel de 373 px de large.
 *
 * POURQUOI UNE PASSE SUR `dist/` plutôt qu'un plugin rehype :
 *   1. Astro ne parse pas le HTML écrit à la main dans le markdown — il reste un
 *      nœud `raw` opaque qu'un plugin rehype ne peut pas réécrire proprement ;
 *   2. les traductions en/pt-br/nl ne passent pas par rehype mais par `marked`
 *      (cf. src/utils/english-article.ts), soit un second moteur à couvrir.
 *   Une passe unique sur le HTML final traite les deux cas par le même chemin,
 *   comme le font déjà strip-inline-script-comments.mjs et verify-dist-urls.mjs.
 *
 * Idempotent : une balise qui porte déjà un `srcset` (vignettes de cartes, hero)
 * est laissée telle quelle.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");

/** Doit rester aligné sur `THUMB_WIDTHS` de scripts/generate-thumbs.mjs. */
const THUMB_WIDTHS = [320, 480, 640, 768, 960, 1200];

/** `max-width` de `.article-body :global(figure)`. */
const PROSE_MAX_WIDTH = 640;

/** `max-height` de `.article-body :global(figure img)`. */
const FIGURE_MAX_HEIGHT = 560;

/**
 * Largeur d'affichage réelle d'une photo de corps d'article.
 *
 * Le CSS borne la hauteur à 560 px (`width: auto`) pour qu'un cliché portrait ne
 * dévore pas la lecture : une image 960x1440 ne s'affiche donc PAS sur 960 px
 * mais sur 373. Sans ce calcul, le `sizes` surestimerait le besoin et le
 * navigateur retiendrait une variante inutilement lourde.
 */
function displayWidth(width, height) {
  if (!width || !height) return PROSE_MAX_WIDTH;
  return Math.min(PROSE_MAX_WIDTH, Math.round((FIGURE_MAX_HEIGHT * width) / height));
}

/** Variantes réellement présentes dans `dist/`, sous forme de `srcset`. */
function buildSrcset(src) {
  const dir = path.posix.dirname(src);
  const base = path.posix.basename(src).replace(/\.[^.]+$/, "");
  const parts = [];
  for (const width of THUMB_WIDTHS) {
    const url = `${dir}/thumbs/${base}-${width}.webp`;
    const abs = path.join(dist, url.replace(/^\/+/, ""));
    if (fs.existsSync(abs) && fs.statSync(abs).size > 0) parts.push(`${url} ${width}w`);
  }
  return parts.length ? parts.join(", ") : null;
}

const srcsetCache = new Map();
function cachedSrcset(src) {
  if (!srcsetCache.has(src)) srcsetCache.set(src, buildSrcset(src));
  return srcsetCache.get(src);
}

const attr = (tag, name) => tag.match(new RegExp(`\\b${name}="([^"]*)"`, "i"))?.[1];

function rewrite(html) {
  let count = 0;
  const out = html.replace(/<img\b[^>]*>/gi, (tag) => {
    if (/\bsrcset=/i.test(tag)) return tag;
    const src = attr(tag, "src");
    // Les schémas maison sont en SVG : rien à redimensionner, et aucune variante
    // n'est générée pour eux.
    if (!src || !src.startsWith("/images/") || src.endsWith(".svg")) return tag;

    const srcset = cachedSrcset(src);
    if (!srcset) return tag;

    // `min()` borne par la colonne sur petit écran : pour un portrait c'est la
    // hauteur qui contraint (valeur en px), pour un paysage c'est la fenêtre.
    const sizes = `min(92vw, ${displayWidth(Number(attr(tag, "width")), Number(attr(tag, "height")))}px)`;
    count += 1;
    return tag.replace(/\s*\/?>$/, (end) => ` srcset="${srcset}" sizes="${sizes}"${end}`);
  });
  return { out, count };
}

function walk(dir) {
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walk(full));
    else if (entry.name.endsWith(".html")) files.push(full);
  }
  return files;
}

let images = 0;
let pages = 0;
for (const file of walk(dist)) {
  const html = fs.readFileSync(file, "utf8");
  const { out, count } = rewrite(html);
  if (!count) continue;
  fs.writeFileSync(file, out);
  images += count;
  pages += 1;
}

console.log(`[body-images] ${images} image(s) de corps rendue(s) responsive(s) dans ${pages} page(s)`);
