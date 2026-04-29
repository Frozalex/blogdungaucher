import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

import { categorySlugs } from "./data/site";

const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    excerpt: z.string(),
    publishDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    author: z.string().default("Le Gaucher"),
    category: z.enum(categorySlugs),
    featured: z.boolean().default(false),
    featuredRank: z.number().int().default(99),
    readingTime: z.string().optional(),
    pillar: z.string(),
    tags: z.array(z.string()).optional(),
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
    ogImage: z.string().optional(),
    /**
     * Image d’illustration (optionnelle) - privilégier Wikimedia Commons (domaine public / CC).
     * On affiche toujours le crédit + lien vers la source + la licence.
     */
    heroImage: z
      .object({
        src: z.string(),
        alt: z.string(),
        sourceUrl: z.string().optional(),
        credit: z.string().optional(),
        license: z.string().optional(),
      })
      .optional(),
    titleEn: z.string().optional(),
    excerptEn: z.string().optional(),
    seoTitleEn: z.string().optional(),
    seoDescriptionEn: z.string().optional(),
    faq: z
      .array(
        z.object({
          question: z.string(),
          answer: z.string(),
        }),
      )
      .optional(),
    faqEn: z
      .array(
        z.object({
          question: z.string(),
          answer: z.string(),
        }),
      )
      .optional(),
  }),
});

const players = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/players" }),
  schema: z.object({
    /** Titre final affiché : "Prénom Nom - Angle accrocheur" */
    title: z.string(),
    excerpt: z.string(),

    firstName: z.string(),
    lastName: z.string(),

    /** Dates (UTC) pour tri / affichage. */
    birthDate: z.coerce.date(),
    deathDate: z.coerce.date().optional(),

    /**
     * Date de publication (débloque l’affichage comme pour le blog).
     * Le workflow quotidien reconstruit le site : les fiches apparaissent quand
     * `publishDate` est passée.
     */
    publishDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),

    /** Jour/mois (MM-DD) utilisé pour l'automatisation “anniversaire”. */
    birthdayMonthDay: z
      .string()
      .regex(/^(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/),
    /** Certains joueurs ont une date incertaine (XIXe, sources divergentes). */
    birthdayIsCertain: z.boolean().default(true),

    /** Champs utiles pour la page pilier (filtres). */
    nationality: z.string(),
    era: z.enum([
      "ancien",
      "classique",
      "hypermoderne",
      "sovietique",
      "moderne",
      "contemporain",
    ]),
    style: z
      .array(
        z.enum([
          "attaquant",
          "positionnel",
          "defenseur",
          "tacticien",
          "strategue",
          "universel",
          "endgame",
          "ouvertures",
          "pragmatique",
        ]),
      )
      .default(["universel"]),

    /** Pour l’angle différenciant. */
    angleHook: z.string(),
    surprisingFact: z.string(),

    /** Pour la partie emblématique. */
    iconicGame: z
      .object({
        /** Titre simple: "Carlsen - Anand, Chennai 2013 (Partie 9)" */
        title: z.string(),
        /** PGN ou lien (si tu préfères stocker à part). */
        pgn: z.string().optional(),
        /** Une version ultra-simple (3–7 moments clés) si tu ne mets pas le PGN. */
        keyMoments: z.array(z.string()).optional(),
      })
      .optional(),

    /**
     * Photo d’illustration (optionnelle) - privilégier Wikimedia Commons (domaine public / CC).
     * Pour éviter tout problème, on affiche toujours le crédit + lien vers la source + la licence.
     */
    photo: z
      .object({
        /** URL absolue (ex: upload.wikimedia.org) ou chemin local (ex: /images/players/xxx.jpg). */
        src: z.string(),
        /** Texte alternatif descriptif (accessibilité). */
        alt: z.string(),
        /** Page source (ex: page File: sur Wikimedia Commons). */
        sourceUrl: z.string().optional(),
        /** Auteur / crédit à afficher (ex: "rorkhete"). */
        credit: z.string().optional(),
        /** Licence courte à afficher (ex: "Public domain", "CC BY-SA 4.0"). */
        license: z.string().optional(),
      })
      .optional(),

    /** Pour le SEO / partage. */
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
    ogImage: z.string().optional(),

    /** Pour une montée en charge propre (filtres libres). */
    tags: z.array(z.string()).optional(),
  }),
});

export const collections = { blog, players };

