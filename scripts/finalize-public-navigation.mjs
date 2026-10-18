/** Keep the generated navigation consistent with pages actually emitted by Astro.
 * Source article links stay intact, so scheduled targets become links automatically
 * on the first rebuild after publication. Never hide an unknown broken link.
 */
import { readFileSync, writeFileSync, readdirSync, existsSync, rmSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { load } from 'cheerio';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const origin = 'https://blogdungaucher.com';
function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap(e =>
    e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]);
}
function localPath(href, base = origin) {
  try { const u = new URL(href, base); return u.origin === origin ? u.pathname : null; }
  catch { return null; }
}

export function finalizeHtml(html, pageUrl, pages, scheduledPaths) {
  const $ = load(html, { sourceCodeLocationInfo: true });
  const edits = [];
  const remove = node => {
    const loc = node.sourceCodeLocation;
    if (loc) edits.push([loc.startOffset, loc.endOffset, '']);
  };
  const noindex = /noindex/i.test($('meta[name=robots]').attr('content') ?? '');
  $('link[rel=alternate][hreflang]').each((_, node) => {
    const target = pages.get(localPath($(node).attr('href'), pageUrl));
    if (noindex || !target || !target.indexable) remove(node);
  });
  $('a[href]').each((_, node) => {
    const href = $(node).attr('href');
    const target = localPath(href, pageUrl);
    // The prelaunch NL legal pages already exist, but the NL blog does not.
    if (target === '/nl/blog/' && !pages.has(target) && !pages.get('/nl/')?.indexable) {
      const attr = node.sourceCodeLocation?.attrs?.href;
      if (attr) edits.push([attr.startOffset, attr.endOffset, 'href="/fr/blog/"']);
      return;
    }
    if (!target || pages.has(target) || !scheduledPaths.has(target)) return;
    const loc = node.sourceCodeLocation;
    if (loc?.startTag && loc?.endTag) {
      edits.push([loc.startTag.startOffset, loc.startTag.endOffset, '']);
      edits.push([loc.endTag.startOffset, loc.endTag.endOffset, '']);
    }
  });
  // Apply surgical edits backwards: preserve all other HTML bytes and inline JS.
  for (const [start, end, replacement] of edits.sort((a,b) => b[0] - a[0])) {
    html = html.slice(0, start) + replacement + html.slice(end);
  }
  return { html, changes: edits.length };
}

export function finalizeNavigation() {
  const dist = path.join(root, 'dist');
  // Ignoring a local review artifact in Git does not stop Astro copying it.
  // Keep the author's originals; exclude only these known debug outputs.
  for (const name of ['_rev.html', '_svglist.json']) rmSync(path.join(dist, name), { force: true });
  const files = walk(dist).filter(f => f.endsWith('.html'));
  const pages = new Map();
  for (const file of files) {
    const urlPath = '/' + path.relative(dist, file).split(path.sep).join('/').replace(/index\.html$/, '');
    const html = readFileSync(file, 'utf8');
    const $ = load(html);
    pages.set(urlPath, { file, html, indexable:
      !/noindex/i.test($('meta[name=robots]').attr('content') ?? '') &&
      !$('meta[http-equiv="refresh" i]').length && urlPath !== '/404.html' });
  }
  const scheduledPaths = new Set();
  const futureSlugs = new Set();
  const now = new Date();
  // These scalar fields are deliberately the only frontmatter fields read here.
  const field = (text, key) => text.match(new RegExp(`^${key}:\\s*["']?([^"'\\r\\n]+)`, 'm'))?.[1]?.trim();
  for (const file of walk(path.join(root, 'src/content/blog')).filter(f => f.endsWith('.md'))) {
    const fm = readFileSync(file, 'utf8').replace(/^\uFEFF/, '').split(/^---\s*$/m)[1] ?? '';
    if (new Date(field(fm, 'publishDate')) > now) {
      const slug = path.basename(file, '.md');
      futureSlugs.add(slug);
      for (const lang of ['fr', 'en', 'pt-br', 'nl']) scheduledPaths.add(`/${lang}/blog/${slug}/`);
    }
  }
  for (const lang of ['en', 'pt-br', 'nl']) {
    const dir = path.join(root, 'src/content/blog-translations', lang);
    if (!existsSync(dir)) continue;
    for (const file of walk(dir).filter(f => f.endsWith('.md'))) {
      const fm = readFileSync(file, 'utf8').replace(/^\uFEFF/, '').split(/^---\s*$/m)[1] ?? '';
      const slug = path.basename(file, '.md');
      if (futureSlugs.has(field(fm, 'frSlug') ?? slug)) {
        scheduledPaths.add(`/${lang}/blog/${lang === 'en' ? field(fm, 'enSlug') ?? slug : slug}/`);
      }
    }
  }
  let changes = 0;
  for (const [urlPath, page] of pages) {
    const result = finalizeHtml(page.html, origin + urlPath, pages, scheduledPaths);
    if (result.changes) { writeFileSync(page.file, result.html); changes += result.changes; }
  }
  console.log(`[finalize-navigation] ${changes} edits; scheduled links restored automatically by future builds.`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) finalizeNavigation();
