import type { CollectionEntry } from "astro:content";

import { categoryMap, siteConfig } from "../data/site";
import type { VideoPostProps } from "@remotion/types";

type BlogData = CollectionEntry<"blog">["data"];

function excerptToTakeaways(excerpt: string): string[] {
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
  while (out.length < 3) out.push((out[out.length - 1] ?? filler) || "…");
  return out.slice(0, 3);
}

function resolveImageSrc(src: string, siteOrigin: string): string | null {
  const t = src.trim();
  if (!t) return null;
  if (/^https?:\/\//i.test(t)) return t;
  if (t.startsWith("/")) return `${siteOrigin.replace(/\/$/, "")}${t}`;
  return t;
}

/**
 * Props alignées sur `remotion/scripts/load-post-props.mjs` pour Remotion Player dans le navigateur.
 */
export function buildVideoPostProps(
  data: BlogData,
  options?: { title?: string; excerpt?: string },
): VideoPostProps {
  const siteOrigin = siteConfig.siteUrl.replace(/\/$/, "");
  const title = options?.title ?? data.title;
  const excerpt = options?.excerpt ?? data.excerpt;

  const cat = data.category;
  const accentColor =
    cat && typeof cat === "string" && cat in categoryMap
      ? categoryMap[cat as keyof typeof categoryMap].accent
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
    keyTakeaways = excerptToTakeaways(String(excerpt ?? ""));
  }

  const summarySequenceRaw = data.summarySequence;
  const summarySequence =
    summarySequenceRaw === "data-reveal" ? "data-reveal" : "classic";

  let dataReveal: VideoPostProps["dataReveal"] = null;
  if (
    summarySequence === "data-reveal" &&
    data.dataReveal &&
    typeof data.dataReveal === "object"
  ) {
    const dr = data.dataReveal;
    const barsRaw = Array.isArray(dr.bars) ? dr.bars : [];
    const bars = barsRaw
      .map((b) => ({
        label: String(b.label ?? ""),
        value: Number(b.value),
        max: Number(b.max),
      }))
      .filter(
        (b) =>
          b.label &&
          Number.isFinite(b.value) &&
          Number.isFinite(b.max) &&
          b.max > 0,
      );

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

  return {
    title: String(title ?? ""),
    excerpt: String(excerpt ?? ""),
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    heroImageSrc: heroSrc,
    heroImageAlt: heroAlt,
    accentColor,
    keyTakeaways,
    summarySequence,
    dataReveal,
  };
}
