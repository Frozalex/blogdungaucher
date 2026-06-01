#!/usr/bin/env node
/**
 * Extrait les sections « ## Questions fréquentes » inline des articles FR
 * et les convertit en `faq:` dans le frontmatter, pour qu'elles soient
 * rendues par le composant FAQ.astro (accordéon stylé) plutôt qu'en
 * markdown brut.
 *
 * - Détecte deux formats de questions : `### Question ?` et `**Question ?**`.
 * - La section commence à `## Questions fréquentes...` (insensible aux suffixes)
 *   ou `## FAQ` / `## Foire aux questions`, et se termine à la prochaine `## `
 *   ou à un séparateur horizontal `---`.
 * - Le frontmatter `faq:` est inséré avant la ligne `---` de fermeture.
 *   L'inline reste dans le body : `stripFaqH2Section` (utils existant) le
 *   masque automatiquement à l'affichage quand `faq:` est présent.
 * - N'écrase pas un `faq:` déjà présent dans le frontmatter.
 *
 * Usage : node scripts/inline-faq-to-frontmatter.mjs
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const FAQ_TITLE_RE = /^##\s+(Questions fréquentes|FAQ|Foire aux questions)/i;
const NEXT_H2_RE = /^##\s+/;

/** Découpe un fichier en {frontmatterRaw, frontmatterBody, body} où body est
 *  le markdown sous le second `---`. Retourne null si frontmatter absent. */
function splitFrontmatter(text) {
  // Retire un BOM UTF-8 éventuel
  if (text.charCodeAt(0) === 0xfeff) text = text.slice(1);
  const lines = text.split(/\r?\n/);
  if (lines[0] !== "---") return null;
  let close = -1;
  for (let i = 1; i < lines.length; i++) {
    if (lines[i] === "---") { close = i; break; }
  }
  if (close === -1) return null;
  return {
    frontmatter: lines.slice(1, close).join("\n"),
    body: lines.slice(close + 1).join("\n"),
  };
}

/** Extrait la section FAQ inline du body. Retourne {questions: [...], bodyWithoutFaq: ...}
 *  ou null si pas de section FAQ inline trouvée. */
function extractFaqSection(body) {
  const lines = body.split("\n");
  let start = -1;
  for (let i = 0; i < lines.length; i++) {
    if (FAQ_TITLE_RE.test(lines[i])) { start = i; break; }
  }
  if (start === -1) return null;

  // Cherche la fin de la section (prochain ## non-### ou séparateur '---' isolé).
  let end = lines.length;
  for (let i = start + 1; i < lines.length; i++) {
    if (NEXT_H2_RE.test(lines[i])) { end = i; break; }
    if (lines[i].trim() === "---") { end = i; break; }
  }

  const section = lines.slice(start + 1, end);
  const questions = parseQuestions(section);
  if (questions.length === 0) return null;

  return { questions, start, end };
}

/** Parse les questions/réponses depuis les lignes d'une section FAQ inline. */
function parseQuestions(sectionLines) {
  const out = [];
  let current = null;

  const flush = () => {
    if (!current) return;
    const answer = current.answerLines.join("\n").trim();
    if (current.question && answer) {
      out.push({ question: current.question, answer });
    }
    current = null;
  };

  for (const line of sectionLines) {
    // Format A : ### Question ?
    const h3 = line.match(/^###\s+(.+?)\s*$/);
    if (h3) {
      flush();
      current = { question: h3[1].trim(), answerLines: [] };
      continue;
    }
    // Format B : **Question ?** (en début de ligne, paragraphe entièrement gras)
    const bold = line.match(/^\*\*(.+?)\*\*\s*$/);
    if (bold) {
      flush();
      current = { question: bold[1].trim(), answerLines: [] };
      continue;
    }
    if (current) {
      current.answerLines.push(line);
    }
  }
  flush();
  return out;
}

/** Convertit le markdown inline (gras / italique / lien) en HTML, parce que
 *  le composant FAQ.astro injecte la réponse via `set:html`. */
function mdInlineToHtml(text) {
  return text
    // Liens [texte](url)
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    // Gras **x** (avant l'italique pour éviter de capturer * isolés à l'intérieur)
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    // Italique *x* (non précédé d'un autre *)
    .replace(/(^|[^*])\*([^*\n]+)\*/g, "$1<em>$2</em>")
    // Code inline `x`
    .replace(/`([^`]+)`/g, "<code>$1</code>");
}

/** Sérialise les Q/A en YAML avec `>-` pour les réponses multi-lignes. */
function serializeFaqYaml(questions) {
  const lines = ["faq:"];
  for (const { question, answer } of questions) {
    const qEscaped = question.replace(/"/g, '\\"');
    lines.push(`  - question: "${qEscaped}"`);
    // Réponse en bloc >- (newlines pliés), indentation 6 espaces.
    lines.push("    answer: >-");
    // Convertit la mise en forme inline markdown → HTML.
    const html = mdInlineToHtml(answer);
    const flat = html
      .split(/\n\s*\n/)
      .map((p) => p.replace(/\s+/g, " ").trim())
      .filter(Boolean)
      .join(" ");
    // Wrap manuel pour rester lisible (≈ 100 cols)
    const words = flat.split(" ");
    let lineBuf = "      ";
    for (const word of words) {
      if (lineBuf.length + word.length + 1 > 110) {
        lines.push(lineBuf.trimEnd());
        lineBuf = "      ";
      }
      lineBuf += word + " ";
    }
    if (lineBuf.trim()) lines.push(lineBuf.trimEnd());
  }
  return lines.join("\n");
}

function processFile(filepath) {
  const raw = readFileSync(filepath, "utf8");
  const split = splitFrontmatter(raw);
  if (!split) return { filepath, status: "no-frontmatter" };

  // Si déjà un faq: → on ne touche pas
  if (/^faq:\s*$/m.test(split.frontmatter) || /^faq:\s*\[/m.test(split.frontmatter)) {
    return { filepath, status: "already-has-faq" };
  }

  const extracted = extractFaqSection(split.body);
  if (!extracted) return { filepath, status: "no-inline-faq" };

  const yamlFaq = serializeFaqYaml(extracted.questions);
  // Insère le bloc faq: à la fin du frontmatter
  const newFrontmatter = split.frontmatter.replace(/\s*$/, "") + "\n" + yamlFaq;
  const newRaw = ["---", newFrontmatter, "---", split.body].join("\n");

  writeFileSync(filepath, newRaw, "utf8");
  return { filepath, status: "converted", count: extracted.questions.length };
}

function walkMd(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) out.push(...walkMd(p));
    else if (name.endsWith(".md")) out.push(p);
  }
  return out;
}

const allMd = walkMd("src/content/blog");
const files = allMd.filter((f) => {
  const content = readFileSync(f, "utf8");
  return /^##\s+(Questions fréquentes|FAQ|Foire aux questions)/im.test(content);
});

let converted = 0, skipped = 0;
for (const f of files) {
  const res = processFile(f);
  if (res.status === "converted") {
    converted++;
    console.log(`✓ ${f}  →  ${res.count} Q/A`);
  } else {
    skipped++;
    console.log(`-  ${f}  (${res.status})`);
  }
}
console.log(`\n${converted} fichiers convertis, ${skipped} ignorés.`);
