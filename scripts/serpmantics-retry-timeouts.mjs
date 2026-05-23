#!/usr/bin/env node
// Relance le score sur les articles dont le 1er audit a timeout.
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { getGuide, scoreContent, waitForGuideReady } from './serpmantics.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const BLOG_DIR = resolve(__dirname, '..', 'src', 'content', 'blog');
const REPORT = resolve(__dirname, 'serpmantics-audit-report.json');
const data = JSON.parse(readFileSync(REPORT, 'utf8'));
const toRetry = data.filter((d) => d.error);

function parseFrontmatter(raw) {
  const clean = raw.replace(/^﻿/, '').replace(/\r\n/g, '\n');
  const m = clean.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  return m ? { body: m[2] } : { body: clean };
}

console.log(`🔁 Retry ${toRetry.length} articles\n`);
for (const d of toRetry) {
  const body = parseFrontmatter(readFileSync(join(BLOG_DIR, d.slug + '.md'), 'utf8')).body;
  // Récupère le guideId depuis l'erreur "Guide XXX pas prêt"
  const guideIdMatch = d.error.match(/Guide ([a-f0-9]{24})/);
  if (!guideIdMatch) { console.log(`  ❌ ${d.slug}: pas de guideId`); continue; }
  const guideId = guideIdMatch[1];
  try {
    process.stdout.write(`  ${d.slug} → wait…`);
    await waitForGuideReady(guideId, 600);
    process.stdout.write(` ready, score…`);
    const r = await scoreContent(guideId, body);
    const a = r.contentAnalysis || {};
    const exprList = Object.entries(a.expressions || {});
    const out = data.find((x) => x.slug === d.slug);
    delete out.error;
    Object.assign(out, {
      guideId,
      score: a.score ?? null,
      length: a.structure?.length,
      headings: a.structure?.headings,
      paragraphs: a.structure?.paragraphs,
      missingExpressionsCount: exprList.filter(([, v]) => v === 0).length,
      totalExpressions: exprList.length,
    });
    process.stdout.write(` score=${out.score}\n`);
  } catch (e) {
    console.log(` ❌ ${e.message}`);
  }
}
writeFileSync(REPORT, JSON.stringify(data, null, 2));
console.log('\n📄 Rapport mis à jour.');
