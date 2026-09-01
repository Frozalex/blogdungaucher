/**
 * Envoie une notification pour chaque article dont publishDate ≤ aujourd'hui
 * et pas encore notifié (anti-doublon via fichier d'état, cf. newsletter-dispatch.mjs).
 * - ntfy : notification mobile/web via le serveur ntfy
 * - Web Push : notification navigateur via le proxy newsletter
 *
 * À exécuter sur planification, APRÈS le rebuild VPS déclenché par
 * scheduled-publish.yml (pas au commit/push de l'article, qui peut avoir
 * lieu des mois avant sa publishDate).
 *
 * Usage :
 *   node scripts/notify-ntfy.mjs
 *   SEED=1 node scripts/notify-ntfy.mjs     # marque le backlog déjà publié
 *                                            #   comme notifié, sans rien envoyer
 *
 * Variables d'environnement requises :
 *   NTFY_URL        — ex. https://ntfy.blogdungaucher.com
 *   NTFY_TOKEN      — token Bearer ntfy
 *   NTFY_TOPIC      — sujet ntfy (défaut : "blog-gaucher")
 *   PUSH_PROXY_URL  — URL du proxy push (ex. https://blogdungaucher.com/push)
 *   PUSH_SEND_TOKEN — token Bearer pour /push/send
 *   NTFY_STATE_FILE — chemin du fichier d'état (défaut deploy/ntfy-sent.json)
 */

import fs   from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname    = path.dirname(fileURLToPath(import.meta.url));
const CONTENT_DIR  = path.join(__dirname, "..", "src", "content", "blog");
const SITE_URL     = "https://blogdungaucher.com";
const STATE_FILE   = path.join(__dirname, "..", process.env.NTFY_STATE_FILE ?? "deploy/ntfy-sent.json");
const seed         = process.env.SEED === "1";

const NTFY_URL        = process.env.NTFY_URL?.replace(/\/$/, "");
const NTFY_TOPIC      = process.env.NTFY_TOPIC ?? "blog-gaucher";
const NTFY_TOKEN      = process.env.NTFY_TOKEN;
const PUSH_PROXY_URL  = process.env.PUSH_PROXY_URL?.replace(/\/$/, "");
const PUSH_SEND_TOKEN = process.env.PUSH_SEND_TOKEN;

if (!NTFY_URL && process.env.SEED !== "1") {
  console.error("[ntfy] Variable NTFY_URL manquante. Ex : NTFY_URL=https://ntfy.blogdungaucher.com");
  process.exit(1);
}

function loadState() {
  try {
    const raw = JSON.parse(fs.readFileSync(STATE_FILE, "utf8"));
    return Array.isArray(raw?.sent) ? raw : { sent: [], updatedAt: null };
  } catch {
    return { sent: [], updatedAt: null };
  }
}
function saveState(state) {
  state.updatedAt = new Date().toISOString();
  fs.mkdirSync(path.dirname(STATE_FILE), { recursive: true });
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2) + "\n");
}

const now = new Date();

/** Lit tous les .md dans src/content/blog/{categorie}/ et retourne ceux déjà en ligne. */
function findPublishedArticles() {
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
      if (!dateMatch) continue;
      const publishDate = new Date(dateMatch[1]);
      if (Number.isNaN(publishDate.getTime()) || publishDate > now) continue;

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

const published = findPublishedArticles();
const state = loadState();
const sent = new Set(state.sent);

// ── Mode SEED : marquer tout le backlog publié comme déjà notifié ───────────
if (seed) {
  for (const p of published) sent.add(p.slug);
  state.sent = [...sent].sort();
  saveState(state);
  console.log(`[ntfy] SEED : ${published.length} article(s) déjà publiés marqués comme notifiés.`);
  process.exit(0);
}

const articles = published.filter((p) => !sent.has(p.slug));

if (articles.length === 0) {
  console.log("[ntfy] Aucun nouvel article publié à notifier.");
  process.exit(0);
}

let ok = 0;
for (const article of articles) {
  const url = `${SITE_URL}/fr/blog/${article.slug}/`;

  // ── ntfy (mobile app + ntfy web app) ──
  const ntfyRes = await fetch(`${NTFY_URL}/${NTFY_TOPIC}`, {
    method: "POST",
    headers: {
      "Title":    article.title,
      "Click":    url,
      "Tags":     "chess,left_fist",
      "Priority": "default",
      ...(NTFY_TOKEN ? { "Authorization": `Bearer ${NTFY_TOKEN}` } : {}),
    },
    body: article.excerpt || article.title,
  }).catch((e) => { console.warn("[ntfy] fetch échoué :", e.message); return null; });

  if (ntfyRes?.ok) {
    console.log(`[ntfy] Notifié : ${article.title}`);
  } else {
    const detail = ntfyRes ? await ntfyRes.text().catch(() => ntfyRes.statusText) : "réseau";
    console.error(`[ntfy] Erreur pour "${article.title}" : ${detail} — sera réessayé au prochain run.`);
    continue; // ne marque pas comme envoyé → réessai
  }

  // ── Web Push (abonnés navigateur via le proxy) ──
  if (PUSH_PROXY_URL && PUSH_SEND_TOKEN) {
    const pushRes = await fetch(`${PUSH_PROXY_URL}/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${PUSH_SEND_TOKEN}`,
      },
      body: JSON.stringify({
        title: article.title,
        message: article.excerpt || article.title,
        click: url,
      }),
    }).catch((e) => { console.warn("[push] fetch échoué :", e.message); return null; });

    if (pushRes?.ok) {
      const d = await pushRes.json().catch(() => ({}));
      console.log(`[push] Envoyé à ${d.sent ?? "?"} abonné(s) (${d.expired ?? 0} expirés nettoyés)`);
    } else if (pushRes) {
      console.warn(`[push] Erreur ${pushRes.status} — notification navigateur non envoyée`);
    }
  }

  sent.add(article.slug);
  ok++;
}

state.sent = [...sent].sort();
saveState(state);
console.log(`[ntfy] Terminé : ${ok}/${articles.length} notifié(s). État écrit → ${STATE_FILE}`);
