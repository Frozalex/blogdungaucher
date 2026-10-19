#!/usr/bin/env node
/** Vérifie un lot éditorial sans modifier les articles. */
import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs';
import { resolve, join, relative, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { isDeepStrictEqual } from 'node:util';
import { createMarkdownProcessor, parseFrontmatter } from '@astrojs/markdown-remark';
import remarkMath from 'remark-math';
import { load } from 'cheerio';
import { rehypeMathSingle } from '../src/utils/rehype-math-single.ts';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
function option(name, fallback) {
  const i = args.indexOf(name);
  return i < 0 ? fallback : args[i + 1];
}
const manifestPath = option('--manifest');
const baseline = option('--baseline', '/tmp/reprise-parallele-initial');
const output = option('--output');
const asOf = option('--as-of', '2026-10-19');
if (!manifestPath || !output) throw new Error('Utiliser --manifest fichier.json --output rapport.json [--baseline dossier] [--documented-only]');
const manifest = JSON.parse(readFileSync(resolve(root, manifestPath), 'utf8'));
const paths = Object.values(manifest.lots).flat();
if (new Set(paths).size !== paths.length) throw new Error('Article attribué à plusieurs lots');
const documentedOnly = args.includes('--documented-only');
const processor = await createMarkdownProcessor({ remarkPlugins: [remarkMath], rehypePlugins: [rehypeMathSingle] });
const renderCache = new Map();
async function renderArticle(path) {
  if (!renderCache.has(path)) renderCache.set(path, await processor.render(parseFrontmatter(readFileSync(path, 'utf8')).content));
  return renderCache.get(path);
}
function hasAnchor(rendered, fragment) {
  let id;
  try { id = decodeURIComponent(fragment); } catch { return false; }
  const doc = load(rendered.code);
  return rendered.metadata.headings.some(h => h.slug === id) || [...doc('[id]')].some(e => doc(e).attr('id') === id);
}
const articleFiles = new Map();
function collect(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) collect(path);
    else if (entry.name.endsWith('.md')) articleFiles.set(entry.name.slice(0, -3), path);
  }
}
collect(join(root, 'src/content/blog'));
const publicationDates = new Map([...articleFiles].map(([slug, path]) => [slug,
  String(parseFrontmatter(readFileSync(path, 'utf8')).frontmatter.publishDate).slice(0, 10)]));
const protectedFields = ['heroImage', 'heroImageAlt', 'ogImage', 'publishDate', 'updatedDate', 'category', 'seoTitle', 'seoDescription', 'noindex', 'draft'];
const rows = [];
const pending = [];
const issues = [];
for (const path of paths) {
  const slug = path.split('/').pop().replace(/\.md$/, '');
  const note = join(root, 'docs/audits-editoriaux/fiches-reprise', `${slug}.md`);
  if (!existsSync(note)) {
    pending.push(path);
    if (documentedOnly) continue;
    issues.push({ path, problem: 'Fiche de sources et de reprise absente' });
  }
  const before = parseFrontmatter(readFileSync(resolve(baseline, path), 'utf8'));
  const current = parseFrontmatter(readFileSync(resolve(root, path), 'utf8'));
  const localIssues = [];
  if (current.content === before.content) localIssues.push('Corps inchangé depuis le début de la reprise');
  const acceptedCorrections = [];
  for (const key of protectedFields) {
    if (!isDeepStrictEqual(before.frontmatter[key], current.frontmatter[key])) {
      const correction = manifest.metadataCorrections?.[path]?.[key];
      if (correction?.reason && isDeepStrictEqual(correction.from, before.frontmatter[key]) && isDeepStrictEqual(correction.to, current.frontmatter[key])) acceptedCorrections.push({ key, reason: correction.reason });
      else localIssues.push(`Champ protégé modifié : ${key}`);
    }
  }
  if (current.content.includes('—')) localIssues.push('Tiret cadratin dans le corps');
  if (/\[À VÉRIFIER|TODO|https?:\/\/(?:www\.)?example\.com\b/i.test(current.content)) localIssues.push('Marqueur ou URL de démonstration à relire');
  const rendered = await renderArticle(resolve(root, path));
  const $ = load(rendered.code);
  if ($('.katex-error').length) localIssues.push('Erreur de rendu mathématique');
  const links = [];
  const fragmentLinks = [];
  const publication = String(current.frontmatter.publishDate).slice(0, 10);
  const cutoff = publication > asOf ? publication : asOf;
  $('a[href^="/fr/blog/"]').each((_, element) => {
    const href = $(element).attr('href');
    const target = href.split('/')[3]?.split('#')[0];
    if (target && !articleFiles.has(target)) localIssues.push(`Article cible absent : ${href}`);
    if (target && publicationDates.get(target) > cutoff) localIssues.push(`Cible non publiée à la date utile (${cutoff}) : ${href}`);
    links.push(href);
    if (href.includes('#') && articleFiles.has(target)) fragmentLinks.push({ href, target, fragment: href.slice(href.indexOf('#') + 1) });
  });
  for (const link of fragmentLinks) {
    if (link.fragment && !hasAnchor(await renderArticle(articleFiles.get(link.target)), link.fragment)) localIssues.push(`Ancre interne absente : ${link.href}`);
  }
  $('a[href^="#"]').each((_, element) => {
    const href = $(element).attr('href');
    if (href.length > 1 && !hasAnchor(rendered, href.slice(1))) localIssues.push(`Ancre locale absente : ${href}`);
  });
  $('img[src^="/"]').each((_, element) => {
    const src = $(element).attr('src').split(/[?#]/)[0];
    if (!existsSync(join(root, 'public', src))) localIssues.push(`Image absente : ${src}`);
  });
  for (const asset of [current.frontmatter.heroImage?.src, current.frontmatter.ogImage]) {
    if (asset?.startsWith('/') && !existsSync(join(root, 'public', asset))) localIssues.push(`Couverture absente : ${asset}`);
  }
  const sources = [...new Set([...current.content.matchAll(/\]\((https?:\/\/[^\s)]+)(?:[^)]*)\)/g)].map(m => m[1]))];
  rows.push({ path, note: existsSync(note) ? relative(root, note) : null, changed: before.content !== current.content,
    headings: rendered.metadata.headings.length, internalLinks: links.length, externalSourceLinks: sources,
    protectedMetadataPreserved: !localIssues.some(s => s.startsWith('Champ protégé')) && !acceptedCorrections.length,
    acceptedMetadataCorrections: acceptedCorrections, issues: localIssues });
  for (const problem of localIssues) issues.push({ path, problem });
}
const result = { manifest: manifestPath, checkedAsOf: asOf, planned: paths.length, checked: rows.length, pending, issues, articles: rows,
  scope: 'Structure Markdown, formules, liens internes, fichiers image et métadonnées ; la validité scientifique est relue séparément dans les fiches et les sources.' };
writeFileSync(resolve(root, output), JSON.stringify(result, null, 2) + '\n');
console.log(JSON.stringify({ planned: paths.length, checked: rows.length, pending: pending.length, issues: issues.length }));
if (issues.length) process.exitCode = 1;
