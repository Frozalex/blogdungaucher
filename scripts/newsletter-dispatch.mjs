/**
 * Dispatcher newsletter — envoie un email "nouvel article" QUAND l'article
 * passe en ligne (publishDate ≤ now), pas quand il est commité.
 *
 * Pour chaque article nouvellement publié et pas encore notifié, délègue à
 * scripts/send-new-article-email.mjs (qui crée la campagne Brevo programmée
 * à H+1) puis enregistre son slug dans le fichier d'état pour ne jamais
 * renvoyer deux fois le même.
 *
 * Usage :
 *   node scripts/newsletter-dispatch.mjs           # dispatch normal
 *   SEED=1 node scripts/newsletter-dispatch.mjs     # marque tout le backlog
 *                                                   #   déjà publié comme "envoyé"
 *                                                   #   SANS rien envoyer (1er run)
 *   DRY_RUN=1 node scripts/newsletter-dispatch.mjs  # simulation (transmis au sous-script)
 *
 * Variables d'env (transmises au sous-script) : voir send-new-article-email.mjs.
 *   NEWSLETTER_STATE_FILE  chemin du fichier d'état (défaut deploy/newsletter-sent.json)
 *   BLOG_CONTENT_DIR       racine des articles (défaut src/content/blog)
 */
import fs from "node:fs/promises";
import path from "node:path";
import { execFileSync } from "node:child_process";

const STATE_FILE = process.env.NEWSLETTER_STATE_FILE ?? "deploy/newsletter-sent.json";
const CONTENT_DIR = process.env.BLOG_CONTENT_DIR ?? "src/content/blog";
const SEND_SCRIPT = "scripts/send-new-article-email.mjs";
const seed = process.env.SEED === "1";

// Cohérent avec send-new-article-email.mjs : le Grand oral n'est pas diffusé.
const EXCLUDED_CATEGORIES = new Set(["grand-oral"]);

// ── Lecture du publishDate / category depuis le frontmatter (parse minimal) ──
function readFrontmatterField(md, field) {
  const m = md.match(/^---\r?\n([\s\S]+?)\r?\n---/);
  if (!m) return null;
  const line = m[1]
    .split(/\r?\n/)
    .find((l) => new RegExp(`^${field}\\s*:`).test(l));
  if (!line) return null;
  let v = line.replace(new RegExp(`^${field}\\s*:\\s*`), "").trim();
  if (/^".*"$/.test(v) || /^'.*'$/.test(v)) v = v.slice(1, -1);
  return v || null;
}

// ── Trouver tous les .md d'articles ─────────────────────────────────────────
async function listArticles(dir) {
  const out = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...(await listArticles(full)));
    else if (e.isFile() && e.name.endsWith(".md")) out.push(full);
  }
  return out;
}

// ── État ────────────────────────────────────────────────────────────────────
async function loadState() {
  try {
    const raw = JSON.parse(await fs.readFile(STATE_FILE, "utf8"));
    return Array.isArray(raw?.sent) ? raw : { sent: [], updatedAt: null };
  } catch {
    return { sent: [], updatedAt: null };
  }
}
async function saveState(state) {
  state.updatedAt = new Date().toISOString();
  await fs.mkdir(path.dirname(STATE_FILE), { recursive: true });
  await fs.writeFile(STATE_FILE, JSON.stringify(state, null, 2) + "\n");
}

// ── Main ─────────────────────────────────────────────────────────────────────
const now = new Date();
const files = await listArticles(CONTENT_DIR);
const state = await loadState();
const sent = new Set(state.sent);

// Articles déjà en ligne (publishDate passée), hors catégories exclues.
const published = [];
for (const file of files) {
  const md = await fs.readFile(file, "utf8");
  const dateStr = readFrontmatterField(md, "publishDate");
  const category = readFrontmatterField(md, "category");
  if (!dateStr) continue;
  const publishDate = new Date(dateStr);
  if (Number.isNaN(publishDate.getTime()) || publishDate > now) continue;
  if (category && EXCLUDED_CATEGORIES.has(category)) continue;
  published.push({ file, slug: path.basename(file, ".md") });
}

const pending = published.filter((p) => !sent.has(p.slug));

// ── Mode SEED : marquer tout le backlog publié comme déjà notifié ───────────
if (seed) {
  for (const p of published) sent.add(p.slug);
  state.sent = [...sent].sort();
  await saveState(state);
  console.log(`SEED : ${published.length} articles déjà publiés marqués comme envoyés.`);
  console.log(`État écrit → ${STATE_FILE}`);
  process.exit(0);
}

if (pending.length === 0) {
  console.log("Aucun nouvel article à notifier.");
  process.exit(0);
}

console.log(`${pending.length} article(s) à notifier : ${pending.map((p) => p.slug).join(", ")}`);

let ok = 0;
for (const p of pending) {
  try {
    execFileSync("node", [SEND_SCRIPT, p.file], { stdio: "inherit" });
    sent.add(p.slug);
    ok++;
  } catch (err) {
    // Échec Brevo : on n'enregistre PAS le slug → réessai au prochain run.
    console.error(`✗ Échec de l'envoi pour ${p.slug} — sera réessayé. (${err.message})`);
  }
}

state.sent = [...sent].sort();
await saveState(state);
console.log(`Terminé : ${ok}/${pending.length} programmé(s). État écrit → ${STATE_FILE}`);
