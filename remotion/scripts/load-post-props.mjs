#!/usr/bin/env node
/**
 * Lit un article blog Markdown et affiche un JSON de props pour Remotion (stdout).
 *
 * Usage:
 *   node scripts/load-post-props.mjs --slug=mon-article
 *   node scripts/load-post-props.mjs --slug=mon-article --site-origin=https://blogdungaucher.com
 *
 * Variables d’environnement : SITE_ORIGIN, PUBLIC_SITE_URL (priorité aux flags).
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import matter from "gray-matter";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** Miroir de blog-gaucher/src/data/site.ts (categoryMap.accent). */
const CATEGORY_ACCENTS = {
  science: "#5b9fd4",
  esprit: "#f0a050",
  societe: "#5cc4b0",
  "grand-oral": "#8b5cf6",
};

function parseArgs(argv) {
  const out = { slug: "", siteOrigin: "" };
  for (const a of argv) {
    if (a.startsWith("--slug=")) out.slug = a.slice("--slug=".length);
    if (a.startsWith("--site-origin="))
      out.siteOrigin = a.slice("--site-origin=".length);
  }
  return out;
}

function resolveSiteOrigin(cliOrigin) {
  return (
    cliOrigin ||
    process.env.SITE_ORIGIN ||
    process.env.PUBLIC_SITE_URL ||
    "https://blogdungaucher.com"
  ).replace(/\/$/, "");
}

function resolveImageSrc(src, siteOrigin) {
  if (!src || typeof src !== "string") return null;
  const t = src.trim();
  if (/^https?:\/\//i.test(t)) return t;
  if (t.startsWith("/")) return `${siteOrigin}${t}`;
  return t;
}

function excerptToTakeaways(excerpt) {
  const cleaned = excerpt.replace(/\s+/g, " ").trim();
  let parts = cleaned
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
  if (parts.length === 0 && cleaned) parts = [cleaned];
  if (parts.length >= 3) return parts.slice(0, 3);
  const out = [...parts];
  const filler =
    cleaned.length > 140 ? `${cleaned.slice(0, 137).trim()}…` : cleaned;
  while (out.length < 3) out.push(out[out.length - 1] ?? filler || "…");
  return out.slice(0, 3);
}

const { slug, siteOrigin: cliOrigin } = parseArgs(process.argv.slice(2));
if (!slug) {
  console.error("Usage: node load-post-props.mjs --slug=<slug-du-fichier>");
  process.exit(1);
}

const siteOrigin = resolveSiteOrigin(cliOrigin);
const blogDir = path.resolve(__dirname, "../../src/content/blog");
const mdPath = path.join(blogDir, `${slug}.md`);

if (!fs.existsSync(mdPath)) {
  console.error(`Article introuvable: ${mdPath}`);
  process.exit(1);
}

const raw = fs.readFileSync(mdPath, "utf8");
const { data } = matter(raw);

const category = data.category;
const accentColor =
  typeof category === "string" && category in CATEGORY_ACCENTS
    ? CATEGORY_ACCENTS[category]
    : "#5b9fd4";

const hero = data.heroImage;
const heroSrc =
  hero && typeof hero.src === "string"
    ? resolveImageSrc(hero.src, siteOrigin)
    : null;
const heroAlt =
  hero && typeof hero.alt === "string" ? hero.alt : "";

let keyTakeaways = Array.isArray(data.keyTakeaways)
  ? data.keyTakeaways.map(String).filter(Boolean).slice(0, 3)
  : [];

if (keyTakeaways.length === 0) {
  keyTakeaways = excerptToTakeaways(String(data.excerpt ?? ""));
}

const summarySequenceRaw = data.summarySequence;
const summarySequence =
  summarySequenceRaw === "data-reveal" ? "data-reveal" : "classic";

let dataReveal = null;
if (summarySequence === "data-reveal" && data.dataReveal && typeof data.dataReveal === "object") {
  const dr = data.dataReveal;
  const barsRaw = Array.isArray(dr.bars) ? dr.bars : [];
  const bars = barsRaw
    .map((b) => ({
      label: String(b.label ?? ""),
      value: Number(b.value),
      max: Number(b.max),
    }))
    .filter((b) => b.label && Number.isFinite(b.value) && Number.isFinite(b.max) && b.max > 0);

  dataReveal = {
    vizTitle: String(dr.vizTitle ?? ""),
    bars,
    highlight: String(dr.highlight ?? ""),
    highlightSub:
      dr.highlightSub !== undefined && dr.highlightSub !== null
        ? String(dr.highlightSub)
        : undefined,
    source: String(dr.source ?? ""),
    takeaway: String(dr.takeaway ?? ""),
    cta:
      dr.cta !== undefined && dr.cta !== null ? String(dr.cta) : undefined,
  };
}

const props = {
  title: String(data.title ?? ""),
  excerpt: String(data.excerpt ?? ""),
  tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
  heroImageSrc: heroSrc,
  heroImageAlt: heroAlt,
  accentColor,
  keyTakeaways,
  summarySequence,
  dataReveal,
};

process.stdout.write(JSON.stringify(props, null, 0));
