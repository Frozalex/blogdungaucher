#!/usr/bin/env node
/**
 * Vérifie qu'aucun lien interne du site construit ne pointe vers une page absente.
 *
 * À lancer APRÈS `npm run build`. Parcourt `dist/`, collecte les pages et les fichiers
 * réellement produits, puis contrôle chaque `href="/..."` du HTML.
 *
 * Deux pièges évités :
 *   - `(?<![-\w])href=` : sinon on capture aussi `data-lang-nl-href="..."`, qui est un
 *     attribut de données du sélecteur de langue et pas un lien réel.
 *   - les pages de redirection (meta-refresh) sont des sources comme les autres : un
 *     301 vers une 404 est justement le défaut qu'on cherche.
 *
 * Sort en code 1 si un lien mort est trouvé, pour pouvoir servir de garde-fou en CI.
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = resolve(__dirname, "../dist");

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) out.push(...walk(p));
    else out.push(p);
  }
  return out;
}

const files = walk(DIST);
const pages = new Set();
const assets = new Set();
for (const f of files) {
  const rel = "/" + relative(DIST, f).split(sep).join("/");
  assets.add(rel);
  if (rel.endsWith("/index.html")) pages.add(rel.slice(0, -"index.html".length));
}

const HREF = /(?<![-\w])href="(\/[^"#?]*)/g;
const dead = new Map();
let checked = 0;

for (const f of files.filter((f) => f.endsWith(".html"))) {
  const src = "/" + relative(DIST, f).split(sep).join("/").replace(/index\.html$/, "");
  const html = readFileSync(f, "utf8");
  for (const m of html.matchAll(HREF)) {
    const href = m[1];
    checked += 1;
    if (pages.has(href) || assets.has(href)) continue;
    if (pages.has(href.replace(/\/?$/, "/"))) continue;
    if (!dead.has(href)) dead.set(href, new Set());
    dead.get(href).add(src);
  }
}

console.log(`${pages.size} pages, ${checked} liens internes vérifiés.`);
if (dead.size === 0) {
  console.log("Aucun lien interne mort.");
  process.exit(0);
}
console.log(`\n${dead.size} cible(s) morte(s) :`);
for (const [href, srcs] of [...dead].sort()) {
  console.log(`   ${href}  <- ${[...srcs].sort()[0]}${srcs.size > 1 ? ` (+${srcs.size - 1})` : ""}`);
}
process.exit(1);
