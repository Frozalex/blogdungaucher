/** Découpe un texte en phrases courtes pour sous-titres. */
export function splitIntoPhrases(text: string, maxPhrases: number): string[] {
  const raw = text
    .replace(/\s+/g, " ")
    .trim()
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);

  if (raw.length <= maxPhrases) return raw;

  const merged: string[] = [];
  let buf = "";
  for (const sentence of raw) {
    if (!buf) {
      buf = sentence;
    } else if ((buf + " " + sentence).length < 200) {
      buf += " " + sentence;
    } else {
      merged.push(buf);
      buf = sentence;
    }
    if (merged.length >= maxPhrases - 1) break;
  }
  if (buf) merged.push(buf);
  return merged.slice(0, maxPhrases);
}

/** 3 à 5 points : priorité au frontmatter, complété par des phrases d’extrait si besoin. */
export function padTakeaways(items: string[], excerpt: string): string[] {
  const cleaned = items.map((s) => s.trim()).filter(Boolean).slice(0, 5);
  const fallback = splitIntoPhrases(excerpt, 5);
  const out = [...cleaned];
  while (out.length < 3) {
    out.push(fallback[out.length] ?? "…");
  }
  return out.slice(0, Math.min(out.length, 5));
}
