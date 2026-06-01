import http from "node:http";

const PORT = parseInt(process.env.PORT ?? "3030", 10);
const API_TOKEN = process.env.HOSTINGER_REACH_API_TOKEN ?? "";
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN ?? "https://blogdungaucher.com";
const REACH_URL = "https://developers.hostinger.com/api/reach/v1/contacts";

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

    const payload = { email: email.trim() };
    if (name && typeof name === "string" && name.trim()) {
      payload.name = name.trim();
    }

    const r = await fetch(REACH_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_TOKEN}`,
      },
      body: JSON.stringify(payload),
    });

    if (r.ok) {
      json(res, 200, { ok: true });
    } else {
      const data = await r.json().catch(() => ({}));
      json(res, r.status, { error: data?.message ?? "API error" });
    }
  } catch {
    json(res, 500, { error: "Server error" });
  }
}).listen(PORT, "127.0.0.1", () => {
  console.log(`Newsletter proxy on 127.0.0.1:${PORT}`);
});
