#!/usr/bin/env node
/**
 * Injecte un bloc "## Pour aller plus loin" à la fin de chaque article FR
 * orphelin (aucun lien interne sortant), avec les 3 meilleurs candidats
 * suggérés par la même heuristique que internal-linking-report.mjs.
 *
 * - Dry-run par défaut : n'écrit rien, affiche un récap.
 * - Passe --apply pour écrire réellement les modifications.
 * - Ignore les articles qui contiennent déjà "Pour aller plus loin".
 * - Ne touche jamais le frontmatter.
 *
 * Usage : node scripts/internal-linking-apply.mjs [--apply]
 */

import { readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join, basename } from "node:path";

const BLOG_DIR = "src/content/blog";
const APPLY = process.argv.includes("--apply");
const MAX_LINKS = 3;
const MIN_SCORE = 5;

const STOPWORDS = new Set([
  "le", "la", "les", "un", "une", "des", "du", "de", "d", "l",
  "et", "ou", "mais", "donc", "car", "ni", "or", "que", "qui", "quoi",
  "ce", "cet", "cette", "ces", "se", "sa", "son", "ses", "leur", "leurs",
  "à", "au", "aux", "en", "dans", "sur", "sous", "par", "pour", "avec",
  "sans", "vers", "chez", "entre", "comme", "si", "non", "ne", "pas",
  "plus", "moins", "très", "trop", "peu", "tout", "toute", "tous", "toutes",
  "on", "il", "elle", "ils", "elles", "nous", "vous", "tu", "je", "me", "te",
  "y", "lui", "leur", "même", "aussi", "déjà", "encore", "alors", "puis",
  "être", "avoir", "faire", "dire", "voir", "savoir", "pouvoir", "vouloir",
  "est", "sont", "était", "étaient", "été", "a", "ont", "avait", "avaient",
  "fait", "font", "dit", "dits", "vu", "vus", "su", "sue",
  "ça", "cela", "ceci", "celui", "celle", "ceux", "celles",
  "c", "qu", "n", "s", "t", "m", "j",
]);

function walkBlog(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    const s = statSync(p);
    if (s.isDirectory()) out.push(...walkBlog(p));
    else if (entry.endsWith(".md")) out.push(p);
  }
  return out;
}

function parseFrontmatter(raw) {
  const m = raw.match(/^[﻿]?---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/);
  if (!m) return { data: {}, body: raw, fmText: "", split: -1 };
  const [, fm, body] = m;
  const data = {};
  const lines = fm.split(/\r?\n/);
  let currentKey = null;
  let multilineValue = "";
  let inMultiline = false;
  let listKey = null;
  for (const line of lines) {
    if (inMultiline) {
      if (/^\s{2,}\S/.test(line)) {
        multilineValue += " " + line.trim();
        continue;
      } else {
        data[currentKey] = multilineValue.trim().replace(/^["']|["']$/g, "");
        inMultiline = false;
        multilineValue = "";
      }
    }
    if (listKey) {
      if (/^\s{2,}-\s+/.test(line)) {
        data[listKey].push(line.replace(/^\s*-\s+/, "").trim().replace(/^["']|["']$/g, ""));
        continue;
      } else {
        listKey = null;
      }
    }
    const kv = line.match(/^([a-zA-Z_][a-zA-Z0-9_]*)\s*:\s*(.*)$/);
    if (!kv) continue;
    const [, key, valRaw] = kv;
    const val = valRaw.trim();
    if (val === ">-" || val === ">" || val === "|") {
      currentKey = key;
      inMultiline = true;
      multilineValue = "";
    } else if (val === "") {
      listKey = key;
      data[key] = [];
    } else {
      data[key] = val.replace(/^["']|["']$/g, "");
    }
  }
  return { data, body, fmText: fm };
}

function tokenize(text) {
  return (text || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length >= 3 && !STOPWORDS.has(t));
}

function slugOf(path) {
  return basename(path).replace(/\.md$/, "");
}

function extractInternalLinks(body) {
  const links = new Set();
  const re = /\]\(\/fr\/blog\/([a-z0-9-]+)\//gi;
  let m;
  while ((m = re.exec(body)) !== null) links.add(m[1]);
  return links;
}

function loadArticles() {
  const paths = walkBlog(BLOG_DIR);
  return paths.map((path) => {
    const raw = readFileSync(path, "utf8");
    const { data, body } = parseFrontmatter(raw);
    const slug = slugOf(path);
    const tagList = Array.isArray(data.tags) ? data.tags : [];
    const tags = new Set(tagList.map((t) => t.toLowerCase()));
    const tokens = new Set([
      ...tokenize(data.title),
      ...tokenize(data.excerpt),
      ...tokenize(data.seoTitle),
      ...tokenize(data.seoDescription),
      ...tokenize(tagList.join(" ")),
      ...tokenize(data.pillar),
    ]);
    return {
      slug,
      path,
      raw,
      body,
      category: data.category,
      pillar: data.pillar || "",
      title: data.title || slug,
      tags,
      tokens,
      outgoing: extractInternalLinks(body),
      hasFooterBlock: /## Pour aller plus loin/i.test(body) || /## À lire aussi/i.test(body),
    };
  });
}

function similarity(a, b) {
  if (a.slug === b.slug) return -1;
  const tagInter = [...a.tags].filter((t) => b.tags.has(t)).length;
  const tokenInter = [...a.tokens].filter((t) => b.tokens.has(t)).length;
  const tokenUnion = a.tokens.size + b.tokens.size - tokenInter || 1;
  const jaccard = tokenInter / tokenUnion;
  const sameCat = a.category === b.category ? 1 : 0;
  const samePillar = a.pillar && b.pillar && a.pillar === b.pillar ? 1 : 0;
  return tagInter * 4 + jaccard * 20 + sameCat * 1.5 + samePillar * 1.5;
}

function buildFooterBlock(suggestions) {
  const bullets = suggestions
    .map((s) => `- [${s.other.title}](/fr/blog/${s.other.slug}/)`)
    .join("\n");
  return `\n## Pour aller plus loin\n\n${bullets}\n`;
}

const articles = loadArticles();
const candidates = articles
  .filter((a) => a.outgoing.size === 0 && !a.hasFooterBlock)
  .map((a) => {
    const sugg = articles
      .map((other) => ({ other, score: similarity(a, other) }))
      .filter((x) => x.score >= MIN_SCORE)
      .sort((x, y) => y.score - x.score)
      .slice(0, MAX_LINKS);
    return { article: a, suggestions: sugg };
  })
  .filter((c) => c.suggestions.length >= 2);

console.log(`${candidates.length} articles candidats (orphelins avec ≥ 2 suggestions de score ≥ ${MIN_SCORE}).`);
console.log("");

let applied = 0;
for (const { article, suggestions } of candidates) {
  const block = buildFooterBlock(suggestions);
  const newRaw = article.raw.replace(/\s*$/, "") + "\n" + block;

  if (!APPLY) {
    console.log(`[DRY] ${article.category}/${article.slug}`);
    for (const s of suggestions) {
      console.log(`       → ${s.other.slug} (${s.score.toFixed(1)})`);
    }
  } else {
    writeFileSync(article.path, newRaw);
    applied++;
  }
}

if (!APPLY) {
  console.log("");
  console.log("Aucun fichier modifié. Relance avec --apply pour écrire.");
} else {
  console.log(`\n${applied} fichiers modifiés.`);
}
