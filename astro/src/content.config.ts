import { glob } from 'astro/loaders'
import { defineCollection } from 'astro:content'
import { z } from 'astro/zod'

function dedupeTags(tags: string[]) {
  const seen = new Set<string>()
  return tags
    .map((t) => t.trim().toLowerCase())
    .filter((t) => (t && !seen.has(t) ? (seen.add(t), true) : false))
}

const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    /** Post title */
    title: z.string().max(200),
    /** Short summary shown in lists and meta description (Jekyll excerpt) */
    description: z.string().max(300),
    /** Publication date, derived from the Jekyll filename */
    publishDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]).transform(dedupeTags),
    /**
     * Cover image. Jekyll stores these as remote URLs (`header.image`), so this
     * is a plain string rather than a local Astro `image()` asset.
     */
    heroImage: z
      .object({
        src: z.string(),
        alt: z.string().optional()
      })
      .optional(),
    /** Hidden from lists but still accessible by URL */
    draft: z.boolean().default(false),
    /** Per-post comment toggle */
    comment: z.boolean().default(true),
    /** Original Jekyll slug (case preserved) — used by the legacy URL route */
    slug: z.string().optional(),
    /** Original Jekyll primary category — used by the legacy URL route */
    category: z.string().optional(),
    /** Legacy Jekyll permalink, e.g. /tech/why-kotlin/ */
    permalink: z.string().optional()
  })
})

export const collections = { blog }
