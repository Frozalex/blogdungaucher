import type { CategorySlug } from "./site";

/** Contenus éditoriaux étendus pour les pages pilier Science / Esprit / Société (FR / EN / DE). */
export type CategoryLandingRich = {
  lede: string;
  cards: Array<{ title: string; body: string }>;
};

export const categoryLandingRich: Partial<
  Record<CategorySlug, Record<"fr" | "en" | "de", CategoryLandingRich>>
> = {
  science: {
    fr: {
      lede:
        "Ici, on relie ce que la recherche observe vraiment à ce que tu vis sur l’échiquier : mémoire des motifs, charge attentionnelle, fatigue décisionnelle, effets de l’entraînement. L’objectif n’est pas de brandir des études comme des totems, mais de rendre lisibles des mécanismes — pour mieux t’orienter dans tes priorités d’entraînement et éviter les neuromythes les plus répandus.",
      cards: [
        {
          title: "Cognition & mémoire",
          body:
            "Chunks, rappel visuel, experts contre novices : comprendre comment la position est « vue » aide à travailler plus intelligemment (pas seulement plus longtemps).",
        },
        {
          title: "Décision & attention",
          body:
            "Temps, zeitnot, double tâche implicite : les échecs sont un laboratoire naturel pour parler de jugement sous contrainte — sans confondre intuition et approximation.",
        },
        {
          title: "Neuroplasticité & mesure",
          body:
            "Imagerie, études longitudinales, limites méthodologiques : ce que la science peut dire — et ce qu’elle ne peut pas encore — sur un cerveau entraîné aux échecs.",
        },
      ],
    },
    en: {
      lede:
        "Here we connect what research actually measures with what you feel at the board: pattern memory, attentional load, decision fatigue, training effects. The goal isn’t to wield papers like trophies, but to make mechanisms readable — so you can prioritize practice and steer clear of the most popular neuromyths.",
      cards: [
        {
          title: "Cognition & memory",
          body:
            "Chunks, visual recall, experts vs beginners: understanding how a position is “seen” helps you train smarter, not just longer.",
        },
        {
          title: "Decision-making & attention",
          body:
            "Time trouble, implicit multitasking: chess is a natural lab for judgment under constraint — without confusing intuition with guesswork.",
        },
        {
          title: "Neuroplasticity & measurement",
          body:
            "Imaging, longitudinal work, methodological limits: what science can — and still can’t — say about a chess-trained brain.",
        },
      ],
    },
    de: {
      lede:
        "Hier verbinden wir messbare Befunde mit dem, was du am Brett erlebst: Mustergedächtnis, Aufmerksamkeitslast, Entscheidungsmüdigkeit, Trainingseffekte. Es geht nicht darum, Studien wie Trophäen zu schwenken, sondern Mechanismen lesbar zu machen — damit du Prioritäten setzen und verbreiteten Neuromythen aus dem Weg gehen kannst.",
      cards: [
        {
          title: "Kognition & Gedächtnis",
          body:
            "Chunks, visuelles Abrufen, Experten vs. Anfänger: Wie eine Stellung „gesehen“ wird, entscheidet, ob du kluger trainierst — nicht nur länger.",
        },
        {
          title: "Entscheidung & Aufmerksamkeit",
          body:
            "Zeitnot, implizite Mehrfachbelastung: Schach ist ein natürliches Labor für Urteil unter Druck — ohne Intuition mit Bauchgefühl zu verwechseln.",
        },
        {
          title: "Neuroplastizität & Messung",
          body:
            "Bildgebung, Längsschnitte, methodische Grenzen: Was die Wissenschaft über ein schachtrainiertes Gehirn sagen kann — und was noch nicht.",
        },
      ],
    },
  },

  esprit: {
    fr: {
      lede:
        "La partie ne se joue pas uniquement dans les variantes : elle se joue aussi dans la gestion de l’incertitude, de l’ego, de la peur de perdre ou parfois de gagner. Cette rubrique creuse le mental compétitif avec des angles honnêtes — anxiété de performance, discipline attentionnelle, régulation émotionnelle — pour des idées actionnables plutôt que des slogans.",
      cards: [
        {
          title: "Pression & émotions",
          body:
            "Ce qui monte en zeitnot, après une erreur, ou quand le classement devient une identité : nommer pour mieux dédramatiser.",
        },
        {
          title: "Confiance & préparation",
          body:
            "Routine, objectifs réalistes, gestion de l’effort : comment éviter le vocabulaire creux et rester ancré dans des comportements mesurables.",
        },
        {
          title: "Psychologie du joueur",
          body:
            "Syndrome de l’imposteur, peur du résultat, comparaison sociale : des textes qui parlent aux joueurs de club comme aux compétiteurs sérieux.",
        },
      ],
    },
    en: {
      lede:
        "The game isn’t only played in variations: it’s also played in how you handle uncertainty, ego, fear of losing — sometimes fear of winning. This section digs into the competitive mindset with honest angles — performance anxiety, attentional discipline, emotion regulation — aiming for actionable ideas rather than slogans.",
      cards: [
        {
          title: "Pressure & emotions",
          body:
            "What spikes in time trouble, after a blunder, or when rating feels like identity: naming things to take away their drama.",
        },
        {
          title: "Confidence & preparation",
          body:
            "Routines, realistic goals, effort management: staying grounded in observable behaviours instead of hollow pep talk.",
        },
        {
          title: "Player psychology",
          body:
            "Impostor syndrome, outcome anxiety, social comparison — writing that speaks to club players and serious competitors alike.",
        },
      ],
    },
    de: {
      lede:
        "Das Spiel entscheidet sich nicht nur in Varianten, sondern auch im Umgang mit Ungewissheit, Ego, Verlustangst — manchmal sogar Siegesangst. Diese Rubrik geht den Wettkampfgeist ehrlich an: Leistungsangst, Aufmerksamkeitsdisziplin, Emotionsregulation — mit umsetzbaren Ideen statt Floskeln.",
      cards: [
        {
          title: "Druck & Emotionen",
          body:
            "Was in Zeitnot steigt, nach einem Patzer oder wenn die Wertung zur Identität wird: Benennen, um Entdramatisierung zu ermöglichen.",
        },
        {
          title: "Selbstvertrauen & Vorbereitung",
          body:
            "Routinen, realistische Ziele, Energiemanagement: bei messbarem Verhalten bleiben statt bei leeren Motivationssprüchen.",
        },
        {
          title: "Psychologie der Spieler",
          body:
            "Hochsteller-Syndrom, Ergebnisstress, Vergleich mit anderen — Texte für Vereinsspieler und ambitionierte Turnierspieler.",
        },
      ],
    },
  },

  societe: {
    fr: {
      lede:
        "Les échecs ne sont pas qu’un loisir : ils intersectent l’école, les médias, les institutions, les questions de genre, de diversité et de numérique. On y décrypte des enjeux réels — avec des sources, du contexte et une prise de distance — pour comprendre comment le jeu s’inscrit dans le monde tel qu’il est, pas tel qu’on le rêverait.",
      cards: [
        {
          title: "Éducation & médiation",
          body:
            "Initiations, clubs, programmes scolaires : ce qui aide vraiment à faire découvrir le jeu — au-delà des discours marketing.",
        },
        {
          title: "Culture & représentation",
          body:
            "Échecs au cinéma, sur les plateformes, dans l’imaginaire collectif : symboles, clichés et contre-récits utiles.",
        },
        {
          title: "Enjeux contemporains",
          body:
            "Plateformes en ligne, FIDE, communautés : lecture critique des dynamiques de pouvoir et des promesses technologiques.",
        },
      ],
    },
    en: {
      lede:
        "Chess isn’t only a hobby: it intersects schools, media, institutions, gender and diversity, and digital life. Here we unpack real-world stakes — with sources, context, and perspective — to see how the game sits in the world as it is, not only as we wish it were.",
      cards: [
        {
          title: "Education & outreach",
          body:
            "School programmes, clubs, beginners’ pathways: what actually helps people discover the game beyond marketing narratives.",
        },
        {
          title: "Culture & representation",
          body:
            "Chess on screen and in the collective imagination: symbols, clichés, and counter-stories worth telling.",
        },
        {
          title: "Contemporary issues",
          body:
            "Online platforms, federations, communities: a critical look at power dynamics and tech promises.",
        },
      ],
    },
    de: {
      lede:
        "Schach ist mehr als Hobby: Es kreuzt Schule, Medien, Institutionen, Fragen von Gender und Diversität sowie digitale Realitäten. Hier ordnen wir echte gesellschaftliche Spannungen ein — mit Quellen, Kontext und Distanz — um zu sehen, wie das Spiel in der Welt steht, wie sie ist, nicht nur wie wir sie uns wünschen.",
      cards: [
        {
          title: "Bildung & Vermittlung",
          body:
            "Schulprojekte, Vereine, Einstiege: Was Menschen wirklich zum Spiel bringt — jenseits von Marketinggeschichten.",
        },
        {
          title: "Kultur & Darstellung",
          body:
            "Schach auf der Leinwand und im kollektiven Bild: Symbole, Klischees und Gegenentwürfe.",
        },
        {
          title: "Zeitgenössische Fragen",
          body:
            "Online-Plattformen, Verbände, Communities: Machtstrukturen und Tech-Versprechen kritisch betrachtet.",
        },
      ],
    },
  },
};
