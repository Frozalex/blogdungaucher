#!/usr/bin/env node
/**
 * Contrôle qualité des traductions de la série Psychologie (41 articles).
 * Usage : node drafts/_serie-psychologie/check-traductions.mjs en|pt-br
 *
 * Vérifie, pour chaque article de la série :
 *  1. tirets cadratins de ponctuation (les plages numériques restent autorisées)
 *  2. champs de frontmatter interdits par le schéma de traduction
 *  3. clé de résolution vers la source FR (enSlug/frSlug + nom de fichier)
 *  4. présence des 4 champs SEO
 *  5. parité du nombre d'entrées faq et de titres ## avec le FR
 *  6. liens internes (préfixe de langue, slug FR conservé, cible existante)
 *  7. ratio de volume par rapport au FR (détecte les résumés déguisés)
 *  8. tics d'IA et résidus de français
 */
import { readFileSync, existsSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(fileURLToPath(import.meta.url), "../../..");
const lang = process.argv[2] || "en";
const PLAN = path.join(ROOT, "drafts/_serie-psychologie/PLAN.md");
const CATS = ["esprit", "science", "societe"];

// Les 41 slugs de la série, lus depuis les tableaux par grappe du PLAN.
const serie = [
  ...new Set(
    readFileSync(PLAN, "utf8")
      .split("\n")
      .filter((l) => /^\| [A-J]\d \|/.test(l))
      .map((l) => l.split("|")[2].trim().replace(/`/g, "")),
  ),
].sort();

const AI_TICS = {
  en: ["delve", "it's worth noting", "it is worth noting", "moreover,", "furthermore,",
    "in conclusion", "testament to", "navigate the complexities", "game-changer",
    "unlock the", "landscape of", "in today's world"],
  "pt-br": ["vale ressaltar", "em suma", "é importante notar", "nesse sentido,",
    "cabe destacar", "no mundo de hoje", "em última análise"],
};
const FR_RESIDUE = /\b(c'est-à-dire|d'ailleurs|néanmoins|toutefois|lorsqu'|qu'il|parce que|donc,|ainsi,|cependant)\b/gi;
const FORBIDDEN_FM = ["publishDate", "category", "pillar", "readingTime", "featured", "featuredRank"];

const dir = path.join(ROOT, "src/content/blog-translations", lang);
const byFr = new Map();
for (const f of readdirSync(dir).filter((f) => f.endsWith(".md"))) {
  const raw = readFileSync(path.join(dir, f), "utf8");
  const m = raw.match(/^frSlug:\s*"?([a-z0-9-]+)"?/m);
  byFr.set(m ? m[1] : f.replace(/\.md$/, ""), { file: f, raw });
}
const srcPath = (slug) =>
  CATS.map((c) => path.join(ROOT, "src/content/blog", c, `${slug}.md`)).find(existsSync);

/**
 * Cibles valides pour un lien interne, selon la convention de la langue.
 *
 * EN : les pages sont générées au slug EN mais les liens gardent le slug FR, une
 *      redirection assurant le passage. La cible valide est donc le slug FR.
 * PT-BR : les pages sont générées au slug LOCALISÉ et il n'existe aucune redirection
 *      depuis le slug FR. La cible valide est donc le slug pt-BR, sauf pour un article
 *      sans traduction, dont la page de repli vit au slug FR.
 */
const localSlugs = new Set([...byFr.values()].map((v) => v.file.replace(/\.md$/, "")));
const isValidTarget = (slug) => {
  if (lang !== "pt-br") return Boolean(srcPath(slug));
  if (localSlugs.has(slug)) return true;
  // Slug FR accepté seulement s'il n'a pas de traduction pt-BR (sinon le lien est mort).
  return Boolean(srcPath(slug)) && !byFr.has(slug);
};

const split = (raw) => {
  const m = raw.replace(/^﻿/, "").match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  return m ? { fm: m[1], body: m[2] } : null;
};
const countFaq = (fm) => (fm.match(/^ {2}- question:/gm) || []).length;
const countH2 = (body) => (body.match(/^## /gm) || []).length;
const words = (s) => s.trim().split(/\s+/).filter(Boolean).length;

let missing = [], problems = 0, rows = [];

for (const slug of serie) {
  const entry = byFr.get(slug);
  if (!entry) { missing.push(slug); continue; }
  const fr = split(readFileSync(srcPath(slug), "utf8"));
  const tr = split(entry.raw);
  const errs = [];
  if (!tr) { rows.push({ slug, errs: ["frontmatter illisible"] }); problems++; continue; }

  // 1. tirets. Le cadratin (—) est toujours interdit. Le demi-cadratin (–) est
  //    légitime dans les plages numériques (pp. 89–105, IC 95 % 0,85–0,93) et les
  //    paires de noms (Fischer–Spassky) : ces usages existent dans les sources FR.
  const em = (entry.raw.match(/—/g) || []).length;
  if (em) errs.push(`${em} tiret cadratin (—)`);
  const enPunct = [...entry.raw.matchAll(/.{0,4}–.{0,4}/g)]
    .map((m) => m[0])
    .filter((s) => !/\d\s*–\s*\d/.test(s) && !/\p{Lu}\p{L}*\s*–\s*\p{Lu}/u.test(s));
  if (enPunct.length) errs.push(`${enPunct.length} demi-cadratin ponctuation: ${enPunct.slice(0, 2).map((s) => s.trim()).join(" / ")}`);

  // 2. champs interdits par le schéma translationSchema
  for (const k of FORBIDDEN_FM)
    if (new RegExp(`^${k}:`, "m").test(tr.fm)) errs.push(`champ interdit ${k}`);

  // 3. clé de résolution vers la source FR
  if (lang === "en") {
    if (!/^enSlug:/m.test(tr.fm)) errs.push("enSlug manquant");
    if (entry.file !== `${slug}.md`) errs.push(`nom de fichier != slug FR (${entry.file})`);
  } else {
    if (!/^frSlug:/m.test(tr.fm)) errs.push("frSlug manquant");
    if (entry.file === `${slug}.md`) errs.push("nom de fichier non localisé");
  }

  // 4. champs SEO
  for (const k of ["title", "excerpt", "seoTitle", "seoDescription"])
    if (!new RegExp(`^${k}:`, "m").test(tr.fm)) errs.push(`${k} manquant`);

  // 5. parité de structure avec le FR
  const [fq, ff] = [countFaq(tr.fm), countFaq(fr.fm)];
  if (fq !== ff) errs.push(`faq ${fq}/${ff}`);
  const [h2, hf] = [countH2(tr.body), countH2(fr.body)];
  if (h2 !== hf) errs.push(`h2 ${h2}/${hf}`);

  // 6. liens internes
  const stale = entry.raw.match(/\]\(\/fr\/blog\//g);
  if (stale) errs.push(`${stale.length} lien(s) restés en /fr/`);
  for (const m of entry.raw.matchAll(/\]\(\/([a-z-]+)\/blog\/([a-z0-9-]+)\//g)) {
    if (m[1] !== lang) errs.push(`lien préfixe /${m[1]}/ au lieu de /${lang}/`);
    if (!isValidTarget(m[2])) errs.push(`lien vers slug inexistant: ${m[2]}`);
  }

  // 7. volume (détecte le résumé déguisé)
  const ratio = words(tr.body) / words(fr.body);
  if (ratio < 0.75) errs.push(`corps court (${Math.round(ratio * 100)}% du FR)`);
  if (ratio > 1.4) errs.push(`corps long (${Math.round(ratio * 100)}% du FR)`);

  // 8. tics d'IA et résidus de français.
  //    Match sur frontières de mots : « in conclusions acquired without reasoning »
  //    est un pluriel légitime, pas le tic « In conclusion, ».
  const low = tr.body.toLowerCase();
  const tics = AI_TICS[lang].filter((t) =>
    new RegExp(`\\b${t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`).test(low),
  );
  if (tics.length) errs.push(`tics: ${tics.join(", ")}`);
  const res = (tr.body.match(FR_RESIDUE) || []).length;
  if (res > 2) errs.push(`${res} résidus FR probables`);

  rows.push({ slug, w: words(tr.body), ratio: ratio.toFixed(2), faq: fq, h2, errs });
  if (errs.length) problems++;
}

for (const r of rows)
  console.log(
    `[${r.errs.length ? "FAIL" : " ok "}] ${r.slug.padEnd(42)}${String(r.w).padStart(5)}w r=${r.ratio} faq=${r.faq} h2=${r.h2}` +
    (r.errs.length ? `\n         -> ${r.errs.join(" | ")}` : ""),
  );
if (missing.length) console.log(`\nManquants (${missing.length}) : ${missing.join(", ")}`);
console.log(`\n${lang.toUpperCase()} : ${rows.length}/${serie.length} produits, ${problems} avec anomalie.`);
process.exit(problems ? 1 : 0);
