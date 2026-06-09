#!/usr/bin/env node
/**
 * Génère un .docx par article de blog EN (hors Grand Oral) dont l'article FR
 * correspondant est déjà publié. Lit les fichiers .md directement.
 * Sortie dans exports/docs-en/{enSlug}.docx (local, non versionné).
 *
 * Usage : node scripts/generate-docx-en.mjs
 */

import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import { resolve, dirname, join, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Packer, Document, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, WidthType, BorderStyle, AlignmentType, ShadingType, convertInchesToTwip } from 'docx';
import { marked } from 'marked';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const BLOG_DIR = resolve(ROOT, 'src', 'content', 'blog');
const EN_DIR = resolve(ROOT, 'src', 'content', 'blog-translations', 'en');
const OUT_DIR = resolve(ROOT, 'exports', 'docs-en');

// ─── Parseur frontmatter ──────────────────────────────────────────────────────

function parseFrontmatter(raw) {
  const cleaned = raw.replace(/^﻿/, '');
  if (!cleaned.startsWith('---')) return null;
  const rest = cleaned.slice(3);
  const closeMatch = rest.match(/\r?\n---[ \t]*(\r?\n|$)/);
  if (!closeMatch) return null;
  const fmRaw = rest.slice(0, closeMatch.index);
  const body = rest.slice(closeMatch.index + closeMatch[0].length);
  const meta = {};
  for (const line of fmRaw.split(/\r?\n/)) {
    if (/^\s/.test(line)) continue;
    const colon = line.indexOf(':');
    if (colon < 0) continue;
    const key = line.slice(0, colon).trim();
    const val = line.slice(colon + 1).trim().replace(/^["']|["']$/g, '');
    meta[key] = val;
  }
  return { meta, body };
}

// ─── Slugs FR publiés ─────────────────────────────────────────────────────────

const TODAY = new Date().toISOString().slice(0, 10);

function listMarkdownFiles(dir) {
  const out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...listMarkdownFiles(full));
    else if (entry.name.endsWith('.md')) out.push(full);
  }
  return out;
}

function getPublishedFrSlugs() {
  const slugs = new Set();
  for (const full of listMarkdownFiles(BLOG_DIR)) {
    if (full.replace(/\\/g, '/').includes('/grand-oral/')) continue;
    const raw = readFileSync(full, 'utf8');
    const parsed = parseFrontmatter(raw);
    if (!parsed) continue;
    const { meta } = parsed;
    if (meta.draft === 'true') continue;
    const publishDate = meta.publishDate || '';
    if (!publishDate || publishDate > TODAY) continue;
    slugs.add(basename(full, '.md'));
  }
  return slugs;
}

// ─── Découverte des articles EN ───────────────────────────────────────────────

function listPublishedEnArticles(publishedFrSlugs) {
  const articles = [];
  for (const entry of readdirSync(EN_DIR, { withFileTypes: true })) {
    if (!entry.name.endsWith('.md')) continue;
    const frSlug = basename(entry.name, '.md');
    if (!publishedFrSlugs.has(frSlug)) continue;
    const full = join(EN_DIR, entry.name);
    const raw = readFileSync(full, 'utf8');
    const parsed = parseFrontmatter(raw);
    if (!parsed) continue;
    const { meta, body } = parsed;
    if (meta.draft === 'true') continue;
    const enSlug = meta.enSlug || frSlug;
    articles.push({
      frSlug,
      enSlug,
      title: (meta.title || frSlug).replace(/^["']|["']$/g, ''),
      body,
    });
  }
  articles.sort((a, b) => a.frSlug.localeCompare(b.frSlug));
  return articles;
}

// ─── Conversion markdown → éléments docx ─────────────────────────────────────

const HEADING_LEVELS = [
  HeadingLevel.HEADING_1,
  HeadingLevel.HEADING_2,
  HeadingLevel.HEADING_3,
  HeadingLevel.HEADING_4,
  HeadingLevel.HEADING_5,
  HeadingLevel.HEADING_6,
];

function inlineToRuns(tokens, ctx = {}) {
  const runs = [];
  for (const tok of (tokens || [])) {
    const { bold = false, italics = false } = ctx;
    switch (tok.type) {
      case 'text':
      case 'escape':
        runs.push(new TextRun({ text: tok.text ?? tok.raw ?? '', bold, italics }));
        break;
      case 'strong':
        runs.push(...inlineToRuns(tok.tokens, { ...ctx, bold: true }));
        break;
      case 'em':
        runs.push(...inlineToRuns(tok.tokens, { ...ctx, italics: true }));
        break;
      case 'codespan':
        runs.push(new TextRun({ text: tok.text, font: { name: 'Courier New' }, size: 18, bold, italics }));
        break;
      case 'link':
        runs.push(...inlineToRuns(tok.tokens?.length ? tok.tokens : [{ type: 'text', text: tok.text }], ctx));
        break;
      case 'html':
        runs.push(new TextRun({ text: tok.text.replace(/<[^>]+>/g, ''), bold, italics }));
        break;
      case 'br':
        runs.push(new TextRun({ text: '', break: 1 }));
        break;
      default:
        if (tok.raw) runs.push(new TextRun({ text: tok.raw, bold, italics }));
    }
  }
  return runs;
}

function listItemToElements(item, ordered, level = 0) {
  const indent = convertInchesToTwip(0.25 * (level + 1));
  const elements = [];
  const runs = inlineToRuns(item.tokens?.filter(t => t.type !== 'list') ?? []);
  if (runs.length > 0) {
    elements.push(new Paragraph({
      children: runs,
      bullet: ordered ? undefined : { level },
      numbering: ordered ? { reference: 'default-numbering', level } : undefined,
      indent: { left: indent },
      spacing: { after: 60 },
    }));
  }
  for (const child of (item.tokens ?? [])) {
    if (child.type === 'list') {
      for (const subItem of child.items) {
        elements.push(...listItemToElements(subItem, child.ordered, level + 1));
      }
    }
  }
  return elements;
}

function tableToDocx(tok) {
  const headerRow = new TableRow({
    children: (tok.header || []).map(cell => new TableCell({
      children: [new Paragraph({ children: inlineToRuns(cell.tokens), alignment: AlignmentType.LEFT })],
      shading: { fill: 'EEEEEE', type: ShadingType.SOLID },
    })),
    tableHeader: true,
  });
  const rows = (tok.rows || []).map(row => new TableRow({
    children: row.map(cell => new TableCell({
      children: [new Paragraph({ children: inlineToRuns(cell.tokens) })],
    })),
  }));
  return new Table({
    rows: [headerRow, ...rows],
    width: { size: 100, type: WidthType.PERCENTAGE },
    margins: { top: 60, bottom: 60, left: 100, right: 100 },
  });
}

function tokensToElements(tokens) {
  const elements = [];
  for (const tok of tokens) {
    switch (tok.type) {
      case 'heading': {
        const level = HEADING_LEVELS[Math.min(tok.depth - 1, 5)];
        elements.push(new Paragraph({ heading: level, children: inlineToRuns(tok.tokens) }));
        break;
      }
      case 'paragraph':
        elements.push(new Paragraph({ children: inlineToRuns(tok.tokens), spacing: { after: 120 } }));
        break;
      case 'blockquote':
        for (const child of tokensToElements(tok.tokens)) {
          if (child instanceof Paragraph) {
            elements.push(new Paragraph({
              children: child.options?.children ?? [],
              indent: { left: convertInchesToTwip(0.4) },
              border: { left: { color: '999999', style: BorderStyle.SINGLE, size: 12, space: 6 } },
              spacing: { after: 80 },
            }));
          } else {
            elements.push(child);
          }
        }
        break;
      case 'code': {
        for (const line of tok.text.split('\n')) {
          elements.push(new Paragraph({
            children: [new TextRun({ text: line || ' ', font: { name: 'Courier New' }, size: 18 })],
            shading: { fill: 'F5F5F5', type: ShadingType.SOLID },
            spacing: { line: 240, after: 0 },
          }));
        }
        elements.push(new Paragraph({ spacing: { after: 120 } }));
        break;
      }
      case 'list':
        for (const item of tok.items) {
          elements.push(...listItemToElements(item, tok.ordered));
        }
        elements.push(new Paragraph({ spacing: { after: 80 } }));
        break;
      case 'hr':
        elements.push(new Paragraph({
          border: { bottom: { color: 'CCCCCC', style: BorderStyle.SINGLE, size: 6, space: 1 } },
          spacing: { after: 160 },
        }));
        break;
      case 'table':
        elements.push(tableToDocx(tok));
        elements.push(new Paragraph({ spacing: { after: 120 } }));
        break;
      case 'space':
        elements.push(new Paragraph({ spacing: { after: 80 } }));
        break;
      case 'html':
        break;
      default:
        if (tok.raw?.trim()) {
          elements.push(new Paragraph({ children: [new TextRun(tok.raw.trim())], spacing: { after: 120 } }));
        }
    }
  }
  return elements;
}

// ─── Génération du fichier .docx ─────────────────────────────────────────────

async function generateDocx({ enSlug, title, body }) {
  const tokens = marked.lexer(body);
  const bodyElements = tokensToElements(tokens);

  const doc = new Document({
    creator: "Blog d'un Gaucher",
    title,
    subject: 'Chess',
    sections: [{
      properties: {
        page: {
          margin: {
            top: convertInchesToTwip(1.1),
            bottom: convertInchesToTwip(1.2),
            left: convertInchesToTwip(1.1),
            right: convertInchesToTwip(1.1),
          },
        },
      },
      children: [
        new Paragraph({
          heading: HeadingLevel.TITLE,
          children: [new TextRun({ text: title, bold: true })],
          spacing: { after: 120 },
        }),
        new Paragraph({
          children: [new TextRun({ text: 'blogdungaucher.com', italics: true, color: '666666', size: 18 })],
          spacing: { after: 240 },
        }),
        new Paragraph({
          border: { bottom: { color: 'CCCCCC', style: BorderStyle.SINGLE, size: 6, space: 1 } },
          spacing: { after: 240 },
        }),
        ...bodyElements,
      ],
    }],
  });

  const buffer = await Packer.toBuffer(doc);
  const outPath = join(OUT_DIR, `${enSlug}.docx`);
  writeFileSync(outPath, buffer);
  return outPath;
}

// ─── Pipeline principal ───────────────────────────────────────────────────────

async function main() {
  mkdirSync(OUT_DIR, { recursive: true });

  const publishedFrSlugs = getPublishedFrSlugs();
  const articles = listPublishedEnArticles(publishedFrSlugs);
  console.log(`📋 ${articles.length} articles EN publiés (≤ ${TODAY}) → DOCX\n`);

  let ok = 0;
  let fail = 0;
  for (let i = 0; i < articles.length; i++) {
    const art = articles[i];
    process.stdout.write(`  [${i + 1}/${articles.length}] ${art.enSlug} …`);
    try {
      const outPath = await generateDocx(art);
      const sizeKb = Math.round(readFileSync(outPath).length / 1024);
      process.stdout.write(` ✅ ${sizeKb} KB\n`);
      ok++;
    } catch (e) {
      process.stdout.write(` ❌ ${e.message}\n`);
      if (process.env.DEBUG) console.error(e.stack);
      fail++;
    }
  }

  console.log(`\n📄 ${ok} fichiers dans : ${OUT_DIR}`);
  if (fail) console.log(`⚠️  ${fail} erreurs`);
}

main().catch((e) => {
  console.error('Erreur fatale :', e);
  process.exit(1);
});
