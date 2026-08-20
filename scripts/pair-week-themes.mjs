/**
 * Garantit qu'une même semaine ne publie jamais deux fois la même rubrique
 * (lundi ≠ jeudi), en déplaçant le MOINS d'articles possible.
 *
 * Différence avec interleave-future-themes.mjs : celui-là réoptimise globalement
 * l'étalement des rubriques sur toute la timeline (méthode des positions
 * fractionnaires) et bouscule donc l'ordre éditorial. Ici on part de l'ordre
 * chronologique en place — qui encode l'ordre de priorité voulu (vagues de la
 * série Psychologie, file historique) — et on ne fait que les permutations
 * strictement nécessaires pour casser les collisions de rubrique.
 *
 * Sécurité :
 *  - opère sur le même périmètre que la grille (publishDate >= SCHEDULE_GRID_ANCHOR_MONDAY),
 *    jamais sur un article déjà publié (garde-fou supplémentaire : > aujourd'hui) ;
 *  - réutilise EXACTEMENT les dates déjà en place : seul le mapping article → date change ;
 *  - PINNED_LAST reste sur le tout dernier créneau (article de clôture de série).
 *
 * Usage : node scripts/pair-week-themes.mjs --dry-run
 *         node scripts/pair-week-themes.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { SCHEDULE_GRID_ANCHOR_MONDAY } from "./publish-schedule-constants.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dryRun = process.argv.includes("--dry-run");
const blogDir = path.join(__dirname, "..", "src", "content", "blog");

const today = new Date().toISOString().slice(0, 10);
/** Première date réordonnançable (incluse) : le début de grille, jamais le passé. */
const FROM = SCHEDULE_GRID_ANCHOR_MONDAY > today ? SCHEDULE_GRID_ANCHOR_MONDAY : today;

/** Articles épinglés sur le dernier créneau de la grille (dans cet ordre).
 * Le hub de la série Psychologie doit fermer la série : il référence les 40 autres. */
const PINNED_LAST = ["pourquoi-ton-cerveau-prefere-avoir-raison"];

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

function isoWeekKey(isoDateStr) {
  const date = new Date(`${isoDateStr}T12:00:00Z`);
  const dayNr = (date.getUTCDay() + 6) % 7;
  const d = new Date(date);
  d.setUTCDate(d.getUTCDate() - dayNr + 3);
  const firstThursday = new Date(Date.UTC(d.getUTCFullYear(), 0, 4));
  const firstDayNr = (firstThursday.getUTCDay() + 6) % 7;
  firstThursday.setUTCDate(4 - firstDayNr);
  const weekNo = 1 + Math.round((d - firstThursday) / 604800000);
  return `${d.getUTCFullYear()}-W${String(weekNo).padStart(2, "0")}`;
}

const future = [];
for (const full of walk(blogDir)) {
  const raw = fs.readFileSync(full, "utf8");
  const date = parsePub(raw);
  const cat = parseCat(raw);
  if (!date) continue;
  if (date < FROM || date <= today) continue;
  if (!cat) {
    console.error("category manquante :", path.relative(blogDir, full));
    process.exit(1);
  }
  future.push({ full, slug: path.basename(full, ".md"), date, cat, raw });
}

if (future.length === 0) {
  console.log(`Aucun article sur la grille (publishDate >= ${FROM}).`);
  process.exit(0);
}

// Ordre chronologique en place = ordre éditorial de référence à préserver.
future.sort((a, b) => a.date.localeCompare(b.date) || a.slug.localeCompare(b.slug));

// Créneaux réutilisés tels quels, regroupés par semaine ISO.
const slots = future.map((a) => a.date).sort();
const weekOrder = [];
const weekSlots = new Map();
for (const d of slots) {
  const w = isoWeekKey(d);
  if (!weekSlots.has(w)) {
    weekSlots.set(w, []);
    weekOrder.push(w);
  }
  weekSlots.get(w).push(d);
}

// Épinglages : slug → date imposée (les derniers créneaux de la grille).
const pinnedDate = new Map();
PINNED_LAST.forEach((slug, i) => {
  const d = slots[slots.length - PINNED_LAST.length + i];
  if (future.some((a) => a.slug === slug)) pinnedDate.set(slug, d);
});

const pool = future.filter((a) => !pinnedDate.has(a.slug));

/** État semaine : créneaux libres + rubriques déjà prises par un épinglé. */
const weeks = weekOrder.map((w) => {
  const dates = weekSlots.get(w);
  const pinnedHere = [...pinnedDate.entries()].filter(([, d]) => dates.includes(d));
  const taken = new Set(
    pinnedHere.map(([slug]) => future.find((a) => a.slug === slug).cat),
  );
  return {
    key: w,
    dates,
    free: dates.length - pinnedHere.length,
    forbidden: taken,
  };
});

function countsOf(articles) {
  const c = new Map();
  for (const a of articles) c.set(a.cat, (c.get(a.cat) || 0) + 1);
  return c;
}

/**
 * Faisabilité du reste : problème de flot (rubriques → semaines, capacité 1 par
 * couple semaine/rubrique). La condition de coupe se réduit aux sous-ensembles
 * de rubriques : pour tout S, demande(S) <= somme_w min(créneaux libres, |S hors interdites|).
 */
function feasible(counts, remainingWeeks) {
  const universe = [...counts.keys()].filter((c) => counts.get(c) > 0);
  for (let mask = 1; mask < 1 << universe.length; mask++) {
    const S = universe.filter((_, i) => mask & (1 << i));
    const demand = S.reduce((s, c) => s + counts.get(c), 0);
    let cap = 0;
    for (const w of remainingWeeks) {
      const avail = S.filter((c) => !w.forbidden.has(c)).length;
      cap += Math.min(w.free, avail);
    }
    if (demand > cap) return false;
  }
  return true;
}

/** Retire un article du pool et renvoie l'état de comptage résultant. */
function countsAfter(counts, picked) {
  const next = new Map(counts);
  for (const a of picked) next.set(a.cat, next.get(a.cat) - 1);
  return next;
}

const placement = new Map(); // date → article
for (const [slug, d] of pinnedDate) {
  placement.set(d, future.find((a) => a.slug === slug));
}

let prevMondayCat = null;
let prevThursdayCat = null;

/** Mémorise les rubriques du lundi / du jeudi de la semaine qu'on vient de composer. */
function rememberWeek(week) {
  for (const d of week.dates) {
    const a = placement.get(d);
    if (!a) continue;
    if (new Date(`${d}T12:00:00Z`).getUTCDay() === 1) prevMondayCat = a.cat;
    else prevThursdayCat = a.cat;
  }
}

let remaining = [...pool];
for (let wi = 0; wi < weeks.length; wi++) {
  const week = weeks[wi];
  if (week.free === 0) {
    rememberWeek(week);
    continue;
  }
  const laterWeeks = weeks.slice(wi + 1);
  const freeDates = week.dates.filter((d) => !placement.has(d));

  let chosen = null;
  if (week.free === 1) {
    for (let i = 0; i < remaining.length && !chosen; i++) {
      const a = remaining[i];
      if (week.forbidden.has(a.cat)) continue;
      const rest = remaining.filter((_, k) => k !== i);
      if (feasible(countsAfter(countsOf(remaining), [a]), laterWeeks)) chosen = [a];
      if (chosen) remaining = rest;
    }
  } else {
    outer: for (let i = 0; i < remaining.length; i++) {
      const a = remaining[i];
      if (week.forbidden.has(a.cat)) continue;
      for (let j = i + 1; j < remaining.length; j++) {
        const b = remaining[j];
        if (b.cat === a.cat || week.forbidden.has(b.cat)) continue;
        if (feasible(countsAfter(countsOf(remaining), [a, b]), laterWeeks)) {
          chosen = [a, b];
          remaining = remaining.filter((_, k) => k !== i && k !== j);
          break outer;
        }
      }
    }
  }

  if (!chosen) {
    console.error(
      `Impossible de composer la semaine ${week.key} sans répéter une rubrique.`,
      "Le stock restant est trop mono-thématique : ajoute un article d'une autre rubrique.",
    );
    process.exit(1);
  }

  // Orientation dans la semaine : permuter les deux articles d'une même semaine ne
  // coûte rien côté ordre éditorial, on s'en sert pour éviter aussi la répétition
  // entre le jeudi et le lundi suivant — deux publications consécutives dans le
  // temps, c'est là que le lecteur voit la redite. Le 0.5 garde l'ordre
  // chronologique quand les deux orientations se valent.
  if (chosen.length === 2) {
    const penalty = ([mon], flipped) =>
      (mon.cat === prevThursdayCat ? 4 : 0) + (flipped ? 0.5 : 0);
    if (penalty([chosen[1], chosen[0]], true) < penalty(chosen, false)) {
      chosen = [chosen[1], chosen[0]];
    }
  }

  chosen.forEach((a, k) => placement.set(freeDates[k], a));
  rememberWeek(week);
}

const assignments = slots.map((d) => ({ ...placement.get(d), next: d }));

let moved = 0;
for (const a of assignments) if (a.next !== a.date) moved++;

// Contrôle : aucune semaine ne doit répéter une rubrique.
const byWeek = new Map();
for (const a of assignments) {
  const w = isoWeekKey(a.next);
  if (!byWeek.has(w)) byWeek.set(w, []);
  byWeek.get(w).push(a);
}
for (const [w, list] of byWeek) {
  const cats = list.map((a) => a.cat);
  if (new Set(cats).size !== cats.length) {
    console.error(`BUG : collision non résolue en ${w} (${cats.join(", ")}).`);
    process.exit(1);
  }
}

// Info : rubrique identique d'un jeudi au lundi suivant (toléré, hors contrainte).
let crossWeek = 0;
for (let i = 1; i < assignments.length; i++) {
  const sameWeek = isoWeekKey(assignments[i].next) === isoWeekKey(assignments[i - 1].next);
  if (!sameWeek && assignments[i].cat === assignments[i - 1].cat) crossWeek++;
}

console.log(
  `Appairage hebdomadaire : ${assignments.length} articles sur la grille (>= ${FROM}), mêmes dates réutilisées, ${moved} déplacés.\n`,
);
console.log("date         rubrique   article                                   (ancienne date)");
let prevWeek = null;
for (const a of assignments) {
  const w = isoWeekKey(a.next);
  const sep = prevWeek && w !== prevWeek ? "\n" : "";
  prevWeek = w;
  const flag = a.next !== a.date ? " *" : "  ";
  console.log(
    `${sep}${a.next}   ${a.cat.padEnd(9)}  ${a.slug.padEnd(41)} (${a.date})${flag}`,
  );
}
console.log(
  `\nAucune semaine avec deux fois la même rubrique. Enchaînements jeudi → lundi suivant de même rubrique : ${crossWeek}.`,
);

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
