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
import { readdirSync, statSync, existsSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

/**
 * Largeurs réelles des sources, relues par `buildSrcset` pour annoncer la bonne
 * valeur en dernière entrée du `srcset`. Sans ça, une vignette de 1024 px se
 * déclarait `1200w` et le navigateur la croyait plus fine qu'elle n'est.
 */
const MANIFEST = "src/data/image-widths.json";
const widths = {};

/** Doit rester synchronisé avec WIDTHS dans src/utils/image-variants.ts. */
const WIDTHS = [480, 640, 960];
const QUALITY = 74;

/**
 * Dossiers balayés, non récursifs. `public/images` contient og-default.png, qui
 * sert aussi de vignette de repli dans les cartes : il y gagne autant que les
 * heros. Les SVG sont hors sujet (vectoriels).
 */
const DIRS = ["public/images/blog", "public/images"];

/** Une variante déjà générée ne doit pas servir de source à une autre. */
const VARIANT_RE = /-(?:\d+)w\.webp$/i;
const SOURCE_RE = /\.(?:webp|jpe?g|png)$/i;

/** Icônes PWA et favicons : affichées à leur taille, rien à décliner. */
const EXCLUDE_RE = /^(?:icon-|apple-touch-icon|favicon|maskable)/i;

let written = 0;
let skipped = 0;
let tooSmall = 0;

for (const dir of DIRS) {
  const absDir = path.join(root, dir);
  if (!existsSync(absDir)) continue;

  const names = readdirSync(absDir);
  const webpBases = new Set(
    names.filter((n) => /\.webp$/i.test(n) && !VARIANT_RE.test(n)).map((n) => n.replace(SOURCE_RE, "")),
  );

  for (const name of names) {
    if (!SOURCE_RE.test(name) || VARIANT_RE.test(name) || EXCLUDE_RE.test(name)) continue;

    // `photo.png` et `photo.webp` viseraient les mêmes `photo-480w.webp` : quand
    // les deux traînent (conversion en cours), le WebP fait foi.
    if (!/\.webp$/i.test(name) && webpBases.has(name.replace(SOURCE_RE, ""))) continue;

    const src = path.join(absDir, name);
    const srcStat = statSync(src);
    if (!srcStat.isFile()) continue;

    const meta = await sharp(src).metadata();
    const base = name.replace(SOURCE_RE, "");
    // Clé = URL publique, telle qu'elle apparaît dans les `src` des templates.
    if (meta.width) widths[`/${dir.replace(/^public\//, "")}/${name}`] = meta.width;

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

// Trié pour que le diff git reste lisible d'un build à l'autre.
const sorted = Object.fromEntries(Object.entries(widths).sort(([a], [b]) => a.localeCompare(b)));
writeFileSync(path.join(root, MANIFEST), `${JSON.stringify(sorted, null, 2)}\n`);

console.log(
  `[image-variants] ${written} variante(s) écrite(s), ${skipped} à jour, ${tooSmall} largeur(s) ignorée(s) (source plus petite), ${Object.keys(sorted).length} largeur(s) au manifeste.`,
);
