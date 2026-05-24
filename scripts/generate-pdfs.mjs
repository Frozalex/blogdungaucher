#!/usr/bin/env node
/**
 * Génère un PDF par article Grand Oral à partir du build Astro.
 *
 * Lance un serveur de prévisualisation, navigue avec Puppeteer sur chaque page
 * grand-oral en mode `?pdf=1`, et sauvegarde le PDF dans dist/pdfs/{slug}.pdf
 *
 * Usage : node scripts/generate-pdfs.mjs
 * Pré-requis : `npm run build` doit avoir été exécuté avant (dist/ doit exister).
 */

import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, readFileSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import puppeteer from 'puppeteer';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const BLOG_DIR = resolve(ROOT, 'src', 'content', 'blog');
const OUT_DIR = resolve(ROOT, 'dist', 'pdfs');
const PREVIEW_PORT = 4322;
const PREVIEW_URL = `http://localhost:${PREVIEW_PORT}`;

// 1. Lister les articles grand-oral à partir des fichiers .md
function listGrandOralArticles() {
  const files = readdirSync(BLOG_DIR).filter((f) => f.endsWith('.md'));
  const articles = [];
  for (const f of files) {
    const raw = readFileSync(join(BLOG_DIR, f), 'utf8').replace(/^﻿/, '');
    const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    if (!m) continue;
    if (!/category:\s*["']?grand-oral["']?/.test(m[1])) continue;
    const titleMatch = m[1].match(/^title:\s*["']?([^"'\n]+)["']?/m);
    articles.push({
      slug: f.replace(/\.md$/, ''),
      title: titleMatch ? titleMatch[1].trim() : f.replace(/\.md$/, ''),
    });
  }
  return articles;
}

// 2. Lancer le serveur Astro preview en arrière-plan
function startPreviewServer() {
  return new Promise((resolveFn, rejectFn) => {
    console.log('🚀 Lancement du serveur Astro preview…');
    const proc = spawn('npm', ['run', 'preview', '--', '--port', String(PREVIEW_PORT), '--host', 'localhost'], {
      cwd: ROOT,
      stdio: ['ignore', 'pipe', 'pipe'],
      shell: true,
    });
    let started = false;
    const timeout = setTimeout(() => {
      if (!started) {
        proc.kill();
        rejectFn(new Error('Timeout serveur preview (15s)'));
      }
    }, 15000);
    proc.stdout.on('data', (d) => {
      const s = d.toString();
      if (!started && (s.includes('Local') || s.includes('localhost:' + PREVIEW_PORT))) {
        started = true;
        clearTimeout(timeout);
        // Petit délai pour s'assurer que le serveur est prêt
        setTimeout(() => resolveFn(proc), 500);
      }
    });
    proc.stderr.on('data', (d) => process.stderr.write(d));
  });
}

// 3. Génère un PDF pour un slug donné
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
`;

async function generatePdf(browser, slug, title) {
  const page = await browser.newPage();
  await page.setViewport({ width: 794, height: 1123 });
  const url = `${PREVIEW_URL}/fr/blog/${slug}/`;
  await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });

  // Extraire le HTML brut de l'article, sans le chrome de page.
  const articleHtml = await page.evaluate(() => {
    const main = document.querySelector('.article-main');
    if (!main) return '';

    const clone = main.cloneNode(true);
    const removeSelectors = [
      '.breadcrumb', '.article-header', '[data-no-print]',
      '.share', '.comments', '.related-posts', '.ad-banner',
      '.summary-video-wrap', '.article-video', '.remotion-player', '.video-player',
      '.reading-progress', '.hero-media', '.article-nav', '.related-articles',
      '.article-tags', '.article-meta', '.meta-updated', '.article-excerpt',
      'script', 'style',
    ];
    clone.querySelectorAll(removeSelectors.join(',')).forEach((el) => el.remove());

    // Retirer blockquotes "Télécharger" et "Pour aller plus loin"
    clone.querySelectorAll('blockquote').forEach((bq) => {
      const t = bq.textContent || '';
      if (t.includes('Télécharger') || t.includes('Pour aller plus loin')) bq.remove();
    });

    // Retirer hr en début/fin
    const hrs = clone.querySelectorAll('hr');
    if (hrs.length > 0) hrs[0].remove();
    if (hrs.length > 1) hrs[hrs.length - 1].remove();

    // Convertir les liens relatifs en absolus
    const base = window.location.origin;
    clone.querySelectorAll('a[href^="/"]').forEach((a) => {
      const h = a.getAttribute('href');
      if (h) a.setAttribute('href', base + h);
    });

    return clone.innerHTML;
  });

  if (!articleHtml || articleHtml.length < 100) {
    throw new Error('Contenu article vide ou introuvable');
  }

  // Récupérer aussi les styles KaTeX si présents (formules math).
  const katexCss = await page.evaluate(async () => {
    const link = document.querySelector('link[rel="stylesheet"][href*="katex"]');
    if (!link) return '';
    try {
      const res = await fetch(link.href);
      return await res.text();
    } catch {
      return '';
    }
  });

  await page.close();

  // Nouvelle page propre avec le HTML extrait + CSS minimal.
  const cleanPage = await browser.newPage();
  await page.setViewport?.({ width: 794, height: 1123 }).catch(() => {});

  const html = `<!DOCTYPE html>
<html lang="fr"><head><meta charset="utf-8"><title>${title.replace(/[<>&]/g, '')}</title>
<style>${PDF_PAGE_CSS}</style>
<style>${katexCss}</style>
</head><body>
<h1>${title.replace(/[<>&]/g, (c) => ({'<':'&lt;','>':'&gt;','&':'&amp;'}[c]))}</h1>
${articleHtml}
</body></html>`;

  await cleanPage.setContent(html, { waitUntil: 'networkidle0' });
  await cleanPage.emulateMediaType('print');
  await cleanPage.evaluate(() => new Promise((r) => setTimeout(r, 100)));

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

// 4. Pipeline principal
async function main() {
  const distDir = resolve(ROOT, 'dist');
  if (!existsSync(distDir)) {
    console.error('❌ dist/ introuvable. Lance "npm run build" d\'abord.');
    process.exit(1);
  }

  mkdirSync(OUT_DIR, { recursive: true });

  const articles = listGrandOralArticles();
  console.log(`📋 ${articles.length} articles Grand Oral à convertir en PDF\n`);

  let server;
  let browser;
  try {
    server = await startPreviewServer();
    console.log('✅ Serveur prêt sur', PREVIEW_URL, '\n');

    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    let i = 0;
    for (const { slug, title } of articles) {
      i++;
      const start = Date.now();
      process.stdout.write(`  [${i}/${articles.length}] ${slug} …`);
      try {
        const path = await generatePdf(browser, slug, title);
        const ms = Date.now() - start;
        const sizeKb = Math.round(readFileSync(path).length / 1024);
        process.stdout.write(` ✅ ${sizeKb} KB (${ms}ms)\n`);
      } catch (e) {
        process.stdout.write(` ❌ ${e.message}\n`);
      }
    }

    console.log(`\n📄 PDFs générés dans : ${OUT_DIR}`);
  } finally {
    if (browser) await browser.close();
    if (server) server.kill();
  }
}

main().catch((e) => {
  console.error('Erreur fatale :', e);
  process.exit(1);
});
