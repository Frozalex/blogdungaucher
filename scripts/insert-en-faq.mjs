#!/usr/bin/env node
/**
 * Insère un bloc `faq:` traduit dans chaque fichier EN.
 * Entrée : JSON sur stdin de la forme [{ slug, faq: [{question, answer}, ...] }, ...]
 * Pour chaque entrée, le bloc est ajouté à la fin du frontmatter de
 * `src/content/blog-translations/en/<slug>.md` s'il n'a pas déjà un `faq:`.
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";

function splitFrontmatter(text) {
  if (text.charCodeAt(0) === 0xfeff) text = text.slice(1);
  const lines = text.split(/\r?\n/);
  if (lines[0] !== "---") return null;
  let close = -1;
  for (let i = 1; i < lines.length; i++) if (lines[i] === "---") { close = i; break; }
  if (close === -1) return null;
  return { frontmatter: lines.slice(1, close).join("\n"), body: lines.slice(close + 1).join("\n") };
}

function serializeFaqYaml(questions) {
  const lines = ["faq:"];
  for (const { question, answer } of questions) {
    const qEsc = question.replace(/"/g, '\\"');
    lines.push(`  - question: "${qEsc}"`);
    lines.push("    answer: >-");
    const flat = answer.replace(/\s+/g, " ").trim();
    const words = flat.split(" ");
    let buf = "      ";
    for (const w of words) {
      if (buf.length + w.length + 1 > 110) { lines.push(buf.trimEnd()); buf = "      "; }
      buf += w + " ";
    }
    if (buf.trim()) lines.push(buf.trimEnd());
  }
  return lines.join("\n");
}

const stdin = await new Promise((res) => {
  let data = "";
  process.stdin.setEncoding("utf8");
  process.stdin.on("data", (c) => (data += c));
  process.stdin.on("end", () => res(data));
});

const items = JSON.parse(stdin);
let inserted = 0, skipped = 0;
for (const { slug, faq } of items) {
  const file = `src/content/blog-translations/en/${slug}.md`;
  if (!existsSync(file)) { console.error(`!! ${slug}: file missing`); continue; }
  const raw = readFileSync(file, "utf8");
  const split = splitFrontmatter(raw);
  if (!split) { console.error(`!! ${slug}: no frontmatter`); continue; }
  if (/^faq:\s*$/m.test(split.frontmatter)) { skipped++; continue; }

  const yaml = serializeFaqYaml(faq);
  const newFront = split.frontmatter.replace(/\s*$/, "") + "\n" + yaml;
  writeFileSync(file, ["---", newFront, "---", split.body].join("\n"), "utf8");
  inserted++;
  console.log(`✓ ${slug} (${faq.length} Q/A)`);
}
console.log(`\n${inserted} inserted, ${skipped} skipped.`);
