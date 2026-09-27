/**
 * Génère les variantes redimensionnées des vignettes d'articles.
 *
 * Les hero sont stockés dans `public/` : Astro ne les passe donc pas dans son
 * pipeline d'assets (pas d'import, pas de `<Image />`). Les cartes de listing et
 * le carrousel « Pour vous » téléchargeaient jusqu'ici le fichier pleine taille
 * (1200x800, ~120 ko en moyenne) pour l'afficher en 280 px de large.
 *
 * Ce script produit, à côté de chaque source, un jeu de variantes WebP dans
 * `thumbs/` que les composants servent via `srcset`/`sizes`. Le fichier d'origine
 * reste intact : il sert de source et de repli.
 *
 * Idempotent : une variante à jour (mtime >= source) n'est pas réencodée.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

/**
 * ATTENTION : ces deux constantes sont dupliquées dans `src/utils/thumbs.ts`,
 * qui construit les `srcset` côté Astro. Ce script tourne hors du pipeline
 * TypeScript et ne peut pas importer le module. Toute modification ici doit y
 * être répercutée.
 */
const THUMB_DIR_NAME = "thumbs";
const THUMB_WIDTHS = [320, 480, 640, 768, 960, 1200];

/** `foo.webp` + 320 -> `foo-320.webp` */
const thumbFileName = (basename, width) => `${basename.replace(/\.[^.]+$/, "")}-${width}.webp`;

/** Dossiers de `public/` balayés (récursivement) à la recherche de sources. */
const SOURCE_DIRS = ["public/images/blog"];

const SOURCE_EXT = new Set([".webp", ".png", ".jpg", ".jpeg"]);

/** Qualité WebP : 78 tient le banding des dégradés pastel des rendus Midjourney. */
const WEBP_OPTIONS = { quality: 78, effort: 6, smartSubsample: true };

/** Liste les fichiers image d'un dossier, en ignorant le dossier des variantes. */
function collectSources(dir) {
  const out = [];
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === THUMB_DIR_NAME) continue;
      out.push(...collectSources(full));
    } else if (SOURCE_EXT.has(path.extname(entry.name).toLowerCase())) {
      out.push(full);
    }
  }
  return out;
}

/** Vrai si la variante existe et est au moins aussi récente que sa source. */
function isFresh(outPath, sourceMtimeMs) {
  try {
    const stat = fs.statSync(outPath);
    return stat.size > 0 && stat.mtimeMs >= sourceMtimeMs;
  } catch {
    return false;
  }
}

let created = 0;
let skipped = 0;
let bytesOut = 0;

for (const dir of SOURCE_DIRS) {
  const sources = collectSources(path.join(root, dir));
  for (const source of sources) {
    const sourceStat = fs.statSync(source);
    const metadata = await sharp(source).metadata();
    const sourceWidth = metadata.width ?? 0;
    if (!sourceWidth) continue;

    const thumbDir = path.join(path.dirname(source), THUMB_DIR_NAME);
    fs.mkdirSync(thumbDir, { recursive: true });

    for (const width of THUMB_WIDTHS) {
      // On ne suragrandit jamais : au-delà de la largeur source, la variante
      // n'apporterait que du poids.
      if (width > sourceWidth) continue;
      const outPath = path.join(thumbDir, thumbFileName(path.basename(source), width));
      if (isFresh(outPath, sourceStat.mtimeMs)) {
        skipped += 1;
        bytesOut += fs.statSync(outPath).size;
        continue;
      }
      await sharp(source).resize({ width, withoutEnlargement: true }).webp(WEBP_OPTIONS).toFile(outPath);
      created += 1;
      bytesOut += fs.statSync(outPath).size;
    }
  }
}

console.log(
  `[thumbs] ${created} variante(s) générée(s), ${skipped} déjà à jour — ${(bytesOut / 1048576).toFixed(2)} Mo au total`,
);
