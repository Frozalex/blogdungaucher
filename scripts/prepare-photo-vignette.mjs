// Prépare une vignette à partir d'une PHOTO TIERCE (Wikimedia Commons, etc.),
// par opposition à scripts/prepare-vignette.mjs qui traite nos illustrations maison.
// Cf. tools/vignettes/VIGNETTE-SPEC.md
//
// Traitement : duotone dans la couleur d'accent de la rubrique, pour qu'une photo
// documentaire tienne visuellement à côté des illustrations générées. Le duotone
// uniformise aussi un lot de photos d'origines très diverses.
//
// PAS de filigrane : apposer notre logo sur l'œuvre d'un tiers laisserait croire
// que nous en sommes l'auteur.
//
// Usage :
//   node scripts/prepare-photo-vignette.mjs <source> <slug> <rubrique>
//   node scripts/prepare-photo-vignette.mjs /tmp/photo.jpg mon-article grand-oral
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, statSync } from "node:fs";

const W = 1200, H = 800, OG_H = 630;
const CREAM = "#faf8ef";

/** Teinte sombre du duotone par rubrique, dérivée des accents de src/data/site.ts. */
const DARK = {
  science: "#16324a",       // #5b9fd4 assombri
  esprit: "#4a2410",        // #f0a050
  societe: "#123c35",       // #5cc4b0
  "grand-oral": "#2d1b45",  // #8b5cf6
};
const LIGHT = "#f7f2e6";

const [source, slug, rub] = process.argv.slice(2);
if (!source || !slug || !DARK[rub]) {
  console.error(`Usage : node scripts/prepare-photo-vignette.mjs <source> <slug> <${Object.keys(DARK).join("|")}>`);
  process.exit(1);
}
if (!existsSync(source)) { console.error(`Source introuvable : ${source}`); process.exit(1); }

const hero = `public/images/blog/${slug}-hero.webp`;
const og = `public/images/og/${slug}-og.webp`;
for (const p of [hero, og]) mkdirSync(p.replace(/\/[^/]+$/, ""), { recursive: true });

// Seuil à 1.2 et non 1.35 : le 4:3 (1.333) est le format le plus courant des photos
// d'intérieur sur Commons, et il se recadre très bien en 3:2 (11 % de hauteur perdue).
const isLandscape = execFileSync("magick", ["identify", "-format", "%[fx:w/h>=1.2?1:0]", source], { encoding: "utf8" }).trim() === "1";
const duo = ["-colorspace", "Gray", "-contrast-stretch", "2%x1%", "+level-colors", `${DARK[rub]},${LIGHT}`];

if (isLandscape) {
  // Assez large pour remplir le cadre sans amputer le sujet.
  execFileSync("magick", [source, ...duo, "-resize", `${W}x${H}^`, "-gravity", "center", "-extent", `${W}x${H}`, "-quality", "82", hero]);
} else {
  // Portrait : letterbox sur le crème de la charte plutôt qu'un recadrage qui
  // réduirait le sujet à un bandeau. Décalage à droite = espace négatif éditorial.
  execFileSync("magick", ["-size", `${W}x${H}`, `xc:${CREAM}`,
    "(", source, ...duo, "-resize", "x720", ")",
    "-gravity", "center", "-geometry", "+150+0", "-composite", "-quality", "82", hero]);
}

execFileSync("magick", [hero, "-gravity", "center", "-crop", `${W}x${OG_H}+0+0`, "+repage", "-quality", "82", og]);

for (const p of [hero, og]) console.log(`${p}  ${(statSync(p).size / 1024).toFixed(0)} Ko`);
