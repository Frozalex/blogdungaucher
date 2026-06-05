// Génère dynamiquement les redirections des anciennes URLs EN (slug FR) vers
// les slugs EN localisés. Source unique partagée par astro.config.mjs (pages
// meta-refresh au build) et scripts/gen-nginx-redirects.mjs (vrais 301 nginx).
//
// POURQUOI : avant la localisation des slugs EN, les pages anglaises étaient
// générées à l'URL du slug FR (ex. /en/blog/echecs-et-femmes/). Ces pages
// survivent dans le dist du VPS et restent indexées par Google (ex. 1009
// impressions, CTR 0), dupliquant la version localisée (/en/blog/chess-and-women/).
// On les redirige donc 1:1 vers le slug localisé, qui est le seul généré
// aujourd'hui (cf. getStaticPaths de src/pages/en/blog/[slug].astro).
//
// Auto-maintenu : lit le champ `enSlug` du frontmatter de chaque traduction EN.
// Ajouter/renommer une traduction met à jour les redirects sans édition manuelle.

import { readFileSync, readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const EN_DIR = resolve(__dirname, "../src/content/blog-translations/en");

/**
 * @returns {Record<string,string>} map { "/en/blog/<slugFR>/": "/en/blog/<slugEN>/" }
 *          pour chaque traduction dont le slug EN diffère du slug FR.
 */
export function enSlugRedirects() {
  /** @type {Record<string,string>} */
  const out = {};
  for (const file of readdirSync(EN_DIR)) {
    if (!file.endsWith(".md")) continue;
    const frSlug = file.replace(/\.md$/, "");
    const raw = readFileSync(join(EN_DIR, file), "utf8").replace(/^﻿/, "");
    const fm = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    if (!fm) continue;
    const em = fm[1].match(/^enSlug:\s*["']?([^"'\n\r]+)["']?/m);
    const enSlug = em ? em[1].trim() : null;
    if (enSlug && enSlug !== frSlug) {
      out[`/en/blog/${frSlug}/`] = `/en/blog/${enSlug}/`;
    }
  }
  return out;
}
