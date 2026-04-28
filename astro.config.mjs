import { defineConfig } from "astro/config";

import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

/** Toujours HTTPS, sans port — évite :8080 ou http si SITE est mal défini au build (CI, Docker). */
const PRODUCTION_ORIGIN = "https://blogdungaucher.com";

function resolveSite() {
  const raw =
    typeof process.env.PUBLIC_SITE_URL === "string"
      ? process.env.PUBLIC_SITE_URL.trim()
      : typeof process.env.SITE === "string"
        ? process.env.SITE.trim()
        : "";
  if (!raw) return PRODUCTION_ORIGIN;
  try {
    const u = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`);
    const host = u.hostname.replace(/^www\./, "");
    if (host === "blogdungaucher.com") return PRODUCTION_ORIGIN;
    u.protocol = "https:";
    if (u.port === "80" || u.port === "443") u.port = "";
    return u.origin;
  } catch {
    return PRODUCTION_ORIGIN;
  }
}

export default defineConfig({
  site: resolveSite(),
  output: "static",
  trailingSlash: "always",
  compressHTML: true,
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
  },
});
