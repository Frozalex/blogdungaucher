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
 * n'est marqué « notifié » que si au moins un canal a réussi ; sinon il sera
 * réessayé au prochain run. Auparavant le Web Push était placé derrière un
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
const CONTENT_DIR  = path.join(__dirname, "..", "src", "content", "blog");
const SITE_URL     = "https://blogdungaucher.com";
// resolve (et non join) : un NTFY_STATE_FILE absolu doit être respecté tel quel,
// sinon il est recollé sous la racine du dépôt.
const STATE_FILE   = path.resolve(__dirname, "..", process.env.NTFY_STATE_FILE ?? "deploy/ntfy-sent.json");
const seed         = process.env.SEED === "1";

const NTFY_URL        = process.env.NTFY_URL?.replace(/\/$/, "");
const NTFY_TOPIC      = process.env.NTFY_TOPIC ?? "blog-gaucher";
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

      const dateMatch = raw.match(/^publishDate:\s*["']?(\d{4}-\d{2}-\d{2})["']?/m);
      if (!dateMatch) continue;
      const publishDate = new Date(dateMatch[1]);
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
let failed = 0;
for (const article of articles) {
  const url = `${SITE_URL}/fr/blog/${article.slug}/`;

  // Les deux canaux sont tentés séparément : aucun n'est la condition de
  // l'autre. `delivered` retient si au moins un abonné a pu être touché.
  let delivered = false;

  // ── ntfy (mobile app + ntfy web app) ──
  // Publication au format JSON plutôt que par en-têtes : un en-tête HTTP est
  // une ByteString (Latin-1), donc un titre contenant un tiret demi-cadratin
  // « – » (U+2013) ou toute autre ponctuation typographique faisait planter
  // fetch — ces articles n'étaient jamais notifiés, à chaque run.
  if (ntfyEnabled) {
    const ntfyRes = await fetch(NTFY_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(NTFY_TOKEN ? { "Authorization": `Bearer ${NTFY_TOKEN}` } : {}),
      },
      body: JSON.stringify({
        topic:   NTFY_TOPIC,
        title:   article.title,
        message: article.excerpt || article.title,
        click:   url,
        tags:    ["chess", "left_fist"],
      }),
    }).catch((e) => { console.warn("[ntfy] fetch échoué :", e.message); return null; });

    if (ntfyRes?.ok) {
      console.log(`[ntfy] Notifié : ${article.title}`);
      delivered = true;
    } else {
      const detail = ntfyRes ? await ntfyRes.text().catch(() => ntfyRes.statusText) : "réseau";
      console.error(`[ntfy] Erreur pour "${article.title}" : ${detail}`);
    }
  }

  // ── Web Push (abonnés navigateur via le proxy) ──
  if (pushEnabled) {
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
      delivered = true;
    } else {
      const detail = pushRes ? `HTTP ${pushRes.status}` : "réseau";
      console.error(`[push] Erreur pour "${article.title}" : ${detail}`);
    }
  }

  // Aucun canal n'a abouti : ne pas marquer comme envoyé, l'article repassera
  // au prochain run plutôt que d'être silencieusement perdu.
  if (!delivered) {
    console.error(`[notify] "${article.title}" non notifié — sera réessayé au prochain run.`);
    failed++;
    continue;
  }

  // Écriture immédiate : si le run casse sur l'article suivant, celui-ci ne
  // sera pas re-notifié au prochain passage.
  sent.add(article.slug);
  state.sent = [...sent].sort();
  saveState(state);
  ok++;
}

console.log(`[notify] Terminé : ${ok}/${articles.length} notifié(s). État écrit → ${STATE_FILE}`);

// Un article resté sur le carreau doit rendre le run rouge : c'est
// précisément le silence vert qui avait laissé passer 7 articles.
if (failed > 0) {
  console.error(`[notify] ${failed} article(s) n'ont atteint aucun canal.`);
  process.exit(1);
}
