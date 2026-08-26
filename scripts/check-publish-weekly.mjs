/**
 * Valide la grille de publication pour tout billet avec
 * publishDate >= SCHEDULE_GRID_ANCHOR_MONDAY.
 *
 * Deux files indépendantes se partagent la semaine :
 *
 *   MARDI   — les séries éditoriales (Psychologie, puis Moteur en Python).
 *             Un article par mardi, sans trou, dans l'ordre de la série.
 *   LUN/JEU — la file historique, hors série. Deux articles par semaine, de
 *             rubriques différentes. La dernière semaine peut n'en porter qu'un
 *             (le stock n'est pas forcément pair), et les semaines qui suivent
 *             l'épuisement du stock n'ont pas de lundi/jeudi du tout : seul le
 *             mardi de la série continue.
 *
 * La correspondance mardi ⇄ série est stricte dans les deux sens : un article
 * de série ne peut pas sortir un lundi, et un article hors série ne peut pas
 * occuper un mardi.
 *
 * Les billets avec publishDate < SCHEDULE_GRID_ANCHOR_MONDAY ne sont pas soumis
 * à cette grille.
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
import { ensembleDesSlugsDeSerie, serieDuSlug } from "./series-slugs.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dir = path.join(__dirname, "..", "src", "content", "blog");

const LUNDI = 1;
const MARDI = 2;
const JEUDI = 4;
const NOMS_DE_JOUR = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];

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

function jourUtc(isoDateStr) {
  return new Date(`${isoDateStr}T12:00:00Z`).getUTCDay();
}

function lundiDeLaSemaine(isoDateStr) {
  const d = new Date(`${isoDateStr}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() - ((d.getUTCDay() + 6) % 7));
  return d.toISOString().slice(0, 10);
}

/** Nombre de semaines entières entre deux dates ISO tombant le même jour. */
function semainesEntre(debut, fin) {
  const a = new Date(`${debut}T12:00:00Z`);
  const b = new Date(`${fin}T12:00:00Z`);
  return Math.round((b - a) / 604800000);
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

const slugsDeSerie = ensembleDesSlugsDeSerie();
let errors = 0;

// --- 1. Dates uniques ------------------------------------------------------
const vues = new Map();
for (const r of scheduled) {
  if (vues.has(r.date)) {
    errors++;
    console.error(`Date dupliquée ${r.date} : ${vues.get(r.date)} et ${r.slug}`);
  }
  vues.set(r.date, r.slug);
}

// --- 2. Jour autorisé, et correspondance mardi ⇄ série ---------------------
const series = [];
const horsSerie = [];
for (const r of scheduled) {
  const jour = jourUtc(r.date);
  const estSerie = slugsDeSerie.has(r.slug);

  if (![LUNDI, MARDI, JEUDI].includes(jour)) {
    errors++;
    console.error(
      `Jour interdit : ${r.slug} → ${r.date} (${NOMS_DE_JOUR[jour]}), attendu lundi, mardi ou jeudi.`,
    );
    continue;
  }
  if (estSerie && jour !== MARDI) {
    errors++;
    console.error(
      `${r.slug} appartient à la série « ${serieDuSlug(r.slug)} » : attendu un mardi, trouvé ${r.date} (${NOMS_DE_JOUR[jour]}).`,
    );
    continue;
  }
  if (!estSerie && jour === MARDI) {
    errors++;
    console.error(
      `Le mardi est réservé aux séries : ${r.slug} → ${r.date}. Déplace-le un lundi ou un jeudi, ou déclare-le dans src/data/serie-*.ts.`,
    );
    continue;
  }
  (estSerie ? series : horsSerie).push(r);
}

// --- 3. Les mardis de série se suivent sans trou --------------------------
for (let i = 1; i < series.length; i++) {
  const ecart = semainesEntre(series[i - 1].date, series[i].date);
  if (ecart !== 1) {
    errors++;
    console.error(
      `Trou dans la file des séries : ${series[i - 1].date} (${series[i - 1].slug}) puis ${series[i].date} (${series[i].slug}), ${ecart} semaine(s) d'écart.`,
    );
  }
}

// --- 4. La file hors série : 2 par semaine, rubriques différentes ----------
const parSemaine = new Map();
for (const r of horsSerie) {
  const lundi = lundiDeLaSemaine(r.date);
  if (!parSemaine.has(lundi)) parSemaine.set(lundi, []);
  parSemaine.get(lundi).push(r);
}

const semaines = [...parSemaine.keys()].sort();
for (let i = 0; i < semaines.length; i++) {
  const lundi = semaines[i];
  const liste = parSemaine.get(lundi).sort((a, b) => a.date.localeCompare(b.date));
  const derniere = i === semaines.length - 1;

  if (liste.length > 2) {
    errors++;
    console.error(`Semaine du ${lundi} : ${liste.length} billets hors série, maximum 2.`);
    for (const r of liste) console.error(`  ${r.date}  ${r.slug}`);
  } else if (liste.length === 1 && !derniere) {
    errors++;
    console.error(
      `Semaine du ${lundi} : 1 seul billet hors série (${liste[0].slug}). Seule la dernière semaine de la file a le droit d'être incomplète.`,
    );
  }

  if (liste.length === 2) {
    const [a, b] = liste;
    if (a.cat && b.cat && a.cat === b.cat) {
      errors++;
      console.error(
        `Semaine du ${lundi} : lundi et jeudi sur la même rubrique « ${a.cat} » — attendu deux rubriques différentes.`,
      );
      for (const r of liste) console.error(`  ${r.date}  ${r.slug}`);
    }
  }

  // Pas de semaine sautée tant que la file dure.
  if (i > 0) {
    const ecart = semainesEntre(semaines[i - 1], lundi);
    if (ecart !== 1) {
      errors++;
      console.error(
        `Trou dans la file hors série : semaine du ${semaines[i - 1]} puis du ${lundi}, ${ecart} semaine(s) d'écart.`,
      );
    }
  }
}

if (errors) {
  console.error(
    `\n${errors} problème(s). Grille : mardi = séries (1/semaine, sans trou), lundi+jeudi = file hors série (2/semaine, rubriques différentes). Ancrage ${anchor}.`,
  );
  console.error(
    `Constantes : RESCHEDULE_FROM=${RESCHEDULE_FROM}, SCHEDULE_GRID_ANCHOR_MONDAY=${anchor}.`,
  );
  console.error(
    "Réparation : apply-future-publish-schedule.mjs (dates) puis pair-week-themes.mjs (rubriques), --dry-run d'abord.",
  );
  process.exit(1);
}

const finSerie = series.length ? series[series.length - 1].date : "—";
const finFile = horsSerie.length ? horsSerie[horsSerie.length - 1].date : "—";
console.log(`OK : ${scheduled.length} billet(s) sur la grille (≥ ${anchor}).`);
console.log(`  mardi   — séries     : ${series.length} billet(s), jusqu'au ${finSerie}`);
console.log(
  `  lun/jeu — hors série : ${horsSerie.length} billet(s) sur ${semaines.length} semaine(s), jusqu'au ${finFile}`,
);
