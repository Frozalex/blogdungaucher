/**
 * Valide la grille pour tout billet avec publishDate >= SCHEDULE_GRID_ANCHOR_MONDAY :
 * nombre total de ces billets : **pair** (sinon impossible d’avoir 2 par semaine partout) ;
 * chaque date : lundi ou jeudi (UTC) ;
 * chaque semaine ISO contenant au moins un de ces billets : **exactement 2** billets ;
 * pas deux billets le même jour ;
 * les 2 billets d’une semaine : **rubriques différentes** (jamais science le lundi
 *   ET le jeudi). Réparation : `node scripts/pair-week-themes.mjs --dry-run`.
 *
 * Les billets avec publishDate < SCHEDULE_GRID_ANCHOR_MONDAY ne sont pas soumis à cette grille.
 *
 * Run: node scripts/check-publish-weekly.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  RESCHEDULE_FROM,
  SCHEDULE_GRID_ANCHOR_MONDAY,
} from "./publish-schedule-constants.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dir = path.join(__dirname, "..", "src", "content", "blog");

/** Liste récursive des .md : les articles vivent en sous-dossiers (esprit/, science/,
 * societe/, grand-oral/). Une lecture à plat ne voit AUCUN fichier → check no-op. */
function walk(d) {
  const out = [];
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) out.push(...walk(p));
    else if (e.name.endsWith(".md")) out.push(p);
  }
  return out;
}

function isoWeekKey(isoDateStr) {
  const date = new Date(`${isoDateStr}T12:00:00Z`);
  if (Number.isNaN(date.getTime())) return null;
  const dayNr = (date.getUTCDay() + 6) % 7;
  const d = new Date(date);
  d.setUTCDate(d.getUTCDate() - dayNr + 3);
  const firstThursday = new Date(Date.UTC(d.getUTCFullYear(), 0, 4));
  const firstDayNr = (firstThursday.getUTCDay() + 6) % 7;
  firstThursday.setUTCDate(4 - firstDayNr);
  const weekNo = 1 + Math.round((d - firstThursday) / 604800000);
  return `${d.getUTCFullYear()}-W${String(weekNo).padStart(2, "0")}`;
}

function isMondayOrThursdayUtc(isoDateStr) {
  const d = new Date(`${isoDateStr}T12:00:00Z`);
  const dow = d.getUTCDay();
  return dow === 1 || dow === 4;
}

const files = walk(dir);
const rows = [];
for (const full of files) {
  const raw = fs.readFileSync(full, "utf8");
  const m = raw.match(/^publishDate:\s*["']([^"']+)["']/m);
  if (!m) {
    console.error("publishDate manquant:", path.relative(dir, full));
    process.exit(1);
  }
  const c = raw.match(/^category:\s*["']?([a-z-]+)["']?/m);
  rows.push({ slug: path.basename(full, ".md"), date: m[1], cat: c ? c[1] : null });
}

const anchor = SCHEDULE_GRID_ANCHOR_MONDAY;
const scheduled = rows.filter((r) => r.date >= anchor);
scheduled.sort((a, b) => a.date.localeCompare(b.date) || a.slug.localeCompare(b.slug));

if (scheduled.length === 0) {
  console.log("Aucun billet avec publishDate >=", anchor, ": rien à valider.");
  process.exit(0);
}

let errors = 0;

if (scheduled.length % 2 !== 0) {
  errors++;
  console.error(
    `Nombre impair (${scheduled.length}) de billets avec publishDate >= ${anchor} : impossible d’avoir exactement 2 billets par semaine sans semaine à 1. Ajoute un billet ou repasse-en un sous l’ancrage (< ${anchor}).`,
  );
}

for (const r of scheduled) {
  if (!isMondayOrThursdayUtc(r.date)) {
    errors++;
    console.error(
      `Pas un lundi/jeudi (UTC) : ${r.slug} → ${r.date} (attendu lun. ou jeu. à partir du ${anchor})`,
    );
  }
}

const byWeek = new Map();
for (const r of scheduled) {
  const w = isoWeekKey(r.date);
  if (!w) {
    errors++;
    continue;
  }
  if (!byWeek.has(w)) byWeek.set(w, []);
  byWeek.get(w).push(r);
}

const weeks = [...byWeek.keys()].sort();

for (const w of weeks) {
  const list = byWeek.get(w).sort((a, b) => a.date.localeCompare(b.date));
  const n = list.length;
  if (n !== 2) {
    errors++;
    console.error(`${w} : ${n} billet(s), attendu exactement 2.`);
    for (const r of list) console.error(`  ${r.date}  ${r.slug}`);
    continue;
  }
  const [a, b] = list;
  if (a.cat && b.cat && a.cat === b.cat) {
    errors++;
    console.error(
      `${w} : lundi et jeudi sur la même rubrique « ${a.cat} » — attendu deux rubriques différentes.`,
    );
    for (const r of list) console.error(`  ${r.date}  ${r.slug}`);
  }
}

const seen = new Map();
for (const r of scheduled) {
  if (seen.has(r.date)) {
    errors++;
    console.error(`Date dupliquée ${r.date} : ${seen.get(r.date)} et ${r.slug}`);
  }
  seen.set(r.date, r.slug);
}

if (errors) {
  console.error(
    `\n${errors} problème(s). Grille : exactement 2 billets / semaine ISO (lun. + jeu. UTC, rubriques différentes), ancrage ${anchor}.`,
  );
  console.error(
    `Constantes : RESCHEDULE_FROM=${RESCHEDULE_FROM}, SCHEDULE_GRID_ANCHOR_MONDAY=${anchor}.`,
  );
  console.error(
    "Réparation : apply-future-publish-schedule.mjs (dates) puis pair-week-themes.mjs (rubriques), --dry-run d’abord.",
  );
  process.exit(1);
}

console.log(
  `OK : ${scheduled.length} billet(s) sur la grille (≥ ${anchor}) : semaines ${weeks[0]} … ${weeks[weeks.length - 1]}, lun/jeu UTC, 2 par semaine.`,
);
console.log(
  `Rappel : replanification auto des dates ≥ ${anchor} via apply-future-publish-schedule.mjs ; billets entre RESCHEDULE_FROM et l’ancrage : manuels.`,
);
