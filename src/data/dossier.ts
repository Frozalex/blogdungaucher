import type { CategorySlug } from "./site";

/**
 * Dossier thématique mis en avant sur l'accueil (encadré DossierBox, pleine largeur).
 *
 * Paramétrable pour basculer le dossier selon la saison : changer `pillar`,
 * `bannerLabel` et les 4 `entries`. Les entrées référencent des articles publiés
 * par leur slug FR ; le titre et le lien sont résolus contre la collection `blog`
 * (le résumé ci-dessous prime, sinon repli sur l'extrait de l'article).
 *
 * Actuellement configuré sur le dossier « Grand oral » (Baccalauréat), qui est
 * du contenu FR uniquement : l'encadré n'est rendu que sur l'accueil français.
 */
export interface DossierEntry {
  /** Sur-titre coloré de la colonne (ex. « Maths », « NSI », « Méthode »). */
  kicker: string;
  /** Slug FR de l'article cible (nom de fichier sans extension). */
  slug: string;
  /** Résumé court affiché sous le titre (prime sur l'extrait de l'article). */
  summary: string;
}

export interface Dossier {
  /** Pilier dont l'encadré emprunte la couleur. */
  pillar: CategorySlug;
  /** Libellé du bandeau supérieur (petites capitales), par langue. */
  bannerLabel: Record<"fr" | "en" | "pt-br" | "nl", string>;
  /** Lien « voir la rubrique » du bandeau. */
  href: string;
  entries: DossierEntry[];
}

export const currentDossier: Dossier = {
  pillar: "grand-oral",
  bannerLabel: {
    fr: "Baccalauréat 2026",
    en: "Baccalauréat 2026",
    "pt-br": "Baccalauréat 2026",
    nl: "Baccalauréat 2026",
  },
  href: "/fr/grand-oral/",
  entries: [
    {
      kicker: "Maths",
      slug: "grand-oral-maths-spe-echecs",
      summary:
        "Suites, loi binomiale, combinatoire et espérance : chaque chapitre de terminale illustré sur l'échiquier.",
    },
    {
      kicker: "Maths + NSI",
      slug: "grand-oral-mathematiques-echecs",
      summary:
        "Le pont transversal : la combinatoire explique le minimax, les probabilités fondent l'IA du jeu.",
    },
    {
      kicker: "NSI",
      slug: "grand-oral-nsi-echecs",
      summary:
        "Minimax en Python, bitboards, PGN, AlphaZero : le programme de spécialité incarné en 64 cases.",
    },
    {
      kicker: "Méthode",
      slug: "guide-grand-oral-echecs-toutes-specialites",
      summary:
        "Le kit universel : plan minuté, questions du jury et anti-sèche, toutes spécialités confondues.",
    },
  ],
};
