#!/usr/bin/env node
/**
 * Corrige les liens internes écrits `](/blog/<slug>/)` sans préfixe de langue,
 * dans les articles FR (`src/content/blog/`), en `](/fr/blog/<slug>/)`.
 *
 * POURQUOI : le site est entièrement préfixé par la langue (`trailingSlash: "always"`,
 * routes `/fr/…`, `/en/…`, `/pt-br/…`). Une URL `/blog/<slug>/` ne correspond à aucune
 * page générée : c'est une 404 sèche. La plupart de ces liens passaient inaperçus parce
 * qu'ils vivent dans des articles dont la `publishDate` est future, donc non construits.
 * Ils deviendraient morts au fil des publications.
 *
 * Usage :
 *   node scripts/fix-unprefixed-blog-links.mjs --dry-run
 *   node scripts/fix-unprefixed-blog-links.mjs
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const BLOG_DIR = resolve(__dirname, "../src/content/blog");
const DRY = process.argv.includes("--dry-run");

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) out.push(...walk(p));
    else if (entry.endsWith(".md")) out.push(p);
  }
  return out;
}

let files = 0;
let total = 0;
const targets = new Map();

for (const path of walk(BLOG_DIR).sort()) {
  const raw = readFileSync(path, "utf8");
  let n = 0;
  // Deux syntaxes coexistent dans les articles : le lien markdown, et le `<a href>` HTML
  // des encadrés. Ne traiter que le markdown laissait passer les seconds silencieusement.
  const next = raw
    .replace(/\]\(\/blog\/([a-z0-9-]+)\/\)/g, (_whole, slug) => {
      n += 1;
      targets.set(slug, (targets.get(slug) ?? 0) + 1);
      return `](/fr/blog/${slug}/)`;
    })
    .replace(/href="\/blog\/([a-z0-9-]+)\/"/g, (_whole, slug) => {
      n += 1;
      targets.set(slug, (targets.get(slug) ?? 0) + 1);
      return `href="/fr/blog/${slug}/"`;
    });
  if (n) {
    files += 1;
    total += n;
    if (!DRY) writeFileSync(path, next, "utf8");
  }
}

console.log(`${DRY ? "[dry-run] " : ""}${total} lien(s) préfixé(s) en /fr/blog/ dans ${files} fichier(s).`);
for (const [slug, n] of [...targets].sort().slice(0, 15)) console.log(`   ${slug} (${n}x)`);
if (targets.size > 15) console.log(`   ... +${targets.size - 15} autres cibles`);
