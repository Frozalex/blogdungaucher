/**
 * Rééquilibre l'ORDRE thématique des prochains articles, sans changer le set de dates.
 *
 * Problème : la file des prochains uploads peut être mono-thématique (ex. 10 articles
 * "esprit" d'affilée). Ce script réassigne QUELS articles tombent sur QUELS créneaux
 * de publication déjà prévus, en étalant chaque rubrique uniformément sur la timeline
 * (méthode des positions fractionnaires), pour de la variété rubrique par rubrique.
 *
 * Sécurité :
 *  - ne touche QUE les articles non encore publiés (publishDate > CUTOFF, défaut = aujourd'hui) ;
 *  - réutilise EXACTEMENT les dates futures déjà en place (mêmes créneaux lun/jeu, mêmes gaps) :
 *    seul le mapping article → date change. Les articles déjà publiés ne bougent pas.
 *  - préserve l'ordre interne (chronologique) de chaque rubrique.
 *
 * Usage : node scripts/interleave-future-themes.mjs --dry-run
 *         node scripts/interleave-future-themes.mjs
 *         CUTOFF=2026-06-06 node scripts/interleave-future-themes.mjs --dry-run
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dryRun = process.argv.includes("--dry-run");
const blogDir = path.join(__dirname, "..", "src", "content", "blog");

const CUTOFF = process.env.CUTOFF || new Date().toISOString().slice(0, 10);
/** Ordre de cycle pour départager les ex æquo de position (déterminisme). */
const CYCLE = ["science", "esprit", "societe", "grand-oral"];

function parsePub(raw) {
  const m = raw.match(/^publishDate:\s*["']?(\d{4}-\d{2}-\d{2})["']?/m);
  return m ? m[1] : null;
}
function parseCat(raw) {
  const m = raw.match(/^category:\s*["']?([a-z-]+)["']?/m);
  return m ? m[1] : null;
}

function walk(dir) {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...walk(p));
    else if (e.name.endsWith(".md")) out.push(p);
  }
  return out;
}

const future = [];
for (const full of walk(blogDir)) {
  const raw = fs.readFileSync(full, "utf8");
  const date = parsePub(raw);
  const cat = parseCat(raw);
  if (!date || !cat) continue;
  if (date > CUTOFF) future.push({ full, slug: path.basename(full, ".md"), date, cat, raw });
}

if (future.length === 0) {
  console.log(`Aucun article futur (publishDate > ${CUTOFF}).`);
  process.exit(0);
}

// Créneaux = dates futures existantes, triées. On les réutilise telles quelles.
const slots = future.map((a) => a.date).sort();

// Regroupe par rubrique, chaque groupe trié par date (préserve l'ordre interne du thème).
const byCat = new Map();
for (const a of [...future].sort((x, y) => x.date.localeCompare(y.date) || x.slug.localeCompare(y.slug))) {
  if (!byCat.has(a.cat)) byCat.set(a.cat, []);
  byCat.get(a.cat).push(a);
}

// Position fractionnaire : i-ème article d'une rubrique de taille c → (i+0.5)/c.
// Trier par cette position étale chaque rubrique uniformément sur toute la timeline.
const withPos = [];
for (const [, arr] of byCat) {
  arr.forEach((a, i) => withPos.push({ ...a, pos: (i + 0.5) / arr.length }));
}
withPos.sort(
  (a, b) =>
    a.pos - b.pos ||
    CYCLE.indexOf(a.cat) - CYCLE.indexOf(b.cat) ||
    a.date.localeCompare(b.date),
);

const assignments = withPos.map((a, i) => ({ ...a, next: slots[i] }));

let adjacencies = 0;
let moved = 0;
for (let i = 0; i < assignments.length; i++) {
  if (i > 0 && assignments[i].cat === assignments[i - 1].cat) adjacencies++;
  if (assignments[i].next !== assignments[i].date) moved++;
}

console.log(
  `Interleave thématique : ${assignments.length} articles futurs (> ${CUTOFF}), mêmes dates réutilisées, ${moved} déplacés.\n`,
);
console.log("date         rubrique   article                              (ancienne date)");
for (const a of assignments) {
  const flag = a.next !== a.date ? " *" : "  ";
  console.log(`${a.next}   ${a.cat.padEnd(9)}  ${a.slug.padEnd(36)} (${a.date})${flag}`);
}
console.log(`\nAdjacences même rubrique (consécutifs) : ${adjacencies}`);

if (dryRun) {
  console.log("\n--dry-run : aucun fichier modifié.");
  process.exit(0);
}

for (const a of assignments) {
  if (a.next === a.date) continue;
  const nextRaw = a.raw.replace(
    /^publishDate:\s*["']?\d{4}-\d{2}-\d{2}["']?/m,
    `publishDate: "${a.next}"`,
  );
  if (nextRaw === a.raw) {
    console.error("Échec remplacement publishDate :", a.full);
    process.exit(1);
  }
  fs.writeFileSync(a.full, nextRaw, "utf8");
}
console.log("\nFichiers mis à jour.");
