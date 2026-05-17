/**
 * Retire les tirets cadratin (—) du contenu éditorial du site.
 * Usage: node scripts/strip-em-dash-new-articles.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const blogDir = path.join(root, "src/content/blog");

/** Ne pas traiter les lignes CSS `content:` (citations typographiques). */
/** @param {string} text */
function stripEmDashPreservingCssContent(text) {
  const parts = [];
  const re = /^(\s*content:\s*["'])([^"']*)(["'];?\s*)$/gm;
  let last = 0;
  let m;
  while ((m = re.exec(text)) !== null) {
    parts.push({ start: last, end: m.index, replace: stripEmDash(text.slice(last, m.index)) });
    parts.push({ start: m.index, end: m.index + m[0].length, raw: m[0] });
    last = m.index + m[0].length;
  }
  parts.push({ start: last, end: text.length, replace: stripEmDash(text.slice(last)) });
  let out = "";
  for (const p of parts) {
    out += p.raw ?? p.replace;
  }
  return out;
}

/** Fichiers hors blog contenant du texte utilisateur (pas les séparateurs CSS). */
const SITE_TEXT_FILES = [
  "src/pages/fr/recherche/index.astro",
  "src/pages/fr/glossaire/index.astro",
  "src/pages/404.astro",
  "src/components/CookieConsent.astro",
];

/** @param {string} text */
export function stripEmDash(text) {
  let s = text.replace(/\u2014/g, "—");

  // Incises courtes sans phrase complète à l'intérieur
  s = s.replace(/ — ([^—\n]{1,72}?) — /g, (full, inner) => {
    if (/[.!?]\s/.test(inner)) return full;
    return ` (${inner}) `;
  });

  s = s.replace(/ — «/g, ", «");

  s = s.replace(
    / — (et|ou|mais|sans|avec|pour|quand|si|car|donc|ni|puis|ainsi|comme|notamment|surtout|aussi|encore|déjà|toujours|jamais|souvent|parfois|plutôt|même|and|or|but|with|for|when|if|not|so|yet|even|also|how)\b/gi,
    ", $1",
  );

  s = s.replace(/ — ([a-zàâäéèêëïîôùûüç])/g, ": $1");
  s = s.replace(/ — ([A-ZÀÂÄÉÈÊËÏÎÔÙÛÜÇ*])/g, ", $1");
  s = s.replace(/ — /g, ", ");
  s = s.replace(/—/g, ", ");

  return fixFrenchColonsInProse(s);
}

/** Espace fine avant « : » en prose (pas dans les clés YAML). */
/** @param {string} text */
function fixFrenchColonsInProse(text) {
  return text
    .split("\n")
    .map((line) => {
      if (/^\s*[a-zA-Z][\w-]*:\s/.test(line)) return line;
      if (/^\s*- question:\s/.test(line)) return line;
      if (/^\s*answer:\s/.test(line)) return line;
      return line.replace(
        /([a-zàâäéèêëïîôùûüç'»"\d]): (?=[a-zàâäéèêëïîôùç'«"\[])/gi,
        "$1 : ",
      );
    })
    .join("\n");
}

/** @param {string} filePath */
function processFile(filePath) {
  const before = fs.readFileSync(filePath, "utf8");
  const count = (before.match(/—/g) ?? []).length;
  if (count === 0) return 0;
  const after = /\.astro$/i.test(filePath)
    ? stripEmDashPreservingCssContent(before)
    : stripEmDash(before);
  fs.writeFileSync(filePath, after, "utf8");
  const left = (after.match(/—/g) ?? []).length;
  const rel = path.relative(root, filePath);
  console.log(`${rel}: ${count} → ${left}`);
  return count;
}

let total = 0;

for (const name of fs.readdirSync(blogDir).filter((f) => f.endsWith(".md"))) {
  total += processFile(path.join(blogDir, name));
}

for (const rel of SITE_TEXT_FILES) {
  total += processFile(path.join(root, rel));
}

console.log(`Total tirets cadratin traités: ${total}`);
