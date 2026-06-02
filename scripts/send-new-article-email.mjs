/**
 * Programme un email "nouvel article" dans Brevo, à envoyer ~1h après le déploiement.
 *
 * Usage : node scripts/send-new-article-email.mjs <chemin/vers/article.md>
 *
 * Variables d'env requises :
 *   BREVO_API_KEY        clé API REST v3 Brevo
 *   BREVO_LIST_ID        id de la liste cible (défaut 2)
 *   BREVO_SENDER_EMAIL   adresse expéditrice vérifiée dans Brevo
 *   BREVO_SENDER_NAME    nom affiché (défaut "Blog d'un Gaucher")
 *   SITE_URL             origine publique (défaut https://blogdungaucher.com)
 *   SEND_DELAY_MINUTES   délai avant envoi (défaut 60)
 */
import fs from "node:fs/promises";
import path from "node:path";

const articlePath = process.argv[2];
if (!articlePath) {
  console.error("Usage: send-new-article-email.mjs <article.md>");
  process.exit(1);
}

const apiKey      = process.env.BREVO_API_KEY ?? "";
const listId      = parseInt(process.env.BREVO_LIST_ID ?? "2", 10);
const senderEmail = process.env.BREVO_SENDER_EMAIL ?? "";
const senderName  = process.env.BREVO_SENDER_NAME ?? "Blog d'un Gaucher";
const siteUrl     = (process.env.SITE_URL ?? "https://blogdungaucher.com").replace(/\/$/, "");
const delayMin    = parseInt(process.env.SEND_DELAY_MINUTES ?? "60", 10);

const dryRun = process.env.DRY_RUN === "1";

if (!dryRun && (!apiKey || !senderEmail)) {
  console.error("BREVO_API_KEY et BREVO_SENDER_EMAIL sont requis.");
  process.exit(1);
}

// ── Frontmatter parser minimal (gère: simple, "quoted", >- folded, nested) ─
function parseFrontmatter(md) {
  const m = md.match(/^---\r?\n([\s\S]+?)\r?\n---/);
  if (!m) return {};
  const lines = m[1].split(/\r?\n/);
  const out = {};
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const kv = line.match(/^([A-Za-z_][\w-]*)\s*:\s*(.*)$/);
    if (!kv) { i++; continue; }
    const key = kv[1];
    let val = kv[2];

    // Folded block scalar (>-, >, |, |-)
    if (/^[>|][-+]?\s*$/.test(val)) {
      const fold = val.trim().startsWith(">");
      const parts = [];
      i++;
      while (i < lines.length && /^\s+\S/.test(lines[i])) {
        parts.push(lines[i].trim());
        i++;
      }
      out[key] = parts.join(fold ? " " : "\n");
      continue;
    }

    // Nested object (no inline value, next lines indented)
    if (val.trim() === "" && i + 1 < lines.length && /^\s+\w/.test(lines[i + 1])) {
      const nested = {};
      i++;
      while (i < lines.length && /^\s+\w/.test(lines[i])) {
        const sub = lines[i].match(/^\s+([A-Za-z_][\w-]*)\s*:\s*(.*)$/);
        if (sub) {
          let sv = sub[2].trim();
          if (/^".*"$/.test(sv) || /^'.*'$/.test(sv)) sv = sv.slice(1, -1);
          nested[sub[1]] = sv;
        }
        i++;
      }
      out[key] = nested;
      continue;
    }

    val = val.trim();
    if (/^".*"$/.test(val) || /^'.*'$/.test(val)) val = val.slice(1, -1);
    out[key] = val;
    i++;
  }
  return out;
}

const escapeHtml = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// ── Lire et parser l'article ─────────────────────────────────────────────
const md = await fs.readFile(articlePath, "utf8");
const fm = parseFrontmatter(md);
const slug = path.basename(articlePath, ".md");
const url = `${siteUrl}/fr/blog/${slug}/`;

const title = fm.title || "Nouvel article";
const excerpt = fm.excerpt || "";
const heroSrc = fm.heroImage && typeof fm.heroImage === "object" ? fm.heroImage.src : null;
const heroAbs = heroSrc ? (heroSrc.startsWith("http") ? heroSrc : `${siteUrl}${heroSrc}`) : null;
const category = fm.category || "";

const categoryMeta = {
  science:     { label: "Science",    color: "#5b9fd4" },
  esprit:      { label: "Esprit",     color: "#f0a050" },
  societe:     { label: "Société",    color: "#5cc4b0" },
  "grand-oral": { label: "Grand oral", color: "#8b5cf6" },
};
const cat = categoryMeta[category] || { label: "Article", color: "#2a8a5f" };

// Le Grand oral est volontairement exclu de la newsletter (audience différente)
if (category === "grand-oral") {
  console.log(`Article Grand oral (${slug}) — newsletter ignorée.`);
  process.exit(0);
}

// ── Rendu du template ────────────────────────────────────────────────────
const tplPath = path.resolve("emails/new-article.html");
let html = await fs.readFile(tplPath, "utf8");

const heroBlock = heroAbs
  ? `<tr><td style="padding:0;"><img src="${heroAbs}" alt="" width="600" style="display:block;width:100%;max-width:600px;height:auto;border:0;"></td></tr>`
  : "";

html = html
  .replaceAll("{{TITLE}}", escapeHtml(title))
  .replaceAll("{{EXCERPT}}", escapeHtml(excerpt))
  .replaceAll("{{URL}}", url)
  .replaceAll("{{CATEGORY_LABEL}}", escapeHtml(cat.label))
  .replaceAll("{{CATEGORY_COLOR}}", cat.color)
  .replaceAll("{{HERO_BLOCK}}", heroBlock);

// ── Création de la campagne Brevo programmée ─────────────────────────────
const scheduledAt = new Date(Date.now() + delayMin * 60 * 1000).toISOString();

const payload = {
  name: `Nouvel article — ${title}`.slice(0, 200),
  subject: title,
  sender: { name: senderName, email: senderEmail },
  htmlContent: html,
  recipients: { listIds: [listId] },
  scheduledAt,
  type: "classic",
};

if (dryRun) {
  console.log("=== DRY RUN ===");
  console.log(`Subject : ${payload.subject}`);
  console.log(`Sender  : ${senderName} <${senderEmail || "(non défini)"}>`);
  console.log(`List    : ${listId}`);
  console.log(`Scheduled at : ${scheduledAt}`);
  console.log(`HTML length  : ${html.length} chars`);
  console.log("\n--- First 400 chars of HTML ---");
  console.log(html.slice(0, 400) + "...");
  process.exit(0);
}

const r = await fetch("https://api.brevo.com/v3/emailCampaigns", {
  method: "POST",
  headers: {
    "api-key": apiKey,
    "Content-Type": "application/json",
    accept: "application/json",
  },
  body: JSON.stringify(payload),
});

if (!r.ok) {
  const err = await r.json().catch(() => ({}));
  console.error(`Brevo API error ${r.status}:`, err);
  process.exit(1);
}

const data = await r.json();
console.log(`✓ Campagne Brevo #${data.id} programmée pour ${scheduledAt}`);
console.log(`  Article : ${title}`);
console.log(`  URL     : ${url}`);
