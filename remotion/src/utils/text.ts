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
    } else if ((buf + " " + sentence).length < 140) {
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

export function padTakeaways(
  items: string[],
  excerpt: string,
): [string, string, string] {
  const cleaned = items.map((s) => s.trim()).filter(Boolean).slice(0, 3);
  const fallback = splitIntoPhrases(excerpt, 3);
  while (cleaned.length < 3) {
    const next = fallback[cleaned.length] ?? "…";
    cleaned.push(next);
  }
  return [cleaned[0]!, cleaned[1]!, cleaned[2]!];
}
