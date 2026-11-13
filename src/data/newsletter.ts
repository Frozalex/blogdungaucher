export type NewsletterLang = "fr" | "en" | "pt-br" | "nl";
export type NewsletterCategory = "science" | "esprit" | "societe" | "grand-oral";

// This copy is server-rendered; the legacy runtime dictionary must not replace it.
export const newsletterCopy = {
  fr: {
    title: "La lettre du Gaucher",
    promise: "Une idée expliquée, une position commentée et une lecture recommandée pour regarder les échecs autrement.",
    note: "En français, sans rythme imposé. Les nouveaux articles font aussi l’objet d’alertes distinctes. Désinscription en un clic.",
    sample: "Lire un exemple de la lettre",
    contexts: {
      science: "Prolonge la réflexion : une idée à comprendre, ses limites et une position pour la mettre à l’épreuve.",
      esprit: "Passe de la lecture à l’échiquier : une idée à travailler et une position à examiner par toi-même.",
      societe: "Continue à explorer ce que les échecs racontent, avec une idée expliquée et une lecture pour approfondir.",
      "grand-oral": "Nourris ta culture échiquéenne avec une idée, une position et une lecture. Les alertes ne couvrent pas les nouveaux guides Grand oral.",
    },
  },
  en: {
    title: "La lettre du Gaucher",
    promise: "One explained idea, one annotated position and one recommended read to explore chess from another angle.",
    note: "Written in French, with no fixed schedule. New articles also have separate publication alerts. Unsubscribe in one click.",
    sample: "Read a sample letter (French)",
    contexts: {
      science: "Explore an idea, its limits and a position that helps you examine it.",
      esprit: "Take an idea to the board and examine a position for yourself.",
      societe: "Keep exploring chess and society, with an idea explained and a reading recommendation.",
      "grand-oral": "Build your chess knowledge through ideas, positions and reading. Publication alerts do not cover new Grand oral guides.",
    },
  },
  "pt-br": {
    title: "La lettre du Gaucher",
    promise: "Uma ideia explicada, uma posição comentada e uma leitura recomendada para olhar o xadrez de outra forma.",
    note: "Em francês, sem frequência fixa. Novos artigos também têm alertas de publicação separados. Cancele com um clique.",
    sample: "Ler um exemplo da carta (francês)",
    contexts: {
      science: "Explore uma ideia, seus limites e uma posição para examiná-la.",
      esprit: "Leve uma ideia ao tabuleiro e examine uma posição por conta própria.",
      societe: "Continue explorando xadrez e sociedade, com uma ideia explicada e uma leitura para aprofundar.",
      "grand-oral": "Amplie sua cultura enxadrística com ideias, posições e leituras. Os alertas não incluem novos guias Grand oral.",
    },
  },
  nl: {
    title: "La lettre du Gaucher",
    promise: "Een uitgelegd idee, een besproken stelling en een leestip om anders naar schaken te kijken.",
    note: "In het Frans, zonder vast ritme. Nieuwe artikelen krijgen ook aparte meldingen. Afmelden kan met één klik.",
    sample: "Lees een voorbeeldbrief (Frans)",
    contexts: {
      science: "Verken een idee, de beperkingen ervan en een stelling om het te onderzoeken.",
      esprit: "Neem een idee mee naar het bord en onderzoek zelf een stelling.",
      societe: "Blijf schaken en de samenleving verkennen, met een uitgelegd idee en een leestip.",
      "grand-oral": "Verdiep je schaakkennis met ideeën, stellingen en leestips. Meldingen omvatten geen nieuwe Grand oral-gidsen.",
    },
  },
} as const;
