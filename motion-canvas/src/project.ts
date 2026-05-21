import { makeProject } from "@motion-canvas/core";

import chaseSimon from "./scenes/chase-simon?scene";

/**
 * Projet Motion Canvas du blog. Une scène = une "vidéo" complète, ou un
 * segment réutilisable d'une vidéo plus longue (montés ensuite côté éditeur
 * vidéo si besoin). On commence par une seule scène témoin.
 */
export default makeProject({
  scenes: [chaseSimon],
  // 1920x1080 par défaut pour livrer du 16:9 YouTube ; ajuster ici pour Shorts (1080x1920).
  experimentalFeatures: false,
});
