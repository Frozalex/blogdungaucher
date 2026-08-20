// Régénère tous les dérivés OG (public/images/og/) à partir des vignettes hero.
// Cf. tools/vignettes/VIGNETTE-SPEC.md
//
// Deux traitements, choisis selon la nature de l'image :
//
//   - Illustration maison  → LETTERBOX sur le crème de la charte. Le fond de la
//     vignette étant déjà crème, les bandes latérales sont invisibles et l'image
//     est vue en entier sur Pinterest et les partages.
//   - Photo tierce         → RECADRAGE centré. Une photo occupe tout son cadre : la
//     letterbox y laisserait deux bandes crème bien visibles.
//
// Le critère est lu dans le frontmatter : `heroImage.sourceUrl` n'est renseigné que
// pour les images tierces (Wikimedia Commons), jamais pour nos illustrations.
//
// Usage : node scripts/regen-og-letterbox.mjs
import { readdirSync, mkdirSync, readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import path from "node:path";

const OG_W = 1200, OG_H = 630;
const CREAM = "#faf8ef";
const BLOG = "src/content/blog";

/** Slugs dont la vignette est une image tierce (frontmatter avec sourceUrl). */
function thirdPartySlugs() {
  const out = new Set();
  const walk = (d) => {
    for (const e of readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) { walk(p); continue; }
      if (!e.name.endsWith(".md")) continue;
      const fm = readFileSync(p, "utf8").split("\n---")[0];
      if (/^\s+sourceUrl:\s*https?:/m.test(fm)) out.add(e.name.replace(/\.md$/, ""));
    }
  };
  walk(BLOG);
  return out;
}

mkdirSync("public/images/og", { recursive: true });
const tiers = thirdPartySlugs();

let letterboxed = 0, cropped = 0, failed = 0;
for (const f of readdirSync("public/images/blog").filter((x) => x.endsWith("-hero.webp"))) {
  const slug = f.replace(/-hero\.webp$/, "");
  const src = `public/images/blog/${f}`;
  const dst = `public/images/og/${slug}-og.webp`;
  try {
    if (tiers.has(slug)) {
      execFileSync("magick", [src, "-gravity", "center", "-crop", `${OG_W}x${OG_H}+0+0`, "+repage", "-quality", "82", dst]);
      cropped++;
    } else {
      execFileSync("magick", [
        "-size", `${OG_W}x${OG_H}`, `xc:${CREAM}`, src,
        // `-resize WxH` sans `^` : l'image tient ENTIÈREMENT dans le cadre. Sans lui,
        // le composite déborde du canevas et se fait rogner — on retomberait sur le
        // recadrage que l'on veut justement éviter ici.
        "-resize", `${OG_W}x${OG_H}`,
        "-gravity", "center", "-composite", "-quality", "82", dst,
      ]);
      letterboxed++;
    }
  } catch {
    console.log(`❌ ${slug}`);
    failed++;
  }
}
console.log(`${letterboxed} letterboxés (illustrations), ${cropped} recadrés (photos tierces), ${failed} échec(s).`);
