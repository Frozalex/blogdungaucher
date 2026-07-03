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
  /** Slug localisé utilisé dans l'URL EN (ex. "learning-to-lose-at-chess").
   *  Si absent, l'URL reprend le slug FR du fichier source. */
  enSlug: z.string().optional(),
  /** Slug FR de l'article source = clé de résolution traduction ↔ source FR.
   *  - Convention EN (héritée) : OMETTRE `frSlug` ; le NOM DE FICHIER = slug FR
   *    (résolution via `getEntry("enTranslations", frSlug)` et la dérivation par `e.id`).
   *  - Convention pt-BR / futures langues : NOM DE FICHIER = slug localisé (intention SEO),
   *    et `frSlug` porte le slug FR. La résolution lit `frSlug ?? <slug dérivé du nom de fichier>`. */
  frSlug: z.string().optional(),
  /** Tags localisés (optionnels) : si absents, aucun tag n'est affiché dans la langue
   *  traduite (on n'affiche pas les tags FR de la source pour éviter du français). */
  tags: z.array(z.string()).optional(),
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
 * Le slug du fichier MD est le slug localisé ; `frSlug` dans le frontmatter
 * pointe vers le slug FR source.
 */
const ptBrTranslations = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog-translations/pt-br" }),
  schema: translationSchema,
});

/**
 * Traductions néerlandaises (NL) des articles FR.
 * Convention identique à PT-BR : nom de fichier = slug NL localisé,
 * `frSlug` dans le frontmatter = slug FR source.
 * Lancement prévu le 1er septembre 2026.
 */
const nlTranslations = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog-translations/nl" }),
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

export const collections = { blog, enTranslations, ptBrTranslations, nlTranslations, dissertations };

