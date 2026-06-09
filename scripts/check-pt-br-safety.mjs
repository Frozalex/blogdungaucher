#!/usr/bin/env node
/**
 * Filet de sécurité PT-BR : audite chaque page /pt-br/ servie par le dev
 * server local (avec PT_BR_LAUNCH_DATE forcée dans le passé).
 *
 * Contrôles :
 * 1. Statut HTTP (200 attendu)
 * 2. <html lang="pt-br">
 * 3. Pas d'h1 en français évident (heuristique : interdit certains mots-clés FR)
 * 4. hreflang pt-BR pointe vers la même URL que la canonique courante
 * 5. hreflang fr/en valides
 * 6. Liens internes du body : pas vers /fr/, /en/, /de/ (sauf x-default)
 * 7. Sitemap inclut bien des entrées /pt-br/
 *
 * Sortie : récap dans stdout + code de sortie non zéro si défaillance.
 *
 * Usage : node scripts/check-pt-br-safety.mjs
 */

const BASE = process.env.BASE || "http://localhost:4321";

const STATIC_ROUTES = [
  "/pt-br/",
  "/pt-br/blog/",
  "/pt-br/science/",
  "/pt-br/esprit/",
  "/pt-br/societe/",
  "/pt-br/about/",
  "/pt-br/recherche/",
];

// Heuristique : mots-clés français qui n'ont rien à faire dans une page pt-BR.
const FR_LEAK_PATTERNS = [
  /Comprendre les échecs/i,
  /\bSommaire\b/,
  /À propos\b/,
  /Tous les articles/i,
  /À lire aussi/i,
  /\bAccueil\b/,
];

const issues = [];

async function fetchHtml(path) {
  const r = await fetch(BASE + path, { redirect: "manual" });
  const html = await r.text();
  return { status: r.status, html, headers: r.headers };
}

function pick(html, regex) {
  const m = html.match(regex);
  return m ? m[1] : null;
}

function pickAll(html, regex) {
  return [...html.matchAll(regex)].map((m) => m[1]);
}

async function audit(path) {
  const probe = { path, ok: true, warn: [], err: [] };
  let r;
  try {
    r = await fetchHtml(path);
  } catch (e) {
    probe.err.push(`fetch failed: ${e.message}`);
    probe.ok = false;
    return probe;
  }

  if (r.status !== 200) {
    probe.err.push(`HTTP ${r.status}`);
    probe.ok = false;
    return probe;
  }

  const lang = pick(r.html, /<html[^>]*\blang="([^"]+)"/);
  if (lang !== "pt-br") {
    probe.err.push(`html lang="${lang}" (attendu pt-br)`);
    probe.ok = false;
  }

  // hreflang
  const hreflangs = [...r.html.matchAll(/<link[^>]+rel="alternate"[^>]+hrefLang="([^"]+)"[^>]+href="([^"]+)"/gi)]
    .map((m) => ({ lang: m[1], href: m[2] }));
  const ptBr = hreflangs.find((h) => h.lang.toLowerCase() === "pt-br");
  const canonical = pick(r.html, /<link[^>]+rel="canonical"[^>]+href="([^"]+)"/);
  if (!ptBr) {
    probe.warn.push(`pas de <link rel=alternate hreflang=pt-BR>`);
  } else if (canonical && !ptBr.href.endsWith(path)) {
    probe.warn.push(`hreflang pt-BR=${ptBr.href} ne correspond pas au path courant ${path}`);
  }

  // Fuites FR
  for (const p of FR_LEAK_PATTERNS) {
    const m = r.html.match(p);
    if (m) {
      // Ignore les attributs aria-label/title qui peuvent rester FR pour les boutons techniques
      const idx = m.index;
      const ctx = r.html.slice(Math.max(0, idx - 30), idx + 60);
      if (!/aria-label|title=|>Rechercher</i.test(ctx)) {
        probe.warn.push(`fuite FR potentielle : "${m[0]}" (contexte : …${ctx.replace(/\s+/g, " ").trim()}…)`);
      }
    }
  }

  // Liens internes vers /fr/, /en/, /de/ dans le body principal (en ignorant
  // les data-attributes du sélecteur de langue qui est masqué).
  const bodyMatch = r.html.match(/<main[\s\S]*?<\/main>|<article[\s\S]*?<\/article>/i);
  if (bodyMatch) {
    const bodyLinks = pickAll(bodyMatch[0], /(?<!data-lang-[a-z-]+-)href="(\/(?:fr|en|de)\/[^"#?]*)"/g);
    if (bodyLinks.length) {
      probe.warn.push(`${bodyLinks.length} lien(s) dans le main pointant vers /fr/, /en/, /de/ : ${bodyLinks.slice(0, 3).join(", ")}`);
    }
  }

  return probe;
}

async function auditSitemap() {
  const r = await fetchHtml("/sitemap.xml");
  if (r.status !== 200) {
    issues.push(`sitemap HTTP ${r.status}`);
    return;
  }
  const ptBrUrls = [...r.html.matchAll(/<loc>([^<]+\/pt-br\/[^<]*)<\/loc>/g)].map((m) => m[1]);
  const ptBrAlts = [...r.html.matchAll(/hreflang="pt-BR"\s+href="([^"]+)"/g)].map((m) => m[1]);
  console.log(`SITEMAP : ${ptBrUrls.length} <loc> /pt-br/, ${ptBrAlts.length} alternates pt-BR`);
  if (ptBrUrls.length === 0) issues.push(`sitemap n'inclut aucune URL /pt-br/`);
  if (ptBrAlts.length === 0) issues.push(`sitemap n'inclut aucun hreflang pt-BR`);
}

// Sample articles : 3 premiers articles pt-br servis
async function auditArticles() {
  const r = await fetchHtml("/pt-br/blog/");
  const articlePaths = [...r.html.matchAll(/href="(\/pt-br\/blog\/[a-z0-9-]+\/)"/g)]
    .map((m) => m[1])
    .filter((p, i, arr) => arr.indexOf(p) === i)
    .slice(0, 3);
  for (const p of articlePaths) {
    const probe = await audit(p);
    if (!probe.ok || probe.warn.length || probe.err.length) {
      console.log(`\n${p}`);
      probe.err.forEach((m) => console.log(`  ERR  : ${m}`));
      probe.warn.forEach((m) => console.log(`  WARN : ${m}`));
    } else {
      console.log(`OK   ${p}`);
    }
    if (probe.err.length) issues.push(`${p} : ${probe.err.join(" ; ")}`);
  }
}

console.log(`Filet de sécurité PT-BR — base = ${BASE}\n`);

for (const path of STATIC_ROUTES) {
  const probe = await audit(path);
  if (!probe.ok || probe.warn.length || probe.err.length) {
    console.log(`${path}`);
    probe.err.forEach((m) => console.log(`  ERR  : ${m}`));
    probe.warn.forEach((m) => console.log(`  WARN : ${m}`));
  } else {
    console.log(`OK   ${path}`);
  }
  if (probe.err.length) issues.push(`${path} : ${probe.err.join(" ; ")}`);
}

console.log("");
await auditArticles();
console.log("");
await auditSitemap();

console.log("");
if (issues.length === 0) {
  console.log("✅ Aucune erreur bloquante. Vérifie les WARN à la main.");
} else {
  console.log(`❌ ${issues.length} erreur(s) bloquante(s) :`);
  for (const i of issues) console.log(`   - ${i}`);
  process.exit(1);
}
