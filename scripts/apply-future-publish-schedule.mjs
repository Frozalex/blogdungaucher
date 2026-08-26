/**
 * Replanifie les publishDate sur la grille, pour tout billet avec
 * publishDate >= SCHEDULE_GRID_ANCHOR_MONDAY.
 *
 * Deux files, remplies indépendamment à partir du même lundi d'ancrage :
 *   - les articles de SÉRIE prennent les mardis consécutifs ;
 *   - les autres prennent les lundis et jeudis, deux par semaine.
 *
 * L'ORDRE de chaque file est celui des publishDate actuelles : c'est lui qui
 * encode les décisions éditoriales déjà prises (priorité de trafic pour la
 * série Psychologie, alternance de rubriques pour la file historique). Le
 * script ne réordonne rien, il ne fait que reposer les dates sur la nouvelle
 * grille.
 *
 * Les billets avec publishDate < SCHEDULE_GRID_ANCHOR_MONDAY ne sont pas
 * modifiés (coussin calendaire ou passé figé).
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
import { ensembleDesSlugsDeSerie } from "./series-slugs.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dryRun = process.argv.includes("--dry-run");

const blogDir = path.join(__dirname, "..", "src", "content", "blog");
const ANCHOR = SCHEDULE_GRID_ANCHOR_MONDAY;

/** Décalage en jours depuis le lundi de la semaine. */
const MARDI = 1;
const JEUDI = 3;

/** Liste récursive des .md : les articles vivent en sous-dossiers (esprit/, science/,
 * societe/, grand-oral/). Une lecture à plat ne voit AUCUN fichier. */
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

/** Premier lundi (UTC) strictement après la date ISO donnée. */
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

const slugsDeSerie = ensembleDesSlugsDeSerie();
const future = [];
for (const full of files) {
  const raw = fs.readFileSync(full, "utf8");
  const pd = parseFrontPublishDate(raw);
  if (!pd) {
    console.error("publishDate manquant:", path.relative(blogDir, full));
    process.exit(1);
  }
  if (pd >= ANCHOR) {
    future.push({
      file: full,
      slug: path.basename(full, ".md"),
      old: pd,
      raw,
      serie: slugsDeSerie.has(path.basename(full, ".md")),
    });
  }
}

future.sort((a, b) => a.old.localeCompare(b.old) || a.slug.localeCompare(b.slug));

const series = future.filter((r) => r.serie);
const horsSerie = future.filter((r) => !r.serie);

// Les séries prennent un mardi chacune, à la suite.
const assignments = series.map((row, i) => ({
  ...row,
  next: mondayPlusDays(startMonday, i, MARDI),
}));

// La file historique prend lundi puis jeudi, deux par semaine. Un stock impair
// laisse la dernière semaine avec le seul lundi, ce que le contrôleur autorise.
for (const [i, row] of horsSerie.entries()) {
  const semaine = Math.floor(i / 2);
  const jour = i % 2 === 0 ? 0 : JEUDI;
  assignments.push({ ...row, next: mondayPlusDays(startMonday, semaine, jour) });
}

assignments.sort((a, b) => a.next.localeCompare(b.next) || a.slug.localeCompare(b.slug));

console.log(
  `Replanification à partir du lundi ${startMonday} (publishDate >= ${ANCHOR}) :`,
);
console.log(
  `  ${series.length} article(s) de série sur les mardis, ${horsSerie.length} hors série sur les lundis/jeudis.`,
);
if (horsSerie.length % 2 !== 0) {
  console.log(
    `  Stock hors série impair : la dernière semaine n'aura qu'un lundi, sans jeudi.`,
  );
}
console.log();

for (const a of assignments) {
  const marque = a.serie ? "série " : "      ";
  console.log(`${a.old} → ${a.next}  ${marque}${a.slug}`);
}

if (dryRun) {
  console.log("\n--dry-run : aucun fichier modifié.");
  process.exit(0);
}

let modifies = 0;
for (const a of assignments) {
  // Date inchangée : le remplacement serait un no-op, indiscernable d'un échec de regex.
  if (a.next === a.old) continue;
  const nextRaw = a.raw.replace(
    /^publishDate:\s*["'][^"']+["']/m,
    `publishDate: "${a.next}"`,
  );
  if (nextRaw === a.raw) {
    console.error("Remplacement publishDate impossible:", path.relative(blogDir, a.file));
    process.exit(1);
  }
  fs.writeFileSync(a.file, nextRaw, "utf8");
  modifies++;
}

console.log(`\n${modifies} fichier(s) mis à jour.`);
