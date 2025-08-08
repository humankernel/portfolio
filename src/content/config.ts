import { glob } from "astro/loaders";
import { defineCollection, z } from "astro:content";

const projects = defineCollection({
  loader: glob({ base: "./src/content/projects", pattern: "**/*.{md,mdx}" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      github: z.string(),
      image: image().optional(),
      stack: z.array(z.string()),
      pubDate: z.coerce.date(),
    }),
});

export const collections = { projects };
