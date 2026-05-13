import type { CategorySlug } from "./site";

/** Contenus pilier pour Science / Esprit / Société : développement éditorial ~600 mots en FR par rubrique. */
export type CategoryLandingRich = {
  /** Blocs de texte avec titre intermédiaire pour la lisibilité à l’écran. */
  sections: Array<{ title: string; paragraphs: string[] }>;
  /** Trois angles courts en complément, cartes sous le texte. */
  cards: Array<{ title: string; body: string }>;
};

export const categoryLandingRich: Partial<
  Record<CategorySlug, Record<"fr" | "en" | "de", CategoryLandingRich>>
> = {
  science: {
    fr: {
      sections: [
        {
          title: "Pourquoi la science du jeu intéresse au-delà du club",
          paragraphs: [
            "Les échecs ne sont pas une « intelligence générale » mystérieuse : ils sont un environnement où se croisent mémoire, perception, calcul et décision sous contrainte. Les laboratoires s’en sont servis depuis des décennies comme terrain d’étude, du chunking de De Groot aux travaux récents en neuroimagerie. Pour le joueur, l’enjeu n’est pas de réciter des noms d’aires cérébrales, mais de comprendre quelles capacités sont réellement entraînées, et lesquelles sont souvent surestimées dans le récit populaire.",
            "Cette rubrique part d’un principe simple : séparer ce qui est solidement documenté de ce qui relève du mythe ou de la surinterprétation. Une étude bien menée peut être modeste dans ses conclusions et pourtant précieuse ; une anecdote spectaculaire peut être sans portée statistique. Notre filtre est celui de la méthode : échantillon, tâche utilisée, mesures, limites. Tu y trouveras des synthèses qui parlent à ta pratique : mémoire des motifs, charge cognitive, gestion du temps, fatigue décisionnelle.",
          ],
        },
        {
          title: "Mémoire, expertise et illusions de transfert",
          paragraphs: [
            "Les joueurs forts ne « retiennent » pas davantage de pièces au hasard : ils structurent la position en motifs familiers dits chunks, ce qui transforme une carte chaotique en objets mentaux manipulables. C’est pourquoi les démonstrations classiques, position réelle contre pièces mélangées, font exploser l’écart entre experts et novices : ce n’est pas une mémoire brute supérieure, c’est une organisation du savoir.",
            "Du même coup, le transfert automatique vers des compétences hors échiquier reste souvent faible ou étroit : savoir calculer des variantes ne te rend pas automatiquement champion en maths ou en planification de vie. Les méta-analyses du champ insistent sur cet écueil : au lieu de promesses magiques, nous regardons ce qui transite réellement : habitudes attentionnelles, gestion de l’erreur, discipline d’analyse, et ce qui reste spécifique au jeu.",
          ],
        },
        {
          title: "Cerveau mesurable, résultats nuancés",
          paragraphs: [
            "L’imagerie et les suivis longitudinaux ont enrichi notre compréhension des corrélats neuronaux de l’expertise, mais elles n’écrasent pas la diversité individuelle. Différences structurales ou fonctionnelles observées ne sont pas des jugements de valeur ; souvent, elles reflètent des années de pratique intense encadrée par un environnement social précis. Notre rôle, ici, est de traduire ces résultats en questions utiles : qu’est-ce qu’on entraîne vraiment quand on répète des tactiques, des finales, des modèles d’ouverture ? Où se situe le plafond d’une séance, et comment éviter de confondre fatigue, anxiété et baisse « cognitive » ?",
            "Enfin, la science n’annule pas la singularité de ton parcours : elle donne des cadres pour mieux décider où investir ton temps. Tu trouveras dans les articles des références vérifiables, des chiffres lorsque les études les donnent, et des angles critiques lorsque la littérature diverge. Nous préférons une vérité nuancée à une promesse confortable.",
          ],
        },
        {
          title: "Comment lire cette rubrique au quotidien",
          paragraphs: [
            "Tu peux aborder ces textes comme une boîte à outils : si tu veux optimiser ton training, commence par ce qui concerne l’attention et la mémoire opérationnelle ; si tu navigues entre surcharge et impression de stagnation, pars des travaux sur la charge cognitive et la régulation de l’effort. Revient régulièrement aux sources citées : la recherche avance, nos synthèses aussi.",
            "L’objectif reste le même : faire du jeu un lieu où la curiosité intellectuelle rencontre des standards rigoureux, sans transformer les études en autorité morale ni les joueurs en cobayes d’un récit simpliste. Bonne lecture : rigueur d’esprit, humilité de résultat, et toujours un coup suivant à jouer.",
          ],
        },
      ],
      cards: [
        {
          title: "Cognition & mémoire",
          body:
            "Chunks, perception rapide, organisation du savoir : ce qui rend la vision tactique plus « fluide », sans confusion avec un don mystérieux.",
        },
        {
          title: "Décision sous contrainte",
          body:
            "Zeitnot, pression, erreurs systémiques : pourquoi ton jugement vacille à la fin du temps, et comment structurer des protocoles réalistes.",
        },
        {
          title: "Mesure & limites",
          body:
            "IRM, cohortes, méta-analyses : comment lire une étude sans tout projeter sur ta prochaine partie, mais sans jeter le bébé avec l’eau du bain.",
        },
      ],
    },
    en: {
      sections: [
        {
          title: "Why game science matters beyond the club room",
          paragraphs: [
            "Chess is not a vague ‘general intelligence’ test: it couples memory, perception, calculation, and decision-making under constraints. Labs have used it for decades, from de Groot’s pioneering work to modern neuroimaging. The practical question for you isn’t whether your fusiform gyrus lights up on a slide; it’s which capacities you truly train, and which claims in popular discourse wildly overshoot the evidence.",
            "This section separates robust findings from neuromyth and hype. A modest but careful study can matter more than a viral anecdote. Our lens is methodological: sample, task, measures, limitations. You’ll find summaries tied to practice: chunking, cognitive load, time pressure, decision fatigue, explained without pretending neuroscience hands out guaranteed rating gains.",
          ],
        },
        {
          title: "Expertise, memory, and the limits of transfer",
          paragraphs: [
            "Strong players don’t remember random piece soups better than weaker players; they recognize meaningful chunks that collapse dozens of details into a few mental objects. Classic demonstrations, real games versus shuffled positions, aren’t magic tricks; they reveal structured long-term memory at work.",
            "Automatic spill-over to non-chess life is often narrow or weak: calculating variants doesn’t silently turn you into a planning superhero outside the board. Meta-analytic work in the field warns precisely against that fantasy. We focus on what plausibly transfers: attentional habits, error management, discipline of analysis, and what remains domain-specific.",
          ],
        },
        {
          title: "Brains in the data, results in context",
          paragraphs: [
            "Imaging and longitudinal research enrich our map of expertise-related brain features, but they don’t erase individual differences. Correlational structure doesn’t mean destiny; it often tracks years of intense practice within a specific social context. We translate results into training questions: what are you really rehearsing with tactics, endgames, and opening models? When does a session stop being productive, and when is it anxiety or fatigue masquerading as a ‘cognitive’ slump?",
            "Science won’t replace your path; it offers frames to invest your time more honestly. Articles highlight verifiable sources, numbers when studies provide them, and critical angles when the literature disagrees. We prefer nuanced truth to comfortable promises.",
          ],
        },
        {
          title: "How to use this section week to week",
          paragraphs: [
            "Treat it as a toolkit. If you want to train smarter, start with attention and working memory; if you feel stuck or overloaded, read the pieces on load and effort regulation. Revisit cited sources; research moves, and so will our synthesis.",
            "The through-line is simple: keep intellectual curiosity, demand methodological rigor, and remember the next move is still yours to play, on the board, and in how you interpret the evidence.",
          ],
        },
      ],
      cards: [
        {
          title: "Cognition & memory",
          body:
            "Chunks, rapid pattern recognition, organized knowledge: why expertise feels ‘fluid’ without invoking mystical talent.",
        },
        {
          title: "Decision-making under pressure",
          body:
            "Time trouble, tilt-adjacent slips, systematic errors late in games: how to design protocols that survive reality.",
        },
        {
          title: "Measurement & humility",
          body:
            "MRI, cohorts, meta-analyses: reading studies without pretending your next round was predicted on page four.",
        },
      ],
    },
    de: {
      sections: [
        {
          title: "Warum Spielwissenschaft mehr ist als Vereinskultur",
          paragraphs: [
            "Schach ist kein vager Intelligenztest: Es verbindet Gedächtnis, Wahrnehmung, Rechnen und Entscheiden unter Bedingungen. Die Forschung nutzt das Spielfeld seit Jahrzehnten, von de Groot bis zu aktuellen bildgebenden Verfahren. Für dich zählt weniger, welche Hirnregion auf einem Scan „aufleuchtet“, sondern welche Fähigkeiten du wirklich trainierst und welche populären Geschichten die Daten nicht tragen.",
            "In dieser Rubrik trennen wir robuste Befunde von Neuromythen und PR-Narrativen. Eine kleine, sauber gemachte Studie kann wichtiger sein als eine spektakuläre Anekdote. Wir lesen methodisch: Stichprobe, Aufgabe, Messung, Grenzen. Du findest Zusammenfassungen mit Bezug zur Praxis: Chunking, kognitive Last, Zeitnot, Entscheidungsmüdigkeit : ohne Neuro-Wundertäterei.",
          ],
        },
        {
          title: "Expertise, Gedächtnis und Transferillusionen",
          paragraphs: [
            "Starke Spieler merken sich keine zufälligen Figurenhaufen besser; sie erkennen Bedeutungsmuster und verdichten Information zu wenigen mentalen Objekten. Klassische Demonstrationen, echte Stellung gegen durchgemischte Figuren, sind keine Tricks; sie zeigen strukturiertes Langzeitwissen.",
            "Automatischer Transfer ins Leben außerhalb des Bretts bleibt oft eng oder schwach: Variantenrechnen macht dich nicht automatisch zum Planungsgenie. Metaanalysen warnen genau vor dieser Fantasie. Wir fragen, was plausibel übergeht: Aufmerksamkeitsgewohnheiten, Umgang mit Fehlern, Analysehygiene, und was feldspezifisch bleibt.",
          ],
        },
        {
          title: "Messbare Gehirne, vermessene Aussagen",
          paragraphs: [
            "Bildgebung und Längsschnitte bereichern das Bild von Expertise : ohne Individualität auszulöschen. Korrelation ist nicht Schicksal; oft spiegelt sie intensiven Übungsweg und Kontext wider. Wir übersetzen Ergebnisse in Trainingsfragen: Was übst du beim Taktiklösen, Endspieltraining, Eröffnungsmodellen wirklich? Wo endet der Nutzen einer Session, und wann sind Stress oder Müdigkeit als „kognitive“ Schwäche getarnt?",
            "Wissenschaft ersetzt keine Biografie; sie liefert Raster für klügere Zeitinvestition. Texte nennen überprüfbare Quellen, Zahlen wo möglich, kritische Kanten bei Dissens. Nuancierte Wahrheit schlägt Marketingversprechen.",
          ],
        },
        {
          title: "So kannst du diese Rubrik nutzen",
          paragraphs: [
            "Sieh sie als Werkzeugkasten. Für effizienteres Training starte bei Aufmerksamkeit und Arbeitsgedächtnis; bei Überlast oder Stockungen lies zu Last und Energiemanagement. Geh zu den Primärquellen zurück : Forschung bewegt sich, unsere Synthesen auch.",
            "Der rote Faden: Neugier ohne Naivität, methodische Strenge ohne Menschen zu Versuchskaninchen zu machen; und immer noch einen nächlichen Zug zu spielen.",
          ],
        },
      ],
      cards: [
        {
          title: "Kognition & Gedächtnis",
          body:
            "Chunks, schnelle Mustererkennung, organisiertes Wissen : Expertise wirkt „flüssig“, ohne mystisches Talent.",
        },
        {
          title: "Entscheidung unter Druck",
          body:
            "Zeitnot, typische Spätfehler, emotionale Schärfe: wie du Routinen baust, die im Ernstfall halten.",
        },
        {
          title: "Messung & Demut",
          body:
            "Datensätze, Kohorten, Metaanalysen : Studien lesen, ohne die nächste Partie vorgezeichnet zu glauben.",
        },
      ],
    },
  },

  esprit: {
    fr: {
      sections: [
        {
          title: "La partie est aussi un événement psychologique",
          paragraphs: [
            "Tu peux maîtriser des lignes d’ouverture et des patterns tactiques, il restera une zone où les réglages du moteur ne suffisent pas : la relation au résultat, au temps, à l’image de soi devant l’adversaire. Le mental compétitif n’est pas une « motivation » décorative : c’est la façon dont tu encadres l’incertitude quand la mesure se fait en échecs et mat ou en abandon.",
            "Cette rubrique prend la psychologie au sérieux sans la caricaturer. Nous parlons de stress de performance, de régulation émotionnelle, de gestion de l’attention prolongée, avec des angles qui concernent le joueur de club autant que le candidat au titre. Pas de formules creuses : des cadres pour observer ce qui t’arrive pendant une partie, nommer ce qui se passe, puis ajuster avec des comportements répétables.",
          ],
        },
        {
          title: "Pression, erreur et récit que tu te racontes",
          paragraphs: [
            "Une erreur n’est pas qu’un coup faible : souvent, c’est le début d’un récit (« je suis nul », « ça recommence ») qui pirate tes décisions suivantes. Inversement, une bonne série peut déclencher une surexcitation qui te fait perdre la sobriété tactique. Savoir découpler le fait matériel, le blunder, de l’interprétation identitaire est une compétence : elle se travaille avec des protocoles simples : pause respiration, mini-checklist avant les coups critiques, journal de séances.",
            "La pression du classement transforme parfois un indicateur statistique en badge moral. Rappel utile : l’Elo est une estimation, pas une sentence. Quand tu lui donnes trop de place, tu joues pour protéger un nombre au lieu de jouer la position : une distorsion coûteuse que nous explorons sans complaisance.",
          ],
        },
        {
          title: "Confiance, préparation et environnement social",
          paragraphs: [
            "La confiance ne se décrete pas : elle se nourrit de petites preuves accumulées : analyses réelles de parties, retours honnêtes, objectifs de séance mesurables. Nous traitons aussi le contexte : ambiance du club, rapport aux parties en ligne, violence ordinaire des commentaires anonymes, tout ce qui peut amplifier la menace du stéréotype ou la comparaison sociale.",
            "Tu trouveras des pistes pour structurer ta préparation mentale sans tomber dans la tarte à la crème du développement personnel : routines réalistes, gestion du sommeil et de la charge avant tournoi, manière de clôturer une défaite sans rumination. L’idée directrice : des comportements observables plutôt que des slogans.",
          ],
        },
        {
          title: "Pour digérer les lectures et les appliquer",
          paragraphs: [
            "Lis ces articles comme des carnets de terrain : repère une idée par semaine, teste-la sur un petit échantillon de parties, note ce qui change, ou pas. La psychologie du joueur progresse par itérations modestes, pas par illumination unique.",
            "Si un texte parle de toi sans te confortabiliser, tant mieux : le but est une lucidité utile, celle qui rend la défaite supportable et la victoire moins intoxiquante. À toi de régler ton tempo intérieur aussi sérieusement que tes variantes.",
          ],
        },
      ],
      cards: [
        {
          title: "Émotions & temps",
          body:
            "Zeitnot, après-blunder, pics d’adrénaline : cartographier tes séquences pour mieux les couper.",
        },
        {
          title: "Identité & résultat",
          body:
            "Sortir du piège « je suis mon classement » : retrouver des objectifs de processus mesurables.",
        },
        {
          title: "Social & comparaison",
          body:
            "Clubs, internet, pairs : comment le regard des autres module ta charge mentale, et comment la réduire.",
        },
      ],
    },
    en: {
      sections: [
        {
          title: "The game is also a psychological event",
          paragraphs: [
            "You can polish openings and tactics and still face a zone engines don’t repair: your relationship to outcome, clock pressure, and self-image across the board. Competitive mindset isn’t motivational wallpaper : it’s how you frame uncertainty when the score can be mate or resignation.",
            "This section takes psychology seriously without mystifying it. We discuss performance anxiety, emotion regulation, sustained attention, with angles relevant to club players and titled hopefuls alike. Few platitudes: frameworks to notice what happens during play, name it, then adjust with repeatable behaviors.",
          ],
        },
        {
          title: "Pressure, mistakes, and the story you spin",
          paragraphs: [
            "A mistake isn’t only a weak move; it often triggers a narrative (‘I’m hopeless’, ‘here we go again’) that hijacks later decisions. Conversely, a streak can intoxicate you into tactical sloppiness. Separating the material blunder from the identity story you tell about it is a skill, trained with simple protocols: breathing pauses, mini-checklists before critical moves, session journals.",
            "Rating pressure can turn a statistical estimate into a moral badge. Useful reminder: Elo approximates strength; it doesn’t sentence your worth. Over-identifying makes you protect a number instead of playing the position, a costly distortion we unpack bluntly.",
          ],
        },
        {
          title: "Confidence, prep, and social context",
          paragraphs: [
            "Confidence isn’t proclaimed; it accrues through evidence: honest game reviews, measurable session goals, tangible improvements. We also cover environment: club atmosphere, online toxicity, anonymous comments, forces that amplify stereotype threat or social comparison.",
            "Expect realistic routines rather than self-help fluff: sleep and workload before events, clean endings to losses without rumination. Observable behaviors beat slogans.",
          ],
        },
        {
          title: "How to read and apply",
          paragraphs: [
            "Treat articles like field notes: pick one idea weekly, test it on a handful of games, log what shifts, or doesn’t. Player psychology advances through modest iterations, not lightning bolts.",
            "If a piece uncomfortably describes you, good: the aim is useful lucidity that makes defeat survivable and wins less intoxicating. Tune your inner tempo as seriously as your analysis lines.",
          ],
        },
      ],
      cards: [
        {
          title: "Emotions & clock",
          body:
            "Time trouble, post-blunder spirals, adrenaline spikes : map sequences so you can interrupt them.",
        },
        {
          title: "Identity & outcome",
          body:
            "Escape ‘I am my rating’ traps : refocus on measurable process goals.",
        },
        {
          title: "Social noise",
          body:
            "Clubs, forums, peers : how outside gaze loads your mind and how to lighten it.",
        },
      ],
    },
    de: {
      sections: [
        {
          title: "Das Spiel ist auch ein psychologisches Ereignis",
          paragraphs: [
            "Du kannst Eröffnungen und Muster perfektionieren : und trotzdem ein Feld haben, das der Motor nicht repariert: Verhältnis zum Ergebnis, zur Uhr, zum Selbstbild gegenüber dem Gegner. Wettkampfmentalität ist keine Motivationsdekoration, sondern ein Rahmen für Ungewissheit, wenn das Ergebnis Matt oder Aufgabe heißt.",
            "Diese Rubrik nimmt Psychologie ernst ohne sie zu mystifizieren. Wir sprechen über Leistungsangst, Emotionsregulation, nachhaltige Aufmerksamkeit : für Vereinsspielerinnen ebenso wie für ambitionierte Turnierspieler. Wenig Floskeln: Beobachtungsraster, Benennung, dann kleine, wiederholbare Verhaltensänderungen.",
          ],
        },
        {
          title: "Druck, Fehler und die Geschichte danach",
          paragraphs: [
            "Ein Fehler ist nicht nur ein schwacher Zug : oft startet er eine Erzählung („ich tauge nicht“, „schon wieder“), die spätere Entscheidungen kapert. Umgekehrt kann eine Serie dich trunken machen und taktisch nachlässig werden. Materialfehler und Identitätsnarrativ zu trennen ist trainierbar: Atempausen, Mini-Checklisten vor kritischen Zügen, Session-Tagebuch.",
            "Ratingdruck verwandelt eine Schätzung manchmal in ein moralisches Etikett. Erinnerung: Elo ist ein Modell, kein Urteil über deinen Wert. Überidentifikation lässt dich eine Zahl schützen statt die Stellung zu spielen : ein teurer Effekt, den wir klar benennen.",
          ],
        },
        {
          title: "Vertrauen, Vorbereitung, sozialer Kontext",
          paragraphs: [
            "Vertrauen entsteht aus Belegen echter Arbeit: ehrliche Partieanalysen, messbare Trainingsziele, kleine Fortschritte. Wir behandeln auch Umfeld: Vereinsklima, Online-Toxizität, Vergleiche mit anderen : Kräfte, die Stereotypbedrohung oder sozialen Druck schüren.",
            "Statt Selbsthilfe-Kitsch: realistische Routinen, Schlaf und Belastung vor Events, sauberes Ende einer Niederlage ohne Grübeln. Verhalten zählt, nicht Parolen.",
          ],
        },
        {
          title: "Lesen und anwenden",
          paragraphs: [
            "Nutze die Texte wie Feldnotizen: eine Idee pro Woche, testen auf wenigen Partien, protokollieren was sich ändert. Psychologie wächst iterativ : nicht durch eine Erleuchtung.",
            "Wenn ein Artikel unbequem trifft, ist das gut: Es geht um nutzbare Klarheit : Niederlagen erträglicher, Siege weniger berauschend. Justiere dein inneres Tempo so sorgfältig wie deine Varianten.",
          ],
        },
      ],
      cards: [
        {
          title: "Emotion & Uhr",
          body:
            "Zeitnot, Patzer-Spiralen, Adrenalin : Sequenzen erkennen und unterbrechen.",
        },
        {
          title: "Identität & Ergebnis",
          body:
            "Aus der Falle „Ich bin meine Wertung“ : zurück zu messbaren Prozesszielen.",
        },
        {
          title: "Soziales Rauschen",
          body:
            "Verein, Foren, Vergleiche : wie Außenblicke Druck erzeugen und wie du ihn senkst.",
        },
      ],
    },
  },

  societe: {
    fr: {
      sections: [
        {
          title: "Les échecs dans le monde réel, pas seulement sur un écran",
          paragraphs: [
            "Le jeu occupe une place ambiguë dans la culture : parfois symbole de génie solitaire, parfois outil pédagogique miracle, souvent décor dans une série ou une affiche de club. Hors la mythologie, les échecs traversent des institutions : écoles, fédérations, médias, plateformes en ligne : avec des effets concrets sur qui peut apprendre, qui peut rester, qui peut aspirer au haut niveau.",
            "Cette rubrique suit une ligne simple : décrire les mécanismes sociaux avec des indices vérifiables : démographie FIDE, études sur participation et genre, analyses sociologiques du loisir compétitif, sans réduire les individus à des catégories ni transformer les joueurs en arguments politiques. On accepte la complexité : une même mesure peut être progressiste pour certains et problématique pour d’autres selon le contexte local.",
          ],
        },
        {
          title: "Éducation, médiation et promesses tenues ou non",
          paragraphs: [
            "Les programmes scolaires et les associations ont démontré que les échecs peuvent être une porte d’entrée vers la concentration et la coopération : lorsque l’encadrement est sérieux, lorsque les objectifs pédagogiques sont clairs, lorsque l’exclusion informelle, genre, classe sociale ou handicap, est traitée comme un risque opérationnel, pas comme une anecdote.",
            "Nous scrutons aussi les discours marketing (« les échecs rendent intelligent »), pour les replacer dans ce que la littérature peut ou ne peut pas soutenir. Le transfert scolaire existe parfois, souvent modeste, toujours dépendant du design : pas de miracle uniforme, mais des conditions identifiables pour que l’outil fonctionne.",
          ],
        },
        {
          title: "Représentations, médias et pouvoir symbolique",
          paragraphs: [
            "Du cinéma aux streams, l’image du joueur façonne des attentes : parfois inspirantes, parfois étouffantes. Qui est visible comme modèle ? Quelles histoires sont racontées sur les femmes, les jeunes des quartiers populaires, les pays périphériques du circuit international ? Les représentations ne sont pas qu’esthétique : elles orientent les budgets, les sponsors, l’accès aux clubs.",
            "Nous croisons ces questions avec des données lorsque c’est possible : audiences, chiffres de licences, politiques fédérales, et avec du terrain : ce que vivent les clubs du dimanche quand un média national « découvre » les échecs une saison puis les oublie la suivante.",
          ],
        },
        {
          title: "Lire cette rubrique avec un œil critique et civique",
          paragraphs: [
            "Tu peux utiliser ces textes pour alimenter des discussions honnêtes : en famille, à l’école, dans une association, sans transformer le jeu en baguette magique ni en champ de bataille culturel vide. Chaque article invite à distinguer faits, interprétations et injonctions morales.",
            "Si les échecs sont une passion pour toi, ils le sont aussi pour des millions d’autres sous des contraintes différentes des tiennes. Les regards croisés renforcent la décence collective du milieu, et la qualité du débat autour du jeu.",
          ],
        },
      ],
      cards: [
        {
          title: "École & clubs",
          body:
            "Publics, inclusion réelle, évaluation des programmes : au-delà des slogans « échecs à l’école ».",
        },
        {
          title: "Genre & démographie",
          body:
            "Participation, plafonds visibles : pourquoi les pyramides du haut niveau reflètent aussi la base.",
        },
        {
          title: "Numérique & gouvernance",
          body:
            "Plateformes, FIDE, communautés : où se prend la décision, et qui en paie le coût social.",
        },
      ],
    },
    en: {
      sections: [
        {
          title: "Chess in the real world, not only on a screen",
          paragraphs: [
            "The game sits awkwardly in culture : sometimes genius loner trope, sometimes miracle pedagogy, often set dressing in film or club posters. Beyond myth, chess crosses institutions : schools, federations, media, online platforms : shaping who can learn, who stays, who can aim high.",
            "This section tracks social mechanisms with verifiable cues : FIDE demographics, participation and gender research, sociology of competitive leisure : without reducing people to categories or turning players into political props. Complexity stays in frame: the same policy can read progressive or problematic depending on local context.",
          ],
        },
        {
          title: "Education, outreach, promises kept or broken",
          paragraphs: [
            "School programs and clubs show chess can open doors to focus and cooperation : when staffing is serious, pedagogical goals clear, and informal exclusion on grounds of gender, class, or disability is treated as operational risk, not anecdote.",
            "We also audit marketing claims : ‘chess makes you smarter’ : against what literature can sustain. Classroom transfer sometimes appears, often modest, always design-dependent: no uniform miracle, but identifiable conditions for tools to work.",
          ],
        },
        {
          title: "Representation, media, symbolic power",
          paragraphs: [
            "From cinema to streams, images of players shape expectations : inspiring or suffocating. Who is visible as a model? Which stories are told about women, young people from overlooked neighborhoods, peripheral chess nations? Representation isn’t aesthetics alone: it steers budgets, sponsors, club access.",
            "We combine these threads with data where possible : audiences, federation stats : and ground-level notes from weekend clubs when national media ‘discovers’ chess one season and forgets it the next.",
          ],
        },
        {
          title: "How to read this section critically",
          paragraphs: [
            "Use these pieces to fuel honest conversations : at school, home, in nonprofits : without turning chess into a magic wand or an empty culture war. Each article separates facts, interpretations, and moral claims.",
            "If chess is your passion, remember millions share it under different constraints from yours. Crossed perspectives strengthen the community’s decency : and the quality of debate around the game.",
          ],
        },
      ],
      cards: [
        {
          title: "Schools & clubs",
          body:
            "Who gets access, how inclusion is practiced, how programs are evaluated : beyond glossy brochures.",
        },
        {
          title: "Gender & demographics",
          body:
            "Participation facts and why elite pyramids mirror the base as much as raw talent.",
        },
        {
          title: "Digital & governance",
          body:
            "Platforms, federations, communities : where decisions happen and who bears social costs.",
        },
      ],
    },
    de: {
      sections: [
        {
          title: "Schach in der Welt jenseits des Monitors",
          paragraphs: [
            "Das Spiel hat eine ambigue Kulturrolle : mal Genie-Einsiedler-Mythos, mal Wunderpädagogik, oft Kulisse in Film oder Vereinsplakaten. Jenseits der Motive durchziehen Schach Institutionen : Schulen, Verbände, Medien, Online-Plattformen : und beeinflussen, wer lernen darf, wer bleibt, wer oben mitspielen kann.",
            "Wir ordnen soziale Mechanismen mit überprüfbaren Hinweisen ein : FIDE-Demografie, Forschung zu Beteiligung und Gender, Soziologie kompetitiver Freizeit : ohne Menschen auf Schubladen zu reduzieren und ohne Spieler zu Projektionsfiguren zu machen. Komplexität bleibt: dieselbe Maßnahme kann je Kontext völlig unterschiedlich wirken.",
          ],
        },
        {
          title: "Bildung, Outreach, Versprechen",
          paragraphs: [
            "Schulprojekte und Vereine zeigen: Schach kann Konzentration und Kooperation öffnen : wenn Betreuung ernst genommen wird, pädagogische Ziele klar sind und informelle Ausschlüsse wegen Geschlecht, sozialer Klasse oder Behinderung als Risiko behandelt werden, nicht als Randnotiz.",
            "Wir prüfen Marketing („Schach macht schlau“) gegentragfähige Literatur. Transfer in Schule existiert manchmal, oft bescheiden, immer abhängig vom Design : keine Universalmagie, aber erkennbare Bedingungen für wirksame Programme.",
          ],
        },
        {
          title: "Darstellung, Medien, symbolische Macht",
          paragraphs: [
            "Vom Kino zum Stream formen Spielerbilder Erwartungen : inspirierend oder erstickend. Wer ist sichtbar als Modell? Welche Geschichten werden über Frauen, über Kinder aus prekären Kontexten, über Randregionen der Weltelite erzählt? Darstellung ist nicht nur Ästhetik: Sie lenkt Budgets, Sponsoren, Vereinszugang.",
            "Wir kreuzen diese Fragen mit Daten : wenn möglich : und mit Alltagsnotizen aus Vereinen, wenn nationale Medien Schach eine Saison lang „entdecken“ und dann vergessen.",
          ],
        },
        {
          title: "Lesen mit kritischem Blick",
          paragraphs: [
            "Nutze die Texte für ehrliche Gespräche : in Schule, Familie, Verein : ohne Schach zur Wunderwaffe oder zur leeren Kulturkampf-Kulisse zu machen. Jeder Artikel trennt Fakten, Interpretation und moralische Appelle.",
            "Wenn Schach deine Leidenschaft ist, teilen Millionen sie unter anderen Rahmenbedingungen. Perspektivenvielfalt stärkt Anstand im Feld : und die Qualität der Debatte.",
          ],
        },
      ],
      cards: [
        {
          title: "Schule & Vereine",
          body:
            "Zugang, echte Inklusion, Evaluation : jenseits von Slogans.",
        },
        {
          title: "Gender & Demografie",
          body:
            "Teilnahmezahlen und warum Elitenpyramiden die Basis widerspiegeln.",
        },
        {
          title: "Digital & Governance",
          body:
            "Plattformen, FIDE, Communities : wo entschieden wird und wer zahlt.",
        },
      ],
    },
  },
};
