// Injecte le filigrane logo (coin bas-droit, opacité 0.07) dans des schémas SVG maison.
// Idempotent : ignore un SVG qui a déjà un <g id="wm">.
// Usage : node scripts/add-watermark.mjs public/images/mon-schema.svg [autre.svg ...]
//   ou   node scripts/add-watermark.mjs public/images/echecs-xxx-*.svg
import { readFileSync, writeFileSync } from "node:fs";

const LOGO = readFileSync("tools/schema/watermark-logo.svgfrag", "utf8").trim();

const files = process.argv.slice(2);
if (files.length === 0) {
  console.error("Aucun fichier fourni.");
  process.exit(1);
}

let done = 0, skipped = 0;
for (const file of files) {
  let svg = readFileSync(file, "utf8");
  if (svg.includes('id="wm"')) { skipped++; console.log(`skip (déjà watermark) : ${file}`); continue; }
  const vb = svg.match(/viewBox="0 0 (\d+) (\d+)"/);
  if (!vb) { console.error(`viewBox introuvable, ignoré : ${file}`); continue; }
  const w = Number(vb[1]);
  const h = Number(vb[2]);
  // Logo ~26×36 px après scale 0.0416 ; marge 14px depuis chaque bord.
  const tx = (w - 40).toFixed(1);
  const ty = (h - 48.1).toFixed(1);
  const wm = `<g id="wm" opacity="0.07" transform="translate(${tx},${ty}) scale(0.0416)" aria-hidden="true">${LOGO}</g>`;
  svg = svg.replace(/\s*<\/svg>\s*$/, `\n${wm}\n</svg>\n`);
  writeFileSync(file, svg);
  done++;
  console.log(`watermark ajouté (h=${h}) : ${file}`);
}
console.log(`\n${done} traité(s), ${skipped} ignoré(s).`);
