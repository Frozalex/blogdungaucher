/**
 * Soumet toutes les URLs publiées (draft: false) à IndexNow (Bing).
 * Usage : node scripts/indexnow-submit.mjs
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const SITE = "https://blogdungaucher.com";
const KEY = "34187b51f98646a5aaccb756d68be08e";
const KEY_LOCATION = `${SITE}/${KEY}.txt`;
const API = "https://api.indexnow.org/IndexNow";

function isDraft(content) {
  const fm = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!fm) return false;
  return /^\s*draft\s*:\s*true\s*$/m.test(fm[1]);
}

function walk(dir) {
  const entries = readdirSync(dir);
  return entries.flatMap((e) => {
    const full = join(dir, e);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
}

function slugFromPath(filePath) {
  const rel = relative(join("src", "content"), filePath)
    .replace(/\\/g, "/")
    .replace(/\.mdx?$/, "");
  return "/" + rel;
}

const blogDir = join("src", "content", "blog");
const files = walk(blogDir).filter((f) => f.match(/\.mdx?$/));

const urls = files
  .filter((f) => {
    try {
      return !isDraft(readFileSync(f, "utf8"));
    } catch {
      return false;
    }
  })
  .map((f) => SITE + slugFromPath(f));

const staticPages = ["/", "/blog", "/infographie", "/legal", "/contact"].map(
  (p) => SITE + p
);

const urlList = [...new Set([...staticPages, ...urls])];

console.log(`Soumission de ${urlList.length} URLs à IndexNow...`);

const res = await fetch(API, {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({
    host: new URL(SITE).hostname,
    key: KEY,
    keyLocation: KEY_LOCATION,
    urlList,
  }),
});

console.log(`Réponse : HTTP ${res.status}`);
if (res.status === 200 || res.status === 202) {
  console.log("URLs soumises avec succès.");
} else {
  const text = await res.text();
  console.error("Erreur :", text);
}
