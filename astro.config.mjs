import { defineConfig } from "astro/config";

import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

export default defineConfig({
  site: "https://blogdungaucher.com",
  output: "static",
  trailingSlash: "always",
  compressHTML: true,
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
  },
});
