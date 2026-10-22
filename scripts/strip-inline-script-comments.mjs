#!/usr/bin/env node
/**
 * Retire les commentaires JS des scripts inline du HTML servi.
 *
 * Les blocs `<script is:inline>` échappent au traitement de Vite : leur contenu
 * part tel quel dans la page, commentaires de travail compris. Ce passage les
 * nettoie dans `dist/` uniquement — les sources gardent leur documentation.
 *
 * L'analyse est déléguée à esbuild (parseur JS réel) : les `//` présents dans
 * une chaîne, une expression régulière ou un gabarit sont conservés, ainsi
 * que les mentions de licence.
 */

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { load } from "cheerio";
import * as esbuild from "esbuild";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.resolve(process.argv[2] ?? path.join(ROOT, "dist"));

/** Scripts à ne pas toucher : ressources externes et données non-JS (JSON-LD). */
function isProcessable(attrs) {
  if (attrs.src !== undefined) return false;
  const type = attrs.type?.trim().toLowerCase();
  if (!type) return true;
  return type === "module" || type === "text/javascript" || type === "application/javascript";
}

/** Un passage esbuild ne se justifie que si un commentaire peut être présent. */
function mayHoldComment(code) {
  return code.includes("//") || code.includes("/*");
}

async function stripComments(code) {
  const { code: out } = await esbuild.transform(code, {
    loader: "js",
    legalComments: "inline",
    // Sans cette option esbuild conserve les commentaires placés devant une
    // expression (il les suppose annotations `/* @__PURE__ */`). On se limite
    // au blanc : la syntaxe et les identifiants restent inchangés.
    minifyWhitespace: true,
  });
  return out;
}

async function* walk(dir) {
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else yield full;
  }
}

const stats = { files: 0, scripts: 0, skipped: 0, bytes: 0 };

async function processHtml(file) {
  const original = await fs.readFile(file, "utf8");
  const chunks = [];
  let cursor = 0;
  let touched = false;

  // Les positions du parseur permettent de ne réécrire que le JS : ni les
  // attributs, ni les exemples HTML dans <textarea> ou <code> ne sont sérialisés.
  const $ = load(original, { sourceCodeLocationInfo: true });
  for (const script of $("script").toArray()) {
    const location = script.sourceCodeLocation;
    if (!isProcessable(script.attribs) || !location?.startTag || !location.endTag) continue;
    const start = location.startTag.endOffset;
    const end = location.endTag.startOffset;
    const body = original.slice(start, end);
    if (!body.trim() || !mayHoldComment(body)) continue;

    let cleaned;
    try {
      cleaned = await stripComments(body);
    } catch (err) {
      console.warn(`[strip-comments] ${path.relative(DIST, file)} : script ignoré (${err.message.split("\n")[0]})`);
      stats.skipped++;
      continue;
    }

    // Un `</script` réintroduit par la sérialisation couperait la balise.
    if (/<\/script/i.test(cleaned)) {
      stats.skipped++;
      continue;
    }
    if (cleaned === body) continue;

    chunks.push(original.slice(cursor, start), cleaned);
    cursor = end;
    stats.scripts++;
    stats.bytes += body.length - cleaned.length;
    touched = true;
  }

  if (!touched) return;
  chunks.push(original.slice(cursor));
  await fs.writeFile(file, chunks.join(""), "utf8");
  stats.files++;
}

async function processJs(file) {
  const original = await fs.readFile(file, "utf8");
  if (!mayHoldComment(original)) return;

  let cleaned;
  try {
    cleaned = await stripComments(original);
  } catch (err) {
    console.warn(`[strip-comments] ${path.relative(DIST, file)} : ignoré (${err.message.split("\n")[0]})`);
    stats.skipped++;
    return;
  }
  if (cleaned === original) return;

  await fs.writeFile(file, cleaned, "utf8");
  stats.files++;
  stats.bytes += original.length - cleaned.length;
}

// `public/` est recopié tel quel : ces fichiers gardent aussi leurs commentaires.
const PUBLIC_JS = ["sw.js", "i18n-dict.js"];

for await (const file of walk(DIST)) {
  if (file.endsWith(".html")) await processHtml(file);
  else if (PUBLIC_JS.includes(path.relative(DIST, file))) await processJs(file);
}

console.log(
  `[strip-comments] ${stats.scripts} scripts inline nettoyés dans ${stats.files} fichiers ` +
    `(-${(stats.bytes / 1024).toFixed(1)} Ko)${stats.skipped ? `, ${stats.skipped} ignorés` : ""}.`,
);
