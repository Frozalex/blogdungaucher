import http from "node:http";
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import webpush from "web-push";

const PORT = parseInt(process.env.PORT ?? "3030", 10);
const API_KEY = process.env.BREVO_API_KEY ?? "";
const LIST_ID = parseInt(process.env.BREVO_LIST_ID ?? "2", 10);
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN ?? "https://blogdungaucher.com";
const BREVO_URL = "https://api.brevo.com/v3/contacts";

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

async function readBody(req) {
  let body = "";
  for await (const chunk of req) body += chunk;
  return body;
}

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
    try {
      const { email, name } = JSON.parse(await readBody(req));
      if (!email || typeof email !== "string" || !email.includes("@")) {
        json(res, 400, { error: "invalid email" });
        return;
      }
      const payload = {
        email: email.trim(),
        listIds: [LIST_ID],
        updateEnabled: true,
      };
      if (name && typeof name === "string" && name.trim()) {
        payload.attributes = { FIRSTNAME: name.trim() };
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
    try {
      const subscription = JSON.parse(await readBody(req));
      if (!subscription?.endpoint) { json(res, 400, { error: "invalid subscription" }); return; }
      const subs = loadSubs();
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
    const auth = req.headers["authorization"] ?? "";
    if (!PUSH_SEND_TOKEN || auth !== `Bearer ${PUSH_SEND_TOKEN}`) {
      json(res, 401, { error: "unauthorized" });
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
