/**
 * Détecte les liens internes « en avance » : un article DÉJÀ PUBLIÉ qui pointe vers un
 * article dont la publishDate est encore dans le futur.
 *
 * `getAllPosts()` ne rend visibles que les billets dont la publishDate est passée : un tel
 * lien est donc un **404 en production** jusqu'à la publication de la cible.
 *
 * Convention du projet (drafts/_serie-psychologie/PLAN.md, « Maillage des piliers ») :
 * un article publié avant sa cible l'annonce en clair comme « à venir », SANS lien actif ;
 * le lien est ajouté au moment de la publication de la cible. Zéro lien mort à aucun moment.
 *
 * Run: node scripts/check-internal-link-timing.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dir = path.join(__dirname, "..", "src", "content", "blog");

/** Liste récursive des .md : les articles vivent en sous-dossiers (esprit/, science/,
 * societe/, grand-oral/). Une lecture à plat ne voit AUCUN fichier → check no-op. */
function walk(d) {
  const out = [];
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) out.push(...walk(p));
    else if (e.name.endsWith(".md")) out.push(p);
  }
  return out;
}

/** Date du jour en UTC (YYYY-MM-DD), comparable telle quelle aux publishDate ISO. */
const today = new Date().toISOString().slice(0, 10);

const files = walk(dir);
const posts = new Map();

for (const full of files) {
  const raw = fs.readFileSync(full, "utf8");
  const m = raw.match(/^publishDate:\s*["']([^"']+)["']/m);
  if (!m) {
    console.error("publishDate manquant:", path.relative(dir, full));
    process.exit(1);
  }
  posts.set(path.basename(full, ".md"), {
    date: m[1],
    file: full,
    raw,
  });
}

/** Liens internes FR vers un article de blog : /fr/blog/<slug>/ */
const LINK_RE = /\/fr\/blog\/([a-z0-9-]+)\//g;

const violations = [];

for (const [slug, post] of posts) {
  // Seuls les articles déjà visibles en prod peuvent produire un 404 aujourd'hui.
  if (post.date > today) continue;

  const lines = post.raw.split("\n");
  for (let i = 0; i < lines.length; i++) {
    for (const m of lines[i].matchAll(LINK_RE)) {
      const target = posts.get(m[1]);
      // Slug inconnu = lien cassé, hors périmètre de ce check (cf. verify-dist-urls.mjs).
      if (!target) continue;
      if (target.date > today) {
        violations.push({
          from: slug,
          fromFile: path.relative(path.join(__dirname, ".."), post.file),
          fromDate: post.date,
          line: i + 1,
          to: m[1],
          toDate: target.date,
        });
      }
    }
  }
}

if (violations.length) {
  violations.sort(
    (a, b) => a.fromFile.localeCompare(b.fromFile) || a.line - b.line,
  );
  console.error(
    `${violations.length} lien(s) interne(s) en avance : article publié → article non encore publié (404 en prod aujourd'hui, ${today}).\n`,
  );
  for (const v of violations) {
    console.error(`  ${v.fromFile}:${v.line}`);
    console.error(
      `    ${v.from} (${v.fromDate}) → ${v.to} (${v.toDate}, dans le futur)`,
    );
  }
  console.error(
    "\nConvention (PLAN.md, « Maillage des piliers ») : remplacer le lien actif par une",
  );
  console.error(
    "mention texte « à venir » sans lien ; rétablir le lien à la publication de la cible.",
  );
  process.exit(1);
}

console.log(
  `OK : aucun lien interne en avance sur ${posts.size} billet(s) (référence : ${today} UTC).`,
);
