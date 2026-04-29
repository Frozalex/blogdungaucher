import { getCollection, type CollectionEntry } from "astro:content";

export type PlayerEntry = CollectionEntry<"players">;

export function formatYear(date: Date) {
  return new Intl.DateTimeFormat("fr-FR", {
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

export function formatPlayerDate(date: Date) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

export async function getAllPlayers() {
  const players = await getCollection("players");
  const now = new Date();
  return players
    .filter((p) => p.data.publishDate <= now)
    .sort((left, right) => right.data.birthDate.getTime() - left.data.birthDate.getTime());
}

export function getPlayerSlug(player: PlayerEntry) {
  const slug = "slug" in player && typeof player.slug === "string" ? player.slug : "";
  if (slug) return slug;
  return player.id
    .replace(/\.mdx?$/i, "")
    .split("/")
    .filter(Boolean)
    .pop()!;
}

export function getPlayerUrl(player: PlayerEntry) {
  return `/fr/joueurs/${getPlayerSlug(player)}/`;
}

