export type HubCategory = "science" | "esprit" | "societe";

export interface HubTheme {
  id: string;
  title: string;
  question: string;
  intro: string;
  slugs: string[];
}

export interface HubEditorial {
  title: string;
  intro: string;
  lead: string;
  leadSummary: string;
  essentials: string[];
  themes: HubTheme[];
  glossary: string[];
}

/** Sélections FR : les slugs sont résolus uniquement parmi les articles publiés. */
export const hubEditorial: Record<HubCategory, HubEditorial> = {
  science: {
    title: "Science du jeu.",
    intro: "Je pars de ce que tu fais devant l’échiquier : retenir, calculer, choisir. Puis je remonte aux recherches et aux modèles qui aident à comprendre ces gestes, avec leurs limites.",
    lead: "echecs-et-memoire",
    leadSummary: "Une position oubliée, une combinaison reconnue, une partie qui reste. Je te propose de commencer par la mémoire pour explorer la façon dont on apprend le jeu.",
    essentials: ["echecs-memoire-de-travail", "minimax-aux-echecs"],
    themes: [
      {
        id: "memoire-apprentissage",
        title: "Mémoire & apprentissage",
        question: "Pourquoi certaines positions deviennent-elles familières ?",
        intro: "Reconnaître une forme, imaginer une variante, revenir sur ce qu’on a appris : je rassemble ici les lectures sur l’expérience du joueur.",
        slugs: ["echecs-et-vision-spatiale", "echecs-et-sommeil", "echecs-et-memoire", "echecs-memoire-de-travail", "echecs-et-meditation", "les-echecs-et-le-cerveau", "reseau-mode-defaut-aux-echecs"],
      },
      {
        id: "calcul-maths-ia",
        title: "Calcul, maths & IA",
        question: "Comment choisir quand on ne peut pas tout calculer ?",
        intro: "Des arbres de variantes aux moteurs, je suis le fil des outils qui mettent la décision en équations.",
        slugs: ["echecs-et-complexite-algorithmique", "theorie-des-jeux-aux-echecs", "minimax-aux-echecs", "echecs-alphazero-stockfish", "reseaux-bayesiens-predire-blunder", "logique-modale-aux-echecs", "theorie-du-chaos-aux-echecs", "graphes-de-nash-equilibre-ouvertures", "paradoxe-de-zermelo", "pourquoi-echecs-probleme-mathematique-impossible-et-ia"],
      },
      {
        id: "etudes-limites",
        title: "Études & limites",
        question: "Qu’est-ce qu’une étude permet vraiment de conclure ?",
        intro: "Je reviens aux mesures, aux protocoles et aux mots employés pour distinguer un résultat de l’histoire qu’on lui fait raconter.",
        slugs: ["neuroplasticite-aux-echecs", "echecs-et-dopamine", "effet-placebo-aux-echecs", "echecs-et-le-corps", "echecs-et-genetique", "neurones-miroirs-aux-echecs", "echecs-alzheimer-prevention-declin-cognitif", "les-echecs-et-les-mathematiques"],
      },
    ],
    glossary: ["memoire-de-travail", "chunking", "neuroplasticite"],
  },
  esprit: {
    title: "Esprit compétitif.",
    intro: "Je m’intéresse à ce qui accompagne chaque coup : l’attention, le doute, la pression et le rapport au résultat. Des questions de joueur, que j’essaie de regarder avec recul.",
    lead: "echecs-et-concentration",
    leadSummary: "Revenir à la position quand l’esprit s’éparpille : une question concrète pour entrer dans le mental du joueur, ses habitudes et ses difficultés.",
    essentials: ["echecs-stress-tournoi", "echecs-et-resilience"],
    themes: [
      {
        id: "attention-temps",
        title: "Attention & temps",
        question: "Comment garder le fil quand la pendule avance ?",
        intro: "Je relie les questions de concentration, de repos et de cadence à des situations que tu peux reconnaître dans tes parties.",
        slugs: ["echecs-gestion-du-temps", "bienfaits-des-pauses-aux-echecs", "echecs-et-concentration", "echecs-et-visualisation", "echecs-et-flow", "regle-40-40-20-echecs"],
      },
      {
        id: "emotions-defaite",
        title: "Émotions & défaite",
        question: "Que faire de ce qui reste après une erreur ?",
        intro: "Colère, peur, déception : je cherche des façons de décrire ces expériences sans réduire un joueur à sa dernière partie.",
        slugs: ["echecs-et-colere-ragequit", "echecs-peur-de-perdre", "echecs-peur-de-gagner", "echecs-et-resilience", "echecs-stress-tournoi", "dissonance-cognitive-aux-echecs", "loi-de-murphy-aux-echecs", "manipulation-emotionnelle-aux-echecs", "mecanismes-de-defense-aux-echecs"],
      },
      {
        id: "confiance-progression",
        title: "Confiance & progression",
        question: "Comment progresser sans se résumer à son Elo ?",
        intro: "Je m’arrête sur les attentes, les comparaisons et les récits qui accompagnent l’envie de devenir meilleur.",
        slugs: ["syndrome-imposteur-aux-echecs", "echecs-et-confiance-en-soi", "psychologie-du-joueur-d-echecs", "theorie-de-l-attachement-aux-echecs", "biais-du-survivant-aux-echecs", "effet-dunning-kruger-aux-echecs", "burnout-chess", "5-biais-cognitifs-blunder", "echecs-et-perfectionnisme-toxique", "syndrome-imposteur-2000-elo"],
      },
    ],
    glossary: ["zeitnot", "resilience", "etat-de-flow"],
  },
  societe: {
    title: "Échecs et société.",
    intro: "Je regarde ce que les échecs racontent au-delà de la partie : qui joue, qui apprend, qui devient visible, et comment les institutions et les écrans façonnent le jeu.",
    lead: "echecs-et-la-triche",
    leadSummary: "À travers l’affaire Niemann, je pose une question qui dépasse le soupçon individuel : sur quoi repose la confiance dans une compétition à l’ère des moteurs ?",
    essentials: ["echecs-et-ecole", "echecs-et-handicap"],
    themes: [
      {
        id: "education-inclusion",
        title: "Éducation & inclusion",
        question: "À qui le jeu ouvre-t-il ses portes ?",
        intro: "École, clubs et lieux de transmission : je m’intéresse aux conditions dans lesquelles chacun peut trouver sa place.",
        slugs: ["echecs-et-enfants", "echecs-en-prison", "echecs-et-ecole", "echecs-et-handicap", "echecs-et-autisme", "echecs-et-tdah", "echecs-et-hpi", "echecs-et-therapie"],
      },
      {
        id: "culture-medias",
        title: "Culture & médias",
        question: "Comment l’échiquier devient-il une image de notre époque ?",
        intro: "Récits, écrans et idées : je suis les chemins par lesquels les échecs entrent dans la culture commune.",
        slugs: ["echecs-religion-et-interdit", "echecs-vs-philosophie-pensee-strategique", "echecs-et-streaming", "echecs-et-culture-populaire"],
      },
      {
        id: "pouvoir-argent-confiance",
        title: "Pouvoir, argent & confiance",
        question: "Qui fixe les règles, les places et la valeur du jeu ?",
        intro: "Je regarde les rapports économiques et sociaux derrière la compétition, ses promesses et ses controverses.",
        slugs: ["echecs-et-argent", "echecs-et-femmes", "echecs-et-diplomatie", "echecs-et-la-triche", "gaslighting-aux-echecs", "les-echecs-et-l-addiction"],
      },
    ],
    glossary: ["elo", "grand-maitre", "biais-cognitif"],
  },
};
