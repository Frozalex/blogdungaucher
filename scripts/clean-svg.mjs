/**
 * Nettoie logo.svg :
 * - Supprime les ~204 micro-paths parasites issus du auto-trace (< 200 chars)
 * - Garde les 24 paths réels (≥ 200 chars) qui forment la silhouette
 * - Unifie toutes les couleurs en une seule (#1e1e1e)
 * - Ajoute un viewBox propre, supprime width/height fixes
 * - Retire les attributs de style verbose du SVG racine
 */

import { readFileSync, writeFileSync } from "fs";

const INPUT  = "./public/images/logo.svg";
const OUTPUT = "./public/images/logo.svg";

// Seuil : on ne garde que les paths dont le 'd' a au moins N caractères
const MIN_D_LENGTH = 200;
const FILL_COLOR   = "#1e1e1e";

const src = readFileSync(INPUT, "utf-8");

// Extraire chaque path avec son d
// Le SVG source a la structure : <g><path style="..." fill="..." d="..."/></g>
const pathRe = /<g><path[^>]+d="([^"]+)"[^>]*\/><\/g>/g;
let match;
const keptPaths = [];
let total = 0;

while ((match = pathRe.exec(src)) !== null) {
  total++;
  const d = match[1];
  if (d.length >= MIN_D_LENGTH) {
    keptPaths.push(d);
  }
}

console.log(`Total paths : ${total}`);
console.log(`Paths conservés (≥ ${MIN_D_LENGTH} chars) : ${keptPaths.length}`);
console.log(`Paths supprimés (bruit) : ${total - keptPaths.length}`);

// Construire le SVG propre
const pathsHtml = keptPaths
  .map((d) => `  <path fill="${FILL_COLOR}" fill-rule="evenodd" d="${d}"/>`)
  .join("\n");

const cleanSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 625 868" role="img" aria-hidden="true">
${pathsHtml}
</svg>
`;

writeFileSync(OUTPUT, cleanSvg, "utf-8");
console.log(`\n✓ ${OUTPUT} écrit — ${cleanSvg.length} octets (était ${src.length})`);
