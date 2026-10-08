import { defineConfig } from 'astro/config'

// UnoCSS integration
import unocss from '@unocss/astro'
// Sitemap generation (https://docs.astro.build/en/guides/integrations-guide/sitemap)
import sitemap from '@astrojs/sitemap'
import { unified } from '@astrojs/markdown-remark'
// KaTeX math rendering: $...$ / $$...$$ in Markdown
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'

// Shiki code-block pipeline (ported from astro-theme-pure)
import {
  addCollapse,
  addCopyButton,
  addLanguage,
  addTitle,
  updateStyle
} from './src/plugins/shiki-custom-transformers.ts'
import {
  transformerNotationDiff,
  transformerNotationHighlight,
  transformerRemoveNotationEscape
} from './src/plugins/shiki-official/transformers.ts'
// Lazy-load Markdown images
import rehypeImageAttributes from './src/plugins/rehype-image-attributes.ts'
import rehypeContentFeatures from './src/plugins/rehype-content-features.ts'

// Sub-path base, used when deployed under a project Pages URL.
const base = process.env.BASE_PATH || ''

// Old Jekyll URLs that have no direct equivalent in the theme: redirect them so
// inbound links keep working. Pagination moved from /pageN/ to /blog/N/.
const legacyRedirects = {
  '/posts': '/archives',
  '/categories': '/tags',
  '/feed.xml': '/rss.xml',
  ...Object.fromEntries(Array.from({ length: 20 }, (_, i) => [`/page${i + 2}`, `/blog/${i + 2}`]))
}

// https://astro.build/config
export default defineConfig({
  // User site on GitHub Pages -> served from the domain root.
  site: process.env.SITE_URL || 'https://htswe.github.io',

  base: base || undefined,

  output: 'static',

  compressHTML: true,

  prefetch: { prefetchAll: true, defaultStrategy: 'hover' },

  redirects: legacyRedirects,

  markdown: {
    processor: unified({
      remarkPlugins: [remarkMath],
      rehypePlugins: [rehypeImageAttributes, rehypeKatex, rehypeContentFeatures]
    }),
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark'
      },
      transformers: [
        // @ts-ignore — multiple copies of @shikijs/types can confuse TS
        transformerNotationDiff(),
        // @ts-ignore
        transformerNotationHighlight(),
        // @ts-ignore
        transformerRemoveNotationEscape(),
        // @ts-ignore
        updateStyle(),
        // @ts-ignore
        addTitle(),
        // @ts-ignore
        addLanguage(),
        // @ts-ignore
        addCopyButton(2000, base),
        // @ts-ignore
        addCollapse(15, base)
      ]
    }
  },

  integrations: [unocss(), sitemap()]
})
