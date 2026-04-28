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
  }),
});

export const collections = { blog };

