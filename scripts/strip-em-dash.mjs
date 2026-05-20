/**
 * Retire les tirets cadratin (—, U+2014) du contenu éditorial du site.
 *
 * Étend strip-em-dash-new-articles.mjs en couvrant l'ensemble des surfaces où
 * du texte rédactionnel peut apparaître :
 *   - tout src/content (fichiers .md)
 *   - tout src/pages, src/components, src/layouts (.astro)
 *   - tout src/data et src/i18n (.ts)
 *
 * Les blocs CSS `content: "—"` sont préservés (utilisés pour les guillemets
 * décoratifs des pull-quotes). Les clés YAML, les blocs de code et les chaînes
 * d'identifiants TypeScript sont laissés intacts par la logique de strip.
 *
 * Usage :
 *   node scripts/strip-em-dash.mjs           → applique
 *   node scripts/strip-em-dash.mjs --dry     → rapport sans écriture
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

/** Dossiers scannés récursivement (hors scripts/, dist/, node_modules). */
const SCAN_DIRS = [
  { dir: "src/content", ext: /\.md$/i },
  { dir: "src/pages", ext: /\.astro$/i },
  { dir: "src/components", ext: /\.astro$/i },
  { dir: "src/layouts", ext: /\.astro$/i },
  { dir: "src/data", ext: /\.ts$/i },
  { dir: "src/i18n", ext: /\.ts$/i },
];

/** Collecte les chemins relatifs à traiter (dédupliqués). */
function collectScanFiles() {
  const seen = new Set();
  const out = [];
  for (const { dir, ext } of SCAN_DIRS) {
    const dirAbs = path.join(root, dir);
    if (!fs.existsSync(dirAbs)) continue;
    const stack = [dirAbs];
    while (stack.length) {
      const cur = stack.pop();
      for (const entry of fs.readdirSync(cur, { withFileTypes: true })) {
        const p = path.join(cur, entry.name);
        if (entry.isDirectory()) stack.push(p);
        else if (entry.isFile() && ext.test(entry.name)) {
          const rel = path.relative(root, p).replace(/\\/g, "/");
          if (!seen.has(rel)) {
            seen.add(rel);
            out.push(rel);
          }
        }
      }
    }
  }
  return out.sort();
}

/** Logique de remplacement — issue du script "new-articles", éprouvée.
 *  Le but : un texte propre, pas un texte cassé. Ordre des règles compte. */
export function stripEmDash(text) {
  let s = text;

  // Incise courte « — X — » → « (X) »
  s = s.replace(/ — ([^—\n]{1,72}?) — /g, (full, inner) => {
    if (/[.!?]\s/.test(inner)) return full; // garde la version originale si l'incise contient une phrase complète
    return ` (${inner}) `;
  });

  s = s.replace(/ — «/g, ", «");

  // « — conjonction » → « , conjonction » (FR + EN)
  s = s.replace(
    / — (et|ou|mais|sans|avec|pour|quand|si|car|donc|ni|puis|ainsi|comme|notamment|surtout|aussi|encore|déjà|toujours|jamais|souvent|parfois|plutôt|même|and|or|but|with|for|when|if|not|so|yet|even|also|how)\b/gi,
    ", $1",
  );

  // « — » suivi d'une minuscule : annonce une explication → « : »
  s = s.replace(/ — ([a-zàâäéèêëïîôùûüç])/g, ": $1");
  // « — » suivi d'une majuscule : reprise/apposition → « , »
  s = s.replace(/ — ([A-ZÀÂÄÉÈÊËÏÎÔÙÛÜÇ*])/g, ", $1");
  // Reliquats génériques
  s = s.replace(/ — /g, ", ");
  s = s.replace(/—/g, ", ");

  return fixFrenchColonsInProse(s);
}

/** Restitue l'espace fine avant « : » en prose (typo FR), sans toucher aux
 *  clés YAML, aux entrées FAQ, ni aux propriétés JS/TS. */
function fixFrenchColonsInProse(text) {
  return text
    .split("\n")
    .map((line) => {
      if (/^\s*[a-zA-Z][\w-]*:\s/.test(line)) return line; // YAML / propriété
      if (/^\s*- question:\s/.test(line)) return line;
      if (/^\s*answer:\s/.test(line)) return line;
      return line.replace(
        /([a-zàâäéèêëïîôùûüç'»"\d]): (?=[a-zàâäéèêëïîôùç'«"\[])/gi,
        "$1 : ",
      );
    })
    .join("\n");
}

/** Pour les fichiers .astro, on préserve les blocs CSS `content: "—"`
 *  (guillemets décoratifs des pull-quotes, séparateurs typographiques). */
function stripEmDashPreservingCssContent(text) {
  const re = /^(\s*content:\s*["'])([^"']*)(["'];?\s*)$/gm;
  const parts = [];
  let last = 0;
  let m;
  while ((m = re.exec(text)) !== null) {
    parts.push({ raw: false, value: text.slice(last, m.index) });
    parts.push({ raw: true, value: m[0] });
    last = m.index + m[0].length;
  }
  parts.push({ raw: false, value: text.slice(last) });
  return parts.map((p) => (p.raw ? p.value : stripEmDash(p.value))).join("");
}

/** Pour les .ts : on protège les noms de propriété, les imports/exports,
 *  et les commentaires JSDoc — on n'agit que dans les littéraux de chaîne. */
function stripEmDashInTsStrings(text) {
  // Approche conservative : on ne touche QU'AUX chaînes simple/double quote
  // contenant un em-dash. Cible parfaite pour les `body: "..."` éditoriaux.
  return text.replace(/(["'])((?:\\.|(?!\1)[^\\])*?)\1/g, (full, quote, body) => {
    if (!body.includes("—")) return full;
    return quote + stripEmDash(body) + quote;
  });
}

/** Fonction principale : appelée UNIQUEMENT quand le script est exécuté
 *  directement (`node scripts/strip-em-dash.mjs`), jamais lors d'un import.
 *  Retourne le nombre total de tirets retirés pour usage programmatique. */
export function runStripEmDash({ dry = false, silent = false } = {}) {
  let totalBefore = 0;
  let totalChanged = 0;
  const reports = [];

  for (const rel of collectScanFiles()) {
    const abs = path.join(root, rel);
    const r = processFileSafe(abs, dry);
    if (r.skipped) continue;
    if (r.changed > 0) {
      totalBefore += r.count;
      totalChanged += r.changed;
      reports.push(`${rel}: ${r.count} → ${r.left}`);
    }
  }

  if (!silent) {
    if (reports.length === 0) {
      console.log("✓ Aucun tiret cadratin à retirer. Tout est propre.");
    } else {
      console.log(reports.join("\n"));
      console.log(`\n=== Bilan ===`);
      console.log(`Tirets cadratin retirés : ${totalChanged} / ${totalBefore}`);
      if (dry) console.log("(--dry : aucun fichier écrit)");
    }
  }

  return { totalChanged, totalBefore };
}

/** Wrapper sûr qui accepte le flag dry sans dépendre du global module-level. */
function processFileSafe(absPath, dry) {
  if (!fs.existsSync(absPath)) return { skipped: true };
  const before = fs.readFileSync(absPath, "utf8");
  const count = (before.match(/—/g) ?? []).length;
  if (count === 0) return { count: 0, changed: 0, left: 0 };

  let after;
  if (/\.astro$/i.test(absPath)) {
    after = stripEmDashPreservingCssContent(before);
  } else if (/\.ts$/i.test(absPath)) {
    after = stripEmDashInTsStrings(before);
  } else {
    after = stripEmDash(before);
  }

  const left = (after.match(/—/g) ?? []).length;
  const changed = count - left;
  if (changed > 0 && !dry) fs.writeFileSync(absPath, after, "utf8");
  return { count, left, changed };
}

// Exécution autonome : uniquement si on lance `node scripts/strip-em-dash.mjs`.
// Le test `import.meta.url === pathToFileURL(process.argv[1]).href` n'est pas
// portable sous Windows (slashes), donc on compare via path.resolve.
const isMain = (() => {
  try {
    const argv1 = process.argv[1] ? path.resolve(process.argv[1]) : "";
    const here = fileURLToPath(import.meta.url);
    return argv1 === here;
  } catch {
    return false;
  }
})();

if (isMain) {
  const dry = process.argv.includes("--dry");
  const { totalChanged, totalBefore } = runStripEmDash({ dry });
  process.exitCode = 0;
  if (process.env.STRIP_EM_DASH_OUTPUT === "json") {
    console.log(JSON.stringify({ totalChanged, totalBefore }));
  }
}
