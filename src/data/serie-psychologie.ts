/**
 * Série « Psychologie appliquée aux échecs » : 41 articles, un par mardi, d'août 2026 à mai 2027.
 *
 * Les articles sont regroupés en 10 grappes thématiques. Chaque grappe possède un pilier
 * (article long qui indexe ses déclinaisons) et le hub `pourquoi-ton-cerveau-prefere-avoir-raison`
 * referme l'ensemble.
 *
 * La page /fr/series/psychologie/ résout chaque slug dans la collection `blog` : les articles
 * dont la publishDate est passée s'affichent en lien, les autres restent listés comme « à venir ».
 * On garde donc la série lisible en bloc dès le premier article, ce qui est tout l'intérêt.
 *
 * Les pages /en/series/psychologie/ et /pt-br/series/psychologie/ réutilisent la même structure.
 * Le titre d'un article publié vient de sa traduction (getLocalizedPostText), mais un article
 * « à venir » n'a pas d'entrée résolue : c'est `labelEn` / `labelPtBr` qui évite d'afficher
 * du français dans les pages traduites.
 */

/** Langues servies par la page d'index de série. Le NL suivra avec le reste du site. */
export type SerieLang = "fr" | "en" | "pt-br";

export interface SerieItem {
  /** Slug du fichier markdown dans src/content/blog/<catégorie>/ */
  slug: string;
  /** Titre court affiché dans l'index (le titre complet vient de la collection si publié). */
  label: string;
  labelEn: string;
  labelPtBr: string;
  /** Pilier de grappe, mis en avant visuellement. */
  pilier?: boolean;
}

export interface SerieGrappe {
  id: string;
  titre: string;
  titreEn: string;
  titrePtBr: string;
  chapeau: string;
  chapeauEn: string;
  chapeauPtBr: string;
  items: SerieItem[];
}

/** Libellés d'une grappe dans la langue demandée. */
export function grappeText(grappe: SerieGrappe, lang: SerieLang) {
  if (lang === "en") return { titre: grappe.titreEn, chapeau: grappe.chapeauEn };
  if (lang === "pt-br") return { titre: grappe.titrePtBr, chapeau: grappe.chapeauPtBr };
  return { titre: grappe.titre, chapeau: grappe.chapeau };
}

/** Libellé de repli d'un article, utilisé tant qu'il n'est pas publié. */
export function itemLabel(item: SerieItem, lang: SerieLang) {
  if (lang === "en") return item.labelEn;
  if (lang === "pt-br") return item.labelPtBr;
  return item.label;
}

export const seriePsychologieGrappes: SerieGrappe[] = [
  {
    id : "noyau",
    titre : "Le noyau : pourquoi le cerveau protège son image",
    titreEn : "The Core: Why the Brain Protects Its Self-Image",
    titrePtBr : "O núcleo: por que o cérebro protege a própria imagem",
    chapeau : "Six mécanismes qui s'enclenchent dans un ordre précis, avant, pendant et après chaque partie. Le hub de la série les referme.",
    chapeauEn : "Six mechanisms that fire in a precise order, before, during and after every game. The series hub closes them out.",
    chapeauPtBr : "Seis mecanismos que se acionam numa ordem precisa, antes, durante e depois de cada partida. O hub da série fecha o conjunto.",
    items : [
      { slug : "pourquoi-ton-cerveau-prefere-avoir-raison", label : "Pourquoi ton cerveau préfère avoir raison plutôt qu'apprendre", labelEn : "Why Your Brain Prefers Being Right Over Learning", labelPtBr : "Por que seu cérebro prefere ter razão a aprender", pilier : true },
      { slug : "effet-dunning-kruger-aux-echecs", label : "L'effet Dunning-Kruger", labelEn : "The Dunning-Kruger Effect", labelPtBr : "O efeito Dunning-Kruger", pilier : true },
      { slug : "dissonance-cognitive-aux-echecs", label : "La dissonance cognitive", labelEn : "Cognitive Dissonance", labelPtBr : "A dissonância cognitiva" },
      { slug : "biais-de-confirmation-aux-echecs", label : "Le biais de confirmation", labelEn : "Confirmation Bias", labelPtBr : "O viés de confirmação" },
      { slug : "mecanismes-de-defense-aux-echecs", label : "Les mécanismes de défense", labelEn : "Defense Mechanisms", labelPtBr : "Os mecanismos de defesa", pilier : true },
      { slug : "rationalisation-aux-echecs", label : "La rationalisation", labelEn : "Rationalization", labelPtBr : "A racionalização" },
      { slug : "projection-aux-echecs", label : "La projection", labelEn : "Projection", labelPtBr : "A projeção" },
    ],
  },
  {
    id : "jugement",
    titre : "Les biais de jugement",
    titreEn : "Biases of Judgment",
    titrePtBr : "Os vieses de julgamento",
    chapeau : "Ce qui déforme l'évaluation d'une position, d'un coup ou d'un adversaire.",
    chapeauEn : "What distorts your evaluation of a position, a move or an opponent.",
    chapeauPtBr : "O que distorce a avaliação de uma posição, de um lance ou de um adversário.",
    items : [
      { slug : "effet-de-halo-aux-echecs", label : "L'effet de halo", labelEn : "The Halo Effect", labelPtBr : "O efeito halo" },
      { slug : "biais-du-survivant-aux-echecs", label : "Le biais du survivant", labelEn : "Survivorship Bias", labelPtBr : "O viés do sobrevivente" },
      { slug : "aversion-a-la-perte-aux-echecs", label : "L'aversion à la perte", labelEn : "Loss Aversion", labelPtBr : "A aversão à perda" },
      { slug : "biais-d-ancrage-aux-echecs", label : "Le biais d'ancrage", labelEn : "Anchoring Bias", labelPtBr : "O viés de ancoragem" },
      { slug : "effet-barnum-aux-echecs", label : "L'effet Barnum", labelEn : "The Barnum Effect", labelPtBr : "O efeito Barnum" },
    ],
  },
  {
    id : "boucles",
    titre : "Les boucles auto-entretenues",
    titreEn : "Self-Sustaining Loops",
    titrePtBr : "As alças que se autoalimentam",
    chapeau : "Des croyances qui produisent les faits censés les vérifier.",
    chapeauEn : "Beliefs that produce the very facts meant to verify them.",
    chapeauPtBr : "Crenças que produzem os fatos que deveriam verificá-las.",
    items : [
      { slug : "prophetie-auto-realisatrice-aux-echecs", label : "La prophétie auto-réalisatrice", labelEn : "The Self-Fulfilling Prophecy", labelPtBr : "A profecia autorrealizável" },
      { slug : "impuissance-apprise-aux-echecs", label : "L'impuissance apprise", labelEn : "Learned Helplessness", labelPtBr : "O desamparo aprendido" },
      { slug : "comparaison-sociale-aux-echecs", label : "La comparaison sociale", labelEn : "Social Comparison", labelPtBr : "A comparação social" },
    ],
  },
  {
    id : "groupe",
    titre : "Le groupe",
    titreEn : "The Group",
    titrePtBr : "O grupo",
    chapeau : "Ce que la présence des autres fait à ton jeu, et ce qu'elle fait à la communauté.",
    chapeauEn : "What the presence of others does to your play, and what it does to the community.",
    chapeauPtBr : "O que a presença dos outros faz com o seu jogo, e o que ela faz com a comunidade.",
    items : [
      { slug : "psychologie-des-foules-aux-echecs", label : "La psychologie des foules", labelEn : "Crowd Psychology", labelPtBr : "A psicologia das multidões", pilier : true },
      { slug : "conformisme-aux-echecs", label : "Le conformisme", labelEn : "Conformity", labelPtBr : "O conformismo" },
      { slug : "obeissance-a-l-autorite-aux-echecs", label : "L'obéissance à l'autorité", labelEn : "Obedience to Authority", labelPtBr : "A obediência à autoridade" },
      { slug : "effet-spectateur-aux-echecs", label : "L'effet spectateur", labelEn : "The Bystander Effect", labelPtBr : "O efeito espectador" },
    ],
  },
  {
    id : "motivation",
    titre : "Motivation et discipline",
    titreEn : "Motivation and Discipline",
    titrePtBr : "Motivação e disciplina",
    chapeau : "Pourquoi on s'entraîne, pourquoi on arrête, et pourquoi les plans ne tiennent pas.",
    chapeauEn : "Why you train, why you stop, and why the plans don't hold.",
    chapeauPtBr : "Por que a gente treina, por que a gente para, e por que os planos não se sustentam.",
    items : [
      { slug : "theorie-auto-determination-aux-echecs", label : "La théorie de l'autodétermination", labelEn : "Self-Determination Theory", labelPtBr : "A teoria da autodeterminação" },
      { slug : "motivation-intrinseque-aux-echecs", label : "La motivation intrinsèque", labelEn : "Intrinsic Motivation", labelPtBr : "A motivação intrínseca" },
      { slug : "gratification-differee-aux-echecs", label : "La gratification différée", labelEn : "Delayed Gratification", labelPtBr : "A gratificação adiada" },
      { slug : "formation-des-habitudes-aux-echecs", label : "La formation des habitudes", labelEn : "Habit Formation", labelPtBr : "A formação de hábitos" },
    ],
  },
  {
    id : "influence",
    titre : "Influence et manipulation",
    titreEn : "Influence and Manipulation",
    titrePtBr : "Influência e manipulação",
    chapeau : "Les sept leviers de la persuasion, appliqués au marché des échecs et à l'échiquier.",
    chapeauEn : "The seven levers of persuasion, applied to the chess market and to the board.",
    chapeauPtBr : "As sete alavancas da persuasão, aplicadas ao mercado do xadrez e ao tabuleiro.",
    items : [
      { slug : "psychologie-de-la-persuasion-aux-echecs", label : "La psychologie de la persuasion", labelEn : "The Psychology of Persuasion", labelPtBr : "A psicologia da persuasão", pilier : true },
      { slug : "reciprocite-aux-echecs", label : "La réciprocité", labelEn : "Reciprocity", labelPtBr : "A reciprocidade" },
      { slug : "preuve-sociale-aux-echecs", label : "La preuve sociale", labelEn : "Social Proof", labelPtBr : "A prova social" },
      { slug : "rarete-aux-echecs", label : "La rareté", labelEn : "Scarcity", labelPtBr : "A escassez" },
      { slug : "manipulation-emotionnelle-aux-echecs", label : "La manipulation émotionnelle", labelEn : "Emotional Manipulation", labelPtBr : "A manipulação emocional" },
      { slug : "gaslighting-aux-echecs", label : "Le gaslighting", labelEn : "Gaslighting", labelPtBr : "O gaslighting" },
    ],
  },
  {
    id : "lire-l-autre",
    titre : "Lire l'autre",
    titreEn : "Reading the Other Player",
    titrePtBr : "Ler o outro",
    chapeau : "Modéliser un adversaire, et repérer quand on le remplit avec soi-même.",
    chapeauEn : "Modelling an opponent, and spotting when you fill that model with yourself.",
    chapeauPtBr : "Modelar um adversário, e perceber quando você preenche esse modelo consigo mesmo.",
    items : [
      { slug : "theorie-de-l-esprit-aux-echecs", label : "La théorie de l'esprit", labelEn : "Theory of Mind", labelPtBr : "A teoria da mente" },
      { slug : "intelligence-emotionnelle-aux-echecs", label : "L'intelligence émotionnelle", labelEn : "Emotional Intelligence", labelPtBr : "A inteligência emocional" },
    ],
  },
  {
    id : "memoire",
    titre : "Mémoire",
    titreEn : "Memory",
    titrePtBr : "Memória",
    chapeau : "Comment le souvenir d'une partie se refabrique, et ce qu'on y perd.",
    chapeauEn : "How the memory of a game gets rebuilt, and what you lose in the process.",
    chapeauPtBr : "Como a lembrança de uma partida se refabrica, e o que se perde nisso.",
    items : [
      { slug : "memoire-reconstructive-aux-echecs", label : "La mémoire reconstructive", labelEn : "Reconstructive Memory", labelPtBr : "A memória reconstrutiva" },
      { slug : "faux-souvenirs-aux-echecs", label : "Les faux souvenirs", labelEn : "False Memories", labelPtBr : "As falsas memórias" },
    ],
  },
  {
    id : "apprentissage",
    titre : "Apprentissage et corps",
    titreEn : "Learning and the Body",
    titrePtBr : "Aprendizagem e corpo",
    chapeau : "Conditionnements, croyances et physiologie de la performance.",
    chapeauEn : "Conditioning, beliefs and the physiology of performance.",
    chapeauPtBr : "Condicionamentos, crenças e fisiologia do desempenho.",
    items : [
      { slug : "conditionnement-classique-aux-echecs", label : "Le conditionnement classique", labelEn : "Classical Conditioning", labelPtBr : "O condicionamento clássico" },
      { slug : "conditionnement-operant-aux-echecs", label : "Le conditionnement opérant", labelEn : "Operant Conditioning", labelPtBr : "O condicionamento operante" },
      { slug : "neuroplasticite-aux-echecs", label : "La neuroplasticité, et son mythe", labelEn : "Neuroplasticity, and Its Myth", labelPtBr : "A neuroplasticidade, e o seu mito" },
      { slug : "effet-placebo-aux-echecs", label : "L'effet placebo", labelEn : "The Placebo Effect", labelPtBr : "O efeito placebo" },
      { slug : "stress-chronique-aux-echecs", label : "Le stress chronique", labelEn : "Chronic Stress", labelPtBr : "O estresse crônico" },
    ],
  },
  {
    id : "statut",
    titre : "Statut, choix, lien",
    titreEn : "Status, Choice, Attachment",
    titrePtBr : "Status, escolha, vínculo",
    chapeau : "Ce qu'un classement permanent fait à une personne, et ce qui la retient au jeu.",
    chapeauEn : "What a permanent rating does to a person, and what keeps them in the game.",
    chapeauPtBr : "O que um rating permanente faz com uma pessoa, e o que a mantém no jogo.",
    items : [
      { slug : "psychologie-du-statut-aux-echecs", label : "La psychologie du statut", labelEn : "The Psychology of Status", labelPtBr : "A psicologia do status" },
      { slug : "paradoxe-du-choix-aux-echecs", label : "Le paradoxe du choix", labelEn : "The Paradox of Choice", labelPtBr : "O paradoxo da escolha" },
      { slug : "theorie-de-l-attachement-aux-echecs", label : "La théorie de l'attachement", labelEn : "Attachment Theory", labelPtBr : "A teoria do apego" },
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
