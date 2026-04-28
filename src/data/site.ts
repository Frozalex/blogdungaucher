export const siteConfig = {
  name: "Blog d'un Gaucher",
  domainName: "blogdungaucher",
  siteUrl: "https://blogdungaucher.com",
  defaultTitle: "Blog d'un Gaucher",
  defaultDescription:
    "Un blog d'échecs personnel sur la science du jeu, l'esprit de compétition et l'impact social des échecs.",
  /** PNG : meilleure compatibilité og:image que le SVG (réseaux, messageries). */
  defaultOgImage: "/images/og-default.png",
  features: {
    analysesAvailable: false,
  },
  futureInfoEmailLabel:
    "Vous pouvez nous contacter à l'adresse contact@blogdungaucher.com.",
  futureInfoEmailLabelEn:
    "You can reach us at contact@blogdungaucher.com.",
  comments: {
    provider: "giscus",
    enabled: true,
    repo: "Frozalex/blogdungaucher",
    repoId: "R_kgDOR5p2oA",
    category: "General",
    categoryId: "DIC_kwDOR5p2oM4C6Cct",
  },
} as const;

/** Collez l’ID d’unité affiché dans AdSense (Annonces > ton unité > Code) pour activer sans variable d’environnement. Laisser vide si tu utilises `PUBLIC_ADSENSE_SLOT` au build. */
export const ADSENSE_SLOT_OVERRIDE = "7361631253";

/** Google AdSense — script chargé dans BaseLayout ; ici les IDs d’unités d’annonce (créées dans AdSense > Annonces). */
export const adsenseConfig = {
  /** Passe à false pour revenir aux blocs d’attente (sans ins AdSense). */
  enabled: true,
  client: "ca-pub-1244325018333025",
  /**
   * ID numérique de l’unité (ex. 1234567890).
   * Tu peux utiliser la même unité responsive partout pour commencer.
   * Priorité : override ci-dessus, puis variables PUBLIC_* au build.
   */
  slots: {
    default: (
      ADSENSE_SLOT_OVERRIDE.trim() ||
      (typeof import.meta.env.PUBLIC_ADSENSE_SLOT === "string"
        ? import.meta.env.PUBLIC_ADSENSE_SLOT
        : ""
      ).trim()
    ),
    leaderboard: (
      (typeof import.meta.env.PUBLIC_ADSENSE_SLOT_LEADERBOARD === "string"
        ? import.meta.env.PUBLIC_ADSENSE_SLOT_LEADERBOARD
        : ""
      ).trim()
    ),
    articleTop: (
      (typeof import.meta.env.PUBLIC_ADSENSE_SLOT_ARTICLE === "string"
        ? import.meta.env.PUBLIC_ADSENSE_SLOT_ARTICLE
        : ""
      ).trim()
    ),
    sidebar: (
      (typeof import.meta.env.PUBLIC_ADSENSE_SLOT_SIDEBAR === "string"
        ? import.meta.env.PUBLIC_ADSENSE_SLOT_SIDEBAR
        : ""
      ).trim()
    ),
  },
} as const;

export function getAdsenseSlot(
  format: "leaderboard" | "inline" | "rectangle"
): string {
  const { slots } = adsenseConfig;
  if (format === "leaderboard" && slots.leaderboard) return slots.leaderboard;
  if (format === "inline" && slots.articleTop) return slots.articleTop;
  if (format === "rectangle" && slots.sidebar) return slots.sidebar;
  return slots.default;
}

export const categorySlugs = [
  "science",
  "esprit",
  "societe",
] as const;

export type CategorySlug = (typeof categorySlugs)[number];
export type SiteSectionSlug = CategorySlug | "analyses";

export const categoryMap: Record<
  SiteSectionSlug,
  {
    label: string;
    href: string;
    shortLabel: string;
    tagline: string;
    description: string;
    descriptionEn?: string;
    audiencePromise: string;
    accent: string;
    surface: string;
    seoTitle?: string;
    seoDescription?: string;
    seoTitleEn?: string;
    seoDescriptionEn?: string;
  }
> = {
  science: {
    label: "Science",
    shortLabel: "Science du jeu",
    href: "/fr/science",
    tagline: "Comprendre comment le cerveau voit, calcule et décide sur l'échiquier.",
    description:
      "Des articles sur la cognition, la mémoire, les biais, la préparation et l'apprentissage appliqués aux échecs.",
    descriptionEn:
      "Articles on cognition, memory, bias, preparation and learning applied to chess.",
    audiencePromise:
      "Pour les lecteurs qui veulent progresser en comprenant les mécanismes profonds du jeu.",
    accent: "#5b9fd4",
    surface: "rgba(91,159,212,0.1)",
    seoTitle: "Science : Cognition et Neurosciences | Blog d'un Gaucher",
    seoDescription:
      "La science du jeu d'échecs expliquée : cognition, mémoire, neuroplasticité et apprentissage. Pour comprendre les mécanismes profonds du jeu.",
    seoTitleEn: "Science: Cognition & Neuroscience | A Left-Hander's Blog",
    seoDescriptionEn:
      "Chess science explained: cognition, memory, neuroplasticity and learning. For players who want to improve by understanding the deep mechanisms of the game.",
  },
  esprit: {
    label: "Esprit",
    shortLabel: "Esprit compétitif",
    href: "/fr/esprit",
    tagline: "Le mental, la discipline et la lucidité quand la pression monte.",
    description:
      "Une rubrique sur l'attention, la confiance, la gestion de la défaite et le travail intérieur du joueur.",
    descriptionEn:
      "A section on focus, confidence, managing defeat and the inner work of the player.",
    audiencePromise:
      "Pour celles et ceux qui savent que la qualité d'une partie se joue aussi dans la tête.",
    accent: "#f0a050",
    surface: "rgba(240,160,80,0.1)",
    seoTitle: "Esprit : Philosophie et Réflexions | Blog d'un Gaucher",
    seoDescription:
      "Réflexions sur le mental compétitif aux échecs : attention, confiance, gestion de la défaite et discipline intérieure du joueur.",
    seoTitleEn: "Mind: Philosophy & Competitive Mindset | A Left-Hander's Blog",
    seoDescriptionEn:
      "Reflections on the competitive mindset in chess: focus, confidence, managing defeat and the inner discipline of the player.",
  },
  societe: {
    label: "Société",
    shortLabel: "Échecs et société",
    href: "/fr/societe",
    tagline: "Quand l'échiquier raconte aussi notre culture, nos institutions et notre époque.",
    description:
      "Des analyses sur la place des échecs dans l'éducation, les médias, la technologie et la vie collective.",
    descriptionEn:
      "Analyses on chess in education, media, technology and collective life.",
    audiencePromise:
      "Pour les lecteurs qui veulent comprendre pourquoi les échecs débordent largement le cadre du jeu.",
    accent: "#5cc4b0",
    surface: "rgba(92,196,176,0.1)",
    seoTitle: "Société : Analyses et Décryptages | Blog d'un Gaucher",
    seoDescription:
      "Analyses et décryptages sur la place des échecs dans l'éducation, les médias et la vie collective. Un regard critique sur le jeu et la société.",
    seoTitleEn: "Society: Analyses & Insights | A Left-Hander's Blog",
    seoDescriptionEn:
      "Analyses on chess in education, media and collective life. A critical look at the game and society, from inclusion to culture and beyond.",
  },
  analyses: {
    label: "Analyses",
    shortLabel: "Analyse Stockfish",
    href: "/fr/analyses",
    tagline: "Importe une position FEN ou une partie PGN et laisse Stockfish analyser en direct.",
    description:
      "Un espace d'analyse ouvert à tous : échiquier interactif, notation des coups, barre d'évaluation et meilleure suite.",
    audiencePromise:
      "Pour visualiser et comprendre une position à l'aide d'un moteur de calcul.",
    accent: "#e07272",
    surface: "rgba(224,114,114,0.1)",
  },
};

export const navigationLinks = [
  { label: "Science", href: "/fr/science" },
  { label: "Esprit", href: "/fr/esprit" },
  { label: "Société", href: "/fr/societe" },
  { label: "Articles", href: "/fr/blog" },
  { label: "À propos", href: "/fr/about" },
] as const;

export const enNavigationLinks = [
  { label: "Science", href: "/en/science" },
  { label: "Mind", href: "/en/esprit" },
  { label: "Society", href: "/en/societe" },
  { label: "Articles", href: "/en/blog" },
  { label: "About", href: "/en/about" },
] as const;

/** Navigation allemande (contenu aligné sur la version française jusqu’à traduction). */
export const deNavigationLinks = [
  { label: "Wissenschaft", href: "/de/science" },
  { label: "Geist", href: "/de/esprit" },
  { label: "Gesellschaft", href: "/de/societe" },
  { label: "Artikel", href: "/de/blog" },
  { label: "Über uns", href: "/de/about" },
] as const;

export const staticRoutes = [
  "/fr/",
  "/fr/blog",
  "/fr/science",
  "/fr/esprit",
  "/fr/societe",
  "/fr/analyses",
  "/fr/about",
  "/fr/mentions-legales",
  "/fr/politique-confidentialite",
] as const;

export const enStaticRoutes = [
  "/en/",
  "/en/blog",
  "/en/science",
  "/en/esprit",
  "/en/societe",
  "/en/about",
] as const;

export const deStaticRoutes = [
  "/de/",
  "/de/blog",
  "/de/science",
  "/de/esprit",
  "/de/societe",
  "/de/about",
  "/de/mentions-legales",
  "/de/politique-confidentialite",
] as const;
