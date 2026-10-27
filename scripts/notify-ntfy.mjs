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
 * Les deux canaux sont INDÉPENDANTS : chacun n'est tenté que s'il est
 * configuré, et la panne de l'un n'empêche pas l'autre de partir. Un article
 * conserve un état indépendant pour chaque canal ; seuls les canaux en échec
 * seront réessayés au prochain run. Auparavant le Web Push était placé derrière un
 * `continue` conditionné au succès de ntfy : une panne ntfy (ou son simple
 * défaut de configuration) coupait aussi les notifications des lecteurs.
 *
 * Variables d'environnement — au moins UN canal doit être configuré :
 *   ntfy (facultatif)
 *     NTFY_URL        — ex. https://ntfy.blogdungaucher.com
 *     NTFY_TOKEN      — token Bearer ntfy (topic protégé)
 *     NTFY_TOPIC      — sujet ntfy (défaut : "blog-gaucher")
 *   Web Push (facultatif)
 *     PUSH_PROXY_URL  — URL du proxy push (ex. https://blogdungaucher.com/push)
 *     PUSH_SEND_TOKEN — token Bearer pour /push/send
 *   NTFY_STATE_FILE   — chemin du fichier d'état (défaut deploy/ntfy-sent.json)
 */

import fs   from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname    = path.dirname(fileURLToPath(import.meta.url));
const CONTENT_DIR  = process.env.BLOG_CONTENT_DIR ?? path.join(__dirname, "..", "src", "content", "blog");
const SITE_URL     = "https://blogdungaucher.com";
// resolve (et non join) : un NTFY_STATE_FILE absolu doit être respecté tel quel,
// sinon il est recollé sous la racine du dépôt.
const STATE_FILE   = path.resolve(__dirname, "..", process.env.NTFY_STATE_FILE ?? "deploy/ntfy-sent.json");
const seed         = process.env.SEED === "1";

const NTFY_URL        = process.env.NTFY_URL?.replace(/\/$/, "");
const NTFY_TOPIC      = process.env.NTFY_TOPIC?.trim() || "blog-gaucher";
const NTFY_TOKEN      = process.env.NTFY_TOKEN;
const PUSH_PROXY_URL  = process.env.PUSH_PROXY_URL?.replace(/\/$/, "");
const PUSH_SEND_TOKEN = process.env.PUSH_SEND_TOKEN;

const ntfyEnabled = Boolean(NTFY_URL);
const pushEnabled = Boolean(PUSH_PROXY_URL && PUSH_SEND_TOKEN);

// Échec seulement si AUCUN canal n'est joignable : là, le run ne peut
// rien faire et le silence doit être bruyant. Un seul canal configuré
// est une situation valide, pas une erreur.
if (!ntfyEnabled && !pushEnabled && !seed) {
  console.error(
    "[notify] Aucun canal configuré : il faut NTFY_URL, ou bien " +
      "PUSH_PROXY_URL + PUSH_SEND_TOKEN. Aucune notification ne peut partir.",
  );
  process.exit(1);
}
if (!seed) {
  console.log(
    `[notify] Canaux actifs : ntfy=${ntfyEnabled ? "oui" : "NON"}, ` +
      `webpush=${pushEnabled ? "oui" : "NON"}`,
  );
}

function loadState() {
  try {
    const raw = JSON.parse(fs.readFileSync(STATE_FILE, "utf8"));
    if (!Array.isArray(raw?.sent) || !raw.sent.every(s => typeof s === "string")) throw new Error("Invalid notification state");
    if (raw.version === 2) {
      if (![raw.channels?.ntfy, raw.channels?.push].every(a => Array.isArray(a) && a.every(s => typeof s === "string"))) throw new Error("Invalid channel state");
      return raw;
    }
    // Historical sent entries cannot be reconstructed per channel. Preserve them
    // in both channels to avoid replaying the entire backlog on migration.
    return { ...raw, version: 2, channels: { ntfy: [...raw.sent], push: [...raw.sent] } };
  } catch (err) {
    if (err.code !== "ENOENT") throw err;
    return { version: 2, sent: [], channels: { ntfy: [], push: [] }, updatedAt: null };
  }
}
function saveState(state) {
  state.updatedAt = new Date().toISOString();
  fs.mkdirSync(path.dirname(STATE_FILE), { recursive: true });
  fs.writeFileSync(`${STATE_FILE}.tmp`, JSON.stringify(state, null, 2) + "\n");
  fs.renameSync(`${STATE_FILE}.tmp`, STATE_FILE);
}

const now = new Date();

/**
 * Lit un scalaire du frontmatter, quoté OU non quoté.
 * L'ancienne regex exigeait des guillemets : 3 articles dont le `title:` est
 * nu (ex. science/echecs-et-memoire.md) retombaient sur le slug dans la notif.
 */
function readScalar(raw, field) {
  const line = raw.match(new RegExp(`^${field}:[ \\t]*(.+?)[ \\t]*$`, "m"))?.[1];
  if (!line) return null;
  const quoted = line.match(/^(["'])([\s\S]*)\1$/);
  const value = quoted ? quoted[2] : line;
  // Une valeur nue ouvrant un bloc YAML (>, |) n'est pas un scalaire inline.
  return /^[>|]/.test(value) ? null : value.trim() || null;
}

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

      const dateValue = readScalar(raw, "publishDate");
      if (!dateValue) continue;
      const publishDate = new Date(dateValue);
      if (Number.isNaN(publishDate.getTime()) || publishDate > now) continue;

      const title = readScalar(raw, "title") ?? file.replace(/\.md$/, "");

      // Support excerpt multi-ligne (block scalar YAML) et inline
      const excerptBlock = raw.match(/^excerpt:\s*>-?\s*\n((?:[ \t]+.+\n?)+)/m);
      const excerptRaw = (excerptBlock?.[1] ?? readScalar(raw, "excerpt") ?? "")
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
const channels = { ntfy: new Set(state.channels.ntfy), push: new Set(state.channels.push) };
const enabled = Object.keys(channels).filter(c => c === "ntfy" ? ntfyEnabled : pushEnabled);
function persist() {
  state.channels = Object.fromEntries(Object.entries(channels).map(([key, values]) => [key, [...values].sort()]));
  state.sent = [...new Set([...channels.ntfy, ...channels.push])].filter(slug => channels.ntfy.has(slug) && channels.push.has(slug)).sort();
  saveState(state);
}
if (seed) {
  for (const p of published) for (const values of Object.values(channels)) values.add(p.slug);
  persist();
  console.log(`[notify] SEED: ${published.length} articles.`);
  process.exit(0);
}

// Automatic retries are limited to explicit temporary HTTP errors. An ambiguous
// ntfy network failure is left for the next run (at-least-once delivery).
async function post(url, body, token) {
  for (let attempt = 0; attempt < 3; attempt++) {
    const response = await fetch(url, {
      method: "POST", signal: AbortSignal.timeout(45_000),
      headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: JSON.stringify(body),
    });
    if (attempt < 2 && (response.status === 429 || response.status >= 500)) {
      await response.body?.cancel();
      await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
      continue;
    }
    return response;
  }
}

const articles = published.filter(p => enabled.some(channel => !channels[channel].has(p.slug)));
let failed = 0;
for (const article of articles) {
  const message = {
    title: article.title, message: article.excerpt || article.title,
    click: `${SITE_URL}/fr/blog/${article.slug}/`,
  };
  for (const channel of enabled) {
    if (channels[channel].has(article.slug)) continue;
    try {
      const response = channel === "ntfy"
        ? await post(NTFY_URL, { ...message, topic: NTFY_TOPIC, tags: ["chess", "left_fist"] }, NTFY_TOKEN)
        : await post(`${PUSH_PROXY_URL}/send`, { ...message, notificationId: `article:${article.slug}` }, PUSH_SEND_TOKEN);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      if (channel === "push") {
        const result = await response.json();
        if (![result.sent, result.expired, result.failed].every(n => Number.isInteger(n) && n >= 0) || result.failed > 0) throw new Error("Incomplete push delivery");
      }
      channels[channel].add(article.slug);
      persist();
      console.log(`[${channel}] Notifié : ${article.title}`);
    } catch (error) {
      failed++;
      console.error(`[${channel}] ${article.slug} : ${error.message} — sera réessayé.`);
    }
  }
}
console.log(`[notify] ${articles.length} article(s) traité(s), ${failed} canal/article en échec.`);
if (failed) process.exitCode = 1;
