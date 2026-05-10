import type { VideoPostProps } from "./types";

export const defaultVideoProps: VideoPostProps = {
  title: "Titre de l’article",
  excerpt:
    "Un extrait court qui donne envie de lire la suite. Deux phrases suffisent pour tester le rendu.",
  tags: ["Tag un", "Tag deux"],
  heroImageSrc: null,
  heroImageAlt: "",
  accentColor: "#5b9fd4",
  keyTakeaways: [
    "Premier point clé à retenir.",
    "Deuxième idée utile pour le lecteur.",
    "Troisième conclusion pratique.",
  ],
  summarySequence: "classic",
};

/** Exemple pour prévisualiser la séquence data-reveal dans Remotion Studio (props JSON). */
export const sampleDataRevealProps: VideoPostProps = {
  ...defaultVideoProps,
  summarySequence: "data-reveal",
  dataReveal: {
    vizTitle: "Charge cognitive et expertise aux échecs",
    bars: [
      { label: "Joueurs experts", value: 78, max: 100 },
      { label: "Joueurs club", value: 52, max: 100 },
      { label: "Débutants", value: 34, max: 100 },
    ],
    highlight: "73 %",
    highlightSub: "meilleure rétention des motifs",
    source: "Chase & Simon (1973), reprises cognitives récentes",
    takeaway:
      "Les experts « voient » des chunks : moins de charge de travail pour calculer plus profondément.",
    cta: "Lire l’article complet",
  },
};
