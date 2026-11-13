/** A historical build cannot truthfully date a revision made after its snapshot. */
export function sitemapLastmod(date: Date | undefined, buildTime: Date, path: string, historicalSnapshot = false): string | undefined {
  if (!date) return undefined;
  if (date > buildTime) {
    if (historicalSnapshot) return undefined;
    throw new Error(`sitemap: lastmod futur (${date.toISOString()}) pour ${path} — vérifier updatedDate/publishDate.`);
  }
  return date.toISOString();
}
