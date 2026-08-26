/**
 * Série « Programmer son moteur d'échecs en Python » : structure éditoriale.
 *
 * Tutoriel incrémental : chaque article livre du code qui tourne et une vérification
 * objective. Deux étalons servent de garde-fous tout au long de la série :
 *   - `perft` (comptage récursif des positions, valeurs de référence du Chess Programming
 *     Wiki) pour la correction du générateur de coups ;
 *   - Stockfish, bridé en niveau, comme adversaire calibré pour mesurer la force réelle.
 *
 * Le plan détaillé vit dans drafts/_serie-moteur-python/PLAN.md.
 */

export interface MoteurPhase {
  id: string;
  titre: string;
  chapeau: string;
  items: {
    slug: string;
    /** Titre de repli tant que l'article n'est pas écrit. */
    label: string;
    /** Ce que le lecteur peut vérifier à la fin de l'article. */
    verification: string;
  }[];
}

export const serieMoteurPhases: MoteurPhase[] = [
  {
    id : "echiquier",
    titre : "Phase 1 — L'échiquier",
    chapeau :
      "Avant de chercher un bon coup, il faut savoir quels coups existent. C'est la partie la moins spectaculaire et celle où se logent tous les bugs.",
    items : [
      {
        slug : "moteur-echecs-python-par-ou-commencer",
        label : "Un moteur d'échecs, c'est quoi exactement",
        verification : "Environnement installé, première position affichée",
      },
      {
        slug : "representer-un-echiquier-en-python",
        label : "Représenter un échiquier",
        verification : "Lecture et écriture de FEN sans perte",
      },
      {
        slug : "generer-les-coups-legaux-en-python",
        label : "Générer les coups légaux",
        verification : "41 648 coups comparés à Stockfish",
      },
      {
        slug : "perft-verifier-son-generateur-de-coups",
        label : "Perft : prouver que le générateur est juste",
        verification : "6 positions de référence, comptages exacts",
      },
    ],
  },
  {
    id : "premier-moteur",
    titre : "Phase 2 — Le premier moteur qui joue",
    chapeau :
      "De la partie au hasard au premier programme qui choisit vraiment. À la fin de cette phase, ton moteur bat un débutant.",
    items : [
      {
        slug : "un-moteur-qui-joue-au-hasard",
        label : "Un moteur qui joue au hasard",
        verification : "Partie complète jouée sans coup illégal",
      },
      {
        slug : "fonction-evaluation-materiel-python",
        label : "Évaluer une position : le matériel",
        verification : "Évaluations comparées à celles de Stockfish",
      },
      {
        slug : "minimax-en-python-moteur-echecs",
        label : "Minimax : chercher à plusieurs coups",
        verification : "Mats en 2 trouvés systématiquement",
      },
      {
        slug : "negamax-et-elagage-alpha-beta-python",
        label : "Négamax et élagage alpha-bêta",
        verification : "Même coup joué, nœuds visités divisés",
      },
    ],
  },
  {
    id : "le-rendre-fort",
    titre : "Phase 3 — Le rendre fort",
    chapeau :
      "L'algorithme est en place. Tout ce qui suit consiste à chercher plus profond dans le même temps, et à évaluer moins bêtement.",
    items : [
      {
        slug : "ordonnancement-des-coups-moteur-echecs",
        label : "Ordonner les coups",
        verification : "Profondeur atteinte en 5 secondes, avant et après",
      },
      {
        slug : "approfondissement-iteratif-gestion-du-temps",
        label : "Approfondissement itératif et gestion du temps",
        verification : "Le moteur respecte un budget de temps imposé",
      },
      {
        slug : "quiescence-et-tables-de-cases-python",
        label : "Quiescence et tables de cases",
        verification : "Effet d'horizon supprimé sur positions tactiques",
      },
    ],
  },
  {
    id : "le-sortir",
    titre : "Phase 4 — Le sortir de ton terminal",
    chapeau :
      "Un moteur qui ne parle pas UCI ne sert à rien. Dernière étape : le brancher dans une vraie interface et mesurer honnêtement sa force.",
    items : [
      {
        slug : "protocole-uci-python-et-mesurer-son-elo",
        label : "Parler UCI, et mesurer son Elo",
        verification : "Elo mesuré contre Stockfish bridé, avec sa marge",
      },
    ],
  },
];

export const serieMoteurTotal = serieMoteurPhases.reduce(
  (total, phase) => total + phase.items.length,
  0,
);

export const serieMoteurSlugs = serieMoteurPhases.flatMap((phase) =>
  phase.items.map((item) => item.slug),
);
