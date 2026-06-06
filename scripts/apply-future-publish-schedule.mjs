/**
 * Replanifie les publishDate sur la grille 2 / semaine (lundi + jeudi UTC),
 * pour tout billet avec publishDate >= SCHEDULE_GRID_ANCHOR_MONDAY.
 *
 * Les billets avec publishDate < SCHEDULE_GRID_ANCHOR_MONDAY ne sont pas modifiés
 * (coussin calendaire ou passé figé, ex. un jeudi entre RESCHEDULE_FROM et le lundi d’ancrage).
 *
 * Usage : node scripts/apply-future-publish-schedule.mjs
 *         node scripts/apply-future-publish-schedule.mjs --dry-run
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  RESCHEDULE_FROM,
  SCHEDULE_GRID_ANCHOR_MONDAY,
} from "./publish-schedule-constants.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dryRun = process.argv.includes("--dry-run");

const blogDir = path.join(__dirname, "..", "src", "content", "blog");
const ANCHOR = SCHEDULE_GRID_ANCHOR_MONDAY;

/** Liste récursive des .md : les articles vivent en sous-dossiers (esprit/, science/,
 * societe/, grand-oral/). Une lecture à plat ne voit AUCUN fichier. Renvoie des chemins complets. */
function walk(d) {
  const out = [];
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) out.push(...walk(p));
    else if (e.name.endsWith(".md")) out.push(p);
  }
  return out;
}

function parseFrontPublishDate(raw) {
  const m = raw.match(/^publishDate:\s*["']([^"']+)["']/m);
  return m ? m[1] : null;
}

function toIsoDateUTC(d) {
  const y = d.getUTCFullYear();
  const mo = String(d.getUTCMonth() + 1).padStart(2, "0");
  const da = String(d.getUTCDate()).padStart(2, "0");
  return `${y}-${mo}-${da}`;
}

/** Premier lundi (UTC) strictement après la date ISO donnée (jour J + 1 → …). */
function nextMondayStrictlyAfter(isoDateStr) {
  const d = new Date(`${isoDateStr}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + 1);
  while (d.getUTCDay() !== 1) d.setUTCDate(d.getUTCDate() + 1);
  return toIsoDateUTC(d);
}

/** max des publishDate < cutoff, ou null. `files` = chemins complets. */
function maxPublishDateBefore(files, cutoff) {
  let max = null;
  for (const full of files) {
    const raw = fs.readFileSync(full, "utf8");
    const pd = parseFrontPublishDate(raw);
    if (!pd || pd >= cutoff) continue;
    if (!max || pd > max) max = pd;
  }
  return max;
}

function mondayPlusDays(mondayIso, weekOffset, addDays) {
  const d = new Date(`${mondayIso}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + weekOffset * 7 + addDays);
  return toIsoDateUTC(d);
}

const files = walk(blogDir);
const lastKept = maxPublishDateBefore(files, RESCHEDULE_FROM);
if (!lastKept) {
  console.error("Aucun billet avec publishDate <", RESCHEDULE_FROM);
  process.exit(1);
}

const startMonday = nextMondayStrictlyAfter(lastKept);
if (startMonday !== SCHEDULE_GRID_ANCHOR_MONDAY) {
  console.warn(
    "Attention : premier lundi calculé",
    startMonday,
    "≠ constante SCHEDULE_GRID_ANCHOR_MONDAY",
    SCHEDULE_GRID_ANCHOR_MONDAY,
    ": mets à jour scripts/publish-schedule-constants.mjs pour la CI.",
  );
}

const future = [];
for (const full of files) {
  const raw = fs.readFileSync(full, "utf8");
  const pd = parseFrontPublishDate(raw);
  if (!pd) {
    console.error("publishDate manquant:", path.relative(blogDir, full));
    process.exit(1);
  }
  if (pd >= ANCHOR) {
    future.push({ file: full, slug: path.basename(full, ".md"), old: pd, raw });
  }
}

future.sort((a, b) => {
  if (a.old !== b.old) return a.old.localeCompare(b.old);
  return a.slug.localeCompare(b.slug);
});

if (future.length % 2 !== 0) {
  console.error(
    `Nombre impair de billets sur la grille (publishDate >= ${ANCHOR}) : ${future.length}.`,
    "Ajoute un billet, ou place un billet sous l’ancrage (publishDate <",
    `${ANCHOR}) pour que le total sur la grille soit pair.`,
  );
  process.exit(1);
}

const assignments = future.map((row, i) => {
  const week = Math.floor(i / 2);
  const slot = i % 2;
  const add = slot === 0 ? 0 : 3;
  const next = mondayPlusDays(startMonday, week, add);
  return { ...row, next };
});

console.log(
  `Replanification : ${assignments.length} billet(s), publishDate >= ${ANCHOR}, grille à partir du lundi ${startMonday} (lun/jeu).`,
);
for (const a of assignments) {
  console.log(`${a.old} → ${a.next}  ${a.slug}`);
}

if (dryRun) {
  console.log("\n--dry-run : aucun fichier modifié.");
  process.exit(0);
}

for (const a of assignments) {
  const nextRaw = a.raw.replace(
    /^publishDate:\s*["'][^"']+["']/m,
    `publishDate: "${a.next}"`,
  );
  if (nextRaw === a.raw) {
    console.error("Remplacement publishDate impossible:", path.relative(blogDir, a.file));
    process.exit(1);
  }
  fs.writeFileSync(a.file, nextRaw, "utf8");
}

console.log("\nFichiers mis à jour.");
