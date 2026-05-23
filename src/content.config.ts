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
    /** Jusqu’à 5 points "À retenir" affichés en bas d’article (composant KeyTakeaways).
       Sert aussi de script source pour les scènes vidéo Motion Canvas. */
    keyTakeaways: z.array(z.string()).max(5).optional(),
    /** Résumé vidéo produit par Motion Canvas (cf. motion-canvas/README.md).
       Chemin commençant par /, ex. "/videos/summary-echecs-et-memoire.mp4".
       Affiché sous le titre via ArticleVideo si le fichier existe. */
    summaryVideo: z.string().optional(),
    /** Note libre sous le lecteur (durée, statut "version 1 : perfectible", etc.). */
    summaryVideoNote: z.string().optional(),
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
    faq: z
      .array(
        z.object({
          question: z.string(),
          answer: z.string(),
        }),
      )
      .optional(),
  }),
});

/** Schéma partagé pour les collections de traductions (EN, DE…). */
const translationSchema = z.object({
  title: z.string(),
  excerpt: z.string(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  faq: z
    .array(
      z.object({
        question: z.string(),
        answer: z.string(),
      }),
    )
    .optional(),
});

/**
 * Traductions anglaises des articles FR.
 * Chaque fichier src/content/blog-translations/en/<slug>.md contient :
 *   - frontmatter : title, excerpt, seoTitle?, seoDescription?, faq?
 *   - body : corps de l’article en anglais (Markdown)
 * Le slug doit correspondre au slug du fichier FR dans la collection `blog`.
 */
const enTranslations = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog-translations/en" }),
  schema: translationSchema,
});

/**
 * Traductions allemandes des articles FR.
 * Même structure qu’enTranslations : le dossier est vide par défaut,
 * à peupler au fur et à mesure des traductions.
 */
const deTranslations = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog-translations/de" }),
  schema: translationSchema,
});

export const collections = { blog, enTranslations, deTranslations };

