/**
 * Échoue le build si le dossier dist contient des URLs incorrectes pour la prod SEO.
 * Détecte :8080, http://blogdungaucher.com (hors liens canoniques https externes OK).
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, extname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "dist");
const BAD_PATTERNS = [
  { re: /:8080\b/, msg: "URL avec port :8080 (liens absolus mal construits)" },
  {
    re: /http:\/\/blogdungaucher\.com(?:[\s"'/:]|>)/gi,
    msg: "http://blogdungaucher.com (doit être https:// sans port)",
  },
];

function walk(dir, files = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) walk(p, files);
    else if (/\.(html|xml|txt|json)$/i.test(extname(name))) files.push(p);
  }
  return files;
}

let errors = 0;
for (const file of walk(ROOT)) {
  const text = readFileSync(file, "utf8");
  const rel = file.replace(/\\/g, "/").split("/dist/").pop();
  for (const { re, msg } of BAD_PATTERNS) {
    re.lastIndex = 0;
    if (re.test(text)) {
      console.error(`[verify-dist-urls] ${msg}\n  fichier: dist/${rel}`);
      errors++;
    }
  }
}

if (errors > 0) {
  console.error(`\nverify-dist-urls: ${errors} problème(s). Corriger la config « site » ou le déploiement.`);
  process.exit(1);
}
console.log("verify-dist-urls: OK (pas de :8080 ni http sur blogdungaucher.com).");
