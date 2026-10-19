export const oralSpecialties = ["Maths", "NSI", "SES", "HGGSP"] as const;
export const oralLead = "guide-grand-oral-echecs-toutes-specialites";

export const oralSubjects = [
  { slug: "sujet-grand-oral-maths-elo-probabilites", specialty: "Maths", question: "Peut-on modéliser la performance aux échecs ?", summary: "Partir d’un match fictif, puis discuter ce que les probabilités et le score attendu Elo permettent de prévoir.", notions: "Probabilités · Elo · Hypothèses" },
  { slug: "sujet-grand-oral-maths-zermelo-complexite", specialty: "Maths", question: "Pourquoi ne peut-on pas explorer toutes les parties ?", summary: "Relier l’arbre des variantes à la recherche exhaustive, en distinguant résultat théorique et calcul réalisable.", notions: "Dénombrement · Arbres · Complexité" },
  { slug: "sujet-grand-oral-nsi-alphazero", specialty: "NSI", question: "Qu’est-ce qu’AlphaZero change dans l’intelligence artificielle ?", summary: "Comparer recherche classique et apprentissage, puis préciser le rôle du réseau et les limites des résultats.", notions: "Recherche · Apprentissage · IA" },
  { slug: "sujet-grand-oral-ses-marche-superstars", specialty: "SES", question: "Les échecs sont-ils un marché de superstars ?", summary: "Explorer les écarts de revenus, le marché des talents et les transformations liées aux plateformes.", notions: "Revenus · Talents · Marché" },
  { slug: "sujet-grand-oral-ses-bourdieu-reproduction", specialty: "SES", question: "Les échecs reproduisent-ils les inégalités sociales ?", summary: "Mobiliser le capital culturel pour interroger l’accès au jeu, sans transformer un cadre d’analyse en preuve.", notions: "Capital culturel · Socialisation · Inégalités" },
  { slug: "sujet-grand-oral-hggsp-fischer-spassky", specialty: "HGGSP", question: "Fischer–Spassky : un match peut-il devenir un instrument d’influence ?", summary: "Replacer le match de 1972 dans la guerre froide et discuter les usages politiques d’un événement sportif.", notions: "Guerre froide · Influence · Puissance" },
  { slug: "sujet-grand-oral-hggsp-memoire-patrimoine", specialty: "HGGSP", question: "Comment un match d’échecs devient-il un objet de mémoire ?", summary: "Comparer les récits autour de Fischer–Spassky et distinguer histoire, commémoration et patrimoine.", notions: "Histoire · Mémoires · Patrimoine" },
  { slug: "sujet-grand-oral-hggsp-mondialisation-plateformes", specialty: "HGGSP", question: "Les échecs illustrent-ils une culture mondialisée ?", summary: "Observer les plateformes et les institutions pour questionner ce qui circule, s’uniformise ou résiste.", notions: "Mondialisation · Plateformes · Culture" },
] as const;

export const oralGuides = [
  { slug: "grand-oral-maths-spe-echecs", label: "Maths", title: "Du programme à la démonstration.", summary: "Dénombrement, probabilités et modèles : choisir des calculs que tu peux expliquer et en annoncer les limites." },
  { slug: "guide-grand-oral-echecs-nsi", label: "NSI · Atelier", title: "Construire ton raisonnement, code à l’appui.", summary: "Un guide pour développer ta problématique, travailler un exemple Python et préparer les questions du jury." },
  { slug: "guide-grand-oral-echecs-ses-hggsp", label: "SES & HGGSP", title: "Des concepts, des faits, une argumentation.", summary: "Des angles de départ, un plan à adapter et des questions pour mettre tes arguments à l’épreuve." },
  { slug: "grand-oral-nsi-echecs", label: "NSI · Les bases", title: "Comprendre comment le programme choisit.", summary: "Minimax, alpha-bêta, représentations et données : les notions à maîtriser avant de les présenter." },
  { slug: "grand-oral-mathematiques-echecs", label: "Maths + NSI", title: "Faire dialoguer tes deux spécialités.", summary: "Relier les variantes, les modèles probabilistes et leur traduction en algorithmes dans un sujet transversal." },
] as const;

export const oralRevisionSheets = [
  { slug: "sujet-grand-oral-maths-combinatoire", label: "Maths", title: "Compter les variantes", detail: "Arbres de coups et hypothèses de dénombrement." },
  { slug: "sujet-grand-oral-maths-modeles-limites", label: "Maths + NSI", title: "Délimiter un modèle", detail: "Ce qu’un modèle explique et ce qu’il laisse de côté." },
  { slug: "sujet-grand-oral-nsi-minimax", label: "NSI", title: "Expliquer minimax", detail: "Un exemple à deux niveaux que tu peux refaire." },
  { slug: "sujet-grand-oral-nsi-alpha-beta", label: "NSI", title: "Montrer une coupure alpha-bêta", detail: "L’optimisation, sa garantie et ses limites." },
] as const;
