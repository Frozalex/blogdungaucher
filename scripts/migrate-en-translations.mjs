/**
 * migrate-en-translations.mjs
 *
 * 1. Pour chaque fichier dans src/content/blog-translations/en/*.md :
 *    - Trouve le fichier FR correspondant dans src/content/blog/*.md
 *    - Extrait titleEn, excerptEn, seoTitleEn, seoDescriptionEn, faqEn du frontmatter FR
 *    - Injecte ces champs (renommés sans le suffixe En) en tant que frontmatter YAML dans le fichier EN
 *
 * 2. Pour chaque fichier dans src/content/blog/*.md qui a des champs *En :
 *    - Supprime titleEn, excerptEn, seoTitleEn, seoDescriptionEn, faqEn du frontmatter
 *
 * Usage:
 *   node scripts/migrate-en-translations.mjs [--dry-run]
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import yaml from "js-yaml";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const BLOG_DIR = path.join(ROOT, "src/content/blog");
const EN_DIR = path.join(ROOT, "src/content/blog-translations/en");

const DRY_RUN = process.argv.includes("--dry-run");

if (DRY_RUN) console.log("🔍 Mode dry-run — aucun fichier ne sera modifié.\n");

// ─── Utilitaires frontmatter ──────────────────────────────────────────────────

const FRONTMATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/;

function parseFrontmatter(content) {
  const match = content.match(FRONTMATTER_RE);
  if (!match) return { data: {}, body: content };
  try {
    const data = yaml.load(match[1]) ?? {};
    return { data, body: match[2] };
  } catch (e) {
    throw new Error(`Erreur YAML: ${e.message}`);
  }
}

function stringifyFrontmatter(data, body) {
  const fm = yaml.dump(data, {
    lineWidth: 120,
    quotingType: '"',
    forceQuotes: false,
    noRefs: true,
  });
  return `---\n${fm}---\n${body}`;
}

// ─── Étape 1 : construire l'index des fichiers FR ─────────────────────────────

const frFiles = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".md"));

/** slug → { data, body, filePath } */
const frIndex = {};
for (const filename of frFiles) {
  const slug = filename.replace(/\.md$/, "");
  const filePath = path.join(BLOG_DIR, filename);
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, body } = parseFrontmatter(raw);
  frIndex[slug] = { data, body, filePath };
}

// ─── Étape 2 : injecter le frontmatter dans les fichiers EN ──────────────────

const enFiles = fs.readdirSync(EN_DIR).filter((f) => f.endsWith(".md"));
const EN_FIELDS = ["titleEn", "excerptEn", "seoTitleEn", "seoDescriptionEn", "faqEn"];

let injected = 0;
let skipped = 0;

for (const filename of enFiles) {
  const slug = filename.replace(/\.md$/, "");
  const enFilePath = path.join(EN_DIR, filename);
  const rawEn = fs.readFileSync(enFilePath, "utf-8");

  // Vérifier si le fichier EN a déjà un frontmatter
  if (rawEn.startsWith("---")) {
    console.log(`⏭  ${filename} — déjà un frontmatter, ignoré.`);
    skipped++;
    continue;
  }

  const fr = frIndex[slug];
  if (!fr) {
    console.warn(`⚠️  ${filename} — pas de fichier FR correspondant (${slug}.md), ignoré.`);
    skipped++;
    continue;
  }

  const { data: frData } = fr;

  // Construire le frontmatter EN
  const enData = {};
  if (frData.titleEn) enData.title = frData.titleEn;
  if (frData.excerptEn) enData.excerpt = frData.excerptEn;
  if (frData.seoTitleEn) enData.seoTitle = frData.seoTitleEn;
  if (frData.seoDescriptionEn) enData.seoDescription = frData.seoDescriptionEn;
  if (frData.faqEn && Array.isArray(frData.faqEn) && frData.faqEn.length > 0) {
    enData.faq = frData.faqEn;
  }

  if (Object.keys(enData).length === 0) {
    console.warn(`⚠️  ${filename} — aucun champ *En trouvé dans ${slug}.md, ignoré.`);
    skipped++;
    continue;
  }

  const newContent = stringifyFrontmatter(enData, rawEn.startsWith("\n") ? rawEn : "\n" + rawEn);

  if (DRY_RUN) {
    console.log(`✅ [dry] ${filename} → frontmatter à injecter :`);
    console.log(yaml.dump(enData, { lineWidth: 80 }));
  } else {
    fs.writeFileSync(enFilePath, newContent, "utf-8");
    console.log(`✅ ${filename} — frontmatter injecté (${Object.keys(enData).join(", ")})`);
  }
  injected++;
}

console.log(`\n📦 Fichiers EN traités : ${injected} injectés, ${skipped} ignorés.\n`);

// ─── Étape 3 : nettoyer les champs *En dans les fichiers FR ──────────────────

const EN_FIELD_SET = new Set(EN_FIELDS);
let cleaned = 0;
let unchanged = 0;

for (const filename of frFiles) {
  const slug = filename.replace(/\.md$/, "");
  const { data, body, filePath } = frIndex[slug];

  const hasEnFields = EN_FIELDS.some((f) => f in data);
  if (!hasEnFields) {
    unchanged++;
    continue;
  }

  // Supprimer les champs *En
  const cleanData = Object.fromEntries(
    Object.entries(data).filter(([k]) => !EN_FIELD_SET.has(k))
  );

  if (DRY_RUN) {
    const removed = EN_FIELDS.filter((f) => f in data);
    console.log(`🧹 [dry] ${filename} — supprimerait : ${removed.join(", ")}`);
  } else {
    const newContent = stringifyFrontmatter(cleanData, body);
    fs.writeFileSync(filePath, newContent, "utf-8");
    const removed = EN_FIELDS.filter((f) => f in data);
    console.log(`🧹 ${filename} — supprimé : ${removed.join(", ")}`);
  }
  cleaned++;
}

console.log(`\n🗑️  Fichiers FR nettoyés : ${cleaned}, inchangés : ${unchanged}.\n`);

if (!DRY_RUN) {
  console.log("✨ Migration terminée. Prochaines étapes :");
  console.log("   1. Mettre à jour src/content.config.ts (ajouter enTranslations, retirer champs *En du blog)");
  console.log("   2. Mettre à jour src/utils/english-article.ts (utiliser getCollection)");
  console.log("   3. Mettre à jour src/pages/en/blog/[slug].astro");
  console.log("   4. npm run build pour vérifier\n");
}
