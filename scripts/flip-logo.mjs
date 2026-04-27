/**
 * Retourne horizontalement le logo (main gauche) dans :
 *   - public/images/logo.svg
 *   - public/favicon.svg
 *   - public/images/favicon-32x32.svg
 * puis régénère les PNG 16, 32, 180 px.
 *
 * Technique SVG : <g transform="scale(-1,1) translate(-625,0)">
 *   → mappe x → 625-x, soit une symétrie autour de x=312.5
 *     (le logo naturel fait 625×868, on flippe dans ce référentiel).
 */

import { readFileSync, writeFileSync } from "fs";
import sharp from "sharp";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root   = join(__dirname, "..");
const imgDir = join(root, "public", "images");

// ── Helpers ────────────────────────────────────────────────────
const FLIP = `transform="scale(-1,1) translate(-625,0)"`;

/**
 * Enveloppe tous les <path> d'un SVG dans un <g flip>
 * sans toucher au <rect> ni aux autres éléments.
 */
function wrapPathsWithFlip(svgContent) {
  // Remplace le premier <path par <g flip>\n  <path
  // et ajoute </g> juste avant </svg>
  const firstPath = svgContent.indexOf("<path ");
  if (firstPath === -1) throw new Error("Aucun <path> trouvé");

  const before  = svgContent.slice(0, firstPath);
  const after   = svgContent.slice(firstPath);

  // Injecte la fermeture </g> avant </svg>
  const closeTag = after.lastIndexOf("</svg>");
  const pathsBlock = after.slice(0, closeTag);
  const endSvg     = after.slice(closeTag);

  return before
    + `<g ${FLIP}>\n`
    + pathsBlock
    + `</g>\n`
    + endSvg;
}

// ── 1. logo.svg ────────────────────────────────────────────────
const logoPath = join(imgDir, "logo.svg");
let logo = readFileSync(logoPath, "utf-8");
logo = wrapPathsWithFlip(logo);
writeFileSync(logoPath, logo, "utf-8");
console.log("✓ logo.svg retourné");

// ── 2. favicon.svg ─────────────────────────────────────────────
const favPath = join(root, "public", "favicon.svg");
let fav = readFileSync(favPath, "utf-8");
fav = wrapPathsWithFlip(fav);
writeFileSync(favPath, fav, "utf-8");
console.log("✓ favicon.svg retourné");

// ── 3. favicon-32x32.svg ───────────────────────────────────────
const fav32Path = join(imgDir, "favicon-32x32.svg");
let fav32 = readFileSync(fav32Path, "utf-8");
fav32 = wrapPathsWithFlip(fav32);
writeFileSync(fav32Path, fav32, "utf-8");
console.log("✓ favicon-32x32.svg retourné");

// ── 4. Régénérer les PNG depuis le nouveau favicon.svg ─────────
// Pour sharp (pas de CSS media queries) : SVG light-mode avec le flip
const PAD = 121.5;
const SQ  = 868;
const VB  = `${-PAD} 0 ${SQ} ${SQ}`;
const RX  = 69;

// Récupère les paths (avec le flip déjà intégré dans fav)
// On reconstruit un SVG statique light-mode avec le même transform
const sharpSvg = (px) => {
  // On part du favicon.svg déjà flipé, on remplace juste les classes CSS
  // par des couleurs hardcodées pour sharp
  const staticSvg = fav
    .replace(/<style>[\s\S]*?<\/style>/, "")          // retire le bloc <style>
    .replace(/class="bg"/g, 'fill="#fcfaf6"')          // fond clair statique
    .replace(/class="fg"/g, 'fill="#1e1e1e"')          // forme sombre statique
    .replace(/<svg[^>]*>/, `<svg xmlns="http://www.w3.org/2000/svg" width="${px}" height="${px}" viewBox="${VB}">`);
  return staticSvg;
};

await sharp(Buffer.from(sharpSvg(32))).resize(32, 32).png().toFile(join(imgDir, "favicon-32x32.png"));
console.log("✓ favicon-32x32.png");

await sharp(Buffer.from(sharpSvg(16))).resize(16, 16).png().toFile(join(imgDir, "favicon-16x16.png"));
console.log("✓ favicon-16x16.png");

await sharp(Buffer.from(sharpSvg(180))).resize(180, 180).png().toFile(join(imgDir, "apple-touch-icon.png"));
console.log("✓ apple-touch-icon.png (180×180)");

await sharp(Buffer.from(sharpSvg(192))).resize(192, 192).png().toFile(join(imgDir, "icon-192x192.png"));
console.log("✓ icon-192x192.png");

await sharp(Buffer.from(sharpSvg(512))).resize(512, 512).png().toFile(join(imgDir, "icon-512x512.png"));
console.log("✓ icon-512x512.png");

console.log("\nLogo et favicons retournés ✓");
