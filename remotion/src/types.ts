export type DataRevealBar = {
  label: string;
  value: number;
  /** Valeur max pour la normalisation de la barre (ex. 100 pour des pourcentages). */
  max: number;
};

/** Séquence « data reveal », ArticleSummary neuro / chiffres (~55 s en prod). */
export type DataRevealPayload = {
  /** Titre affiché en 0–5 s (fade-in). */
  vizTitle: string;
  bars: DataRevealBar[];
  /** Grand chiffre / formulation principale (20–28 s). */
  highlight: string;
  highlightSub?: string;
  /** Référence courte pour la source (20–28 s). */
  source: string;
  /** Synthèse finale (plusieurs paragraphes possibles, séparer par une ligne vide dans le YAML). */
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
  /** Jusqu’à 5 points pour la composition récap classique (3 minimum si remplissage auto). */
  keyTakeaways: string[];
  /** `data-reveal` active ArticleSummaryDataReveal si `dataReveal` est complet. */
  summarySequence?: "classic" | "data-reveal";
  dataReveal?: DataRevealPayload | null;
};
