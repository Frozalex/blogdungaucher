import sharp from "sharp";
import { writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, "..", "public");
const imagesDir = join(publicDir, "images");

// SVG source sans media query (couleurs light mode hardcodées pour sharp/librsvg)
const horseSvg = (size, bg, fg, radius) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="${size}" height="${size}">
  <rect fill="${bg}" width="32" height="32" rx="${radius}"/>
  <path fill="${fg}" fill-rule="evenodd" clip-rule="evenodd" d="M 11.5,-0.5 C 12.8333,-0.5 14.1667,-0.5 15.5,-0.5C 17.7706,1.26589 19.9373,3.26589 22,5.5C 23.8974,9.70125 25.7307,13.8679 27.5,18C 28.1117,21.5511 26.7784,24.0511 23.5,25.5C 21.8163,23.6487 19.9829,21.982 18,20.5C 16.9887,21.3366 15.8221,21.67 14.5,21.5C 14.6495,20.448 14.4828,19.448 14,18.5C 12.4916,20.0174 11.6583,21.8507 11.5,24C 12.6257,26.4227 13.6257,28.9227 14.5,31.5C 13.5,31.5 12.5,31.5 11.5,31.5C 4.34585,24.0413 5.01252,17.208 13.5,11C 10.774,12.3081 7.77404,13.1414 4.5,13.5C 4.67189,8.79128 6.83856,5.12461 11,2.5C 11.4828,1.55198 11.6495,0.551975 11.5,-0.5 Z M 15.5,17.5 C 15.5173,15.9719 16.184,15.4719 17.5,16C 16.9558,16.7172 16.2891,17.2172 15.5,17.5 Z"/>
</svg>`;

async function generate() {
  // favicon-32x32.png — fallback pour navigateurs sans support SVG
  await sharp(Buffer.from(horseSvg(32, "#fcfaf6", "#18181b", 6)))
    .resize(32, 32)
    .png()
    .toFile(join(imagesDir, "favicon-32x32.png"));
  console.log("✓ favicon-32x32.png");

  // favicon-16x16.png — très petit, contours nets
  await sharp(Buffer.from(horseSvg(16, "#fcfaf6", "#18181b", 4)))
    .resize(16, 16)
    .png()
    .toFile(join(imagesDir, "favicon-16x16.png"));
  console.log("✓ favicon-16x16.png");

  // apple-touch-icon.png — 180x180 pour iOS (fond plein, pas transparent)
  await sharp(Buffer.from(horseSvg(180, "#fcfaf6", "#18181b", 34)))
    .resize(180, 180)
    .png()
    .toFile(join(imagesDir, "apple-touch-icon.png"));
  console.log("✓ apple-touch-icon.png");

  console.log("\nTous les favicons PNG générés dans public/images/");
}

generate().catch(console.error);
