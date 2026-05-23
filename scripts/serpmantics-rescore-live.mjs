#!/usr/bin/env node
// Re-score chaque article en lui envoyant le HTML rendu en prod (pas le markdown brut).
// On extrait uniquement le contenu de <article class="article-page">.
// Met à jour scripts/serpmantics-audit-report.json.

import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as cheerio from 'cheerio';
import { scoreContent } from './serpmantics.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPORT = resolve(__dirname, 'serpmantics-audit-report.json');
const BASE = 'https://blogdungaucher.com/fr/blog/';

const data = JSON.parse(readFileSync(REPORT, 'utf8'));
const items = data.filter((d) => d.guideId);

console.log(`🌐 Re-scoring ${items.length} articles depuis prod\n`);

async function fetchArticleHtml(slug) {
  const res = await fetch(BASE + slug + '/');
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const html = await res.text();
  const $ = cheerio.load(html);
  const $art = $('article.article-page').first();
  if (!$art.length) throw new Error('article.article-page introuvable');
  // Retire les sections "articles liés" / "related posts" si présentes
  $art.find('aside, .related-posts, [data-related]').remove();
  return $.html($art);
}

let i = 0;
for (const item of items) {
  i++;
  const tag = `[${i}/${items.length}] ${item.slug}`;
  try {
    process.stdout.write(`${tag} fetch…`);
    const html = await fetchArticleHtml(item.slug);
    process.stdout.write(` ${html.length}b → score…`);
    const r = await scoreContent(item.guideId, html);
    const a = r.contentAnalysis || {};
    const exprList = Object.entries(a.expressions || {});
    item.scoreLive = a.score ?? null;
    item.lengthLive = a.structure?.length;
    item.headingsLive = a.structure?.headings;
    item.paragraphsLive = a.structure?.paragraphs;
    item.totalExpressionsLive = exprList.length;
    process.stdout.write(` ${item.scoreLive} (h=${item.headingsLive}, p=${item.paragraphsLive})\n`);
  } catch (e) {
    item.liveError = e.message;
    process.stdout.write(` ❌ ${e.message}\n`);
  }
}

writeFileSync(REPORT, JSON.stringify(data, null, 2));

console.log(`\n=== Comparaison MD vs LIVE (trié par scoreLive) ===\n`);
const sorted = data.filter((d) => d.scoreLive != null).sort((a, b) => a.scoreLive - b.scoreLive);
console.log('LIVE | MD  | Δ    | slug');
console.log('-----|-----|------|-----');
for (const r of sorted) {
  const delta = r.score != null ? r.scoreLive - r.score : 'N/A';
  const d = typeof delta === 'number' ? (delta >= 0 ? `+${delta}` : `${delta}`) : delta;
  console.log(`${String(r.scoreLive).padStart(4)} | ${String(r.score ?? '-').padStart(3)} | ${String(d).padStart(4)} | ${r.slug}`);
}
console.log(`\n📄 Rapport mis à jour.`);
