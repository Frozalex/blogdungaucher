#!/usr/bin/env node
/**
 * Rapport de maillage interne.
 *
 * Pour chaque article FR de src/content/blog/, propose 3-5 articles candidats
 * à lier, en croisant : tags communs, catégorie, pilier, cooccurrence de
 * termes dans titre/excerpt/seoDescription, en excluant les liens déjà posés.
 *
 * Sortie : docs/maillage-interne-rapport.md (non versionné par défaut).
 *
 * Usage : node scripts/internal-linking-report.mjs
 */

import { readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join, basename } from "node:path";

const BLOG_DIR = "src/content/blog";
const OUTPUT = "docs/maillage-interne-rapport.md";
const TOP_K = 5;

/** Mots vides FR à ignorer pour le scoring de cooccurrence. */
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
  "1", "2", "3", "4", "5", "6", "7", "8", "9", "10",
  "20", "30", "40", "50", "60", "70", "80", "90", "100",
]);

/** Lit récursivement tous les .md sous BLOG_DIR. */
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

/** Parse le frontmatter YAML très basiquement (les clés qui nous intéressent). */
function parseFrontmatter(raw) {
  const m = raw.match(/^[﻿]?---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/);
  if (!m) return { data: {}, body: raw };
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
  return { data, body };
}

/** Tokenise un texte FR en bag-of-words (sans stopwords, sans accents normalisés). */
function tokenize(text) {
  return (text || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length >= 3 && !STOPWORDS.has(t));
}

/** Retourne le slug d'un article à partir de son chemin. */
function slugOf(path) {
  return basename(path).replace(/\.md$/, "");
}

/** Liens internes déjà présents dans le body. Match /fr/blog/<slug>/. */
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
      category: data.category,
      pillar: data.pillar || "",
      title: data.title || slug,
      tags,
      tokens,
      outgoing: extractInternalLinks(body),
    };
  });
}

/** Score de proximité entre deux articles (heuristique simple). */
function similarity(a, b) {
  if (a.slug === b.slug) return -1;
  const tagInter = [...a.tags].filter((t) => b.tags.has(t)).length;
  const tokenInter = [...a.tokens].filter((t) => b.tokens.has(t)).length;
  const tokenUnion = a.tokens.size + b.tokens.size - tokenInter || 1;
  const jaccard = tokenInter / tokenUnion;
  const sameCat = a.category === b.category ? 1 : 0;
  const samePillar = a.pillar && b.pillar && a.pillar === b.pillar ? 1 : 0;
  // Pondération : tags = très fort, jaccard = moyen, cat/pillar = bonus
  return tagInter * 4 + jaccard * 20 + sameCat * 1.5 + samePillar * 1.5;
}

function suggestionsFor(article, all) {
  const scored = all
    .map((other) => ({ other, score: similarity(article, other) }))
    .filter((x) => x.score > 0)
    .filter((x) => !article.outgoing.has(x.other.slug))
    .sort((a, b) => b.score - a.score)
    .slice(0, TOP_K);
  return scored;
}

function reasonFor(a, b) {
  const sharedTags = [...a.tags].filter((t) => b.tags.has(t));
  const bits = [];
  if (sharedTags.length) bits.push(`tags partagés : ${sharedTags.slice(0, 3).join(", ")}`);
  if (a.category === b.category) bits.push(`même rubrique (${a.category})`);
  if (a.pillar && a.pillar === b.pillar) bits.push(`même pilier (${a.pillar})`);
  return bits.join(" · ") || "cooccurrence de termes";
}

function buildReport(articles) {
  const totalOutgoing = articles.reduce((acc, a) => acc + a.outgoing.size, 0);
  const orphans = articles.filter((a) => a.outgoing.size === 0);
  const incoming = new Map();
  for (const a of articles) {
    for (const slug of a.outgoing) incoming.set(slug, (incoming.get(slug) || 0) + 1);
  }
  const targetSet = new Set(articles.map((a) => a.slug));
  const noIncoming = articles.filter((a) => !incoming.has(a.slug));
  const brokenLinks = [];
  for (const a of articles) {
    for (const slug of a.outgoing) {
      if (!targetSet.has(slug)) brokenLinks.push({ from: a.slug, to: slug });
    }
  }

  const lines = [];
  lines.push("# Rapport de maillage interne");
  lines.push("");
  lines.push(`Généré le ${new Date().toISOString().slice(0, 10)}.`);
  lines.push("");
  lines.push("## Vue d'ensemble");
  lines.push("");
  lines.push(`- ${articles.length} articles FR analysés.`);
  lines.push(`- ${totalOutgoing} liens internes sortants au total (moyenne ${(totalOutgoing / articles.length).toFixed(2)} par article).`);
  lines.push(`- **${orphans.length} articles sans aucun lien sortant** (${((orphans.length / articles.length) * 100).toFixed(0)}%).`);
  lines.push(`- ${noIncoming.length} articles sans aucun lien entrant.`);
  lines.push(`- ${brokenLinks.length} liens internes pointant vers un slug inexistant.`);
  lines.push("");

  if (brokenLinks.length) {
    lines.push("## Liens cassés (à corriger)");
    lines.push("");
    for (const { from, to } of brokenLinks) {
      lines.push(`- \`${from}\` → \`${to}\` (cible introuvable)`);
    }
    lines.push("");
  }

  lines.push("## Articles orphelins (priorité)");
  lines.push("");
  lines.push("Articles sans aucun lien sortant. Pour chacun, jusqu'à " + TOP_K + " candidats à lier dans le corps.");
  lines.push("");

  for (const a of orphans) {
    const sugg = suggestionsFor(a, articles);
    if (!sugg.length) continue;
    lines.push(`### ${a.title}`);
    lines.push(`*\`${a.category}/${a.slug}\`*`);
    lines.push("");
    for (const { other, score } of sugg) {
      lines.push(`- **[${other.title}](/fr/blog/${other.slug}/)** — score ${score.toFixed(1)} · ${reasonFor(a, other)}`);
    }
    lines.push("");
  }

  lines.push("## Articles déjà liés mais qui peuvent en accueillir plus");
  lines.push("");
  lines.push("Articles avec au moins un lien sortant mais qui ont des candidats forts non encore liés.");
  lines.push("");
  const nonOrphans = articles.filter((a) => a.outgoing.size > 0);
  for (const a of nonOrphans) {
    const sugg = suggestionsFor(a, articles).filter((s) => s.score >= 8);
    if (!sugg.length) continue;
    lines.push(`### ${a.title}`);
    lines.push(`*\`${a.category}/${a.slug}\` · ${a.outgoing.size} lien(s) déjà posé(s)*`);
    lines.push("");
    for (const { other, score } of sugg.slice(0, 3)) {
      lines.push(`- **[${other.title}](/fr/blog/${other.slug}/)** — score ${score.toFixed(1)} · ${reasonFor(a, other)}`);
    }
    lines.push("");
  }

  lines.push("## Articles à promouvoir (sans lien entrant)");
  lines.push("");
  lines.push("Ces articles ne sont cités par aucun autre. Leur visibilité interne est nulle.");
  lines.push("");
  for (const a of noIncoming) {
    lines.push(`- \`${a.category}/${a.slug}\` — ${a.title}`);
  }
  lines.push("");

  return lines.join("\n");
}

const articles = loadArticles();
const report = buildReport(articles);
writeFileSync(OUTPUT, report);
console.log(`Rapport écrit : ${OUTPUT}`);
console.log(`${articles.length} articles, ${articles.filter((a) => a.outgoing.size === 0).length} orphelins.`);
