// Prépare une vignette d'article à partir d'un export Midjourney brut.
// Cf. tools/vignettes/VIGNETTE-SPEC.md
//
// Produit deux fichiers :
//   public/images/blog/<slug>-hero.webp  1200×800 (3:2, ratio de .card-thumb-wrap)
//   public/images/og/<slug>-og.webp      1200×630 (1,91:1, partage social / Pinterest)
//
// Usage :
//   node scripts/prepare-vignette.mjs <source> <slug> [options]
//   node scripts/prepare-vignette.mjs ~/Téléchargements/mj.png echecs-et-dopamine
//
// Options :
//   --light          force le filigrane blanc (par défaut : choisi selon la luminance du coin)
//   --dark           force le filigrane encre foncée
//   --no-watermark   pas de filigrane
//   --opacity=0.34   opacité du filigrane (défaut 0.34)
//   --quality=82     qualité WebP (défaut 82)
import { readFileSync, writeFileSync, mkdirSync, existsSync, statSync } from "node:fs";
import { dirname } from "node:path";
import sharp from "sharp";

const HERO_W = 1200, HERO_H = 800;
const OG_W = 1200, OG_H = 630;
const WM_H = 96;       // hauteur du cavalier en px sur le master
const WM_MARGIN = 34;  // marge depuis les bords bas et gauche
const WM_OPACITY = 0.34; // renforcé le 17/08/2026 : à 0.18 le cavalier ne se voyait pas
const INK = "#1c1a16";
const WEIGHT_WARN = 200 * 1024;

const args = process.argv.slice(2);
const flags = new Map(
  args.filter((a) => a.startsWith("--")).map((a) => {
    const [k, v] = a.replace(/^--/, "").split("=");
    return [k, v ?? true];
  }),
);
const [source, slug] = args.filter((a) => !a.startsWith("--"));

if (!source || !slug) {
  console.error("Usage : node scripts/prepare-vignette.mjs <source> <slug> [--light] [--no-watermark]");
  process.exit(1);
}
if (!existsSync(source)) {
  console.error(`Source introuvable : ${source}`);
  process.exit(1);
}
if (!/^[a-z0-9-]+$/.test(slug)) {
  console.error(`Slug invalide : « ${slug} » — attendu en ASCII kebab-case, sans accent ni extension.`);
  process.exit(1);
}

const quality = Number(flags.get("quality") ?? 82);
const opacity = Number(flags.get("opacity") ?? WM_OPACITY);
const heroPath = `public/images/blog/${slug}-hero.webp`;
const ogPath = `public/images/og/${slug}-og.webp`;

/**
 * Le coin bas-gauche n'est pas toujours clair (ondes, aplats sombres) : un cavalier
 * encre sur fond foncé devient invisible. On échantillonne la zone d'accueil et on
 * bascule sur le filigrane blanc en dessous du seuil.
 */
async function isDarkCorner(buf) {
  const side = WM_H + 2 * WM_MARGIN;
  // sharp().stats() analyse l'image TELLE QUE CHARGÉE et n'applique pas les opérations
  // du pipeline : un .extract() chaîné avant .stats() est purement ignoré. Il faut donc
  // matérialiser le recadrage dans un buffer avant de mesurer, sans quoi on mesure la
  // luminosité de l'image entière et le filigrane sort invisible sur les coins sombres.
  const corner = await sharp(buf)
    .extract({ left: 0, top: HERO_H - WM_H - 2 * WM_MARGIN, width: side, height: side })
    .toBuffer();
  const { channels } = await sharp(corner).stats();
  const [r, g, b] = channels.map((c) => c.mean);
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) < 128;
}

/** Cavalier du logo rastérisé à la bonne hauteur, recoloré et passé en opacité réduite. */
async function watermark(light) {
  const src = light ? "logo-transparent-white.svg" : "logo-transparent.svg";
  const svg = readFileSync(`public/images/${src}`, "utf8").replace(
    /fill="#[0-9a-fA-F]{6}"/g,
    `fill="${light ? "#ffffff" : INK}"`,
  );
  // viewBox 625×868 → on cible la hauteur, sharp déduit la largeur.
  return sharp(Buffer.from(svg), { density: 600 })
    .resize({ height: WM_H })
    .composite([{
      // Applique l'opacité en multipliant le canal alpha existant du SVG.
      input: Buffer.from([255, 255, 255, Math.round(opacity * 255)]),
      raw: { width: 1, height: 1, channels: 4 },
      tile: true,
      blend: "dest-in",
    }])
    .png()
    .toBuffer();
}

const meta = await sharp(source).metadata();
const ratio = meta.width / meta.height;
if (Math.abs(ratio - 1.5) > 0.02) {
  console.warn(
    `⚠ Source en ${meta.width}×${meta.height} (ratio ${ratio.toFixed(2)}), attendu 3:2 (1.50).\n` +
    `  L'image va être recadrée au centre — régénérer avec --ar 3:2 si le sujet est rogné.`,
  );
}

for (const p of [heroPath, ogPath]) mkdirSync(dirname(p), { recursive: true });

const base = await sharp(source)
  .resize(HERO_W, HERO_H, { fit: "cover", position: "centre" })
  .toBuffer();

let hero = sharp(base);
if (!flags.has("no-watermark")) {
  const light = flags.has("light") || (!flags.has("dark") && (await isDarkCorner(base)));
  console.log(`filigrane : ${light ? "blanc" : "encre"}${flags.has("light") || flags.has("dark") ? " (forcé)" : " (auto)"}`);
  hero = hero.composite([{
    input: await watermark(light),
    left: WM_MARGIN,
    top: HERO_H - WM_H - WM_MARGIN,
  }]);
}
// Le grain de sérigraphie compresse mal : on baisse la qualité par paliers jusqu'à passer
// sous le plafond, plutôt que d'imposer une reprise manuelle sur chaque image texturée.
let q = quality;
let heroBuf = await hero.webp({ quality: q }).toBuffer();
while (heroBuf.length > WEIGHT_WARN && q > 58) {
  q -= 8;
  heroBuf = await sharp(base)
    .composite(flags.has("no-watermark") ? [] : [{
      input: await watermark(flags.has("light") || (!flags.has("dark") && (await isDarkCorner(base)))),
      left: WM_MARGIN,
      top: HERO_H - WM_H - WM_MARGIN,
    }])
    .webp({ quality: q })
    .toBuffer();
}
if (q !== quality) console.log(`qualité abaissée ${quality} → ${q} pour tenir sous ${WEIGHT_WARN / 1024} Ko`);
// Écriture directe du buffer : le repasser par sharp().toFile() le ré-encoderait une
// seconde fois à la qualité par défaut — perte de qualité et poids gonflé.
writeFileSync(heroPath, heroBuf);

// Le dérivé OG est recadré DANS le master : le filigrane et le sujet restent alignés.
await sharp(heroBuf)
  .extract({ left: 0, top: Math.round((HERO_H - OG_H) / 2), width: OG_W, height: OG_H })
  .webp({ quality: q })
  .toFile(ogPath);

for (const p of [heroPath, ogPath]) {
  const size = statSync(p).size;
  const flag = size > WEIGHT_WARN ? " ⚠ au-dessus du plafond de 200 Ko" : "";
  console.log(`${p}  ${(size / 1024).toFixed(0)} Ko${flag}`);
}

console.log(`
Frontmatter à insérer dans l'article :

heroImage:
  src: /images/blog/${slug}-hero.webp
  alt: "…décrire ce que MONTRE l'image, pas le titre de l'article…"
`);
