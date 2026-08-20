// Régénère tous les dérivés OG (public/images/og/) à partir des vignettes hero, en
// letterbox sur le crème de la charte plutôt qu'en recadrage centré.
// Cf. tools/vignettes/VIGNETTE-SPEC.md — le recadrage 3:2 → 1,91:1 amputait 21 % de
// l'image, or c'est la version OG qui circule sur Pinterest et les partages sociaux.
//
// Usage : node scripts/regen-og-letterbox.mjs
import { readdirSync, mkdirSync } from "node:fs";
import { execFileSync } from "node:child_process";

const OG_W = 1200, OG_H = 630;
const CREAM = "#faf8ef";

mkdirSync("public/images/og", { recursive: true });

let done = 0, failed = 0;
for (const f of readdirSync("public/images/blog").filter((x) => x.endsWith("-hero.webp"))) {
  const slug = f.replace(/-hero\.webp$/, "");
  try {
    execFileSync("magick", [
      "-size", `${OG_W}x${OG_H}`, `xc:${CREAM}`,
      `public/images/blog/${f}`,
      // `-resize WxH` SANS `^` : l'image est réduite pour tenir ENTIÈREMENT dans le
      // cadre (945x630 pour une vignette 3:2). Sans ce redimensionnement, le composite
      // déborde du canevas et se fait rogner — on retombe exactement sur le recadrage
      // que l'on voulait éviter.
      "-resize", `${OG_W}x${OG_H}`,
      "-gravity", "center", "-composite",
      "-quality", "82", `public/images/og/${slug}-og.webp`,
    ]);
    done++;
  } catch {
    console.log(`❌ ${slug}`);
    failed++;
  }
}
console.log(`${done} dérivés OG régénérés en letterbox, ${failed} échec(s).`);
