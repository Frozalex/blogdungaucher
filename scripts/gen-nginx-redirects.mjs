#!/usr/bin/env node
// Régénère deploy/nginx-redirects.conf (vrais 301 nginx).
// La section EN (slug FR → slug EN localisé) est générée dynamiquement depuis
// le frontmatter des traductions, via scripts/en-redirects.mjs (même source que
// le bloc `redirects` d'astro.config.mjs).
//
// Usage : node scripts/gen-nginx-redirects.mjs
// À relancer après ajout/renommage d'une traduction EN.

import { writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { enSlugRedirects } from "./en-redirects.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dirname, "../deploy/nginx-redirects.conf");

const header = `# ─────────────────────────────────────────────────────────────────────────────
# Redirections 301 SEO — blogdungaucher.com (nginx)
#
# ⚙️  FICHIER GÉNÉRÉ par scripts/gen-nginx-redirects.mjs — ne pas éditer à la main
#     la section EN (la régénérer : node scripts/gen-nginx-redirects.mjs).
#
# POURQUOI CE FICHIER : le serveur de prod est nginx (Ubuntu, VPS 177.7.37.62).
# Le public/.htaccess (Apache) est IGNORÉ par nginx — toutes les règles 301 qu'il
# contenait étaient mortes. Ce fichier porte les VRAIS 301 côté serveur.
#
# DÉPLOIEMENT (manuel, une fois) :
#   1) scp deploy/nginx-redirects.conf root@177.7.37.62:/etc/nginx/snippets/blog-redirects.conf
#   2) dans le server block, AVANT le location principal :
#        include /etc/nginx/snippets/blog-redirects.conf;
#   3) nginx -t && systemctl reload nginx
#   4) curl -sI https://blogdungaucher.com/en/blog/echecs-et-femmes/ | grep -i location
#        # attendu : Location: /en/blog/chess-and-women/  (301)
# ─────────────────────────────────────────────────────────────────────────────

# ── Rubrique renommée : Essais → Dissertations ──
location = /fr/essais/ { return 301 /fr/dissertations/; }
location = /en/essais/ { return 301 /en/dissertations/; }
location = /de/essais/ { return 301 /de/dissertations/; }

# ── Cannibalisation SEO : articles fusionnés vers leur version canonique ──
location = /fr/blog/echecs-et-syndrome-imposteur/        { return 301 /fr/blog/syndrome-imposteur-aux-echecs/; }
location = /en/blog/chess-impostor-syndrome/             { return 301 /en/blog/impostor-syndrome-in-chess/; }
location = /fr/blog/bienfaits-des-echecs-sur-le-cerveau/ { return 301 /fr/blog/les-echecs-et-le-cerveau/; }
location = /en/blog/chess-benefits-for-the-brain/        { return 301 /en/blog/chess-and-the-brain/; }
location = /fr/blog/echecs-et-seniors/                   { return 301 /fr/blog/echecs-alzheimer-prevention-declin-cognitif/; }
location = /fr/blog/echecs-vieillissement-cognitif/      { return 301 /fr/blog/echecs-alzheimer-prevention-declin-cognitif/; }
location = /en/blog/chess-and-seniors/                   { return 301 /en/blog/chess-and-alzheimer-prevention/; }
location = /en/blog/chess-and-cognitive-aging/           { return 301 /en/blog/chess-and-alzheimer-prevention/; }

# ── Grand oral Maths : le gagnant prouvé (grand-oral-maths-spe-echecs) est
#    canonique ; le guide y est redirigé. ──
location = /fr/blog/guide-grand-oral-echecs-maths/       { return 301 /fr/blog/grand-oral-maths-spe-echecs/; }

# ── URLs héritées sans préfixe de langue (ancienne structure pré-i18n) ──
# Catch-all : tout /blog/<x> bascule vers /fr/blog/<x>.
location ^~ /blog/ {
  rewrite ^/blog/(.*)$ /fr/blog/$1 permanent;
}

# ── Anciennes rubriques sans préfixe de langue ──
location = /esprit  { return 301 /fr/esprit/; }
location = /esprit/ { return 301 /fr/esprit/; }
`;

const enMap = enSlugRedirects();
const enKeys = Object.keys(enMap).sort();
const pad = Math.max(...enKeys.map((k) => `location = ${k}`.length));
const enLines = enKeys
  .map((src) => {
    const head = `location = ${src}`.padEnd(pad);
    return `${head} { return 301 ${enMap[src]}; }`;
  })
  .join("\n");

const enSection = `
# ── Anciennes URLs EN à slug FR (pré-localisation) → slug EN localisé ──
# ${enKeys.length} paires générées depuis le frontmatter des traductions.
${enLines}
`;

writeFileSync(OUT, header + enSection, "utf8");
console.log(`nginx-redirects.conf régénéré : ${enKeys.length} redirections EN + règles fixes.`);
