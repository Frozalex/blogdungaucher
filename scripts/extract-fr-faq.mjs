#!/usr/bin/env node
/**
 * Extrait les blocs `faq:` du frontmatter des articles FR pour lesquels
 * la traduction EN existe mais n'a pas encore de FAQ traduite.
 * Sortie JSON sur stdout : [{ slug, frFile, enFile, faq: [{question, answer}, ...] }, ...]
 */
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join } from "node:path";

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

function splitFrontmatter(text) {
  if (text.charCodeAt(0) === 0xfeff) text = text.slice(1);
  const lines = text.split(/\r?\n/);
  if (lines[0] !== "---") return null;
  let close = -1;
  for (let i = 1; i < lines.length; i++) if (lines[i] === "---") { close = i; break; }
  if (close === -1) return null;
  return { frontmatter: lines.slice(1, close).join("\n"), body: lines.slice(close + 1).join("\n") };
}

/** Parse minimaliste du bloc `faq:` (YAML attendu sous la forme :
 *  faq:
 *    - question: "..."
 *      answer: >-
 *        ...
 *      [- question: ...]
 *  )
 *  Retourne null si pas de bloc faq:, sinon un tableau {question, answer}. */
function parseFaqBlock(frontmatter) {
  const lines = frontmatter.split("\n");
  const faqStart = lines.findIndex((l) => /^faq:\s*$/.test(l));
  if (faqStart === -1) return null;
  // Cherche la fin du bloc : prochaine clé top-level (sans indentation) ou fin
  let faqEnd = lines.length;
  for (let i = faqStart + 1; i < lines.length; i++) {
    if (/^[a-zA-Z_]/.test(lines[i])) { faqEnd = i; break; }
  }
  const faqLines = lines.slice(faqStart + 1, faqEnd);

  const items = [];
  let current = null;
  let mode = null; // "question" | "answer"
  let buf = [];

  const flushAnswer = () => {
    if (!current) return;
    current.answer = buf.join(" ").replace(/\s+/g, " ").trim();
    buf = [];
  };

  for (const rawLine of faqLines) {
    const line = rawLine.replace(/\s+$/, "");
    if (/^\s*-\s+question:\s*/.test(line)) {
      if (current) { flushAnswer(); items.push(current); }
      const m = line.match(/^\s*-\s+question:\s*(.*)$/);
      const q = (m?.[1] ?? "").trim().replace(/^["']|["']$/g, "");
      current = { question: q, answer: "" };
      mode = "question";
      continue;
    }
    if (/^\s+answer:\s*>-?\s*$/.test(line) || /^\s+answer:\s*>\s*$/.test(line)) {
      mode = "answer";
      continue;
    }
    const inlineAns = line.match(/^\s+answer:\s+(.*)$/);
    if (inlineAns) {
      mode = "answer";
      buf.push(inlineAns[1].replace(/^["']|["']$/g, ""));
      continue;
    }
    if (mode === "answer" && /^\s{4,}\S/.test(line)) {
      buf.push(line.trim());
    }
  }
  if (current) { flushAnswer(); items.push(current); }
  return items.filter((it) => it.question && it.answer);
}

const frFiles = walkMd("src/content/blog");
const result = [];

for (const frFile of frFiles) {
  const slug = frFile.replace(/\\/g, "/").split("/").pop().replace(/\.md$/, "");
  const enFile = `src/content/blog-translations/en/${slug}.md`;
  if (!existsSync(enFile)) continue;

  const frRaw = readFileSync(frFile, "utf8");
  const frSplit = splitFrontmatter(frRaw);
  if (!frSplit) continue;
  const faq = parseFaqBlock(frSplit.frontmatter);
  if (!faq || faq.length === 0) continue;

  const enRaw = readFileSync(enFile, "utf8");
  const enSplit = splitFrontmatter(enRaw);
  if (enSplit && /^faq:\s*$/m.test(enSplit.frontmatter)) continue; // EN already has faq

  result.push({ slug, frFile, enFile, faq });
}

console.log(JSON.stringify(result, null, 2));
