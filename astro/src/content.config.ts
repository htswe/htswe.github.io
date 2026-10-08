import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const posts = defineCollection({
  // Content Layer API: read the migrated markdown straight from disk.
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    slug: z.string().optional(),
    categories: z.array(z.string()).default([]),
    tags: z.array(z.string()).default([]),
    header: z
      .object({
        image: z.string().optional(),
      })
      .optional(),
    toc: z.boolean().optional(),
    toc_sticky: z.boolean().optional(),
  }),
});

export const collections = { posts };
