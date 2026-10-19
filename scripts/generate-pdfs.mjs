#!/usr/bin/env node
/**
 * Génère un PDF par article Grand Oral à partir du build Astro.
 *
 * Lit directement les pages HTML Grand Oral de dist/, les met en page avec
 * Puppeteer, et sauvegarde les PDF dans public/pdfs/{slug}.pdf.
 *
 * Sortie dans public/ (versionné) et NON dist/ : ainsi `astro build` recopie
 * automatiquement public/pdfs/ → dist/pdfs/ à chaque build, sans dépendre de
 * Puppeteer au déploiement. Penser à committer public/pdfs/ après régénération.
 *
 * Usage : node scripts/generate-pdfs.mjs [slug ...]
 * Navigateur facultatif : PUPPETEER_EXECUTABLE_PATH=/chemin/vers/chromium
 * Pré-requis : `npm run build` doit avoir été exécuté avant (dist/ doit exister).
 */

import { existsSync, mkdirSync, readdirSync, readFileSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import puppeteer from 'puppeteer';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const BLOG_DIR = resolve(ROOT, 'src', 'content', 'blog');
const OUT_DIR = resolve(ROOT, 'public', 'pdfs');

// Liste récursivement tous les .md sous un dossier (le contenu blog est rangé
// en sous-dossiers par rubrique : grand-oral/, science/, esprit/, societe/…).
function listMarkdownFiles(dir) {
  const out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...listMarkdownFiles(full));
    else if (entry.name.endsWith('.md')) out.push(full);
  }
  return out;
}

// 1. Lister les articles grand-oral à partir des fichiers .md (récursif).
function listGrandOralArticles() {
  const files = listMarkdownFiles(BLOG_DIR);
  const articles = [];
  for (const full of files) {
    const raw = readFileSync(full, 'utf8').replace(/^﻿/, '');
    const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    if (!m) continue;
    if (!/category:\s*["']?grand-oral["']?/.test(m[1])) continue;
    // Le slug d'URL = dernier segment du nom de fichier sans extension
    // (cf. getPostSlug : post.id.split('/').pop()).
    const base = full.replace(/\\/g, '/').split('/').pop().replace(/\.md$/, '');
    articles.push({
      slug: base,
    });
  }
  return articles;
}

// 2. Génère un PDF pour un slug donné
// CSS minimal pour la page PDF (sans web fonts, sans backgrounds).
const PDF_PAGE_CSS = `
  * { box-sizing: border-box; }
  body {
    font-family: Georgia, "Times New Roman", serif;
    font-size: 11pt;
    line-height: 1.55;
    color: #111;
    background: #fff;
    margin: 0;
    padding: 0;
  }
  h1 { font-size: 22pt; line-height: 1.2; margin: 0 0 8mm; color: #000; font-weight: 700; }
  h2 { font-size: 15pt; line-height: 1.3; margin: 7mm 0 3mm; color: #111; page-break-after: avoid; border-bottom: 1px solid #ddd; padding-bottom: 1.5mm; }
  h3 { font-size: 12.5pt; line-height: 1.3; margin: 5mm 0 2mm; color: #222; page-break-after: avoid; }
  h4 { font-size: 11pt; line-height: 1.3; margin: 4mm 0 2mm; color: #333; page-break-after: avoid; font-style: italic; }
  p { margin: 0 0 3mm; orphans: 3; widows: 3; }
  ul, ol { margin: 0 0 3mm 6mm; padding: 0; }
  li { margin-bottom: 1mm; }
  a { color: #1a4d8f; text-decoration: underline; }
  strong { font-weight: 700; }
  em { font-style: italic; }
  code {
    font-family: "Courier New", Consolas, monospace;
    font-size: 9.5pt;
    background: #f3f3f3;
    padding: 0.5mm 1.5mm;
    border-radius: 1mm;
  }
  pre {
    font-family: "Courier New", Consolas, monospace;
    font-size: 9pt;
    background: #f5f5f5;
    border: 1px solid #ddd;
    border-radius: 2mm;
    padding: 3mm;
    overflow: visible !important;
    white-space: pre-wrap !important;
    word-break: break-word;
    page-break-inside: avoid;
    margin: 0 0 4mm;
    line-height: 1.4;
  }
  pre code { background: transparent; padding: 0; border-radius: 0; }
  table {
    border-collapse: collapse;
    width: 100%;
    margin: 0 0 4mm;
    font-size: 9.5pt;
    page-break-inside: avoid;
  }
  th, td { border: 1px solid #aaa; padding: 1.5mm 2mm; text-align: left; vertical-align: top; }
  th { background: #eee; font-weight: 700; }
  blockquote {
    margin: 0 0 4mm;
    padding: 2mm 4mm;
    border-left: 3pt solid #888;
    background: #f8f8f8;
    font-style: italic;
  }
  hr { border: 0; border-top: 1px solid #ccc; margin: 5mm 0; }
  img { display: none; }
  .katex-display { margin: 3mm 0; overflow-x: visible !important; }
  .katex { font-size: 1em; }
  /* Page-break helpers */
  h1, h2, h3, h4, h5, h6, pre, blockquote, table { page-break-inside: avoid; }
  .pdf-question { break-after: avoid; page-break-after: avoid; }
  .pdf-sources { break-inside: avoid; }
  /* Les fiches courtes tiennent sur une page sans isoler une source au verso. */
  body.pdf-reference { font-size: 10.5pt; line-height: 1.42; }
  .pdf-reference h1 { font-size: 20pt; margin-bottom: 6mm; }
  .pdf-reference h2 { font-size: 14pt; margin-top: 5mm; margin-bottom: 2.5mm; }
  .pdf-reference p { margin-bottom: 2.5mm; }
  .pdf-reference li { break-inside: avoid; }
`;

// CSS KaTeX (formules) inlinée depuis node_modules, polices woff2 en base64.
// Le <link href*="katex"> n'existe pas dans le build (CSS bundlée + hashée), donc
// l'ancienne extraction via fetch renvoyait du vide → maths cassées dans les PDF.
function buildKatexCss() {
  const cssPath = resolve(ROOT, 'node_modules', 'katex', 'dist', 'katex.min.css');
  const fontsDir = resolve(ROOT, 'node_modules', 'katex', 'dist', 'fonts');
  if (!existsSync(cssPath)) return '';
  let css = readFileSync(cssPath, 'utf8');
  // Retire les fallbacks woff/ttf (Chromium prend le woff2).
  css = css.replace(/,url\(fonts\/[^)]+\.woff\) format\("woff"\),url\(fonts\/[^)]+\.ttf\) format\("truetype"\)/g, '');
  // Inline chaque woff2 en data URI base64.
  css = css.replace(/url\(fonts\/([^)]+\.woff2)\)/g, (whole, file) => {
    const fp = join(fontsDir, file);
    if (!existsSync(fp)) return whole;
    const b64 = readFileSync(fp).toString('base64');
    return `url(data:font/woff2;base64,${b64})`;
  });
  return css;
}
const KATEX_CSS = buildKatexCss();

async function generatePdf(browser, slug) {
  const page = await browser.newPage();
  await page.setViewport({ width: 794, height: 1123 });
  await page.setJavaScriptEnabled(false);
  await page.setRequestInterception(true);
  page.on('request', (request) => {
    const target = request.url();
    if (target.startsWith('data:') || target === 'about:blank') request.continue();
    else request.abort();
  });
  const htmlPath = resolve(ROOT, 'dist', 'fr', 'blog', slug, 'index.html');
  if (!existsSync(htmlPath)) throw new Error(`Page construite introuvable : ${slug}`);
  // Le HTML statique est la source du PDF, même pour une page programmée que le
  // serveur de prévisualisation pourrait refuser de router avant publication.
  await page.setContent(readFileSync(htmlPath, 'utf8'), { waitUntil: 'domcontentloaded', timeout: 60000 });
  // Laisse le temps au rendu/layout de se stabiliser.
  await new Promise((r) => setTimeout(r, 150));

  // Extraire le HTML brut de l'article, sans le chrome de page.
  const { articleHtml, title, isReferenceSheet } = await page.evaluate(() => {
    const main = document.querySelector('.article-main .article-body');
    if (!main) return { articleHtml: '', title: '' };
    // Utiliser le titre rendu : une apostrophe dans le YAML ne doit pas le tronquer.
    const title = main.querySelector('h1')?.textContent?.trim() || document.querySelector('h1')?.textContent?.trim() || '';

    const clone = main.cloneNode(true);
    const removeSelectors = [
      '.breadcrumb', '.article-header', '[data-no-print]',
      '.share', '.comments', '.related-posts', '.ad-banner',
      '.summary-video-wrap', '.article-video', '.video-player',
      '.reading-progress', '.hero-media', '.article-nav', '.related-articles',
      '.article-tags', '.article-meta', '.meta-updated', '.article-excerpt',
      // Chrome de fin d'article à exclure du PDF (pas du contenu de révision) :
      '.pillar-links',   // bloc « Continuer à explorer » + cartes rubriques
      '.nl-cta',         // encart Newsletter (NewsletterCta)
      '.article-aside',  // sidebar (TOC, carte rubrique, pub)
      '.related',        // « Dans la même rubrique » (articles liés)
      'script', 'style',
    ];
    clone.querySelectorAll(removeSelectors.join(',')).forEach((el) => el.remove());

    // Retirer blockquotes "Télécharger" et "Pour aller plus loin"
    clone.querySelectorAll('blockquote').forEach((bq) => {
      const t = bq.textContent || '';
      if (t.includes('Télécharger') || t.includes('Pour aller plus loin')) bq.remove();
    });

    // Une question de jury ne doit pas rester seule au pied d'une page.
    clone.querySelectorAll('p').forEach((paragraph) => {
      if (/^Q\d+\./.test(paragraph.textContent.trim())) paragraph.classList.add('pdf-question');
    });

    // Garder un court bloc de références avec son titre, plutôt que quelques
    // références isolées sur la page suivante.
    clone.querySelectorAll('h2').forEach((heading) => {
      if (!/^Sources(?: et références)?$|^Références$/i.test(heading.textContent.trim())) return;
      const section = document.createElement('section');
      section.className = 'pdf-sources';
      heading.before(section);
      let node = heading;
      while (node && !(node !== heading && node.nodeType === Node.ELEMENT_NODE && node.matches('h2'))) {
        const next = node.nextSibling;
        section.appendChild(node);
        node = next;
      }
    });

    // Retirer hr en début/fin
    const hrs = clone.querySelectorAll('hr');
    if (hrs.length > 0) hrs[0].remove();
    if (hrs.length > 1) hrs[hrs.length - 1].remove();

    // Convertir les liens relatifs en absolus
    const base = 'https://blogdungaucher.com';
    clone.querySelectorAll('a[href^="/"]').forEach((a) => {
      const h = a.getAttribute('href');
      if (h) a.setAttribute('href', base + h);
    });

    const walker = document.createTreeWalker(clone, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) walker.currentNode.textContent = walker.currentNode.textContent.replace(/[\u2010-\u2015]/g, '-');
    return {
      articleHtml: clone.innerHTML,
      title: title.replace(/[\u2010-\u2015]/g, '-'),
      isReferenceSheet: /^Fiche de révision/i.test(clone.querySelector('h2')?.textContent?.trim() || ''),
    };
  });

  if (!articleHtml || articleHtml.length < 100 || !title) {
    throw new Error('Contenu article vide ou introuvable');
  }

  await page.close();

  // Nouvelle page propre avec le HTML extrait + CSS minimal.
  const cleanPage = await browser.newPage();
  await cleanPage.setViewport({ width: 794, height: 1123 });
  await cleanPage.setJavaScriptEnabled(false);
  await cleanPage.setRequestInterception(true);
  cleanPage.on('request', (request) => {
    if (request.url().startsWith('data:') || request.url() === 'about:blank') request.continue();
    else request.abort();
  });

  const html = `<!DOCTYPE html>
<html lang="fr"><head><meta charset="utf-8"><title>${title.replace(/[<>&]/g, '')}</title>
<style>${KATEX_CSS}</style>
<style>${PDF_PAGE_CSS}</style>
</head><body class="${isReferenceSheet ? 'pdf-reference' : ''}">
<h1>${title.replace(/[<>&]/g, (c) => ({'<':'&lt;','>':'&gt;','&':'&amp;'}[c]))}</h1>
${articleHtml}
</body></html>`;

  await cleanPage.setContent(html, { waitUntil: 'networkidle0' });
  await cleanPage.emulateMediaType('print');
  let fontTimeout;
  try {
    await Promise.race([
      cleanPage.evaluate(() => document.fonts.ready),
      new Promise((_, reject) => {
        fontTimeout = setTimeout(() => reject(new Error('Polices PDF non chargées (15s)')), 15000);
      }),
    ]);
  } finally {
    clearTimeout(fontTimeout);
  }

  const outPath = join(OUT_DIR, `${slug}.pdf`);
  await cleanPage.pdf({
    path: outPath,
    format: 'A4',
    margin: { top: '16mm', right: '15mm', bottom: '18mm', left: '15mm' },
    printBackground: false,
    preferCSSPageSize: false,
    displayHeaderFooter: true,
    headerTemplate: '<div></div>',
    footerTemplate: `
      <div style="font-size:8pt;color:#888;width:100%;padding:0 15mm;display:flex;justify-content:space-between;">
        <span>blogdungaucher.com</span>
        <span>Page <span class="pageNumber"></span> / <span class="totalPages"></span></span>
      </div>
    `,
  });
  await cleanPage.close();
  return outPath;
}

// 3. Pipeline principal
async function main() {
  const distDir = resolve(ROOT, 'dist');
  if (!existsSync(distDir)) {
    console.error('❌ dist/ introuvable. Lance "npm run build" d\'abord.');
    process.exit(1);
  }

  mkdirSync(OUT_DIR, { recursive: true });

  const available = listGrandOralArticles();
  const selected = new Set(process.argv.slice(2));
  const unknown = [...selected].filter((slug) => !available.some((article) => article.slug === slug));
  if (unknown.length) throw new Error(`Slugs inconnus : ${unknown.join(', ')}`);
  const articles = selected.size ? available.filter(({ slug }) => selected.has(slug)) : available;
  console.log(`📋 ${articles.length} articles Grand Oral à convertir en PDF\n`);

  let browser;
  try {
    browser = await puppeteer.launch({
      headless: 'new',
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || (existsSync('/opt/brave-bin/brave') ? '/opt/brave-bin/brave' : undefined),
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    let i = 0;
    let failures = 0;
    for (const { slug } of articles) {
      i++;
      const start = Date.now();
      process.stdout.write(`  [${i}/${articles.length}] ${slug} …`);
      try {
        const path = await generatePdf(browser, slug);
        const ms = Date.now() - start;
        const sizeKb = Math.round(readFileSync(path).length / 1024);
        process.stdout.write(` ✅ ${sizeKb} KB (${ms}ms)\n`);
      } catch (e) {
        failures++;
        process.stdout.write(` ❌ ${e.message}\n`);
      }
    }

    if (failures) throw new Error(`${failures} PDF(s) non généré(s)`);

    console.log(`\n📄 PDFs générés dans : ${OUT_DIR}`);
  } finally {
    if (browser) await browser.close();
  }
}

main().catch((e) => {
  console.error('Erreur fatale :', e);
  process.exit(1);
});
