// Mesure de perf locale (build prod via `astro preview`).
// Usage: node scripts/perf-measure.mjs
import puppeteer from "puppeteer";

const BASE = "http://localhost:4330";
const PAGES = [
  { name: "Accueil", url: `${BASE}/fr/` },
  { name: "Article (avec maths)", url: `${BASE}/fr/blog/minimax-aux-echecs/` },
  { name: "Article (texte)", url: `${BASE}/fr/blog/echecs-et-flow/` },
];

// Profils : desktop rapide + mobile throttlé (proche du preset Lighthouse "Mobile - Slow 4G / 4x CPU").
const PROFILES = [
  {
    label: "PC (desktop)",
    viewport: { width: 1366, height: 900, deviceScaleFactor: 1, isMobile: false },
    ua: null,
    cpuThrottle: 1,
    net: null,
  },
  {
    label: "Mobile (4x CPU, Slow 4G)",
    viewport: { width: 390, height: 844, deviceScaleFactor: 3, isMobile: true, hasTouch: true },
    ua: "Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Mobile Safari/537.36",
    cpuThrottle: 4,
    net: { downloadThroughput: (1.6 * 1024 * 1024) / 8, uploadThroughput: (750 * 1024) / 8, latency: 150 },
  },
];

function fmtKB(b) { return (b / 1024).toFixed(1); }
function fmtMs(m) { return m == null ? "—" : Math.round(m); }

const browser = await puppeteer.launch({ headless: "new", args: ["--no-sandbox"] });
const results = [];

for (const prof of PROFILES) {
  for (const pg of PAGES) {
    const page = await browser.newPage();
    if (prof.ua) await page.setUserAgent(prof.ua);
    await page.setViewport(prof.viewport);
    const client = await page.target().createCDPSession();
    if (prof.cpuThrottle > 1) await client.send("Emulation.setCPUThrottlingRate", { rate: prof.cpuThrottle });
    if (prof.net) {
      await client.send("Network.enable");
      await client.send("Network.emulateNetworkConditions", { offline: false, ...prof.net });
    }

    // Arme un observer LCP AVANT navigation (sinon les entrées bufferisées sont perdues).
    await page.evaluateOnNewDocument(() => {
      window.__lcp = 0;
      new PerformanceObserver((list) => {
        const e = list.getEntries();
        window.__lcp = e[e.length - 1].startTime;
      }).observe({ type: "largest-contentful-paint", buffered: true });
    });

    // Transfert initial uniquement : on arrête de compter à l'événement `load`
    // (le prefetch `viewport` se déclenche après et fausserait la mesure).
    let transfer = 0, requests = 0, counting = true;
    page.on("response", async (res) => {
      if (!counting) return;
      requests++;
      try {
        const len = res.headers()["content-length"];
        if (len) transfer += parseInt(len, 10);
        else { const buf = await res.buffer(); transfer += buf.length; }
      } catch {}
    });

    await page.goto(pg.url, { waitUntil: "load", timeout: 60000 });
    counting = false;
    // Laisse le temps à LCP de se stabiliser.
    await new Promise((r) => setTimeout(r, 600));

    const metrics = await page.evaluate(() => {
      const nav = performance.getEntriesByType("navigation")[0] || {};
      const fcp = performance.getEntriesByName("first-contentful-paint")[0]?.startTime
        ?? performance.getEntriesByType("paint").find((p) => p.name === "first-contentful-paint")?.startTime;
      const lcp = window.__lcp || null;
      return {
        ttfb: nav.responseStart,
        dcl: nav.domContentLoadedEventEnd,
        load: nav.loadEventEnd || nav.duration,
        fcp,
        lcp,
        domNodes: document.getElementsByTagName("*").length,
      };
    });

    results.push({
      Profil: prof.label,
      Page: pg.name,
      "TTFB(ms)": fmtMs(metrics.ttfb),
      "FCP(ms)": fmtMs(metrics.fcp),
      "LCP(ms)": fmtMs(metrics.lcp),
      "DCL(ms)": fmtMs(metrics.dcl),
      "Load(ms)": fmtMs(metrics.load),
      "Transfer(KB)": fmtKB(transfer),
      Req: requests,
      DOM: metrics.domNodes,
    });
    await page.close();
  }
}

await browser.close();
console.table(results);
