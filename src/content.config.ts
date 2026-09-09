import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const heroAction = z.object({
  text: z.string(),
  link: z.string(),
  variant: z.enum(["primary", "secondary"]).default("primary"),
});

const docs = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/docs" }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    template: z.enum(["doc", "splash"]).default("doc"),
    tableOfContents: z.boolean().default(true),
    prev: z.union([z.boolean(), z.string()]).default(true),
    next: z.union([z.boolean(), z.string()]).default(true),
    draft: z.boolean().default(false),
    hero: z
      .object({
        tagline: z.string().optional(),
        image: z.object({ html: z.string() }).optional(),
        actions: z.array(heroAction).default([]),
      })
      .optional(),
    sidebar: z
      .object({
        label: z.string().optional(),
        order: z.number().optional(),
        hidden: z.boolean().default(false),
      })
      .default({}),
  }),
});

export const collections = { docs };
