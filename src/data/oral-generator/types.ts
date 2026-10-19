export type SpecialtyId =
  | "maths" | "nsi" | "physique" | "svt" | "si" | "ses" | "hggsp"
  | "hlp" | "llcer" | "llca" | "arts" | "biologie" | "eppcs"
  | "stmg" | "sti2d" | "st2s" | "stl" | "std2a" | "sthr" | "s2tmd" | "stav";

export interface OralPart {
  title: string;
  points: [string, string];
}

export interface OralVariant {
  angle: string;
  question: string;
  /** Phrase complète annonçant le cheminement, après l'accroche et la question. */
  approach: string;
  parts: [OralPart, OralPart, OralPart];
  answer: string;
  opening: string;
}

export interface OralTopic {
  id: string;
  title: string;
  specialties: SpecialtyId[];
  themes: string[];
  keywords: string[];
  notions: string[];
  hook: string;
  personalize: string;
  /** Liens complémentaires du site, ajoutés seulement s'ils sont publiés au build. */
  articles?: string[];
  variants: [OralVariant, OralVariant];
}

export const specialties: { id: SpecialtyId; label: string; short: string; track: "general" | "techno" }[] = [
  { id: "maths", label: "Mathématiques", short: "Maths", track: "general" },
  { id: "nsi", label: "Numérique et sciences informatiques", short: "NSI", track: "general" },
  { id: "physique", label: "Physique-chimie", short: "Physique-chimie", track: "general" },
  { id: "svt", label: "Sciences de la vie et de la Terre", short: "SVT", track: "general" },
  { id: "si", label: "Sciences de l’ingénieur", short: "SI", track: "general" },
  { id: "ses", label: "Sciences économiques et sociales", short: "SES", track: "general" },
  { id: "hggsp", label: "Histoire-géographie, géopolitique et sciences politiques", short: "HGGSP", track: "general" },
  { id: "hlp", label: "Humanités, littérature et philosophie", short: "HLP", track: "general" },
  { id: "llcer", label: "Langues, littératures et cultures étrangères et régionales", short: "LLCER", track: "general" },
  { id: "llca", label: "Littérature et langues et cultures de l’Antiquité", short: "LLCA", track: "general" },
  { id: "arts", label: "Arts — toutes disciplines", short: "Arts", track: "general" },
  { id: "biologie", label: "Biologie-écologie", short: "Biologie-écologie", track: "general" },
  { id: "eppcs", label: "Éducation physique, pratiques et culture sportives", short: "EPPCS", track: "general" },
  { id: "stmg", label: "STMG — management et gestion", short: "STMG", track: "techno" },
  { id: "sti2d", label: "STI2D — industrie et développement durable", short: "STI2D", track: "techno" },
  { id: "st2s", label: "ST2S — santé et social", short: "ST2S", track: "techno" },
  { id: "stl", label: "STL — laboratoire", short: "STL", track: "techno" },
  { id: "std2a", label: "STD2A — design et arts appliqués", short: "STD2A", track: "techno" },
  { id: "sthr", label: "STHR — hôtellerie et restauration", short: "STHR", track: "techno" },
  { id: "s2tmd", label: "S2TMD — théâtre, musique et danse", short: "S2TMD", track: "techno" },
  { id: "stav", label: "STAV — agronomie et vivant (oral terminal)", short: "STAV", track: "techno" },
];

// Sources institutionnelles ouvertes le 19 octobre 2026. Elles cadrent les
// spécialités et la préparation ; les pistes du catalogue sont des propositions
// éditoriales, pas des sujets officiellement approuvés ni des études scientifiques.
export const officialResources = [
  { label: "Le Grand oral : préparation et déroulement", url: "https://www.education.gouv.fr/reussir-au-lycee/baccalaureat-comment-se-passe-le-grand-oral-100028" },
  { label: "Programmes des spécialités générales et technologiques", url: "https://www.education.gouv.fr/reussir-au-lycee/les-programmes-du-lycee-general-et-technologique-9812" },
  { label: "Spécialités générales et séries technologiques", url: "https://www.education.gouv.fr/l-orientation-en-seconde-generale-et-technologique-307392" },
  { label: "STAV : référentiel et modalités de l’oral terminal", url: "https://chlorofil.fr/diplomes/secondaire/bac-techno" },
];

export const part = (title: string, a: string, b: string): OralPart => ({ title, points: [a, b] });
