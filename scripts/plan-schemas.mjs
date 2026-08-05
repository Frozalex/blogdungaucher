// Plan de densification : combien de schémas de corps ajouter par article publié
// pour atteindre la cible (~1 image / 450 mots ≈ 1 / 2-3 sections), hors couverture.
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const ROOT = "src/content/blog";
const TODAY = new Date("2026-08-04T23:59:59Z");

function walk(dir) {
  const out = [];
  for (const n of readdirSync(dir)) {
    const p = join(dir, n);
    if (statSync(p).isDirectory()) out.push(...walk(p));
    else if (p.endsWith(".md")) out.push(p);
  }
  return out;
}
function fm(raw) { const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/); return m ? { fm: m[1], body: m[2] } : null; }
function words(body) {
  const t = body.replace(/!\[[^\]]*\]\([^)]*\)/g, " ").replace(/```[\s\S]*?```/g, " ").replace(/<[^>]+>/g, " ").replace(/\[([^\]]*)\]\([^)]*\)/g, "$1").replace(/[#>*_`~|-]/g, " ");
  return t.split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length;
}

const rows = [];
for (const f of walk(ROOT)) {
  const p = fm(readFileSync(f, "utf8"));
  if (!p) continue;
  const draft = /^draft:\s*true/m.test(p.fm);
  const pd = (p.fm.match(/^publishDate:\s*"?([\d-]+)"?/m) || [])[1];
  if (draft) continue;
  if (pd && new Date(pd) > TODAY) continue;
  const w = words(p.body);
  if (w < 300) continue;
  const sections = (p.body.match(/^##\s/gm) || []).length;
  const bodyImgs = (p.body.match(/!\[[^\]]*\]\([^)]*\)/g) || []).length;
  // Cible : 1 image / 450 mots, bornée par ~1 image / 2 sections ; min 2.
  let target = Math.max(2, Math.round(w / 450));
  const bySection = Math.ceil(sections / 2);
  target = Math.min(target, bySection || target); // ne pas dépasser 1 / 2 sections
  const need = Math.max(0, target - bodyImgs);
  const rubrique = f.split("/")[3] || "";
  rows.push({ slug: f.split("/").pop().replace(/\.md$/, ""), rubrique, w, sections, bodyImgs, target, need });
}

rows.sort((a, b) => b.need - a.need);
const pad = (s, n) => String(s).padEnd(n);
const padL = (s, n) => String(s).padStart(n);
console.log(pad("Article", 46) + pad("Rubr.", 10) + padL("Mots", 6) + padL("Sec", 5) + padL("Actu", 6) + padL("Cible", 6) + padL("+À faire", 9));
console.log("-".repeat(88));
for (const r of rows) if (r.need > 0)
  console.log(pad(r.slug.slice(0, 44), 46) + pad(r.rubrique, 10) + padL(r.w, 6) + padL(r.sections, 5) + padL(r.bodyImgs, 6) + padL(r.target, 6) + padL(r.need, 9));

const totalNeed = rows.reduce((s, r) => s + r.need, 0);
const artNeeding = rows.filter((r) => r.need > 0).length;
const already = rows.filter((r) => r.need === 0).length;
console.log("\n── Synthèse ──");
console.log(`Articles publiés : ${rows.length}`);
console.log(`Déjà à la cible : ${already}`);
console.log(`Articles à compléter : ${artNeeding}`);
console.log(`TOTAL schémas à créer : ${totalNeed}`);
console.log(`Par rubrique :`);
for (const rub of [...new Set(rows.map((r) => r.rubrique))]) {
  const n = rows.filter((r) => r.rubrique === rub).reduce((s, r) => s + r.need, 0);
  console.log(`  ${rub} : ${n}`);
}
