/**
 * Confronte chaque référence bibliographique des articles FR aux métadonnées
 * Crossref.
 *
 * Motivation : `echecs-et-vision-spatiale` citait une méta-analyse
 * « Tejada-Gallardo et al. (2021), Educational Psychology Review » qui existe,
 * mais porte sur les interventions de psychologie positive et le bien-être des
 * adolescents, dans une tout autre revue. Tout ce qui en était tiré était
 * inventé. Ce genre d'erreur ne se voit pas à la relecture : il faut comparer
 * la référence au registre.
 *
 * Le script ne tranche pas. Il rapporte, pour chaque entrée, ce que Crossref
 * renvoie de plus proche, et signale les écarts de titre, d'année, de revue et
 * de premier auteur. La décision reste humaine : un titre qui correspond mais
 * une revue qui diverge est exactement le profil du cas ci-dessus.
 *
 * Usage :
 *   node scripts/audit-references-crossref.mjs            # tout le périmètre
 *   node scripts/audit-references-crossref.mjs --file <chemin>
 *   node scripts/audit-references-crossref.mjs --json rapport.json
 */

import { readFile, writeFile } from "node:fs/promises";
import { glob } from "node:fs/promises";

const CONTENT_GLOBS = [
  "src/content/blog/science/*.md",
  "src/content/blog/esprit/*.md",
  "src/content/blog/grand-oral/*.md",
  "src/content/dissertations/*.md",
];

/** Crossref demande un contact pour le « polite pool » : requêtes plus stables. */
const MAILTO = "contact@blogdungaucher.com";
const DELAY_MS = 350;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function sectionsOfInterest(body) {
  // Les entrées bibliographiques vivent sous un H2/H3 « Sources » ou
  // « Sources et références ». « Pour aller plus loin » est exclu : ce sont des
  // liens internes au blog, pas des références.
  const out = [];
  const re = /^#{2,3}[ \t]+(.+)$/gm;
  const heads = [...body.matchAll(re)];
  for (let i = 0; i < heads.length; i++) {
    const title = heads[i][1].trim();
    if (!/^sources?\b|^sources et référence|^références/i.test(title)) continue;
    const start = heads[i].index + heads[i][0].length;
    const end = i + 1 < heads.length ? heads[i + 1].index : body.length;
    out.push(body.slice(start, end));
  }
  return out;
}

/** Nettoie le markdown d'une ligne : gras, italiques, liens. */
function plain(line) {
  return line
    .replace(/\[([^\]]+)\]\((?:[^()]|\([^()]*\))*\)/g, "$1")
    .replace(/\*\*|\*|_/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function parseEntry(raw) {
  const text = plain(raw.replace(/^[-*]\s+/, ""));
  if (text.length < 25) return null;

  const yearMatch = text.match(/\((\d{4})[a-z]?\)/);
  const year = yearMatch ? Number(yearMatch[1]) : null;

  // Auteurs : tout ce qui précède l'année entre parenthèses.
  const authorsPart = yearMatch ? text.slice(0, yearMatch.index) : "";
  const firstAuthor =
    authorsPart
      .split(/,|&| et /)[0]
      .replace(/[^\p{L}' -]/gu, "")
      .trim() || null;

  // Titre : entre l'année et le point suivant un peu long.
  let title = null;
  if (yearMatch) {
    const after = text.slice(yearMatch.index + yearMatch[0].length).replace(/^[.\s:]+/, "");
    const m = after.match(/^(.+?)\.\s/);
    title = (m ? m[1] : after).trim();
    // Les titres coupés sur une abréviation ("al.", "Vol.") restent trop courts.
    if (title.length < 12) title = after.split(/\.\s/).slice(0, 2).join(". ").trim();
  }

  // La revue suit le titre. On s'arrête au volume ou à la pagination.
  let journal = null;
  if (yearMatch) {
    const after = text.slice(yearMatch.index + yearMatch[0].length).replace(/^[.\s:]+/, "");
    const rest = after.slice(title.length).replace(/^[.\s,]+/, "");
    const m = rest.match(/^(.{4,90}?)(?=,\s*\d|\.\s|\s*\(|\s+DOI|$)/s);
    if (m) journal = m[1].trim();
  }

  if (!title || title.length < 12) return null;
  return { text, year, firstAuthor, title, journal };
}

function norm(s) {
  return (s ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9 ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Similarité par trigrammes : robuste aux variantes de ponctuation et sous-titres. */
function similarity(a, b) {
  const grams = (s) => {
    const t = ` ${norm(s)} `;
    const g = new Set();
    for (let i = 0; i < t.length - 2; i++) g.add(t.slice(i, i + 3));
    return g;
  };
  const ga = grams(a);
  const gb = grams(b);
  if (ga.size === 0 || gb.size === 0) return 0;
  let inter = 0;
  for (const g of ga) if (gb.has(g)) inter += 1;
  return (2 * inter) / (ga.size + gb.size);
}

/** Sigle d'un titre de revue : « Proceedings of the National Academy of Sciences » → « pnas ». */
function acronym(s) {
  return norm(s)
    .split(" ")
    .filter((w) => !["of", "the", "and", "for", "in", "on", "de", "la", "le", "des"].includes(w))
    .map((w) => w[0])
    .join("");
}

/**
 * Deux noms de revue désignent-ils la même publication ? Les bibliographies
 * abrègent (« PNAS », « Philosophical Magazine ») là où Crossref donne le titre
 * complet. On accepte la similarité, l'inclusion et le sigle.
 */
function sameJournal(cited, registry) {
  const a = norm(cited);
  const b = norm(registry);
  if (!a || !b) return true;
  if (similarity(a, b) >= 0.5) return true;
  if (a.includes(b) || b.includes(a)) return true;
  if (a.replace(/ /g, "") === acronym(b) || b.replace(/ /g, "") === acronym(a)) return true;
  return false;
}

/**
 * Crossref indexe mal les livres. Une entrée sans pagination ni volume, close
 * par un nom d'éditeur, est un ouvrage : la contrôler ici ne produirait que du
 * bruit (« Mindset » de Dweck ressort via une encyclopédie qui le cite).
 */
function looksLikeBook(text) {
  if (/,\s*\d+\s*[–-]\s*\d+\s*\.?\s*$|,\s*\d+\s*[–-]\s*\d+\s*[.;]/.test(text)) return false; // pagination d'article
  if (/\b\d+\s*\(\d+\)/.test(text)) return false; // revue, volume(numéro)
  if (/\bdoi\b|10\.\d{4,}/i.test(text)) return false; // un DOI cité = article
  // Sans pagination, sans volume et sans DOI : c'est un ouvrage. Crossref n'en
  // indexe que les comptes rendus, qui ressortent alors comme de fausses
  // divergences de revue (« Flow » de Csikszentmihalyi renvoyé via Design Issues).
  return true;
}

async function queryCrossref(entry) {
  const url = new URL("https://api.crossref.org/works");
  // La citation complète (auteurs + année + titre + revue) donne des
  // correspondances nettement meilleures que le titre seul : c'est le mode
  // pour lequel `query.bibliographic` est conçu.
  url.searchParams.set("query.bibliographic", entry.text);
  url.searchParams.set("rows", "5");
  url.searchParams.set("mailto", MAILTO);

  const res = await fetch(url, { headers: { "User-Agent": `blog-gaucher-ref-audit (mailto:${MAILTO})` } });
  if (!res.ok) return { error: `HTTP ${res.status}` };
  const data = await res.json();
  const items = data?.message?.items ?? [];
  if (items.length === 0) return { error: "aucun résultat" };

  // On classe sur l'ensemble des signaux, pas sur le seul titre : une
  // correspondance de titre parfaite dans la mauvaise année et sous un autre
  // auteur est généralement un ouvrage tiers qui cite la référence.
  let best = null;
  for (const it of items) {
    const t = Array.isArray(it.title) ? it.title[0] : it.title;
    const titleScore = similarity(entry.title, t ?? "");
    const year = it.issued?.["date-parts"]?.[0]?.[0] ?? null;
    const authors = (it.author ?? []).map((a) => a.family).filter(Boolean);

    let score = titleScore;
    if (entry.year && year && Math.abs(entry.year - year) <= 1) score += 0.35;
    if (entry.firstAuthor && authors.some((a) => norm(a) === norm(entry.firstAuthor))) score += 0.35;

    if (!best || score > best.score) best = { score, titleScore, item: it, title: t };
  }
  return best;
}

function describe(entry, best) {
  const it = best.item;
  const journal = Array.isArray(it["container-title"]) ? it["container-title"][0] : it["container-title"];
  const year = it.issued?.["date-parts"]?.[0]?.[0] ?? null;
  const authors = (it.author ?? []).map((a) => a.family).filter(Boolean);

  const yearOk = entry.year && year ? Math.abs(entry.year - year) <= 1 : false;
  const authorOk =
    entry.firstAuthor && authors.length > 0
      ? authors.some((a) => norm(a) === norm(entry.firstAuthor))
      : false;

  const flags = [];
  // Crossref tronque parfois le titre d'un chapitre ("Self-Distancing" pour
  // "Self-distancing: Theory, research, and current directions"). Année ET
  // premier auteur concordants suffisent alors à identifier l'entrée.
  if (best.titleScore < 0.55 && !(yearOk && authorOk)) flags.push("TITRE");
  if (entry.year && year && !yearOk) flags.push(`ANNÉE(citée ${entry.year} / registre ${year})`);
  if (entry.firstAuthor && authors.length > 0 && !authorOk) {
    flags.push(`AUTEUR(cité ${entry.firstAuthor} / registre ${authors[0]})`);
  }
  // Signal décisif. Une référence dont le titre, l'année et les auteurs
  // concordent mais dont la revue diverge a généralement été rattachée au
  // mauvais article : c'est le profil exact du cas Tejada-Gallardo.
  if (entry.journal && journal && !sameJournal(entry.journal, journal)) {
    flags.push(`REVUE(citée « ${entry.journal} » / registre « ${journal} »)`);
  }
  return { journal, year, authors, flags, doi: it.DOI, title: best.title };
}

const args = process.argv.slice(2);
const onlyFile = args.includes("--file") ? args[args.indexOf("--file") + 1] : null;
const jsonOut = args.includes("--json") ? args[args.indexOf("--json") + 1] : null;

const files = [];
if (onlyFile) files.push(onlyFile);
else for (const g of CONTENT_GLOBS) for await (const f of glob(g)) files.push(f);
files.sort();

const report = [];
let total = 0;
let flagged = 0;
let books = 0;

for (const file of files) {
  const raw = await readFile(file, "utf8");
  const body = raw.startsWith("---") ? raw.slice(raw.indexOf("\n---", 3) + 4) : raw;

  const entries = [];
  for (const section of sectionsOfInterest(body)) {
    for (const line of section.split("\n")) {
      if (!/^[-*]\s+/.test(line.trim())) continue;
      const e = parseEntry(line.trim());
      if (e) entries.push(e);
    }
  }
  if (entries.length === 0) continue;

  for (const entry of entries) {
    if (looksLikeBook(entry.text)) {
      books += 1;
      continue;
    }
    total += 1;
    let best;
    try {
      best = await queryCrossref(entry);
    } catch (err) {
      best = { error: String(err) };
    }
    await sleep(DELAY_MS);

    if (best.error) {
      flagged += 1;
      report.push({ file, cite: entry.text, status: "INTROUVABLE", detail: best.error });
      console.log(`\n[INTROUVABLE] ${file}\n  cité : ${entry.text.slice(0, 150)}\n  → ${best.error}`);
      continue;
    }

    const d = describe(entry, best);
    if (d.flags.length === 0) continue;
    flagged += 1;
    report.push({ file, cite: entry.text, status: d.flags.join(" + "), found: d });
    console.log(
      `\n[${d.flags.join(" + ")}] ${file}` +
        `\n  cité    : ${entry.text.slice(0, 160)}` +
        `\n  registre: ${d.title}` +
        `\n            ${d.journal ?? "?"} (${d.year ?? "?"}) — ${d.doi}` +
        `\n            similarité titre ${best.titleScore.toFixed(2)}`,
    );
  }
}

console.log(`\n────────\n${total} référence(s) contrôlée(s) sur Crossref, ${flagged} à relire. ${books} ouvrage(s) ignoré(s) (hors périmètre Crossref).`);
if (jsonOut) {
  await writeFile(jsonOut, JSON.stringify(report, null, 2), "utf8");
  console.log(`Rapport JSON : ${jsonOut}`);
}
