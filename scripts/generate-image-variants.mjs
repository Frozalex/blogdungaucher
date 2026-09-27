/**
 * Génère les variantes responsives des images d'article.
 *
 * Problème résolu : les vignettes de carte (`ArticleCard`) et les heros mobiles
 * servaient l'original 1200 px à tout le monde. Une page d'index avec 12 cartes
 * téléchargeait ~1,8 Mo d'images pour les afficher à 600 px de large — et un
 * téléphone de 380 px payait le plein tarif.
 *
 * Pour chaque source `public/images/blog/<nom>.<ext>`, on écrit à côté
 * `<nom>-480w.webp`, `<nom>-640w.webp` et `<nom>-960w.webp`. Le `srcset` est
 * construit côté template par `buildSrcset()` (src/utils/image-variants.ts) :
 * les deux fichiers doivent rester d'accord sur WIDTHS et sur le suffixe.
 *
 * Idempotent : une variante déjà plus récente que sa source est sautée, le
 * script peut donc tourner à chaque build sans coût.
 */
import sharp from "sharp";
import { readdirSync, statSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

/** Doit rester synchronisé avec WIDTHS dans src/utils/image-variants.ts. */
const WIDTHS = [480, 640, 960];
const QUALITY = 74;

/** Dossiers balayés (les SVG et les icônes de l'app n'ont rien à y gagner). */
const DIRS = ["public/images/blog"];

/** Une variante déjà générée ne doit pas servir de source à une autre. */
const VARIANT_RE = /-(?:\d+)w\.webp$/i;
const SOURCE_RE = /\.(?:webp|jpe?g|png)$/i;

let written = 0;
let skipped = 0;
let tooSmall = 0;

for (const dir of DIRS) {
  const absDir = path.join(root, dir);
  if (!existsSync(absDir)) continue;

  for (const name of readdirSync(absDir)) {
    if (!SOURCE_RE.test(name) || VARIANT_RE.test(name)) continue;

    const src = path.join(absDir, name);
    const srcStat = statSync(src);
    if (!srcStat.isFile()) continue;

    const meta = await sharp(src).metadata();
    const base = name.replace(SOURCE_RE, "");

    for (const w of WIDTHS) {
      // Inutile d'agrandir : on ne produit que les largeurs réellement plus
      // petites que la source, `buildSrcset` teste l'existence du fichier.
      if (!meta.width || meta.width <= w) {
        tooSmall++;
        continue;
      }

      const out = path.join(absDir, `${base}-${w}w.webp`);
      if (existsSync(out) && statSync(out).mtimeMs >= srcStat.mtimeMs) {
        skipped++;
        continue;
      }

      await sharp(src).resize({ width: w }).webp({ quality: QUALITY, effort: 6 }).toFile(out);
      written++;
    }
  }
}

console.log(
  `[image-variants] ${written} variante(s) écrite(s), ${skipped} à jour, ${tooSmall} largeur(s) ignorée(s) (source plus petite).`,
);
