#!/usr/bin/env node
/**
 * Détecte les liens internes qui pointent depuis un article vers un autre
 * article publié APRÈS lui (donc inexistant au moment où la source est
 * publiée). Liste source → cible avec les dates.
 *
 * Usage : node scripts/internal-linking-detect-future.mjs
 */

import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, basename } from "node:path";

const BLOG_DIR = "src/content/blog";

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

function extractInternalLinks(body) {
  const links = new Set();
  const re = /\]\(\/fr\/blog\/([a-z0-9-]+)\//gi;
  let m;
  while ((m = re.exec(body)) !== null) links.add(m[1]);
  return links;
}

const paths = walkBlog(BLOG_DIR);
const dateBySlug = new Map();
const linksBySlug = new Map();
const pathBySlug = new Map();
for (const path of paths) {
  const slug = basename(path).replace(/\.md$/, "");
  const raw = readFileSync(path, "utf8");
  dateBySlug.set(slug, parseDate(raw));
  linksBySlug.set(slug, extractInternalLinks(raw));
  pathBySlug.set(slug, path);
}

const violations = [];
for (const [sourceSlug, links] of linksBySlug) {
  const sourceDate = dateBySlug.get(sourceSlug);
  if (!sourceDate) continue;
  for (const targetSlug of links) {
    const targetDate = dateBySlug.get(targetSlug);
    if (!targetDate) continue;
    if (targetDate > sourceDate) {
      violations.push({
        from: sourceSlug,
        fromDate: sourceDate.toISOString().slice(0, 10),
        to: targetSlug,
        toDate: targetDate.toISOString().slice(0, 10),
        path: pathBySlug.get(sourceSlug),
      });
    }
  }
}

const today = new Date(new Date().toISOString().slice(0, 10) + "T00:00:00Z");
const active = violations.filter(
  (v) => dateBySlug.get(v.from) <= today && dateBySlug.get(v.to) > today
);
const latent = violations.filter(
  (v) => !(dateBySlug.get(v.from) <= today && dateBySlug.get(v.to) > today)
);

console.log(`${violations.length} violations totales (${active.length} ACTIVES en prod, ${latent.length} latentes).\n`);

if (active.length) {
  console.log("=== ACTIVES — liens 404 en production aujourd'hui ===\n");
  const byPath = new Map();
  for (const v of active) {
    if (!byPath.has(v.path)) byPath.set(v.path, []);
    byPath.get(v.path).push(v);
  }
  for (const [path, vs] of byPath) {
    console.log(`${path}  (publié ${vs[0].fromDate})`);
    for (const v of vs) {
      console.log(`  → ${v.to}  (publication prévue ${v.toDate})`);
    }
    console.log("");
  }
}

if (latent.length) {
  console.log(`=== LATENTES — ${latent.length} liens entre articles futurs à corriger avant publication ===\n`);
  const byPath = new Map();
  for (const v of latent) {
    if (!byPath.has(v.path)) byPath.set(v.path, []);
    byPath.get(v.path).push(v);
  }
  for (const [path, vs] of byPath) {
    console.log(`${path}  (publié ${vs[0].fromDate})`);
    for (const v of vs) {
      console.log(`  → ${v.to}  (publié ${v.toDate})`);
    }
    console.log("");
  }
}
