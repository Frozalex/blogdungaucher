#!/usr/bin/env node
import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, '..', '.env');
if (!existsSync(envPath)) {
  throw new Error('Fichier .env manquant. Copie .env.example et renseigne SERPMANTICS_API_KEY.');
}
const env = Object.fromEntries(
  readFileSync(envPath, 'utf8')
    .split('\n')
    .filter((l) => l && !l.startsWith('#'))
    .map((l) => l.split('=').map((s) => s.trim())),
);
const KEY = env.SERPMANTICS_API_KEY;
if (!KEY) throw new Error('SERPMANTICS_API_KEY manquant dans .env');

const BASE = 'https://app.serpmantics.com/api/v1';
const headers = { Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json' };

async function call(method, path, { query, body } = {}) {
  const url = new URL(BASE + path);
  if (query) for (const [k, v] of Object.entries(query)) url.searchParams.set(k, v);
  const res = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let json;
  try { json = JSON.parse(text); } catch { json = { raw: text }; }
  if (!res.ok) throw new Error(`${method} ${path} → ${res.status}: ${text}`);
  return json;
}

async function pollUntilReady(path, guideId, label, maxSec = 120) {
  const t0 = Date.now();
  while ((Date.now() - t0) / 1000 < maxSec) {
    const r = await call('GET', path, { query: { guideId } });
    if (r.isReady) return r;
    process.stderr.write(`  ⏳ ${label}…\n`);
    await new Promise((r) => setTimeout(r, 4000));
  }
  throw new Error(`${label}: timeout après ${maxSec}s`);
}

export async function credits() {
  return call('GET', '/credits');
}

export async function createGuide(query, lang = 'fr') {
  const r = await call('POST', '/guides', { body: { queries: [query], lang } });
  if (!r.guides?.length) throw new Error('Guide creation failed: ' + JSON.stringify(r));
  return r.guides[0];
}

export async function listGuides() {
  return call('GET', '/guides');
}

export async function scoreContent(guideId, content) {
  return call('POST', '/score', { body: { guideId, content, saveToGuide: false } });
}

export async function generateOutline(guideId) {
  await call('POST', '/outline', { query: { guideId } });
  return pollUntilReady('/outline', guideId, 'outline');
}

export async function generateIntent(guideId, content) {
  await call('POST', '/intent', { body: { guideId, ...(content ? { content } : {}) } });
  return pollUntilReady('/intent', guideId, 'intent');
}

export async function generateMeta(guideId) {
  await call('POST', '/meta', { query: { guideId } });
  return pollUntilReady('/meta', guideId, 'meta');
}

// CLI : node scripts/serpmantics.mjs <command> [args...]
const isMain = (() => {
  try {
    const argv1 = process.argv[1] ? resolve(process.argv[1]) : '';
    const here = fileURLToPath(import.meta.url);
    return argv1 === here;
  } catch {
    return false;
  }
})();

if (isMain) {
  const [cmd, ...args] = process.argv.slice(2);
  const commands = {
    credits: () => credits(),
    'create-guide': (q, lang) => createGuide(q, lang || 'fr'),
    'list-guides': () => listGuides(),
    score: async (guideId, file) => scoreContent(guideId, readFileSync(file, 'utf8')),
    outline: (guideId) => generateOutline(guideId),
    intent: (guideId, file) => generateIntent(guideId, file ? readFileSync(file, 'utf8') : undefined),
    meta: (guideId) => generateMeta(guideId),
  };
  if (!commands[cmd]) {
    console.error(`Usage: node scripts/serpmantics.mjs <${Object.keys(commands).join('|')}> [...args]`);
    process.exit(1);
  }
  commands[cmd](...args).then((r) => console.log(JSON.stringify(r, null, 2))).catch((e) => { console.error(e.message); process.exit(1); });
}
