#!/usr/bin/env node
// Audit SerpMantics de tous les articles déjà publiés (publishDate <= today).
// Usage : node scripts/serpmantics-audit-all.mjs
// Sortie : scripts/serpmantics-audit-report.json + résumé console.

import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createGuide, scoreContent, waitForGuideReady, getGuide } from './serpmantics.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const BLOG_DIR = resolve(__dirname, '..', 'src', 'content', 'blog');
const OUT = resolve(__dirname, 'serpmantics-audit-report.json');
const TODAY = new Date().toISOString().slice(0, 10);

function parseFrontmatter(raw) {
  const clean = raw.replace(/^﻿/, '').replace(/\r\n/g, '\n');
  const m = clean.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) return { fm: {}, body: clean };
  const fm = {};
  for (const line of m[1].split('\n')) {
    const km = line.match(/^([a-zA-Z]+):\s*(.*)$/);
    if (km) fm[km[1]] = km[2].replace(/^["']|["']$/g, '').trim();
  }
  return { fm, body: m[2] };
}

function deriveQuery(slug, fm) {
  // Préférer seoTitle avant ":" si dispo, sinon dériver du slug.
  if (fm.seoTitle) {
    const before = fm.seoTitle.split(/\s*:\s*/)[0].trim();
    if (before && before.length < 80) return before;
  }
  return slug.replace(/-/g, ' ').replace(/\bl /g, "l'").replace(/\bd /g, "d'");
}

const files = readdirSync(BLOG_DIR).filter((f) => f.endsWith('.md'));
const published = [];
for (const f of files) {
  const raw = readFileSync(join(BLOG_DIR, f), 'utf8');
  const { fm, body } = parseFrontmatter(raw);
  if (!fm.publishDate || fm.publishDate > TODAY) continue;
  if (fm.draft === 'true') continue;
  const slug = f.replace(/\.md$/, '');
  published.push({ slug, file: f, fm, body, query: deriveQuery(slug, fm) });
}
published.sort((a, b) => a.fm.publishDate.localeCompare(b.fm.publishDate));

console.log(`📋 ${published.length} articles publiés à auditer (today=${TODAY})\n`);

const results = [];
let i = 0;
for (const art of published) {
  i++;
  const tag = `[${i}/${published.length}] ${art.slug}`;
  try {
    process.stdout.write(`${tag}\n  query="${art.query}" → creating guide…`);
    const guide = await createGuide(art.query, 'fr');
    process.stdout.write(` ok (${guide.id})\n  waiting ready…`);
    await waitForGuideReady(guide.id);
    process.stdout.write(` ready\n  scoring…`);
    const r = await scoreContent(guide.id, art.body);
    const a = r.contentAnalysis || {};
    const score = a.score ?? null;
    const struct = a.structure || {};
    const expr = a.expressions || {};
    const exprList = Object.entries(expr).sort((x, y) => y[1] - x[1]);
    const missing = exprList.filter(([, v]) => v === 0).map(([k]) => k);
    process.stdout.write(` score=${score}\n`);
    results.push({
      slug: art.slug,
      publishDate: art.fm.publishDate,
      query: art.query,
      guideId: guide.id,
      score,
      length: struct.length,
      headings: struct.headings,
      paragraphs: struct.paragraphs,
      missingExpressionsCount: missing.length,
      totalExpressions: exprList.length,
      missingExpressions: missing.slice(0, 30),
    });
  } catch (e) {
    console.log(`  ❌ ${e.message}`);
    results.push({ slug: art.slug, publishDate: art.fm.publishDate, query: art.query, error: e.message });
  }
}

results.sort((a, b) => (a.score ?? -1) - (b.score ?? -1));
writeFileSync(OUT, JSON.stringify(results, null, 2));

console.log(`\n=== Résumé (trié du moins bon au meilleur score) ===\n`);
console.log('score | missing | slug | query');
console.log('------|---------|------|------');
for (const r of results) {
  if (r.error) {
    console.log(`  ❌  |    -    | ${r.slug} | ${r.query}  (${r.error})`);
  } else {
    const m = `${r.missingExpressionsCount}/${r.totalExpressions}`;
    console.log(`  ${String(r.score).padStart(3)} | ${m.padStart(7)} | ${r.slug} | ${r.query}`);
  }
}
console.log(`\n📄 Rapport complet : ${OUT}`);
