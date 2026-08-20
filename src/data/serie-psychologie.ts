/**
 * Série « Psychologie appliquée aux échecs » : 41 articles publiés d'août 2026 à juillet 2027.
 *
 * Les articles sont regroupés en 10 grappes thématiques. Chaque grappe possède un pilier
 * (article long qui indexe ses déclinaisons) et le hub `pourquoi-ton-cerveau-prefere-avoir-raison`
 * referme l'ensemble.
 *
 * La page /fr/series/psychologie/ résout chaque slug dans la collection `blog` : les articles
 * dont la publishDate est passée s'affichent en lien, les autres restent listés comme « à venir ».
 * On garde donc la série lisible en bloc dès le premier article, ce qui est tout l'intérêt.
 */

export interface SerieItem {
  /** Slug du fichier markdown dans src/content/blog/<catégorie>/ */
  slug: string;
  /** Titre court affiché dans l'index (le titre complet vient de la collection si publié). */
  label: string;
  /** Pilier de grappe, mis en avant visuellement. */
  pilier?: boolean;
}

export interface SerieGrappe {
  id: string;
  titre: string;
  chapeau: string;
  items: SerieItem[];
}

export const seriePsychologieGrappes: SerieGrappe[] = [
  {
    id : "noyau",
    titre : "Le noyau : pourquoi le cerveau protège son image",
    chapeau :
      "Six mécanismes qui s'enclenchent dans un ordre précis, avant, pendant et après chaque partie. Le hub de la série les referme.",
    items : [
      { slug : "pourquoi-ton-cerveau-prefere-avoir-raison", label : "Pourquoi ton cerveau préfère avoir raison plutôt qu'apprendre", pilier : true },
      { slug : "effet-dunning-kruger-aux-echecs", label : "L'effet Dunning-Kruger", pilier : true },
      { slug : "dissonance-cognitive-aux-echecs", label : "La dissonance cognitive" },
      { slug : "biais-de-confirmation-aux-echecs", label : "Le biais de confirmation" },
      { slug : "mecanismes-de-defense-aux-echecs", label : "Les mécanismes de défense", pilier : true },
      { slug : "rationalisation-aux-echecs", label : "La rationalisation" },
      { slug : "projection-aux-echecs", label : "La projection" },
    ],
  },
  {
    id : "jugement",
    titre : "Les biais de jugement",
    chapeau : "Ce qui déforme l'évaluation d'une position, d'un coup ou d'un adversaire.",
    items : [
      { slug : "effet-de-halo-aux-echecs", label : "L'effet de halo" },
      { slug : "biais-du-survivant-aux-echecs", label : "Le biais du survivant" },
      { slug : "aversion-a-la-perte-aux-echecs", label : "L'aversion à la perte" },
      { slug : "biais-d-ancrage-aux-echecs", label : "Le biais d'ancrage" },
      { slug : "effet-barnum-aux-echecs", label : "L'effet Barnum" },
    ],
  },
  {
    id : "boucles",
    titre : "Les boucles auto-entretenues",
    chapeau : "Des croyances qui produisent les faits censés les vérifier.",
    items : [
      { slug : "prophetie-auto-realisatrice-aux-echecs", label : "La prophétie auto-réalisatrice" },
      { slug : "impuissance-apprise-aux-echecs", label : "L'impuissance apprise" },
      { slug : "comparaison-sociale-aux-echecs", label : "La comparaison sociale" },
    ],
  },
  {
    id : "groupe",
    titre : "Le groupe",
    chapeau : "Ce que la présence des autres fait à ton jeu, et ce qu'elle fait à la communauté.",
    items : [
      { slug : "psychologie-des-foules-aux-echecs", label : "La psychologie des foules", pilier : true },
      { slug : "conformisme-aux-echecs", label : "Le conformisme" },
      { slug : "obeissance-a-l-autorite-aux-echecs", label : "L'obéissance à l'autorité" },
      { slug : "effet-spectateur-aux-echecs", label : "L'effet spectateur" },
    ],
  },
  {
    id : "motivation",
    titre : "Motivation et discipline",
    chapeau : "Pourquoi on s'entraîne, pourquoi on arrête, et pourquoi les plans ne tiennent pas.",
    items : [
      { slug : "theorie-auto-determination-aux-echecs", label : "La théorie de l'autodétermination" },
      { slug : "motivation-intrinseque-aux-echecs", label : "La motivation intrinsèque" },
      { slug : "gratification-differee-aux-echecs", label : "La gratification différée" },
      { slug : "formation-des-habitudes-aux-echecs", label : "La formation des habitudes" },
    ],
  },
  {
    id : "influence",
    titre : "Influence et manipulation",
    chapeau : "Les sept leviers de la persuasion, appliqués au marché des échecs et à l'échiquier.",
    items : [
      { slug : "psychologie-de-la-persuasion-aux-echecs", label : "La psychologie de la persuasion", pilier : true },
      { slug : "reciprocite-aux-echecs", label : "La réciprocité" },
      { slug : "preuve-sociale-aux-echecs", label : "La preuve sociale" },
      { slug : "rarete-aux-echecs", label : "La rareté" },
      { slug : "manipulation-emotionnelle-aux-echecs", label : "La manipulation émotionnelle" },
      { slug : "gaslighting-aux-echecs", label : "Le gaslighting" },
    ],
  },
  {
    id : "lire-l-autre",
    titre : "Lire l'autre",
    chapeau : "Modéliser un adversaire, et repérer quand on le remplit avec soi-même.",
    items : [
      { slug : "theorie-de-l-esprit-aux-echecs", label : "La théorie de l'esprit" },
      { slug : "intelligence-emotionnelle-aux-echecs", label : "L'intelligence émotionnelle" },
    ],
  },
  {
    id : "memoire",
    titre : "Mémoire",
    chapeau : "Comment le souvenir d'une partie se refabrique, et ce qu'on y perd.",
    items : [
      { slug : "memoire-reconstructive-aux-echecs", label : "La mémoire reconstructive" },
      { slug : "faux-souvenirs-aux-echecs", label : "Les faux souvenirs" },
    ],
  },
  {
    id : "apprentissage",
    titre : "Apprentissage et corps",
    chapeau : "Conditionnements, croyances et physiologie de la performance.",
    items : [
      { slug : "conditionnement-classique-aux-echecs", label : "Le conditionnement classique" },
      { slug : "conditionnement-operant-aux-echecs", label : "Le conditionnement opérant" },
      { slug : "neuroplasticite-aux-echecs", label : "La neuroplasticité, et son mythe" },
      { slug : "effet-placebo-aux-echecs", label : "L'effet placebo" },
      { slug : "stress-chronique-aux-echecs", label : "Le stress chronique" },
    ],
  },
  {
    id : "statut",
    titre : "Statut, choix, lien",
    chapeau : "Ce qu'un classement permanent fait à une personne, et ce qui la retient au jeu.",
    items : [
      { slug : "psychologie-du-statut-aux-echecs", label : "La psychologie du statut" },
      { slug : "paradoxe-du-choix-aux-echecs", label : "Le paradoxe du choix" },
      { slug : "theorie-de-l-attachement-aux-echecs", label : "La théorie de l'attachement" },
    ],
  },
];

/** Nombre total d'articles de la série, calculé pour éviter toute désynchronisation. */
export const seriePsychologieTotal = seriePsychologieGrappes.reduce(
  (total, grappe) => total + grappe.items.length,
  0,
);

/** Tous les slugs de la série, à plat. Utile pour compter les articles publiés. */
export const seriePsychologieSlugs = seriePsychologieGrappes.flatMap((grappe) =>
  grappe.items.map((item) => item.slug),
);
