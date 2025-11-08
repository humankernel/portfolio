import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders"

const projects = defineCollection({
    loader: glob({ pattern: "**/*.{md,mdx}", base: "src/content/projects" }),
    schema: z.object({
        slug: z.string(),
        title: z.string().default('Untitled Project'),
        description: z.string().nullable().optional().default('No description provided'),
        tags: z.array(z.string()).nullable().optional(),
        tech: z.array(z.string()).nullable().optional(),
        date: z.coerce.date().default(() => new Date()),
        projectUrl: z.string().url().nullable().optional(),
        status: z.string().nullable().optional(),
        image: z.any().nullable().optional().transform((val) => {
            // Handle various Obsidian syntax formats
            if (Array.isArray(val)) {
                // Handle array format from [[...]] syntax - take first element
                return val[0] || null;
            }
            if (typeof val === 'string') {
                // Handle string format - return as-is
                return val;
            }
            return null;
        }),
        imageAlt: z.string().nullable().optional(),
        featured: z.boolean().optional(),
    })
})

export const collections = { projects }
