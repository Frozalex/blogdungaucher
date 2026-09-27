import http from "node:http";
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import webpush from "web-push";

const PORT = parseInt(process.env.PORT ?? "3030", 10);
const API_KEY = process.env.BREVO_API_KEY ?? "";
const LIST_ID = parseInt(process.env.BREVO_LIST_ID ?? "2", 10);
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN ?? "https://blogdungaucher.com";
const BREVO_URL = "https://api.brevo.com/v3/contacts";

// ── Email de bienvenue (transactionnel) ─────────────────────────────────────
const BREVO_SMTP_URL = "https://api.brevo.com/v3/smtp/email";
const SENDER_EMAIL = process.env.BREVO_SENDER_EMAIL ?? "newsletter@blogdungaucher.com";
const SENDER_NAME = process.env.BREVO_SENDER_NAME ?? "Blog d'un Gaucher";
const SITE_URL = (process.env.SITE_URL ?? "https://blogdungaucher.com").replace(/\/$/, "");
const WELCOME_SUBJECT = "Bienvenue au Blog d'un Gaucher ♟️";

// HTML embarqué (le conteneur ne monte que ce fichier — pas de dossier emails/).
function welcomeHtml() {
  return `<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="x-apple-disable-message-reformatting">
  <title>Bienvenue au Blog d'un Gaucher</title>
</head>
<body style="margin:0;padding:0;background-color:#f8f5f0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#1e1e1e;line-height:1.6;">
  <div style="display:none;font-size:1px;color:#f8f5f0;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">
    Merci de t'être abonné·e. Voici ce qui t'attend.
  </div>
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#f8f5f0;">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="max-width:600px;width:100%;background-color:#ffffff;border:1px solid #e8e3da;border-radius:8px;overflow:hidden;">
          <tr>
            <td style="padding:28px 32px 20px;border-bottom:1px solid #f0ece5;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td style="font-family:Georgia,'Times New Roman',serif;font-size:18px;font-weight:700;color:#1e1e1e;letter-spacing:-0.01em;">
                    Blog d'un Gaucher
                  </td>
                  <td align="right" style="font-size:11px;color:#7a7a7a;letter-spacing:0.08em;text-transform:uppercase;font-weight:600;">
                    Bienvenue
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:32px 32px 8px;">
              <h1 style="margin:0 0 18px;font-family:Georgia,'Times New Roman',serif;font-size:26px;font-weight:700;line-height:1.25;letter-spacing:-0.02em;color:#1e1e1e;">
                Bienvenue à bord ♟️
              </h1>
              <p style="margin:0 0 18px;font-size:15px;line-height:1.65;color:#4a4a4a;">
                Merci de t'être abonné·e ! Tu fais maintenant partie des lecteurs prévenus
                à chaque nouvel article du Blog d'un Gaucher.
              </p>
              <p style="margin:0 0 28px;font-size:15px;line-height:1.65;color:#4a4a4a;">
                Ici, on explore les échecs sous tous les angles : la <strong>science</strong> du cerveau,
                la <strong>psychologie</strong> du joueur, et la place du jeu dans la <strong>société</strong>.
                Un nouvel article paraît chaque lundi et jeudi.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:0 32px 36px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="background-color:#2a8a5f;border-radius:6px;">
                    <a href="${SITE_URL}/fr/blog/" style="display:inline-block;padding:14px 28px;font-size:14px;font-weight:600;color:#ffffff;text-decoration:none;letter-spacing:0.02em;">
                      Découvrir le blog →
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 32px;background-color:#faf8f4;border-top:1px solid #f0ece5;">
              <p style="margin:0 0 8px;font-size:12px;color:#7a7a7a;line-height:1.5;">
                Tu reçois cet email parce que tu viens de t'abonner à la newsletter du Blog d'un Gaucher.
              </p>
              <p style="margin:0;font-size:12px;color:#7a7a7a;line-height:1.5;">
                <a href="${SITE_URL}" style="color:#2a8a5f;text-decoration:none;">blogdungaucher.com</a>
                &nbsp;·&nbsp;
                <a href="{{ unsubscribe }}" style="color:#7a7a7a;text-decoration:underline;">Se désinscrire</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// Envoi non bloquant : un échec ne doit jamais casser l'inscription elle-même.
async function sendWelcomeEmail(email) {
  if (!API_KEY) return;
  try {
    const r = await fetch(BREVO_SMTP_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": API_KEY,
        accept: "application/json",
      },
      body: JSON.stringify({
        sender: { name: SENDER_NAME, email: SENDER_EMAIL },
        to: [{ email }],
        subject: WELCOME_SUBJECT,
        htmlContent: welcomeHtml(),
      }),
    });
    if (!r.ok) {
      const data = await r.json().catch(() => ({}));
      console.warn(`[welcome] échec envoi à ${email} (${r.status}):`, data?.message ?? "");
    } else {
      console.log(`[welcome] email de bienvenue envoyé à ${email}`);
    }
  } catch (err) {
    console.warn(`[welcome] erreur envoi à ${email}:`, err?.message ?? err);
  }
}

// ── Web Push ────────────────────────────────────────────────────────
const VAPID_PUBLIC_KEY  = process.env.VAPID_PUBLIC_KEY ?? "";
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY ?? "";
const PUSH_SEND_TOKEN   = process.env.PUSH_SEND_TOKEN ?? "";
const PUSH_DATA_DIR     = process.env.PUSH_DATA_DIR ?? "/app/data";
const SUBS_FILE         = `${PUSH_DATA_DIR}/push-subscriptions.json`;

if (VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(
    "mailto:contact@blogdungaucher.com",
    VAPID_PUBLIC_KEY,
    VAPID_PRIVATE_KEY,
  );
  if (!existsSync(PUSH_DATA_DIR)) mkdirSync(PUSH_DATA_DIR, { recursive: true });
  console.log("[push] Web Push initialisé ✓");
} else {
  console.warn("[push] VAPID_PUBLIC_KEY / VAPID_PRIVATE_KEY manquantes — push désactivé");
}

function loadSubs() {
  try { return JSON.parse(readFileSync(SUBS_FILE, "utf-8")); }
  catch { return []; }
}
function saveSubs(subs) {
  writeFileSync(SUBS_FILE, JSON.stringify(subs, null, 2));
}

// ── HTTP helpers ────────────────────────────────────────────────────
const CORS = {
  "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Max-Age": "86400",
};

function json(res, status, body) {
  res.writeHead(status, { ...CORS, "Content-Type": "application/json" });
  res.end(JSON.stringify(body));
}

/** Aucune requête légitime ne dépasse quelques centaines d'octets. */
const MAX_BODY_BYTES = 8 * 1024;

/**
 * Lit le corps en coupant au-delà de MAX_BODY_BYTES : sans borne, un client
 * hostile peut faire grossir la chaîne jusqu'à saturer la mémoire du process.
 */
async function readBody(req) {
  let body = "";
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > MAX_BODY_BYTES) {
      req.destroy();
      throw new Error("body too large");
    }
    body += chunk;
  }
  return body;
}

// ── Anti-spam ───────────────────────────────────────────────────────
/**
 * Identifie le client pour la limitation de débit.
 *
 * Le service n'est joignable qu'à travers nginx, donc `remoteAddress` vaut
 * toujours 127.0.0.1 : la seule source utilisable est X-Forwarded-For. On prend
 * la DERNIÈRE valeur, celle que notre nginx a ajoutée
 * (`$proxy_add_x_forwarded_for`) ; les précédentes sont déclarées par le client
 * et donc falsifiables.
 *
 * Si l'en-tête manque (nginx mal configuré), on ne peut plus distinguer les
 * clients : `trusted` passe à faux et l'appelant retombe sur un plafond global
 * large, plutôt que d'enfermer tout le site dans le quota d'une seule IP.
 */
function clientIp(req) {
  const xff = req.headers["x-forwarded-for"];
  if (typeof xff === "string" && xff.trim()) {
    const parts = xff.split(",").map((s) => s.trim()).filter(Boolean);
    if (parts.length > 0) return { ip: parts[parts.length - 1], trusted: true };
  }
  if (!clientIp.warned) {
    clientIp.warned = true;
    console.warn(
      "[anti-spam] X-Forwarded-For absent : nginx doit poser " +
        "`proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;` sur /newsletter et /push. " +
        "En attendant, la limitation de débit est globale et non par IP.",
    );
  }
  return { ip: req.socket.remoteAddress ?? "inconnu", trusted: false };
}

/** Fenêtre glissante en mémoire : clé → horodatages des requêtes retenues. */
const hits = new Map();

/**
 * Facteur appliqué au plafond quand l'IP du client est inconnue : le compteur
 * devient commun à tout le trafic, il doit donc laisser passer une audience
 * normale tout en coupant une inondation.
 */
const UNTRUSTED_IP_FACTOR = 40;

/**
 * Limitation de débit par IP et par route. En mémoire volontairement : le
 * service est mono-instance, et un redémarrage qui remet les compteurs à zéro
 * est sans conséquence ici.
 */
function rateLimited(req, bucket, max, windowMs) {
  const { ip, trusted } = clientIp(req);
  const key = `${bucket}:${trusted ? ip : "global"}`;
  const ceiling = trusted ? max : max * UNTRUSTED_IP_FACTOR;
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);

  if (recent.length >= ceiling) {
    hits.set(key, recent);
    return true;
  }

  recent.push(now);
  hits.set(key, recent);

  // Purge opportuniste : sans elle, la Map garderait une entrée par IP vue
  // depuis le démarrage.
  if (hits.size > 5000) {
    for (const [k, times] of hits) {
      if (times.every((t) => now - t >= windowMs)) hits.delete(k);
    }
  }
  return false;
}

/**
 * Refuse les requêtes dont l'`Origin` n'est pas le site. Le navigateur envoie
 * toujours cet en-tête sur un POST, y compris en même origine : une absence
 * signale un client qui n'est pas une page du site (curl, script). Falsifiable,
 * mais écarte le spam opportuniste sans gêner personne.
 */
function wrongOrigin(req) {
  const origin = req.headers["origin"];
  return origin !== ALLOWED_ORIGIN;
}

/** Validation d'adresse : une seule arobase, un point dans le domaine, longueur bornée. */
const EMAIL_RE = /^[^\s@]{1,64}@[^\s@.]+(?:\.[^\s@.]+)+$/;

/** Délai minimal entre l'affichage du formulaire et l'envoi (cf. NewsletterForm.astro). */
const MIN_FILL_MS = 1500;

/** Plafond d'abonnés push conservés (fichier relu et réécrit à chaque diffusion). */
const MAX_PUSH_SUBS = 20000;

// ── Serveur ──────────────────────────────────────────────────────────
http.createServer(async (req, res) => {
  if (req.method === "OPTIONS") {
    res.writeHead(204, CORS);
    res.end();
    return;
  }

  if (req.url === "/health") {
    json(res, 200, { ok: true });
    return;
  }

  // ── Newsletter (Brevo) ───────────────────────────────────────────
  if (req.method === "POST" && req.url === "/subscribe") {
    if (wrongOrigin(req)) {
      json(res, 403, { error: "forbidden origin" });
      return;
    }
    // Chaque inscription réussie déclenche un email de bienvenue : sans plafond,
    // un script pourrait faire envoyer des messages en masse à des adresses
    // arbitraires et brûler la réputation de l'expéditeur.
    if (rateLimited(req, "subscribe", 5, 15 * 60 * 1000)) {
      console.warn(`[anti-spam] débit dépassé sur /subscribe depuis ${clientIp(req).ip}`);
      json(res, 429, { error: "too many requests" });
      return;
    }
    try {
      const { email, name, website, elapsedMs } = JSON.parse(await readBody(req));

      // Pot de miel rempli : on répond comme si tout allait bien pour ne rien
      // apprendre au robot, sans rien envoyer à Brevo.
      if (typeof website === "string" && website.trim()) {
        console.warn(`[anti-spam] pot de miel rempli depuis ${clientIp(req).ip}`);
        json(res, 200, { ok: true });
        return;
      }

      // Formulaire posté trop vite, ou sans le compteur : ce n'est pas la page du site.
      if (typeof elapsedMs !== "number" || !Number.isFinite(elapsedMs) || elapsedMs < MIN_FILL_MS) {
        console.warn(`[anti-spam] envoi trop rapide (${elapsedMs}) depuis ${clientIp(req).ip}`);
        json(res, 400, { error: "invalid submission" });
        return;
      }

      if (!email || typeof email !== "string" || email.length > 254 || !EMAIL_RE.test(email.trim())) {
        json(res, 400, { error: "invalid email" });
        return;
      }
      const payload = {
        email: email.trim(),
        listIds: [LIST_ID],
        updateEnabled: true,
      };
      // Prénom borné : ce champ finit dans les emails envoyés, pas question d'y
      // laisser passer une charge arbitraire.
      if (name && typeof name === "string" && name.trim()) {
        payload.attributes = { FIRSTNAME: name.trim().slice(0, 80) };
      }
      const r = await fetch(BREVO_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": API_KEY,
          accept: "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (r.ok || r.status === 204) {
        json(res, 200, { ok: true });
        // 201 = contact nouvellement créé → email de bienvenue.
        // 204 = contact déjà existant (ré-inscription) → pas de bienvenue.
        if (r.status === 201) {
          sendWelcomeEmail(email.trim());
        }
      } else {
        const data = await r.json().catch(() => ({}));
        json(res, r.status, { error: data?.message ?? "API error" });
      }
    } catch {
      json(res, 500, { error: "Server error" });
    }
    return;
  }

  // ── Web Push : enregistrer un abonné ────────────────────────────
  if (req.method === "POST" && req.url === "/push/subscribe") {
    if (!VAPID_PUBLIC_KEY) { json(res, 503, { error: "push not configured" }); return; }
    if (wrongOrigin(req)) { json(res, 403, { error: "forbidden origin" }); return; }
    if (rateLimited(req, "push-subscribe", 20, 15 * 60 * 1000)) {
      json(res, 429, { error: "too many requests" });
      return;
    }
    try {
      const subscription = JSON.parse(await readBody(req));
      if (typeof subscription?.endpoint !== "string" || !/^https:\/\//.test(subscription.endpoint)) {
        json(res, 400, { error: "invalid subscription" });
        return;
      }
      const subs = loadSubs();
      // Le fichier d'abonnés est relu et réécrit à chaque diffusion : on refuse de
      // le laisser croître sans limite.
      if (subs.length >= MAX_PUSH_SUBS && !subs.some((s) => s.endpoint === subscription.endpoint)) {
        console.warn(`[anti-spam] plafond d'abonnés push atteint (${subs.length})`);
        json(res, 503, { error: "subscription list full" });
        return;
      }
      if (!subs.some((s) => s.endpoint === subscription.endpoint)) {
        subs.push(subscription);
        saveSubs(subs);
      }
      json(res, 200, { ok: true, count: subs.length });
    } catch {
      json(res, 500, { error: "Server error" });
    }
    return;
  }

  // ── Web Push : supprimer un abonné ──────────────────────────────
  if (req.method === "POST" && req.url === "/push/unsubscribe") {
    if (!VAPID_PUBLIC_KEY) { json(res, 503, { error: "push not configured" }); return; }
    if (wrongOrigin(req)) { json(res, 403, { error: "forbidden origin" }); return; }
    if (rateLimited(req, "push-unsubscribe", 20, 15 * 60 * 1000)) {
      json(res, 429, { error: "too many requests" });
      return;
    }
    try {
      const { endpoint } = JSON.parse(await readBody(req));
      if (!endpoint) { json(res, 400, { error: "missing endpoint" }); return; }
      const subs = loadSubs().filter((s) => s.endpoint !== endpoint);
      saveSubs(subs);
      json(res, 200, { ok: true });
    } catch {
      json(res, 500, { error: "Server error" });
    }
    return;
  }

  // ── Web Push : diffuser à tous les abonnés (interne — token requis) ──
  if (req.method === "POST" && req.url === "/push/send") {
    if (!VAPID_PUBLIC_KEY) { json(res, 503, { error: "push not configured" }); return; }
    // Pas de contrôle d'Origin ici : l'appelant est le script de publication, qui
    // n'est pas une page de navigateur. Le jeton fait foi, et on borne les essais
    // ratés pour qu'il ne puisse pas être cherché par force brute.
    const auth = req.headers["authorization"] ?? "";
    if (!PUSH_SEND_TOKEN || auth !== `Bearer ${PUSH_SEND_TOKEN}`) {
      const throttled = rateLimited(req, "push-send-auth", 10, 15 * 60 * 1000);
      json(res, throttled ? 429 : 401, { error: throttled ? "too many requests" : "unauthorized" });
      return;
    }
    try {
      const payload = JSON.parse(await readBody(req));
      const subs = loadSubs();
      if (subs.length === 0) { json(res, 200, { sent: 0, expired: 0 }); return; }

      const results = await Promise.allSettled(
        subs.map((sub) =>
          webpush.sendNotification(sub, JSON.stringify(payload), { TTL: 86400 }),
        ),
      );

      const expired = [];
      results.forEach((r, i) => {
        if (r.status === "rejected") {
          const code = r.reason?.statusCode;
          if (code === 410 || code === 404) expired.push(subs[i].endpoint);
        }
      });
      if (expired.length > 0) {
        saveSubs(subs.filter((s) => !expired.includes(s.endpoint)));
      }

      json(res, 200, { sent: subs.length - expired.length, expired: expired.length });
    } catch {
      json(res, 500, { error: "Server error" });
    }
    return;
  }

  json(res, 404, { error: "Not found" });
}).listen(PORT, "0.0.0.0", () => {
  console.log(`Newsletter + Push proxy on 0.0.0.0:${PORT}`);
});
