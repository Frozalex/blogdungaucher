import type { OralTopic, SpecialtyId } from "../data/oral-generator/types";
import { specialties } from "../data/oral-generator/types";

export const normalizeSearch = (value: string) => value.normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("fr")
  .replace(/[^\p{L}\p{N}]+/gu, " ").trim();

export function matchesOralTopic(topic: OralTopic, filters: { specialty: string; second: string; theme: string; query: string }) {
  if (filters.specialty && !topic.specialties.includes(filters.specialty as SpecialtyId)) return false;
  if (filters.second && !topic.specialties.includes(filters.second as SpecialtyId)) return false;
  if (filters.theme && !topic.themes.includes(filters.theme)) return false;
  const words = normalizeSearch(filters.query).split(/\s+/).filter(Boolean);
  const labels = specialties.filter(s => topic.specialties.includes(s.id)).flatMap(s => [s.label, s.short]);
  const languages = topic.specialties.includes("llcer") ? ["anglais allemand espagnol italien portugais basque breton catalan corse créole occitan tahitien langues régionales"] : [];
  const classical = topic.specialties.includes("llca") ? ["latin grec antiquité"] : [];
  const text = normalizeSearch([topic.title, ...labels, ...languages, ...classical, ...topic.keywords, ...topic.notions, ...topic.themes, ...topic.variants.map(v => v.question)].join(" "));
  const tokens = text.split(/\s+/);
  return words.every(word => tokens.some(token => token.startsWith(word)));
}

export function buildIntroduction(topic: OralTopic, index: number) {
  const variant = topic.variants[index];
  return `${topic.hook} D’où la question : « ${variant.question} » ${variant.approach}`;
}

export function buildConclusion(topic: OralTopic, index: number) {
  const variant = topic.variants[index];
  return `${variant.answer} ${variant.opening}`;
}
