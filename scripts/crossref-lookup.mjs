#!/usr/bin/env node
// Interrogation ponctuelle de Crossref pour vérifier une référence avant de la citer.
// Usage: node scripts/crossref-lookup.mjs "auteur année titre revue"
const query = process.argv.slice(2).join(" ");
if (!query) {
  console.error("Usage: node scripts/crossref-lookup.mjs \"<citation>\"");
  process.exit(1);
}
const url = new URL("https://api.crossref.org/works");
url.searchParams.set("query.bibliographic", query);
url.searchParams.set("rows", "5");
url.searchParams.set("select", "title,author,issued,container-title,DOI,page,volume,type");
url.searchParams.set("mailto", "contact@blogdungaucher.com");

const res = await fetch(url, { headers: { "User-Agent": "blogdungaucher-refcheck/1.0" } });
if (!res.ok) {
  console.error(`Crossref HTTP ${res.status}`);
  process.exit(1);
}
const { message } = await res.json();
for (const [i, it] of (message.items ?? []).entries()) {
  const authors = (it.author ?? [])
    .slice(0, 4)
    .map((a) => `${a.family ?? ""}${a.given ? ", " + a.given.replace(/\B\w+/g, "") : ""}`)
    .join("; ");
  const year = it.issued?.["date-parts"]?.[0]?.[0] ?? "?";
  console.log(
    [
      `${i + 1}. ${(it.title ?? ["(sans titre)"])[0]}`,
      `   ${authors || "(aucun auteur)"} — ${year} — ${it.type}`,
      `   ${(it["container-title"] ?? [""])[0]}${it.volume ? ` ${it.volume}` : ""}${it.page ? `, ${it.page}` : ""}`,
      `   https://doi.org/${it.DOI}`,
    ].join("\n"),
  );
}
