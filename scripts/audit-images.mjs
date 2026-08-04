// Audit ponctuel : ratio mots/images par article de blog FR publié.
// Usage : node scripts/audit-images.mjs
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const ROOT = "src/content/blog";
const TODAY = new Date("2026-08-04T23:59:59Z");

function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) out.push(...walk(p));
    else if (p.endsWith(".md") || p.endsWith(".mdx")) out.push(p);
  }
  return out;
}

function parse(file) {
  const raw = readFileSync(file, "utf8");
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!m) return null;
  const [, fm, body] = m;
  const get = (k) => {
    const r = fm.match(new RegExp(`^${k}:\\s*(.*)$`, "m"));
    return r ? r[1].trim().replace(/^["']|["']$/g, "") : null;
  };
  const hasHero = /^(heroImage|ogImage|coverImage|image):/m.test(fm);
  const draft = get("draft") === "true";
  const publishDate = get("publishDate");
  return { fm, body, hasHero, draft, publishDate, get };
}

// Mots du corps : on retire images, balises HTML, syntaxe de lien (garde le texte).
function wordCount(body) {
  let t = body
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")     // images markdown
    .replace(/```[\s\S]*?```/g, " ")           // blocs de code
    .replace(/<[^>]+>/g, " ")                  // balises HTML
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")   // liens -> texte
    .replace(/[#>*_`~|-]/g, " ");
  const words = t.split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w));
  return words.length;
}

function bodyImages(body) {
  return (body.match(/!\[[^\]]*\]\([^)]*\)/g) || []).length;
}

const rows = [];
for (const file of walk(ROOT)) {
  const p = parse(file);
  if (!p) continue;
  if (p.draft) continue;
  if (p.publishDate && new Date(p.publishDate) > TODAY) continue; // pas encore publié
  const words = wordCount(p.body);
  if (words < 300) continue; // ignore stubs / pages non-articles
  const cover = p.hasHero ? 1 : 0;
  const inline = bodyImages(p.body);
  const total = cover + inline;
  const ratio = total > 0 ? Math.round(words / total) : Infinity;
  const rubrique = file.split("/")[3] || "";
  const slug = file.split("/").pop().replace(/\.mdx?$/, "");
  rows.push({ slug, rubrique, words, cover, inline, total, ratio });
}

// Repère recommandé : 1 image / 300-500 mots.
const recommend = (r) => {
  if (r.total === 0) return "0 IMAGE";
  const idealMin = Math.ceil(r.words / 500);
  const idealMax = Math.ceil(r.words / 300);
  if (r.total < idealMin) return `sous-doté (viser ${idealMin}-${idealMax})`;
  if (r.total > idealMax + 1) return `sur-doté (viser ${idealMin}-${idealMax})`;
  return "ok";
};

rows.sort((a, b) => b.ratio - a.ratio); // pires ratios (plus de mots/image) en tête

const pad = (s, n) => String(s).padEnd(n);
const padL = (s, n) => String(s).padStart(n);
console.log(`\nArticles publiés analysés : ${rows.length}\n`);
console.log(pad("Article", 46) + pad("Rubr.", 10) + padL("Mots", 6) + padL("Img", 5) + padL("(cov+corps)", 12) + padL("Mots/img", 10) + "  Verdict");
console.log("-".repeat(120));
for (const r of rows) {
  const imgDetail = `${r.cover}+${r.inline}`;
  console.log(
    pad(r.slug.slice(0, 44), 46) +
    pad(r.rubrique, 10) +
    padL(r.words, 6) +
    padL(r.total, 5) +
    padL(imgDetail, 12) +
    padL(r.ratio === Infinity ? "∞" : r.ratio, 10) +
    "  " + recommend(r)
  );
}

// Synthèse
const zero = rows.filter((r) => r.total === 0).length;
const under = rows.filter((r) => recommend(r).startsWith("sous")).length;
const totalWords = rows.reduce((s, r) => s + r.words, 0);
const totalImgs = rows.reduce((s, r) => s + r.total, 0);
console.log("\n── Synthèse ──");
console.log(`Total mots : ${totalWords.toLocaleString("fr-FR")} | total images : ${totalImgs} | moyenne : 1 image / ${Math.round(totalWords / totalImgs)} mots`);
console.log(`Articles sans AUCUNE image : ${zero}`);
console.log(`Articles sous-dotés (< 1 img/500 mots) : ${under}`);
console.log(`Longueur moyenne : ${Math.round(totalWords / rows.length).toLocaleString("fr-FR")} mots/article`);
