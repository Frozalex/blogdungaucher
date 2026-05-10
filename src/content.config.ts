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
    /** Jusqu’à 5 points pour la vidéo récap Remotion (séquence classique) et le sens « fin d’article ». */
    keyTakeaways: z.array(z.string()).max(5).optional(),
    /** URL ou chemin `/…` vers le MP4 hero (~36 s), affiché sous le titre. */
    introVideo: z.string().optional(),
    /** URL ou chemin `/…` vers le MP4 récap (~28 s export Remotion courant), affiché après le corps de l’article. */
    summaryVideo: z.string().optional(),
    /** Ratio du lecteur intro : 16:9 (paysage) ou 9:16 (vertical). */
    introVideoAspect: z.enum(["16:9", "9:16"]).optional(),
    /** Séquence Remotion pour la vidéo récap : classique (3–5 points) ou data-reveal (barres + synthèse). */
    summarySequence: z.enum(["classic", "data-reveal"]).optional(),
    /**
     * Données pour la séquence « data reveal » (récap ~55 s), ex. neuro / chiffres.
     * Requiert `summarySequence: data-reveal` pour le rendu Remotion correspondant.
     */
    dataReveal: z
      .object({
        vizTitle: z.string(),
        bars: z
          .array(
            z.object({
              label: z.string(),
              value: z.number(),
              max: z.number().positive(),
            }),
          )
          .min(1)
          .max(8),
        highlight: z.string(),
        highlightSub: z.string().optional(),
        source: z.string(),
        takeaway: z.string(),
        cta: z.string().optional(),
      })
      .optional(),
    /**
     * Vidéo « data reveal » milieu d’article (~20 s) : insérée juste après le H2 cible.
     * Utiliser avec `midArticleVideoHeadingSlug` (slug identique à l’ancre # du sommaire).
     */
    midArticleVideo: z.string().optional(),
    midArticleVideoAspect: z.enum(["16:9", "9:16"]).optional(),
    /** Slug GitHub du H2 après lequel placer la vidéo (voir lien # dans la table des matières). */
    midArticleVideoHeadingSlug: z.string().optional(),
    /** Libellé au-dessus du lecteur « données clés » (sinon texte par défaut selon la langue). */
    midArticleVideoEyebrow: z.string().optional(),
    /** Ratio du lecteur pour la vidéo récap (après conclusion). */
    summaryVideoAspect: z.enum(["16:9", "9:16"]).optional(),
    /**
     * Lecteur **Remotion** dans le navigateur (compositions React) : pas de MP4 requis.
     * Peut coexister avec `introVideo` (fichier) : Remotion est prioritaire si true.
     */
    remotionPlayerIntro: z.boolean().optional(),
    remotionPlayerMid: z.boolean().optional(),
    remotionPlayerSummary: z.boolean().optional(),
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
  }).superRefine((data, ctx) => {
    const wantsMid =
      !!(data.midArticleVideo?.trim()) || data.remotionPlayerMid === true;
    if (wantsMid && !data.midArticleVideoHeadingSlug?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "midArticleVideoHeadingSlug est obligatoire lorsque la vidéo milieu est activée (MP4 ou Remotion).",
        path: ["midArticleVideoHeadingSlug"],
      });
    }
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
        /** Une version ultra-simple (3-7 moments clés) si tu ne mets pas le PGN. */
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

