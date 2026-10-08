import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Static output so the build can be published to GitHub Pages, exactly like the
// Jekyll site it replaces. URLs use the `directory` format (page -> /page/index.html)
// which reproduces Jekyll's trailing-slash permalinks.
export default defineConfig({
  site: 'https://htswe.github.io',
  output: 'static',
  trailingSlash: 'ignore',
  build: {
    format: 'directory',
  },
  integrations: [sitemap()],
});
