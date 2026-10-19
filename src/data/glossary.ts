export type GlossaryCategory = "echecs" | "neuro" | "psycho" | "compet";
export interface GlossaryTerm { letter:string; slug:string; title:string; cat:GlossaryCategory; def:string; example:string; related:string[]; articles:string[]; source?:{label:string;href:string}; }
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
      "resilience"
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
      "memoire-procedurale"
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
      "grand-maitre"
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
      "fatigue-decisionnelle"
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
  }
];
