export type GlossaryCategory = "echecs" | "neuro" | "psycho" | "compet";
export interface GlossaryTerm { letter:string; slug:string; title:string; cat:GlossaryCategory; def:string; example:string; related:string[]; articles:string[]; dissertations?:string[]; source?:{label:string;href:string}; }
/** Les identifiants historiques sont conservés pour les liens entrants. */
export const glossaryTerms: GlossaryTerm[] = [
  {
    "letter": "A",
    "slug": "abandon",
    "title": "Abandon",
    "cat": "echecs",
    "def": "Décision de reconnaître sa défaite et de mettre fin à la partie. On peut l’annoncer clairement ; renverser son roi n’est pas une formalité obligatoire.",
    "example": "Tu reconnais la défaite et annonces que tu abandonnes, plutôt que d’attendre le mat.",
    "related": [
      "biais-cognitif",
      "etat-de-flow",
      "fatigue-decisionnelle"
    ],
    "articles": [
      "echecs-peur-de-perdre"
    ],
    "source": {
      "label": "Règles du jeu · FIDE",
      "href": "https://handbook.fide.com/chapter/e012023"
    }
  },
  {
    "letter": "A",
    "slug": "activite",
    "title": "Activité des pièces",
    "cat": "echecs",
    "def": "Mesure de la capacité d'une pièce à influencer le jeu depuis sa case. Une pièce active contrôle de nombreuses cases et peut se déployer vers tous les secteurs de l'échiquier. L'activité est l'un des critères fondamentaux de l'évaluation positionnelle.",
    "example": "Une tour sur une colonne ouverte dispose souvent de plus de possibilités qu’une tour enfermée derrière ses pions.",
    "related": [
      "initiative",
      "tempo",
      "plan"
    ],
    "articles": [
      "theorie-des-jeux-aux-echecs"
    ]
  },
  {
    "letter": "A",
    "slug": "annotation",
    "title": "Annotation",
    "cat": "echecs",
    "def": "Système de symboles attachés aux coups pour qualifier leur qualité : ! (bon coup), !! (brillant), ? (faute), ?? (gaffe), !? (coup intéressant), ?! (coup douteux). L'annotation facilite l'analyse post-partie et la transmission pédagogique.",
    "example": "Dans une partie commentée, « Cf3! » signale que l’annotateur juge ce coup particulièrement bon.",
    "related": [
      "ouverture",
      "gambit",
      "theorie-ouvertures"
    ],
    "articles": [
      "theorie-des-jeux-aux-echecs"
    ]
  },
  {
    "letter": "A",
    "slug": "avantage-positionnel",
    "title": "Avantage positionnel",
    "cat": "echecs",
    "def": "Supériorité dans la structure, l'espace, la sécurité du roi ou l'activité des pièces, sans nécessairement avoir plus de matériel. À distinguer de l'avantage matériel. L'art de convertir un avantage positionnel en victoire est au cœur de la stratégie aux échecs.",
    "example": "Tu as le même matériel que ton adversaire, mais tes pièces sont actives et son roi manque de protection.",
    "related": [
      "activite",
      "initiative",
      "tempo"
    ],
    "articles": [
      "theorie-des-jeux-aux-echecs"
    ]
  },
  {
    "letter": "B",
    "slug": "biais-cognitif",
    "title": "Biais cognitif",
    "cat": "neuro",
    "def": "Tendance systématique du jugement à s’écarter d’un raisonnement ou d’une évaluation attendus. Un biais décrit une tendance ; il ne suffit pas à expliquer chaque erreur d’un joueur.",
    "example": "Tu cherches surtout les variantes qui confirment ton attaque et tu négliges une défense adverse.",
    "related": [
      "etat-de-flow",
      "fatigue-decisionnelle",
      "resilience",
      "biais-confirmation",
      "biais-ancrage",
      "aversion-perte"
    ],
    "articles": [
      "5-biais-cognitifs-blunder"
    ]
  },
  {
    "letter": "B",
    "slug": "blunder",
    "title": "Blunder",
    "cat": "echecs",
    "def": "Coup grave qui perd du matériel décisif ou compromet irrémédiablement la partie (symbolisé par ??). Différent d'une simple erreur : le blunder change fondamentalement l'évaluation de la position. Même les joueurs de haut niveau en produisent, souvent sous pression temporelle ou mentale.",
    "example": "Tu déplaces une pièce et laisses ta dame en prise sans compensation.",
    "related": [
      "cloue",
      "declouage",
      "fourchette"
    ],
    "articles": [
      "5-biais-cognitifs-blunder"
    ]
  },
  {
    "letter": "C",
    "slug": "calcul-variantes",
    "title": "Calcul de variantes",
    "cat": "echecs",
    "def": "Processus mental par lequel un joueur anticipe les coups et réponses possibles en se projetant dans le futur de la partie. Il implique la recherche de coups candidats, le tri des variantes pertinentes et l'évaluation des positions terminales. La profondeur et la fiabilité du calcul distinguent les forts joueurs des faibles.",
    "example": "Tu examines un échec, la réponse du roi, puis le coup dont tu disposes dans la nouvelle position.",
    "related": [
      "memoire-de-travail",
      "chunking",
      "memoire-procedurale",
      "coup-candidat",
      "intuition"
    ],
    "articles": [
      "minimax-aux-echecs"
    ]
  },
  {
    "letter": "C",
    "slug": "cases-faibles",
    "title": "Cases faibles",
    "cat": "echecs",
    "def": "Cases qui ne peuvent plus être défendues par un pion adverse et qui deviennent des points d'ancrage permanents pour les pièces de l'adversaire. La création de cases faibles dans le camp ennemi est un objectif stratégique majeur, notamment dans les finales.",
    "example": "Une case devant un pion isolé peut servir de poste avancé à un cavalier adverse si aucun pion ne peut l’en chasser.",
    "related": [
      "pions-doubles",
      "pion-arriere",
      "pion-passe"
    ],
    "articles": [
      "theorie-des-jeux-aux-echecs"
    ]
  },
  {
    "letter": "C",
    "slug": "charge-cognitive",
    "title": "Charge cognitive",
    "cat": "neuro",
    "def": "Ressources mentales mobilisées par une tâche. Le nombre de variantes, leur familiarité et la façon de les organiser peuvent rendre une position plus ou moins difficile à traiter.",
    "example": "Quand plusieurs variantes se ressemblent, tu peux perdre le fil de celle que tu étais en train d’analyser.",
    "related": [
      "memoire-de-travail",
      "chunking",
      "memoire-procedurale"
    ],
    "articles": [
      "echecs-memoire-de-travail"
    ]
  },
  {
    "letter": "C",
    "slug": "chunking",
    "title": "Chunking",
    "cat": "neuro",
    "def": "Regroupement d’éléments en unités significatives, souvent à partir de connaissances déjà acquises. Aux échecs, reconnaître une configuration familière aide à organiser une position.",
    "example": "Au lieu de retenir trois pièces isolées, tu reconnais une configuration de roque déjà rencontrée.",
    "related": [
      "memoire-de-travail",
      "memoire-procedurale",
      "intelligence-cristallisee"
    ],
    "articles": [
      "echecs-et-memoire"
    ]
  },
  {
    "letter": "C",
    "slug": "cloue",
    "title": "Cloué",
    "cat": "echecs",
    "def": "Pièce immobilisée parce que son déplacement exposerait une pièce plus précieuse placée derrière elle. Le clou absolu empêche légalement le mouvement (pièce clouée sur le roi) ; le clou relatif le rend très coûteux. Exploiter un clouage est l'un des thèmes tactiques les plus fréquents aux échecs.",
    "example": "Un cavalier placé entre son roi et une tour ennemie peut être empêché de bouger par un clouage absolu.",
    "related": [
      "declouage",
      "fourchette",
      "combinaison"
    ],
    "articles": [
      "theorie-des-jeux-aux-echecs"
    ]
  },
  {
    "letter": "C",
    "slug": "combinaison",
    "title": "Combinaison",
    "cat": "echecs",
    "def": "Séquence de coups forcés, souvent avec un sacrifice, conduisant à un gain matériel ou à mat. La combinaison repose sur un motif tactique concret et est calculable de bout en bout. Elle se distingue du jeu positionnel plus subjectif et à long terme.",
    "example": "Tu sacrifies une tour pour attirer le roi sur une case où une suite d’échecs conduit au mat.",
    "related": [
      "cloue",
      "declouage",
      "fourchette"
    ],
    "articles": [
      "theorie-des-jeux-aux-echecs"
    ]
  },
  {
    "letter": "C",
    "slug": "contre-jeu",
    "title": "Contre-jeu",
    "cat": "echecs",
    "def": "Ressources actives qu'un joueur en position difficile parvient à créer pour compliquer la partie. Le contre-jeu peut prendre la forme d'une attaque sur le roi adverse, d'une promotion menaçante ou d'une activité de pièces compensatoire.",
    "example": "Ton adversaire attaque à l’aile roi ; tu crées des menaces sur une colonne ouverte à l’autre aile.",
    "related": [
      "activite",
      "initiative",
      "tempo"
    ],
    "articles": [
      "theorie-des-jeux-aux-echecs"
    ]
  },
  {
    "letter": "C",
    "slug": "cortex-prefrontal",
    "title": "Cortex préfrontal",
    "cat": "neuro",
    "def": "Ensemble de régions à l’avant du cerveau participant notamment à la planification et au contrôle de l’action. Le calcul échiquéen mobilise des réseaux distribués ; aucune zone unique ne résume la pensée du joueur.",
    "example": "Comparer plusieurs coups candidats demande de planifier, sans que cette activité repose sur une seule région du cerveau.",
    "related": [
      "neuroplasticite",
      "hippocampe",
      "dopamine"
    ],
    "articles": [
      "echecs-memoire-de-travail"
    ]
  },
  {
    "letter": "D",
    "slug": "declouage",
    "title": "Déclouage",
    "cat": "echecs",
    "def": "Technique consistant à briser un clouage subi en interposant une pièce ou en déplaçant la pièce précieuse derrière. Le déclouage peut lui-même créer de nouvelles combinaisons tactiques.",
    "example": "Tu écartes ton roi de la colonne attaquée : la pièce qui le protégeait retrouve sa liberté de mouvement.",
    "related": [
      "cloue",
      "fourchette",
      "combinaison"
    ],
    "articles": [
      "theorie-des-jeux-aux-echecs"
    ]
  },
  {
    "letter": "D",
    "slug": "dopamine",
    "title": "Dopamine",
    "cat": "neuro",
    "def": "Neurotransmetteur impliqué dans plusieurs fonctions, dont certains apprentissages liés aux récompenses et à la motivation. Le plaisir d’un beau coup ne permet pas, à lui seul, de déduire une libération de dopamine.",
    "example": "L’envie de cliquer sur « Rejouer » est une expérience observable ; elle ne mesure pas ta dopamine.",
    "related": [
      "neuroplasticite",
      "hippocampe",
      "cortex-prefrontal"
    ],
    "articles": [
      "echecs-et-dopamine"
    ],
    "source": {
      "label": "Schultz, 2016 · récompense et dopamine",
      "href": "https://pmc.ncbi.nlm.nih.gov/articles/PMC5549862/"
    }
  },
  {
    "letter": "D",
    "slug": "pions-doubles",
    "title": "Pions doublés",
    "cat": "echecs",
    "def": "Deux pions de la même couleur alignés sur la même colonne. Ils sont généralement une faiblesse structurelle car ils ne peuvent pas se défendre mutuellement et obstruent les colonnes. Leur évaluation dépend du contexte : pièces actives ou demi-colonnes ouvertes peuvent parfois compenser.",
    "example": "Après une reprise de pion sur la colonne c, deux de tes pions peuvent se retrouver l’un derrière l’autre.",
    "related": [
      "pion-arriere",
      "pion-passe",
      "structure-de-pions"
    ],
    "articles": [
      "theorie-des-jeux-aux-echecs"
    ]
  },
  {
    "letter": "E",
    "slug": "echec",
    "title": "Échec",
    "cat": "echecs",
    "def": "Situation dans laquelle le roi est directement attaqué par une ou plusieurs pièces adverses. Le joueur en échec doit impérativement parer la menace au coup suivant (déplacer le roi, bloquer ou capturer la pièce attaquante). Ne pas répondre à un échec est illégal.",
    "example": "Une tour attaque le roi sur une colonne : tu dois supprimer cet échec par un coup légal.",
    "related": [
      "mat",
      "pat",
      "nul"
    ],
    "articles": [
      "theorie-des-jeux-aux-echecs"
    ],
    "source": {
      "label": "Règles du jeu · FIDE",
      "href": "https://handbook.fide.com/chapter/e012023"
    }
  },
  {
    "letter": "E",
    "slug": "echiquier",
    "title": "Échiquier",
    "cat": "echecs",
    "def": "Plateau de jeu composé de 64 cases (8×8), alternant cases claires et sombres. Les colonnes sont désignées par les lettres a à h, les rangées par les chiffres 1 à 8. Cette géométrie détermine toute la mécanique du jeu et la valeur positionnelle des pièces.",
    "example": "La case e4 se trouve sur la colonne e et la quatrième rangée.",
    "related": [
      "echec",
      "mat",
      "pat"
    ],
    "articles": [
      "theorie-des-jeux-aux-echecs"
    ]
  },
  {
    "letter": "E",
    "slug": "elo",
    "title": "Elo (Rating)",
    "cat": "compet",
    "def": "Système de classement fondé sur les résultats et la force relative des adversaires, nommé d’après Arpad Elo. Les classements en ligne dépendent de leur système, de la cadence et du groupe de joueurs.",
    "example": "Un classement situe tes résultats dans un groupe de joueurs ; deux plateformes ne sont pas directement comparables.",
    "related": [
      "grand-maitre",
      "performance-elo",
      "departage"
    ],
    "articles": [
      "syndrome-imposteur-aux-echecs"
    ]
  },
  {
    "letter": "E",
    "slug": "etat-de-flow",
    "title": "État de flow",
    "cat": "psycho",
    "def": "Expérience subjective d’absorption dans une activité, souvent associée à une attention soutenue et à une perception modifiée du temps. Elle ne garantit ni une partie sans erreur ni un niveau de performance précis.",
    "example": "Tu te sens absorbé par la partie et tu remarques moins ce qui se passe autour de l’échiquier.",
    "related": [
      "biais-cognitif",
      "fatigue-decisionnelle",
      "resilience"
    ],
    "articles": [
      "echecs-et-flow"
    ]
  },
  {
    "letter": "F",
    "slug": "fatigue-decisionnelle",
    "title": "Fatigue décisionnelle",
    "cat": "neuro",
    "def": "Expression utilisée pour décrire une baisse possible de qualité des choix après une succession de décisions. Fatigue, sommeil, durée de la tâche et difficulté doivent être distingués ; une réserve mentale unique qui se viderait n’est pas une explication suffisante.",
    "example": "Après une longue partie, tu constates que tu vérifies moins bien tes coups ; plusieurs facteurs peuvent y contribuer.",
    "related": [
      "biais-cognitif",
      "etat-de-flow",
      "resilience"
    ],
    "articles": [
      "echecs-stress-tournoi"
    ]
  },
  {
    "letter": "F",
    "slug": "finale",
    "title": "Finale",
    "cat": "echecs",
    "def": "Phase de la partie où il ne reste que peu de pièces sur l'échiquier, généralement après de nombreux échanges. Les finales demandent une technique précise, souvent très différente du jeu de milieu. La maîtrise des finales de pions et de tours est considérée comme fondamentale pour progresser.",
    "example": "Après l’échange des dames et de plusieurs pièces, les rois peuvent devenir des acteurs de premier plan.",
    "related": [
      "pions-doubles",
      "pion-arriere",
      "pion-passe"
    ],
    "articles": [
      "theorie-des-jeux-aux-echecs"
    ]
  },
  {
    "letter": "F",
    "slug": "fourchette",
    "title": "Fourchette",
    "cat": "echecs",
    "def": "Attaque simultanée de plusieurs cibles par une même pièce. Son efficacité dépend des possibilités de réponse ; une fourchette ne garantit pas automatiquement un gain.",
    "example": "Ton cavalier donne échec tout en attaquant une tour adverse.",
    "related": [
      "cloue",
      "declouage",
      "combinaison"
    ],
    "articles": [
      "theorie-des-jeux-aux-echecs"
    ]
  },
  {
    "letter": "G",
    "slug": "gambit",
    "title": "Gambit",
    "cat": "echecs",
    "def": "Offre de matériel, généralement un pion en ouverture, pour obtenir du développement, de l’espace ou de l’initiative. Selon la ligne, le matériel peut être repris et le jeu rester positionnel.",
    "example": "Dans le gambit du roi, les Blancs proposent le pion f après 1.e4 e5 2.f4.",
    "related": [
      "ouverture",
      "theorie-ouvertures",
      "trappe-ouverture"
    ],
    "articles": [
      "theorie-des-jeux-aux-echecs"
    ]
  },
  {
    "letter": "G",
    "slug": "grand-maitre",
    "title": "Grand Maître (GM)",
    "cat": "compet",
    "def": "Titre international attribué par la FIDE selon ses critères de titre et de performance. Le titre et le classement Elo sont deux informations différentes : le premier ne varie pas après chaque partie.",
    "example": "La mention « GM » devant le nom d’un joueur indique son titre, distinct de son classement du moment.",
    "related": [
      "elo"
    ],
    "articles": [
      "echecs-et-argent"
    ]
  },
  {
    "letter": "H",
    "slug": "hippocampe",
    "title": "Hippocampe",
    "cat": "neuro",
    "def": "Structure cérébrale participant notamment à la formation de souvenirs et au traitement d’informations spatiales. Son implication dans la mémoire ne démontre pas que pratiquer les échecs ferait grandir cette région.",
    "example": "Une étude sur la mémoire spatiale peut examiner l’hippocampe sans démontrer un effet propre aux échecs.",
    "related": [
      "neuroplasticite",
      "cortex-prefrontal",
      "dopamine"
    ],
    "articles": [
      "neuroplasticite-aux-echecs"
    ]
  },
  {
    "letter": "I",
    "slug": "initiative",
    "title": "Initiative",
    "cat": "echecs",
    "def": "Capacité à dicter le rythme de la partie en obligeant l'adversaire à réagir plutôt qu'à développer ses propres plans. Conserver l'initiative est souvent plus précieux que de gagner du matériel si cela revient à perdre ce dynamisme.",
    "example": "Tes menaces obligent ton adversaire à défendre plusieurs coups de suite.",
    "related": [
      "activite",
      "tempo",
      "plan"
    ],
    "articles": [
      "theorie-des-jeux-aux-echecs"
    ]
  },
  {
    "letter": "I",
    "slug": "intelligence-cristallisee",
    "title": "Intelligence cristallisée",
    "cat": "neuro",
    "def": "Connaissances et compétences acquises par l’expérience et l’apprentissage. Les connaissances échiquéennes en donnent une illustration ; une tâche réelle de jeu mobilise plusieurs capacités à la fois.",
    "example": "Tu reconnais un motif de finale appris auparavant, au lieu de le redécouvrir par le calcul.",
    "related": [
      "memoire-de-travail",
      "chunking",
      "memoire-procedurale"
    ],
    "articles": [
      "echecs-et-memoire"
    ]
  },
  {
    "letter": "J",
    "slug": "jeu-positionnel",
    "title": "Jeu positionnel",
    "cat": "echecs",
    "def": "Style fondé sur l'amélioration progressive de la structure et de la coordination des pièces, plutôt que sur les combinaisons tactiques immédiates. Le joueur positionnel cherche des avantages durables (cases faibles chez l'adversaire, paire de fous, pion passé) qu'il convertira méthodiquement.",
    "example": "Tu améliores la place d’un cavalier avant de lancer une action concrète.",
    "related": [
      "activite",
      "initiative",
      "tempo"
    ],
    "articles": [
      "theorie-des-jeux-aux-echecs"
    ]
  },
  {
    "letter": "M",
    "slug": "mat",
    "title": "Mat (Échec et mat)",
    "cat": "echecs",
    "def": "Situation finale où le roi est en échec et ne peut se soustraire par aucun coup légal. Le mat met immédiatement fin à la partie. C'est l'objectif ultime aux échecs, bien que la plupart des parties de haut niveau se terminent par abandon avant que le mat ne soit effectivement donné.",
    "example": "Le roi est attaqué et aucune capture, interposition ou fuite légale ne permet de le sauver.",
    "related": [
      "echec",
      "pat",
      "nul"
    ],
    "articles": [
      "theorie-des-jeux-aux-echecs"
    ],
    "source": {
      "label": "Règles du jeu · FIDE",
      "href": "https://handbook.fide.com/chapter/e012023"
    }
  },
  {
    "letter": "M",
    "slug": "memoire-de-travail",
    "title": "Mémoire de travail",
    "cat": "neuro",
    "def": "Ensemble de processus permettant de maintenir et de manipuler temporairement des informations utiles à une tâche. Sa capacité est limitée et dépend de la tâche et des connaissances ; elle ne se résume pas à sept éléments fixes.",
    "example": "Tu gardes une position future en tête pendant que tu compares deux réponses adverses.",
    "related": [
      "chunking",
      "memoire-procedurale",
      "intelligence-cristallisee"
    ],
    "articles": [
      "echecs-memoire-de-travail"
    ],
    "source": {
      "label": "Cowan, 2001 · capacité de la mémoire",
      "href": "https://pubmed.ncbi.nlm.nih.gov/11515286/"
    }
  },
  {
    "letter": "M",
    "slug": "memoire-procedurale",
    "title": "Mémoire procédurale",
    "cat": "neuro",
    "def": "Forme de mémoire à long terme liée à l’acquisition de savoir-faire et d’habiletés. Aux échecs, il faut la distinguer de la connaissance explicite des règles et de la reconnaissance de positions.",
    "example": "Un geste de manipulation des pièces devient familier à force de pratique ; connaître une ligne théorique n’est pas, à lui seul, un automatisme moteur.",
    "related": [
      "memoire-de-travail",
      "chunking",
      "intelligence-cristallisee"
    ],
    "articles": [
      "echecs-et-memoire"
    ]
  },
  {
    "letter": "M",
    "slug": "milieu-de-jeu",
    "title": "Milieu de jeu",
    "cat": "echecs",
    "def": "Phase qui suit l'ouverture, après le développement des pièces. C'est la phase la plus complexe et la plus créative : les plans stratégiques se confrontent, les attaques s'organisent. La transition entre l'ouverture et le milieu de jeu est souvent marquée par le roque.",
    "example": "Une fois tes pièces développées et ton roi à l’abri, tu choisis un plan contre la position adverse.",
    "related": [
      "ouverture",
      "gambit",
      "theorie-ouvertures"
    ],
    "articles": [
      "theorie-des-jeux-aux-echecs"
    ]
  },
  {
    "letter": "M",
    "slug": "miniature",
    "title": "Miniature",
    "cat": "echecs",
    "def": "Partie particulièrement courte, souvent définie dans les recueils par une limite d’environ 20 à 25 coups. Le seuil dépend de la convention utilisée ; le terme n’est pas un résultat officiel.",
    "example": "Une erreur d’ouverture peut conduire à une attaque décisive alors que peu de coups ont été joués.",
    "related": [
      "ouverture",
      "gambit",
      "theorie-ouvertures"
    ],
    "articles": [
      "theorie-des-jeux-aux-echecs"
    ]
  },
  {
    "letter": "N",
    "slug": "neuroplasticite",
    "title": "Neuroplasticité",
    "cat": "neuro",
    "def": "Capacité du système nerveux à se modifier au cours de l’expérience et de l’apprentissage. Des différences observées entre joueurs ne démontrent pas, à elles seules, une cause ni un bénéfice dans d’autres domaines.",
    "example": "Observer une différence entre experts et débutants ne suffit pas à montrer que les échecs l’ont causée.",
    "related": [
      "hippocampe",
      "cortex-prefrontal",
      "dopamine"
    ],
    "articles": [
      "neuroplasticite-aux-echecs"
    ],
    "source": {
      "label": "Étude chez des experts · Scientific Reports, 2020",
      "href": "https://www.nature.com/articles/s41598-020-63984-8"
    }
  },
  {
    "letter": "N",
    "slug": "notation-algebrique",
    "title": "Notation algébrique",
    "cat": "echecs",
    "def": "Système standard d'écriture des coups utilisant les lettres a-h pour les colonnes et les chiffres 1-8 pour les rangées. Exemple : e4 désigne le pion avancé sur e4, Cf3 le cavalier développé en f3. La notation algébrique est internationale et a remplacé les notations descriptives nationales.",
    "example": "« Cf3 » désigne un coup de cavalier vers f3 ; « O-O » note le petit roque.",
    "related": [
      "echec",
      "mat",
      "pat"
    ],
    "articles": [
      "theorie-des-jeux-aux-echecs"
    ]
  },
  {
    "letter": "N",
    "slug": "nul",
    "title": "Nul (Partie nulle)",
    "cat": "echecs",
    "def": "Résultat où les deux camps obtiennent chacun un demi-point. Le pat et les positions mortes sont des cas de fin de partie ; certaines répétitions et la règle des 50 coups nécessitent une réclamation, selon les conditions prévues par les règles.",
    "example": "Une position de pat met immédiatement fin à la partie sur un résultat nul.",
    "related": [
      "echec",
      "mat",
      "pat",
      "repetition-position"
    ],
    "articles": [
      "theorie-des-jeux-aux-echecs"
    ],
    "source": {
      "label": "Règles du jeu · FIDE",
      "href": "https://handbook.fide.com/chapter/e012023"
    }
  },
  {
    "letter": "O",
    "slug": "opposition",
    "title": "Opposition",
    "cat": "echecs",
    "def": "Rapport entre les rois, particulièrement utile en finale de pions. Dans l’opposition directe, ils se font face avec une case entre eux : le camp au trait doit céder cette disposition ou jouer ailleurs s’il le peut.",
    "example": "Avec les rois en e4 et e6, le camp au trait doit céder cette opposition directe en jouant ailleurs ou en déplaçant son roi.",
    "related": [
      "pions-doubles",
      "pion-arriere",
      "pion-passe"
    ],
    "articles": [
      "theorie-des-jeux-aux-echecs"
    ]
  },
  {
    "letter": "O",
    "slug": "ouverture",
    "title": "Ouverture",
    "cat": "echecs",
    "def": "Première phase de la partie (environ les 10 à 20 premiers coups) dont les objectifs sont : développer les pièces vers des cases actives, occuper le centre, mettre le roi en sécurité et éviter les faiblesses prématurées. Les ouvertures sont classifiées par l'Encyclopédie des Ouvertures d'Échecs (ECO) en codes de A00 à E99.",
    "example": "Tu développes tes pièces et prépares le roque pendant les premiers coups.",
    "related": [
      "gambit",
      "theorie-ouvertures",
      "trappe-ouverture"
    ],
    "articles": [
      "theorie-des-jeux-aux-echecs"
    ]
  },
  {
    "letter": "P",
    "slug": "pat",
    "title": "Pat",
    "cat": "echecs",
    "def": "Situation de partie nulle où le joueur dont c'est le tour n'est pas en échec, mais n'a aucun coup légal disponible. Le pat est une ressource de défense ultime que le camp perdant cherche parfois à provoquer. Il est l'une des subtilités les plus surprenantes pour les débutants.",
    "example": "Le roi n’est pas attaqué, mais son camp ne dispose d’aucun coup légal : la partie est nulle.",
    "related": [
      "echec",
      "mat",
      "nul"
    ],
    "articles": [
      "theorie-des-jeux-aux-echecs"
    ],
    "source": {
      "label": "Règles du jeu · FIDE",
      "href": "https://handbook.fide.com/chapter/e012023"
    }
  },
  {
    "letter": "P",
    "slug": "pion-arriere",
    "title": "Pion arriéré",
    "cat": "echecs",
    "def": "Pion qui ne peut plus avancer sans se mettre en danger et qui ne peut être soutenu par d'autres pions. Il constitue une faiblesse chronique, particulièrement sur une colonne semi-ouverte où l'adversaire exerce une pression avec ses tours.",
    "example": "Un pion resté derrière ses voisins peut devenir une cible si son avancée le ferait perdre.",
    "related": [
      "pions-doubles",
      "pion-passe",
      "structure-de-pions"
    ],
    "articles": [
      "theorie-des-jeux-aux-echecs"
    ]
  },
  {
    "letter": "P",
    "slug": "pion-passe",
    "title": "Pion passé",
    "cat": "echecs",
    "def": "Pion qui n'a plus de pions adverses sur sa colonne ni sur les colonnes adjacentes pouvant l'arrêter. Un pion passé avancé est souvent décisif en finale. Son avancement contraint l'adversaire à mobiliser des pièces pour le bloquer, créant des déséquilibres exploitables.",
    "example": "Un pion avancé n’a plus de pion adverse devant lui, ni sur les colonnes voisines, capable de bloquer sa route.",
    "related": [
      "pions-doubles",
      "pion-arriere",
      "structure-de-pions"
    ],
    "articles": [
      "theorie-des-jeux-aux-echecs"
    ]
  },
  {
    "letter": "P",
    "slug": "plan",
    "title": "Plan stratégique",
    "cat": "echecs",
    "def": "Séquence d'actions cohérentes visant à améliorer la position sur plusieurs coups. Un bon plan se base sur l'évaluation de la position, fixe un objectif concret et mobilise les pièces dans ce sens. Jouer sans plan conduit au jeu « coup par coup », superficiel et réactif.",
    "example": "Tu doubles tes tours sur une colonne ouverte pour attaquer une faiblesse.",
    "related": [
      "activite",
      "initiative",
      "tempo"
    ],
    "articles": [
      "theorie-des-jeux-aux-echecs"
    ]
  },
  {
    "letter": "P",
    "slug": "promotion",
    "title": "Promotion de pion",
    "cat": "echecs",
    "def": "Quand un pion atteint la dernière rangée, il est remplacé par une dame, une tour, un fou ou un cavalier de sa couleur. Le choix ne dépend pas des pièces déjà capturées.",
    "example": "Un pion arrivé sur la dernière rangée peut devenir un cavalier si cette promotion donne un échec utile.",
    "related": [
      "echec",
      "mat",
      "pat"
    ],
    "articles": [
      "theorie-des-jeux-aux-echecs"
    ],
    "source": {
      "label": "Règles du jeu · FIDE",
      "href": "https://handbook.fide.com/chapter/e012023"
    }
  },
  {
    "letter": "P",
    "slug": "prophylaxie",
    "title": "Prophylaxie",
    "cat": "echecs",
    "def": "Principe de prévention consistant à anticiper et neutraliser les plans de l'adversaire avant qu'ils ne se développent. Terme popularisé par Tigran Petrossian. Le joueur prophylactique joue des coups en apparence passifs mais qui privent l'adversaire de ses ressources actives.",
    "example": "Tu empêches l’installation d’un cavalier adverse avant de poursuivre ton propre plan.",
    "related": [
      "activite",
      "initiative",
      "tempo"
    ],
    "articles": [
      "theorie-des-jeux-aux-echecs"
    ]
  },
  {
    "letter": "R",
    "slug": "resilience",
    "title": "Résilience",
    "cat": "psycho",
    "def": "Capacité à retrouver un fonctionnement et à s’adapter après une difficulté. Une réaction à une défaite ne suffit pas à définir la résilience d’une personne ; le contexte et le temps comptent.",
    "example": "Après une défaite, tu prends le temps de récupérer puis d’examiner la partie.",
    "related": [
      "biais-cognitif",
      "etat-de-flow",
      "fatigue-decisionnelle"
    ],
    "articles": [
      "echecs-et-resilience"
    ]
  },
  {
    "letter": "R",
    "slug": "roque",
    "title": "Roque",
    "cat": "echecs",
    "def": "Coup combinant le déplacement du roi et d’une tour. Il exige notamment qu’ils n’aient pas encore bougé, que les cases intermédiaires soient libres et que le roi ne soit pas en échec, ne traverse pas et n’atteigne pas une case attaquée.",
    "example": "Au petit roque blanc, le roi passe de e1 à g1 et la tour de h1 à f1, si toutes les conditions sont réunies.",
    "related": [
      "echec",
      "mat",
      "pat",
      "repetition-position"
    ],
    "articles": [
      "theorie-des-jeux-aux-echecs"
    ],
    "source": {
      "label": "Règles du jeu · FIDE",
      "href": "https://handbook.fide.com/chapter/e012023"
    }
  },
  {
    "letter": "S",
    "slug": "sacrifice",
    "title": "Sacrifice",
    "cat": "echecs",
    "def": "Offre volontaire de matériel en échange d’une compensation recherchée : initiative, attaque, avantages positionnels ou gain ultérieur. La compensation peut être suffisante ou non.",
    "example": "Tu offres un fou pour ouvrir les lignes vers le roi adverse.",
    "related": [
      "cloue",
      "declouage",
      "fourchette"
    ],
    "articles": [
      "theorie-des-jeux-aux-echecs"
    ]
  },
  {
    "letter": "S",
    "slug": "strategie",
    "title": "Stratégie",
    "cat": "echecs",
    "def": "Plan à long terme visant à améliorer la structure et la coordination des pièces. La stratégie concerne les objectifs généraux (centralisation, pression sur une faiblesse, création de pion passé) tandis que la tactique traite des moyens immédiats et forcés. Un bon joueur harmonise constamment les deux dimensions.",
    "example": "Tu prépares une avancée de pions à l’aile dame sur plusieurs coups.",
    "related": [
      "activite",
      "initiative",
      "tempo"
    ],
    "articles": [
      "theorie-des-jeux-aux-echecs"
    ]
  },
  {
    "letter": "S",
    "slug": "structure-de-pions",
    "title": "Structure de pions",
    "cat": "echecs",
    "def": "Disposition des pions sur l'échiquier, squelette de la position qui évolue peu rapidement. Elle détermine les plans disponibles pour chaque camp : faiblesses (isolés, doublés, arriérés), points d'ancrage, colonnes ouvertes. Comprendre les structures types est une clé majeure pour progresser.",
    "example": "Une chaîne de pions fixe des zones d’espace et des cases que les pièces peuvent utiliser.",
    "related": [
      "pions-doubles",
      "pion-arriere",
      "pion-passe"
    ],
    "articles": [
      "theorie-des-jeux-aux-echecs"
    ]
  },
  {
    "letter": "T",
    "slug": "tactique",
    "title": "Tactique",
    "cat": "echecs",
    "def": "Calcul de séquences forcées à court terme exploitant des motifs concrets : fourchette, clouage, attaque à la découverte, sacrifice de mat… La tactique opère là où la logique et le calcul prévalent sur l'évaluation subjective. L'entraînement par les problèmes est l'une des méthodes les plus efficaces pour progresser.",
    "example": "Tu repères une fourchette qui gagne une pièce dans une variante forcée.",
    "related": [
      "cloue",
      "declouage",
      "fourchette"
    ],
    "articles": [
      "theorie-des-jeux-aux-echecs"
    ]
  },
  {
    "letter": "T",
    "slug": "tempo",
    "title": "Tempo",
    "cat": "echecs",
    "def": "Unité de temps aux échecs, équivalant à un coup. Gagner un tempo signifie obliger l'adversaire à jouer un coup non souhaité. Perdre un tempo revient à faire en deux coups ce qui aurait pu être fait en un. En ouverture, chaque tempo perdu est un avantage offert à l'adversaire.",
    "example": "En attaquant une dame avec une pièce que tu développes, tu peux obliger ton adversaire à déplacer sa dame.",
    "related": [
      "activite",
      "initiative",
      "plan"
    ],
    "articles": [
      "theorie-des-jeux-aux-echecs"
    ]
  },
  {
    "letter": "T",
    "slug": "theorie-ouvertures",
    "title": "Théorie des ouvertures",
    "cat": "echecs",
    "def": "Corps de connaissances sur les séquences de coups des premières phases de jeu, classifiées par des générations de joueurs et d'ordinateurs. La théorie peut s'étendre jusqu'au coup 30 dans les variantes très analysées. Son apprentissage est nécessaire mais ne doit pas se substituer à la compréhension des idées sous-jacentes.",
    "example": "Tu étudies les idées d’une ligne connue pour comprendre les coups, au-delà de leur ordre.",
    "related": [
      "ouverture",
      "gambit",
      "trappe-ouverture"
    ],
    "articles": [
      "theorie-des-jeux-aux-echecs"
    ]
  },
  {
    "letter": "T",
    "slug": "trappe-ouverture",
    "title": "Trappe d'ouverture",
    "cat": "echecs",
    "def": "Piège tendu dans les premières phases : une séquence qui semble correcte mais conduit l'adversaire vers une position désastreuse s'il ne connaît pas la réfutation. Les trappes sont fréquentes dans les variantes secondaires des ouvertures et redoutables contre des joueurs inexpérimentés.",
    "example": "Un pion paraît gratuit en ouverture, mais sa capture permet une attaque concrète sur le roi.",
    "related": [
      "ouverture",
      "gambit",
      "theorie-ouvertures"
    ],
    "articles": [
      "theorie-des-jeux-aux-echecs"
    ]
  },
  {
    "letter": "V",
    "slug": "variante",
    "title": "Variante",
    "cat": "echecs",
    "def": "Branche spécifique d'une ouverture ou d'une analyse, issue d'une séquence de coups particulière. Chaque ouverture contient de nombreuses variantes selon les choix des deux joueurs. En analyse de partie, les variantes représentent les lignes alternatives que les joueurs auraient pu jouer.",
    "example": "À partir d’une position donnée, tu compares la réponse ...e5 avec la réponse ...c5.",
    "related": [
      "ouverture",
      "gambit",
      "theorie-ouvertures"
    ],
    "articles": [
      "theorie-des-jeux-aux-echecs"
    ]
  },
  {
    "letter": "V",
    "slug": "visualisation",
    "title": "Visualisation mentale",
    "cat": "neuro",
    "def": "Capacité à se représenter des positions et des déplacements sans modifier l’échiquier. Elle s’appuie sur l’attention, les connaissances et la mémoire ; sa qualité dépend aussi de la difficulté de la position.",
    "example": "Tu imagines la position après un échange sans toucher les pièces.",
    "related": [
      "memoire-de-travail",
      "chunking",
      "memoire-procedurale"
    ],
    "articles": [
      "echecs-et-visualisation"
    ]
  },
  {
    "letter": "Z",
    "slug": "zeitnot",
    "title": "Zeitnot",
    "cat": "compet",
    "def": "Situation de forte pression temporelle à la pendule. Le peu de temps disponible peut compliquer le calcul et les vérifications, sans expliquer automatiquement chaque erreur.",
    "example": "Il te reste quelques secondes à la pendule et plusieurs décisions à prendre.",
    "related": [
      "biais-cognitif",
      "etat-de-flow",
      "fatigue-decisionnelle",
      "cadence",
      "increment"
    ],
    "articles": [
      "echecs-gestion-du-temps"
    ]
  },
  {
    "letter": "Z",
    "slug": "zugzwang",
    "title": "Zugzwang",
    "cat": "echecs",
    "def": "Situation paradoxale où tout coup disponible détériore la position du joueur qui doit jouer. Du mot allemand signifiant « contrainte de bouger ». Le zugzwang est rare en milieu de jeu mais fréquent en finale. Un joueur en zugzwang « préférerait » ne pas jouer, ce qui est impossible aux échecs.",
    "example": "Dans une finale, tu préférerais passer ton tour, car chaque coup légal abandonne une case essentielle.",
    "related": [
      "pions-doubles",
      "pion-arriere",
      "pion-passe"
    ],
    "articles": [
      "theorie-des-jeux-aux-echecs"
    ]
  },
  {
    "letter": "A",
    "slug": "avantage-materiel",
    "title": "Avantage matériel",
    "cat": "echecs",
    "def": "Supériorité dans la quantité ou la valeur des pièces et pions disponibles. Elle se distingue de l’activité des pièces et ne garantit pas la victoire.",
    "example": "Exemple pédagogique : une tour contre un fou, à matériel identique par ailleurs, constitue généralement un avantage matériel.",
    "related": [
      "avantage-positionnel",
      "sacrifice",
      "finale"
    ],
    "articles": [
      "theorie-des-jeux-aux-echecs"
    ]
  },
  {
    "letter": "C",
    "slug": "coup-candidat",
    "title": "Coup candidat",
    "cat": "echecs",
    "def": "Coup retenu pour être examiné avant de choisir. Comparer plusieurs candidats évite de confondre la première idée plausible avec la meilleure décision.",
    "example": "Conseil proposé : compare une menace directe, un coup défensif et une amélioration de pièce avant de calculer plus loin.",
    "related": [
      "calcul-variantes",
      "intuition",
      "plan"
    ],
    "articles": [
      "analyser-ses-parties",
      "minimax-aux-echecs"
    ],
    "source": {
      "label": "Kahneman et Klein, 2009",
      "href": "https://bear.warrington.ufl.edu/brenner/mar7588/Papers/kahneman-klein-2009.pdf"
    }
  },
  {
    "letter": "C",
    "slug": "coup-intermediaire",
    "title": "Coup intermédiaire (Zwischenzug)",
    "cat": "echecs",
    "def": "Coup inséré avant la réponse attendue, souvent une reprise, afin de créer une menace qui change la suite de la variante.",
    "example": "Exemple pédagogique : avant de reprendre une pièce, tu donnes un échec qui oblige l’adversaire à répondre.",
    "related": [
      "combinaison",
      "calcul-variantes",
      "enfilade"
    ],
    "articles": [
      "theorie-des-jeux-aux-echecs"
    ],
    "source": {
      "label": "Thèmes tactiques · Lichess",
      "href": "https://lichess.org/practice"
    }
  },
  {
    "letter": "E",
    "slug": "enfilade",
    "title": "Enfilade",
    "cat": "echecs",
    "def": "Attaque alignant deux cibles : le déplacement de celle située devant permet d’atteindre celle placée derrière. À distinguer du clouage, qui gêne le déplacement de la première pièce.",
    "example": "Exemple pédagogique : une tour attaque un roi placé devant sa dame sur une colonne ; le départ du roi peut permettre la capture de la dame.",
    "related": [
      "cloue",
      "echec-decouverte",
      "tactique"
    ],
    "articles": [
      "theorie-des-jeux-aux-echecs"
    ],
    "source": {
      "label": "Thèmes tactiques · Lichess",
      "href": "https://lichess.org/practice"
    }
  },
  {
    "letter": "E",
    "slug": "echec-decouverte",
    "title": "Échec à la découverte",
    "cat": "echecs",
    "def": "Échec produit par une pièce à longue portée lorsque le déplacement d’une autre pièce libère sa ligne d’attaque sur le roi.",
    "example": "Exemple pédagogique : un fou quitte la colonne e et découvre l’attaque d’une tour sur le roi adverse.",
    "related": [
      "echec",
      "combinaison",
      "enfilade"
    ],
    "articles": [
      "theorie-des-jeux-aux-echecs"
    ],
    "source": {
      "label": "Thèmes tactiques · Lichess",
      "href": "https://lichess.org/practice"
    }
  },
  {
    "letter": "P",
    "slug": "prise-en-passant",
    "title": "Prise en passant",
    "cat": "echecs",
    "def": "Prise spéciale d’un pion venant d’avancer de deux cases, comme s’il n’en avait avancé qu’une. Elle n’est possible qu’au coup suivant et doit laisser son roi en sécurité.",
    "example": "Exemple pédagogique : après ...d7-d5, un pion blanc en e5 peut jouer exd6 en passant si cette prise est légale.",
    "related": [
      "promotion",
      "structure-de-pions",
      "notation-algebrique"
    ],
    "articles": [
      "theorie-des-jeux-aux-echecs"
    ],
    "source": {
      "label": "Lois des échecs · FIDE",
      "href": "https://handbook.fide.com/chapter/e012023"
    }
  },
  {
    "letter": "R",
    "slug": "repetition-position",
    "title": "Répétition de position",
    "cat": "echecs",
    "def": "Retour d’une même position, avec le même joueur au trait et les mêmes possibilités de jeu. La troisième occurrence permet une réclamation de nulle ; la cinquième rend la partie nulle.",
    "example": "Exemple pédagogique : répéter les mêmes déplacements ne suffit pas si le droit de roquer a changé entre les positions.",
    "related": [
      "nul",
      "roque",
      "prise-en-passant"
    ],
    "articles": [
      "theorie-des-jeux-aux-echecs"
    ],
    "source": {
      "label": "Lois des échecs · FIDE",
      "href": "https://handbook.fide.com/chapter/e012023"
    }
  },
  {
    "letter": "I",
    "slug": "increment",
    "title": "Incrément",
    "cat": "compet",
    "def": "Temps ajouté à la pendule à chaque coup selon la cadence prévue. Il se distingue du délai, pendant lequel le temps principal ne commence pas encore à diminuer.",
    "example": "Exemple pédagogique : dans une cadence 3 min + 2 s, chaque joueur reçoit deux secondes supplémentaires par coup.",
    "related": [
      "cadence",
      "zeitnot",
      "tempo"
    ],
    "articles": [
      "echecs-gestion-du-temps"
    ],
    "source": {
      "label": "Lois des échecs · FIDE",
      "href": "https://handbook.fide.com/chapter/e012023"
    },
    "dissertations": [
      "la-victoire-aux-echecs-justifie-t-elle-tous-les-moyens"
    ]
  },
  {
    "letter": "I",
    "slug": "information-parfaite",
    "title": "Information parfaite",
    "cat": "echecs",
    "def": "Propriété d’un jeu où, au moment de décider, les actions antérieures ne sont pas cachées. Elle ne signifie ni connaître les intentions adverses ni pouvoir calculer toutes les conséquences.",
    "example": "Aux échecs, tu vois la position et les coups joués sans savoir quelle variante ton adversaire prépare.",
    "related": [
      "calcul-variantes",
      "intuition",
      "strategie"
    ],
    "articles": [
      "theorie-des-jeux-aux-echecs"
    ],
    "source": {
      "label": "Théorie des jeux · Stanford Encyclopedia",
      "href": "https://plato.stanford.edu/entries/game-theory/"
    },
    "dissertations": [
      "echecs-et-investissement",
      "la-victoire-aux-echecs-justifie-t-elle-tous-les-moyens"
    ]
  },
  {
    "letter": "C",
    "slug": "cadence",
    "title": "Cadence de jeu",
    "cat": "compet",
    "def": "Organisation du temps de réflexion : durée initiale, éventuels contrôles de temps et ajout par coup. Elle fait partie des conditions de la partie.",
    "example": "Exemple pédagogique : 10 min sans ajout et 10 min + 5 s sont deux cadences différentes.",
    "related": [
      "increment",
      "zeitnot",
      "fatigue-decisionnelle"
    ],
    "articles": [
      "echecs-gestion-du-temps"
    ],
    "source": {
      "label": "Lois des échecs · FIDE",
      "href": "https://handbook.fide.com/chapter/e012023"
    },
    "dissertations": [
      "la-victoire-aux-echecs-justifie-t-elle-tous-les-moyens"
    ]
  },
  {
    "letter": "D",
    "slug": "departage",
    "title": "Départage",
    "cat": "compet",
    "def": "Critère prévu pour classer des participants ayant le même score. Son choix et son ordre d’application dépendent du règlement de la compétition.",
    "example": "Exemple pédagogique : deux joueurs à 5 points peuvent être départagés par un critère tenant compte des scores de leurs adversaires.",
    "related": [
      "elo",
      "performance-elo",
      "cadence"
    ],
    "articles": [
      "echecs-et-argent"
    ],
    "source": {
      "label": "Départages et performance · FIDE, 2026",
      "href": "https://handbook.fide.com/chapter/TieBreakRegulations032026"
    }
  },
  {
    "letter": "P",
    "slug": "performance-elo",
    "title": "Performance Elo",
    "cat": "compet",
    "def": "Estimation associée aux résultats d’un ensemble de parties et au classement des adversaires, selon la méthode retenue. Elle ne se confond pas avec le classement personnel du joueur.",
    "example": "Exemple pédagogique : une bonne performance sur un tournoi ne remplace pas immédiatement ton classement Elo.",
    "related": [
      "elo",
      "grand-maitre",
      "departage"
    ],
    "articles": [
      "comparaison-sociale-aux-echecs"
    ],
    "source": {
      "label": "Départages et performance · FIDE, 2026",
      "href": "https://handbook.fide.com/chapter/TieBreakRegulations032026"
    }
  },
  {
    "letter": "L",
    "slug": "loyaute",
    "title": "Loyauté sportive",
    "cat": "compet",
    "def": "Respect des règles communes et des conditions de l’affrontement. Exploiter une erreur adverse est compatible avec la loyauté ; recevoir une aide interdite ne l’est pas.",
    "example": "Exemple pédagogique : une préparation mémorisée avant la partie se distingue d’une recommandation reçue clandestinement pendant celle-ci.",
    "related": [
      "information-parfaite",
      "cadence",
      "egalite-formelle"
    ],
    "articles": [
      "theorie-des-jeux-aux-echecs"
    ],
    "source": {
      "label": "Lois des échecs · FIDE",
      "href": "https://handbook.fide.com/chapter/e012023"
    },
    "dissertations": [
      "la-victoire-aux-echecs-justifie-t-elle-tous-les-moyens"
    ]
  },
  {
    "letter": "E",
    "slug": "egalite-formelle",
    "title": "Égalité formelle",
    "cat": "compet",
    "def": "Application de règles communes et de critères identiques aux situations comparables. Elle n’implique pas que tous disposent des mêmes ressources pour apprendre ou s’entraîner.",
    "example": "Exemple pédagogique : deux joueurs respectent les mêmes règles de déplacement, même si un seul bénéficie de cours réguliers.",
    "related": [
      "egalite-chances",
      "equite",
      "loyaute"
    ],
    "articles": [],
    "source": {
      "label": "Égalité · Stanford Encyclopedia",
      "href": "https://plato.stanford.edu/entries/equality/"
    },
    "dissertations": [
      "les-echecs-sont-ils-reellement-un-jeu-egalitaire"
    ]
  },
  {
    "letter": "E",
    "slug": "egalite-chances",
    "title": "Égalité des chances",
    "cat": "compet",
    "def": "Exigence portant sur les possibilités réelles d’accéder à une activité et d’y progresser. Elle se distingue de l’identité des résultats et de la seule ouverture réglementaire.",
    "example": "Exemple pédagogique : une aide au déplacement peut faciliter l’accès à un tournoi sans garantir de victoire.",
    "related": [
      "egalite-formelle",
      "equite",
      "elo"
    ],
    "articles": [],
    "source": {
      "label": "Égalité · Stanford Encyclopedia",
      "href": "https://plato.stanford.edu/entries/equality/"
    },
    "dissertations": [
      "les-echecs-sont-ils-reellement-un-jeu-egalitaire"
    ]
  },
  {
    "letter": "E",
    "slug": "equite",
    "title": "Équité",
    "cat": "compet",
    "def": "Recherche de conditions de participation justes, pouvant tenir compte de différences de situation. Un aménagement compensant un obstacle ne constitue pas nécessairement un avantage injuste.",
    "example": "Exemple pédagogique : un échiquier adapté peut permettre à une personne malvoyante de participer à la compétition.",
    "related": [
      "egalite-formelle",
      "egalite-chances",
      "loyaute"
    ],
    "articles": [],
    "source": {
      "label": "Accessibilité du jeu · FIDE, annexe D",
      "href": "https://handbook.fide.com/chapter/e012023"
    },
    "dissertations": [
      "les-echecs-sont-ils-reellement-un-jeu-egalitaire"
    ]
  },
  {
    "letter": "A",
    "slug": "aversion-perte",
    "title": "Aversion à la perte",
    "cat": "psycho",
    "def": "Tendance à accorder plus de poids à une perte qu’à un gain comparable, relativement à un point de référence. Elle ne se confond pas avec toute prudence face au risque.",
    "example": "Exemple pédagogique : la perte d’un point Elo peut peser davantage dans ton jugement qu’un gain de même taille.",
    "related": [
      "biais-cognitif",
      "effet-disposition",
      "couts-irrecuperables"
    ],
    "articles": [
      "aversion-a-la-perte-aux-echecs"
    ],
    "source": {
      "label": "Kahneman et Tversky, 1979",
      "href": "https://web.mit.edu/curhan/www/docs/Articles/15341_Readings/Behavioral_Decision_Theory/Kahneman_Tversky_1979_Prospect_theory.pdf"
    },
    "dissertations": [
      "echecs-et-investissement",
      "faut-il-apprendre-a-perdre-pour-devenir-meilleur-aux-echecs"
    ]
  },
  {
    "letter": "B",
    "slug": "biais-confirmation",
    "title": "Biais de confirmation",
    "cat": "psycho",
    "def": "Tendance à chercher ou interpréter les informations de manière favorable à une croyance déjà présente. Elle peut concerner le choix des variantes que l’on examine.",
    "example": "Exemple pédagogique : tu calcules les réponses qui favorisent ton attaque et laisses de côté une défense qui la contredit.",
    "related": [
      "biais-cognitif",
      "biais-ancrage",
      "coup-candidat"
    ],
    "articles": [
      "biais-de-confirmation-aux-echecs"
    ],
    "source": {
      "label": "Nickerson, 1998 · résumé",
      "href": "https://journals.sagepub.com/doi/abs/10.1037/1089-2680.2.2.175"
    },
    "dissertations": [
      "faut-il-apprendre-a-perdre-pour-devenir-meilleur-aux-echecs"
    ]
  },
  {
    "letter": "B",
    "slug": "biais-ancrage",
    "title": "Biais d’ancrage",
    "cat": "psycho",
    "def": "Influence excessive d’une valeur ou d’une information initiale sur une estimation ultérieure, lorsque l’ajustement reste insuffisant. Toute persistance d’une opinion n’est pas nécessairement un ancrage.",
    "example": "Exemple pédagogique : une première estimation très favorable continue d’orienter ton jugement après une réponse adverse qui exige de réévaluer la position.",
    "related": [
      "biais-cognitif",
      "biais-confirmation",
      "metacognition"
    ],
    "articles": [
      "biais-d-ancrage-aux-echecs"
    ],
    "source": {
      "label": "Tversky et Kahneman, 1974 · résumé",
      "href": "https://pubmed.ncbi.nlm.nih.gov/17835457/"
    }
  },
  {
    "letter": "E",
    "slug": "effet-disposition",
    "title": "Effet de disposition",
    "cat": "psycho",
    "def": "Tendance observée en finance à réaliser les gains plus volontiers que les pertes. Son étude ne démontre pas que la pratique des échecs en protège.",
    "example": "Exemple fictif en finance : céder un placement gagnant tout en conservant un placement perdant uniquement pour éviter de reconnaître sa perte.",
    "related": [
      "aversion-perte",
      "couts-irrecuperables",
      "transfert-apprentissage"
    ],
    "articles": [],
    "source": {
      "label": "Odean, 1998",
      "href": "https://faculty.haas.berkeley.edu/odean/papers%20current%20versions/areinvestorsreluctant.pdf"
    },
    "dissertations": [
      "echecs-et-investissement"
    ]
  },
  {
    "letter": "C",
    "slug": "couts-irrecuperables",
    "title": "Coûts irrécupérables",
    "cat": "psycho",
    "def": "Temps, effort ou ressources déjà engagés qui ne peuvent être récupérés. Le biais consiste à poursuivre surtout pour justifier ces dépenses passées, au lieu d’examiner les perspectives actuelles.",
    "example": "Exemple pédagogique : maintenir une attaque devenue inefficace uniquement parce que tu as déjà consacré plusieurs coups à sa préparation.",
    "related": [
      "effet-disposition",
      "biais-confirmation",
      "plan"
    ],
    "articles": [
      "pourquoi-ton-cerveau-prefere-avoir-raison"
    ],
    "source": {
      "label": "Arkes et Blumer, 1985",
      "href": "https://cognition.aau.at/bg/BA/Arkes%20%26%20Blumer%201985.pdf"
    },
    "dissertations": [
      "echecs-et-investissement"
    ]
  },
  {
    "letter": "I",
    "slug": "intuition",
    "title": "Intuition",
    "cat": "psycho",
    "def": "Jugement qui apparaît sans déroulement conscient de toutes les étapes du raisonnement. L’expérience peut nourrir une intuition pertinente, mais le sentiment de certitude ne garantit pas sa justesse.",
    "example": "Exemple pédagogique : un motif familier te suggère un sacrifice ; tu vérifies ensuite si les défenses concrètes le réfutent.",
    "related": [
      "chunking",
      "calcul-variantes",
      "coup-candidat"
    ],
    "articles": [
      "echecs-vs-philosophie-pensee-strategique"
    ],
    "source": {
      "label": "Kahneman et Klein, 2009",
      "href": "https://bear.warrington.ufl.edu/brenner/mar7588/Papers/kahneman-klein-2009.pdf"
    }
  },
  {
    "letter": "M",
    "slug": "metacognition",
    "title": "Métacognition",
    "cat": "psycho",
    "def": "Connaissance et suivi de ses propres processus de pensée : repérer ce que l’on comprend, ce qui manque et les stratégies que l’on utilise. Elle peut elle-même être imparfaite.",
    "example": "Conseil proposé : après une erreur, distingue une menace non repérée d’une variante repérée mais mal calculée.",
    "related": [
      "memoire-de-travail",
      "biais-confirmation",
      "intuition"
    ],
    "articles": [
      "analyser-ses-parties"
    ],
    "source": {
      "label": "Flavell, 1979",
      "href": "https://www.neurodyspaca.org/IMG/pdf/flavell_-_1979_-_metacognition_and_cognitive_monitoring.pdf"
    },
    "dissertations": [
      "faut-il-apprendre-a-perdre-pour-devenir-meilleur-aux-echecs"
    ]
  },
  {
    "letter": "T",
    "slug": "transfert-apprentissage",
    "title": "Transfert d’apprentissage",
    "cat": "psycho",
    "def": "Utilisation d’un acquis dans une autre tâche ou un autre domaine. Une ressemblance entre activités ne suffit pas à démontrer un transfert, surtout lorsqu’elles sont éloignées.",
    "example": "Exemple pédagogique : mieux calculer aux échecs ne prouve pas, à lui seul, une meilleure capacité à évaluer un investissement.",
    "related": [
      "correlation",
      "causalite",
      "metacognition"
    ],
    "articles": [
      "les-echecs-rendent-ils-plus-intelligent"
    ],
    "source": {
      "label": "Sala et Gobet, 2017",
      "href": "https://journals.sagepub.com/doi/10.1177/0963721417712760"
    },
    "dissertations": [
      "echecs-et-investissement",
      "faut-il-apprendre-a-perdre-pour-devenir-meilleur-aux-echecs"
    ]
  },
  {
    "letter": "C",
    "slug": "correlation",
    "title": "Corrélation",
    "cat": "psycho",
    "def": "Association statistique entre des variables. Elle ne suffit pas à établir que l’une provoque l’autre : d’autres facteurs ou une causalité inverse peuvent expliquer l’association.",
    "example": "Exemple fictif : si des joueurs plus expérimentés ont de meilleurs scores à un test, cette observation seule ne prouve pas un effet de l’entraînement.",
    "related": [
      "causalite",
      "transfert-apprentissage",
      "biais-cognitif"
    ],
    "articles": [
      "les-echecs-rendent-ils-plus-intelligent"
    ],
    "source": {
      "label": "Hernán et Robins · Causal Inference: What If",
      "href": "https://miguelhernan.org/whatifbook"
    },
    "dissertations": [
      "echecs-et-investissement"
    ]
  },
  {
    "letter": "C",
    "slug": "causalite",
    "title": "Causalité",
    "cat": "psycho",
    "def": "Relation dans laquelle une modification d’un facteur contribue à produire une modification d’un résultat. Identifier un effet causal demande de comparer des situations de façon à écarter les explications concurrentes.",
    "example": "Exemple pédagogique : comparer un entraînement échiquéen à une activité témoin aide à distinguer son effet de celui du temps consacré à apprendre.",
    "related": [
      "correlation",
      "transfert-apprentissage",
      "metacognition"
    ],
    "articles": [
      "les-echecs-rendent-ils-plus-intelligent"
    ],
    "source": {
      "label": "Hernán et Robins · Causal Inference: What If",
      "href": "https://miguelhernan.org/whatifbook"
    },
    "dissertations": [
      "echecs-et-investissement"
    ]
  }
];
