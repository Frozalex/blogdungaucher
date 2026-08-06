// Heuristique de débordement de texte dans les schémas SVG.
// Estime la largeur de chaque <text> et signale ceux qui sortent probablement
// du cadre (x hors [0,640]) ou dont le y depasse la hauteur du viewBox.
// Approximatif (facteur de largeur moyen) : sert au triage, a confirmer en preview.
import { readFileSync } from "node:fs";

const FACTOR = 0.54;   // largeur moyenne d'un glyphe / font-size (sans-serif)
const MARGIN = 6;      // tolerance en px

function decode(s) {
  return s.replace(/&#(\d+);/g, "x")      // entite numerique = 1 glyphe (piece)
          .replace(/&[a-z]+;/g, "x");     // &amp; &lt; ... ~ 1 glyphe
}

for (const file of process.argv.slice(2)) {
  const svg = readFileSync(file, "utf8");
  const vb = svg.match(/viewBox="0 0 (\d+) (\d+)"/);
  if (!vb) continue;
  const W = +vb[1], H = +vb[2];
  const issues = [];
  // Chaque <text ...>...</text> (sans tspan imbrique gere finement, suffisant ici)
  const re = /<text\b([^>]*)>([\s\S]*?)<\/text>/g;
  let m;
  while ((m = re.exec(svg))) {
    const attrs = m[1];
    // Ignorer le texte pivoté (labels d'axe verticaux) : leur largeur se projette sur y.
    if (/transform="[^"]*rotate/.test(attrs)) continue;
    const raw = m[2].replace(/<[^>]+>/g, "");
    const txt = decode(raw).trim();
    if (!txt) continue;
    const x = parseFloat((attrs.match(/\bx="(-?[\d.]+)"/) || [])[1] ?? "NaN");
    const y = parseFloat((attrs.match(/\by="(-?[\d.]+)"/) || [])[1] ?? "NaN");
    const fs = parseFloat((attrs.match(/font-size="([\d.]+)"/) || [])[1] ?? "13");
    const anchor = (attrs.match(/text-anchor="(\w+)"/) || [])[1] || "start";
    if (Number.isNaN(x)) continue;
    const w = txt.length * fs * FACTOR;
    let left = x, right = x;
    if (anchor === "middle") { left = x - w / 2; right = x + w / 2; }
    else if (anchor === "end") { left = x - w; }
    else { right = x + w; }
    const problems = [];
    if (right > W + MARGIN) problems.push(`droite ${Math.round(right)}>${W}`);
    if (left < -MARGIN) problems.push(`gauche ${Math.round(left)}`);
    if (!Number.isNaN(y) && (y > H - 2 || y < 8)) problems.push(`y ${y}/${H}`);
    if (problems.length) issues.push(`   [${problems.join(", ")}] "${txt.slice(0, 42)}"`);
  }
  if (issues.length) {
    console.log(`\n${file.replace("public/images/", "")}  (${W}x${H})`);
    issues.forEach((i) => console.log(i));
  }
}
