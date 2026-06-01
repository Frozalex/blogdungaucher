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

/** Schéma partagé pour les collections de traductions (EN, DE…).
 *  `draft: true` masque la traduction (fallback vers le contenu FR + bandeau),
 *  ce qui permet de préparer plusieurs traductions à l'avance et de les
 *  publier en bascule en passant `draft: false` ou en retirant la clé. */
const translationSchema = z.object({
  title: z.string(),
  excerpt: z.string(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  draft: z.boolean().default(false),
  /** Slug localisé utilisé dans l'URL (ex. "learning-to-lose-at-chess").
   *  Si absent, l'URL reprend le slug FR du fichier source.
   *  Le nom du fichier MD doit toujours correspondre au slug FR pour la résolution
   *  de la traduction depuis la page (`getEntry("enTranslations", frSlug)`). */
  enSlug: z.string().optional(),
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
 * Traductions portugais brésilien (pt-BR) des articles FR.
 * Architecture prête mais non exposée sur le site : aucune page `/pt-br/`
 * n'est servie pour l'instant. À activer en créant `src/pages/pt-br/`
 * et en réintégrant la langue dans BaseLayout / sitemap / navbar.
 * Le slug du fichier MD doit correspondre au slug FR.
 */
const ptBrTranslations = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog-translations/pt-br" }),
  schema: translationSchema,
});

const dissertations = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/dissertations" }),
  schema: z.object({
    title: z.string(),
    excerpt: z.string(),
    publishDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    author: z.string().default("Le Gaucher"),
    readingTime: z.string().optional(),
    tags: z.array(z.string()).optional(),
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
    ogImage: z.string().optional(),
  }),
});

export const collections = { blog, enTranslations, ptBrTranslations, dissertations };

