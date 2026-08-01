import path from "node:path";
import { fileURLToPath } from "node:url";

import react from "@astrojs/react";
import { defineConfig } from "astro/config";

import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

import { rehypeAffiliateLinks } from "./src/utils/rehype-affiliate-links.ts";

import { SITE_ORIGIN } from "./scripts/site-origin.mjs";
import { enSlugRedirects } from "./scripts/en-redirects.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * `site` fixe (sans lecture de SITE / PUBLIC_SITE_URL au build).
 * Sinon un VPS qui exporte SITE=http://blogdungaucher.com:8080 pour Node peut faire
 * dériver import.meta.env.SITE et certaines réécritures d’URL Astro  -  Google voit alors
 * du HTML avec la mauvaise origine même si le navigateur redirige.
 */
export default defineConfig({
  site: SITE_ORIGIN,
  integrations: [react()],
  output: "static",
  trailingSlash: "always",
  compressHTML: true,
  vite: {
    resolve: {
      alias: {
        "@remotion": path.resolve(__dirname, "remotion/src"),
      },
    },
    ssr: {
      noExternal: ["remotion", "@remotion/player"],
    },
    build: {
      rollupOptions: {
        // Pagefind est généré après le build Astro : ne pas tenter de le bundler.
        external: ["/pagefind/pagefind.js"],
      },
    },
  },
  // Redirections : générées en pages statiques (meta-refresh) car le serveur prod
  // est nginx — le public/.htaccess Apache y est IGNORÉ. nginx porte les vrais 301
  // (voir deploy/nginx-redirects.conf) ; ces entrées Astro sont le filet de sécurité
  // côté build et couvrent les sources de trafic connues (GSC).
  redirects: {
    // Rubrique renommée Essais → Dissertations
    "/fr/essais/": "/fr/dissertations/",
    "/en/essais/": "/en/dissertations/",

    // Résolution cannibalisation SEO (articles fusionnés vers leur version canonique)
    "/fr/blog/echecs-et-syndrome-imposteur/": "/fr/blog/syndrome-imposteur-aux-echecs/",
    "/en/blog/chess-impostor-syndrome/": "/en/blog/impostor-syndrome-in-chess/",
    "/fr/blog/bienfaits-des-echecs-sur-le-cerveau/": "/fr/blog/les-echecs-et-le-cerveau/",
    "/en/blog/chess-benefits-for-the-brain/": "/en/blog/chess-and-the-brain/",
    "/fr/blog/echecs-et-seniors/": "/fr/blog/echecs-alzheimer-prevention-declin-cognitif/",
    "/fr/blog/echecs-vieillissement-cognitif/": "/fr/blog/echecs-alzheimer-prevention-declin-cognitif/",
    "/en/blog/chess-and-seniors/": "/en/blog/chess-and-alzheimer-prevention/",
    "/en/blog/chess-and-cognitive-aging/": "/en/blog/chess-and-alzheimer-prevention/",

    // Orphelins EN à SLUG FR des articles fusionnés (trouvés via GSC 2026-06-06).
    // Avant la localisation des slugs EN, la page EN était générée à l'URL du slug FR ;
    // après fusion, elle survit en 200 dans le dist VPS SANS redirection (le fichier de
    // traduction a disparu, donc enSlugRedirects ne la couvre pas), dupliquant le
    // canonique EN et captant des impressions à 0 clic. Redirection 1:1 vers le canonique.
    "/en/blog/echecs-et-syndrome-imposteur/": "/en/blog/impostor-syndrome-in-chess/",
    "/en/blog/bienfaits-des-echecs-sur-le-cerveau/": "/en/blog/chess-and-the-brain/",
    "/en/blog/echecs-et-seniors/": "/en/blog/chess-and-alzheimer-prevention/",
    "/en/blog/echecs-vieillissement-cognitif/": "/en/blog/chess-and-alzheimer-prevention/",

    // Grand oral Maths : on conserve le gagnant prouvé (grand-oral-maths-spe-echecs,
    // 318 clics/90j) comme canonique ; le guide y est redirigé.
    "/fr/blog/guide-grand-oral-echecs-maths/": "/fr/blog/grand-oral-maths-spe-echecs/",

    // URLs héritées sans préfixe de langue (ancienne structure pré-i18n).
    // Elles cannibalisaient les versions /fr/ et fuyaient vers l'accueil.
    "/blog/les-echecs-et-l-addiction/": "/fr/blog/les-echecs-et-l-addiction/",
    "/blog/les-echecs-et-les-mathematiques/": "/fr/blog/les-echecs-et-les-mathematiques/",
    "/blog/psychologie-du-joueur-d-echecs/": "/fr/blog/psychologie-du-joueur-d-echecs/",
    "/blog/pourquoi-echecs-probleme-mathematique-impossible-et-ia/": "/fr/blog/pourquoi-echecs-probleme-mathematique-impossible-et-ia/",
    "/blog/echecs-et-femmes/": "/fr/blog/echecs-et-femmes/",
    "/blog/les-echecs-et-le-cerveau/": "/fr/blog/les-echecs-et-le-cerveau/",
    "/blog/echecs-et-autisme/": "/fr/blog/echecs-et-autisme/",

    // Anciennes URLs EN à slug FR (pré-localisation) → slug EN localisé.
    // Générées dynamiquement depuis le frontmatter des traductions (62 paires).
    ...enSlugRedirects(),
  },
  prefetch: {
    prefetchAll: true,
    defaultStrategy: "viewport",
  },
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex, rehypeAffiliateLinks],
    shikiConfig: {
      // Thème clair lisible, contraste élevé sur fond blanc.
      theme: "github-light",
      wrap: true,
    },
  },
});
