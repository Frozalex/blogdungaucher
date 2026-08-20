/**
 * Registre des séries du blog.
 *
 * Une série = un ensemble d'articles conçus ensemble, publiés dans un ordre voulu, et
 * lisibles comme un bloc. Ce registre alimente la page /fr/series/.
 *
 * Deux états :
 *   - `href` défini  → la série a sa page d'index, l'entrée est cliquable.
 *   - `href` absent  → série annoncée, non commencée : affichée mais non cliquable.
 *
 * Pour ouvrir une série annoncée : créer `src/pages/fr/series/<slug>.astro`, renseigner
 * `href` et `slugs` ici, puis ajouter la route dans `staticRoutes` (data/site.ts) pour
 * qu'elle entre au sitemap.
 */

import { seriePsychologieSlugs, seriePsychologieTotal } from "./serie-psychologie";
import { serieMoteurSlugs, serieMoteurTotal } from "./serie-moteur-python";

export interface SerieSummary {
  slug: string;
  title: string;
  /** Une phrase : de quoi parle la série et pourquoi elle existe. */
  lede: string;
  /** Absent tant que la série n'a pas de page : l'entrée est alors non cliquable. */
  href?: string;
  /** Nombre d'articles prévus. */
  total: number;
  /** Slugs des articles publiés ou programmés. Vide pour une série non commencée. */
  slugs?: readonly string[];
  /** Rythme de publication, affiché tant que la série n'est pas complète. */
  cadence?: string;
  /** Ordre d'affichage. */
  rank: number;
}

export const series: SerieSummary[] = [
  {
    slug : "psychologie",
    title : "La psychologie appliquée aux échecs",
    lede :
      "Biais, mémoire, motivation, influence, statut : ce que la recherche dit vraiment du joueur d'échecs. Chaque concept est confronté à sa critique, et plusieurs classiques n'y survivent pas.",
    href : "/fr/series/psychologie/",
    total : seriePsychologieTotal,
    slugs : seriePsychologieSlugs,
    cadence : "un nouveau chaque mardi",
    rank : 1,
  },
  {
    slug : "moteur-python",
    title : "Programmer son moteur d'échecs en Python",
    lede :
      "Construire un moteur de zéro, coup après coup : échiquier, coups légaux, évaluation, minimax, alpha-bêta, UCI. Du code qui tourne à chaque étape, et une vérification objective à chaque fois : perft pour la correction, Stockfish bridé pour la force.",
    href : "/fr/series/moteur-python/",
    total : serieMoteurTotal,
    slugs : serieMoteurSlugs,
    cadence : "à partir de juillet 2027",
    rank : 2,
  },
  {
    slug : "moteur-fonctionnement",
    title : "Comment marche vraiment un moteur d'échecs",
    lede :
      "Ce que Stockfish fait pendant les trois secondes où il réfléchit : fonction d'évaluation, table de transposition, recherche en quiescence, réseaux de neurones. Sans écrire une ligne de code.",
    total : 12,
    rank : 3,
  },
  {
    slug : "ia-joueurs",
    title : "Ce que l'intelligence artificielle a fait aux joueurs",
    lede :
      "Trente ans de moteurs ont changé la préparation, le style, la mémorisation, le rapport à la vérité d'une position et jusqu'à la notion de talent. Enquête sur les effets, pas sur la technologie.",
    total : 8,
    rank : 4,
  },
  {
    slug : "mille-ans-de-regles",
    title : "Mille ans de règles",
    lede :
      "Pourquoi la dame est devenue la pièce la plus puissante, d'où vient le roque, à quoi servait la prise en passant, quand la pendule est apparue. Chaque règle a une date et une raison.",
    total : 10,
    rank : 5,
  },
  {
    slug : "echecs-afrique",
    title : "Les échecs en Afrique",
    lede :
      "Le continent le moins documenté du monde échiquéen : fédérations, joueurs, obstacles matériels, programmes scolaires, et ce que les classements ne mesurent pas.",
    total : 10,
    rank : 6,
  },
  {
    slug : "echecs-jeu-video",
    title : "Les échecs dans le jeu vidéo",
    lede :
      "De Battle Chess aux échecs dans les mondes ouverts, en passant par les adaptations ratées et les jeux qui ont vraiment compris quelque chose au jeu.",
    total : 8,
    rank : 7,
  },
];
