#!/usr/bin/env node
/**
 * Réécrit les liens internes des traductions pt-BR vers le slug LOCALISÉ.
 *
 * POURQUOI : les pages pt-BR sont générées au slug localisé
 * (cf. getStaticPaths de src/pages/pt-br/blog/[slug].astro, via getPtBrSlugMap),
 * et il n'existe AUCUNE redirection depuis le slug FR, contrairement à l'anglais
 * (scripts/en-redirects.mjs). Un lien `/pt-br/blog/<slug-fr>/` est donc une 404 sèche.
 *
 * Le script ne touche qu'aux cibles ayant réellement une traduction pt-BR. Une cible
 * sans traduction est laissée au slug FR : c'est correct, la page de repli est alors
 * générée à ce slug.
 *
 * Usage :
 *   node scripts/fix-ptbr-internal-links.mjs --dry-run
 *   node scripts/fix-ptbr-internal-links.mjs
 */
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { dirname, join, resolve, basename } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PT_DIR = resolve(__dirname, "../src/content/blog-translations/pt-br");
const DRY = process.argv.includes("--dry-run");

/** @returns {Map<string,string>} frSlug -> ptBrSlug */
function ptBrSlugMap() {
  const map = new Map();
  for (const file of readdirSync(PT_DIR)) {
    if (!file.endsWith(".md")) continue;
    const raw = readFileSync(join(PT_DIR, file), "utf8").replace(/^﻿/, "");
    const fm = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    if (!fm) continue;
    const fr = fm[1].match(/^frSlug:\s*["']?([a-z0-9-]+)["']?/m);
    if (fr) map.set(fr[1], basename(file, ".md"));
  }
  return map;
}

const map = ptBrSlugMap();
/** Slugs pt-BR déjà localisés : une cible qui en fait partie est correcte telle quelle. */
const localSlugs = new Set(map.values());
const rewritten = new Map();
const skipped = new Map();
let files = 0;
let total = 0;

for (const file of readdirSync(PT_DIR).filter((f) => f.endsWith(".md")).sort()) {
  const path = join(PT_DIR, file);
  const raw = readFileSync(path, "utf8");
  let n = 0;
  // Deux syntaxes coexistent : lien markdown et `<a href>` HTML des encadrés traduits.
  const swap = (whole, target, build) => {
    const local = map.get(target);
    if (!local) {
      // Une cible déjà localisée n'est pas un problème : on ne signale que les slugs FR
      // pour lesquels aucune traduction pt-BR n'existe (page de repli au slug FR).
      if (!localSlugs.has(target)) skipped.set(target, (skipped.get(target) ?? 0) + 1);
      return whole;
    }
    if (local === target) return whole;
    n += 1;
    rewritten.set(`${target} -> ${local}`, (rewritten.get(`${target} -> ${local}`) ?? 0) + 1);
    return build(local);
  };
  const next = raw
    .replace(/\]\(\/pt-br\/blog\/([a-z0-9-]+)\/\)/g, (w, t) => swap(w, t, (l) => `](/pt-br/blog/${l}/)`))
    .replace(/href="\/pt-br\/blog\/([a-z0-9-]+)\/"/g, (w, t) => swap(w, t, (l) => `href="/pt-br/blog/${l}/"`));
  if (n) {
    files += 1;
    total += n;
    if (!DRY) writeFileSync(path, next, "utf8");
  }
}

console.log(`${DRY ? "[dry-run] " : ""}${total} lien(s) réécrit(s) dans ${files} fichier(s).`);
for (const [k, v] of [...rewritten].sort().slice(0, 12)) console.log(`   ${k}  (${v}x)`);
if (rewritten.size > 12) console.log(`   ... +${rewritten.size - 12} autres`);
if (skipped.size) {
  console.log(`\nLaissés au slug FR (aucune traduction pt-BR, page de repli à ce slug) :`);
  for (const [k, v] of [...skipped].sort()) console.log(`   ${k} (${v}x)`);
}
