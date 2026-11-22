import { getCollection } from "astro:content";

export function oralPresentationPath(id: string) {
  return `/fr/grand-oral/sujets/${id}/`;
}

export async function getPublishedOralPresentations(now = new Date()) {
  return (await getCollection("oralPresentations"))
    .filter(({ data }) => !data.publishDate || data.publishDate <= now)
    .sort((a, b) => (b.data.publishDate?.getTime() ?? 0) - (a.data.publishDate?.getTime() ?? 0)
      || a.data.specialty.localeCompare(b.data.specialty, "fr")
      || a.data.title.localeCompare(b.data.title, "fr"));
}
