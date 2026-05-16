/**
 * Retire les tirets cadratin (—) des billets récemment fusionnés.
 * Usage: node scripts/strip-em-dash-new-articles.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const blogDir = path.join(__dirname, "../src/content/blog");

const NEW_ARTICLES = [
  "analyser-ses-parties.md",
  "echecs-alphazero-stockfish.md",
  "echecs-estime-de-soi-elo.md",
  "echecs-et-biofeedback.md",
  "echecs-et-complexite-algorithmique.md",
  "echecs-et-concentration.md",
  "echecs-et-confiance-en-soi.md",
  "echecs-et-culture-populaire.md",
  "echecs-et-diplomatie.md",
  "echecs-et-dopamine.md",
  "echecs-et-ecole.md",
  "echecs-et-enfants.md",
  "echecs-et-flow.md",
  "echecs-et-genetique.md",
  "echecs-et-handicap.md",
  "echecs-et-hpi.md",
  "echecs-et-immigration.md",
  "echecs-et-meditation.md",
  "echecs-et-precarite.md",
  "echecs-et-procrastination.md",
  "echecs-et-resilience.md",
  "echecs-et-sommeil.md",
  "echecs-et-streaming.md",
  "echecs-et-therapie.md",
  "echecs-et-vision-spatiale.md",
  "echecs-et-visualisation.md",
  "echecs-gestion-du-temps.md",
  "echecs-memoire-de-travail.md",
  "echecs-stress-tournoi.md",
  "echecs-vieillissement-cognitif.md",
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
      // Clés YAML (title:, answer:, etc.)
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

let total = 0;
for (const name of NEW_ARTICLES) {
  const filePath = path.join(blogDir, name);
  const before = fs.readFileSync(filePath, "utf8");
  const count = (before.match(/—/g) ?? []).length;
  if (count === 0) continue;
  const after = stripEmDash(before);
  fs.writeFileSync(filePath, after, "utf8");
  total += count;
  console.log(`${name}: ${count} → ${(after.match(/—/g) ?? []).length}`);
}

console.log(`Total tirets cadratin traités: ${total}`);
