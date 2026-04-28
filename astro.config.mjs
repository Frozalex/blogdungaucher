import { defineConfig } from "astro/config";

import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

import { SITE_ORIGIN } from "./scripts/site-origin.mjs";

/**
 * `site` fixe (sans lecture de SITE / PUBLIC_SITE_URL au build).
 * Sinon un VPS qui exporte SITE=http://blogdungaucher.com:8080 pour Node peut faire
 * dériver import.meta.env.SITE et certaines réécritures d’URL Astro — Google voit alors
 * du HTML avec la mauvaise origine même si le navigateur redirige.
 */
export default defineConfig({
  site: SITE_ORIGIN,
  output: "static",
  trailingSlash: "always",
  compressHTML: true,
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
  },
});
