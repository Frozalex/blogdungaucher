// Retire les tirets cadratin (—, U+2014) du TEXTE des schémas SVG (lisibilité).
// Ne touche que le texte entre '>' et '<' : jamais le balisage ni les attributs.
// Les demi-cadratins (–) des plages numériques sont conservés.
// Usage : node scripts/fix-emdash-svg.mjs public/images/*.svg
import { readFileSync, writeFileSync } from "node:fs";

function fixRun(content) {
  let t = content;
  t = t.replace(/^\s*—\s*/, "");      // tiret en tête -> supprimé
  t = t.replace(/\s*—\s*$/, "");      // tiret en fin -> supprimé
  if (t.includes("—")) {
    const rep = t.includes(":") ? ", " : " : "; // évite le double deux-points
    t = t.replace(/\s*—\s*/g, rep);
  }
  return t.replace(/[ \t]{2,}/g, " ");
}

let filesChanged = 0, runs = 0;
for (const file of process.argv.slice(2)) {
  let svg = readFileSync(file, "utf8");
  if (!svg.includes("—")) continue;
  let out = svg.replace(/>([^<]*)</g, (m, content) => {
    if (!content.includes("—")) return m;
    runs++;
    return ">" + fixRun(content) + "<";
  });
  // Commentaires SVG (invisibles) : simple tiret pour rester propre.
  out = out.replace(/<!--([\s\S]*?)-->/g, (m, c) => c.includes("—") ? "<!--" + c.replace(/—/g, "-") + "-->" : m);
  if (out !== svg) { writeFileSync(file, out); filesChanged++; }
  if (out.includes("—")) console.error(`reste des — dans ${file}`);
}
console.log(`${filesChanged} fichiers modifiés, ${runs} segments de texte nettoyés.`);
