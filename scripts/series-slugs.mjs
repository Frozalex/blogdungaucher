/**
 * Slugs des séries éditoriales, lus depuis les fichiers de données TypeScript.
 *
 * Les scripts de calendrier sont en .mjs et ne peuvent pas importer du .ts sans
 * outillage. On extrait donc les slugs par expression régulière, ce qui est
 * suffisant tant que les fichiers gardent la forme `slug : "..."`.
 *
 * Ce module est la SEULE définition de « qu'est-ce qu'un article de série » :
 * check-publish-weekly, apply-future-publish-schedule et pair-week-themes s'y
 * réfèrent tous, de sorte qu'ajouter une série se fait à un seul endroit.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, "..", "src", "data");

/** Les séries, dans l'ordre où elles occupent le créneau du mardi. */
export const SERIES = [
  { id: "psychologie", fichier: "serie-psychologie.ts", titre: "Psychologie" },
  { id: "moteur-python", fichier: "serie-moteur-python.ts", titre: "Moteur en Python" },
];

function lireSlugs(fichier) {
  const chemin = path.join(dataDir, fichier);
  if (!fs.existsSync(chemin)) return [];
  const source = fs.readFileSync(chemin, "utf8");
  // `slug : "..."` ou `slug: "..."`, dans l'ordre du fichier.
  return [...source.matchAll(/\bslug\s*:\s*"([a-z0-9-]+)"/g)].map((m) => m[1]);
}

/** [{ id, titre, slugs: [...] }], dans l'ordre de passage au mardi. */
export function seriesAvecSlugs() {
  return SERIES.map((serie) => ({ ...serie, slugs: lireSlugs(serie.fichier) }));
}

/** Tous les slugs de série, dans l'ordre de publication souhaité. */
export function slugsDeSerieOrdonnes() {
  return seriesAvecSlugs().flatMap((serie) => serie.slugs);
}

/** Ensemble de tous les slugs de série, pour les tests d'appartenance. */
export function ensembleDesSlugsDeSerie() {
  return new Set(slugsDeSerieOrdonnes());
}

/** L'identifiant de série d'un slug, ou null s'il n'appartient à aucune. */
export function serieDuSlug(slug) {
  for (const serie of seriesAvecSlugs()) {
    if (serie.slugs.includes(slug)) return serie.id;
  }
  return null;
}
