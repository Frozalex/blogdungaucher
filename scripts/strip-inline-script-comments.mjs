#!/usr/bin/env node
/**
 * Retire les commentaires JS des scripts inline du HTML servi.
 *
 * Les blocs `<script is:inline>` échappent au traitement de Vite : leur contenu
 * part tel quel dans la page, commentaires de travail compris. Ce passage les
 * nettoie dans `dist/` uniquement — les sources gardent leur documentation.
 *
 * L'analyse est déléguée à esbuild (parseur JS réel) : les `//` présents dans
 * une chaîne, une expression régulière ou un gabarit sont conservés.
 */

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as esbuild from "esbuild";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(ROOT, "dist");

/** Scripts à ne pas toucher : ressources externes et données non-JS (JSON-LD). */
function isProcessable(attrs) {
  if (/\bsrc\s*=/i.test(attrs)) return false;
  const type = attrs.match(/\btype\s*=\s*["']([^"']*)["']/i)?.[1]?.trim().toLowerCase();
  if (!type) return true;
  return type === "module" || type === "text/javascript" || type === "application/javascript";
}

/** Un passage esbuild ne se justifie que si un commentaire peut être présent. */
function mayHoldComment(code) {
  return code.includes("//") || code.includes("/*");
}

async function stripComments(code, loader) {
  const { code: out } = await esbuild.transform(code, {
    loader,
    legalComments: "none",
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

  // Le contenu d'un <script> se termine au premier `</script` (spec HTML),
  // ce qui rend ce découpage fiable sur une sortie générée.
  const re = /(<script\b([^>]*)>)([\s\S]*?)(<\/script\s*>)/gi;

  for (let m; (m = re.exec(original)); ) {
    const [full, open, attrs, body, close] = m;
    if (!isProcessable(attrs) || !body.trim() || !mayHoldComment(body)) continue;

    let cleaned;
    try {
      cleaned = await stripComments(body, "js");
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
    // esbuild réindente : sur un script déjà minifié le résultat gonflerait.
    if (cleaned.length >= body.length) {
      stats.skipped++;
      continue;
    }

    chunks.push(original.slice(cursor, m.index), open, "\n", cleaned, close);
    cursor = m.index + full.length;
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
    cleaned = await stripComments(original, "js");
  } catch (err) {
    console.warn(`[strip-comments] ${path.relative(DIST, file)} : ignoré (${err.message.split("\n")[0]})`);
    stats.skipped++;
    return;
  }
  if (cleaned.length >= original.length) return;

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
