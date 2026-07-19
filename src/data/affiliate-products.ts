/**
 * Produits affiliés (Amazon FR, matériel d'échecs) et leur association par article.
 *
 * - `affiliateProducts` : catalogue des produits RÉELLEMENT sourcés (un lien par
 *   produit). Ajouter un produit ici puis le référencer dans `affiliateBySlug`.
 * - `affiliateBySlug` : pour chaque slug d'article FR, la liste ordonnée d'IDs
 *   produits à afficher dans le bloc « Matériel recommandé » (composant
 *   AffiliateBox.astro). Les articles absents de cette table n'affichent aucun
 *   bloc (ex. grand-oral / bac, volontairement exclus).
 *
 * Provenance des associations : drafts/affiliation/liens-affilies-par-article.md.
 * Les produits non encore sourcés (pendules A*, livres IA/histoire, etc.) sont
 * omis ; les articles sont complétés à 7 liens avec du matériel générique.
 */

export interface AffiliateProduct {
  /** Nom affiché dans le bloc (concis). */
  name: string;
  /** Lien affilié (amzn.to). */
  url: string;
}

export const affiliateProducts: Record<string, AffiliateProduct> = {
  // Échiquiers & jeux
  B1: { name: "Jeu d'échecs de club (pièces lestées + tapis + sac)", url: "https://amzn.to/4aXIPtl" },
  B2: { name: "Échiquier Staunton en bois de tournoi", url: "https://amzn.to/4fJByQt" },
  B3: { name: "Échiquier magnétique de voyage", url: "https://amzn.to/4fJFH72" },
  B4: { name: "Échiquier design en bois massif", url: "https://amzn.to/4fmSLOt" },
  B5: { name: "Échiquier électronique (jouer contre l'ordinateur)", url: "https://amzn.to/4pw7ds0" },
  B6: { name: "Échiquier mural de démonstration", url: "https://amzn.to/4hl0BdN" },
  // Livres — apprentissage & stratégie
  L1: { name: "Les Échecs pour les Nuls", url: "https://amzn.to/4ywiQ6n" },
  L2: { name: "Bobby Fischer Teaches Chess (initiation)", url: "https://amzn.to/4pqR0UO" },
  L3: { name: "1001 exercices de tactique", url: "https://amzn.to/4wdx8HC" },
  L6: { name: "Mon Système (Nimzowitsch)", url: "https://amzn.to/45dIhfq" },
  L14: { name: "Fischer–Spassky 1972", url: "https://amzn.to/4fndWQb" },
  // Livre — cerveau
  L9: { name: "Les Fabuleux Pouvoirs du cerveau", url: "https://amzn.to/45b6O4L" },
  // Culture pop
  C1: { name: "Le Jeu de la Dame (roman)", url: "https://amzn.to/3TdPuti" },
  // Cross-niche
  X1: { name: "Set de poker", url: "https://amzn.to/4hlYy9s" },
  X2: { name: "Scrabble", url: "https://amzn.to/44E2zP2" },
  X3: { name: "Jeu de Go", url: "https://amzn.to/44EReyb" },
  X5: { name: "Métronome", url: "https://amzn.to/44z42Gr" },
  // Enfants / éducation
  E1: { name: "Apprendre les échecs aux enfants", url: "https://amzn.to/4gMGYex" },
  E2: { name: "Jeu de logique enfant", url: "https://amzn.to/4pwRrNJ" },
};

/** slug FR → liste ordonnée d'IDs produits (7 par article). */
export const affiliateBySlug: Record<string, string[]> = {
  // ── ESPRIT ──────────────────────────────────────────────────────────────
  "5-biais-cognitifs-blunder": ["L3", "L9", "L1", "B1", "C1", "B2", "B3"],
  "analyser-ses-parties": ["B5", "L6", "L3", "B1", "C1", "B2", "B3"],
  "bienfaits-des-pauses-aux-echecs": ["L9", "B3", "B1", "L3", "C1", "B2", "B5"],
  "burnout-chess": ["L9", "B4", "B3", "C1", "B1", "L1", "L3"],
  "echecs-estime-de-soi-elo": ["L9", "L3", "C1", "B1", "B2", "B3", "B5"],
  "echecs-et-colere-ragequit": ["L9", "B3", "B1", "L3", "L1", "C1", "B2"],
  "echecs-et-concentration": ["L9", "B5", "L3", "B1", "B2", "C1", "B3"],
  "echecs-et-confiance-en-soi": ["L3", "C1", "B1", "L1", "B2", "B3", "B5"],
  "echecs-et-flow": ["L9", "B4", "L3", "B1", "C1", "B2", "B3"],
  "echecs-et-la-solitude": ["B5", "C1", "B3", "B1", "L1", "L3", "B2"],
  "echecs-et-l-echec": ["L3", "C1", "B1", "B2", "B3", "B5", "L9"],
  "echecs-et-perfectionnisme-toxique": ["L9", "L3", "C1", "B1", "B2", "B3", "B5"],
  "echecs-et-procrastination": ["L9", "L3", "B1", "C1", "L1", "B2", "B3"],
  "echecs-et-resilience": ["L3", "C1", "B1", "L1", "B2", "L9", "B3"],
  "echecs-et-visualisation": ["B3", "L3", "B1", "C1", "B2", "B5", "L9"],
  "echecs-gestion-du-temps": ["L3", "B1", "C1", "L1", "B2", "B3", "B5"],
  "echecs-peur-de-gagner": ["L9", "L3", "C1", "B1", "L1", "B2", "B3"],
  "echecs-peur-de-perdre": ["L9", "L3", "C1", "B1", "L1", "B2", "B3"],
  "echecs-stress-tournoi": ["B1", "B2", "L3", "C1", "B3", "B5", "L9"],
  "echecs-vs-poker-strategie": ["X1", "L3", "B1", "C1", "B2", "B3", "B5"],
  "echecs-vs-scrabble-cognition": ["X2", "L9", "L3", "B1", "C1", "L1", "B2"],
  "faut-il-vraiment-etudier-les-ouvertures": ["L6", "L3", "B1", "C1", "B2", "B3", "B5"],
  "jouer-en-blitz-est-il-mauvais-pour-progresser": ["L3", "B5", "B1", "C1", "L1", "B2", "B3"],
  "loi-de-murphy-aux-echecs": ["L3", "C1", "B1", "L1", "B2", "L9", "B3"],
  "pourquoi-grands-joueurs-perdent-contre-enfants": ["E1", "L2", "L3", "B1", "C1", "B2", "B3"],
  "psychologie-du-joueur-d-echecs": ["L9", "C1", "B1", "B2", "L3", "B3", "B5"],
  "regle-40-40-20-echecs": ["L6", "L3", "B1", "C1", "B2", "B3", "B5"],
  "syndrome-imposteur-2000-elo": ["L9", "C1", "B1", "L3", "B2", "B3", "B5"],
  "syndrome-imposteur-aux-echecs": ["L9", "L3", "C1", "B1", "L1", "B2", "B3"],

  // ── SCIENCE ─────────────────────────────────────────────────────────────
  "decision-sous-incertitude-aux-echecs": ["X1", "B5", "B1", "C1", "L3", "B2", "B3"],
  "echecs-alphazero-stockfish": ["B5", "L3", "B1", "C1", "B2", "B3", "L9"],
  "echecs-alzheimer-prevention-declin-cognitif": ["L9", "E2", "B1", "L1", "C1", "B2", "B3"],
  "echecs-et-complexite-algorithmique": ["B5", "B1", "C1", "L3", "B2", "B3", "L9"],
  "echecs-et-dopamine": ["L9", "B5", "C1", "B1", "L3", "B2", "B3"],
  "echecs-et-genetique": ["L9", "B1", "C1", "L3", "B2", "B3", "B5"],
  "echecs-et-le-corps": ["L9", "B4", "B1", "C1", "B2", "L3", "B3"],
  "echecs-et-meditation": ["L9", "B4", "C1", "B1", "L3", "B2", "B3"],
  "echecs-et-memoire": ["L9", "B3", "L3", "B1", "C1", "B2", "B5"],
  "echecs-et-sommeil": ["L9", "B4", "C1", "B1", "L3", "B2", "B3"],
  "echecs-et-vision-spatiale": ["B3", "L9", "L3", "B1", "C1", "B2", "B5"],
  "echecs-memoire-de-travail": ["L9", "L3", "B3", "B1", "C1", "B2", "B5"],
  "echecs-vs-go-complexite-intelligence": ["X3", "B1", "C1", "L3", "B2", "B3", "B5"],
  "echecs-vs-jeux-video-cerveau": ["L9", "B5", "B1", "C1", "L3", "B2", "B3"],
  "echecs-vs-mathematiques-logique": ["L6", "B1", "C1", "L3", "B2", "B5", "B3"],
  "echecs-vs-musique-cerveau": ["X5", "L9", "B4", "B1", "C1", "L3", "B2"],
  "graphes-de-nash-equilibre-ouvertures": ["B1", "C1", "L3", "B2", "B5", "B3", "L9"],
  "hyperfocus-attention-soutenue-aux-echecs": ["L9", "B5", "L3", "B1", "C1", "B2", "B3"],
  "les-echecs-et-le-cerveau": ["L9", "L3", "L1", "B1", "C1", "B2", "B3"],
  "les-echecs-et-les-mathematiques": ["L6", "B1", "C1", "L3", "B2", "B5", "B3"],
  "les-echecs-rendent-ils-plus-intelligent": ["L9", "E1", "L3", "B1", "C1", "B2", "B3"],
  "logique-modale-aux-echecs": ["B5", "B1", "C1", "L3", "B2", "B3", "L9"],
  "memoriser-parties-aux-echecs": ["L9", "B3", "L3", "B1", "C1", "B2", "B5"],
  "minimax-aux-echecs": ["B5", "B1", "C1", "L3", "B2", "B3", "L9"],
  "neurones-miroirs-aux-echecs": ["L9", "B6", "B1", "C1", "L3", "B2", "B3"],
  "paradoxe-de-zermelo": ["B5", "B1", "C1", "L3", "B2", "B3", "L9"],
  "pourquoi-echecs-probleme-mathematique-impossible-et-ia": ["B5", "B1", "C1", "L3", "B2", "B3", "L9"],
  "reseau-mode-defaut-aux-echecs": ["L9", "B4", "C1", "B1", "L3", "B2", "B3"],
  "reseaux-bayesiens-predire-blunder": ["L3", "B5", "B1", "C1", "B2", "B3", "L9"],
  "theorie-des-jeux-aux-echecs": ["X1", "B1", "C1", "L3", "B2", "B5", "B3"],
  "theorie-du-chaos-aux-echecs": ["B5", "B1", "C1", "L3", "B2", "B3", "L9"],

  // ── SOCIÉTÉ ─────────────────────────────────────────────────────────────
  "echecs-en-prison": ["B1", "B3", "E1", "L1", "L3", "C1", "B2"],
  "echecs-et-argent": ["B4", "L14", "B2", "B1", "C1", "B3", "B5"],
  "echecs-et-autisme": ["E1", "E2", "B1", "C1", "B2", "B3", "L1"],
  "echecs-et-culture-populaire": ["C1", "B4", "B1", "L14", "B2", "B3", "B5"],
  "echecs-et-diplomatie": ["L14", "B4", "B1", "C1", "B2", "B3", "B5"],
  "echecs-et-ecole": ["B6", "E1", "E2", "B1", "L2", "B3", "C1"],
  "echecs-et-enfants": ["E1", "E2", "B6", "L2", "B1", "C1", "B3"],
  "echecs-et-femmes": ["C1", "B1", "B2", "B4", "B3", "B5", "L1"],
  "echecs-et-handicap": ["E1", "B1", "C1", "B2", "L1", "B3", "E2"],
  "echecs-et-hpi": ["L9", "E1", "B1", "C1", "B2", "B3", "L3"],
  "echecs-et-immigration": ["B3", "B1", "C1", "L1", "B2", "B5", "L3"],
  "echecs-et-la-triche": ["B5", "L14", "B1", "C1", "B2", "B3", "L3"],
  "echecs-et-precarite": ["B3", "B1", "L1", "L3", "C1", "E1", "B2"],
  "echecs-et-streaming": ["B5", "B1", "C1", "B2", "B3", "L3", "B4"],
  "echecs-et-tdah": ["L9", "E1", "B1", "C1", "B2", "B3", "L3"],
  "echecs-et-therapie": ["L9", "B4", "C1", "B1", "B2", "B3", "E1"],
  "echecs-religion-et-interdit": ["B4", "B2", "B1", "C1", "L14", "B3", "B5"],
  "echecs-vs-philosophie-pensee-strategique": ["L6", "B1", "C1", "B2", "L3", "B3", "B5"],
  "histoire-et-origines-des-echecs": ["B4", "B2", "L14", "B1", "C1", "B3", "B5"],
  "les-echecs-et-l-addiction": ["L9", "B5", "C1", "B1", "L3", "B2", "B3"],
  "les-echecs-sont-ils-vraiment-un-sport": ["B1", "B2", "C1", "B3", "B5", "L3", "L1"],
};

/** Retourne les produits (résolus) à afficher pour un slug donné, ou [] si aucun. */
export function getAffiliateProductsForSlug(slug: string): AffiliateProduct[] {
  const ids = affiliateBySlug[slug];
  if (!ids) return [];
  return ids
    .map((id) => affiliateProducts[id])
    .filter((p): p is AffiliateProduct => Boolean(p));
}
