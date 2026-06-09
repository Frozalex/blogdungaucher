#!/usr/bin/env node
/**
 * Désactive les liens internes ACTIFS qui pointent vers un article non
 * encore publié à la date du jour. Transforme `[texte](/fr/blog/slug/)`
 * en `texte` quand la source est publiée (≤ today) et la cible est future.
 *
 * - Dry-run par défaut.
 * - --apply pour écrire.
 *
 * Usage : node scripts/internal-linking-fix-active.mjs [--apply]
 */

import { readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join, basename } from "node:path";

const BLOG_DIR = "src/content/blog";
const APPLY = process.argv.includes("--apply");
const today = new Date(new Date().toISOString().slice(0, 10) + "T00:00:00Z");

function walkBlog(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    const s = statSync(p);
    if (s.isDirectory()) out.push(...walkBlog(p));
    else if (entry.endsWith(".md")) out.push(p);
  }
  return out;
}

function parseDate(raw) {
  const m = raw.match(/^[﻿]?---\s*\n([\s\S]*?)\n---/);
  if (!m) return null;
  const d = m[1].match(/publishDate:\s*"?(\d{4}-\d{2}-\d{2})/);
  return d ? new Date(d[1]) : null;
}

const paths = walkBlog(BLOG_DIR);
const dateBySlug = new Map();
for (const path of paths) {
  const slug = basename(path).replace(/\.md$/, "");
  dateBySlug.set(slug, parseDate(readFileSync(path, "utf8")));
}

let totalFixed = 0;
for (const path of paths) {
  const slug = basename(path).replace(/\.md$/, "");
  const sourceDate = dateBySlug.get(slug);
  if (!sourceDate || sourceDate > today) continue; // source future : pas urgent

  const raw = readFileSync(path, "utf8");
  let newRaw = raw;
  const fixes = [];

  newRaw = newRaw.replace(
    /\[([^\]]+)\]\(\/fr\/blog\/([a-z0-9-]+)\/\)/g,
    (match, text, target) => {
      const tDate = dateBySlug.get(target);
      if (!tDate || tDate <= today) return match;
      fixes.push({ text, target, targetDate: tDate.toISOString().slice(0, 10) });
      return text;
    }
  );

  if (newRaw === raw) continue;

  console.log(`${path}`);
  for (const f of fixes) {
    console.log(`  démarque : "${f.text}" → ${f.target} (futur ${f.targetDate})`);
  }
  console.log("");

  if (APPLY) {
    writeFileSync(path, newRaw);
    totalFixed += fixes.length;
  } else {
    totalFixed += fixes.length;
  }
}

console.log(`${totalFixed} liens démarqués${APPLY ? " (écrits)" : " (dry-run)"}.`);
if (!APPLY) console.log("Relance avec --apply pour écrire.");
