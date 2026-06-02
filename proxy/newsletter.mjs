import http from "node:http";

const PORT = parseInt(process.env.PORT ?? "3030", 10);
const API_KEY = process.env.BREVO_API_KEY ?? "";
const LIST_ID = parseInt(process.env.BREVO_LIST_ID ?? "2", 10);
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN ?? "https://blogdungaucher.com";
const BREVO_URL = "https://api.brevo.com/v3/contacts";

const CORS = {
  "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Max-Age": "86400",
};

function json(res, status, body) {
  res.writeHead(status, { ...CORS, "Content-Type": "application/json" });
  res.end(JSON.stringify(body));
}

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

  if (req.method !== "POST" || req.url !== "/subscribe") {
    json(res, 404, { error: "Not found" });
    return;
  }

  try {
    let body = "";
    for await (const chunk of req) body += chunk;
    const { email, name } = JSON.parse(body);

    if (!email || typeof email !== "string" || !email.includes("@")) {
      json(res, 400, { error: "invalid email" });
      return;
    }

    // Brevo "Create a contact" : si l'email existe déjà, updateEnabled=true
    // évite le 400 et met juste à jour les listes.
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

    // Brevo renvoie 201 (created) ou 204 (updated)
    if (r.ok || r.status === 204) {
      json(res, 200, { ok: true });
    } else {
      const data = await r.json().catch(() => ({}));
      json(res, r.status, { error: data?.message ?? "API error" });
    }
  } catch {
    json(res, 500, { error: "Server error" });
  }
}).listen(PORT, "0.0.0.0", () => {
  console.log(`Newsletter proxy (Brevo) on 0.0.0.0:${PORT}`);
});
