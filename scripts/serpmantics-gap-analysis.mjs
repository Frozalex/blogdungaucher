#!/usr/bin/env node
// Analyse de gap pour les articles à faible score (< minScore).
// Compare le contenu actuel vs les cibles SerpMantics (expressions + structure).
// Usage : node scripts/serpmantics-gap-analysis.mjs [minScore=50]
// Sortie : scripts/serpmantics-gap-analysis.md + .json

import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as cheerio from 'cheerio';
import { getGuide, scoreContent } from './serpmantics.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPORT = resolve(__dirname, 'serpmantics-audit-report.json');
const OUT_MD = resolve(__dirname, 'serpmantics-gap-analysis.md');
const OUT_JSON = resolve(__dirname, 'serpmantics-gap-analysis.json');
const BASE = 'https://blogdungaucher.com/fr/blog/';
const minScore = Number(process.argv[2] || 50);

async function fetchArticleHtml(slug) {
  const res = await fetch(BASE + slug + '/');
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const $ = cheerio.load(await res.text());
  const $art = $('article.article-page').first();
  $art.find('aside, .related-posts, [data-related]').remove();
  return $.html($art);
}

const audit = JSON.parse(readFileSync(REPORT, 'utf8'));
const targets = audit.filter((d) => d.scoreLive != null && d.scoreLive < minScore).sort((a, b) => a.scoreLive - b.scoreLive);
console.log(`📊 Gap analysis sur ${targets.length} articles (score < ${minScore})\n`);

const gaps = [];
for (const a of targets) {
  console.log(`→ ${a.slug} (scoreLive=${a.scoreLive})`);
  const body = await fetchArticleHtml(a.slug);
  const g = await getGuide(a.guideId);
  const r = await scoreContent(a.guideId, body);
  const guideStruct = g.guide?.guide?.structure || {};
  const targetsExpr = g.guide?.guide?.add || [];
  const currentExpr = r.contentAnalysis?.expressions || {};
  const curStruct = r.contentAnalysis?.structure || {};

  // Per-expression gap
  const exprGaps = targetsExpr.map((t) => {
    const cur = currentExpr[t.expression] || 0;
    let status, deficit = 0;
    if (cur < t.from) { status = 'under'; deficit = t.from - cur; }
    else if (cur > t.to) { status = 'over'; deficit = cur - t.to; }
    else status = 'ok';
    return { expression: t.expression, current: cur, from: t.from, to: t.to, status, deficit };
  }).sort((x, y) => y.deficit - x.deficit);

  // Structure gap
  const structKeys = ['length', 'headings', 'paragraphs', 'links', 'linksInternal', 'linksExternal', 'images', 'lists', 'tables', 'videos'];
  const structGaps = structKeys.map((k) => {
    const cur = curStruct[k] ?? 0;
    const t = guideStruct[k] || {};
    let status, deficit = 0;
    if (t.from == null) status = 'n/a';
    else if (cur < t.from) { status = 'under'; deficit = t.from - cur; }
    else if (cur > t.to) { status = 'over'; deficit = cur - t.to; }
    else status = 'ok';
    return { key: k, current: cur, from: t.from, to: t.to, status, deficit };
  });

  gaps.push({ slug: a.slug, query: a.query, score: a.scoreLive, exprGaps, structGaps });
}

writeFileSync(OUT_JSON, JSON.stringify(gaps, null, 2));

// Markdown report
let md = `# Gap analysis SerpMantics — articles score < ${minScore}\n\nObjectif : passer chaque article > 70.\n\n`;
for (const g of gaps) {
  md += `\n---\n\n## ${g.slug}\n**Query :** ${g.query} · **Score actuel :** ${g.score}\n\n`;

  md += `### Structure\n\n| Élément | Actuel | Cible (min–max) | Statut |\n|---|---:|---|---|\n`;
  for (const s of g.structGaps) {
    if (s.status === 'n/a') continue;
    const icon = s.status === 'under' ? `🔻 -${s.deficit}` : s.status === 'over' ? `🔺 +${s.deficit}` : '✅';
    md += `| ${s.key} | ${s.current} | ${s.from}–${s.to} | ${icon} |\n`;
  }

  const under = g.exprGaps.filter((e) => e.status === 'under');
  const over = g.exprGaps.filter((e) => e.status === 'over');
  const okCount = g.exprGaps.filter((e) => e.status === 'ok').length;

  md += `\n### Expressions (${okCount}/${g.exprGaps.length} OK)\n\n`;
  if (under.length) {
    md += `**🔻 Sous-utilisées (à ajouter)** — ${under.length} expressions\n\n| Expression | Actuel | Cible | Manque |\n|---|---:|---|---:|\n`;
    for (const e of under.slice(0, 25)) md += `| \`${e.expression}\` | ${e.current} | ${e.from}–${e.to} | +${e.deficit} |\n`;
    if (under.length > 25) md += `| _…+${under.length - 25} autres_ | | | |\n`;
  }
  if (over.length) {
    md += `\n**🔺 Sur-utilisées (à réduire)** — ${over.length}\n\n| Expression | Actuel | Cible | Surplus |\n|---|---:|---|---:|\n`;
    for (const e of over.slice(0, 10)) md += `| \`${e.expression}\` | ${e.current} | ${e.from}–${e.to} | +${e.deficit} |\n`;
  }
}

writeFileSync(OUT_MD, md);
console.log(`\n📄 ${OUT_MD}`);
console.log(`📄 ${OUT_JSON}`);
