#!/usr/bin/env node
/**
 * Génère un .docx par article de blog (hors Grand Oral) déjà publié.
 * Lit les fichiers .md directement — aucun serveur ni build nécessaire.
 * Sortie dans exports/docs/{slug}.docx (local, non versionné).
 *
 * Usage : node scripts/generate-docx.mjs
 */

import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import { resolve, dirname, join, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Packer, Document, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, WidthType, BorderStyle, AlignmentType, ShadingType, convertInchesToTwip } from 'docx';
import { marked } from 'marked';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const BLOG_DIR = resolve(ROOT, 'src', 'content', 'blog');
const OUT_DIR = resolve(ROOT, 'exports', 'docs');

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

// ─── Découverte des articles ──────────────────────────────────────────────────

function listMarkdownFiles(dir) {
  const out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...listMarkdownFiles(full));
    else if (entry.name.endsWith('.md')) out.push(full);
  }
  return out;
}

const TODAY = new Date().toISOString().slice(0, 10);

function listPublishedBlogArticles() {
  const files = listMarkdownFiles(BLOG_DIR);
  const articles = [];
  for (const full of files) {
    if (full.replace(/\\/g, '/').includes('/grand-oral/')) continue;
    const raw = readFileSync(full, 'utf8');
    const parsed = parseFrontmatter(raw);
    if (!parsed) continue;
    const { meta, body } = parsed;
    if (meta.draft === 'true') continue;
    const publishDate = meta.publishDate || '';
    if (!publishDate || publishDate > TODAY) continue;
    articles.push({
      slug: basename(full, '.md'),
      title: (meta.title || basename(full, '.md')).replace(/^["']|["']$/g, ''),
      category: meta.category || '',
      publishDate,
      body,
    });
  }
  articles.sort((a, b) => b.publishDate.localeCompare(a.publishDate));
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

// Convertit les tokens inline (marked) en TextRun[]
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
        // Affiche le texte du lien (pas de lien cliquable pour simplifier)
        runs.push(...inlineToRuns(tok.tokens?.length ? tok.tokens : [{ type: 'text', text: tok.text }], ctx));
        break;
      case 'html':
        // Supprime les balises HTML
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

// Convertit un token de liste item en paragraphes (peut être récursif)
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
  // Sous-listes
  for (const child of (item.tokens ?? [])) {
    if (child.type === 'list') {
      for (const subItem of child.items) {
        elements.push(...listItemToElements(subItem, child.ordered, level + 1));
      }
    }
  }
  return elements;
}

// Crée une table docx depuis un token table de marked
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

// Convertit les tokens de bloc en éléments docx
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
          // Ajouter une indentation gauche aux paragraphes du blockquote
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
        // Bloc de code : chaque ligne est un paragraphe monospace sur fond gris
        const lines = tok.text.split('\n');
        for (const line of lines) {
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
        // Ignorer le HTML brut (images SVG, blocs Astro, etc.)
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

const CATEGORY_LABELS = { esprit: 'Esprit', science: 'Science', societe: 'Société' };

async function generateDocx({ slug, title, category, publishDate, body }) {
  const catLabel = CATEGORY_LABELS[category] || category;
  const dateLabel = publishDate.split('-').reverse().join('/');

  const tokens = marked.lexer(body);
  const bodyElements = tokensToElements(tokens);

  const doc = new Document({
    creator: "Blog d'un Gaucher",
    title,
    subject: catLabel,
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
        // Titre de l'article
        new Paragraph({
          heading: HeadingLevel.TITLE,
          children: [new TextRun({ text: title, bold: true })],
          spacing: { after: 120 },
        }),
        // Ligne de métadonnées
        new Paragraph({
          children: [new TextRun({ text: `${catLabel} · ${dateLabel} · blogdungaucher.com`, italics: true, color: '666666', size: 18 })],
          spacing: { after: 240 },
        }),
        // Séparateur
        new Paragraph({
          border: { bottom: { color: 'CCCCCC', style: BorderStyle.SINGLE, size: 6, space: 1 } },
          spacing: { after: 240 },
        }),
        // Corps de l'article
        ...bodyElements,
      ],
    }],
  });

  const buffer = await Packer.toBuffer(doc);
  const outPath = join(OUT_DIR, `${slug}.docx`);
  writeFileSync(outPath, buffer);
  return outPath;
}

// ─── Pipeline principal ───────────────────────────────────────────────────────

async function main() {
  mkdirSync(OUT_DIR, { recursive: true });
  const articles = listPublishedBlogArticles();
  console.log(`📋 ${articles.length} articles publiés (≤ ${TODAY}) → DOCX\n`);

  let ok = 0;
  let fail = 0;
  for (let i = 0; i < articles.length; i++) {
    const art = articles[i];
    process.stdout.write(`  [${i + 1}/${articles.length}] ${art.slug} …`);
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
