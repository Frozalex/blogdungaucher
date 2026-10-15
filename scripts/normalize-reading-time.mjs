/**
 * Recalcule `readingTime` depuis le nombre de mots réel du corps de l'article.
 *
 * Les valeurs étaient saisies à la main et avaient dérivé d'un facteur ~2,5 :
 * des articles de 1 000 mots annonçaient 12 min, des guides de 6 000 mots
 * annonçaient 45 min. Le champ est lu par les listings (ArticleCard,
 * CategoryPage, l'index JSON du filtre) autant que par la page d'article : on
 * le normalise donc à la source plutôt que de le recalculer dans chaque gabarit.
 *
 * Usage :
 *   node scripts/normalize-reading-time.mjs [--dry]
 */

import { readFile, writeFile } from "node:fs/promises";
import { glob } from "node:fs/promises";

/** Mots par minute. Vitesse de lecture silencieuse d'un adulte sur de la prose technique. */
const WORDS_PER_MINUTE = 220;

const CONTENT_GLOBS = [
  "src/content/blog/*/*.md",
  "src/content/dissertations/*.md",
  "src/content/blog-translations/*/*.md",
];

function splitFrontmatter(raw) {
  if (!raw.startsWith("---")) return null;
  const end = raw.indexOf("\n---", 3);
  if (end === -1) return null;
  return { frontmatter: raw.slice(0, end + 4), body: raw.slice(end + 4) };
}

function minutesFor(body) {
  const words = body.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
}

const dryRun = process.argv.includes("--dry");
let changed = 0;
let seen = 0;

for (const pattern of CONTENT_GLOBS) {
  for await (const file of glob(pattern)) {
    const raw = await readFile(file, "utf8");
    const parts = splitFrontmatter(raw);
    if (!parts) continue;
    seen += 1;

    const minutes = minutesFor(parts.body);
    // Conserve le style de quote du fichier pour limiter le bruit du diff.
    const next = parts.frontmatter.replace(
      /^readingTime:[ \t]*(["']?)[^\n]*?\1[ \t]*$/m,
      (match, quote) => `readingTime: ${quote}${minutes} min${quote}`,
    );
    if (next === parts.frontmatter) continue;

    changed += 1;
    if (!dryRun) await writeFile(file, next + parts.body, "utf8");
  }
}

console.log(
  `${dryRun ? "[dry] " : ""}readingTime normalisé : ${changed} fichier(s) modifié(s) sur ${seen} à ${WORDS_PER_MINUTE} mots/min.`,
);
