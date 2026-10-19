import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile, stat, mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { join, extname, dirname, resolve } from 'node:path';
import puppeteer from 'puppeteer';
import { load } from 'cheerio';

async function checkBrowser(root) {
const results = [];
const errors = [];
const check = (name, condition) => { assert.ok(condition, name); results.push(name); console.error('OK:', name); };
const server = createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    let file = join(root, pathname);
    if ((await stat(file)).isDirectory()) file = join(file, 'index.html');
    const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.woff2': 'font/woff2' };
    res.writeHead(200, { 'Content-Type': mime[extname(file)] ?? 'application/octet-stream' });
    res.end(await readFile(file));
  } catch { res.writeHead(404); res.end(); }
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const url = `http://127.0.0.1:${server.address().port}/grand-oral-verification/`;
let browser;
try {
  const $ = load(await (await fetch(url)).text());
  check('SSR : les deux boutons exposent true/false', JSON.stringify($('[data-angle]').map((_, e) => $(e).attr('aria-pressed')).get()) === '["true","false"]');
  check('SSR : question utilisable avant JavaScript', $('[data-draft="question"]').text().trim().length > 20);
  browser = await puppeteer.launch({ headless: true, executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || (existsSync('/opt/brave-bin/brave') ? '/opt/brave-bin/brave' : undefined), args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  page.on('pageerror', e => errors.push(e.message));
  await page.setViewport({ width: 1440, height: 1000 });
  await page.goto(url, { waitUntil: 'networkidle0' });
  await page.waitForSelector('[data-oral-generator][data-bound="true"]');
  check('Initialisation : filtres visibles et cartes présentes', await page.$eval('[data-builder-form]', e => !e.hidden) && await page.$$eval('[data-results] button', e => e.length) === 3);
  const fieldCount = await page.$$eval('[data-draft]', nodes => nodes.length);
  await page.$eval('[data-draft="question"]', e => { e.value = 'Ma question personnalisée conservée'; e.dispatchEvent(new Event('input', { bubbles: true })); });
  await page.click('[data-angle="1"]');
  check('Changement d’angle : état accessible et texte changent', await page.$eval('[data-angle="1"]', e => e.getAttribute('aria-pressed') === 'true') && await page.$eval('[data-draft="question"]', e => e.value !== 'Ma question personnalisée conservée'));
  await page.click('[data-angle="0"]');
  check('Retour à l’angle : brouillon conservé', await page.$eval('[data-draft="question"]', e => e.value === 'Ma question personnalisée conservée'));
  await page.evaluate(() => document.dispatchEvent(new Event('astro:page-load')));
  check('Réinitialisation Astro : aucun doublon ni perte', await page.$$eval('[data-print-for]', e => e.length) === fieldCount && await page.$eval('[data-draft="question"]', e => e.value === 'Ma question personnalisée conservée'));
  await page.select('#oral-specialty', 'maths');
  check('Filtre spécialité : les cartes concernent les maths', await page.$$eval('[data-results] button', e => e.length > 0 && e.every(n => n.textContent.includes('Maths'))));
  await page.$eval('#oral-query', e => { e.value = 'zzzzaucunsujet'; e.dispatchEvent(new Event('input', { bubbles: true })); });
  check('Recherche vide : message et fiche masquée', await page.$eval('[data-empty]', e => !e.hidden) && await page.$eval('[data-sheet]', e => e.hidden));
  await page.click('button[type="reset"]');
  await page.waitForFunction(() => !document.querySelector('[data-sheet]').hidden, {timeout: 2500}).catch(async e => { console.error('RESET STATE', await page.evaluate(() => ({query:document.querySelector('#oral-query').value,specialty:document.querySelector('#oral-specialty').value,sheetHidden:document.querySelector('[data-sheet]').hidden,results:document.querySelector('[data-results-count]').textContent}))); throw e; });
  check('Réinitialisation des filtres', await page.$eval('#oral-specialty', e => e.value === '') && await page.$eval('#oral-query', e => e.value === ''));
  const firstRange = await page.$eval('[data-results-range]', e => e.textContent);
  await page.click('[data-next]');
  check('Pagination suivante', await page.$eval('[data-results-range]', e => e.textContent) !== firstRange);
  await page.click('[data-previous]');
  check('Pagination précédente', await page.$eval('[data-results-range]', e => e.textContent) === firstRange);
  await page.select('#oral-specialty', 'stav');
  check('STAV : croisement désactivé et référence agricole', await page.$eval('#oral-second', e => e.disabled) && await page.$eval('[data-official-resources]', e => e.textContent.includes('STAV')));
  await page.evaluate(() => {
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async value => { window.copied = value; } } });
    window.print = () => { window.printed = true; };
    const original = URL.createObjectURL;
    URL.createObjectURL = blob => { blob.text().then(text => { window.downloaded = text; }); return original(blob); };
  });
  await page.click('[data-copy]');
  await page.waitForFunction(() => window.copied);
  check('Copie : fiche complète avec repères officiels', await page.evaluate(() => window.copied.includes('ORAL TERMINAL STAV') && window.copied.includes('REPÈRES OFFICIELS')));
  await page.evaluate(() => { navigator.clipboard.writeText = async () => { throw new Error('presse-papiers indisponible pour le test'); }; });
  await page.click('[data-copy]');
  await page.waitForFunction(() => !document.querySelector('[data-copy-fallback]').hidden);
  check('Copie refusée : solution de repli complète', await page.$eval('#oral-copy-text', e => e.value.includes('ORAL TERMINAL STAV')));
  await page.click('[data-download]');
  await page.waitForFunction(() => window.downloaded);
  check('Téléchargement texte : contenu complet', await page.evaluate(() => window.downloaded.includes('MINI INTRODUCTION') && window.downloaded.includes('MINI CONCLUSION')));
  await page.click('[data-print]');
  check('Impression appelée et textes synchronisés', await page.evaluate(() => window.printed) && await page.$$eval('[data-print-for]', e => e.some(n => n.textContent.length > 20)));
  await page.setViewport({ width: 390, height: 844 });
  await page.click('button[type="reset"]');
  check('Mobile : aucun débordement horizontal', await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  check('Aucune erreur JavaScript', errors.length === 0);
  console.log(JSON.stringify({ passed: results.length, results, errors }, null, 2));
} finally {
  if (browser) await browser.close();
  await new Promise(resolve => server.close(resolve));
}

}

// Route temporaire et construction isolée, sur le même volume que le cache Astro.
const project = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const fixture = join(project, 'src/pages/grand-oral-verification.astro');
if (existsSync(fixture)) throw new Error('La route temporaire existe déjà ; ne pas écraser un fichier local.');
await mkdir(join(project, '.astro'), { recursive: true });
const scratch = await mkdtemp(join(project, '.astro/grand-oral-regression-'));
try {
  await writeFile(fixture, `---
import GrandOralGenerator from "../components/GrandOralGenerator.astro";
import "../styles/editorial-resources.css";
---
<!doctype html><html lang="fr"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width"/><title>Vérification locale Grand oral</title></head><body><main style="max-width:1120px;margin:2rem auto;padding:1rem"><GrandOralGenerator /></main></body></html>
`);
  const dist = join(scratch, 'dist');
  await new Promise((accept, reject) => {
    const child = spawn(process.execPath, [join(project, 'node_modules/astro/bin/astro.mjs'), 'build', '--outDir', dist], { cwd: project, stdio: ['ignore', 'pipe', 'pipe'] });
    let output = '';
    child.stdout.on('data', data => { output += data; });
    child.stderr.on('data', data => { output += data; });
    child.on('error', reject);
    child.on('close', code => code === 0 ? accept() : reject(new Error(output.slice(-10000))));
  });
  await checkBrowser(dist);
} finally {
  await rm(fixture, { force: true });
  await rm(scratch, { recursive: true, force: true });
}
