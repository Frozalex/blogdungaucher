// Importe un lot d'exports Midjourney depuis ~/Téléchargements pour une rubrique donnée.
// Cf. tools/vignettes/VIGNETTE-SPEC.md
//
// Apparie chaque fichier à son article via le nom de fichier (Midjourney y recopie le
// début du prompt), contrôle la conformité chromatique par surfaces, et — avec --apply —
// lance le post-traitement puis met à jour les frontmatter.
//
// Usage :
//   node scripts/import-vignettes.mjs <rubrique>            # simulation : apparie et contrôle
//   node scripts/import-vignettes.mjs <rubrique> --apply    # traite et écrit les frontmatter
//   node scripts/import-vignettes.mjs <rubrique> --sheet    # + planche-contact dans /tmp
//
// <rubrique> : science | esprit | societe | grand-oral
import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { homedir } from "node:os";
import path from "node:path";

const DL = path.join(homedir(), "Téléchargements");

/** Bande de teinte attendue par rubrique, dérivée des accents de src/data/site.ts. */
const RUBRICS = {
  science:      { dir: "science",     hue: [185, 235], label: "bleu bleuet" },
  esprit:       { dir: "esprit",      hue: [8, 48],    label: "ambre" },
  societe:      { dir: "societe",     hue: [145, 185], label: "vert d'eau" },
  "grand-oral": { dir: "grand-oral",  hue: [250, 290], label: "violet" },
};

const args = process.argv.slice(2);
const rub = args.find((a) => !a.startsWith("--"));
const APPLY = args.includes("--apply");
const SHEET = args.includes("--sheet");

if (!RUBRICS[rub]) {
  console.error(`Rubrique inconnue. Attendu : ${Object.keys(RUBRICS).join(" | ")}`);
  process.exit(1);
}
const { dir, hue: [hMin, hMax], label } = RUBRICS[rub];

// ── Appariement ───────────────────────────────────────────────────────────────
const md = readFileSync(`tools/vignettes/prompts-${rub}.md`, "utf8");
const slugs = [...md.matchAll(/^### `([^`]+)`/gm)].map((m) => m[1]);
const alts = [...md.matchAll(/^`alt` : `([^`]+)`/gm)].map((m) => m[1]);
const firsts = [...md.matchAll(/```\n([\s\S]*?)\n```/g)].map((m) =>
  m[1].split("\n")[0].toLowerCase().replace(/[^a-z0-9]+/g, " ").trim(),
);

const norm = (f) =>
  f.replace(/^u\d+_/, "").replace(/_[0-9a-f-]{36}_\d+\.png$/, "")
   .replace(/[^a-zA-Z0-9]+/g, " ").toLowerCase().trim();

const pairs = [], orphans = [];
for (const file of readdirSync(DL).filter((f) => /^u\d+_.*\.png$/.test(f))) {
  const words = norm(file).split(" ");
  let best = -1, score = 0;
  firsts.forEach((p, i) => {
    const b = p.split(" ");
    let k = 0;
    while (k < words.length && k < b.length && words[k] === b[k]) k++;
    if (k > score) { score = k; best = i; }
  });
  // 4 mots de préfixe commun : au-dessus du bruit, en dessous des collisions observées.
  if (score >= 4) pairs.push({ file, slug: slugs[best], alt: alts[best], score });
  else orphans.push({ file, frag: norm(file).slice(0, 46) });
}

const seen = new Map();
pairs.forEach((p) => seen.set(p.slug, (seen.get(p.slug) ?? 0) + 1));
const dups = [...seen].filter(([, n]) => n > 1);

// ── Indication chromatique (PAS un verdict) ───────────────────────────────────
// Quatre tentatives de contrôle automatique ont donné quatre réponses différentes, dont
// deux faux « tout va bien » sur des lots réellement dérivés. La raison est structurelle :
// le papier crème mesure teinte 42°, saturation 49 %, luminosité 87 % — ce n'est pas un
// neutre mais un ambre franc, qui recouvre la région même de l'accent Esprit. Aucun seuil
// hue/sat/lum ne les sépare.
//
// On affiche donc une répartition indicative, sans verdict. **La planche-contact fait
// foi** : c'est elle qui a détecté les dérives que les scripts avaient manquées.
function chroma(file) {
  const txt = execFileSync("magick", [file, "-resize", "120x80!", "-colorspace", "HSL", "-depth", "8", "txt:-"], {
    encoding: "utf8", maxBuffer: 64 << 20,
  });
  let inBand = 0, outBand = 0;
  for (const line of txt.split("\n")) {
    // ImageMagick sort les canaux dans l'ordre (H, S, L) — pas (H, L, S).
    const m = line.match(/\((\d+),(\d+),(\d+)\)/);
    if (!m) continue;
    const h = (+m[1] / 255) * 360, s = (+m[2] / 255) * 100, l = (+m[3] / 255) * 100;
    // Seuil de saturation bas : la sérigraphie est volontairement désaturée (18–37 %),
    // un seuil à 22 % éliminerait l'accent lui-même en même temps que les neutres.
    if (s < 12) continue;           // gris et encre neutre
    if (l < 15) continue;           // encre noire
    // Le papier crème n'est PAS neutre : il pèse à ~45° de teinte pour ~18 % de
    // saturation, soit en plein dans la bande ambre. Sans cette exclusion il gonfle
    // le score d'Esprit (faux positifs) et plombe celui des trois autres rubriques
    // (faux négatifs). L'accent ambre réel, lui, monte à 75–95 % de saturation.
    if (h >= 25 && h <= 60 && s < 45) continue;
    if (h >= hMin && h <= hMax) inBand++; else outBand++;
  }
  return { inBand, outBand, ok: inBand > outBand };
}

console.log(`\nRubrique ${rub} — accent attendu : ${label} (teinte ${hMin}–${hMax}°)\n`);
console.log("slug".padEnd(46) + "score   % dans la bande (indicatif)");
for (const p of pairs.sort((a, b) => a.slug.localeCompare(b.slug))) {
  const c = chroma(path.join(DL, p.file));
  const tot = c.inBand + c.outBand;
  const pct = tot ? Math.round((c.inBand / tot) * 100) : 0;
  const bar = "█".repeat(Math.round(pct / 5)).padEnd(20, "·");
  console.log(p.slug.padEnd(46) + String(p.score).padStart(4) + "   " + bar + " " + String(pct).padStart(3) + "%");
}

console.log(`\n${pairs.length} appariés, ${orphans.length} non appariés.`);
if (dups.length) console.log("⚠ DOUBLONS : " + dups.map(([s, n]) => `${s} ×${n}`).join(", "));
if (orphans.length) console.log("Non appariés (probablement d'une autre rubrique) :\n" + orphans.map((o) => "  " + o.frag).join("\n"));

console.log(
  "\n⚠ Le pourcentage ci-dessus est INDICATIF, pas un verdict — le papier crème pèse dans\n" +
  "  la bande ambre et fausse la mesure. Regarder la planche-contact avant de valider :\n" +
  `  node scripts/import-vignettes.mjs ${rub} --sheet`,
);

// ── Application ───────────────────────────────────────────────────────────────
if (!APPLY) {
  console.log("\nSimulation. Relancer avec --apply pour traiter et écrire les frontmatter.");
} else {
  console.log("");
  for (const p of pairs) {
    execFileSync("node", ["scripts/prepare-vignette.mjs", path.join(DL, p.file), p.slug], { stdio: "ignore" });
    const f = `src/content/blog/${dir}/${p.slug}.md`;
    if (!existsSync(f)) { console.log(`❌ ${p.slug} : article introuvable`); continue; }
    const src = readFileSync(f, "utf8");
    const cut = src.indexOf("\n---", 4);
    let fm = src.slice(0, cut);
    const body = src.slice(cut);
    const block = `heroImage:\n  src: /images/blog/${p.slug}-hero.webp\n  alt: >-\n    ${p.alt}`;
    const og = `ogImage: /images/og/${p.slug}-og.webp`;
    // Remplace le bloc existant en entier (y compris credit/license, qui ne valent que
    // pour les images Wikimedia et se rendent en « Photographie : … » sous une illustration).
    if (/^heroImage:/m.test(fm)) fm = fm.replace(/^heroImage:\n(?: {2}\S[^\n]*\n| {4}[^\n]*\n)*/m, block + "\n");
    if (/^ogImage:/m.test(fm)) fm = fm.replace(/^ogImage:.*$/m, og);
    if (!/^heroImage:/m.test(fm)) {
      const ins = `${og}\n${block}\n`;
      fm = /^faq:/m.test(fm) ? fm.replace(/^faq:/m, ins + "faq:") : fm.trimEnd() + "\n" + ins;
    }
    writeFileSync(f, fm + body);
    console.log(`✔ ${p.slug}`);
  }
  console.log(`\n${pairs.length} vignettes intégrées.`);
}

if (SHEET) {
  const files = pairs.map((p) => `public/images/blog/${p.slug}-hero.webp`).filter(existsSync);
  if (files.length) {
    const out = `/tmp/planche-${rub}.png`;
    execFileSync("magick", ["montage", ...files, "-tile", "2x", "-geometry", "380x253+8+8", "-background", "#fcfaf6", out]);
    console.log(`\nPlanche-contact : ${out} — la regarder avant de valider.`);
  }
}
