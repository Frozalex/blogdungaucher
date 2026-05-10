export type DataRevealBar = {
  label: string;
  value: number;
  /** Valeur max pour la normalisation de la barre (ex. 100 pour des pourcentages). */
  max: number;
};

/** Séquence « data reveal » — pensée pour ArticleSummary neuro / chiffres (~45 s). */
export type DataRevealPayload = {
  /** Titre affiché en 0–5 s (fade-in). */
  vizTitle: string;
  bars: DataRevealBar[];
  /** Grand chiffre / formulation principale (20–28 s). */
  highlight: string;
  highlightSub?: string;
  /** Référence courte pour la source (20–28 s). */
  source: string;
  /** Phrase de takeaway (28–45 s). */
  takeaway: string;
  cta?: string;
};

export type VideoPostProps = {
  title: string;
  excerpt: string;
  tags: string[];
  heroImageSrc: string | null;
  heroImageAlt: string;
  accentColor: string;
  /** Jusqu’à 3 points pour la composition récap classique. */
  keyTakeaways: string[];
  /** `data-reveal` active ArticleSummaryDataReveal si `dataReveal` est complet. */
  summarySequence?: "classic" | "data-reveal";
  dataReveal?: DataRevealPayload | null;
};
