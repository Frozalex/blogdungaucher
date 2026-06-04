/**
 * Envoie une notification ntfy pour chaque article dont publishDate = aujourd'hui.
 *
 * Usage (post-déploiement ou manuellement) :
 *   node scripts/notify-ntfy.mjs
 *
 * Variables d'environnement requises (CI/CD secrets ou .env local) :
 *   NTFY_URL   — URL de base du serveur ntfy  ex. https://ntfy.blogdungaucher.com
 *   NTFY_TOKEN — token Bearer (ntfy user token add <username>)
 *   NTFY_TOPIC — sujet ntfy (défaut : "blog-gaucher")
 */

import fs   from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname    = path.dirname(fileURLToPath(import.meta.url));
const CONTENT_DIR  = path.join(__dirname, "..", "src", "content", "blog");
const SITE_URL     = "https://blogdungaucher.com";

const NTFY_URL   = process.env.NTFY_URL?.replace(/\/$/, "");
const NTFY_TOPIC = process.env.NTFY_TOPIC ?? "blog-gaucher";
const NTFY_TOKEN = process.env.NTFY_TOKEN;

if (!NTFY_URL) {
  console.error("[ntfy] Variable NTFY_URL manquante. Ex : NTFY_URL=https://ntfy.blogdungaucher.com");
  process.exit(1);
}

const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

/** Lit tous les .md dans src/content/blog/{categorie}/ et retourne ceux publiés aujourd'hui. */
function findTodayArticles() {
  const found = [];
  for (const cat of fs.readdirSync(CONTENT_DIR)) {
    const catDir = path.join(CONTENT_DIR, cat);
    if (!fs.statSync(catDir).isDirectory()) continue;
    for (const file of fs.readdirSync(catDir)) {
      if (!file.endsWith(".md")) continue;
      const raw = fs.readFileSync(path.join(catDir, file), "utf8");

      // Ignorer les brouillons
      if (/^draft:\s*true/m.test(raw)) continue;

      const dateMatch = raw.match(/^publishDate:\s*["']?(\d{4}-\d{2}-\d{2})["']?/m);
      if (dateMatch?.[1] !== today) continue;

      const title = raw.match(/^title:\s*["'](.+?)["']/m)?.[1]
        ?? file.replace(/\.md$/, "");

      // Support excerpt multi-ligne (block scalar YAML) et inline
      const excerptBlock  = raw.match(/^excerpt:\s*>-?\s*\n((?:[ \t]+.+\n?)+)/m);
      const excerptInline = raw.match(/^excerpt:\s*["'](.+?)["']/m);
      const excerptRaw = (excerptBlock?.[1] ?? excerptInline?.[1] ?? "")
        .replace(/\s+/g, " ").trim();

      found.push({
        slug:    file.replace(/\.md$/, ""),
        title,
        excerpt: excerptRaw.slice(0, 280),
      });
    }
  }
  return found;
}

const articles = findTodayArticles();

if (articles.length === 0) {
  console.log(`[ntfy] Aucun article avec publishDate=${today} — rien à notifier.`);
  process.exit(0);
}

for (const article of articles) {
  const url = `${SITE_URL}/fr/blog/${article.slug}/`;

  const res = await fetch(`${NTFY_URL}/${NTFY_TOPIC}`, {
    method: "POST",
    headers: {
      "Title":    article.title,
      "Click":    url,
      "Tags":     "chess,left_fist",
      "Priority": "default",
      ...(NTFY_TOKEN ? { "Authorization": `Bearer ${NTFY_TOKEN}` } : {}),
    },
    body: article.excerpt || article.title,
  });

  if (res.ok) {
    console.log(`[ntfy] Notifié : ${article.title}`);
  } else {
    const detail = await res.text().catch(() => res.statusText);
    console.error(`[ntfy] Erreur ${res.status} pour "${article.title}" : ${detail}`);
    process.exit(1);
  }
}
