/**
 * Rasterise public/images/og-default.svg → og-default.png for Open Graph.
 * Many platforms (WhatsApp, LinkedIn, etc.) ignore or mishandle SVG og:image.
 */
import sharp from "sharp";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const svgPath = join(root, "public/images/og-default.svg");
const outPath = join(root, "public/images/og-default.png");

await sharp(svgPath).png().toFile(outPath);
console.log("Wrote", outPath);
