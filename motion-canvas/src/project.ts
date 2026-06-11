import { makeProject } from "@motion-canvas/core";

import blogTeaser from "./scenes/blog-teaser?scene";
import summaryEchecsEtMemoire from "./scenes/summary-echecs-et-memoire?scene";

/**
 * Projet Motion Canvas du blog. Convention : une scène = un résumé vidéo d'article,
 * nommée `summary-<slug-article>.tsx`. Format YouTube 1920×1080 par défaut.
 *
 * Pour ajouter un nouveau résumé : créer src/scenes/summary-<slug>.tsx,
 * l'importer ici, et l'ajouter au tableau `scenes`.
 */
export default makeProject({
  scenes: [blogTeaser, summaryEchecsEtMemoire],
  experimentalFeatures: false,
});
