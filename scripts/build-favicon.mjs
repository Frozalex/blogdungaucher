/**
 * Reconstruit favicon.svg à partir des 24 paths propres de logo.svg :
 * - ViewBox carré (868×868) avec le logo centré horizontalement
 * - Fond adaptatif light/dark via CSS media query
 * - Régénère aussi les PNG 16, 32, 180, 192 et 512px
 */

import { readFileSync, writeFileSync } from "fs";
import sharp from "sharp";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root      = join(__dirname, "..");
const imgDir    = join(root, "public", "images");

// ── 1. Extraire les paths du logo nettoyé ──────────────────────
const logoSvg = readFileSync(join(root, "public", "images", "logo.svg"), "utf-8");
const pathRe  = /d="([^"]+)"/g;
let match;
const paths = [];
while ((match = pathRe.exec(logoSvg)) !== null) {
  paths.push(match[1]);
}
console.log(`Paths récupérés depuis logo.svg : ${paths.length}`);

// ── 2. Calcul du viewport carré ────────────────────────────────
// Logo naturel : 625 × 868. Pour centrer dans un carré 868×868 :
//   padding horizontal = (868 - 625) / 2 = 121.5
const PAD = 121.5;
const SQ  = 868;
const VB  = `${-PAD} 0 ${SQ} ${SQ}`;
// Coins arrondis du fond : ~8% du côté = 69px sur 868
const RX  = 69;

// ── 3. Construire les éléments path avec classes CSS ──────────
const pathsHtml = paths
  .map((d) => `  <path class="fg" fill-rule="evenodd" d="${d}"/>`)
  .join("\n");
const mirrorTransform = logoSvg.includes('transform="scale(-1,1) translate(-625,0)"')
  ? ' transform="scale(-1,1) translate(-625,0)"'
  : "";
const mirroredPathsHtml = mirrorTransform
  ? `  <g${mirrorTransform}>\n${pathsHtml}\n  </g>`
  : pathsHtml;

// ── 4. Écrire favicon.svg (adaptatif dark/light) ──────────────
const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${VB}">
  <style>
    .bg { fill: #fcfaf6; }
    .fg { fill: #1e1e1e; }
    @media (prefers-color-scheme: dark) {
      .bg { fill: #1e1e1b; }
      .fg { fill: #f0ebe0; }
    }
  </style>
  <rect class="bg" x="${-PAD}" y="0" width="${SQ}" height="${SQ}" rx="${RX}"/>
${mirroredPathsHtml}
</svg>
`;

writeFileSync(join(root, "public", "favicon.svg"), faviconSvg, "utf-8");
console.log("✓ public/favicon.svg écrit");

// ── 5. SVG light-mode statique pour sharp (sans media query) ──
const sharpPaths = paths
  .map((d) => `  <path fill="#1e1e1e" fill-rule="evenodd" d="${d}"/>`)
  .join("\n");
const mirroredSharpPaths = mirrorTransform
  ? `  <g${mirrorTransform}>\n${sharpPaths}\n  </g>`
  : sharpPaths;

function squareSvg(px) {
  const scale = px / SQ;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${px}" height="${px}" viewBox="${VB}">
  <rect fill="#fcfaf6" x="${-PAD}" y="0" width="${SQ}" height="${SQ}" rx="${RX}"/>
${mirroredSharpPaths}
</svg>`;
}

// ── 6. Générer les PNG ─────────────────────────────────────────
await sharp(Buffer.from(squareSvg(32))).resize(32, 32).png().toFile(join(imgDir, "favicon-32x32.png"));
console.log("✓ favicon-32x32.png");

await sharp(Buffer.from(squareSvg(16))).resize(16, 16).png().toFile(join(imgDir, "favicon-16x16.png"));
console.log("✓ favicon-16x16.png");

await sharp(Buffer.from(squareSvg(180))).resize(180, 180).png().toFile(join(imgDir, "apple-touch-icon.png"));
console.log("✓ apple-touch-icon.png");

await sharp(Buffer.from(squareSvg(192))).resize(192, 192).png().toFile(join(imgDir, "icon-192x192.png"));
console.log("✓ icon-192x192.png");

await sharp(Buffer.from(squareSvg(512))).resize(512, 512).png().toFile(join(imgDir, "icon-512x512.png"));
console.log("✓ icon-512x512.png");

// Mettre à jour aussi favicon-32x32.svg (version statique sans media query)
const staticSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${VB}" width="32" height="32">
  <style>
    .bg { fill: #fcfaf6; }
    .fg { fill: #1e1e1e; }
    @media (prefers-color-scheme: dark) {
      .bg { fill: #1e1e1b; }
      .fg { fill: #f0ebe0; }
    }
  </style>
  <rect class="bg" x="${-PAD}" y="0" width="${SQ}" height="${SQ}" rx="${RX}"/>
${mirroredPathsHtml}
</svg>
`;
writeFileSync(join(imgDir, "favicon-32x32.svg"), staticSvg, "utf-8");
console.log("✓ images/favicon-32x32.svg");

console.log("\nTous les favicons régénérés ✓");
