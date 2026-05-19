// Sweep mécanique des crimes éditoriaux Winston sur tous les articles blog.
// Crimes traités :
//   #2 — Supprimer la phrase "Bienvenue dans X"
//   #3 — Supprimer la ligne "**Plan :** ..."
//   #4 — Déplacer le blockquote "L'essentiel en X points" en fin d'article comme "À retenir"
//
// Usage:
//   node scripts/sweep-crimes.mjs --dry        (rapport, aucune écriture)
//   node scripts/sweep-crimes.mjs --apply      (applique les changements)
//   node scripts/sweep-crimes.mjs --file=path  (applique sur 1 seul fichier)

import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const BLOG_DIR = 'src/content/blog';
const args = process.argv.slice(2);
const DRY = args.includes('--dry');
const APPLY = args.includes('--apply');
const fileArg = args.find((a) => a.startsWith('--file='));
const ONLY_FILE = fileArg ? fileArg.slice('--file='.length) : null;

if (!DRY && !APPLY && !ONLY_FILE) {
  console.error('Use --dry or --apply (or --file=<path>)');
  process.exit(1);
}

function splitFrontmatter(src) {
  // Gère le BOM UTF-8 (﻿) et les frontmatters vides parasites avant le vrai.
  // Cherche un frontmatter contenant "title:" (signe qu'il est réel).
  // Scanne plusieurs candidats si nécessaire.
  let rest = src;
  const candidates = [];
  while (true) {
    const m = rest.match(/^[﻿\s]*---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
    if (!m) break;
    candidates.push({ frontmatter: m[1], body: m[2], prefix: rest.slice(0, rest.indexOf('---')) });
    if (/^title:/m.test(m[1])) {
      // Frontmatter valide trouvé.
      return { frontmatter: m[1], body: m[2], leadingGarbage: src.slice(0, src.length - rest.length) };
    }
    rest = m[2];
  }
  return { frontmatter: '', body: src, unparseable: true };
}

function joinFrontmatter(frontmatter, body) {
  return `---\n${frontmatter}\n---\n${body}`;
}

function stripPlanLine(body) {
  // Cible UNIQUEMENT "**Plan :**" (route éditoriale), JAMAIS "**Plan suggéré :**"
  // (sujets de grand oral, contenu pédagogique légitime).
  // Le négative lookahead garantit qu'on n'attrape pas "Plan suggéré".
  const linePattern = /\*\*Plan\s*:\*\*(?!\s*\n)[^\n]*\n/;
  // Cas 1 : Plan précédé d'une ligne vide (cas normal).
  const re1 = new RegExp('\\n\\n' + linePattern.source);
  if (re1.test(body)) {
    return { body: body.replace(re1, '\n'), changed: true };
  }
  // Cas 2 : Plan en tout début de body, précédé seulement d'un \n.
  const re2 = new RegExp('^\\n?' + linePattern.source + '\\n?');
  if (re2.test(body)) {
    return { body: body.replace(re2, ''), changed: true };
  }
  return { body, changed: false };
}

function stripBienvenueDans(body) {
  // Supprime un paragraphe "Bienvenue dans X" (ligne isolée).
  // On enlève les sauts adjacents pour éviter les doubles blancs.
  const re = /\n\nBienvenue dans [^\n]*\n/;
  if (re.test(body)) {
    return { body: body.replace(re, '\n'), changed: true };
  }
  return { body, changed: false };
}

function moveEssentielBlock(body) {
  // Capture le blockquote complet:  > **L'essentiel en X points :**\n> - ...\n> - ...
  // (consécutif de lignes commençant par "> ").
  const lines = body.split('\n');
  let startIdx = -1;
  for (let i = 0; i < lines.length; i++) {
    if (/^>\s*\*\*L['’]essentiel/.test(lines[i])) {
      startIdx = i;
      break;
    }
  }
  if (startIdx === -1) return { body, changed: false };

  let endIdx = startIdx;
  while (endIdx + 1 < lines.length && lines[endIdx + 1].startsWith('>')) {
    endIdx++;
  }

  // Extraction du blockquote
  const blockLines = lines.slice(startIdx, endIdx + 1);
  // Nettoyage: enlever "> **L'essentiel...**" et garder les "- bullet"
  const cleaned = blockLines
    .filter((l, i) => i > 0) // skip header line
    .map((l) => l.replace(/^>\s?/, '').trim())
    .filter((l) => l.length > 0);

  // Supprimer le bloc + ligne vide suivante (et précédente si double-blanc)
  const tail = lines.slice(endIdx + 1);
  let cutAfter = 0;
  if (tail[0] === '') cutAfter = 1;
  let head = lines.slice(0, startIdx);
  // Si head se termine par une ligne vide ET que tail commence par une ligne vide, on en enlève une de plus pour éviter triple-blanc
  while (head.length >= 2 && head[head.length - 1] === '' && head[head.length - 2] === '') {
    head = head.slice(0, -1);
  }
  const newLines = [...head, ...tail.slice(cutAfter)];
  let newBody = newLines.join('\n');

  // Supprimer un doublon "## À retenir" préexistant (par sécurité).
  newBody = newBody.replace(/\n## À retenir\n[\s\S]*?(?=\n## |\n---\n\n\*|$)/, '\n');

  const retenirBlock = `## À retenir\n\n${cleaned.map((l) => l.startsWith('-') ? l : `- ${l}`).join('\n')}\n`;

  // Insertion : on cherche, dans l'ordre :
  //   1. Avant "### Sources et références" (présente dans la majorité des articles)
  //   2. Avant un "---" final suivi d'italique conclusif
  //   3. À la toute fin
  const sourcesRe = /\n+(### Sources et r[ée]f[ée]rences)/;
  const italRe = /\n+---\n+(\*[^*]+\*\s*\n?)\s*$/;
  if (sourcesRe.test(newBody)) {
    newBody = newBody.replace(sourcesRe, (m, h) => `\n\n${retenirBlock}\n${h}`);
  } else if (italRe.test(newBody)) {
    newBody = newBody.replace(italRe, (m, ital) => `\n\n${retenirBlock}\n---\n\n${ital}\n`);
  } else {
    newBody = newBody.replace(/\s*$/, '') + '\n\n' + retenirBlock;
  }

  return { body: newBody, changed: true, captured: cleaned.length };
}

async function processFile(path) {
  const raw = await readFile(path, 'utf8');
  // Détecte le style de saut prédominant pour le réécrire à l'identique.
  const hadCRLF = raw.includes('\r\n');
  // Normalisation LF pour toutes les opérations regex / split.
  const src = raw.replace(/\r\n/g, '\n');
  const split = splitFrontmatter(src);
  if (split.unparseable) {
    return { path, changed: false, stats: { plan: false, bienvenue: false, essentiel: 0 }, skipped: true };
  }
  const { frontmatter, body, leadingGarbage = '' } = split;

  const stats = { plan: false, bienvenue: false, essentiel: 0 };
  let current = body;

  const r1 = stripPlanLine(current);
  current = r1.body;
  stats.plan = r1.changed;

  const r2 = stripBienvenueDans(current);
  current = r2.body;
  stats.bienvenue = r2.changed;

  const r3 = moveEssentielBlock(current);
  current = r3.body;
  if (r3.changed) stats.essentiel = r3.captured;

  const changed = stats.plan || stats.bienvenue || stats.essentiel > 0;
  if (!changed) return { path, changed: false, stats };

  let next = leadingGarbage + joinFrontmatter(frontmatter, current);
  // Restaure le style de saut original si CRLF.
  if (hadCRLF) next = next.replace(/\n/g, '\r\n');
  if (APPLY || ONLY_FILE) {
    await writeFile(path, next, 'utf8');
  }
  return { path, changed: true, stats, preview: ONLY_FILE ? next : null };
}

async function main() {
  let files;
  if (ONLY_FILE) {
    files = [ONLY_FILE];
  } else {
    const entries = await readdir(BLOG_DIR);
    files = entries.filter((f) => f.endsWith('.md')).map((f) => join(BLOG_DIR, f));
  }

  const totals = { plan: 0, bienvenue: 0, essentiel: 0, files: 0 };
  const reports = [];
  for (const f of files) {
    const r = await processFile(f);
    if (r.changed) {
      totals.files++;
      if (r.stats.plan) totals.plan++;
      if (r.stats.bienvenue) totals.bienvenue++;
      if (r.stats.essentiel) totals.essentiel++;
      reports.push(`${r.path} — plan:${r.stats.plan} bienvenue:${r.stats.bienvenue} essentiel:${r.stats.essentiel}`);
    }
  }
  console.log(reports.join('\n'));
  console.log(`\n=== Totaux ===`);
  console.log(`Fichiers modifiés : ${totals.files}`);
  console.log(`Crime #3 (Plan)        : ${totals.plan}`);
  console.log(`Crime #2 (Bienvenue)   : ${totals.bienvenue}`);
  console.log(`Crime #4 (Essentiel)   : ${totals.essentiel}`);
  if (DRY) console.log('\n(--dry : aucun fichier écrit)');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
